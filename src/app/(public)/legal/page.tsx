import type { Metadata } from "next";
import { LegalForm } from "./LegalForm";
import { SITE_URL } from "@/lib/metadata";

export const metadata: Metadata = {
  title: "Surat Legal Profesional",
  description:
    "Jasa pembuatan surat legal profesional: surat kuasa, surat perjanjian, surat pernyataan, dan dokumen legal lainnya. Sah, terstruktur, dan dikerjakan cepat.",
  alternates: { canonical: "/legal" },
  keywords: [
    "jasa surat legal", "buat surat kuasa", "surat perjanjian online",
    "surat pernyataan profesional", "jasa dokumen legal",
    "buat surat legal online Indonesia",
  ],
  openGraph: {
    title: "Surat Legal Profesional",
    description: "Surat legal profesional untuk kebutuhan administrasi dan bisnis Anda.",
    type: "website",
    locale: "id_ID",
    url: `${SITE_URL}/legal`,
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Surat Legal Profesional" }],
  },
  twitter: {
    title: "Surat Legal Profesional",
    description: "Surat legal profesional untuk kebutuhan administrasi dan bisnis Anda.",
    card: "summary_large_image",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Surat Legal Profesional" }],
  },
};

export default function LegalPage() {
  return <LegalForm />;
}