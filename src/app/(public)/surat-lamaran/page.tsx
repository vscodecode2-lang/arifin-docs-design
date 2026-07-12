import type { Metadata } from "next";
import { SuratLamaranForm } from "./SuratLamaranForm";

export const metadata: Metadata = {
  title: "Surat Lamaran Profesional — Personal & Memikat HRD",
  description:
    "Jasa pembuatan surat lamaran kerja profesional. Ditulis personal, formal, dan dioptimasi ATS. Cocok untuk fresh graduate, profesional, dan career switcher.",
  alternates: { canonical: "/surat-lamaran" },
  keywords: [
    "jasa surat lamaran", "buat surat lamaran profesional",
    "surat lamaran kerja", "surat lamaran fresh graduate",
    "surat lamaran ATS", "jasa surat lamaran online Indonesia",
  ],
  openGraph: {
    title: "Surat Lamaran Profesional | Arifin Docs & Design",
    description: "Surat lamaran personal yang memikat HRD sejak kalimat pertama.",
    type: "website",
    locale: "id_ID",
  },
};

export default function SuratLamaranPage() {
  return <SuratLamaranForm />;
}