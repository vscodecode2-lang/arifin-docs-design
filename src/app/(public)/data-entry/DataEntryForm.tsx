"use client";

import { useState } from "react";
import { submitDataEntryAction } from "@/app/actions/submit-data-entry";
import { generateWhatsAppLink } from "@/lib/utils";
import { Database, FileText, ClipboardList, ChevronRight, ChevronLeft, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

const ADMIN_WA = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP ?? "6285801193410";

const STEPS = [
  { id: 1, label: "Data Diri",    icon: Database },
  { id: 2, label: "Detail Project", icon: FileText },
  { id: 3, label: "Review",       icon: ClipboardList },
];
const STEP_LABELS: Record<number, string> = { 1: "Data Diri", 2: "Detail Project" };
const FIELD_TO_STEP: Record<string, number> = {
  full_name: 1, email: 1, phone_number: 1,
  nama_project: 2, jenis_project: 2, jumlah_data: 2, deadline: 2,
  format_output: 2, deskripsi: 2, jumlah_halaman: 2, kualitas_scan: 2,
  platform: 2, jumlah_produk: 2, sumber_website: 2, kolom_data: 2,
  format_database: 2, field_produk: 2, variasi_produk: 2,
};

const JENIS_OPTIONS = [
  { value: "convert_pdf",    label: "Convert PDF ke Excel/Word", emoji: "📄", desc: "Konversi dokumen PDF ke format yang bisa diedit" },
  { value: "marketplace",    label: "Input Produk Marketplace",  emoji: "🛒", desc: "Upload & kelola produk di Tokopedia, Shopee, dll." },
  { value: "web_research",   label: "Web Research & Scraping",   emoji: "🔍", desc: "Kumpulkan data dari website tertentu secara sistematis" },
  { value: "database_entry", label: "Input Database / Spreadsheet", emoji: "📊", desc: "Masukkan data ke sistem atau spreadsheet" },
  { value: "input_produk",   label: "Input Data Produk",         emoji: "📦", desc: "Input data produk lengkap dengan variasi & deskripsi" },
];

const FORMAT_OUTPUT_OPTIONS = ["Excel (.xlsx)", "Google Sheets", "Word (.docx)", "CSV", "PDF", "JSON", "Sesuai permintaan"];
const JUMLAH_DATA_OPTIONS   = ["1 - 100 data", "101 - 500 data", "501 - 1.000 data", "1.001 - 5.000 data", "5.001 - 10.000 data", "Lebih dari 10.000 data"];
const PLATFORM_OPTIONS      = ["Tokopedia", "Shopee", "Lazada", "Bukalapak", "TikTok Shop", "Blibli", "Lainnya"];

const inputCls    = "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors";
const textareaCls = inputCls + " resize-none";

function Field({ label, required, helper, error, children }: {
  label: string; required?: boolean; helper?: string; error?: string; children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold text-slate-700">
        {label}{required && <span className="ml-1 text-red-500">*</span>}
      </label>
      {children}
      {helper && !error && <p className="text-xs text-slate-400">{helper}</p>}
      {error && <p className="flex items-center gap-1 text-xs text-red-600"><AlertCircle className="h-3 w-3 shrink-0" />{error}</p>}
    </div>
  );
}

interface FormState {
  full_name: string; email: string; phone_number: string;
  nama_project: string; jenis_project: string; jumlah_data: string;
  deadline: string; format_output: string; deskripsi: string;
  jumlah_halaman: string; kualitas_scan: string;
  platform: string; jumlah_produk: string;
  sumber_website: string; kolom_data: string;
  format_database: string;
  field_produk: string; variasi_produk: string;
  catatan: string;
}

const INITIAL: FormState = {
  full_name: "", email: "", phone_number: "",
  nama_project: "", jenis_project: "", jumlah_data: "",
  deadline: "", format_output: "", deskripsi: "",
  jumlah_halaman: "", kualitas_scan: "",
  platform: "", jumlah_produk: "",
  sumber_website: "", kolom_data: "",
  format_database: "",
  field_produk: "", variasi_produk: "",
  catatan: "",
};

export function DataEntryForm() {
  const [step, setStep]               = useState(1);
  const [form, setForm]               = useState<FormState>(INITIAL);
  const [errors, setErrors]           = useState<Record<string, string>>({});
  const [invalidSteps, setInvalidSteps] = useState<number[]>([]);
  const [isLoading, setIsLoading]     = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const upd = (f: keyof FormState, v: string) =>
    setForm(p => ({ ...p, [f]: v }));

  const validateStep = (n: number): Record<string, string> => {
    const e: Record<string, string> = {};
    if (n === 1) {
      if (!form.full_name.trim())    e.full_name    = "Nama wajib diisi";
      if (!form.email.trim())        e.email        = "Email wajib diisi";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Format email tidak valid";
      if (!form.phone_number.trim()) e.phone_number = "Nomor WA wajib diisi";
      else if (!/^(\+62|62|0)8[1-9][0-9]{7,11}$/.test(form.phone_number)) e.phone_number = "Format tidak valid";
    }
    if (n === 2) {
      if (!form.nama_project.trim()) e.nama_project  = "Nama project wajib diisi";
      if (!form.jenis_project)       e.jenis_project = "Pilih jenis project";
      if (!form.jumlah_data)         e.jumlah_data   = "Estimasi jumlah data wajib dipilih";
      if (!form.deadline)            e.deadline      = "Deadline wajib diisi";
      if (!form.format_output)       e.format_output = "Format output wajib dipilih";
      if (!form.deskripsi.trim())    e.deskripsi     = "Deskripsi project wajib diisi";
      else if (form.deskripsi.trim().length < 10) e.deskripsi = "Minimal 10 karakter";
    }
    return e;
  };

  const validateAll = () => {
    const all: Record<string, string> = {};
    const bad: number[] = [];
    [1, 2].forEach(n => {
      const e = validateStep(n);
      if (Object.keys(e).length) { bad.push(n); Object.assign(all, e); }
    });
    setErrors(all); setInvalidSteps(bad);
    return bad.length === 0;
  };

  const handleNext = () => {
    const e = validateStep(step);
    if (!Object.keys(e).length) { setErrors({}); setStep(s => s + 1); } else setErrors(e);
  };

  const handleSubmit = async () => {
    if (!validateAll()) return;
    setIsLoading(true); setSubmitError(null);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      const result = await submitDataEntryAction(fd);
      if (!result.success) {
        if (result.fieldErrors) {
          setErrors(result.fieldErrors);
          const bad = Array.from(
            new Set(Object.keys(result.fieldErrors).map(f => FIELD_TO_STEP[f]).filter(Boolean))
          ).sort() as number[];
          setInvalidSteps(bad);
          if (bad.length) setStep(bad[0]);
        }
        setSubmitError(result.error ?? "Terjadi kesalahan."); return;
      }
      setInvalidSteps([]);
      window.location.href = generateWhatsAppLink("Data Entry", ADMIN_WA, result.orderCode);
    } catch { setSubmitError("Gagal menghubungi server."); }
    finally { setIsLoading(false); }
  };

  const progress  = Math.round(((step - 1) / (STEPS.length - 1)) * 100);
  const jenisMeta = JENIS_OPTIONS.find(o => o.value === form.jenis_project);

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">

        {/* Header */}
        <div className="mb-8 text-center">
          <span className="mb-2 inline-block rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-slate-700">
            Data Entry
          </span>
          <h1 className="text-2xl font-black text-slate-900">Formulir Layanan Data Entry</h1>
          <p className="mt-1 text-sm text-slate-500">Input data akurat, cepat, dan rapi untuk bisnis Anda</p>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="mb-1.5 flex justify-between text-xs text-slate-500">
            <span>Langkah {step} dari {STEPS.length}</span>
            <span className="font-semibold text-blue-700">{progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-blue-600 transition-all duration-500"
              style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Step indicators */}
        <div className="mb-8 flex items-center justify-between">
          {STEPS.map((s, i) => {
            const Icon = s.icon; const done = step > s.id; const active = step === s.id;
            return (
              <div key={s.id} className="flex flex-1 items-center">
                <div className="flex flex-col items-center gap-1">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all ${
                    done ? "border-blue-600 bg-blue-600" : active ? "border-blue-600 bg-white" : "border-slate-300 bg-white"
                  }`}>
                    {done
                      ? <CheckCircle2 className="h-4 w-4 text-white" />
                      : <Icon className={`h-4 w-4 ${active ? "text-blue-600" : "text-slate-400"}`} />}
                  </div>
                  <span className={`hidden text-[10px] font-semibold sm:block ${
                    active ? "text-blue-700" : done ? "text-blue-500" : "text-slate-400"
                  }`}>{s.label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`mx-1 h-0.5 flex-1 ${step > s.id ? "bg-blue-600" : "bg-slate-200"}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Form card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="mb-6 text-base font-bold text-slate-900">{STEPS[step - 1].label}</h2>

          {/* ── STEP 1: Data Diri ── */}
          {step === 1 && (
            <div className="space-y-5">
              <Field label="Nama Lengkap" required error={errors.full_name}>
                <input className={inputCls} placeholder="Nama Anda atau nama bisnis"
                  value={form.full_name} onChange={e => upd("full_name", e.target.value)} />
              </Field>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Email Aktif" required error={errors.email}>
                  <input type="email" className={inputCls} placeholder="nama@email.com"
                    value={form.email} onChange={e => upd("email", e.target.value)} />
                </Field>
                <Field label="Nomor WhatsApp" required error={errors.phone_number}>
                  <input type="tel" className={inputCls} placeholder="08123456789"
                    value={form.phone_number} onChange={e => upd("phone_number", e.target.value)} />
                </Field>
              </div>

              {/* Value props */}
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <p className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-500">Yang Kami Jamin</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {[
                    ["✅", "Akurasi 99%+"],
                    ["⚡", "Pengerjaan cepat"],
                    ["🔒", "Data rahasia terjaga"],
                    ["📋", "Format sesuai permintaan"],
                  ].map(([icon, text]) => (
                    <div key={text} className="flex items-center gap-2">
                      <span>{icon}</span>
                      <span className="text-xs text-slate-600 font-medium">{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 2: Detail Project ── */}
          {step === 2 && (
            <div className="space-y-6">
              <Field label="Nama Project" required helper="Beri nama yang deskriptif untuk project ini" error={errors.nama_project}>
                <input className={inputCls} placeholder="Input Data Produk Tokopedia Q1 2025"
                  value={form.nama_project} onChange={e => upd("nama_project", e.target.value)} />
              </Field>

              <Field label="Jenis Project" required error={errors.jenis_project}>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {JENIS_OPTIONS.map(opt => (
                    <button key={opt.value} type="button" onClick={() => upd("jenis_project", opt.value)}
                      className={`flex items-start gap-2 rounded-xl border-2 p-3 text-left transition-all ${
                        form.jenis_project === opt.value
                          ? "border-blue-600 bg-blue-50"
                          : "border-slate-200 hover:border-blue-300 hover:bg-slate-50"
                      }`}>
                      <span className="text-xl shrink-0">{opt.emoji}</span>
                      <div>
                        <p className={`text-xs font-bold leading-tight ${form.jenis_project === opt.value ? "text-blue-700" : "text-slate-700"}`}>
                          {opt.label}
                        </p>
                        <p className="mt-0.5 text-[11px] text-slate-500">{opt.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </Field>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Estimasi Jumlah Data" required error={errors.jumlah_data}>
                  <select className={inputCls} value={form.jumlah_data}
                    onChange={e => upd("jumlah_data", e.target.value)}>
                    <option value="">-- Pilih estimasi --</option>
                    {JUMLAH_DATA_OPTIONS.map(o => <option key={o}>{o}</option>)}
                  </select>
                </Field>
                <Field label="Deadline" required error={errors.deadline}>
                  <input type="date" className={inputCls} value={form.deadline}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={e => upd("deadline", e.target.value)} />
                </Field>
              </div>

              <Field label="Format Output" required helper="Pilih format file hasil pekerjaan" error={errors.format_output}>
                <div className="flex flex-wrap gap-2">
                  {FORMAT_OUTPUT_OPTIONS.map(opt => (
                    <button key={opt} type="button" onClick={() => upd("format_output", opt)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
                        form.format_output === opt
                          ? "border-blue-600 bg-blue-700 text-white"
                          : "border-slate-200 bg-slate-50 text-slate-600 hover:border-blue-300 hover:text-blue-700"
                      }`}>
                      {opt}
                    </button>
                  ))}
                </div>
                {errors.format_output && (
                  <p className="flex items-center gap-1 text-xs text-red-600 mt-1">
                    <AlertCircle className="h-3 w-3 shrink-0" />{errors.format_output}
                  </p>
                )}
              </Field>

              <Field label="Deskripsi Project" required
                helper="Jelaskan detail pekerjaan, sumber data, dan ekspektasi hasil" error={errors.deskripsi}>
                <textarea rows={4} className={textareaCls}
                  placeholder="Contoh: Saya memiliki 500 scan KTP dalam format PDF. Perlu dikonversi ke Excel dengan kolom: Nama, NIK, Alamat, TTL. Kualitas scan cukup jelas."
                  value={form.deskripsi} onChange={e => upd("deskripsi", e.target.value)} />
              </Field>

              {/* ── Conditional fields per jenis_project ── */}

              {form.jenis_project === "convert_pdf" && (
                <div className="space-y-4 rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-600">📄 Detail Convert PDF</p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Jumlah Halaman PDF" helper="Total halaman yang perlu dikonversi">
                      <input type="number" className={inputCls} placeholder="50" min="1"
                        value={form.jumlah_halaman} onChange={e => upd("jumlah_halaman", e.target.value)} />
                    </Field>
                    <Field label="Kualitas Scan" helper="Kondisi dokumen PDF">
                      <select className={inputCls} value={form.kualitas_scan}
                        onChange={e => upd("kualitas_scan", e.target.value)}>
                        <option value="">-- Pilih kualitas --</option>
                        <option>Sangat jelas (teks digital)</option>
                        <option>Jelas (scan rapi)</option>
                        <option>Cukup (scan biasa)</option>
                        <option>Kurang jelas (perlu OCR)</option>
                      </select>
                    </Field>
                  </div>
                </div>
              )}

              {form.jenis_project === "marketplace" && (
                <div className="space-y-4 rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-600">🛒 Detail Marketplace</p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Platform" helper="Marketplace yang digunakan">
                      <select className={inputCls} value={form.platform}
                        onChange={e => upd("platform", e.target.value)}>
                        <option value="">-- Pilih platform --</option>
                        {PLATFORM_OPTIONS.map(p => <option key={p}>{p}</option>)}
                      </select>
                    </Field>
                    <Field label="Jumlah Produk" helper="Total produk yang perlu diinput">
                      <input type="number" className={inputCls} placeholder="100" min="1"
                        value={form.jumlah_produk} onChange={e => upd("jumlah_produk", e.target.value)} />
                    </Field>
                  </div>
                </div>
              )}

              {form.jenis_project === "web_research" && (
                <div className="space-y-4 rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-600">🔍 Detail Web Research</p>
                  <Field label="Sumber Website" helper="URL atau nama website yang jadi sumber data">
                    <textarea rows={2} className={textareaCls}
                      placeholder="https://example.com, Google Maps, marketplace tertentu..."
                      value={form.sumber_website} onChange={e => upd("sumber_website", e.target.value)} />
                  </Field>
                  <Field label="Kolom Data yang Dibutuhkan" helper="Sebutkan informasi apa saja yang perlu dikumpulkan">
                    <input className={inputCls}
                      placeholder="Nama toko, alamat, nomor telepon, rating, harga..."
                      value={form.kolom_data} onChange={e => upd("kolom_data", e.target.value)} />
                  </Field>
                </div>
              )}

              {form.jenis_project === "database_entry" && (
                <div className="space-y-4 rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-600">📊 Detail Database / Spreadsheet</p>
                  <Field label="Format / Struktur Database" helper="Jelaskan template, kolom, atau sistem yang digunakan">
                    <textarea rows={3} className={textareaCls}
                      placeholder="Spreadsheet Google Sheets dengan kolom: ID, Nama, Tanggal, Nilai, Keterangan. Sumber data dari form fisik..."
                      value={form.format_database} onChange={e => upd("format_database", e.target.value)} />
                  </Field>
                </div>
              )}

              {form.jenis_project === "input_produk" && (
                <div className="space-y-4 rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-600">📦 Detail Input Produk</p>
                  <Field label="Field Produk yang Diisi" helper="Kolom/informasi produk yang perlu dilengkapi">
                    <input className={inputCls}
                      placeholder="Nama, SKU, deskripsi, harga, berat, kategori, gambar..."
                      value={form.field_produk} onChange={e => upd("field_produk", e.target.value)} />
                  </Field>
                  <Field label="Variasi Produk" helper="Opsional — warna, ukuran, dll.">
                    <input className={inputCls}
                      placeholder="Warna: merah/biru/hijau, Ukuran: S/M/L/XL"
                      value={form.variasi_produk} onChange={e => upd("variasi_produk", e.target.value)} />
                  </Field>
                </div>
              )}

              <Field label="Catatan Tambahan" helper="Opsional — informasi khusus untuk tim kami">
                <textarea rows={2} className={textareaCls}
                  placeholder="Contoh: Saya punya template Excel yang bisa digunakan, perlu NDA sebelum mulai, dll."
                  value={form.catatan} onChange={e => upd("catatan", e.target.value)} />
              </Field>
            </div>
          )}

          {/* ── STEP 3: Review ── */}
          {step === 3 && (
            <div className="space-y-5">
              {invalidSteps.length > 0 && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
                    <div>
                      <p className="text-sm font-bold text-red-700">
                        Data belum lengkap di {invalidSteps.length} langkah
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {invalidSteps.map(s => (
                          <button key={s} onClick={() => setStep(s)}
                            className="flex items-center gap-1.5 rounded-lg border border-red-300 bg-white px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 transition-colors">
                            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-black text-white">
                              {s}
                            </span>
                            {STEP_LABELS[s]}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {invalidSteps.length === 0 && (
                <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  ✅ Semua data terisi. Klik <strong>Kirim & Lanjut ke WhatsApp</strong> untuk mengirim.
                </p>
              )}

              <div className="rounded-xl border border-slate-200 p-4">
                <p className="mb-3 text-xs font-bold uppercase tracking-widest text-blue-600">Data Diri</p>
                {[["Nama", form.full_name], ["Email", form.email], ["WhatsApp", form.phone_number]].map(([l, v]) => (
                  <div key={l} className="flex gap-3 border-b border-slate-100 py-2 last:border-0">
                    <span className="w-28 shrink-0 text-xs font-semibold text-slate-500">{l}</span>
                    <span className="text-sm text-slate-800 break-all">{v || "-"}</span>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-slate-200 p-4">
                <p className="mb-3 text-xs font-bold uppercase tracking-widest text-blue-600">Detail Project</p>
                {[
                  ["Nama Project", form.nama_project],
                  ["Jenis Project", jenisMeta?.label ?? "-"],
                  ["Jumlah Data",  form.jumlah_data],
                  ["Deadline",     form.deadline ? new Date(form.deadline).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" }) : "-"],
                  ["Format Output",form.format_output],
                ].map(([l, v]) => (
                  <div key={l} className="flex gap-3 border-b border-slate-100 py-2 last:border-0">
                    <span className="w-28 shrink-0 text-xs font-semibold text-slate-500">{l}</span>
                    <span className="text-sm text-slate-800">{v || "-"}</span>
                  </div>
                ))}
              </div>

              {form.deskripsi && (
                <div className="rounded-xl border border-slate-200 p-4">
                  <p className="mb-2 text-xs font-bold uppercase tracking-widest text-blue-600">Deskripsi Project</p>
                  <p className="whitespace-pre-wrap text-sm text-slate-700">{form.deskripsi}</p>
                </div>
              )}
            </div>
          )}

          {submitError && (
            <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
              <p className="text-sm text-red-700">{submitError}</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="mt-5 flex items-center justify-between">
          {step > 1 ? (
            <button onClick={() => { setErrors({}); setStep(s => s - 1); }} disabled={isLoading}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-60 transition-all">
              <ChevronLeft className="h-4 w-4" />Kembali
            </button>
          ) : <div />}
          {step < STEPS.length ? (
            <button onClick={handleNext}
              className="flex items-center gap-2 rounded-xl bg-blue-700 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-blue-800 active:scale-95 transition-all">
              Lanjutkan <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={isLoading}
              className="flex items-center gap-2 rounded-xl bg-blue-700 px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-blue-800 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed transition-all">
              {isLoading
                ? <><Loader2 className="h-4 w-4 animate-spin" />Menyimpan...</>
                : <><CheckCircle2 className="h-4 w-4" />Kirim & Lanjut ke WhatsApp</>
              }
            </button>
          )}
        </div>

        <p className="mt-4 text-center text-xs text-slate-400">
          🔒 Data project Anda bersifat rahasia dan tidak disebarkan ke pihak manapun.
        </p>
      </div>
    </div>
  );
}
