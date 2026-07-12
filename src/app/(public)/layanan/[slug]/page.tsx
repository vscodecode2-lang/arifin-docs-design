import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  ArrowRight, CheckCircle2, MessageCircle, Star, ChevronRight,
} from "lucide-react";
import { LAYANAN_LIST, getLayananBySlug } from "@/data/layanan";
import { SITE_URL, buildPageMetadata, buildImageMetadata } from "@/lib/metadata";
import { createAdminSupabaseClient } from "@/lib/supabase-admin";
import { generateWhatsAppLink } from "@/lib/utils";
import { ServiceFaqAccordion } from "@/components/layanan/ServiceFaqAccordion";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import type { Testimoni } from "@/types/testimoni";

// PERFORMANCE: statis di build time (generateStaticParams) + revalidate
// berkala, sama seperti pola di homepage — cepat disajikan dari CDN cache,
// testimoni baru tetap muncul otomatis tanpa perlu redeploy.
export const revalidate = 1800; // detik (30 menit)

// ─── Static params ───────────────────────────────────────────────────────

export function generateStaticParams() {
  return LAYANAN_LIST.map((item) => ({ slug: item.slug }));
}

// ─── Metadata ─────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const layanan = getLayananBySlug(slug);
  if (!layanan) return {};

  return buildPageMetadata({
    title: layanan.metaTitle,
    description: layanan.metaDescription,
    path: `/layanan/${layanan.slug}`,
    openGraph: {
      images: buildImageMetadata(`${layanan.title} | Arifin Docs & Design`),
    },
    twitter: {
      images: buildImageMetadata(`${layanan.title} | Arifin Docs & Design`),
    },
  });
}

// ─── Data fetching ────────────────────────────────────────────────────────

async function fetchServiceTestimonials(serviceTypeKey: string): Promise<Testimoni[]> {
  try {
    // Sama seperti pola di ComingSoonAndTestimoni.tsx — admin client dipakai
    // karena query-nya tetap (tidak menerima input pengguna), jadi halaman
    // ini bisa tetap statis/ISR alih-alih dipaksa dynamic oleh cookies().
    const supabase = createAdminSupabaseClient();
    const { data } = await supabase
      .from("testimonials")
      .select("id, client_name, service_type, avg_rating, highlight, photo_type, photo_data, approved_at")
      .eq("status", "approved")
      .eq("service_type", serviceTypeKey)
      .order("avg_rating", { ascending: false })
      .order("approved_at", { ascending: false })
      .limit(3);

    return (data ?? []) as Testimoni[];
  } catch {
    return [];
  }
}

// ─── Small UI helpers ─────────────────────────────────────────────────────

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`Rating ${rating.toFixed(1)} dari 5`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`h-3.5 w-3.5 ${
            s <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"
          }`}
        />
      ))}
    </div>
  );
}

function Avatar({ item }: { item: Testimoni }) {
  const initials = item.client_name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  const colors = ["#1e3a8a", "#7c3aed", "#0369a1", "#16a34a", "#d97706", "#dc2626"];
  const color = colors[item.client_name.charCodeAt(0) % colors.length];

  if (item.photo_type === "anonymous") {
    return <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-base">🙈</div>;
  }
  return (
    <div
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
      style={{ background: color }}
    >
      {initials}
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────

export default async function LayananDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const layanan = getLayananBySlug(slug);
  if (!layanan) notFound();

  const testimonials = await fetchServiceTestimonials(layanan.serviceTypeKey);
  const Icon = layanan.icon;
  const waLink = generateWhatsAppLink(layanan.title);

  const pageUrl = `${SITE_URL}/layanan/${layanan.slug}`;

  const jsonLdService = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: layanan.title,
    description: layanan.metaDescription,
    url: pageUrl,
    provider: {
      "@type": "LocalBusiness",
      name: "Arifin Docs & Design",
      url: SITE_URL,
    },
    areaServed: { "@type": "Country", name: "Indonesia" },
    offers: {
      "@type": "Offer",
      priceCurrency: "IDR",
      url: `${SITE_URL}${layanan.formHref}`,
    },
  };

  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Beranda", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Layanan", item: `${SITE_URL}/#layanan` },
      { "@type": "ListItem", position: 3, name: layanan.title, item: pageUrl },
    ],
  };

  return (
    <div className="overflow-x-hidden">
      <ScrollReveal />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdService) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />

      {/* ══════════ BREADCRUMB ══════════ */}
      <div className="border-b border-slate-100 bg-white">
        <nav
          aria-label="Breadcrumb"
          className="mx-auto flex max-w-6xl items-center gap-1.5 px-4 py-3 text-xs text-slate-500 sm:px-6 lg:px-8"
        >
          <Link href="/" className="hover:text-blue-700">Beranda</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/#layanan" className="hover:text-blue-700">Layanan</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="font-medium text-slate-700">{layanan.title}</span>
        </nav>
      </div>

      {/* ══════════ HERO ══════════ */}
      <section className="relative overflow-hidden bg-blue-950 py-16 sm:py-20">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <div className="section-text-reveal mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 backdrop-blur-sm">
            <Icon className="h-4 w-4 text-sky-300" />
            <span className="text-xs font-semibold uppercase tracking-widest text-sky-100">
              {layanan.category}
            </span>
            {layanan.badge && (
              <span className="ml-1 rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-bold uppercase text-blue-950">
                {layanan.badge}
              </span>
            )}
          </div>

          <h1 className="section-text-reveal section-text-reveal-delay-1 text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
            {layanan.painHeadline}
          </h1>

          <p className="section-text-reveal section-text-reveal-delay-2 mx-auto mt-5 max-w-2xl text-base leading-relaxed text-blue-100/90 sm:text-lg">
            {layanan.solutionBody}
          </p>

          <div className="section-text-reveal section-text-reveal-delay-3 mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={layanan.formHref}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-blue-800 shadow-lg transition-all hover:-translate-y-0.5 hover:bg-blue-50 sm:w-auto"
            >
              Pesan {layanan.title}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10 sm:w-auto"
            >
              <MessageCircle className="h-4 w-4" />
              Tanya Dulu via WhatsApp
            </a>
          </div>

          <p className="section-text-reveal section-text-reveal-delay-4 mt-5 text-sm font-semibold text-sky-200">
            {layanan.priceLabel} · {layanan.priceNote}
          </p>
        </div>
      </section>

      {/* ══════════ PAIN → SOLUTION ══════════ */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="section-text-reveal rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-widest text-rose-600">Masalahnya</p>
            <p className="mt-2 text-base leading-relaxed text-slate-700 sm:text-lg">{layanan.painBody}</p>
          </div>
          <div className="section-text-reveal section-text-reveal-delay-1 mt-4 rounded-3xl border border-blue-200 bg-blue-50 p-6 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-700">Solusi Kami</p>
            <p className="mt-2 text-base leading-relaxed text-slate-700 sm:text-lg">{layanan.solutionBody}</p>
          </div>
        </div>
      </section>

      {/* ══════════ BENEFITS ══════════ */}
      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="section-text-reveal mb-10 text-center">
            <h2 className="text-2xl font-black text-slate-900 sm:text-3xl">
              Kenapa Pesan {layanan.title} di Sini?
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {layanan.benefits.map((benefit, i) => {
              const BenefitIcon = benefit.icon;
              return (
                <div
                  key={benefit.title}
                  className={`section-text-reveal section-text-reveal-delay-${Math.min(i + 1, 4)} rounded-2xl border border-slate-200 bg-white p-5 shadow-sm`}
                >
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                    <BenefitIcon className="h-5 w-5" />
                  </div>
                  <p className="text-sm font-bold text-slate-900">{benefit.title}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{benefit.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════ TESTIMONIALS ══════════ */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="section-text-reveal mb-10 text-center">
            <span className="mb-3 inline-block rounded-full bg-blue-100 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-blue-700">
              Kata Klien
            </span>
            <h2 className="text-2xl font-black text-slate-900 sm:text-3xl">
              Pengalaman Klien {layanan.title}
            </h2>
          </div>

          {testimonials.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((item) => (
                <div key={item.id} className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <StarRating rating={item.avg_rating} />
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">{item.highlight}</p>
                  <div className="mt-4 flex items-center gap-2.5 border-t border-slate-100 pt-3">
                    <Avatar item={item} />
                    <p className="text-sm font-semibold text-slate-900">{item.client_name}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mx-auto max-w-xl rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
              <p className="text-sm text-slate-500">
                Belum ada testimoni untuk layanan ini. Lihat testimoni klien dari layanan lain di{" "}
                <Link href="/testimoni" className="font-semibold text-blue-700 hover:underline">
                  halaman testimoni
                </Link>.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ══════════ PRICING + CTA ══════════ */}
      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="section-text-reveal overflow-hidden rounded-[28px] border border-blue-200 bg-gradient-to-br from-blue-700 via-blue-800 to-slate-900 p-8 text-center text-white shadow-xl sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-200">Investasi</p>
            <p className="mt-2 text-4xl font-black">{layanan.priceLabel}</p>
            <p className="mt-1 text-sm text-blue-200">{layanan.priceNote}</p>
            <div className="mx-auto mt-6 flex max-w-sm items-center justify-center gap-2 text-sm text-blue-100">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-300" />
              Konsultasi gratis sebelum & sesudah pengerjaan
            </div>
            <Link
              href={layanan.formHref}
              className="group mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-blue-800 shadow-lg transition-all hover:-translate-y-0.5 hover:bg-blue-50"
            >
              Pesan {layanan.title} Sekarang
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════ FAQ ══════════ */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="section-text-reveal mb-8 text-center">
            <h2 className="text-2xl font-black text-slate-900 sm:text-3xl">Pertanyaan Umum</h2>
          </div>
          <ServiceFaqAccordion items={layanan.faqs} />
          <p className="mt-6 text-center text-sm text-slate-500">
            Masih ada pertanyaan lain? Lihat{" "}
            <Link href="/cara-kerja" className="font-semibold text-blue-700 hover:underline">
              alur pemesanan lengkap
            </Link>{" "}
            atau langsung{" "}
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-700 hover:underline">
              tanya admin via WhatsApp
            </a>.
          </p>
        </div>
      </section>
    </div>
  );
}
