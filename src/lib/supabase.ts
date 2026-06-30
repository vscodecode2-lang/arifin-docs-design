import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase client untuk digunakan di Client Components ("use client").
 * Menggunakan @supabase/ssr agar session cookie dikelola dengan benar
 * di lingkungan Next.js App Router.
 *
 * SECURITY: Hanya menggunakan NEXT_PUBLIC_ key (anon key).
 * Service Role Key TIDAK boleh ada di sini.
 *
 * BUGFIX (loop "Invalid Refresh Token: Refresh Token Not Found"):
 * Sebelumnya fungsi ini membuat instance GoTrueClient BARU setiap kali
 * dipanggil. Karena beberapa komponen memanggil createClient() langsung
 * di body komponen (re-create setiap render — termasuk setiap ketikan
 * di form login, setiap perubahan state dashboard, dsb), banyak instance
 * GoTrueClient hidup bersamaan di browser yang sama. Supabase merotasi
 * refresh token setiap kali salah satu instance berhasil refresh — begitu
 * itu terjadi, SEMUA instance lain yang masih memegang refresh token lama
 * gagal refresh dengan error ini, dan timer auto-refresh masing-masing
 * instance mengulang percobaan tanpa henti -> looping error tanpa akhir.
 *
 * Solusi: satu instance client (singleton) untuk seluruh browser tab,
 * sesuai rekomendasi resmi Supabase.
 */
let browserClient: SupabaseClient | undefined;

export function createClient() {
  if (!browserClient) {
    browserClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return browserClient;
}
