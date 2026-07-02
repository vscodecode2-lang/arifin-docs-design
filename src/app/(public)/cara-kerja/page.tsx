import type { Metadata } from "next";
import Link from "next/link";
import {
  MousePointerClick, ClipboardList, MessageCircle,
  FileCheck2, Shield, RefreshCw, Clock, Zap,
  CheckCircle2, ArrowRight, Star,
} from "lucide-react";
import { FaqAccordion } from "./Faqaccordion";

export const metadata: Metadata = {
  title: "Cara Kerja — Mudah, Cepat, dan Terpercaya",
  description:
    "Pelajari bagaimana cara memesan layanan dokumen profesional di Arifin Docs & Design. Proses mudah, cepat, dan aman dalam 4 langkah sederhana.",
  alternates: { canonical: "/cara-kerja" },
  openGraph: {
    title: "Cara Kerja Layanan | Arifin Docs & Design",
    description: "Pelajari alur pemesanan layanan dokumen profesional dalam 4 langkah sederhana.",
    type: "website",
    locale: "id_ID",
    url: "https://arifindocs.id/cara-kerja",
  },
  twitter: {
    title: "Cara Kerja Layanan | Arifin Docs & Design",
    description: "Pelajari alur pemesanan layanan dokumen profesional dalam 4 langkah sederhana.",
    card: "summary_large_image",
  },
};

// ─── Data ──────────────────────────────────────────────────────────────────────

const STEPS = [
  {
    number: "01",
    icon: <MousePointerClick className="h-7 w-7" />,
    title: "Pilih Layanan",
    subtitle: "Temukan yang Anda butuhkan",
    description:
      "Kunjungi halaman layanan dan pilih jenis dokumen yang Anda butuhkan — CV ATS, Surat Lamaran, Surat Legal, NPWP, Akademik, atau Data Entry. Setiap layanan dirancang untuk kebutuhan yang berbeda.",
    detail: "Tidak yakin pilih apa? Chat admin kami via WhatsApp untuk konsultasi gratis.",
    color: "bg-blue-600",
    lightColor: "bg-blue-100",
    textColor: "text-blue-700",
    borderColor: "border-blue-200",
    iconBg: "bg-blue-600",
  },
  {
    number: "02",
    icon: <ClipboardList className="h-7 w-7" />,
    title: "Isi Formulir",
    subtitle: "Mudah dan terstruktur",
    description:
      "Isi formulir multi-langkah yang sudah dirancang khusus untuk setiap layanan. Setiap pertanyaan bertujuan memastikan dokumen yang dibuat benar-benar sesuai kebutuhan dan profil Anda.",
    detail: "Data Anda terenkripsi dan tersimpan aman. Proses pengisian rata-rata hanya 5–10 menit.",
    color: "bg-violet-600",
    lightColor: "bg-violet-100",
    textColor: "text-violet-700",
    borderColor: "border-violet-200",
    iconBg: "bg-violet-600",
  },
  {
    number: "03",
    icon: <MessageCircle className="h-7 w-7" />,
    title: "Konfirmasi via WhatsApp",
    subtitle: "Langsung terhubung dengan admin",
    description:
      "Setelah formulir terkirim, Anda akan otomatis diarahkan ke WhatsApp admin. Di sini Anda mengkonfirmasi pesanan, mendiskusikan detail tambahan jika perlu, dan melakukan pembayaran.",
    detail: "Admin biasanya merespons dalam waktu kurang dari 1 jam di jam kerja (08.00–21.00 WIB).",
    color: "bg-emerald-600",
    lightColor: "bg-emerald-100",
    textColor: "text-emerald-700",
    borderColor: "border-emerald-200",
    iconBg: "bg-emerald-600",
  },
  {
    number: "04",
    icon: <FileCheck2 className="h-7 w-7" />,
    title: "Terima Dokumen",
    subtitle: "Siap pakai & profesional",
    description:
      "Dokumen jadi dikirim langsung ke WhatsApp atau email Anda sesuai estimasi waktu yang disepakati. Format PDF dan/atau Word siap cetak dan siap digunakan.",
    detail: "Tidak puas? Kami siap melakukan revisi sesuai ketentuan layanan hingga Anda benar-benar puas.",
    color: "bg-amber-600",
    lightColor: "bg-amber-100",
    textColor: "text-amber-700",
    borderColor: "border-amber-200",
    iconBg: "bg-amber-600",
  },
];

const SERVICE_TIMES = [
  {
    name: "CV ATS Friendly",
    time: "Kurang dari 12 jam",
    revisi: "Free",
    notes: "Hari kerja",
    color: "bg-blue-50 border-blue-200",
    badge: "bg-blue-100 text-blue-700",
  },
  {
    name: "Surat Lamaran Profesional",
    time: "Kurang dari 6 jam",
    revisi: "Free",
    notes: "Hari kerja",
    color: "bg-violet-50 border-violet-200",
    badge: "bg-violet-100 text-violet-700",
  },
  {
    name: "Surat Legal",
    time: "1-3 hari ",
    revisi: "Free",
    notes: "Sesuai kebutuhan dokumen",
    color: "bg-amber-50 border-amber-200",
    badge: "bg-amber-100 text-amber-700",
  },
  {
    name: "Pendaftaran NPWP Online",
    time: "1 – 3 hari kerja ( Digital )",
    revisi: "—",
    notes: "Kartu Fisik Tergantung sistem DJP",
    color: "bg-emerald-50 border-emerald-200",
    badge: "bg-emerald-100 text-emerald-700",
  },
  {
    name: "Pendampingan Akademik",
    time: "Sesuai deadline",
    revisi: "Sesuai deadline",
    notes: "Minimal 6 jam sebelum deadline",
    color: "bg-pink-50 border-pink-200",
    badge: "bg-pink-100 text-pink-700",
  },
  {
    name: "Data Entry",
    time: "Sesuai volume",
    revisi: "—",
    notes: "Estimasi diberikan saat konfirmasi",
    color: "bg-slate-50 border-slate-200",
    badge: "bg-slate-100 text-slate-600",
  },
];

const GUARANTEES = [
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Kerahasiaan Data",
    desc: "Data Anda disimpan terenkripsi dan tidak pernah dibagikan ke pihak ketiga manapun.",
    color: "bg-blue-100 text-blue-700",
  },
  {
    icon: <RefreshCw className="h-6 w-6" />,
    title: "Revisi Terjamin",
    desc: "Tidak puas dengan hasilnya? Kami siap merevisi sesuai masukan Anda tanpa biaya tambahan.",
    color: "bg-violet-100 text-violet-700",
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: "Tepat Waktu",
    desc: "Komitmen pengerjaan sesuai estimasi yang disepakati. Keterlambatan = kompensasi revisi extra.",
    color: "bg-emerald-100 text-emerald-700",
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: "Respon Cepat",
    desc: "Admin aktif dan siap merespons pertanyaan di WhatsApp setiap hari pukul 08.00–21.00 WIB.",
    color: "bg-amber-100 text-amber-700",
  },
];

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function CaraKerjaPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Bagaimana cara melakukan pembayaran?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Pembayaran dilakukan via transfer bank atau e-wallet setelah pesanan dikonfirmasi melalui WhatsApp.",
        },
      },
      {
        "@type": "Question",
        "name": "Apakah data pribadi saya aman?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ya. Data Anda disimpan dan dikelola dengan aman sesuai kebutuhan layanan yang kami proses.",
        },
      },
      {
        "@type": "Question",
        "name": "Berapa lama proses pengerjaan?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Tergantung layanan, namun kami berupaya menyelesaikan dokumen secepat mungkin sesuai deadline yang disepakati.",
        },
      },
    ],
  };

  return (
    <div className="overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <section className="relative bg-blue-950 py-20">
        {/* Background pattern */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-40 -top-40 h-125 w-125 rounded-full bg-blue-800/20 blur-3xl" />
          <div className="absolute -bottom-20 left-1/3 h-64 w-64 rounded-full bg-blue-700/20 blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
          <span className="mb-4 inline-block rounded-full border border-blue-700/50 bg-blue-900/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-blue-300">
            Cara Kerja Layanan
          </span>
          <h1 className="text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
            Mudah, Cepat, dan<br />
            <span className="text-blue-400">Terpercaya</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-blue-200 sm:text-base">
            Pesan dokumen profesional dalam 4 langkah sederhana. Tidak perlu tatap muka —
            cukup isi formulir, konfirmasi via WhatsApp, dan dokumen siap diterima.
          </p>

          {/* Quick stats */}
          <div className="mx-auto mt-8 grid max-w-sm grid-cols-2 gap-4 sm:max-w-md">
            {[
              { value: "500+", label: "Klien Dilayani" },
              { value: "<24 Jam", label: "Rata-rata Selesai" },
            ].map(s => (
              <div key={s.label} className="rounded-2xl border border-blue-700/40 bg-blue-900/50 py-4">
                <p className="text-2xl font-black text-white">{s.value}</p>
                <p className="text-xs text-blue-300">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 50L1440 0V50H0Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          4 LANGKAH
      ══════════════════════════════════════════ */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14 text-center">
            <span className="mb-3 inline-block rounded-full bg-blue-100 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-blue-700">
              Alur Pemesanan
            </span>
            <h2 className="text-3xl font-black text-slate-900 sm:text-4xl">
              4 Langkah Mudah
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-500 text-sm">
              Dari pilih layanan hingga dokumen di tangan Anda — semuanya bisa selesai hari ini.
            </p>
          </div>

          {/* Desktop: horizontal timeline */}
          <div className="hidden lg:block">
            {/* Connector line */}
            <div className="relative mb-10">
              <div className="absolute left-[12.5%] right-[12.5%] top-10 h-0.5 bg-linear-to-r from-blue-600 via-violet-500 to-amber-500" />
              <div className="grid grid-cols-4 gap-6">
                {STEPS.map(step => (
                  <div key={step.number} className="flex flex-col items-center text-center">
                    {/* Icon circle */}
                    <div className={`relative z-10 flex h-20 w-20 items-center justify-center rounded-full ${step.iconBg} text-white shadow-lg`}>
                      {step.icon}
                      <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white text-[10px] font-black shadow-md" style={{ color: step.iconBg.replace("bg-","").includes("blue") ? "#2563eb" : step.iconBg.replace("bg-","").includes("violet") ? "#7c3aed" : step.iconBg.replace("bg-","").includes("emerald") ? "#059669" : "#d97706" }}>
                        {step.number.replace("0","")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-6">
              {STEPS.map(step => (
                <div key={step.number} className={`rounded-2xl border ${step.borderColor} ${step.lightColor} p-5`}>
                  <p className={`mb-1 text-xs font-bold uppercase tracking-widest ${step.textColor}`}>
                    Langkah {step.number}
                  </p>
                  <h3 className="text-base font-black text-slate-900">{step.title}</h3>
                  <p className={`mt-0.5 text-xs font-semibold ${step.textColor}`}>{step.subtitle}</p>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{step.description}</p>
                  <div className={`mt-3 rounded-xl border ${step.borderColor} bg-white/70 p-3`}>
                    <p className="text-xs text-slate-500 leading-relaxed">💡 {step.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile: vertical timeline */}
          <div className="lg:hidden space-y-0">
            {STEPS.map((step, i) => (
              <div key={step.number} className="flex gap-4">
                {/* Left: icon + line */}
                <div className="flex flex-col items-center">
                  <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${step.iconBg} text-white shadow-md`}>
                    {step.icon}
                  </div>
                  {i < STEPS.length - 1 && (
                      <div className="mt-1 w-0.5 flex-1 bg-linear-to-b from-slate-300 to-transparent" style={{ minHeight: "40px" }} />
                  )}
                  <p className={`mb-1 text-[10px] font-bold uppercase tracking-widest ${step.textColor}`}>
                    Langkah {step.number}
                  </p>
                  <h3 className="text-sm font-black text-slate-900">{step.title}</h3>
                  <p className={`mt-0.5 text-[11px] font-semibold ${step.textColor}`}>{step.subtitle}</p>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">{step.description}</p>
                  <div className={`mt-2 rounded-xl border ${step.borderColor} bg-white/70 p-2.5`}>
                    <p className="text-[11px] text-slate-500 leading-relaxed">💡 {step.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          WAKTU PENGERJAAN
      ══════════════════════════════════════════ */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <span className="mb-3 inline-block rounded-full bg-blue-100 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-blue-700">
              Estimasi Pengerjaan
            </span>
            <h2 className="text-3xl font-black text-slate-900 sm:text-4xl">
              Berapa Lama Prosesnya?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-500 text-sm">
              Estimasi waktu pengerjaan untuk setiap layanan. Dimulai setelah pembayaran dikonfirmasi.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICE_TIMES.map(s => (
              <div key={s.name} className={`rounded-2xl border ${s.color} p-5 transition-all hover:shadow-md hover:-translate-y-0.5`}>
                <div className="mb-3 flex items-start justify-between gap-2">
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">{s.name}</h3>
                  {s.revisi !== "—" && (
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${s.badge}`}>
                      {s.revisi} revisi
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 shrink-0 text-slate-400" />
                    <span className="text-sm font-black text-slate-800">{s.time}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
                    <span className="text-xs text-slate-500">{s.notes}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-4">
            <p className="text-center text-sm text-blue-700">
              ⚡ <span className="font-bold">Butuh lebih cepat?</span> Kami menerima pesanan urgent.
              Hubungi admin langsung via WhatsApp untuk diskusi estimasi pengerjaan express.
            </p>
          </div>
        </div>
      </section>

      {/* Wave */}
      <div className="bg-slate-50">
        <svg viewBox="0 0 1440 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 0L1440 40V0H0Z" fill="white" />
        </svg>
      </div>

      {/* ══════════════════════════════════════════
          JAMINAN LAYANAN
      ══════════════════════════════════════════ */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <span className="mb-3 inline-block rounded-full bg-blue-100 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-blue-700">
              Komitmen Kami
            </span>
            <h2 className="text-3xl font-black text-slate-900 sm:text-4xl">
              Jaminan Layanan
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-500 text-sm">
              Kami berkomitmen memberikan pengalaman terbaik dari awal hingga dokumen di tangan Anda.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {GUARANTEES.map(g => (
              <div key={g.title}
                className="group rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${g.color} transition-transform group-hover:scale-110`}>
                  {g.icon}
                </div>
                <h3 className="mb-2 text-sm font-black text-slate-900">{g.title}</h3>
                <p className="text-xs leading-relaxed text-slate-500">{g.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FAQ
      ══════════════════════════════════════════ */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="mb-12 text-center">
            <span className="mb-3 inline-block rounded-full bg-blue-100 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-blue-700">
              Pertanyaan Umum
            </span>
            <h2 className="text-3xl font-black text-slate-900 sm:text-4xl">
              Ada yang Ingin Ditanyakan?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-500 text-sm">
              Pertanyaan yang paling sering ditanyakan oleh klien kami.
            </p>
          </div>

          <FaqAccordion />

          <div className="mt-8 rounded-2xl border border-blue-200 bg-blue-50 p-5 text-center">
            <p className="text-sm font-semibold text-blue-800">
              Pertanyaan Anda tidak ada di sini?
            </p>
            <p className="mt-1 text-sm text-blue-600">
              Tanya langsung ke admin kami via WhatsApp, kami siap membantu!
            </p>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_ADMIN_WHATSAPP ?? "628123456789"}?text=${encodeURIComponent("Halo, saya ingin bertanya tentang layanan Arifin Docs & Design")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-800 transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              Chat via WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CTA PENUTUP
      ══════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-blue-800 py-20">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-blue-700/40 blur-3xl" />
          <div className="absolute -right-20 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-blue-900/40 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          {/* Rating social proof */}
          <div className="mb-6 flex items-center justify-center gap-2">
            {[1,2,3,4,5].map(s => (
              <Star key={s} className="h-5 w-5 fill-amber-400 text-amber-400" />
            ))}
            <span className="ml-1 text-sm font-semibold text-blue-200">
              Dipercaya 500+ klien
            </span>
          </div>

          <h2 className="text-3xl font-black text-white sm:text-4xl">
            Siap Mulai Sekarang?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-blue-200">
            Sudah paham cara kerjanya? Langsung pilih layanan yang Anda butuhkan
            dan isi formulir — prosesnya hanya butuh beberapa menit.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/#layanan"
              className="group inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-blue-800 shadow-lg transition-all hover:bg-blue-50 hover:-translate-y-0.5"
            >
              Lihat Semua Layanan
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_ADMIN_WHATSAPP ?? "628123456789"}?text=${encodeURIComponent("Halo Arifin Docs & Design, saya ingin konsultasi layanan")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-blue-500/40 bg-blue-700/50 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-blue-700 hover:border-blue-400/60"
            >
              <MessageCircle className="h-4 w-4" />
              Konsultasi Gratis
            </a>
          </div>

          {/* Quick links */}
          <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2">
            {[
              { label: "Testimoni Klien", href: "/testimoni" },
              { label: "CV ATS Friendly", href: "/cv-ats" },
              { label: "Surat Lamaran", href: "/surat-lamaran" },
              { label: "NPWP Online", href: "/npwp" },
            ].map(l => (
              <Link key={l.href} href={l.href}
                className="text-xs text-blue-300 hover:text-white underline underline-offset-2 transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}