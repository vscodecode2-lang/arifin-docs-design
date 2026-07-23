"use client";

import { useState, useEffect } from "react";
import { submitKontakAction } from "@/app/actions/submit-kontak";
import {
  MessageCircle, Mail, Clock, CheckCircle2,
  Loader2, AlertCircle, Send, MapPin, ArrowRight,
} from "lucide-react";
import Link from "next/link";

// Custom Instagram icon (lucide-react tidak include ini)
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

// ─── Constants ────────────────────────────────────────────────────────────────

const WA_NUMBER   = "6285801193410";
const EMAIL       = "muhamadarifin.dev@gmail.com";
const INSTAGRAM   = "arifindocs.id";
const WA_LINK     = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Halo Arifin Docs & Design, saya ingin bertanya tentang layanan")}`;
const EMAIL_LINK  = `mailto:${EMAIL}`;
const IG_LINK     = `https://instagram.com/${INSTAGRAM}`;

const TOPIC_OPTIONS = [
  { value: "layanan",   label: "Tanya Layanan" },
  { value: "keluhan",   label: "Keluhan / Feedback" },
  { value: "kerjasama", label: "Kerjasama / Kolaborasi" },
  { value: "lainnya",   label: "Lainnya" },
];

const JAM_OPERASIONAL = [
  { hari: "Senin – Jumat", jam: "08.00 – 21.00 WIB" },
  { hari: "Sabtu",         jam: "09.00 – 21.00 WIB" },
  { hari: "Minggu",        jam: "10.00 – 18.00 WIB" },
];

const MINI_FAQS = [
  {
    q: "Apakah konsultasi sebelum pesan gratis?",
    a: "Ya! Konsultasi via WhatsApp sepenuhnya gratis. Anda bisa tanya apapun tentang layanan sebelum memutuskan memesan.",
  },
  {
    q: "Bagaimana jika admin tidak merespons?",
    a: "Jika tidak ada respons dalam 2 jam di jam operasional, coba kirim ulang atau hubungi via email. Kami berkomitmen merespons semua pesan.",
  },
  {
    q: "Bisakah diskusi detail sebelum memesan?",
    a: "Tentu! Kami sangat menyarankan diskusi terlebih dahulu agar dokumen yang dibuat benar-benar sesuai kebutuhan Anda.",
  },
];

// ─── Online Status Hook ───────────────────────────────────────────────────────

function useOnlineStatus(): { isOnline: boolean; label: string } {
  const [status, setStatus] = useState({ isOnline: false, label: "Memuat..." });

  useEffect(() => {
    const checkStatus = () => {
      // Waktu WIB = UTC+7
      const now = new Date();
      const wibOffset = 7 * 60;
      const utcMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();
      const wibMinutes = (utcMinutes + wibOffset) % (24 * 60);
      const wibHour    = Math.floor(wibMinutes / 60);
      const dayOfWeek  = new Date(now.getTime() + wibOffset * 60000).getUTCDay();

      let isOnline = false;
      let label    = "";

      // Senin–Jumat (1–5): 08.00–21.00
      if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        isOnline = wibHour >= 8 && wibHour < 21;
        label    = isOnline ? "Online sekarang" : `Online pukul ${dayOfWeek === 5 && wibHour >= 21 ? "09.00 Sabtu" : "08.00 besok"}`;
      }
      // Sabtu (6): 09.00–21.00
      else if (dayOfWeek === 6) {
        isOnline = wibHour >= 9 && wibHour < 21;
        label    = isOnline ? "Online sekarang" : "Online pukul 10.00 Minggu";
      }
      // Minggu (0): 10.00–18.00
      else {
        isOnline = wibHour >= 10 && wibHour < 18;
        label    = isOnline ? "Online sekarang" : "Online pukul 08.00 Senin";
      }

      setStatus({ isOnline, label });
    };

    checkStatus();
    const interval = setInterval(checkStatus, 60_000);
    return () => clearInterval(interval);
  }, []);

  return status;
}

// ─── Input & Field Components ─────────────────────────────────────────────────

const inputCls =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20";

function Field({
  label, required, error, helper, children,
}: {
  label: string; required?: boolean; error?: string; helper?: string; children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold text-slate-700">
        {label}{required && <span className="ml-1 text-red-500">*</span>}
      </label>
      {children}
      {helper && !error && <p className="text-xs text-slate-400">{helper}</p>}
      {error && (
        <p className="flex items-center gap-1 text-xs text-red-600">
          <AlertCircle className="h-3 w-3 shrink-0" />{error}
        </p>
      )}
    </div>
  );
}

// ─── Contact Form ─────────────────────────────────────────────────────────────

function KontakForm() {
  const [form, setForm]   = useState({ full_name: "", contact: "", topic: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus]       = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg]   = useState("");

  const upd = (f: string, v: string) => {
    setForm(p => ({ ...p, [f]: v }));
    setErrors(p => ({ ...p, [f]: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.full_name.trim() || form.full_name.trim().length < 3)
      e.full_name = "Nama minimal 3 karakter";
    if (!form.contact.trim() || form.contact.trim().length < 5)
      e.contact = "Email atau nomor WA wajib diisi";
    if (!form.topic)
      e.topic = "Pilih topik pesan";
    if (!form.message.trim() || form.message.trim().length < 20)
      e.message = `Pesan minimal 20 karakter (${form.message.trim().length}/20)`;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    const result = await submitKontakAction(fd);
    setIsLoading(false);
    if (result.success) {
      setStatus("success");
      setForm({ full_name: "", contact: "", topic: "", message: "" });
    } else {
      setStatus("error");
      setErrorMsg(result.error ?? "Terjadi kesalahan.");
    }
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center py-12 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle2 className="h-8 w-8 text-emerald-600" />
        </div>
        <h3 className="text-lg font-black text-slate-900">Pesan Terkirim!</h3>
        <p className="mt-2 max-w-xs text-sm text-slate-500">
          Terima kasih telah menghubungi kami. Admin akan membalas sesegera mungkin di jam operasional.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-6 rounded-xl border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          Kirim Pesan Lain
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Nama Lengkap" required error={errors.full_name}>
          <input
            className={inputCls} placeholder="Muhammad Arifin"
            value={form.full_name} onChange={e => upd("full_name", e.target.value)}
          />
        </Field>
        <Field label="Email atau Nomor WA" required
          helper="Kami akan membalas ke kontak ini"
          error={errors.contact}>
          <input
            className={inputCls} placeholder="nama@email.com atau 08123456789"
            value={form.contact} onChange={e => upd("contact", e.target.value)}
          />
        </Field>
      </div>

      <Field label="Topik Pesan" required error={errors.topic}>
        <select
          className={inputCls} value={form.topic}
          onChange={e => upd("topic", e.target.value)}
        >
          <option value="">-- Pilih topik --</option>
          {TOPIC_OPTIONS.map(t => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </Field>

      <Field label="Pesan" required
        helper="Jelaskan keperluan Anda secara detail agar kami bisa membantu dengan tepat"
        error={errors.message}>
        <textarea
          rows={5} className={`${inputCls} resize-none`}
          placeholder="Halo, saya ingin bertanya tentang..."
          value={form.message} onChange={e => upd("message", e.target.value)}
        />
        <div className="mt-1 flex justify-between">
          {!errors.message && (
            <span className="text-xs text-slate-400">{form.message.length} karakter</span>
          )}
          <span />
        </div>
      </Field>

      {status === "error" && (
        <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
          <p className="text-sm text-red-700">{errorMsg}</p>
        </div>
      )}

      <button
        type="submit" disabled={isLoading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-blue-800 hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading
          ? <><Loader2 className="h-4 w-4 animate-spin" />Mengirim...</>
          : <><Send className="h-4 w-4" />Kirim Pesan</>
        }
      </button>

      <p className="text-center text-xs text-slate-400">
        🔒 Pesan Anda bersifat rahasia dan hanya dibaca oleh admin kami.
      </p>
    </form>
  );
}

// ─── Main Client Component ────────────────────────────────────────────────────

export function KontakClient() {
  const { isOnline, label } = useOnlineStatus();

  return (
    <div className="overflow-x-hidden">

      {/* ══ HERO ══ */}
      <section
        className="relative bg-blue-950 bg-cover bg-center bg-no-repeat py-20"
        style={{ backgroundImage: "url('/bg-kontak.avif')" }}
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-800/20 blur-3xl" />
          <div className="absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-blue-700/15 blur-3xl" />
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        </div>
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <span className="mb-4 inline-block rounded-full border border-blue-700/50 bg-blue-900/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-blue-300">
            Hubungi Kami
          </span>
          <h1 className="text-3xl font-black text-white sm:text-4xl lg:text-5xl">
            Ada yang Bisa<br />
            <span className="text-blue-400">Kami Bantu?</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-blue-200 sm:text-base">
            Konsultasi gratis, tidak ada kewajiban memesan. Kami siap menjawab semua pertanyaan Anda.
          </p>

          {/* Status Online pill */}
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-blue-700/40 bg-blue-900/60 px-4 py-2 backdrop-blur-sm">
            <span className={`relative flex h-2.5 w-2.5`}>
              {isOnline && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              )}
              <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${isOnline ? "bg-emerald-400" : "bg-slate-400"}`} />
            </span>
            <span className={`text-xs font-semibold ${isOnline ? "text-emerald-400" : "text-slate-400"}`}>
              {label}
            </span>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 50L1440 0V50H0Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ══ KONTAK CARDS ══ */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-5 sm:grid-cols-3">

            {/* WhatsApp */}
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer"
              className="group flex flex-col items-center rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-6 text-center transition-all hover:-translate-y-1 hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-100">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-md transition-transform group-hover:scale-110">
                <MessageCircle className="h-7 w-7" />
              </div>
              <div className="mb-1 flex items-center gap-2">
                <h3 className="text-base font-black text-slate-900">WhatsApp</h3>
                <span className={`flex h-2 w-2 rounded-full ${isOnline ? "bg-emerald-500" : "bg-slate-300"}`} />
              </div>
              <p className="text-sm font-semibold text-slate-600">+62 858-0119-3410</p>
              <p className="mt-1 text-xs text-slate-400">Respons rata-rata &lt; 1 jam</p>
              <span className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-white transition-colors group-hover:bg-emerald-600">
                Chat Sekarang <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </a>

            {/* Email */}
            <a href={EMAIL_LINK}
              className="group flex flex-col items-center rounded-2xl border-2 border-blue-200 bg-blue-50 p-6 text-center transition-all hover:-translate-y-1 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-100">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md transition-transform group-hover:scale-110">
                <Mail className="h-7 w-7" />
              </div>
              <h3 className="mb-1 text-base font-black text-slate-900">Email</h3>
              <p className="text-xs font-semibold text-slate-600 break-all">muhamadarifin.dev<br />@gmail.com</p>
              <p className="mt-1 text-xs text-slate-400">Respons rata-rata &lt; 24 jam</p>
              <span className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white transition-colors group-hover:bg-blue-700">
                Kirim Email <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </a>

            {/* Instagram */}
            <a href={IG_LINK} target="_blank" rel="noopener noreferrer"
              className="group flex flex-col items-center rounded-2xl border-2 border-pink-200 bg-pink-50 p-6 text-center transition-all hover:-translate-y-1 hover:border-pink-400 hover:shadow-lg hover:shadow-pink-100">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-purple-500 via-pink-500 to-orange-400 text-white shadow-md transition-transform group-hover:scale-110">
                <InstagramIcon className="h-7 w-7" />
              </div>
              <h3 className="mb-1 text-base font-black text-slate-900">Instagram</h3>
              <p className="text-sm font-semibold text-slate-600">@arifindocs.id</p>
              <p className="mt-1 text-xs text-slate-400">Portofolio & update terbaru</p>
              <span className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-linear-to-r from-purple-500 to-pink-500 px-4 py-2 text-xs font-bold text-white transition-opacity group-hover:opacity-90">
                Lihat Profil <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* ══ FORM + INFO ══ */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-5">

            {/* Form (3/5) */}
            <div className="lg:col-span-3">
              <div className="mb-8">
                <span className="mb-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-blue-700">
                  Form Pesan
                </span>
                <h2 className="text-2xl font-black text-slate-900">Kirim Pesan Langsung</h2>
                <p className="mt-2 text-sm text-slate-500">
                  Tidak perlu buka WhatsApp dulu. Isi form di bawah dan kami akan menghubungi Anda.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <KontakForm />
              </div>
            </div>

            {/* Info (2/5) */}
            <div className="lg:col-span-2 space-y-5">

              {/* Jam Operasional */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                    <Clock className="h-4 w-4 text-blue-700" />
                  </div>
                  <h3 className="text-sm font-black text-slate-900">Jam Operasional</h3>
                </div>
                <div className="space-y-2.5">
                  {JAM_OPERASIONAL.map(j => (
                    <div key={j.hari} className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-600">{j.hari}</span>
                      <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">{j.jam}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <span className={`h-2 w-2 rounded-full ${isOnline ? "bg-emerald-500" : "bg-slate-400"}`} />
                  <p className={`text-xs font-semibold ${isOnline ? "text-emerald-600" : "text-slate-500"}`}>
                    {label}
                  </p>
                </div>
              </div>

              {/* Lokasi & Area Layanan */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                    <MapPin className="h-4 w-4 text-blue-700" />
                  </div>
                  <h3 className="text-sm font-black text-slate-900">Lokasi & Area Layanan</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-semibold text-slate-500">Lokasi Admin</p>
                    <p className="text-sm font-medium text-slate-800">Batang, Jawa Tengah</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500">Area Layanan</p>
                    <p className="text-sm font-medium text-slate-800">Seluruh Indonesia</p>
                    <p className="text-xs text-slate-400">Layanan online — tanpa tatap muka</p>
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-2">💡 Tips</p>
                <p className="text-xs leading-relaxed text-amber-700">
                  Untuk respons paling cepat, gunakan <span className="font-bold">WhatsApp</span>.
                  Sertakan detail kebutuhan Anda agar kami bisa langsung membantu tanpa bolak-balik tanya.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ MINI FAQ ══ */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-black text-slate-900">Pertanyaan Seputar Kontak</h2>
          </div>
          <div className="space-y-4">
            {MINI_FAQS.map((faq, i) => (
              <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5">
                <p className="mb-2 text-sm font-bold text-slate-900">
                  <span className="mr-2 text-blue-600">Q:</span>{faq.q}
                </p>
                <p className="text-sm leading-relaxed text-slate-600">
                  <span className="mr-2 font-bold text-emerald-600">A:</span>{faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA PENUTUP ══ */}
      <section className="bg-slate-50 py-14">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <p className="text-sm text-slate-500 mb-3">Sudah siap memesan?</p>
          <h2 className="text-2xl font-black text-slate-900">
            Langsung Pilih Layanan Anda
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Isi formulir layanan dan kami kerjakan secepatnya.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/#layanan"
              className="group inline-flex items-center gap-2 rounded-xl bg-blue-700 px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-blue-800 hover:-translate-y-0.5 transition-all"
            >
              Lihat Semua Layanan
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/cara-kerja"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all"
            >
              Pelajari Cara Kerja
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}