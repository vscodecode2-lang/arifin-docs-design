import Link from "next/link";
import { PromoSection } from "./paket-hemat/PromoSection";
import { PriceEstimator } from "@/components/home/PriceEstimator";
import { TestimoniCvSection } from "@/components/home/TestimoniCvSection";
import {
  FileText,
  Mail,
  Building2,
  CreditCard,
  GraduationCap,
  Database,
  ArrowRight,
} from "lucide-react";

import type { Metadata } from "next";
import { SITE_URL } from "@/lib/metadata";
import { generateConsultationWhatsAppLink } from "@/lib/utils";
import { ComingSoonAndTestimoni } from "@/components/home/ComingSoonAndTestimoni";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

// PERFORMANCE: halaman ini sekarang bisa di-generate statis (lihat fix di
// ComingSoonAndTestimoni.tsx) dan disajikan dari cache CDN — jauh lebih
// cepat daripada di-render ulang di server pada setiap request. revalidate
// memastikan testimoni baru tetap muncul otomatis tanpa perlu redeploy.
export const revalidate = 1800; // detik (30 menit)

export const metadata: Metadata = {
  title: "Arifin Docs & Design — Jasa Dokumen Profesional #1",
  description:
    "Layanan CV ATS Friendly, Surat Lamaran, Surat Legal, NPWP Online, Pendampingan Akademik, dan Data Entry profesional. Cepat, aman, dipercaya 500+ klien se-Indonesia.",
  keywords: [
    "jasa dokumen profesional", "CV ATS Friendly",
    "surat lamaran profesional", "jasa NPWP online",
    "jasa data entry", "jasa akademik", "Arifin Docs",
    "jasa dokumen online Indonesia",
  ],
  openGraph: {
    title: "Arifin Docs & Design — Jasa Dokumen Profesional",
    description: "CV ATS, Surat Lamaran, Surat Legal, NPWP, Akademik & Data Entry. 500+ klien puas.",
    type: "website",
    locale: "id_ID",
    siteName: "Arifin Docs & Design",
  },
};

// ─── Types ─────────────────────────────────────────────────────────────────

interface ServiceCard {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  href: string;
  badge?: string;
}

// ─── Data ──────────────────────────────────────────────────────────────────

const CONSULTATION_WA_URL = generateConsultationWhatsAppLink();

const SERVICES: ServiceCard[] = [
  {
    icon: <FileText className="h-6 w-6" />,
    title: "CV ATS Friendly",
    description:
      "Perbesar peluang lolos screening ATS dengan CV profesional yang dioptimalkan sesuai posisi yang Anda lamar. Disusun menggunakan format ATS, keyword yang relevan, dan struktur yang mudah dipindai recruiter hanya dalam hitungan detik. Mulai Rp35.000.",
    features: ["Optimasi penuh format, struktur & keyword ATS",
    "Disesuaikan dengan posisi pekerjaan yang dilamar",
    "Revisi gratis hingga puas + konsultasi tanpa biaya"],
    href: "/layanan/cv-ats",
    badge: "Terlaris",
  },
  {
    icon: <Mail className="h-6 w-6" />,
    title: "Surat Lamaran Profesional",
    description:
    "Tingkatkan kesan pertama di mata recruiter dengan surat lamaran yang ditulis khusus sesuai perusahaan dan posisi yang Anda lamar. Disusun dari nol menggunakan bahasa profesional yang lebih meyakinkan dan siap langsung dikirim. Mulai Rp20.000.",
    features: [ "Ditulis 100% dari nol sesuai perusahaan & posisi",
    "Surat lamaran + draft email lamaran siap kirim",
    "Revisi gratis hingga sesuai + konsultasi tanpa biaya"],
    href: "/layanan/surat-lamaran",
  },
  {
    icon: <Building2 className="h-6 w-6" />,
    title: "Surat Legal",
    description:
      "Butuh dokumen legal yang jelas, profesional, dan siap digunakan? Kami membantu menyusun surat sesuai kebutuhan Anda, mulai dari surat kuasa, perjanjian, surat pernyataan, hingga dokumen administrasi lainnya. Disusun rapi, mudah dipahami, dan siap dicetak. Mulai Rp25.000.",
    features: ["Format resmi & profesional",  
    "Disusun 100% sesuai kebutuhan & tujuan dokumen",
    "File PDF & DOCX siap diedit, dicetak, dan digunakan",
    "Revisi gratis hingga sesuai + konsultasi tanpa biaya"],
    href: "/layanan/legal",
  },
  {
    icon: <CreditCard className="h-6 w-6" />,
    title: "Pendaftaran NPWP Online",
    description:
       "Daftar NPWP Pribadi maupun Badan jadi lebih mudah dengan pendampingan dari awal hingga selesai. Kami membantu setiap proses agar Anda tidak perlu bingung mengurus sendiri, tanpa antre, dengan penanganan data yang aman. Mulai Rp30.000.",
    features: [ "Pendampingan hingga NPWP selesai diterbitkan",
  "Tidak perlu antre & proses lebih praktis",
  "Data diproses dengan aman + konsultasi gratis"],
    href: "/layanan/npwp",
    badge: "Populer",
  },
  {
    icon: <GraduationCap className="h-6 w-6" />,
    title: "Pendampingan Akademik Profesional",
    description:
      "Selesaikan kebutuhan akademik Anda dengan layanan pendampingan profesional untuk tugas, presentasi, makalah, proposal, laporan, dan dokumentasi. Kami membantu menyusun dokumen secara rapi, sistematis, dan siap presentasi. Mulai Rp30.000.",
    features: ["Pendampingan sesuai kebutuhan dan target penyelesaian",
    "Dokumen atau materi disusun rapi, sistematis, dan mudah dipahami",
    "Revisi hingga deadline + konsultasi tanpa biaya"],
    href: "/layanan/akademik",
  },
  {
    icon: <Database className="h-6 w-6" />,
    title: "Data Entry",
    description:
       "Percayakan pekerjaan input data kepada kami agar lebih cepat, akurat, dan hemat waktu. Melayani pengolahan data Excel, Word, Google Sheets, Website/CMS, serta konversi PDF, gambar, atau hasil scan ke format yang Anda butuhkan. Mulai Rp25.000.",
    features: [  "Input data & konversi dokumen sesuai kebutuhan tanpa minimal order",
    "Hasil rapi, akurat, dan melalui quality control sebelum dikirim",
    "Revisi hingga deadline + data dijaga kerahasiaannya"],
    href: "/layanan/data-entry",
  },
];

// ─── Structured Data (JSON-LD) ───────────────────────────────────────────────

const BASE_URL = SITE_URL;

const jsonLdLocalBusiness = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": BASE_URL,
  name: "Arifin Docs & Design",
  description:
    "Layanan CV ATS Friendly, Surat Lamaran, Surat Legal, NPWP Online, Pendampingan Akademik, dan Data Entry profesional. Cepat, aman, dipercaya 500+ klien se-Indonesia.",
  url: BASE_URL,
  telephone: `+${process.env.NEXT_PUBLIC_ADMIN_WHATSAPP ?? "6285801193410"}`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Batang",
    addressRegion: "Jawa Tengah",
    addressCountry: "ID",
  },
  areaServed: {
    "@type": "Country",
    name: "Indonesia",
  },
  priceRange: "Rp",
  // Disamakan dengan jadwal live di KontakClient.tsx (sumber kebenaran
  // jam operasional) — dulu tertulis "Mo-Su 08:00-22:00" yang salah:
  // klaim buka tiap hari sampai jam 22 padahal Minggu tutup dan Sabtu
  // baru buka jam 09.00.
  openingHours: ["Mo-Fr 08:00-21:00", "Sa 09:00-21:00"],
  sameAs: [
    "https://wa.me/6285801193410",
    "https://lynk.id/arifindocspro",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Layanan Jasa Dokumen",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Paket Siap Kerja (CV + Surat Lamaran)", url: `${BASE_URL}/layanan/paket-hemat` } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "CV ATS Friendly", url: `${BASE_URL}/layanan/cv-ats` } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Surat Lamaran Profesional", url: `${BASE_URL}/layanan/surat-lamaran` } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Surat Legal", url: `${BASE_URL}/layanan/legal` } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Pendaftaran NPWP Online", url: `${BASE_URL}/layanan/npwp` } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Pendampingan Akademik", url: `${BASE_URL}/layanan/akademik` } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Data Entry", url: `${BASE_URL}/layanan/data-entry` } },
    ],
  },
};

const jsonLdWebSite = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Arifin Docs & Design",
  url: BASE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${BASE_URL}/?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

// ─── Page Component ─────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div className="overflow-x-hidden">
      <ScrollReveal />
      {/* ── JSON-LD Structured Data ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdLocalBusiness) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }}
      />

      {/* ══════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════ */}
      <section
        className="relative min-h-[92vh] bg-blue-950 bg-cover bg-center bg-no-repeat flex items-center"
        style={{
          backgroundImage: "url('/bghero.avif')",
        }}
      >
        <div className="pointer-events-none absolute inset-0 bg-slate-950/10" />
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left: Copy */}
            <div className="max-w-xl text-left">
              <div className="section-text-reveal mb-6 inline-flex items-center gap-2 rounded-full border border-slate-300/80 bg-white/85 px-4 py-1.5 shadow-sm backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />
                <span className="text-xs font-semibold uppercase tracking-widest text-slate-800">
                  Layanan Dokumen Profesional Indonesia
                </span>
              </div>

              <h1 className="section-text-reveal section-text-reveal-delay-1 text-4xl font-black leading-[1.1] tracking-tight text-slate-950 drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)] sm:text-5xl lg:text-6xl">
                Urusan Dokumen{" "}
                <span className="inline-block animasi-warni">
                  Ribet?
                </span>
                <br />
                Kami Bantu{" "}
                <span className="inline-block animasi-warni">
                  Bereskan.
                </span>
              </h1>

              <p className="section-text-reveal section-text-reveal-delay-2 mt-6 font-[family-name:var(--font-dm-sans)] text-base font-500 leading-relaxed text-slate-900 sm:text-lg">
                Dari CV ATS Friendly, surat lamaran, dokumen legal, NPWP, sampai
                tugas kuliah — kami bantu semuanya selesai cepat dan rapi, siap
                pakai tanpa ribet bolak-balik.
              </p>

              <div className="section-text-reveal section-text-reveal-delay-3 mt-4 flex items-center gap-2">
                <div className="flex -space-x-2">
                  {["B", "A", "R", "S"].map((letter, i) => (
                    <div
                      key={i}
                      className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-slate-900 bg-blue-700 text-xs font-bold text-white"
                    >
                      {letter}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-slate-800">
                  <span className="font-semibold text-slate-950">500+</span> klien
                  sudah menggunakan layanan kami
                </p>
              </div>

              <div className="section-text-reveal section-text-reveal-delay-4 mt-8 flex flex-wrap gap-3">
                <Link
                  href="#layanan"
                  className="group relative overflow-hidden inline-flex items-center gap-2 rounded-xl border border-blue-400/60 bg-transparent px-6 py-3 text-sm font-bold text-blue-700 shadow-lg shadow-blue-600/20 transition-all duration-300 active:scale-95 hover:-translate-y-1 hover:bg-blue-600 hover:text-white hover:shadow-xl hover:shadow-blue-500/40"
                >
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
                  <span className="relative z-10">Lihat Layanan Jasa</span>
                  <ArrowRight className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/testimoni"
                  className="group relative overflow-hidden inline-flex items-center gap-2 rounded-xl border border-emerald-400/60 bg-transparent px-6 py-3 text-sm font-semibold text-emerald-700 backdrop-blur-sm transition-all duration-300 active:scale-95 hover:-translate-y-1 hover:bg-emerald-600 hover:text-white hover:shadow-lg hover:shadow-emerald-400/30"
                >
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
                  <span className="relative z-10">Lihat Testimoni</span>
                  <ArrowRight className="relative z-10 h-4 w-4 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100" />
                </Link>
              </div>

            </div>

            {/* Right: Status shortcut */}
           

          </div>
        </div>

        {/* Diagonal bottom divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 60L1440 0V60H0Z" fill="white" />
          </svg>
        </div>
      </section>

      <TestimoniCvSection />

      {/* ══════════════════════════════════════════
          ESTIMASI HARGA INSTAN
      ══════════════════════════════════════════ */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="section-text-reveal mb-8 text-center">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-blue-600">
              Transparan &amp; Terjangkau
            </p>
            <h2 className="text-2xl font-black text-slate-900 sm:text-3xl">
              Cek Harga Sebelum Pesan
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Pilih layanan dan lihat estimasi harga langsung — tanpa perlu tanya dulu
            </p>
          </div>
          <div className="mx-auto max-w-2xl">
            <PriceEstimator />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          LAYANAN JASA SECTION
      ══════════════════════════════════════════ */}
      <section id="layanan" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="section-text-reveal mb-12 text-center">
            <span className="mb-3 inline-block rounded-full bg-blue-100 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-blue-700">
              Layanan Jasa
            </span>
            <h2 className="text-3xl font-black text-slate-900 sm:text-4xl">
              Semua Dokumen, Satu Tempat
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-500">
              Pilih layanan yang Anda butuhkan. Isi form, kami kerjakan — sesederhana itu.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service) => (
              <Link
                key={service.href}
                href={service.href}
                className="section-text-reveal group relative flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-100/60"
              >
                {service.badge && (
                  <span className="absolute right-4 top-4 rounded-full bg-blue-700 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                    {service.badge}
                  </span>
                )}
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700 transition-colors group-hover:bg-blue-700 group-hover:text-white">
                  {service.icon}
                </div>
                <h3 className="mb-2 text-base font-bold text-slate-900 group-hover:text-blue-800">
                  {service.title}
                </h3>
                <p className="mb-4 text-sm leading-relaxed text-slate-500">
                  {service.description}
                </p>
                <ul className="mb-5 space-y-1.5">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto flex items-center gap-1.5 text-sm font-semibold text-blue-700 group-hover:text-blue-800">
                  Lihat Detail Layanan
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <PromoSection />

      {/* Wave divider */}
      <div className="bg-white">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 0L1440 60V0H0Z" fill="#f8fafc" />
        </svg>
      </div>

      {/* ══════════════════════════════════════════
          COMING SOON + TESTIMONI
      ══════════════════════════════════════════ */}
      <ComingSoonAndTestimoni />

      {/* ══════════════════════════════════════════
          FINAL CTA SECTION
      ══════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-blue-800 py-20">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-blue-700/50 blur-3xl" />
          <div className="absolute -right-20 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-blue-900/50 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-300">
            Siap Memulai?
          </p>
          <h2 className="text-3xl font-black text-white sm:text-4xl">
            Mulai Perjalanan Karir Terbaik Anda Hari Ini
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-blue-200">
            Jangan biarkan dokumen yang kurang profesional menghambat impian Anda.
            Isi formulir layanan kami sekarang — prosesnya mudah dan cepat.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="#layanan"
              className="group inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-blue-800 shadow-lg transition-all hover:bg-blue-50 hover:-translate-y-0.5"
            >
              Pilih Layanan Jasa
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href={CONSULTATION_WA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-blue-500/50 bg-blue-700/50 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:border-blue-400/70 hover:bg-blue-700"
            >
               Konsultasi WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}