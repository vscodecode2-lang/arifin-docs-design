import type { Metadata } from "next";
import { CvAtsForm } from "../cv-ats/CvAtsForm";
import { SITE_URL } from "@/lib/metadata";

export const metadata: Metadata = {
  title: "Upgrade CV Lama — Optimalkan CV Lama Jadi Siap Lolos ATS",
  description:
    "Upgrade CV lama Anda jadi format ATS-friendly, lebih kuat, dan lebih meyakinkan untuk recruiter. Upload data lama, kami optimalkan untuk peluang lamaran yang lebih besar.",
  alternates: { canonical: "/upgrade-cv" },
  keywords: [
    "upgrade CV lama", "optimasi CV", "jasa upgrade CV", "CV lama siap kerja",
    "CV ATS terbaru", "jasa CV online Indonesia", "perbaiki CV lama",
  ],
  openGraph: {
    title: "Upgrade CV Lama | Arifin Docs & Design",
    description: "Bikin CV lama Anda kembali relevan, lebih rapi, dan siap menembus screening ATS.",
    type: "website",
    locale: "id_ID",
    url: `${SITE_URL}/upgrade-cv`,
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Upgrade CV Lama | Arifin Docs & Design" }],
  },
  twitter: {
    title: "Upgrade CV Lama | Arifin Docs & Design",
    description: "Optimalkan CV lama Anda agar lebih kuat, lebih rapi, dan lebih siap hiring.",
    card: "summary_large_image",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Upgrade CV Lama | Arifin Docs & Design" }],
  },
};

export default function UpgradeCvPage() {
  return (
    <CvAtsForm
      variant={{
        eyebrow: "Layanan Upgrade CV",
        title: "Upgrade CV Lama Jadi Lebih Siap Kerja",
        subtitle: "Isi formulir di bawah untuk audit CV lama, optimasi struktur, dan tingkatkan peluang lolos ATS.",
        privacyNote: "🔒 Data yang Anda kirim aman dan hanya dipakai untuk proses upgrade CV.",
      }}
    />
  );
}
