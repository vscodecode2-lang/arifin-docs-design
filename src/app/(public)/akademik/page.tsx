import type { Metadata } from "next";
import { AkademikForm } from "./AkademikForm";

export const metadata: Metadata = {
  title: "Pendampingan Akademik — Tugas, PPT, Makalah & Skripsi",
  description:
    "Jasa pendampingan akademik: bantuan tugas coding, PPT presentasi, makalah, laporan, hingga skripsi. Deadline terjamin, kualitas profesional, revisi termasuk.",
  keywords: [
    "jasa tugas kuliah", "jasa coding tugas", "bantuan skripsi",
    "jasa buat PPT", "jasa makalah", "jasa akademik online",
    "bantuan tugas programming", "jasa laporan kuliah",
  ],
  openGraph: {
    title: "Pendampingan Akademik | Arifin Docs & Design",
    description: "Bantuan tugas, PPT, makalah, dan skripsi. Deadline terjamin, revisi termasuk.",
    type: "website",
    locale: "id_ID",
  },
};

export default function AkademikPage() {
  return <AkademikForm />;
}