::: header
# 📋 Laporan Audit Website --- Arifin Docs & Design

::: sub
URL: https://arifindocs.vercel.app  \|  Tanggal: 1 Juli 2026
 \|  Framework: Next.js 16 / Supabase / Vercel
:::
:::

::: summary-bar
::: {.badge .c}
🔴 CRITICAL: 3
:::

::: {.badge .h}
🟠 HIGH: 4
:::

::: {.badge .m}
🟡 MEDIUM: 5
:::

::: {.badge .l}
🟢 LOW: 3
:::

::: {.badge style="background:#f1f5f9;color:#1a1a2e;"}
📊 Total: 15 isu
:::
:::

::: container
::: issue
::: issue-header
🔴

## CRITICAL-1 --- Canonical URL Salah di Hampir Semua Halaman

[CRITICAL]{.sev .CRITICAL}
:::

::: issue-body
::: meta-row
::: meta-item
**Lokasi**/testimoni, /kontak, /cv-ats, /paket-hemat, /cara-kerja
:::

::: meta-item
**Kesulitan**Mudah
:::

::: meta-item
**Waktu**1--2 jam
:::
:::

::: section
### Temuan

Canonical semua halaman di atas mengarah ke root domain
`https://arifindocs.id`, bukan ke URL masing-masing halaman. Hanya
`/cek-order` yang sudah benar.
:::

::: section
### Dampak

Google menganggap semua halaman sebagai duplikat homepage. Halaman
layanan seperti `/cv-ats` dan `/cara-kerja` tidak akan pernah diindex
secara individual → 0% kemungkinan ranking di Google untuk halaman
layanan utama.
:::

::: section
### Solusi (Next.js App Router)

    // src/app/cv-ats/page.tsx
    export const metadata: Metadata = {
      alternates: {
        canonical: 'https://arifindocs.id/cv-ats',
      },
      openGraph: {
        url: 'https://arifindocs.id/cv-ats',
      },
    };

    // ATAU: gunakan helper di layout untuk auto-generate
    // src/lib/metadata.ts
    export function buildMeta(path: string, overrides: Partial<Metadata> = {}): Metadata {
      return {
        alternates: { canonical: \`https://arifindocs.id\${path}\` },
        openGraph: { url: \`https://arifindocs.id\${path}\` },
        ...overrides,
      };
    }
:::
:::
:::

::: issue
::: issue-header
🔴

## CRITICAL-2 --- Inkonsistensi Harga Paket Hemat (Merusak Trust)

[CRITICAL]{.sev .CRITICAL}
:::

::: issue-body
::: meta-row
::: meta-item
**Lokasi**Homepage vs /paket-hemat
:::

::: meta-item
**Kesulitan**Sangat Mudah
:::

::: meta-item
**Waktu**15 menit
:::
:::

::: section
### Temuan

• Homepage → Rp **40.000** (diskon 57% dari Rp 70.000)\
• /paket-hemat Page Title → Rp **15.000**\
• /paket-hemat Meta description → \"hanya Rp **15.000**\"\
• /paket-hemat Form aktual → Rp **40.000**\
\
Pengunjung dari Google melihat \"Rp 15.000\" di search results, tapi
sesampainya di form tertulis Rp 40.000.
:::

::: section
### Dampak

Bounce rate tinggi + hilang kepercayaan. Dianggap bait-and-switch oleh
pengunjung.
:::

::: section
### Solusi

Seragamkan semua referensi ke harga yang benar (Rp 40.000). Update
`metadata.title`, `metadata.description`, OG tags di
`src/app/paket-hemat/page.tsx`.
:::
:::
:::

::: issue
::: issue-header
🔴

## CRITICAL-3 --- Service Role Key Terekspos di File ZIP

[CRITICAL]{.sev .CRITICAL}
:::

::: issue-body
::: meta-row
::: meta-item
**Lokasi**.env.local dalam ZIP upload
:::

::: meta-item
**Kesulitan**Sangat Mudah
:::

::: meta-item
**Waktu**5 menit
:::
:::

::: section
### Temuan

File ZIP mengandung `SUPABASE_SERVICE_ROLE_KEY` aktif. Key ini bypass
semua Row Level Security --- siapapun yang punya ZIP ini punya akses
penuh ke database.
:::

::: section
### Solusi

    # Langkah 1: Rotate key SEKARANG
    # Supabase Dashboard → Project Settings → API
    # → Roll "service_role" key → Confirm

    # Langkah 2: Update di Vercel
    # Vercel Dashboard → Project → Settings → Environment Variables
    # → Update SUPABASE_SERVICE_ROLE_KEY dengan key baru

    # Langkah 3: Pastikan .gitignore sudah include:
    .env*
    .env.local
:::
:::
:::

::: issue
::: issue-header
🟠

## HIGH-1 --- og:url Salah di Banyak Halaman

[HIGH]{.sev .HIGH}
:::

::: issue-body
::: meta-row
::: meta-item
**Lokasi**/testimoni, /kontak, /cara-kerja, /cek-order
:::

::: meta-item
**Kesulitan**Mudah
:::

::: meta-item
**Waktu**Tercover di CRITICAL-1
:::
:::

::: section
### Temuan

Semua halaman tersebut memiliki `og:url = https://arifindocs.id` (root),
bukan URL halaman spesifik. Saat link dibagikan ke WhatsApp atau
Facebook, preview muncul seolah-olah link ke homepage.
:::

::: section
### Solusi

    // Contoh untuk /testimoni/page.tsx
    export const metadata: Metadata = {
      openGraph: {
        url: 'https://arifindocs.id/testimoni',
        title: 'Testimoni Klien | Arifin Docs & Design',
        description: 'Baca pengalaman nyata 500+ klien...',
      },
    };
:::
:::
:::

::: issue
::: issue-header
🟠

## HIGH-2 --- og:image Tidak Ada di Halaman Layanan Utama

[HIGH]{.sev .HIGH}
:::

::: issue-body
::: meta-row
::: meta-item
**Lokasi**/cv-ats, /paket-hemat
:::

::: meta-item
**Kesulitan**Mudah
:::

::: meta-item
**Waktu**30 menit
:::
:::

::: section
### Temuan

Halaman `/cv-ats` (layanan utama) dan `/paket-hemat` tidak memiliki
`og:image`. Saat link dibagikan via WhatsApp tidak ada gambar preview
--- hanya teks polos.
:::

::: section
### Solusi

    // src/app/cv-ats/page.tsx
    export const metadata: Metadata = {
      openGraph: {
        images: [{
          url: 'https://arifindocs.id/opengraph-image',
          width: 1200,
          height: 630,
          alt: 'CV ATS Friendly — Lolos Sistem ATS | Arifin Docs & Design',
        }],
      },
    };
:::
:::
:::

::: issue
::: issue-header
🟠

## HIGH-3 --- Footer Links Rusak di Semua Sub-halaman

[HIGH]{.sev .HIGH}
:::

::: issue-body
::: meta-row
::: meta-item
**Lokasi**Footer, semua halaman kecuali homepage
:::

::: meta-item
**Kesulitan**Mudah
:::

::: meta-item
**Waktu**30 menit
:::
:::

::: section
### Temuan

Footer memiliki link:\
• \"Tentang Kami\" → `#tentang` (anchor relatif)\
• \"Kebijakan Privasi\" → `#privasi` (anchor relatif)\
• \"Syarat & Ketentuan\" → `#syarat` (anchor relatif)\
• Semua produk digital → `#produk` (anchor relatif)\
\
Di sub-halaman seperti `/cv-ats`, anchor ini tidak mengarah ke mana pun
karena section tersebut tidak ada. Masalah serius untuk Kebijakan
Privasi --- secara hukum harus selalu accessible, apalagi site ini
mengumpulkan data pribadi sensitif (nama, email, WA, foto).
:::

::: section
### Solusi (Cepat)

    // src/components/layout/Footer.tsx
    // Ubah dari:
    <Link href="#tentang">Tentang Kami</Link>

    // Menjadi:
    <Link href="/#tentang">Tentang Kami</Link>
    <Link href="/#privasi">Kebijakan Privasi</Link>
    <Link href="/#syarat">Syarat & Ketentuan</Link>

💡 Solusi terbaik jangka panjang: buat halaman dedicated
`/kebijakan-privasi` dan `/syarat-ketentuan`.
:::
:::
:::

::: issue
::: issue-header
🟠

## HIGH-4 --- Twitter Card Meta Tidak Spesifik per Halaman

[HIGH]{.sev .HIGH}
:::

::: issue-body
::: meta-row
::: meta-item
**Lokasi**Semua halaman kecuali homepage
:::

::: meta-item
**Kesulitan**Mudah
:::

::: meta-item
**Waktu**Tercover di CRITICAL-1
:::
:::

::: section
### Temuan

`twitter:title` dan `twitter:description` di semua halaman berisi teks
generik yang sama persis. Halaman `/cv-ats` seharusnya punya twitter
meta yang bicara tentang CV ATS, bukan deskripsi umum perusahaan.
:::
:::
:::

::: issue
::: issue-header
🟡

## MEDIUM-1 --- Typo Double Space di Title Tag

[MEDIUM]{.sev .MEDIUM}
:::

::: issue-body
::: meta-row
::: meta-item
**Lokasi**/testimoni, /kontak
:::

::: meta-item
**Kesulitan**Trivial
:::

::: meta-item
**Waktu**5 menit
:::
:::

::: section
### Temuan

    "Testimoni Klien  | Arifin Docs & Design"  ← 2 spasi sebelum |
    "Kontak — Hubungi Kami  | Arifin Docs & Design"  ← 2 spasi sebelum |

Muncul di SERP Google dan terlihat tidak profesional.
:::
:::
:::

::: issue
::: issue-header
🟡

## MEDIUM-2 --- Penggunaan Istilah \"Joki Tugas\" di Konten Publik

[MEDIUM]{.sev .MEDIUM}
:::

::: issue-body
::: meta-row
::: meta-item
**Lokasi**Homepage (section layanan), /akademik
:::

::: meta-item
**Kesulitan**Mudah
:::

::: meta-item
**Waktu**20 menit
:::
:::

::: section
### Temuan

Layanan disebut \"Joki Tugas & Pendampingan Akademik\" secara eksplisit.
Istilah \"joki\" berarti academic cheating proxy dalam konteks
Indonesia.
:::

::: section
### Dampak

Potensi downrank oleh Google, distrust dari klien korporat, dan risiko
legal dari institusi pendidikan.
:::

::: section
### Solusi

❌ \"Joki Tugas & Pendampingan Akademik\"\
✅ \"Pendampingan & Konsultasi Akademik\"\
✅ \"Asistensi Dokumen & Tugas Akademik\"\
✅ \"Layanan Akademik Profesional\"
:::
:::
:::

::: issue
::: issue-header
🟡

## MEDIUM-3 --- Tidak Ada Schema.org Structured Data

[MEDIUM]{.sev .MEDIUM}
:::

::: issue-body
::: meta-row
::: meta-item
**Lokasi**Semua halaman
:::

::: meta-item
**Kesulitan**Menengah
:::

::: meta-item
**Waktu**3--4 jam
:::
:::

::: section
### Temuan

Tidak ada JSON-LD structured data. Halaman `/cara-kerja` dan
`/cek-order` memiliki FAQ section yang sempurna untuk FAQPage schema.
Homepage ideal untuk LocalBusiness/ProfessionalService schema.
:::

::: section
### Solusi (FAQPage untuk /cara-kerja)

    // src/app/cara-kerja/page.tsx — tambahkan di JSX:
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "Bagaimana cara melakukan pembayaran?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Pembayaran via transfer bank atau e-wallet (GoPay, OVO, Dana, QRIS) setelah pesanan dikonfirmasi via WhatsApp."
              }
            },
            // ... tambah semua FAQ
          ]
        })
      }}
    />
:::
:::
:::

::: issue
::: issue-header
🟡

## MEDIUM-4 --- Order Tracking Tidak Ada Rate Limiting

[MEDIUM]{.sev .MEDIUM}
:::

::: issue-body
::: meta-row
::: meta-item
**Lokasi**/cek-order → trackOrder() server action
:::

::: meta-item
**Kesulitan**Menengah
:::

::: meta-item
**Waktu**1 jam
:::
:::

::: section
### Temuan

Kode order ADC-XXXXXX (6 karakter) bisa di-brute-force. Tanpa rate
limiting, seseorang bisa enumerate semua kode valid dan melihat data
klien lain (nama, layanan, status, catatan admin).
:::

::: section
### Solusi

    // src/app/actions/track-order.ts
    import { headers } from 'next/headers';
    import { rateLimiter } from '@/lib/rate-limit';

    export async function trackOrder(orderCode: string) {
      const ip = (await headers()).get('x-forwarded-for') ?? 'unknown';
      
      // Max 5 percobaan per menit per IP
      const { success } = await rateLimiter.check(`track:${ip}`, 5, '1m');
      if (!success) {
        return { error: 'Terlalu banyak percobaan. Tunggu 1 menit.' };
      }
      
      // ... sisa logic tracking
    }
:::
:::
:::

::: issue
::: issue-header
🟡

## MEDIUM-5 --- Halaman Testimoni Kosong (0 Social Proof)

[MEDIUM]{.sev .MEDIUM}
:::

::: issue-body
::: meta-row
::: meta-item
**Lokasi**/testimoni + homepage
:::

::: meta-item
**Kesulitan**Non-teknis
:::

::: meta-item
**Waktu**1 jam konten
:::
:::

::: section
### Temuan

Halaman testimoni sepenuhnya kosong. Halaman ini adalah titik keputusan
terpenting pengunjung yang ragu untuk order. Kosong = tidak ada alasan
untuk percaya = tidak jadi pesan.
:::

::: section
### Solusi

Minta 3--5 testimoni dari klien atau beta tester yang sudah menggunakan
layanan. Isi via dashboard admin. Prioritaskan testimoni dengan nama
nyata dan spesifik tentang hasil (misal: \"CV saya lolos screening di 3
perusahaan setelah pakai layanan ini\").
:::
:::
:::

::: issue
::: issue-header
🟢

## LOW-1 --- Robots.txt dan Sitemap Belum Diverifikasi

[LOW]{.sev .LOW}
:::

::: issue-body
::: meta-row
::: meta-item
**Lokasi**/robots.txt, /sitemap.xml
:::

::: meta-item
**Kesulitan**Mudah
:::

::: meta-item
**Waktu**30 menit
:::
:::

::: section
### Solusi

    // src/app/robots.ts
    export default function robots(): MetadataRoute.Robots {
      return {
        rules: [
          { userAgent: '*', disallow: ['/login', '/dashboard'] },
        ],
        host: 'https://arifindocs.id',
        sitemap: 'https://arifindocs.id/sitemap.xml',
      };
    }
:::
:::
:::

::: issue
::: issue-header
🟢

## LOW-2 --- Jam Operasional Tidak Konsisten Antar Halaman

[LOW]{.sev .LOW}
:::

::: issue-body
::: meta-row
::: meta-item
**Lokasi**/kontak vs /cara-kerja
:::

::: meta-item
**Kesulitan**Mudah
:::

::: meta-item
**Waktu**20 menit
:::
:::

::: section
### Temuan

/kontak: Minggu 10.00--18.00 WIB  \|  /cara-kerja: \"setiap hari
08.00--21.00 WIB\"
:::

::: section
### Solusi

    // src/lib/constants.ts
    export const OPERATIONAL_HOURS = {
      weekdays: '08.00 – 21.00 WIB',
      saturday: '09.00 – 21.00 WIB',
      sunday: '10.00 – 18.00 WIB',
    } as const;
:::
:::
:::

::: issue
::: issue-header
🟢

## LOW-3 --- \"Login Admin\" Tampil di Navbar Publik

[LOW]{.sev .LOW}
:::

::: issue-body
::: meta-row
::: meta-item
**Lokasi**Navbar semua halaman
:::

::: meta-item
**Kesulitan**Trivial
:::

::: meta-item
**Waktu**10 menit
:::
:::

::: section
### Temuan

Link \"Login Admin\" muncul di navbar utama --- terlihat di setiap
halaman termasuk mobile. Bukan vulnerability, tapi secara UX tidak
perlu. Sudah ada di footer.
:::

::: section
### Solusi

Hapus dari navbar, biarkan di footer saja. Atau tambahkan class
`sr-only` agar tidak terlihat tapi tetap accessible.
:::
:::
:::

::: divider
:::

::: checklist
## ✅ Checklist Status

::: check-item
[✓]{.check-icon .ok}HTTPS aktif dan valid
:::

::: check-item
[✓]{.check-icon .ok}Middleware auth admin aktif (getUser, bukan
getSession)
:::

::: check-item
[✓]{.check-icon .ok}requireAdminUser() konsisten di server actions
:::

::: check-item
[✓]{.check-icon .ok}Rate limiting di form order klien
:::

::: check-item
[✓]{.check-icon .ok}Meta title unik per halaman (sebagian besar)
:::

::: check-item
[✓]{.check-icon .ok}Meta description ada di semua halaman
:::

::: check-item
[✓]{.check-icon .ok}Open Graph dasar tersedia (sebagian)
:::

::: check-item
[✓]{.check-icon .ok}Twitter Card ada
:::

::: check-item
[✓]{.check-icon .ok}WhatsApp CTA jelas di setiap halaman
:::

::: check-item
[✓]{.check-icon .ok}Multi-step form CV ATS berfungsi
:::

::: check-item
[✓]{.check-icon .ok}Mobile-first layout (terlihat dari struktur)
:::

::: check-item
[✗]{.check-icon .fail}CRITICAL: Service Role Key aman → PERLU ROTATE
SEKARANG
:::

::: check-item
[✗]{.check-icon .fail}CRITICAL: Canonical URL benar per halaman
:::

::: check-item
[✗]{.check-icon .fail}CRITICAL: Harga konsisten di semua halaman
:::

::: check-item
[✗]{.check-icon .fail}HIGH: og:url benar per halaman
:::

::: check-item
[✗]{.check-icon .fail}HIGH: og:image ada di /cv-ats dan /paket-hemat
:::

::: check-item
[✗]{.check-icon .fail}HIGH: Footer links berfungsi di sub-halaman
:::

::: check-item
[✗]{.check-icon .fail}MEDIUM: Schema.org structured data (FAQPage,
LocalBusiness)
:::

::: check-item
[✗]{.check-icon .fail}MEDIUM: Rate limiting di /cek-order tracking
:::

::: check-item
[✗]{.check-icon .fail}MEDIUM: Testimoni terisi (minimal 3--5)
:::

::: check-item
[✗]{.check-icon .fail}MEDIUM: Istilah \"Joki Tugas\" diganti framing
lebih aman
:::

::: check-item
[✗]{.check-icon .fail}LOW: Robots.txt dan Sitemap diverifikasi
:::
:::

::: roadmap
## 🗺️ Roadmap Perbaikan

::: sprint
### Hari ini / Segera (\< 2 jam total)

-   🔴 Rotate Supabase service role key (5 menit)
-   🔴 Fix harga di /paket-hemat --- seragamkan ke Rp 40.000 (15 menit)
-   🟠 Fix footer anchor links → ubah ke /#tentang, /#privasi dll (30
    menit)
-   🟡 Fix typo double space di title /testimoni dan /kontak (5 menit)
-   🟡 Ganti istilah \"Joki Tugas\" ke framing lebih positif (20 menit)
:::

::: sprint
### Sprint Berikutnya (1--2 hari kerja)

-   🔴 Fix canonical URL semua halaman layanan --- generate dinamis (2
    jam)
-   🟠 Fix og:url dan twitter meta per halaman --- tercover sekalian
    (dalam 2 jam di atas)
-   🟠 Tambah og:image ke /cv-ats dan /paket-hemat (30 menit)
-   🟡 Tambah rate limiting ke trackOrder() (1 jam)
:::

::: sprint
### Bulan Ini

-   🟡 Tambahkan Schema.org: FAQPage + Service + LocalBusiness (4 jam)
-   🟡 Isi minimal 5 testimoni dari klien nyata (non-teknis)
-   🟢 Verifikasi dan setup robots.txt + sitemap.xml (30 menit)
-   🟢 Seragamkan jam operasional via constants.ts (20 menit)
-   🟢 Pindah \"Login Admin\" dari navbar ke footer saja (10 menit)
:::
:::

Laporan Audit --- Arifin Docs & Design  \| 
arifindocs.vercel.app  \|  1 Juli 2026
:::
