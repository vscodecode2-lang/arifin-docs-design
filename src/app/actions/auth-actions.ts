"use server";

import { AuthApiError } from "@supabase/auth-js";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { requireAdminUser } from "@/lib/auth-admin";

/**
 * Dipakai oleh halaman login (AUDIT CRITICAL-1) untuk memverifikasi bahwa
 * akun yang baru sign-in benar-benar admin (allowlist), bukan sekadar
 * akun Supabase valid. Membaca session dari cookie request saat ini,
 * jadi harus dipanggil tepat setelah `signInWithPassword` sukses di client.
 */
export async function verifyAdminAccess(): Promise<{ isAdmin: boolean }> {
  const supabase = await createServerSupabaseClient();

  try {
    const admin = await requireAdminUser(supabase);
    return { isAdmin: !!admin };
  } catch (error) {
    if (error instanceof AuthApiError) {
      if (error.code === "over_request_rate_limit") {
        throw new Error("AUTH_RATE_LIMIT");
      }
      // BUGFIX: error auth lain (mis. "refresh_token_not_found" dari
      // cookie sesi basi) jangan dibiarkan bocor sebagai exception
      // generik — itu membuat pesan ke user jadi "akun tidak punya akses
      // admin" yang menyesatkan (padahal akunnya benar, sesinya yang
      // rusak). Tandai sebagai sesi tidak valid agar UI bisa kasih
      // pesan & langkah yang tepat (coba login ulang).
      throw new Error("AUTH_SESSION_INVALID");
    }
    throw error;
  }
}
