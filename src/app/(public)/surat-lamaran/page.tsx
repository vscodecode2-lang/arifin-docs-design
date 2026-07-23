import type { Metadata } from "next";
import { SuratLamaranForm } from "./SuratLamaranForm";
import { SITE_URL } from "@/lib/metadata";

export const metadata: Metadata = {
  title: "Surat Lamaran Profesional",
  description:
    "Jasa pembuatan surat lamaran kerja profesional. Ditulis personal, formal, dan dioptimasi ATS. Cocok untuk fresh graduate, profesional, dan career switcher.",
  alternates: { canonical: "/surat-lamaran" },
  keywords: [
    "jasa surat lamaran", "buat surat lamaran profesional",
    "surat lamaran kerja", "surat lamaran fresh graduate",
    "surat lamaran ATS", "jasa surat lamaran online Indonesia",
  ],
  openGraph: {
    title: "Surat Lamaran Profesional",
    description: "Surat lamaran personal yang memikat HRD sejak kalimat pertama.",
    type: "website",
    locale: "id_ID",
    url: `${SITE_URL}/surat-lamaran`,
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Surat Lamaran Profesional" }],
  },
  twitter: {
    title: "Surat Lamaran Profesional",
    description: "Surat lamaran personal yang memikat HRD sejak kalimat pertama.",
    card: "summary_large_image",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Surat Lamaran Profesional" }],
  },
};

export default function SuratLamaranPage() {
  return <SuratLamaranForm />;
}