import type { Metadata } from "next";
import { DataEntryForm } from "./DataEntryForm";

export const metadata: Metadata = {
  title: "Jasa Data Entry Profesional — Akurat & Cepat",
  description:
    "Layanan data entry profesional: convert PDF ke Excel, input produk marketplace, web research, dan input database. Akurasi 99%, pengerjaan cepat, format sesuai permintaan.",
  keywords: [
    "jasa data entry", "convert PDF ke Excel", "input produk Tokopedia",
    "input produk Shopee", "web scraping data", "jasa input data online",
    "data entry Indonesia", "jasa ketik ulang dokumen",
  ],
  openGraph: {
    title: "Jasa Data Entry Profesional | Arifin Docs & Design",
    description: "Data entry akurat dan cepat. Convert PDF, input marketplace, web research.",
    type: "website",
    locale: "id_ID",
  },
};

export default function DataEntryPage() {
  return <DataEntryForm />;
}