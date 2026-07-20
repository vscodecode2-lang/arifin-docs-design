import Link from "next/link";
import { TestimoniCvCarousel } from "./TestimoniCvCarousel";

export function TestimoniCvSection() {
  return (
    <section id="testimoni-cv" className="bg-slate-50 py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="section-text-reveal mb-8 text-center">
          <span className="mb-3 inline-block rounded-full bg-blue-100 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-blue-700">
            Bukti Kualitas
          </span>
          <h2 className="text-3xl font-black text-slate-900 sm:text-4xl">
            Visual Testimoni CV & Template yang Meningkatkan Kepercayaan
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-500">
            Lihat contoh tampilan CV dan template profesional yang kami kerjakan. Ganti placeholder ini dengan hasil nyata dari klien Anda untuk memberi bukti visual yang kuat.
          </p>
        </div>

        <div className="mb-8">
          <TestimoniCvCarousel />
        </div>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 text-center sm:flex-row sm:justify-center">
          <Link
            href="/testimoni"
            className="inline-flex items-center justify-center rounded-full border border-transparent bg-blue-700 px-8 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800"
          >
            Apa kata mereka
          </Link>
          <p className="max-w-xl text-sm text-slate-500">
            Ganti placeholder ini kapan saja dengan gambar tesimoni CV & template yang sebenarnya.
          </p>
        </div>
      </div>
    </section>
  );
}
