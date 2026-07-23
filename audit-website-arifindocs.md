# Audit Lengkap Website — Arifin Docs & Design
**URL:** https://arifindocs-id.vercel.app
**Halaman yang diaudit:** Homepage, /layanan/cv-ats, /tentang, /testimoni, /kontak

---

## 1. Ringkasan Eksekutif

Website ini punya fondasi konversi yang cukup kuat untuk skala UMKM/freelance (kalkulator harga instan, CTA WhatsApp di mana-mana, struktur layanan jelas). Tapi ada **kebocoran konversi dan trust yang serius**: internal link yang salah alamat di titik CTA paling kritis, domain canonical yang tidak konsisten (memecah otoritas SEO), dan klaim "500+ klien" yang bertentangan langsung dengan halaman testimoni yang kosong. Ini bukan masalah "polish" — ini masalah yang langsung menahan pendapatan dan kepercayaan.

---

## 2. Analisis 20 Elemen

### Brand Positioning
Positioning saat ini: "solusi satu pintu untuk semua dokumen" (CV, surat, legal, NPWP, akademik, data entry). Cukup jelas tapi generik — hampir semua "jasa CV" di Instagram/TikTok punya positioning yang sama. Tidak ada pembeda eksplisit (kenapa Arifin, bukan yang lain?) di halaman manapun yang diaudit.

### Value Proposition
Headline hero: *"Urusan Dokumen Ribet? Kami Bantu Bereskan."* — kuat secara emosional (menyasar rasa frustrasi), tapi kurang spesifik secara fungsional (cepat berapa lama? aman seperti apa?). Sub-headline menutup sedikit gap ini dengan daftar layanan.

### Hero Section
Struktur hero sudah tepat: masalah → solusi → bukti sosial → CTA ganda. Elemen "500+ klien" jadi anchor kepercayaan pertama — tapi ini yang nanti kontradiksi dengan halaman testimoni (lihat Trust Building).

### Copywriting
Nada bahasa sudah pas untuk target audiens (job seeker, pelajar, freelancer Indonesia) — kasual tapi tetap profesional. Pola "Masalah → Solusi Kami" di halaman layanan cv-ats efektif secara psikologis (agitate-solve).

### CTA
CTA sangat banyak dan konsisten mengarah ke WhatsApp — bagus untuk pasar Indonesia. Tapi ada CTA yang **rusak**: tombol utama "Pesan CV ATS Friendly" di halaman `/layanan/cv-ats` mengarah ke `/cv-ats` (bukan `/layanan/cv-ats`), berpotensi 404. Ini CTA di titik keputusan akhir — kerugian konversi paling mahal di seluruh situs.

### UX Writing
Microcopy FAQ ("Saya fresh graduate, apa tetap bisa dibantu?") menjawab keberatan riil dengan baik. Form kontak punya label jelas ("Email atau Nomor WA — Kami akan membalas ke kontak ini"). Ini salah satu bagian terkuat dari situs.

### Services
Menu layanan lengkap dan mudah dipindai, masing-masing dengan harga mulai, badge urgensi (Terlaris, Hot Offer, Populer), dan bullet manfaat. Struktur ini sudah semantically solid untuk SEO topikal per layanan.

### Portfolio
Tiga contoh CV ditampilkan di homepage, tapi caption sistem sendiri menyebutnya *"Ganti placeholder ini dengan hasil nyata dari klien Anda"* — artinya ini **belum bukti asli**. Untuk kategori jasa yang sangat visual (CV), ini kelemahan besar.

### Testimonial
Homepage menampilkan 2 testimoni dengan rating (5.0 dan 4.8). Tapi halaman `/testimoni` yang didedikasikan menampilkan **"Belum ada testimoni — Jadilah yang pertama menulis testimoni!"** — kontradiksi langsung dengan klaim "Dipercaya Ratusan Klien" dan "500+ klien" di homepage. Ini risiko kredibilitas serius jika ditemukan calon klien yang skeptis.

### FAQ
Ada di level halaman layanan (cv-ats) dan halaman kontak — pendekatan yang tepat (jawab keberatan sedekat mungkin dengan titik konversi). Kualitas jawaban baik, natural language, cocok untuk featured snippet.

### Footer
Cukup lengkap (kebijakan privasi, syarat & ketentuan, kontak, sosial media, link login admin). Yang hilang: alamat/jam operasional, trust badge (keamanan data, metode pembayaran), dan sitemap/link ke seluruh halaman layanan.

### Visual Hierarchy
Dari struktur teks yang di-fetch, urutan section homepage logis: Hero → Bukti Visual → Harga → Layanan → Paket → Cek Order → Produk Digital → Testimoni → CTA Penutup. Alur ini mengikuti logika AIDA dengan baik.

### Trust Building
Elemen trust ada (badge "Data Aman", jumlah klien, testimoni, FAQ transparansi harga) tapi **tidak konsisten** — testimoni kosong di halaman khusus adalah kebocoran trust paling besar di seluruh audit ini.

### Mobile Experience
Tidak bisa diverifikasi visual langsung dari fetch ini (perlu screenshot/device testing), tapi struktur konten (short paragraf, CTA sticky WhatsApp floating button) mengindikasikan desain mobile-first — perlu validasi manual di tahap berikutnya.

### Conversion Flow
Flow utama: Landing → Lihat harga/layanan → Klik pesan → WhatsApp. Flow ini pendek dan efisien — kecuali diputus oleh link yang salah arah (lihat CTA). "Cek Status Order" ditempatkan di homepage untuk pengunjung baru yang belum punya kode order — sedikit prematur secara urutan journey.

### Internal Linking
**Ditemukan inkonsistensi serius.** Homepage & /kontak memakai path `/layanan/cv-ats`, dst. Tapi /tentang, /testimoni, dan tombol CTA di dalam halaman `/layanan/cv-ats` sendiri memakai path tanpa prefix `/layanan/` (mis. `/cv-ats`, `/surat-lamaran`). Ini pola classic broken-link akibat refactor URL yang tidak menyeluruh — berdampak ke crawl budget, UX, dan konversi.

### SEO Structure
Meta description dan title sudah ada di setiap halaman yang diaudit (baik) — tapi title tag `/tentang` dan `/testimoni` mengulang nama brand dua kali: *"Tentang Kami | Arifin Docs & Design | Arifin Docs & Design"* — pemborosan character budget SERP.

### Heading Structure
H1 pada homepage dan halaman layanan cv-ats jelas dan satu per halaman (baik). Perlu verifikasi manual apakah 7 halaman layanan lain konsisten memakai pola H1 → H2 (Masalah/Solusi) → H3 (FAQ) yang sama.

### Metadata
Ditemukan **domain mismatch kritis**: halaman yang diakses adalah `arifindocs-id.vercel.app`, tapi tag `canonical` dan `og:url` di halaman `/tentang` dan `/testimoni` menunjuk ke domain **berbeda**, `arifin-docs-design.vercel.app`. Ini secara teknis memberi tahu Google bahwa halaman "asli" ada di domain lain — bisa membuat domain yang sedang dipakai tidak terindeks dengan benar, atau otoritas SEO terpecah ke dua domain.

### Search Intent Alignment
Halaman layanan (cv-ats) selaras baik dengan *transactional intent* ("jasa CV ATS Friendly"). Tapi tidak ada satupun halaman yang menjawab *informational intent* — mis. "cara membuat CV ATS sendiri", "syarat NPWP online 2026" — padahal volume pencarian informational di niche ini biasanya jauh lebih besar dan merupakan pintu masuk topical authority.

---

## 3. Analisis Framework

### SWOT

**Strengths**
- Kalkulator harga instan — jarang dimiliki kompetitor jasa CV, langsung mengurangi anxiety harga
- CTA WhatsApp konsisten di semua touchpoint — sesuai perilaku belanja digital Indonesia
- Copywriting problem-agitate-solve yang natural dan tidak generik
- FAQ menjawab keberatan riil calon klien di titik yang tepat
- Struktur layanan granular, memudahkan ekspansi SEO topikal per layanan

**Weaknesses**
- Broken internal link tepat di tombol CTA "beli"
- Canonical/og:url tidak konsisten, menunjuk domain berbeda
- Kontradiksi trust: klaim 500+ klien vs halaman testimoni kosong
- Halaman "Tentang Kami" tanpa konten (tidak ada cerita, kredensial, diferensiasi)
- Portfolio masih placeholder, belum bukti asli
- Tidak ada konten informational/blog untuk menangkap pencarian non-branded

**Opportunities**
- Local SEO untuk Batang, Kendal, Semarang (Google Business Profile + landing lokal) — kompetisi kemungkinan masih rendah
- Content hub (artikel "cara lolos ATS", "syarat NPWP") sebagai mesin trafik organik jangka panjang
- Sistem testimoni otomatis pasca-transaksi — memperbaiki root cause trust gap
- Funnel produk digital (e-book, template) begitu selesai — cross-sell ke klien jasa CV yang sudah ada

**Threats**
- Kompetitor jasa CV di Instagram/TikTok/Tokopedia dengan review sudah terbangun dan harga lebih rendah
- Google berpotensi meragukan otoritas domain akibat canonical yang salah arah
- Ketergantungan penuh pada satu nomor WhatsApp sebagai satu-satunya jalur konversi — single point of failure

### 5 Why — Kenapa Konversi Berpotensi Bocor di Titik Trust?

1. **Kenapa** calon klien berpotensi ragu order? → Karena bukti sosial tidak konsisten (klaim 500+ klien vs halaman testimoni kosong).
2. **Kenapa** halaman testimoni kosong padahal homepage mengklaim ratusan klien? → Testimoni di homepage kemungkinan di-*hardcode*, sementara sistem/database testimoni di halaman khusus belum terisi.
3. **Kenapa** belum terisi? → Pengumpulan testimoni belum jadi bagian baku dari alur pasca-order.
4. **Kenapa** belum jadi alur baku? → Belum ada SOP/otomatisasi follow-up (mis. WA otomatis minta review setelah dokumen selesai).
5. **Kenapa** belum ada SOP itu? → Fokus pengembangan sejauh ini di sisi teknis (keamanan, struktur, deployment) — **root cause: prioritas development belum menyentuh tahap retensi & advocacy dalam siklus hidup pelanggan.**

### Jobs To Be Done

- **Functional job:** "Saya butuh dokumen [CV/surat/NPWP] yang formatnya benar, selesai cepat, tanpa ribet, dengan harga jelas di awal." → Sudah dilayani baik (kalkulator harga, deskripsi layanan jelas).
- **Emotional job:** "Saya ingin yakin dokumen saya akan diterima/lolos, dan tidak tertipu jasa abal-abal." → **Under-served** — inilah yang seharusnya dijawab testimoni & portofolio asli, tapi keduanya masih lemah/placeholder.
- **Social job:** "Saya ingin terlihat kompeten di mata perusahaan tanpa terlihat 'pakai jasa'." → **Belum disentuh sama sekali** di copy manapun.

### Customer Journey × AARRR

| Tahap | Kondisi Saat Ini | Gap Utama |
|---|---|---|
| **Awareness** | Bergantung pada pencarian branded + referral WA/IG | Tidak ada konten informational untuk menangkap non-branded search |
| **Acquisition** | Homepage kuat (harga transparan, urgensi) | Risiko 404 di link CTA pada titik keputusan |
| **Activation** | Handoff ke WhatsApp mulus | "Cek Status Order" muncul terlalu awal untuk visitor baru |
| **Retention** | Nyaris tidak ada mekanisme | Tidak ada email/WA follow-up, tidak ada program loyalitas |
| **Referral** | Berpotensi tapi tidak diaktifkan | Sistem testimoni yang rusak menghilangkan trigger referral alami |

---

## 4. Quick Wins (Effort Rendah, Dampak Cepat)

1. Perbaiki semua internal link yang salah prefix (`/cv-ats` → `/layanan/cv-ats`, dst.) — prioritas #1, kebocoran revenue langsung
2. Samakan `canonical` dan `og:url` di semua halaman ke domain yang benar-benar dipakai (`arifindocs-id.vercel.app`)
3. Pindahkan 2 testimoni yang sudah ada dari homepage ke halaman `/testimoni` agar tidak kosong — sementara sistem testimoni otomatis dibangun
4. Perbaiki title tag yang mengulang nama brand dua kali
5. Tulis 3-5 paragraf singkat di halaman "Tentang Kami": siapa Arifin, kenapa memulai bisnis ini, komitmen ke klien
6. Pindahkan widget "Cek Status Order" agar tidak jadi elemen pertama yang dilihat visitor baru di homepage

## 5. High Impact Improvements (Effort Lebih Besar, Dampak Jangka Panjang)

1. **Bangun content hub/blog** per layanan (pillar page + artikel how-to: "cara lolos ATS", "syarat NPWP online 2026", dll.) untuk topical authority dan trafik non-branded
2. **Bangun SOP testimoni otomatis** pasca-transaksi (follow-up WA/email minta review) — memperbaiki root cause dari analisis 5 Why
3. **Ganti portofolio placeholder** dengan contoh CV asli klien (dengan izin) — leverage konversi besar untuk kategori jasa visual ini
4. **Local SEO**: Google Business Profile + landing page khusus Batang/Kendal/Semarang
5. **Implementasi structured data** (Organization, Service, FAQPage, Review schema) untuk rich snippet di SERP
6. **Bangun funnel retensi**: sequence WA/email untuk mengubah pembeli CV satu kali menjadi pembeli berulang begitu produk digital (e-book, template) diluncurkan
