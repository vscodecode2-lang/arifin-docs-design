import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Supabase client untuk digunakan di Server Components, Server Actions,
 * dan Route Handlers. Membaca/menulis cookie session via next/headers.
 *
 * SECURITY: Fungsi ini berjalan di server — aman untuk operasi
 * yang memerlukan session validasi sebelum akses database.
 */
export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll dipanggil dari Server Component — bisa diabaikan
            // jika middleware sudah me-refresh session.
          }
        },
      },
    }
  );
}
