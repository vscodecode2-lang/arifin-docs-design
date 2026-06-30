import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

const nextConfig: NextConfig = {

  // ── Security Headers ─────────────────────────────────────────
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Cegah website di-embed di iframe (clickjacking)
          { key: "X-Frame-Options",           value: "DENY" },
          // Cegah browser menebak-nebak tipe konten
          { key: "X-Content-Type-Options",    value: "nosniff" },
          // Batasi info referrer saat pindah halaman
          { key: "Referrer-Policy",           value: "strict-origin-when-cross-origin" },
          // Paksa HTTPS minimal 1 tahun setelah deploy
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
          // Batasi akses fitur browser yang tidak perlu
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          // Kontrol apa saja yang boleh dimuat di halaman
          // CATATAN: 'unsafe-inline' masih dibutuhkan Next.js App Router
          // untuk inline style & hydration script. 'unsafe-eval' sudah dihapus
          // karena membuka celah XSS serius tanpa manfaat nyata.
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              // React dev tooling butuh unsafe-eval; aktifkan hanya saat development.
              `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              // blob: untuk upload foto CV; https: untuk gambar eksternal
              "img-src 'self' data: blob: https:",
              // Tambah lynk.id (link produk digital) & vercel live preview
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://wa.me https://lynk.id",
              // Larang semua iframe embedding halaman ini
              "frame-ancestors 'none'",
              // Larang plugin lama (Flash, dll)
              "object-src 'none'",
              // Upgrade HTTP request ke HTTPS secara otomatis
              "upgrade-insecure-requests",
            ].join("; "),
          },
        ],
      },
    ];
  },

  // ── Dev: izinkan akses dari jaringan lokal ───────────────────
  allowedDevOrigins: ["10.200.102.160"],
};

export default nextConfig;
