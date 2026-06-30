"use server";

import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { generateOrderCode } from "@/lib/order-utils";
import { isRecentDuplicateSubmission, RATE_LIMIT_MESSAGE } from "@/lib/rate-limit";

export interface DataEntryActionResult {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
  orderCode?: string;
}

const DataEntrySchema = z.object({
  full_name:      z.string().min(3, "Nama minimal 3 karakter").max(100),
  email:          z.string().email("Format email tidak valid"),
  phone_number:   z.string().regex(/^(\+62|62|0)8[1-9][0-9]{7,11}$/, "Format nomor WA tidak valid"),
  nama_project:   z.string().min(2, "Nama project wajib diisi").max(150),
  jenis_project:  z.enum(["convert_pdf","marketplace","web_research","database_entry","input_produk"], {
    error: "Jenis project wajib dipilih",
  }),
  jumlah_data:    z.string().min(1, "Estimasi jumlah data wajib diisi"),
  deadline:       z.string().min(1, "Deadline wajib diisi"),
  format_output:  z.string().min(2, "Format output wajib diisi").max(100),
  deskripsi:      z.string().min(10, "Deskripsi project minimal 10 karakter").max(2000),
  // Convert PDF
  jumlah_halaman: z.string().max(10).optional(),
  kualitas_scan:  z.string().max(100).optional(),
  // Marketplace
  platform:       z.string().max(100).optional(),
  jumlah_produk:  z.string().max(20).optional(),
  // Web Research
  sumber_website: z.string().max(500).optional(),
  kolom_data:     z.string().max(300).optional(),
  // Database Entry
  format_database:z.string().max(200).optional(),
  // Input Produk
  field_produk:   z.string().max(300).optional(),
  variasi_produk: z.string().max(200).optional(),
  catatan:        z.string().max(500).optional(),
});

export async function submitDataEntryAction(formData: FormData): Promise<DataEntryActionResult> {
  const rawData = {
    full_name:       formData.get("full_name")       ?? undefined,
    email:           formData.get("email")           ?? undefined,
    phone_number:    formData.get("phone_number")    ?? undefined,
    nama_project:    formData.get("nama_project")    ?? undefined,
    jenis_project:   formData.get("jenis_project")   ?? undefined,
    jumlah_data:     formData.get("jumlah_data")     ?? undefined,
    deadline:        formData.get("deadline")        ?? undefined,
    format_output:   formData.get("format_output")   ?? undefined,
    deskripsi:       formData.get("deskripsi")       ?? undefined,
    jumlah_halaman:  formData.get("jumlah_halaman")  ?? undefined,
    kualitas_scan:   formData.get("kualitas_scan")   ?? undefined,
    platform:        formData.get("platform")        ?? undefined,
    jumlah_produk:   formData.get("jumlah_produk")   ?? undefined,
    sumber_website:  formData.get("sumber_website")  ?? undefined,
    kolom_data:      formData.get("kolom_data")      ?? undefined,
    format_database: formData.get("format_database") ?? undefined,
    field_produk:    formData.get("field_produk")    ?? undefined,
    variasi_produk:  formData.get("variasi_produk")  ?? undefined,
    catatan:         formData.get("catatan")         ?? undefined,
  };

  const parsed = DataEntrySchema.safeParse(rawData);
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

    if (await isRecentDuplicateSubmission(supabase, d.email)) {
      return { success: false, error: RATE_LIMIT_MESSAGE };
    }

    const orderCode = generateOrderCode();
    const { data: client, error: clientErr } = await supabase
      .from("clients")
      .insert({ full_name: s(d.full_name), email: d.email.toLowerCase().trim(), phone_number: d.phone_number.trim(), service_type: "Data Entry", status: "pending", order_code: orderCode })
      .select("id").single();

    if (clientErr || !client) return { success: false, error: "Gagal menyimpan data." };

    const detail = {
      jenis_project: d.jenis_project,
      ...(d.jenis_project === "convert_pdf"     && { jumlah_halaman: s(d.jumlah_halaman), kualitas_scan: s(d.kualitas_scan) }),
      ...(d.jenis_project === "marketplace"     && { platform: s(d.platform), jumlah_produk: s(d.jumlah_produk) }),
      ...(d.jenis_project === "web_research"    && { sumber_website: s(d.sumber_website), kolom_data: s(d.kolom_data) }),
      ...(d.jenis_project === "database_entry"  && { format_database: s(d.format_database) }),
      ...(d.jenis_project === "input_produk"    && { field_produk: s(d.field_produk), variasi_produk: s(d.variasi_produk) }),
    };

    const { error: detailErr } = await supabase.from("data_entry_submissions").insert({
      client_id: client.id, nama_project: s(d.nama_project),
      jumlah_data: d.jumlah_data, deadline: d.deadline,
      format_output: s(d.format_output), deskripsi: s(d.deskripsi),
      catatan: s(d.catatan) || null, detail,
    });

    if (detailErr) return { success: false, error: "Gagal menyimpan detail. Coba lagi." };
    return { success: true, orderCode };
  } catch { return { success: false, error: "Kesalahan server." }; }
}
