import { createClient } from "@supabase/supabase-js";

/**
 * Supabase client dengan SERVICE ROLE KEY — melewati Row Level Security (RLS).
 *
 * ⚠️ HANYA gunakan di Server Actions / Server Components untuk operasi
 * yang SENGAJA bersifat publik & read-only dengan akses sempit
 * (contoh: halaman invoice publik yang diakses lewat link WhatsApp
 * tanpa login, di mana ID invoice berfungsi sebagai "capability token").
 *
 * BUG YANG DIPERBAIKI:
 * Sebelumnya `getInvoiceById` memakai `createServerSupabaseClient()` (anon
 * key + cookie session). Karena halaman /invoice/[id] memang didesain bisa
 * dibuka tanpa login, `auth.getUser()` selalu null untuk pengunjung tsb —
 * jika RLS pada tabel `invoices`/`clients` mensyaratkan user terautentikasi,
 * query akan diblokir SELECT-nya dan pelanggan melihat "Invoice tidak
 * ditemukan" walau invoice-nya valid. Client ini sengaja melewati RLS HANYA
 * untuk lookup tunggal berbasis ID yang sudah dimiliki pengunjung.
 *
 * JANGAN gunakan client ini untuk operasi yang menerima input sembarangan
 * dari pengguna (mis. search/filter tanpa scoping), atau di Client Components.
 */
export function createAdminSupabaseClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY belum diset. Diperlukan untuk akses publik ke halaman invoice."
    );
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey,
    { auth: { persistSession: false } }
  );
}
