import type { Metadata } from "next";
import { PaketHematForm } from "./PaketHematForm";
import { SITE_URL } from "@/lib/metadata";

export const metadata: Metadata = {
  title: "Paket Siap Kerja",
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
    title: "Paket Siap Kerja",
    description: "CV ATS + Surat Lamaran mulai Rp 40.000. Cukup isi satu formulir, hasil profesional.",
    type: "website",
    locale: "id_ID",
    url: `${SITE_URL}/paket-hemat`,
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Paket Siap Kerja" }],
  },
  twitter: {
    title: "Paket Siap Kerja",
    description: "CV ATS + Surat Lamaran mulai Rp 40.000. Cukup isi satu formulir, hasil profesional.",
    card: "summary_large_image",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Paket Siap Kerja" }],
  },
};

export default function PaketHematPage() {
  return <PaketHematForm />;
}