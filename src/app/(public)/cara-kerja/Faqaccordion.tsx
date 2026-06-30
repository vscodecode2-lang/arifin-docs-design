"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: "Bagaimana cara melakukan pembayaran?",
    answer:
      "Setelah mengisi formulir dan diarahkan ke WhatsApp, admin akan mengkonfirmasi pesanan dan memberikan informasi pembayaran. Pembayaran dilakukan via transfer bank atau e-wallet (GoPay, OVO, Dana, QRIS). Pengerjaan dimulai setelah pembayaran dikonfirmasi.",
  },
  {
    question: "Apakah data pribadi saya aman?",
    answer:
      "Sangat aman. Semua data yang Anda isi disimpan di server terenkripsi dan hanya dapat diakses oleh admin kami. Data tidak pernah dibagikan, dijual, atau digunakan untuk keperluan lain selain pengerjaan dokumen Anda. Anda juga bisa request penghapusan data kapan saja.",
  },
  {
    question: "Berapa kali saya bisa melakukan revisi?",
    answer:
      "Setiap layanan memiliki ketentuan revisi yang berbeda. CV ATS dan Surat Lamaran mendapat 2x revisi gratis, Surat Legal dan Akademik 1x revisi gratis. Revisi tambahan dapat dikerjakan dengan biaya yang sangat terjangkau. Detail revisi akan diinformasikan saat konfirmasi pesanan.",
  },
  {
    question: "Bagaimana jika hasil dokumen tidak sesuai?",
    answer:
      "Kami berkomitmen mengerjakan sesuai instruksi yang Anda berikan di formulir. Jika hasilnya belum sesuai, Anda bisa langsung sampaikan ke admin via WhatsApp dan kami akan merevisi tanpa biaya tambahan (sesuai kuota revisi). Kepuasan klien adalah prioritas utama kami.",
  },
  {
    question: "Apakah bisa request pengerjaan mendadak / urgent?",
    answer:
      "Bisa! Kami menerima pesanan urgent dengan pemberitahuan di formulir atau langsung via WhatsApp. Untuk pengerjaan dalam waktu kurang dari 6 jam mungkin dikenakan biaya tambahan tergantung jenis layanan dan ketersediaan admin. Silakan hubungi kami terlebih dahulu untuk konfirmasi.",
  },
  {
    question: "Dalam format apa dokumen akan dikirimkan?",
    answer:
      "Dokumen dikirim dalam format PDF siap cetak dan/atau Word (.docx) yang bisa diedit, sesuai kebutuhan Anda. Untuk layanan CV, kami juga menyediakan format ATS-friendly yang telah dioptimasi. File dikirim langsung via WhatsApp atau email yang Anda daftarkan.",
  },
];

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {FAQS.map((faq, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={i}
            className={`overflow-hidden rounded-2xl border transition-all duration-200 ${
              isOpen
                ? "border-blue-200 bg-blue-50/50 shadow-sm"
                : "border-slate-200 bg-white hover:border-blue-200"
            }`}
          >
            <button
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