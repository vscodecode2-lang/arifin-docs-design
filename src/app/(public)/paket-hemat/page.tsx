import type { Metadata } from "next";
import { PaketHematForm } from "./PaketHematForm";

export const metadata: Metadata = {
  title: "Paket Siap Kerja — CV ATS + Surat Lamaran Rp 40.000",
  description:
    "Paket hemat CV ATS Friendly dan Surat Lamaran Profesional mulai Rp 40.000. Cukup isi satu formulir, hemat dibanding membeli terpisah. Tersedia add-on QnA Interview HRD.",
  alternates: { canonical: "/paket-hemat" },
  keywords: [
    "paket CV dan surat lamaran", "paket siap kerja",
    "CV ATS murah", "buat CV dan surat lamaran sekaligus",
    "paket dokumen kerja murah", "CV ATS 40000",
    "jasa CV surat lamaran hemat",
  ],
  openGraph: {
    title: "Paket Siap Kerja Rp 40.000 | Arifin Docs & Design",
    description: "CV ATS + Surat Lamaran mulai Rp 40.000. Cukup isi satu formulir, hasil profesional.",
    type: "website",
    locale: "id_ID",
    url: "https://arifindocs.id/paket-hemat",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Paket Siap Kerja — CV ATS + Surat Lamaran | Arifin Docs & Design" }],
  },
  twitter: {
    title: "Paket Siap Kerja Rp 40.000 | Arifin Docs & Design",
    description: "CV ATS + Surat Lamaran mulai Rp 40.000. Cukup isi satu formulir, hasil profesional.",
    card: "summary_large_image",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Paket Siap Kerja — CV ATS + Surat Lamaran | Arifin Docs & Design" }],
  },
};

export default function PaketHematPage() {
  return <PaketHematForm />;
}