"use client";

import { useEffect, useState } from "react";

const SLIDES = [
  {
    label: "CV ATS Premium",
    subtitle: "Desain profesional yang dirancang untuk membuat CV Anda terlihat jelas dan mudah dipindai recruiter.",
  },
  {
    label: "Template CV Modern",
    subtitle: "Format elegan dan struktural yang memudahkan HR melihat pengalaman dan kompetensi utama Anda.",
  },
  {
    label: "Preview CV Portofolio",
    subtitle: "Contoh halaman portofolio yang menampilkan hasil kerja dan pencapaian secara ringkas namun bernilai.",
  },
  {
    label: "Template CV Sederhana",
    subtitle: "Versi efisien untuk apply cepat, rapi, dan sesuai standar platform lowongan kerja online.",
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
      <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
        <div
          className="flex min-w-full transition-transform duration-700 ease-out will-change-transform"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {SLIDES.map((slide) => (
            <div key={slide.label} className="w-full flex-shrink-0 px-4 py-8 sm:px-6 lg:py-10">
              <div className="mx-auto w-full max-w-full rounded-[1.75rem] border border-dashed border-slate-200 bg-slate-50 p-6 text-center shadow-inner shadow-slate-100 sm:p-8">
                <div className="mb-5 inline-flex min-h-[190px] w-full items-center justify-center rounded-[1.5rem] bg-slate-100 px-4 text-slate-400 shadow-sm sm:min-h-[220px]">
                  <div>
                    <div className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
                      Placeholder Gambar
                    </div>
                    <div className="text-lg font-bold text-slate-900">{slide.label}</div>
                  </div>
                </div>
                <p className="mx-auto max-w-xl text-sm leading-relaxed text-slate-500 sm:text-base">
                  {slide.subtitle}
                </p>
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
