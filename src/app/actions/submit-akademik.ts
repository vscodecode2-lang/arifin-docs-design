"use server";

import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { generateOrderCode } from "@/lib/order-utils";
import { isRecentDuplicateSubmission, RATE_LIMIT_MESSAGE } from "@/lib/rate-limit";

export interface AkademikActionResult {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
  orderCode?: string;
}

const AkademikSchema = z.object({
  full_name:      z.string().min(3, "Nama minimal 3 karakter").max(100),
  email:          z.string().email("Format email tidak valid"),
  phone_number:   z.string().regex(/^(\+62|62|0)8[1-9][0-9]{7,11}$/, "Format nomor WA tidak valid"),
  nama_matkul:    z.string().min(2, "Nama mata kuliah wajib diisi").max(150),
  jenis_tugas:    z.enum(["coding","ppt","makalah","skripsi"], { error: "Jenis tugas wajib dipilih" }),
  deadline:       z.string().min(1, "Deadline wajib diisi"),
  deskripsi_tugas:z.string().min(10, "Deskripsi tugas minimal 10 karakter").max(2000),
  // Coding
  bahasa_pemrograman: z.string().max(100).optional(),
  framework:          z.string().max(100).optional(),
  tools_coding:       z.string().max(200).optional(),
  // PPT
  jumlah_slide:  z.string().max(10).optional(),
  style_desain:  z.string().max(100).optional(),
  // Makalah / Essay
  jumlah_halaman: z.string().max(10).optional(),
  format_referensi: z.string().max(100).optional(),
  // Skripsi
  bab_pengerjaan:  z.string().max(200).optional(),
  topik_penelitian:z.string().max(500).optional(),
  catatan:         z.string().max(500).optional(),
});

export async function submitAkademikAction(formData: FormData): Promise<AkademikActionResult> {
  const rawData = {
    full_name:           formData.get("full_name")           ?? undefined,
    email:               formData.get("email")               ?? undefined,
    phone_number:        formData.get("phone_number")        ?? undefined,
    nama_matkul:         formData.get("nama_matkul")         ?? undefined,
    jenis_tugas:         formData.get("jenis_tugas")         ?? undefined,
    deadline:            formData.get("deadline")            ?? undefined,
    deskripsi_tugas:     formData.get("deskripsi_tugas")     ?? undefined,
    bahasa_pemrograman:  formData.get("bahasa_pemrograman")  ?? undefined,
    framework:           formData.get("framework")           ?? undefined,
    tools_coding:        formData.get("tools_coding")        ?? undefined,
    jumlah_slide:        formData.get("jumlah_slide")        ?? undefined,
    style_desain:        formData.get("style_desain")        ?? undefined,
    jumlah_halaman:      formData.get("jumlah_halaman")      ?? undefined,
    format_referensi:    formData.get("format_referensi")    ?? undefined,
    bab_pengerjaan:      formData.get("bab_pengerjaan")      ?? undefined,
    topik_penelitian:    formData.get("topik_penelitian")    ?? undefined,
    catatan:             formData.get("catatan")             ?? undefined,
  };

  const parsed = AkademikSchema.safeParse(rawData);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    parsed.error.issues.forEach(issue => {
      const f = issue.path[0];
      if (f !== undefined && typeof f !== "symbol") fieldErrors[String(f)] = issue.message;
    });
    return { success: false, error: "Validasi gagal. Periksa kembali data Anda.", fieldErrors };
  }

  const d = parsed.data;
  const s = (v?: string) => v?.replace(/[<>]/g, "").trim() ?? "";

  // Cek deadline tidak di masa lalu
  const deadlineDate = new Date(d.deadline);
  if (deadlineDate < new Date()) {
    return { success: false, error: "Deadline tidak boleh di masa lalu.", fieldErrors: { deadline: "Deadline harus di masa mendatang" } };
  }

  try {
    const supabase = await createServerSupabaseClient();

    if (await isRecentDuplicateSubmission(supabase, d.email)) {
      return { success: false, error: RATE_LIMIT_MESSAGE };
    }

    const orderCode = generateOrderCode();
    const { data: client, error: clientErr } = await supabase
      .from("clients")
      .insert({ full_name: s(d.full_name), email: d.email.toLowerCase().trim(), phone_number: d.phone_number.trim(), service_type: "Akademik", status: "pending", order_code: orderCode })
      .select("id").single();

    if (clientErr || !client) return { success: false, error: "Gagal menyimpan data." };

    const detail = {
      jenis_tugas: d.jenis_tugas,
      ...(d.jenis_tugas === "coding"  && { bahasa_pemrograman: s(d.bahasa_pemrograman), framework: s(d.framework), tools_coding: s(d.tools_coding) }),
      ...(d.jenis_tugas === "ppt"     && { jumlah_slide: s(d.jumlah_slide), style_desain: s(d.style_desain) }),
      ...(d.jenis_tugas === "makalah" && { jumlah_halaman: s(d.jumlah_halaman), format_referensi: s(d.format_referensi) }),
      ...(d.jenis_tugas === "skripsi" && { bab_pengerjaan: s(d.bab_pengerjaan), topik_penelitian: s(d.topik_penelitian) }),
    };

    const { error: detailErr } = await supabase.from("akademik_submissions").insert({
      client_id: client.id, nama_matkul: s(d.nama_matkul),
      deadline: d.deadline, deskripsi_tugas: s(d.deskripsi_tugas),
      catatan: s(d.catatan) || null, detail,
    });

    if (detailErr) return { success: false, error: "Gagal menyimpan detail. Coba lagi." };
    return { success: true, orderCode };
  } catch { return { success: false, error: "Kesalahan server." }; }
}
