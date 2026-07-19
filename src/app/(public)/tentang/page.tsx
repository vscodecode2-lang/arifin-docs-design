import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { generateConsultationWhatsAppLink } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Tentang Kami | Arifin Docs & Design",
  description: "Kenali Arifin Docs & Design, tim yang membantu klien menyusun dokumen profesional untuk karier dan bisnis.",
  alternates: { canonical: "/tentang" },
};

export default function TentangPage() {
  const waLink = generateConsultationWhatsAppLink();

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">Tentang Kami</p>
        <h1 className="mt-3 text-3xl font-black text-slate-900">Lebih dari Sekadar Jasa Dokumen</h1>

        <div className="mt-5 space-y-4 text-base leading-8 text-slate-600">
          <p>
            Arifin Docs &amp; Design lahir dari masalah yang nyata: banyak pencari
            kerja dan pelaku usaha kesulitan menyiapkan dokumen yang rapi, sesuai
            standar, dan tepat waktu — sementara waktu dan tenaga mereka lebih
            dibutuhkan di tempat lain. Kami hadir untuk mengambil alih beban itu.
          </p>
          <p>
            Berbekal latar belakang teknis, kami memahami bagaimana sistem seperti
            ATS (Applicant Tracking System) sebenarnya membaca dan menyaring CV —
            bukan sekadar menyusun dokumen yang terlihat rapi secara visual.
            Pendekatan ini kami terapkan di setiap layanan, dari CV dan surat
            lamaran hingga dokumen legal dan administrasi.
          </p>
          <p>
            Hingga saat ini, lebih dari 500 klien di seluruh Indonesia telah
            mempercayakan kebutuhan dokumennya kepada kami — mulai dari fresh
            graduate, profesional, mahasiswa, hingga pelaku UMKM.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row">
          <Link
            href="/#layanan"
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-6 py-3 text-sm font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-blue-800"
          >
            Lihat Layanan Kami
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-all hover:border-blue-200 hover:bg-blue-50"
          >
            <MessageCircle className="h-4 w-4" />
            Tanya Dulu via WhatsApp
          </a>
        </div>
      </div>
    </main>
  );
}
