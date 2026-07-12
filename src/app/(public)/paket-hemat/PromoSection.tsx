import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock3, RefreshCw, Sparkles, Zap } from "lucide-react";

const INCLUDES = [
  { icon: "📄", label: "CV ATS Friendly", sub: "Format lolos sistem ATS 2025" },
  { icon: "✉️", label: "Surat Lamaran Profesional", sub: "Personalisasi per perusahaan" },
  { icon: "🔄", label: "Revisi Sampai Deal", sub: "Sampai dokumen sempurna" },
  { icon: "⚡", label: "Pengerjaan Kurang dari 12 Jam", sub: "Di hari kerja" },
];

const ADDONS = [
  { icon: "🎯", label: "Simulasi QnA Interview HRD", price: "+Rp 10.000", sub: "10–15 pertanyaan custom sesuai posisi" },
];

export function PromoSection() {
  return (
    <section className="relative overflow-hidden bg-slate-50 py-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12),_transparent_55%)]" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[32px] border border-blue-200 bg-white shadow-[0_25px_80px_-24px_rgba(37,99,235,0.28)]">
          <div className="grid gap-8 p-8 sm:p-10 lg:grid-cols-[1.05fr_0.95fr] lg:p-12">
            <div className="flex flex-col justify-center">
              <div className="section-text-reveal mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5">
                <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-blue-700">
                  Penawaran Terbatas
                </span>
              </div>

              <h2 className="section-text-reveal section-text-reveal-delay-1 text-3xl font-black leading-tight text-slate-900 sm:text-4xl">
                Paket Siap Kerja
                <span className="mt-2 block text-blue-700">Hemat Lebih Banyak</span>
              </h2>

              <p className="section-text-reveal section-text-reveal-delay-2 mt-4 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
                Dapatkan CV ATS Friendly dan Surat Lamaran Profesional dalam satu paket yang lebih hemat, lebih cepat, dan lebih praktis untuk proses lamaran Anda.
              </p>

              <div className="section-text-reveal section-text-reveal-delay-3 mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                  Harga paket
                </p>
                <div className="mt-2 flex flex-wrap items-end gap-3">
                  <span className="text-sm font-medium text-slate-400 line-through">Rp 70.000</span>
                  <span className="text-4xl font-black text-slate-900">Rp 40.000</span>
                  <span className="inline-flex items-center rounded-full bg-blue-600 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                    Diskon up to 57,14%
                  </span>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {INCLUDES.map((item) => (
                  <div key={item.label} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-base">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{item.label}</p>
                      <p className="text-xs text-slate-500">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="section-text-reveal section-text-reveal-delay-4 mt-7 flex flex-wrap gap-3">
                <Link
                  href="/layanan/paket-hemat"
                  className="group inline-flex items-center gap-2 rounded-xl bg-blue-700 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-700/20 transition-all hover:-translate-y-0.5 hover:bg-blue-800"
                >
                  Lihat Detail Paket
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <a
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_ADMIN_WHATSAPP ?? "6285801193410"}?text=${encodeURIComponent("Halo, saya ingin tanya lebih lanjut tentang Paket Siap Kerja")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-6 py-3 text-sm font-semibold text-blue-700 transition-all hover:bg-blue-100"
                >
                  Tanya Dulu
                </a>
              </div>
            </div>

            <div className="flex items-stretch">
              <div className="w-full rounded-[28px] border border-blue-100 bg-gradient-to-br from-blue-700 via-blue-800 to-slate-900 p-6 text-white shadow-inner">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-blue-200">
                      Nilai Paket
                    </p>
                    <p className="mt-1 text-2xl font-black">Siap Pakai, Siap Lamar</p>
                  </div>
                  <div className="rounded-full bg-white/15 p-2">
                    <Zap className="h-5 w-5 text-amber-300" />
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {[
                    { icon: <CheckCircle2 className="h-4 w-4 text-emerald-300" />, text: "CV ATS Friendly siap dikirim" },
                    { icon: <CheckCircle2 className="h-4 w-4 text-emerald-300" />, text: "Surat Lamaran personal & profesional" },
                    { icon: <RefreshCw className="h-4 w-4 text-cyan-300" />, text: "Revisi gratis hingga dokumen sempurna" },
                    { icon: <Clock3 className="h-4 w-4 text-sky-300" />, text: "Selesai dalam kurang dari 12 jam" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/10 px-3 py-2.5">
                      {item.icon}
                      <span className="text-sm text-blue-50">{item.text}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-2xl border border-white/15 bg-white/10 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-blue-200">
                        Add-on tersedia
                      </p>
                      <p className="mt-1 text-sm font-semibold text-white">Simulasi QnA Interview HRD</p>
                    </div>
                    <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-white">
                      +Rp 10.000
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}