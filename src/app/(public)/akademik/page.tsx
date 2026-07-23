import type { Metadata } from "next";
import { AkademikForm } from "./AkademikForm";
import { SITE_URL } from "@/lib/metadata";

export const metadata: Metadata = {
  title: "Pendampingan Akademik",
  description:
    "Jasa pendampingan akademik: bantuan tugas coding, PPT presentasi, makalah, laporan, hingga skripsi. Deadline terjamin, kualitas profesional, revisi termasuk.",
  alternates: { canonical: "/akademik" },
  keywords: [
    "jasa tugas kuliah", "jasa coding tugas", "bantuan skripsi",
    "jasa buat PPT", "jasa makalah", "jasa akademik online",
    "bantuan tugas programming", "jasa laporan kuliah",
  ],
  openGraph: {
    title: "Pendampingan Akademik",
    description: "Bantuan tugas, PPT, makalah, dan skripsi. Deadline terjamin, revisi termasuk.",
    type: "website",
    locale: "id_ID",
    url: `${SITE_URL}/akademik`,
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Pendampingan Akademik" }],
  },
  twitter: {
    title: "Pendampingan Akademik",
    description: "Bantuan tugas, PPT, makalah, dan skripsi. Deadline terjamin, revisi termasuk.",
    card: "summary_large_image",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Pendampingan Akademik" }],
  },
};

export default function AkademikPage() {
  return <AkademikForm />;
}