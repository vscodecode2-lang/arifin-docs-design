import type { Metadata } from "next";
import { CvAtsForm } from "./CvAtsForm";
import { SITE_URL } from "@/lib/metadata";

export const metadata: Metadata = {
  title: "CV ATS Friendly — Lolos Sistem Rekrutmen Otomatis",
  description:
    "Jasa pembuatan CV ATS Friendly profesional. CV Anda dioptimasi dengan keyword industri terkini agar lolos sistem ATS perusahaan modern. Cepat, aman, dan terpercaya.",
  alternates: { canonical: "/cv-ats" },
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
    url: `${SITE_URL}/cv-ats`,
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "CV ATS Friendly — Lolos Sistem ATS | Arifin Docs & Design" }],
  },
  twitter: {
    title: "CV ATS Friendly | Arifin Docs & Design",
    description: "CV profesional yang lolos sistem ATS. Dioptimasi dengan keyword industri terkini.",
    card: "summary_large_image",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "CV ATS Friendly — Lolos Sistem ATS | Arifin Docs & Design" }],
  },
};

export default function CvAtsPage() {
  return <CvAtsForm />;
}