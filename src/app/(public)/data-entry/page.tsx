import type { Metadata } from "next";
import { DataEntryForm } from "./DataEntryForm";
import { SITE_URL } from "@/lib/metadata";

export const metadata: Metadata = {
  title: "Jasa Data Entry Profesional",
  description:
    "Layanan data entry profesional: convert PDF ke Excel, input produk marketplace, web research, dan input database. Akurasi 99%, pengerjaan cepat, format sesuai permintaan.",
  alternates: { canonical: "/data-entry" },
  keywords: [
    "jasa data entry", "convert PDF ke Excel", "input produk Tokopedia",
    "input produk Shopee", "web scraping data", "jasa input data online",
    "data entry Indonesia", "jasa ketik ulang dokumen",
  ],
  openGraph: {
    title: "Jasa Data Entry Profesional",
    description: "Data entry akurat dan cepat. Convert PDF, input marketplace, web research.",
    type: "website",
    locale: "id_ID",
    url: `${SITE_URL}/data-entry`,
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Jasa Data Entry Profesional" }],
  },
  twitter: {
    title: "Jasa Data Entry Profesional",
    description: "Data entry akurat dan cepat. Convert PDF, input marketplace, web research.",
    card: "summary_large_image",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Jasa Data Entry Profesional" }],
  },
};

export default function DataEntryPage() {
  return <DataEntryForm />;
}