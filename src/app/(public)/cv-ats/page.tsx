import type { Metadata } from "next";
import { CvAtsForm } from "./CvAtsForm";

export const metadata: Metadata = {
  title: "CV ATS Friendly — Lolos Sistem Rekrutmen Otomatis",
  description:
    "Jasa pembuatan CV ATS Friendly profesional. CV Anda dioptimasi dengan keyword industri terkini agar lolos sistem ATS perusahaan modern. Cepat, aman, dan terpercaya.",
  keywords: [
    "CV ATS Friendly", "buat CV ATS", "jasa CV profesional",
    "CV lolos ATS", "CV untuk melamar kerja", "CV fresh graduate",
    "CV profesional Indonesia", "jasa CV online",
  ],
  openGraph: {
    title: "CV ATS Friendly | Arifin Docs & Design",
    description: "CV profesional yang lolos sistem ATS. Dioptimasi dengan keyword industri terkini.",
    type: "website",
    locale: "id_ID",
  },
};

export default function CvAtsPage() {
  return <CvAtsForm />;
}