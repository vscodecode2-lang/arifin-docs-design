import type { Metadata } from "next";
import { OrderTracker } from "@/components/home/OrderTracker";
import { Search, Shield, Clock, MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Cek Status Order",
  description:
    "Lacak status pengerjaan dokumenmu secara real-time menggunakan kode order yang diterima via WhatsApp.",
  alternates: { canonical: "/cek-order" },
};

const FEATURES = [
  {
    icon: <Search className="h-5 w-5" />,
    title: "Lacak Real-time",
    desc: "Status order diupdate langsung oleh tim kami.",
  },
  {
    icon: <Shield className="h-5 w-5" />,
    title: "Privasi Terjaga",
    desc: "Hanya kamu yang tahu kode ordermu.",
  },
  {
    icon: <Clock className="h-5 w-5" />,
    title: "Update Cepat",
    desc: "Notifikasi perubahan status via WhatsApp.",
  },
  {
    icon: <MessageCircle className="h-5 w-5" />,
    title: "Tanya Langsung",
    desc: "Hubungi admin jika ada pertanyaan.",
  },
];

export default function CekOrderPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Hero ── */}
      <section className="bg-blue-950 py-16 px-4">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-blue-400">
            Order Tracking
          </p>
          <h1 className="text-3xl font-black text-white sm:text-4xl">
            Cek Status Ordermu
          </h1>
          <p className="mt-3 text-sm text-blue-200">
            Masukkan kode order yang dikirim via WhatsApp untuk melihat
            perkembangan pengerjaan dokumenmu secara real-time.
          </p>
        </div>
      </section>

      {/* Live Order Counter feature removed */}

      {/* ── Tracker ── */}
      <section className="px-4 py-12">
        <OrderTracker />
      </section>

      {/* ── Features ── */}
      <section className="bg-white border-t border-slate-100 py-12 px-4">
        <div className="mx-auto max-w-3xl">
          <p className="text-center text-sm font-semibold text-slate-400 uppercase tracking-widest mb-8">
            Kenapa pakai sistem tracking?
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="text-center">
                <div className="mx-auto mb-3 w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  {f.icon}
                </div>
                <p className="font-bold text-slate-800 text-sm">{f.title}</p>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ mini ── */}
      <section className="py-10 px-4 bg-slate-50">
        <div className="mx-auto max-w-xl space-y-4">
          <p className="text-center text-sm font-semibold text-slate-400 uppercase tracking-widest mb-6">
            Pertanyaan Umum
          </p>
          {[
            {
              q: "Di mana saya bisa menemukan kode order?",
              a: "Kode order (format ADC-XXXXXX) dikirim otomatis via WhatsApp setelah kamu mengisi form pemesanan.",
            },
            {
              q: "Berapa lama proses pengerjaan?",
              a: "Tergantung layanan. CV ATS 1–2 hari kerja, Surat Lamaran < 1 hari. Detail ada di halaman masing-masing layanan.",
            },
            {
              q: "Bagaimana jika kode order tidak ditemukan?",
              a: "Pastikan kode yang dimasukkan sudah benar. Jika masih bermasalah, hubungi admin via WhatsApp dengan menyebutkan nama dan layanan yang dipesan.",
            },
          ].map(({ q, a }) => (
            <div
              key={q}
              className="bg-white border border-slate-200 rounded-xl p-4"
            >
              <p className="font-bold text-sm text-slate-800 mb-1">{q}</p>
              <p className="text-sm text-slate-500 leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
