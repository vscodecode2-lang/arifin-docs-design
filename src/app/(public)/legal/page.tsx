import type { Metadata } from "next";
import { LegalForm } from "./LegalForm";

export const metadata: Metadata = {
  title: "Surat Legal Profesional — Kuasa, Perjanjian & Pernyataan",
  description:
    "Jasa pembuatan surat legal profesional: surat kuasa, surat perjanjian, surat pernyataan, dan dokumen legal lainnya. Sah, terstruktur, dan dikerjakan cepat.",
  alternates: { canonical: "/legal" },
  keywords: [
    "jasa surat legal", "buat surat kuasa", "surat perjanjian online",
    "surat pernyataan profesional", "jasa dokumen legal",
    "buat surat legal online Indonesia",
  ],
  openGraph: {
    title: "Surat Legal Profesional | Arifin Docs & Design",
    description: "Surat legal profesional untuk kebutuhan administrasi dan bisnis Anda.",
    type: "website",
    locale: "id_ID",
  },
};

export default function LegalPage() {
  return <LegalForm />;
}