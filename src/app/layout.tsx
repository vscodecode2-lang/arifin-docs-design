import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Base URL satu tempat — dipakai untuk canonical, OG, dan Twitter
const BASE_URL = "https://arifindocs.id";

// OG Image — di-generate oleh src/app/opengraph-image.tsx (1200x630)
const OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "Arifin Docs & Design — Jasa Dokumen Profesional",
};

export const metadata: Metadata = {
  // metadataBase wajib ada agar Next.js bisa resolve URL relatif
  // di openGraph.images, twitter.images, dan alternates.canonical
  metadataBase: new URL(BASE_URL),

  title: {
    default: "Arifin Docs & Design — Jasa Dokumen Profesional",
    template: "%s | Arifin Docs & Design",
  },
  description:
    "Layanan CV ATS Friendly, Surat Lamaran, Surat Legal, NPWP Online, Joki Tugas, dan Data Entry profesional. Cepat, aman, dan terpercaya.",
  keywords: [
    "CV ATS Friendly",
    "Surat Lamaran Profesional",
    "Jasa Dokumen",
    "NPWP Online",
    "Data Entry",
    "Arifin Docs",
  ],
  authors: [{ name: "Arifin Docs & Design" }],

  // Canonical URL — mencegah duplicate content di Google
  alternates: {
    canonical: "/",
  },

  // OpenGraph — tampil saat link di-share ke Facebook, WhatsApp, dll
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "Arifin Docs & Design",
    url: BASE_URL,
    title: "Arifin Docs & Design — Jasa Dokumen Profesional",
    description:
      "Layanan CV ATS Friendly, Surat Lamaran, Surat Legal, NPWP Online, Joki Tugas, dan Data Entry profesional. Cepat, aman, dan terpercaya.",
    images: [OG_IMAGE],
  },

  // Twitter / X Card — tampil saat link di-share ke X/Twitter
  twitter: {
    card: "summary_large_image",
    site: "@arifindocs",
    creator: "@arifindocs",
    title: "Arifin Docs & Design — Jasa Dokumen Profesional",
    description:
      "Layanan CV ATS Friendly, Surat Lamaran, Surat Legal, NPWP Online, Joki Tugas, dan Data Entry profesional. Cepat, aman, dan terpercaya.",
    images: [OG_IMAGE],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={inter.variable}>
      <body className="font-sans bg-white text-slate-800 antialiased">
        {children}
      </body>
    </html>
  );
}
