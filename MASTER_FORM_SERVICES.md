# MASTER_FORM_SERVICES.md

# MASTER FORM SERVICES DOCUMENTATION

Modern SaaS Documentation — Service Form Collection 2026

---

# TABLE OF CONTENTS

1. CV ATS Friendly
2. Surat Lamaran Profesional
3. Surat Informasi Legal
4. Pendaftaran NPWP Online
5. Pendampingan Tugas Akademik
6. Data Entry Service

---

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# CV ATS FRIENDLY

## Nama Layanan
CV ATS Friendly Service

## Deskripsi Singkat
Layanan pembuatan CV ATS Friendly profesional yang modern, HR friendly, recruiter friendly, dan optimized untuk sistem ATS perusahaan modern.

## Tujuan Form
Mengumpulkan informasi lengkap user untuk membantu proses pembuatan CV ATS Friendly secara profesional dan akurat.

## Target User

- Fresh Graduate
- Profesional / Experienced
- Career Switcher

---

# STRUKTUR FORM

## INFORMASI PRIBADI

| Nama Field | Tipe Input | Placeholder | Helper Text | Required | Conditional Logic | Tujuan Pertanyaan |
|---|---|---|---|---|---|---|
| Nama Lengkap | Text Input | Muhammad Arifin | Gunakan nama lengkap sesuai identitas resmi | Required | - | Identitas utama pada CV |
| Nama Panggilan | Text Input | Arifin | Opsional untuk komunikasi | Optional | - | Personalisasi komunikasi |
| Tempat Lahir | Text Input | Semarang | Isi sesuai identitas | Optional | - | Informasi tambahan CV |
| Tanggal Lahir | Date Picker | 12 Januari 2004 | Opsional sesuai preferensi user | Optional | - | Informasi tambahan HR |
| Jenis Kelamin | Dropdown | Laki-laki / Perempuan | Pilih sesuai identitas | Optional | - | Data tambahan HR |
| Domisili Saat Ini | Text Input | Jakarta Selatan | Kota tempat tinggal saat ini | Required | - | Lokasi kandidat |
| Foto Profesional | File Upload | JPG/PNG | Upload foto formal profesional | Optional | - | Visual CV |

---

## KONTAK

| Nama Field | Tipe Input | Placeholder | Helper Text | Required | Conditional Logic | Tujuan Pertanyaan |
|---|---|---|---|---|---|---|
| Email Aktif | Email Input | nama@email.com | Gunakan email profesional | Required | Validasi email | Kontak recruiter |
| Nomor WhatsApp | Phone Input | 0812xxxxxxx | Gunakan nomor aktif | Required | Validasi nomor Indonesia | Kontak utama |
| LinkedIn Profile | URL Input | https://linkedin.com/in/... | Tambahkan profil LinkedIn | Optional | - | Personal branding |
| Portfolio Website | URL Input | https://portfolio.com | Portfolio online | Optional | - | Showcase project |
| GitHub Profile | URL Input | https://github.com/... | Untuk posisi teknikal | Optional | - | Showcase coding |

---

## POSISI YANG DILAMAR

| Nama Field | Tipe Input | Placeholder | Helper Text | Required | Conditional Logic | Tujuan Pertanyaan |
|---|---|---|---|---|---|---|
| Posisi yang Dilamar | Text Input | UI/UX Designer | Posisi target utama | Required | - | Fokus CV |
| Industri Target | Dropdown | Teknologi / Finance / Startup | Pilih industri target | Optional | - | Penyesuaian ATS |
| Kata Kunci Lowongan | Textarea | UI Design, Figma, UX Research | Tambahkan keyword dari jobdesc | Optional | - | Optimasi ATS |

---

## PENDIDIKAN

| Nama Field | Tipe Input | Placeholder | Helper Text | Required | Conditional Logic | Tujuan Pertanyaan |
|---|---|---|---|---|---|---|
| Nama Institusi | Text Input | Universitas Indonesia | Nama sekolah/kampus | Required | - | Riwayat pendidikan |
| Jurusan | Text Input | Teknik Informatika | Isi jurusan/program studi | Required | - | Relevansi pendidikan |
| Tahun Masuk | Number Input | 2021 | Tahun mulai pendidikan | Required | - | Timeline pendidikan |
| Tahun Lulus | Number Input | 2025 | Isi estimasi jika belum lulus | Required | - | Timeline pendidikan |
| IPK / Nilai | Number Input | 3.75 | Opsional | Optional | - | Nilai akademik |

---

## CONDITIONAL LOGIC

### Fresh Graduate
Tampilkan:
- Pengalaman organisasi
- Project kampus
- Magang
- Sertifikat
- Volunteer

### Profesional
Tampilkan:
- Pengalaman kerja detail
- Achievement
- KPI
- Leadership
- Tools kerja

### Career Switcher
Tampilkan:
- Pengalaman sebelumnya
- Target karir baru
- Transferable skills
- Alasan pindah karir

---

# VALIDATION RULES

- Email wajib valid
- Nomor WhatsApp wajib aktif
- Tahun lulus tidak boleh lebih kecil dari tahun masuk
- Upload foto maksimal 5MB
- Format upload JPG/PNG/PDF

---

# UX RECOMMENDATION

## Multi-Step Flow
1. Informasi Dasar
2. Pendidikan & Pengalaman
3. Skill & Sertifikat
4. Portfolio
5. Review & Submit

## Progress Indicator
- Step progress
- Percentage progress
- Auto save draft

## Mobile Optimization
- Maksimal 5 field per screen
- Sticky CTA
- Dropdown friendly

## Summary Section
Tampilkan:
- Posisi target
- Skill utama
- Pengalaman utama

---

# FIELD PRIORITY

## Wajib
- Nama lengkap
- Email
- WhatsApp
- Posisi target
- Pendidikan

## Opsional
- Foto
- LinkedIn
- GitHub
- Portfolio

## Recommended
- Kata kunci ATS
- Achievement
- Sertifikat
- Skill tools

---

# SECURITY & PRIVACY

- Data hanya digunakan untuk pembuatan CV
- File upload bersifat confidential
- Data tidak dibagikan ke pihak ketiga
- Upload menggunakan secure storage

---

# CTA RECOMMENDATION

- Buat CV Saya
- Lanjutkan Pembuatan CV
- Submit Data CV

---

# NOTES

- Gunakan bahasa profesional modern
- Optimized untuk ATS 2026
- Mobile-first form structure

---

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# SURAT LAMARAN PROFESIONAL

## Nama Layanan
Surat Lamaran Kerja Profesional

## Deskripsi Singkat
Layanan pembuatan surat lamaran kerja profesional, formal, recruiter friendly, dan ATS optimized sesuai posisi yang dilamar.

## Tujuan Form
Mengumpulkan data lengkap user untuk membantu pembuatan surat lamaran kerja profesional dan modern.

## Target User

- Fresh Graduate
- Profesional
- Career Switcher
- Remote Worker

---

# STRUKTUR FORM

## INFORMASI PRIBADI

| Nama Field | Tipe Input | Placeholder | Helper Text | Required | Conditional Logic | Tujuan Pertanyaan |
|---|---|---|---|---|---|---|
| Nama Lengkap | Text Input | Muhammad Arifin | Gunakan nama resmi | Required | - | Identitas pelamar |
| Domisili | Text Input | Jakarta Selatan | Kota tempat tinggal | Required | - | Informasi recruiter |
| Status Karir | Dropdown | Fresh Graduate / Profesional | Pilih status karir | Required | Menentukan logic | Personalisasi surat |

---

## INFORMASI LOWONGAN

| Nama Field | Tipe Input | Placeholder | Helper Text | Required | Conditional Logic | Tujuan Pertanyaan |
|---|---|---|---|---|---|---|
| Nama Perusahaan | Text Input | PT ABC Indonesia | Perusahaan tujuan | Required | - | Personalization |
| Posisi Dilamar | Text Input | UI Designer | Posisi target | Required | - | Fokus surat |
| Sumber Lowongan | Dropdown | LinkedIn / Jobstreet | Dari mana lowongan ditemukan | Optional | - | Context recruiter |
| Nama HR / Recruiter | Text Input | Bapak Andi | Opsional | Optional | - | Personalisasi surat |

---

## CONDITIONAL LOGIC

### Fresh Graduate
- Pengalaman organisasi
- Magang
- Project kampus

### Profesional
- Achievement
- KPI
- Pengalaman kerja detail

### Career Switcher
- Alasan pindah karir
- Transferable skill

### Remote Worker
- Timezone
- Remote tools
- Remote collaboration experience

---

# VALIDATION RULES

- Email valid
- WhatsApp aktif
- Upload CV wajib
- Maksimal upload 10MB

---

# UX RECOMMENDATION

- Multi-step flow
- Progress indicator
- Section summary
- Mobile-first layout
- Helper text singkat

---

# FIELD PRIORITY

## Wajib
- Nama perusahaan
- Posisi dilamar
- Motivasi melamar

## Recommended
- Keyword lowongan
- Achievement
- Tone surat

---

# SECURITY & PRIVACY

- Data tidak dibagikan
- File confidential
- Secure upload

---

# CTA RECOMMENDATION

- Buat Surat Saya
- Lanjutkan Pembuatan Surat
- Submit Lamaran

---

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# SURAT INFORMASI LEGAL

## Nama Layanan
Surat Informasi Legal

## Deskripsi Singkat
Layanan pembuatan surat legal profesional untuk kebutuhan administrasi, bisnis, dan personal.

## Tujuan Form
Mengumpulkan data user untuk membantu proses pembuatan surat legal secara aman dan profesional.

## Target User

- Individu
- Freelancer
- UMKM
- Mahasiswa
- Pemilik usaha kecil

---

# STRUKTUR FORM

## JENIS SURAT LEGAL

| Nama Field | Tipe Input | Placeholder | Helper Text | Required | Conditional Logic | Tujuan Pertanyaan |
|---|---|---|---|---|---|---|
| Jenis Surat | Dropdown | Surat Kuasa / Surat Perjanjian | Pilih jenis surat | Required | Menentukan field lanjutan | Klasifikasi dokumen |
| Tujuan Surat | Textarea | Untuk kebutuhan administrasi | Jelaskan tujuan surat | Required | - | Context legal |

---

## CONDITIONAL LOGIC

### Surat Kuasa
- Data pemberi kuasa
- Data penerima kuasa

### Surat Perjanjian
- Pihak pertama
- Pihak kedua
- Isi perjanjian

### Surat Pernyataan
- Tujuan pernyataan

### Lainnya
- Custom jenis surat

---

# VALIDATION RULES

- Nama sesuai identitas
- Upload KTP jelas
- File maksimal 10MB

---

# UX RECOMMENDATION

- Multi-step
- Upload indicator
- Summary before submit
- Success state professional

---

# FIELD PRIORITY

## Wajib
- Jenis surat
- Nama lengkap
- Tujuan surat

## Recommended
- Draft lama
- Catatan khusus

---

# SECURITY & PRIVACY

- Privacy notice
- Confidentiality agreement
- Legal disclaimer
- Secure upload

---

# CTA RECOMMENDATION

- Buat Surat Legal
- Lanjutkan Proses
- Submit Dokumen

---

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# PENDAFTARAN NPWP ONLINE

## Nama Layanan
Pendaftaran NPWP Online

## Deskripsi Singkat
Layanan bantuan pendaftaran NPWP online secara profesional, aman, dan cepat.

## Tujuan Form
Mengumpulkan data perpajakan user untuk kebutuhan administrasi NPWP.

## Target User

- Freelancer
- Karyawan
- UMKM
- Pebisnis Online
- Fresh Graduate

---

# STRUKTUR FORM

## INFORMASI PRIBADI

| Nama Field | Tipe Input | Placeholder | Helper Text | Required | Conditional Logic | Tujuan Pertanyaan |
|---|---|---|---|---|---|---|
| Nama Sesuai KTP | Text Input | Muhammad Arifin | Gunakan nama resmi | Required | - | Identitas pajak |
| NIK | Number Input | 3374xxxxxxxxxxxx | Isi 16 digit | Required | Validasi NIK | Verifikasi identitas |
| Nomor KK | Number Input | 3374xxxxxxxxxxxx | Isi nomor KK | Required | Validasi KK | Administrasi perpajakan |

---

## CONDITIONAL LOGIC

### NPWP Baru
- Status pekerjaan
- Penghasilan
- Jenis usaha

### Perubahan Data
- Nomor NPWP lama

### Aktivasi
- Email akun
- Kendala akun

### Freelancer / UMKM
- Jenis usaha

### Karyawan
- Nama perusahaan

---

# VALIDATION RULES

- NIK 16 digit
- Email valid
- Upload KTP wajib
- File maksimal 5MB

---

# UX RECOMMENDATION

- Auto save draft
- Upload progress
- Checklist dokumen
- Summary sebelum submit

---

# FIELD PRIORITY

## Wajib
- NIK
- KK
- KTP
- Email aktif

## Recommended
- Screenshot kendala akun
- Dokumen usaha

---

# SECURITY & PRIVACY

- Encrypted upload
- Privacy notice
- Data confidentiality
- Disclaimer keamanan data

---

# CTA RECOMMENDATION

- Kirim Data NPWP
- Lanjutkan Pendaftaran
- Submit Dokumen

---

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# PENDAMPINGAN TUGAS AKADEMIK

## Nama Layanan
Pendampingan Tugas Akademik

## Deskripsi Singkat
Layanan pendampingan akademik profesional untuk membantu penyusunan tugas, presentasi, coding, dan project akademik secara etis.

## Tujuan Form
Mengumpulkan detail project akademik untuk membantu proses pendampingan dan konsultasi.

## Target User

- Pelajar
- Mahasiswa
- Karyawan Kuliah
- Freelancer

---

# STRUKTUR FORM

## INFORMASI AKADEMIK

| Nama Field | Tipe Input | Placeholder | Helper Text | Required | Conditional Logic | Tujuan Pertanyaan |
|---|---|---|---|---|---|---|
| Nama Mata Kuliah | Text Input | Basis Data | Isi nama mata kuliah | Required | - | Context tugas |
| Jenis Tugas | Dropdown | Makalah / Coding / PPT | Pilih jenis tugas | Required | Menentukan logic | Workflow project |
| Deadline | Date Picker | - | Pilih deadline | Required | Warning deadline mepet | Prioritas pengerjaan |

---

## CONDITIONAL LOGIC

### Coding
- Bahasa pemrograman
- Framework
- Tools

### PPT
- Jumlah slide
- Style desain

### Makalah / Essay
- Jumlah halaman
- Format referensi

### Skripsi
- BAB pengerjaan
- Topik penelitian

---

# VALIDATION RULES

- Deadline valid
- Upload file valid
- Maksimal upload 20MB

---

# UX RECOMMENDATION

- Countdown deadline
- Urgency badge
- Upload progress
- Summary sebelum submit

---

# FIELD PRIORITY

## Wajib
- Jenis tugas
- Deadline
- File instruksi

## Recommended
- Template kampus
- Referensi
- Tools wajib

---

# SECURITY & PRIVACY

- File confidential
- Tidak dibagikan
- Secure upload

---

# CTA RECOMMENDATION

- Kirim Detail Tugas
- Lanjutkan Request
- Submit Project

---

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# DATA ENTRY SERVICE

## Nama Layanan
Data Entry Service

## Deskripsi Singkat
Layanan data entry profesional untuk membantu proses input data secara cepat, akurat, aman, dan rapi.

## Tujuan Form
Mengumpulkan detail project data entry untuk kebutuhan workflow dan quality control.

## Target User

- UMKM
- Agency
- Online Shop
- Perusahaan
- Freelancer

---

# STRUKTUR FORM

## INFORMASI PROJECT

| Nama Field | Tipe Input | Placeholder | Helper Text | Required | Conditional Logic | Tujuan Pertanyaan |
|---|---|---|---|---|---|---|
| Nama Project | Text Input | Input Produk Marketplace | Nama project | Required | - | Identifikasi project |
| Jenis Project | Dropdown | Convert PDF / CRM Entry | Pilih jenis layanan | Required | Menentukan field lanjutan | Workflow project |
| Jumlah Data | Number Input | 500 | Estimasi total data | Required | - | Estimasi workload |

---

## CONDITIONAL LOGIC

### Convert PDF
- Jumlah halaman
- Kualitas scan

### Marketplace
- Platform marketplace
- Jumlah produk

### Web Research
- Sumber website

### Database Entry
- Format database

### Input Produk
- Field produk
- Variasi produk

---

# VALIDATION RULES

- Upload maksimal 50MB
- File valid XLSX/PDF/ZIP
- Deadline valid
- Warning file corrupt

---

# UX RECOMMENDATION

- Dashboard status project
- Auto save draft
- Upload progress
- Project summary

---

# FIELD PRIORITY

## Wajib
- Jenis project
- Deadline
- File sumber
- Format output

## Recommended
- SOP pengerjaan
- Template output
- Quality check

---

# SECURITY & PRIVACY

- Confidentiality agreement
- Secure upload
- Data deletion request
- High confidentiality option

---

# CTA RECOMMENDATION

- Submit Project
- Kirim Detail Project
- Lanjutkan Order

---

# GLOBAL UX RECOMMENDATION

## Multi-Step Standard
1. Informasi Dasar
2. Detail Project
3. Upload File
4. Review
5. Submit

---

## Mobile Optimization
- Sticky CTA
- Large tap target
- Dropdown optimized
- Upload one tap

---

## Conversion Strategy
- Short helper text
- Progress indicator
- Smart conditional fields
- Auto save draft
- Trust indicator

---

# GLOBAL SECURITY STANDARD

- Privacy Notice
- Secure Upload
- Confidentiality Agreement
- Data Encryption
- Disclaimer Protection

---

# GLOBAL CTA STYLE

Primary CTA:
- Submit
- Continue
- Start Project

Secondary CTA:
- Save Draft
- Upload Later
- Contact Admin

---

# DOCUMENT END

Modern SaaS Service Documentation 2026
Production Ready Documentation
Compatible with VSCode Markdown Preview
