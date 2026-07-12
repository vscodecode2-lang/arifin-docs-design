"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { LayananFaq } from "@/data/layanan";

/**
 * ServiceFaqAccordion — accordion FAQ generik yang menerima `items` sebagai
 * prop, dipakai di halaman detail layanan (/layanan/[slug]).
 *
 * Sengaja dibuat terpisah dari FaqAccordion di /cara-kerja (yang FAQ-nya
 * hardcode) supaya halaman cara-kerja yang sudah berjalan baik tidak perlu
 * disentuh sama sekali.
 */
export function ServiceFaqAccordion({ items }: { items: LayananFaq[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {items.map((faq, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={faq.question}
            className={`overflow-hidden rounded-2xl border transition-all duration-200 ${
              isOpen
                ? "border-blue-200 bg-blue-50/50 shadow-sm"
                : "border-slate-200 bg-white hover:border-blue-200"
            }`}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              aria-expanded={isOpen}
            >
              <span className={`text-sm font-semibold leading-snug ${isOpen ? "text-blue-800" : "text-slate-800"}`}>
                {faq.question}
              </span>
              <ChevronDown
                className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                  isOpen ? "rotate-180 text-blue-600" : "text-slate-400"
                }`}
              />
            </button>
            <div
              className={`transition-all duration-200 ${
                isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              } overflow-hidden`}
            >
              <p className="px-5 pb-5 text-sm leading-relaxed text-slate-600">
                {faq.answer}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
