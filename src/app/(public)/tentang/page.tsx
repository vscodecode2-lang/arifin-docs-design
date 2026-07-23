import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { generateConsultationWhatsAppLink } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Tentang Kami",
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
            Arifin Docs &amp; Design lahir dari kebutuhan nyata: banyak pencari kerja,
            mahasiswa, dan pelaku usaha merasa dokumen mereka belum cukup kuat untuk
            dipakai di dunia nyata. Kami membantu mengubah dokumen sederhana menjadi
            versi yang lebih rapi, meyakinkan, dan siap dipakai untuk tujuan tertentu.
          </p>
          <p>
            Kami tidak hanya mengandalkan desain visual. Pendekatan kami berfokus pada
            struktur, bahasa, dan format yang sesuai kebutuhan — termasuk standar ATS
            untuk CV, cara penyusunan surat lamaran yang lebih personal, serta dokumen
            legal dan administrasi yang jelas dan mudah dipahami.
          </p>
          <p>
            Nilai yang kami pegang adalah kejelasan, kecepatan, dan transparansi. Setiap
            layanan kami dirancang agar klien bisa memahami prosesnya sejak awal, tahu
            apa yang dibutuhkan, dan menerima hasil yang siap dipakai tanpa harus
            mengulang dari nol.
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
