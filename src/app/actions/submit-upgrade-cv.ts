"use server";

import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { createAdminSupabaseClient } from "@/lib/supabase-admin";
import { NameSchema, EmailSchema, PhoneSchema, sanitizeText } from "@/lib/validation/common";
import { generateOrderCode } from "@/lib/order-utils";
import { logger } from "@/lib/logger";
import { isRecentDuplicateSubmission, RATE_LIMIT_MESSAGE } from "@/lib/rate-limit";
import { generateWhatsAppLink } from "@/lib/utils";
import type { ActionResult } from "@/types/common";

// ─── Konstanta ────────────────────────────────────────────────────────────────

const MAX_CV_SIZE    = 10 * 1024 * 1024; // 10MB
const MAX_PHOTO_SIZE = 5 * 1024 * 1024;  // 5MB

const ALLOWED_CV_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const ALLOWED_PHOTO_TYPES = ["image/jpeg", "image/png", "image/jpg"];

// Signed URL berlaku 10 tahun — bucket privat, jadi URL ini yang disimpan
// di database sebagai "file_url" (bukan file publik langsung).
const SIGNED_URL_TTL_SECONDS = 60 * 60 * 24 * 365 * 10;

// ─── Skema Validasi ───────────────────────────────────────────────────────────
// Reuse dari @/lib/validation/common — JANGAN duplikasi regex di tempat lain.

const UpgradeCvFieldsSchema = z.object({
  full_name:    NameSchema,
  email:        EmailSchema,
  phone_number: PhoneSchema,
  notes:        z.string().max(1000).optional(),
});

// ─── Helper: Upload file ke Supabase Storage (bucket privat) ─────────────────

async function uploadToStorage(
  admin: ReturnType<typeof createAdminSupabaseClient>,
  file: File,
  orderCode: string,
  prefix: "cv" | "photo"
): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
  const path = `upgrade-cv/${orderCode}/${prefix}-${Date.now()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await admin.storage
    .from("client-uploads")
    .upload(path, buffer, { contentType: file.type, upsert: false });

  if (uploadError) {
    return { ok: false, error: uploadError.message };
  }

  const { data: signedData, error: signedError } = await admin.storage
    .from("client-uploads")
    .createSignedUrl(path, SIGNED_URL_TTL_SECONDS);

  if (signedError || !signedData) {
    return { ok: false, error: signedError?.message ?? "Gagal membuat signed URL" };
  }

  return { ok: true, url: signedData.signedUrl };
}

// ─── Server Action ────────────────────────────────────────────────────────────

export async function submitUpgradeCvAction(formData: FormData): Promise<ActionResult> {
  try {
    // ── 1. Validasi field teks (nama, email, no. WA) ──
    const parsed = UpgradeCvFieldsSchema.safeParse({
      full_name:    formData.get("full_name")    ?? undefined,
      email:        formData.get("email")        ?? undefined,
      phone_number: formData.get("phone_number") ?? undefined,
      notes:        formData.get("notes")        ?? undefined,
    });

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (field !== undefined && typeof field !== "symbol") {
          fieldErrors[String(field)] = issue.message;
        }
      });
      return { success: false, error: "Validasi gagal. Periksa kembali data Anda.", fieldErrors };
    }

    const data = parsed.data;

    // ── 2. Validasi file (CV wajib, foto opsional) ──
    const cvFile    = formData.get("cv_file");
    const photoFile = formData.get("photo");

    if (!(cvFile instanceof File) || cvFile.size === 0) {
      return {
        success: false,
        error: "CV lama wajib diunggah.",
        fieldErrors: { cv_file: "Upload CV lama wajib diisi." },
      };
    }
    if (cvFile.size > MAX_CV_SIZE) {
      return {
        success: false,
        error: "Ukuran file CV maksimal 10MB.",
        fieldErrors: { cv_file: "Ukuran file CV maksimal 10MB." },
      };
    }
    if (!ALLOWED_CV_TYPES.includes(cvFile.type)) {
      return {
        success: false,
        error: "Format file CV tidak didukung.",
        fieldErrors: { cv_file: "Gunakan file PDF, DOC, atau DOCX." },
      };
    }

    let validPhotoFile: File | null = null;
    if (photoFile instanceof File && photoFile.size > 0) {
      if (photoFile.size > MAX_PHOTO_SIZE) {
        return {
          success: false,
          error: "Ukuran foto maksimal 5MB.",
          fieldErrors: { photo_file: "Ukuran foto maksimal 5MB." },
        };
      }
      if (!ALLOWED_PHOTO_TYPES.includes(photoFile.type)) {
        return {
          success: false,
          error: "Format foto tidak didukung.",
          fieldErrors: { photo_file: "Gunakan file JPG atau PNG." },
        };
      }
      validPhotoFile = photoFile;
    }

    // ── 3. Throttling: tolak jika email yang sama baru submit ──
    const supabase = await createServerSupabaseClient();
    if (await isRecentDuplicateSubmission(supabase, data.email)) {
      return { success: false, error: RATE_LIMIT_MESSAGE };
    }

    const orderCode = generateOrderCode();

    // ── 4. Upload file ke Storage (pakai admin client — bucket privat) ──
    const admin = createAdminSupabaseClient();

    const cvUpload = await uploadToStorage(admin, cvFile, orderCode, "cv");
    if (!cvUpload.ok) {
      logger.error("Upgrade CV: gagal upload file CV", cvUpload.error);
      return { success: false, error: "Gagal mengunggah file CV. Silakan coba lagi." };
    }

    let photoUrl: string | null = null;
    if (validPhotoFile) {
      const photoUpload = await uploadToStorage(admin, validPhotoFile, orderCode, "photo");
      if (!photoUpload.ok) {
        logger.error("Upgrade CV: gagal upload foto", photoUpload.error);
        return { success: false, error: "Gagal mengunggah foto. Silakan coba lagi." };
      }
      photoUrl = photoUpload.url;
    }

    // ── 5. Insert ke tabel `clients` ──
    // service_type "Upgrade CV" dibuat sebagai bucket tersendiri (terpisah dari
    // "CV" milik form CV ATS lengkap) supaya data submission tidak tercampur.
    const { data: client, error: clientErr } = await supabase
      .from("clients")
      .insert({
        full_name:    sanitizeText(data.full_name),
        email:        data.email,
        phone_number: data.phone_number.trim(),
        service_type: "Upgrade CV",
        status:       "pending",
        order_code:   orderCode,
      })
      .select("id")
      .single();

    if (clientErr || !client) {
      logger.error("Upgrade CV: gagal insert clients", clientErr);
      return { success: false, error: "Gagal menyimpan data. Silakan coba lagi." };
    }

    // ── 6. Insert detail ke `upgrade_cv_submissions` ──
    const { error: detailErr } = await supabase.from("upgrade_cv_submissions").insert({
      client_id:   client.id,
      cv_file_url: cvUpload.url,
      photo_url:   photoUrl,
      notes:       sanitizeText(data.notes) || null,
    });

    if (detailErr) {
      logger.error("Upgrade CV: gagal insert upgrade_cv_submissions", detailErr);
      return { success: false, error: "Gagal menyimpan detail permintaan. Silakan coba lagi." };
    }

    const redirectUrl = generateWhatsAppLink(
      "Upgrade CV Lama",
      process.env.NEXT_PUBLIC_ADMIN_WHATSAPP ?? "6285801193410",
      orderCode
    );

    logger.info("Upgrade CV: order baru berhasil dibuat", { orderCode });
    return { success: true, orderCode, redirectUrl };
  } catch (err) {
    logger.error("Upgrade CV: kesalahan tak terduga", err);
    return { success: false, error: "Terjadi kesalahan server. Silakan coba lagi." };
  }
}
