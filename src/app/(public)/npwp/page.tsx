import type { Metadata } from "next";
import { NpwpForm } from "./NpwpForm";
import { SITE_URL } from "@/lib/metadata";

export const metadata: Metadata = {
  title: "Daftar NPWP Online",
  description:
    "Jasa pendaftaran NPWP online untuk karyawan, freelancer, UMKM, dan wirausaha. Proses cepat, panduan lengkap, data terenkripsi. Bantu aktivasi dan perubahan data NPWP.",
  alternates: { canonical: "/npwp" },
  keywords: [
    "daftar NPWP online", "jasa NPWP", "buat NPWP freelancer",
    "NPWP karyawan online", "aktivasi NPWP DJP",
    "jasa pendaftaran NPWP Indonesia", "NPWP UMKM",
  ],
  openGraph: {
    title: "Daftar NPWP Online",
    description: "Pendaftaran NPWP online cepat dan aman. Tanpa antri, panduan lengkap.",
    type: "website",
    locale: "id_ID",
    url: `${SITE_URL}/npwp`,
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Daftar NPWP Online" }],
  },
  twitter: {
    title: "Daftar NPWP Online",
    description: "Pendaftaran NPWP online cepat dan aman. Tanpa antri, panduan lengkap.",
    card: "summary_large_image",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Daftar NPWP Online" }],
  },
};

export default function NpwpPage() {
  return <NpwpForm />;
}