import type { Metadata } from "next";
import { NpwpForm } from "./NpwpForm";

export const metadata: Metadata = {
  title: "Daftar NPWP Online — Cepat, Aman, Tanpa Antri",
  description:
    "Jasa pendaftaran NPWP online untuk karyawan, freelancer, UMKM, dan wirausaha. Proses cepat, panduan lengkap, data terenkripsi. Bantu aktivasi dan perubahan data NPWP.",
  alternates: { canonical: "/npwp" },
  keywords: [
    "daftar NPWP online", "jasa NPWP", "buat NPWP freelancer",
    "NPWP karyawan online", "aktivasi NPWP DJP",
    "jasa pendaftaran NPWP Indonesia", "NPWP UMKM",
  ],
  openGraph: {
    title: "Daftar NPWP Online | Arifin Docs & Design",
    description: "Pendaftaran NPWP online cepat dan aman. Tanpa antri, panduan lengkap.",
    type: "website",
    locale: "id_ID",
  },
};

export default function NpwpPage() {
  return <NpwpForm />;
}