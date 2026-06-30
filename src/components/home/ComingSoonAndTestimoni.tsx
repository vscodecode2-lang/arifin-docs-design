/**
 * ComingSoonAndTestimoni — Pengganti section Produk Digital.
 *
 * Dua bagian:
 * A) Coming Soon teaser — notifikasi email + 3 card preview blur produk
 * B) Testimoni unggulan — 3 testimoni terbaik dari Supabase (avg_rating tertinggi)
 *
 * Server Component — fetch data di server, tidak ada loading state.
 */

import Link from "next/link";
import { createAdminSupabaseClient } from "@/lib/supabase-admin";
import type { Testimoni } from "@/types/testimoni";
import { ComingSoonClient } from "./ComingSoonClient";
import { TestimoniHighlight } from "./TestimoniHighlight";

// Produk yang akan segera hadir — data statis, ganti sesuai rencana
const COMING_SOON_PRODUCTS = [
  {
    emoji: "📋",
    title: "Panduan Lolos Interview Kerja",
    desc: "100+ simulasi QnA HRD & User Interview dengan jawaban terbaik.",
    badge: "E-Book",
  },
  {
    emoji: "🧠",
    title: "Panduan Psikotes & Tes Kerja",
    desc: "Latihan soal TPA, MBTI, Kraepelin, hingga tes kepribadian lengkap.",
    badge: "E-Book",
  },
  {
    emoji: "📊",
    title: "Template CV Premium Pack",
    desc: "5 template CV ATS siap pakai, tinggal isi data dan kirim lamaran.",
    badge: "Template",
  },
];

async function fetchTopTestimonials(): Promise<Testimoni[]> {
  try {
    // PERFORMANCE: pakai admin client (read-only, query tetap/fixed, tanpa
    // input dari pengguna) bukan client berbasis cookie. Memanggil cookies()
    // membuat Next.js menganggap seluruh halaman "/" sebagai dynamic route
    // (di-render ulang di server pada SETIAP request, tidak bisa di-cache) —
    // padahal testimoni unggulan ini sama untuk semua pengunjung publik.
    const supabase = createAdminSupabaseClient();

    // Ambil 4 testimoni approved dengan avg_rating tertinggi
    const { data: testimonials } = await supabase
      .from("testimonials")
      .select(
        "id, client_name, service_type, avg_rating, highlight, photo_type, photo_data, approved_at"
      )
      .eq("status", "approved")
      .order("avg_rating", { ascending: false })
      .order("approved_at", { ascending: false })
      .limit(4);

    return (testimonials ?? []) as Testimoni[];
  } catch (error) {
    // RESILIENCE: section ini murni dekoratif/pelengkap. Jika
    // SUPABASE_SERVICE_ROLE_KEY belum diset atau Supabase sedang
    // bermasalah, jangan sampai itu menjatuhkan seluruh homepage —
    // tampilkan saja tanpa testimoni unggulan.
    console.error("[ComingSoonAndTestimoni] gagal memuat testimoni:", error);
    return [];
  }
}

export async function ComingSoonAndTestimoni() {
  const topTestimonials = await fetchTopTestimonials();

  return (
    <section id="produk" className="bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-20">

        {/* ── BAGIAN A: Coming Soon ── */}
        <div>
          <div className="mb-10 text-center">
            <span className="mb-3 inline-block rounded-full bg-violet-100 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-violet-700">
              Segera Hadir
            </span>
            <h2 className="text-3xl font-black text-slate-900 sm:text-4xl">
              Produk Digital dalam Persiapan
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-500">
              Kami sedang menyiapkan panduan dan template premium terbaik untuk
              mendukung perjalanan karirmu.
            </p>
          </div>

          {/* Card preview + form notifikasi */}
          <ComingSoonClient products={COMING_SOON_PRODUCTS} />
        </div>

        {/* ── BAGIAN B: Testimoni Unggulan ── */}
        {topTestimonials.length > 0 && (
          <div>
            <div className="section-text-reveal mb-10 text-center">
              <span className="mb-3 inline-block rounded-full bg-yellow-100 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-yellow-700">
                Kata Mereka
              </span>
              <h2 className="text-3xl font-black text-slate-900 sm:text-4xl">
                Dipercaya Ratusan Klien
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-slate-500">
                Testimoni nyata dari klien yang sudah merasakan manfaat layanan
                Arifin Docs &amp; Design.
              </p>
            </div>

            <TestimoniHighlight testimonials={topTestimonials} />

            <div className="mt-8 text-center">
              <Link
                href="/testimoni"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-300 hover:text-blue-700 hover:shadow-md"
              >
                Lihat Semua Testimoni →
              </Link>
            </div>
          </div>
        )}

        {/* Fallback jika belum ada testimoni approved */}
        {topTestimonials.length === 0 && (
          <div className="text-center py-8">
            <p className="text-slate-400 text-sm">
              Jadilah yang pertama memberikan testimoni.{" "}
              <Link href="/testimoni" className="text-blue-600 hover:underline">
                Tulis testimoni →
              </Link>
            </p>
          </div>
        )}

      </div>
    </section>
  );
}
