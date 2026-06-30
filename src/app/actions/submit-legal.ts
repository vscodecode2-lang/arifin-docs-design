"use server";

import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { generateOrderCode } from "@/lib/order-utils";
import { isRecentDuplicateSubmission, RATE_LIMIT_MESSAGE } from "@/lib/rate-limit";

export interface LegalActionResult {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
  orderCode?: string;
}

const LegalSchema = z.object({
  full_name:    z.string().min(3, "Nama minimal 3 karakter").max(100),
  email:        z.string().email("Format email tidak valid"),
  phone_number: z.string().regex(/^(\+62|62|0)8[1-9][0-9]{7,11}$/, "Format nomor WA tidak valid"),
  domicile:     z.string().min(3, "Domisili wajib diisi").max(100),
  jenis_surat:  z.enum(["surat_kuasa","surat_perjanjian","surat_pernyataan","lainnya"], {
    error: "Jenis surat wajib dipilih",
  }),
  tujuan_surat: z.string().min(10, "Jelaskan tujuan surat minimal 10 karakter").max(1000),
  // Surat Kuasa
  pemberi_kuasa:   z.string().max(200).optional(),
  penerima_kuasa:  z.string().max(200).optional(),
  isi_kuasa:       z.string().max(1000).optional(),
  // Surat Perjanjian
  pihak_pertama:   z.string().max(500).optional(),
  pihak_kedua:     z.string().max(500).optional(),
  isi_perjanjian:  z.string().max(2000).optional(),
  // Surat Pernyataan
  isi_pernyataan:  z.string().max(1000).optional(),
  // Lainnya
  custom_jenis:    z.string().max(100).optional(),
  custom_deskripsi:z.string().max(1000).optional(),
  // Shared
  catatan_khusus:  z.string().max(500).optional(),
});

export async function submitLegalAction(formData: FormData): Promise<LegalActionResult> {
  const rawData = {
    full_name:        formData.get("full_name")         ?? undefined,
    email:            formData.get("email")             ?? undefined,
    phone_number:     formData.get("phone_number")      ?? undefined,
    domicile:         formData.get("domicile")          ?? undefined,
    jenis_surat:      formData.get("jenis_surat")       ?? undefined,
    tujuan_surat:     formData.get("tujuan_surat")      ?? undefined,
    pemberi_kuasa:    formData.get("pemberi_kuasa")     ?? undefined,
    penerima_kuasa:   formData.get("penerima_kuasa")    ?? undefined,
    isi_kuasa:        formData.get("isi_kuasa")         ?? undefined,
    pihak_pertama:    formData.get("pihak_pertama")     ?? undefined,
    pihak_kedua:      formData.get("pihak_kedua")       ?? undefined,
    isi_perjanjian:   formData.get("isi_perjanjian")    ?? undefined,
    isi_pernyataan:   formData.get("isi_pernyataan")    ?? undefined,
    custom_jenis:     formData.get("custom_jenis")      ?? undefined,
    custom_deskripsi: formData.get("custom_deskripsi")  ?? undefined,
    catatan_khusus:   formData.get("catatan_khusus")    ?? undefined,
  };

  const parsed = LegalSchema.safeParse(rawData);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    parsed.error.issues.forEach(issue => {
      const f = issue.path[0];
      if (f !== undefined && typeof f !== "symbol") fieldErrors[String(f)] = issue.message;
    });
    return { success: false, error: "Validasi gagal. Periksa kembali data Anda.", fieldErrors };
  }

  const d   = parsed.data;
  const s   = (v?: string) => v?.replace(/[<>]/g, "").trim() ?? "";

  try {
    const supabase = await createServerSupabaseClient();
    const orderCode = generateOrderCode();

    if (await isRecentDuplicateSubmission(supabase, d.email)) {
      return { success: false, error: RATE_LIMIT_MESSAGE };
    }

    const { data: client, error: clientErr } = await supabase
      .from("clients")
      .insert({ full_name: s(d.full_name), email: d.email.toLowerCase().trim(), phone_number: d.phone_number.trim(), service_type: "Legal", status: "pending", order_code: orderCode })
      .select("id").single();

    if (clientErr || !client) return { success: false, error: "Gagal menyimpan data." };

    const detail = {
      jenis_surat: d.jenis_surat,
      ...(d.jenis_surat === "surat_kuasa"      && { pemberi_kuasa: s(d.pemberi_kuasa), penerima_kuasa: s(d.penerima_kuasa), isi_kuasa: s(d.isi_kuasa) }),
      ...(d.jenis_surat === "surat_perjanjian" && { pihak_pertama: s(d.pihak_pertama), pihak_kedua: s(d.pihak_kedua), isi_perjanjian: s(d.isi_perjanjian) }),
      ...(d.jenis_surat === "surat_pernyataan" && { isi_pernyataan: s(d.isi_pernyataan) }),
      ...(d.jenis_surat === "lainnya"          && { custom_jenis: s(d.custom_jenis), custom_deskripsi: s(d.custom_deskripsi) }),
    };

    const { error: detailErr } = await supabase.from("legal_submissions").insert({
      client_id: client.id, domicile: s(d.domicile), tujuan_surat: s(d.tujuan_surat),
      catatan_khusus: s(d.catatan_khusus) || null, detail,
    });

    if (detailErr) return { success: false, error: "Gagal menyimpan detail. Coba lagi." };
    return { success: true, orderCode };
  } catch { return { success: false, error: "Kesalahan server." }; }
}
