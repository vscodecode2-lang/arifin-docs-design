import Image from "next/image";
import Link from "next/link";
import { Mail, MessageCircle, FileText, ShoppingBag, Shield } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FooterLink {
  label: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const FOOTER_SECTIONS: FooterSection[] = [
  {
    title: "Layanan Jasa",
    links: [
      { label: "Paket Siap Kerja (Hemat)", href: "/layanan/paket-hemat" },
      { label: "CV ATS Friendly", href: "/layanan/cv-ats" },
      { label: "Surat Lamaran Profesional", href: "/layanan/surat-lamaran" },
      { label: "Surat Legal", href: "/layanan/legal" },
      { label: "Pendaftaran NPWP", href: "/layanan/npwp" },
      { label: "Pendampingan Akademik", href: "/layanan/akademik" },
      { label: "Data Entry", href: "/layanan/data-entry" },
    ],
  },
  {
    title: "Produk Digital",
    links: [
      { label: "Simulasi Interview HRD", href: "#produk" },
      { label: "Install Claude Code", href: "#produk" },
      { label: "Buat Website dengan Prompt", href: "#produk" },
      { label: "Install Ulang Windows", href: "#produk" },
      { label: "Setup Linux", href: "#produk" },
      { label: "Template Laporan Keuangan", href: "#produk" },
    ],
  },
  {
    title: "Informasi",
    links: [
      { label: "Tentang Kami", href: "/tentang" },
      { label: "Kebijakan Privasi", href: "/kebijakan-privasi" },
      { label: "Syarat & Ketentuan", href: "/syarat-ketentuan" },
      { label: "Login Admin", href: "/login" },
    ],
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-blue-950 text-white">
      {/* ── Top Section ── */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-4 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            {/* Logo */}
            <Link href="/" className="inline-flex items-center gap-2 group">
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white shadow-md transition-transform group-hover:scale-105">
                <Image
                  src="/logo.avif"
                  alt="Arifin Docs & Design"
                  fill
                  sizes="40px"
                  className="object-contain p-1"
                />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-bold text-white">Arifin Docs</span>
                <span className="text-xs font-medium text-blue-400 tracking-wider uppercase">
                  & Design
                </span>
              </div>
            </Link>

            {/* Tagline */}
            <p className="mt-4 text-sm leading-relaxed text-blue-200">
              Solusi dokumen profesional untuk karir dan bisnis Anda. Cepat, aman, dan terpercaya.
            </p>

            {/* Trust Badges */}
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 rounded-full border border-blue-700 bg-blue-900 px-3 py-1 text-xs font-medium text-blue-300">
                <Shield size={11} />
                Data Aman
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-blue-700 bg-blue-900 px-3 py-1 text-xs font-medium text-blue-300">
                <FileText size={11} />
                Dokumen Profesional
              </span>
            </div>

            {/* Contact */}
            <div className="mt-6 space-y-2">
              <a
                href="https://wa.me/6285801193410"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-blue-300 transition-colors hover:text-white"
              >
                <MessageCircle size={15} />
                WhatsApp Admin
              </a>
              <a
                href="mailto:muhamadarifin.dev@gmail.com"
                className="flex items-center gap-2 text-sm text-blue-300 transition-colors hover:text-white"
              >
                <Mail size={15} />
                muhamadarifin.dev@gmail.com
              </a>
            </div>
          </div>

          {/* Link Columns */}
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title}>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-blue-400">
                {section.title}
              </h3>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-blue-200 transition-colors hover:text-white hover:underline underline-offset-2"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="border-t border-blue-900">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 sm:flex-row sm:px-6 lg:px-8">
          <p className="text-xs text-blue-400">
            © {currentYear} Arifin Docs & Design. Seluruh hak dilindungi.
          </p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-xs text-blue-500">
              <ShoppingBag size={12} />
              Produk Digital tersedia di Lynk.id
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
