import type { Metadata } from "next";
import { SITE_URL } from "@/lib/metadata";
import { UpgradeCvForm } from "./UpgradeCvForm";

export const metadata: Metadata = {
  title: "Upgrade CV Lama",
  description:
    "Upgrade CV lama Anda jadi format ATS-friendly, lebih kuat, dan lebih meyakinkan untuk recruiter. Upload data lama, kami optimalkan untuk peluang lamaran yang lebih besar.",
  alternates: { canonical: "/upgrade-cv" },
  keywords: [
    "upgrade CV lama", "optimasi CV", "jasa upgrade CV", "CV lama siap kerja",
    "CV ATS terbaru", "jasa CV online Indonesia", "perbaiki CV lama",
  ],
  openGraph: {
    title: "Upgrade CV Lama",
    description: "Bikin CV lama Anda kembali relevan, lebih rapi, dan siap menembus screening ATS.",
    type: "website",
    locale: "id_ID",
    url: `${SITE_URL}/upgrade-cv`,
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Upgrade CV Lama" }],
  },
  twitter: {
    title: "Upgrade CV Lama",
    description: "Optimalkan CV lama Anda agar lebih kuat, lebih rapi, dan lebih siap hiring.",
    card: "summary_large_image",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Upgrade CV Lama" }],
  },
};

export default function UpgradeCvPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <div className="mb-8 text-center">
          <span className="mb-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-blue-700">
            Layanan Upgrade CV
          </span>
          <h1 className="text-2xl font-black text-slate-900">Upgrade CV Lama Jadi Lebih Siap Kerja</h1>
          <p className="mt-1 text-sm text-slate-500">
            Isi formulir di bawah untuk mengirimkan CV lama dan foto profesional Anda.
          </p>
        </div>

        <UpgradeCvForm />

        <p className="mt-4 text-center text-xs text-slate-400">
          🔒 Data yang Anda kirim aman dan hanya dipakai untuk proses upgrade CV.
        </p>
      </div>
    </div>
  );
}
