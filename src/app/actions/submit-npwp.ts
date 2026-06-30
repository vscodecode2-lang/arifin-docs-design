"use server";

import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { generateOrderCode } from "@/lib/order-utils";
import { isRecentDuplicateSubmission, RATE_LIMIT_MESSAGE } from "@/lib/rate-limit";

export interface NpwpActionResult {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
  orderCode?: string;
}

const NpwpSchema = z.object({
  full_name:    z.string().min(3, "Nama sesuai KTP minimal 3 karakter").max(100),
  nik:          z.string().regex(/^\d{16}$/, "NIK harus 16 digit angka"),
  nomor_kk:     z.string().regex(/^\d{16}$/, "Nomor KK harus 16 digit angka"),
  email:        z.string().email("Format email tidak valid"),
  phone_number: z.string().regex(/^(\+62|62|0)8[1-9][0-9]{7,11}$/, "Format nomor WA tidak valid"),
  domicile:     z.string().min(3, "Alamat domisili wajib diisi").max(200),
  jenis_npwp:   z.enum(["baru","perubahan_data","aktivasi","freelancer_umkm","karyawan"], {
    error: "Jenis layanan NPWP wajib dipilih",
  }),
  // NPWP Baru
  status_pekerjaan: z.string().max(100).optional(),
  penghasilan:      z.string().max(100).optional(),
  jenis_usaha:      z.string().max(200).optional(),
  // Perubahan Data
  npwp_lama:        z.string().max(20).optional(),
  data_yang_diubah: z.string().max(500).optional(),
  // Aktivasi
  email_akun:       z.string().max(100).optional(),
  kendala_akun:     z.string().max(500).optional(),
  // Karyawan
  nama_perusahaan:  z.string().max(200).optional(),
  catatan:          z.string().max(500).optional(),
});

export async function submitNpwpAction(formData: FormData): Promise<NpwpActionResult> {
  const rawData = {
    full_name:        formData.get("full_name")        ?? undefined,
    nik:              formData.get("nik")              ?? undefined,
    nomor_kk:         formData.get("nomor_kk")         ?? undefined,
    email:            formData.get("email")            ?? undefined,
    phone_number:     formData.get("phone_number")     ?? undefined,
    domicile:         formData.get("domicile")         ?? undefined,
    jenis_npwp:       formData.get("jenis_npwp")       ?? undefined,
    status_pekerjaan: formData.get("status_pekerjaan") ?? undefined,
    penghasilan:      formData.get("penghasilan")      ?? undefined,
    jenis_usaha:      formData.get("jenis_usaha")      ?? undefined,
    npwp_lama:        formData.get("npwp_lama")        ?? undefined,
    data_yang_diubah: formData.get("data_yang_diubah") ?? undefined,
    email_akun:       formData.get("email_akun")       ?? undefined,
    kendala_akun:     formData.get("kendala_akun")     ?? undefined,
    nama_perusahaan:  formData.get("nama_perusahaan")  ?? undefined,
    catatan:          formData.get("catatan")          ?? undefined,
  };

  const parsed = NpwpSchema.safeParse(rawData);
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

  try {
    const supabase = await createServerSupabaseClient();
    const orderCode = generateOrderCode();

    if (await isRecentDuplicateSubmission(supabase, d.email)) {
      return { success: false, error: RATE_LIMIT_MESSAGE };
    }

    const { data: client, error: clientErr } = await supabase
      .from("clients")
      .insert({ full_name: s(d.full_name), email: d.email.toLowerCase().trim(), phone_number: d.phone_number.trim(), service_type: "NPWP", status: "pending", order_code: orderCode })
      .select("id").single();

    if (clientErr || !client) return { success: false, error: "Gagal menyimpan data." };

    const detail = {
      jenis_npwp: d.jenis_npwp,
      ...(d.jenis_npwp === "baru"             && { status_pekerjaan: s(d.status_pekerjaan), penghasilan: s(d.penghasilan), jenis_usaha: s(d.jenis_usaha) }),
      ...(d.jenis_npwp === "perubahan_data"   && { npwp_lama: s(d.npwp_lama), data_yang_diubah: s(d.data_yang_diubah) }),
      ...(d.jenis_npwp === "aktivasi"         && { email_akun: s(d.email_akun), kendala_akun: s(d.kendala_akun) }),
      ...(d.jenis_npwp === "freelancer_umkm"  && { jenis_usaha: s(d.jenis_usaha) }),
      ...(d.jenis_npwp === "karyawan"         && { nama_perusahaan: s(d.nama_perusahaan) }),
    };

    const { error: detailErr } = await supabase.from("npwp_submissions").insert({
      client_id: client.id, nik: d.nik, nomor_kk: d.nomor_kk,
      domicile: s(d.domicile), catatan: s(d.catatan) || null, detail,
    });

    if (detailErr) return { success: false, error: "Gagal menyimpan detail. Coba lagi." };
    return { success: true, orderCode };
  } catch { return { success: false, error: "Kesalahan server." }; }
}
