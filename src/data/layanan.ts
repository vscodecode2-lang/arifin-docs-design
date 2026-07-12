import type { ComponentType } from "react";
import {
  FileText, Mail, Building2, CreditCard, GraduationCap, Database,
  ShieldCheck, RefreshCw, Target, Search, FileCheck2,
  ClipboardCheck, Timer, Users, Lock, Sparkles, BadgeCheck, Layers,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface LayananBenefit {
  icon: ComponentType<{ className?: string }>;
  title: string;
  desc: string;
}

export interface LayananFaq {
  question: string;
  answer: string;
}

export interface LayananData {
  slug: string;
  /** Kunci service_type di tabel testimonials — dipakai untuk filter testimoni asli */
  serviceTypeKey: string;
  icon: ComponentType<{ className?: string }>;
  badge?: string;
  category: string;
  title: string;
  /** Headline utama — pain-driven */
  painHeadline: string;
  painBody: string;
  solutionBody: string;
  priceLabel: string;
  priceNote: string;
  /** Rute form order multi-step yang sudah ada (TIDAK berubah) */
  formHref: string;
  benefits: LayananBenefit[];
  faqs: LayananFaq[];
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
}

// ─── Data ───────────────────────────────────────────────────────────────────

export const LAYANAN_LIST: LayananData[] = [
  {
    slug: "paket-hemat",
    serviceTypeKey: "Paket Hemat",
    icon: Layers,
    badge: "Hemat 57%",
    category: "Paket Bundling",
    title: "Paket Siap Kerja",
    painHeadline: "Pesan CV dan surat lamaran satu-satu malah lebih mahal dan ribet?",
    painBody:
      "Kalau CV dan surat lamaran dipesan terpisah, kamu harus isi dua formulir berbeda, tunggu dua proses pengerjaan, dan totalnya lebih mahal dibanding dijadikan satu paket. Padahal keduanya sama-sama wajib ada setiap kali melamar kerja.",
    solutionBody:
      "Paket Siap Kerja menggabungkan CV ATS Friendly dan Surat Lamaran Profesional dalam satu formulir, dikerjakan bersamaan, dengan harga yang jauh lebih hemat dibanding pesan satu-satu.",
    priceLabel: "Rp40.000",
    priceNote: "Hemat dari Rp70.000 (diskon 57%)",
    formHref: "/paket-hemat",
    benefits: [
      { icon: Layers, title: "2 dokumen, 1 formulir", desc: "CV ATS Friendly & Surat Lamaran Profesional sekaligus, tanpa isi form dua kali." },
      { icon: BadgeCheck, title: "Lebih hemat dibanding terpisah", desc: "Rp40.000 untuk paket, dibanding total Rp70.000 kalau dipesan satu-satu." },
      { icon: Timer, title: "Selesai kurang dari 12 jam", desc: "Dikerjakan bersamaan sehingga lebih cepat daripada dua proses terpisah." },
      { icon: RefreshCw, title: "Revisi gratis hingga sempurna", desc: "Kedua dokumen bisa direvisi tanpa biaya tambahan sampai kamu benar-benar siap kirim." },
    ],
    faqs: [
      {
        question: "Apa saja yang saya dapat dari Paket Siap Kerja?",
        answer:
          "CV ATS Friendly dan Surat Lamaran Profesional, keduanya dikerjakan dalam satu proses berdasarkan satu formulir yang kamu isi.",
      },
      {
        question: "Berapa hemat dibanding pesan CV dan surat lamaran terpisah?",
        answer:
          "Kalau dipesan terpisah totalnya sekitar Rp70.000 (Rp35.000 + Rp20.000-an). Dengan paket ini kamu cukup bayar Rp40.000 — hemat sekitar 57%.",
      },
      {
        question: "Apakah bisa tambah simulasi interview HRD?",
        answer:
          "Bisa, tersedia add-on Simulasi QnA Interview HRD seharga +Rp10.000 dengan 10–15 pertanyaan custom sesuai posisi yang kamu lamar.",
      },
      {
        question: "Berapa lama waktu pengerjaan paket ini?",
        answer:
          "Rata-rata kurang dari 12 jam di hari kerja setelah formulir terisi lengkap, karena kedua dokumen dikerjakan dalam satu alur.",
      },
    ],
    metaTitle: "Paket Siap Kerja — CV ATS + Surat Lamaran Rp40.000",
    metaDescription:
      "Pesan CV dan surat lamaran terpisah lebih mahal dan ribet? Paket Siap Kerja gabungkan keduanya dalam satu formulir, hemat hingga 57%. Rp40.000.",
    keywords: [
      "paket CV dan surat lamaran", "paket siap kerja", "CV ATS murah",
      "buat CV dan surat lamaran sekaligus", "paket dokumen kerja murah",
    ],
  },
  {
    slug: "cv-ats",
    serviceTypeKey: "CV",
    icon: FileText,
    badge: "Terlaris",
    category: "CV & Karir",
    title: "CV ATS Friendly",
    painHeadline: "CV kamu ditolak sistem sebelum sempat dibaca HRD?",
    painBody:
      "90%+ perusahaan menengah-besar sekarang menyaring lamaran pakai ATS (Applicant Tracking System) sebelum HRD sempat melihatnya sama sekali. CV yang desainnya bagus tapi formatnya tidak terbaca mesin, atau minim keyword yang relevan dengan posisi yang dilamar, otomatis tersisih di tahap paling awal — bukan karena kualifikasimu kurang, tapi karena formatnya salah.",
    solutionBody:
      "Kami susun ulang CV kamu dengan struktur yang terbukti lolos parsing ATS, lalu selipkan keyword yang relevan dengan posisi dan industri yang kamu incar. Hasilnya: CV yang lolos filter otomatis dan tetap enak dibaca manusia begitu sampai di meja HRD.",
    priceLabel: "Mulai Rp35.000",
    priceNote: "Sudah termasuk revisi & konsultasi",
    formHref: "/cv-ats",
    benefits: [
      { icon: ShieldCheck, title: "Format lolos scan ATS", desc: "Struktur & layout diuji agar terbaca sempurna oleh sistem parsing otomatis." },
      { icon: Target, title: "Keyword sesuai posisi", desc: "Disesuaikan dengan job description dan industri yang kamu lamar, bukan template generik." },
      { icon: RefreshCw, title: "Revisi gratis hingga puas", desc: "Belum sreg? Revisi tanpa biaya tambahan sampai kamu benar-benar siap kirim." },
      { icon: Users, title: "Konsultasi gratis", desc: "Bingung mau highlight pengalaman yang mana? Tanya langsung ke admin, tanpa biaya." },
    ],
    faqs: [
      {
        question: "Apa bedanya CV ATS dengan CV desain biasa?",
        answer:
          "CV desain biasa sering pakai tabel, kolom, atau ikon grafis yang justru bikin sistem ATS salah baca atau gagal membaca sama sekali. CV ATS disusun dengan struktur teks linear yang tetap rapi secara visual tapi 100% terbaca mesin.",
      },
      {
        question: "Saya fresh graduate tanpa pengalaman kerja, apa tetap bisa dibantu?",
        answer:
          "Bisa. Kami bantu susun CV berbasis pengalaman organisasi, magang, proyek kuliah, dan skill yang relevan, dikemas supaya tetap kompetitif meski belum punya pengalaman kerja formal.",
      },
      {
        question: "Apakah CV bisa dipakai untuk melamar di banyak perusahaan sekaligus?",
        answer:
          "Kami buatkan versi dasar yang bisa dipakai luas, tapi untuk hasil terbaik disarankan menyesuaikan keyword tiap kali melamar posisi yang berbeda. Ini bisa didiskusikan saat konsultasi.",
      },
      {
        question: "Berapa lama proses pengerjaan CV ATS?",
        answer:
          "Rata-rata 12–24 jam di hari kerja setelah data lengkap kamu kirim lewat formulir. Butuh lebih cepat? Sampaikan ke admin, ada opsi pengerjaan urgent.",
      },
    ],
    metaTitle: "CV ATS Friendly — Kenapa CV Kamu Terus Ditolak Sistem?",
    metaDescription:
      "CV kamu sering tidak lolos screening ATS sebelum dibaca HRD? Kami bantu susun ulang dengan format dan keyword yang tepat sasaran. Mulai Rp35.000, revisi gratis.",
    keywords: [
      "CV ATS Friendly", "kenapa CV ditolak ATS", "cara lolos screening ATS",
      "jasa CV profesional", "CV lolos ATS", "CV fresh graduate",
    ],
  },
  {
    slug: "surat-lamaran",
    serviceTypeKey: "Lamaran",
    icon: Mail,
    category: "CV & Karir",
    title: "Surat Lamaran Profesional",
    painHeadline: "Surat lamaran generik bikin HRD skip di kalimat pertama?",
    painBody:
      "Surat lamaran hasil copy-paste template internet gampang dikenali HRD dalam hitungan detik — nadanya kaku, isinya tidak nyambung dengan posisi yang dilamar, dan tidak menjawab kenapa perusahaan itu harus memilihmu. Efeknya, surat langsung dilewati meski CV-mu sebenarnya kuat.",
    solutionBody:
      "Kami tulis surat lamaran dari nol, khusus untuk perusahaan dan posisi yang kamu tuju — bukan template yang diganti nama. Nadanya profesional tapi tetap personal, dan menonjolkan alasan konkret kenapa kamu cocok untuk posisi itu.",
    priceLabel: "Mulai Rp20.000",
    priceNote: "Termasuk draft email lamaran siap kirim",
    formHref: "/surat-lamaran",
    benefits: [
      { icon: Sparkles, title: "Ditulis 100% dari nol", desc: "Disesuaikan dengan perusahaan & posisi, bukan template yang diedit seadanya." },
      { icon: Mail, title: "Draft email siap kirim", desc: "Dapat surat lamaran sekaligus draft email pengantar yang tinggal kirim." },
      { icon: RefreshCw, title: "Revisi gratis hingga sesuai", desc: "Kurang pas nadanya? Revisi tanpa biaya tambahan." },
      { icon: Users, title: "Konsultasi tanpa biaya", desc: "Diskusikan poin yang mau ditonjolkan langsung dengan admin." },
    ],
    faqs: [
      {
        question: "Apakah surat lamaran dan CV harus dipesan bersamaan?",
        answer:
          "Tidak harus. Surat lamaran bisa dipesan terpisah dari CV. Tapi kalau butuh keduanya, cek juga Paket Hemat yang lebih hemat dibanding pesan satu-satu.",
      },
      {
        question: "Bagaimana kalau saya belum tahu detail posisi yang dilamar?",
        answer:
          "Formulir pemesanan akan menanyakan info dasar seperti nama perusahaan dan posisi. Semakin detail info yang kamu berikan, semakin personal dan relevan hasil suratnya.",
      },
      {
        question: "Apakah bisa untuk melamar sebagai fresh graduate?",
        answer:
          "Bisa. Kami sesuaikan penekanan pada potensi, semangat belajar, dan pengalaman non-kerja seperti organisasi atau proyek kuliah yang relevan dengan posisi.",
      },
      {
        question: "Berapa lama proses pengerjaannya?",
        answer:
          "Rata-rata 12–24 jam di hari kerja setelah formulir terisi lengkap. Ada opsi pengerjaan lebih cepat, tanyakan ke admin.",
      },
    ],
    metaTitle: "Surat Lamaran Profesional — Personal & Memikat HRD",
    metaDescription:
      "Surat lamaran generik bikin HRD skip di kalimat pertama? Kami tulis surat lamaran personal sesuai perusahaan dan posisi incaranmu. Mulai Rp20.000.",
    keywords: [
      "jasa surat lamaran", "surat lamaran kerja profesional",
      "surat lamaran fresh graduate", "buat surat lamaran online",
    ],
  },
  {
    slug: "legal",
    serviceTypeKey: "Legal",
    icon: Building2,
    category: "Dokumen Legal",
    title: "Surat Legal Profesional",
    painHeadline: "Bingung nyusun surat kuasa atau perjanjian yang sah dan rapi?",
    painBody:
      "Surat kuasa, perjanjian, atau surat pernyataan yang disusun asal-asalan berisiko ditolak instansi, menimbulkan celah hukum, atau bikin proses administrasimu tertunda berkali-kali karena harus revisi bolak-balik.",
    solutionBody:
      "Kami bantu susun dokumen legal sesuai kebutuhan spesifikmu — format resmi, bahasa yang jelas dan tidak ambigu, siap dicetak atau diedit lagi kalau diperlukan.",
    priceLabel: "Mulai Rp25.000",
    priceNote: "File PDF & DOCX siap pakai",
    formHref: "/legal",
    benefits: [
      { icon: ShieldCheck, title: "Format resmi & profesional", desc: "Disusun sesuai standar dokumen legal yang berlaku umum di Indonesia." },
      { icon: FileCheck2, title: "100% sesuai kebutuhan", desc: "Bukan template generik — disusun berdasarkan tujuan dokumen yang kamu jelaskan." },
      { icon: ClipboardCheck, title: "PDF & DOCX siap pakai", desc: "Bisa langsung dicetak atau diedit ulang sesuai kebutuhan." },
      { icon: RefreshCw, title: "Revisi gratis hingga sesuai", desc: "Konsultasi dan revisi tanpa biaya tambahan." },
    ],
    faqs: [
      {
        question: "Jenis surat legal apa saja yang bisa dibuatkan?",
        answer:
          "Surat kuasa, surat perjanjian, surat pernyataan, dan dokumen administrasi legal lainnya. Kalau kebutuhanmu di luar itu, tanyakan dulu ke admin via WhatsApp untuk konfirmasi.",
      },
      {
        question: "Apakah dokumen ini punya kekuatan hukum yang sama dengan buatan notaris?",
        answer:
          "Layanan ini membantu menyusun naskah dokumen secara profesional dan sesuai format standar. Untuk kebutuhan yang mengharuskan legalisasi notaris atau materai resmi, dokumen tetap perlu diproses lebih lanjut sesuai ketentuan yang berlaku.",
      },
      {
        question: "Data apa yang perlu saya siapkan?",
        answer:
          "Tergantung jenis dokumennya — umumnya identitas pihak terkait, tujuan surat, dan poin-poin yang ingin dicantumkan. Formulir pemesanan akan memandu langkah demi langkah.",
      },
      {
        question: "Berapa lama pengerjaannya?",
        answer:
          "Rata-rata 12–24 jam di hari kerja. Untuk kebutuhan mendesak, hubungi admin untuk opsi percepatan.",
      },
    ],
    metaTitle: "Surat Legal Profesional — Kuasa, Perjanjian & Pernyataan",
    metaDescription:
      "Bingung menyusun surat kuasa atau perjanjian yang sah dan rapi? Kami bantu susun dokumen legal profesional sesuai kebutuhanmu. Mulai Rp25.000.",
    keywords: [
      "jasa surat legal", "buat surat kuasa", "surat perjanjian online",
      "surat pernyataan profesional", "jasa dokumen legal online",
    ],
  },
  {
    slug: "npwp",
    serviceTypeKey: "NPWP",
    icon: CreditCard,
    badge: "Populer",
    category: "Administrasi",
    title: "Pendaftaran NPWP Online",
    painHeadline: "Mau daftar NPWP tapi bingung prosesnya dan males antre?",
    painBody:
      "Proses pendaftaran NPWP online sering bikin bingung karena banyak istilah dan langkah teknis di sistem DJP — belum lagi risiko salah isi data yang bikin proses ditolak dan harus mulai dari awal lagi.",
    solutionBody:
      "Kami dampingi proses pendaftaran dari awal sampai NPWP terbit — cocok untuk karyawan, freelancer, maupun pelaku UMKM yang ingin prosesnya cepat, benar, dan tanpa perlu antre ke kantor pajak.",
    priceLabel: "Mulai Rp30.000",
    priceNote: "Pendampingan sampai NPWP terbit",
    formHref: "/npwp",
    benefits: [
      { icon: Timer, title: "Tanpa antre & lebih praktis", desc: "Seluruh proses dilakukan online, tidak perlu datang ke kantor pajak." },
      { icon: ShieldCheck, title: "Data diproses dengan aman", desc: "Data pribadi kamu ditangani dengan hati-hati dan tidak disalahgunakan." },
      { icon: BadgeCheck, title: "Pendampingan sampai terbit", desc: "Kami dampingi sampai NPWP benar-benar selesai, bukan cuma bantu isi form." },
      { icon: Users, title: "Konsultasi gratis", desc: "Bingung status pekerjaan atau jenis NPWP yang sesuai? Tanya dulu, gratis." },
    ],
    faqs: [
      {
        question: "Siapa saja yang bisa pakai layanan ini?",
        answer:
          "Karyawan yang butuh NPWP untuk keperluan kerja, freelancer, wirausaha, maupun pelaku UMKM yang ingin mendaftar NPWP Pribadi atau Badan.",
      },
      {
        question: "Apa saja data yang perlu disiapkan?",
        answer:
          "Umumnya KTP dan data pekerjaan/usaha. Detail lengkapnya akan dipandu lewat formulir pemesanan sesuai jenis NPWP yang kamu butuhkan.",
      },
      {
        question: "Berapa lama proses sampai NPWP terbit?",
        answer:
          "Tergantung sistem DJP, namun kami dampingi setiap tahap dan update progres secara berkala lewat WhatsApp sampai NPWP terbit.",
      },
      {
        question: "Apakah bisa untuk pengajuan perubahan data NPWP juga?",
        answer:
          "Bisa. Sampaikan kebutuhanmu — pendaftaran baru, aktivasi, atau perubahan data — saat konsultasi maupun di formulir.",
      },
    ],
    metaTitle: "Daftar NPWP Online — Tanpa Antre, Dampingan Sampai Terbit",
    metaDescription:
      "Bingung proses daftar NPWP online dan males antre? Kami dampingi dari awal sampai NPWP terbit, untuk karyawan, freelancer, dan UMKM. Mulai Rp30.000.",
    keywords: [
      "daftar NPWP online", "jasa NPWP", "buat NPWP freelancer",
      "NPWP karyawan online", "jasa pendaftaran NPWP",
    ],
  },
  {
    slug: "akademik",
    serviceTypeKey: "Akademik",
    icon: GraduationCap,
    category: "Akademik",
    title: "Pendampingan Akademik",
    painHeadline: "Deadline tugas mepet dan progres masih jauh dari selesai?",
    painBody:
      "Tugas kuliah, PPT presentasi, makalah, sampai skripsi sering menumpuk bareng, sementara waktu dan referensi terbatas. Kalau dikerjakan terburu-buru, hasilnya berisiko kurang rapi dan kurang sistematis di mata dosen.",
    solutionBody:
      "Kami bantu dampingi pengerjaan tugas kuliahmu — mulai dari tugas coding, PPT presentasi, makalah, laporan, hingga skripsi — disusun rapi, sistematis, dan sesuai instruksi, dengan target deadline yang jelas.",
    priceLabel: "Mulai Rp30.000",
    priceNote: "Revisi hingga deadline",
    formHref: "/akademik",
    benefits: [
      { icon: Timer, title: "Ketepatan deadline", desc: "Progres dikerjakan sesuai target waktu yang kamu tentukan di awal." },
      { icon: ClipboardCheck, title: "Rapi & sistematis", desc: "Struktur dokumen mengikuti kaidah akademik yang jelas dan mudah dipahami." },
      { icon: RefreshCw, title: "Revisi hingga deadline", desc: "Perlu penyesuaian setelah dikirim? Revisi tetap didampingi hingga deadline." },
      { icon: Users, title: "Konsultasi tanpa biaya", desc: "Diskusikan instruksi tugas atau arahan dosen langsung dengan admin." },
    ],
    faqs: [
      {
        question: "Jenis tugas apa saja yang bisa dibantu?",
        answer:
          "Tugas coding/pemrograman, PPT presentasi, makalah, laporan, proposal, hingga pendampingan skripsi. Kalau tugasmu di luar daftar ini, tanyakan dulu ke admin.",
      },
      {
        question: "Apakah hasil pengerjaan dijamin bebas plagiarisme?",
        answer:
          "Kami susun berdasarkan instruksi dan referensi yang kamu berikan, disusun ulang dengan bahasa sendiri. Untuk kebutuhan skor plagiarisme spesifik, sampaikan di awal supaya bisa disesuaikan.",
      },
      {
        question: "Bagaimana kalau ada revisi dari dosen setelah tugas selesai?",
        answer:
          "Revisi didampingi hingga deadline tugas kamu, tanpa biaya tambahan sesuai kuota revisi yang berlaku untuk layanan ini.",
      },
      {
        question: "Apakah data instruksi tugas saya dijaga kerahasiaannya?",
        answer:
          "Ya, seluruh data dan instruksi tugas yang kamu kirim hanya digunakan untuk pengerjaan dan tidak dibagikan ke pihak lain.",
      },
    ],
    metaTitle: "Pendampingan Akademik — Tugas, PPT, Makalah & Skripsi",
    metaDescription:
      "Deadline tugas mepet dan progres masih jauh dari selesai? Kami dampingi pengerjaan tugas kuliah, PPT, makalah, hingga skripsi. Mulai Rp30.000.",
    keywords: [
      "jasa tugas kuliah", "jasa coding tugas", "bantuan skripsi",
      "jasa buat PPT", "jasa makalah", "jasa akademik online",
    ],
  },
  {
    slug: "data-entry",
    serviceTypeKey: "Data Entry",
    icon: Database,
    category: "Administrasi",
    title: "Jasa Data Entry",
    painHeadline: "Data berantakan dan tidak sempat diolah sendiri?",
    painBody:
      "Input data manual — convert PDF ke Excel, input produk marketplace, riset data dari web — memakan waktu yang seharusnya bisa kamu pakai untuk hal yang lebih penting. Dikerjakan terburu-buru pun berisiko banyak salah ketik atau format berantakan.",
    solutionBody:
      "Kami kerjakan input dan pengolahan datamu dengan teliti — convert PDF ke Excel, input produk marketplace, web research, sampai input database — dengan quality control sebelum hasil dikirim.",
    priceLabel: "Mulai Rp25.000",
    priceNote: "Tanpa minimal order",
    formHref: "/data-entry",
    benefits: [
      { icon: Search, title: "Akurat & teliti", desc: "Setiap hasil melalui quality control sebelum dikirim ke kamu." },
      { icon: Timer, title: "Tanpa minimal order", desc: "Data sedikit maupun banyak, tetap bisa dikerjakan sesuai kebutuhan." },
      { icon: FileCheck2, title: "Format sesuai kebutuhan", desc: "Excel, Word, Google Sheets, atau format lain sesuai permintaanmu." },
      { icon: Lock, title: "Kerahasiaan data terjaga", desc: "Data yang kamu kirim hanya digunakan untuk keperluan pengerjaan." },
    ],
    faqs: [
      {
        question: "Jenis data entry apa saja yang dilayani?",
        answer:
          "Convert PDF/gambar ke Excel, input produk marketplace (Tokopedia, Shopee, dll), web research, dan input database sesuai format yang kamu butuhkan.",
      },
      {
        question: "Apakah ada jumlah data minimum untuk order?",
        answer:
          "Tidak ada minimal order. Baik jumlah data sedikit maupun dalam skala besar, tetap bisa diproses — harga akan disesuaikan dengan volume dan kompleksitas data.",
      },
      {
        question: "Bagaimana kalau data yang saya kirim berupa hasil scan atau foto?",
        answer:
          "Bisa. Kami proses data dari berbagai sumber termasuk hasil scan, foto, atau dokumen PDF, lalu diolah ke format digital yang kamu minta.",
      },
      {
        question: "Berapa lama waktu pengerjaannya?",
        answer:
          "Tergantung volume data — untuk data dalam jumlah kecil-menengah rata-rata selesai dalam 1x24 jam kerja. Estimasi pasti akan dikonfirmasi admin setelah data diterima.",
      },
    ],
    metaTitle: "Jasa Data Entry Profesional — Akurat, Rapi & Tanpa Minimal Order",
    metaDescription:
      "Data berantakan dan tidak sempat diolah sendiri? Kami bantu convert PDF ke Excel, input produk marketplace, hingga web research. Mulai Rp25.000.",
    keywords: [
      "jasa data entry", "convert PDF ke Excel", "input produk Tokopedia",
      "input produk Shopee", "jasa input data online",
    ],
  },
];

export function getLayananBySlug(slug: string): LayananData | undefined {
  return LAYANAN_LIST.find((item) => item.slug === slug);
}
