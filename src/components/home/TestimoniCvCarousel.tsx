"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const SLIDES = [
  {
    label: "CV ATS Profesional",
    subtitle: "Contoh CV yang dirancang untuk ATS dan recruiter: rapi, terstruktur, dan langsung menunjukkan keunggulan Anda.",
    imageSrc: "/CV-Uswatun Hasanah.avif",
    alt: "Contoh CV ATS Profesional",
  },
  {
    label: "CV Modern & Bersih",
    subtitle: "Desain modern yang menonjolkan pengalaman, skill, dan ringkasan profil secara elegan.",
    imageSrc: "/Cv_Ina_Mustaghfiroh.avif",
    alt: "Contoh CV modern dan bersih",
  },
  {
    label: "CV Ringkas Berdaya",
    subtitle: "Versi CV yang efektif untuk melamar banyak posisi tanpa kehilangan pesan utama.",
    imageSrc: "/CV_Inda_Hasanah.avif",
    alt: "Contoh CV ringkas berdaya",
  },
];

const AUTO_PLAY_INTERVAL = 5000;

export function TestimoniCvCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % SLIDES.length);
    }, AUTO_PLAY_INTERVAL);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm">
        <div
          className="flex min-w-full transition-transform duration-700 ease-out will-change-transform"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {SLIDES.map((slide) => (
            <div key={slide.label} className="w-full flex-shrink-0 px-4 py-6 sm:px-5 lg:py-8">
              <div className="mx-auto w-full max-w-full rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50 p-4 text-left shadow-inner shadow-slate-100 sm:p-5">
                <div className="mb-4 overflow-hidden rounded-[1.25rem] bg-slate-100 shadow-sm">
                  <div className="relative aspect-[3/4] w-full bg-slate-100 sm:aspect-[9/12]">
                    <Image
                      src={slide.imageSrc}
                      alt={slide.alt}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="mb-3 text-left">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                    {slide.label}
                  </div>
                  <p className="text-lg font-bold text-slate-900 sm:text-xl">{slide.subtitle}</p>
                </div>
                <Link
                  href="/layanan/cv-ats"
                  className="group mt-5 inline-flex items-center gap-2 rounded-full bg-blue-700 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-blue-800"
                >
                  Order Sekarang
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {SLIDES.map((_, index) => (
          <button
            key={index}
            type="button"
            aria-label={`Slide ${index + 1}`}
            className={`h-2.5 w-8 rounded-full transition-all duration-300 ${
              index === activeIndex ? "bg-blue-700" : "bg-slate-300 hover:bg-slate-400"
            }`}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}
