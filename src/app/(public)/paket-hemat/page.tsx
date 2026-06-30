import type { Metadata } from "next";
import { PaketHematForm } from "./PaketHematForm";

export const metadata: Metadata = {
  title: "Paket Siap Kerja — CV ATS + Surat Lamaran Rp 15.000",
  description:
    "Paket hemat CV ATS Friendly dan Surat Lamaran Profesional hanya Rp 15.000. Cukup isi satu formulir, hemat 67% dibanding beli terpisah. Tersedia add-on QnA Interview HRD.",
  keywords: [
    "paket CV dan surat lamaran", "paket siap kerja",
    "CV ATS murah", "buat CV dan surat lamaran sekaligus",
    "paket dokumen kerja murah", "CV ATS 15000",
    "jasa CV surat lamaran hemat",
  ],
  openGraph: {
    title: "Paket Siap Kerja Rp 15.000 | Arifin Docs & Design",
    description: "CV ATS + Surat Lamaran hanya Rp 15.000. Hemat 67%, cukup isi satu formulir.",
    type: "website",
    locale: "id_ID",
  },
};

export default function PaketHematPage() {
  return <PaketHematForm />;
}