import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isAdminEmail } from "@/lib/auth-admin";

/**
 * Middleware Next.js — berjalan di Edge Runtime sebelum setiap request.
 *
 * Tugas utama:
 * 1. Me-refresh session Supabase agar token tidak expired
 * 2. Memproteksi rute /dashboard → redirect ke /login jika belum auth
 * 3. Redirect /login ke /dashboard jika sudah auth (hindari akses login ulang)
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // PERFORMANCE & BUGFIX: Server Action (mis. verifyAdminAccess() yang
  // dipanggil dari halaman login) dikirim sebagai POST ke path halaman
  // yang sama ("/login"), bukan navigasi GET. Logic redirect-jika-sudah-
  // login di bawah hanya relevan untuk navigasi GET — menjalankan
  // getUser() lagi di sini untuk request POST/Server Action hanya
  // menambah satu request jaringan yang redundan ke Supabase Auth tepat
  // di saat proses login berlangsung, dan bisa memicu noise log
  // "Invalid Refresh Token" yang tidak relevan (Server Action sudah
  // melakukan validasinya sendiri lewat requireAdminUser()).
  if (pathname === "/login" && request.method !== "GET") {
    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Set cookie ke request (agar bisa dibaca Server Components)
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          // Set cookie ke response (agar dikirim ke browser)
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // PENTING: Selalu panggil getUser() — jangan gunakan getSession()
  // getSession() tidak memvalidasi token ke server Supabase (tidak aman)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ── Proteksi rute /dashboard ──────────────────────────────────────────
  // Jika belum login ATAU bukan admin (allowlist) → redirect ke /login.
  // (AUDIT CRITICAL-1: sebelumnya hanya cek `!user`, siapa pun dengan
  // akun Supabase valid bisa lolos ke area admin.)
  if (pathname.startsWith("/dashboard") && (!user || !isAdminEmail(user.email))) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    // Simpan URL tujuan agar bisa redirect kembali setelah login
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── Hindari akses /login jika sudah login sebagai admin ──────────────
  // Jika sudah login sebagai admin dan mengakses /login → redirect ke /dashboard
  if (pathname === "/login" && user && isAdminEmail(user.email)) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = "/dashboard";
    return NextResponse.redirect(dashboardUrl);
  }

  return supabaseResponse;
}

/**
 * Konfigurasi matcher — middleware HANYA berjalan pada rute yang benar-benar
 * butuh validasi session (area admin).
 *
 * BUGFIX & PERFORMANCE: Sebelumnya matcher meng-cover SEMUA halaman publik
 * (termasuk "/"). Akibatnya:
 * 1) Setiap kunjungan ke halaman publik memicu `supabase.auth.getUser()`
 *    yang melakukan request jaringan ke server Supabase Auth — padahal
 *    halaman publik tidak butuh autentikasi sama sekali. Ini menambah
 *    latency (TTFB) di SETIAP halaman dan jadi salah satu penyebab utama
 *    skor Lighthouse Performance rendah.
 * 2) Next.js otomatis melakukan prefetch untuk setiap <Link> yang
 *    terlihat di viewport (Navbar/Footer punya belasan link). Tiap
 *    prefetch ini juga menjalankan middleware -> getUser() lagi. Jika
 *    browser punya cookie refresh token yang sudah tidak valid, semua
 *    prefetch yang terjadi hampir bersamaan ini masing-masing gagal
 *    refresh secara paralel -> inilah "looping" error
 *    `AuthApiError: Invalid Refresh Token` yang muncul berkali-kali.
 *
 * Middleware sekarang hanya berjalan di /login dan /dashboard/** —
 * satu-satunya rute yang memang memerlukan pengecekan session.
 */
export const config = {
  matcher: ["/login", "/dashboard/:path*"],
};
