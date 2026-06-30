"use client";

import { useState } from "react";
import { submitLegalAction } from "@/app/actions/submit-legal";
import { generateWhatsAppLink } from "@/lib/utils";
import { Building2, User, ClipboardList, ChevronRight, ChevronLeft, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

const ADMIN_WA = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP ?? "6285801193410";

const STEPS = [
  { id: 1, label: "Data Diri",    icon: User },
  { id: 2, label: "Jenis Surat",  icon: Building2 },
  { id: 3, label: "Review",       icon: ClipboardList },
];

const STEP_LABELS: Record<number, string> = { 1: "Data Diri", 2: "Jenis Surat" };
const FIELD_TO_STEP: Record<string, number> = {
  full_name: 1, email: 1, phone_number: 1, domicile: 1,
  jenis_surat: 2, tujuan_surat: 2, pemberi_kuasa: 2, penerima_kuasa: 2,
  isi_kuasa: 2, pihak_pertama: 2, pihak_kedua: 2, isi_perjanjian: 2,
  isi_pernyataan: 2, custom_jenis: 2, custom_deskripsi: 2,
};

const JENIS_OPTIONS = [
  { value: "surat_kuasa",       label: "Surat Kuasa",       emoji: "📋", desc: "Pelimpahan wewenang dari satu pihak ke pihak lain" },
  { value: "surat_perjanjian",  label: "Surat Perjanjian",  emoji: "🤝", desc: "Kesepakatan antara dua pihak yang mengikat secara hukum" },
  { value: "surat_pernyataan",  label: "Surat Pernyataan",  emoji: "✍️",  desc: "Pernyataan resmi dari seseorang untuk keperluan tertentu" },
  { value: "lainnya",           label: "Lainnya",           emoji: "📄", desc: "Jenis surat legal lain sesuai kebutuhan Anda" },
];

const inputCls = "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors";
const textareaCls = inputCls + " resize-none";

function Field({ label, required, helper, error, children }: { label: string; required?: boolean; helper?: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold text-slate-700">{label}{required && <span className="ml-1 text-red-500">*</span>}</label>
      {children}
      {helper && !error && <p className="text-xs text-slate-400">{helper}</p>}
      {error && <p className="flex items-center gap-1 text-xs text-red-600"><AlertCircle className="h-3 w-3 shrink-0" />{error}</p>}
    </div>
  );
}

interface FormState {
  full_name: string; email: string; phone_number: string; domicile: string;
  jenis_surat: string; tujuan_surat: string;
  pemberi_kuasa: string; penerima_kuasa: string; isi_kuasa: string;
  pihak_pertama: string; pihak_kedua: string; isi_perjanjian: string;
  isi_pernyataan: string; custom_jenis: string; custom_deskripsi: string;
  catatan_khusus: string;
}

const INITIAL: FormState = {
  full_name: "", email: "", phone_number: "", domicile: "",
  jenis_surat: "", tujuan_surat: "",
  pemberi_kuasa: "", penerima_kuasa: "", isi_kuasa: "",
  pihak_pertama: "", pihak_kedua: "", isi_perjanjian: "",
  isi_pernyataan: "", custom_jenis: "", custom_deskripsi: "", catatan_khusus: "",
};

export function LegalForm() {
  const [step, setStep]             = useState(1);
  const [form, setForm]             = useState<FormState>(INITIAL);
  const [errors, setErrors]         = useState<Record<string, string>>({});
  const [invalidSteps, setInvalidSteps] = useState<number[]>([]);
  const [isLoading, setIsLoading]   = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const upd = (f: keyof FormState, v: string) => setForm(p => ({ ...p, [f]: v }));

  const validateStep = (n: number): Record<string, string> => {
    const e: Record<string, string> = {};
    if (n === 1) {
      if (!form.full_name.trim())    e.full_name    = "Nama wajib diisi";
      else if (form.full_name.trim().length < 3) e.full_name = "Nama minimal 3 karakter";
      if (!form.email.trim())        e.email        = "Email wajib diisi";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Format email tidak valid";
      if (!form.phone_number.trim()) e.phone_number = "Nomor WA wajib diisi";
      else if (!/^(\+62|62|0)8[1-9][0-9]{7,11}$/.test(form.phone_number)) e.phone_number = "Format tidak valid";
      if (!form.domicile.trim())     e.domicile     = "Domisili wajib diisi";
    }
    if (n === 2) {
      if (!form.jenis_surat)         e.jenis_surat  = "Pilih jenis surat";
      if (!form.tujuan_surat.trim()) e.tujuan_surat = "Tujuan surat wajib diisi";
      else if (form.tujuan_surat.trim().length < 10) e.tujuan_surat = "Minimal 10 karakter";
    }
    return e;
  };

  const validateAll = () => {
    const all: Record<string, string> = {};
    const bad: number[] = [];
    [1, 2].forEach(n => { const e = validateStep(n); if (Object.keys(e).length) { bad.push(n); Object.assign(all, e); } });
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
      const result = await submitLegalAction(fd);
      if (!result.success) {
        if (result.fieldErrors) {
          setErrors(result.fieldErrors);
          const bad = Array.from(new Set(Object.keys(result.fieldErrors).map(f => FIELD_TO_STEP[f]).filter(Boolean))).sort() as number[];
          setInvalidSteps(bad);
          if (bad.length) setStep(bad[0]);
        }
        setSubmitError(result.error ?? "Terjadi kesalahan."); return;
      }
      setInvalidSteps([]);
      window.location.href = generateWhatsAppLink("Surat Legal", ADMIN_WA, result.orderCode);
    } catch { setSubmitError("Gagal menghubungi server."); }
    finally { setIsLoading(false); }
  };

  const progress = Math.round(((step - 1) / (STEPS.length - 1)) * 100);
  const jenisMeta = JENIS_OPTIONS.find(o => o.value === form.jenis_surat);

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <div className="mb-8 text-center">
          <span className="mb-2 inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-amber-700">Surat Legal</span>
          <h1 className="text-2xl font-black text-slate-900">Formulir Surat Legal</h1>
          <p className="mt-1 text-sm text-slate-500">Surat legal profesional, sah, dan terstruktur</p>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="mb-1.5 flex justify-between text-xs text-slate-500">
            <span>Langkah {step} dari {STEPS.length}</span>
            <span className="font-semibold text-blue-700">{progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-blue-600 transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Step indicators */}
        <div className="mb-8 flex items-center justify-between">
          {STEPS.map((s, i) => {
            const Icon = s.icon; const done = step > s.id; const active = step === s.id;
            return (
              <div key={s.id} className="flex flex-1 items-center">
                <div className="flex flex-col items-center gap-1">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all ${done ? "border-blue-600 bg-blue-600" : active ? "border-blue-600 bg-white" : "border-slate-300 bg-white"}`}>
                    {done ? <CheckCircle2 className="h-4 w-4 text-white" /> : <Icon className={`h-4 w-4 ${active ? "text-blue-600" : "text-slate-400"}`} />}
                  </div>
                  <span className={`hidden text-[10px] font-semibold sm:block ${active ? "text-blue-700" : done ? "text-blue-500" : "text-slate-400"}`}>{s.label}</span>
                </div>
                {i < STEPS.length - 1 && <div className={`mx-1 h-0.5 flex-1 ${step > s.id ? "bg-blue-600" : "bg-slate-200"}`} />}
              </div>
            );
          })}
        </div>

        {/* Form card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="mb-6 text-base font-bold text-slate-900">{STEPS[step - 1].label}</h2>

          {/* STEP 1: Data Diri */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Nama Lengkap" required error={errors.full_name}>
                  <input className={inputCls} placeholder="Muhammad Arifin" value={form.full_name} onChange={e => upd("full_name", e.target.value)} />
                </Field>
                <Field label="Domisili" required error={errors.domicile}>
                  <input className={inputCls} placeholder="Jakarta Selatan" value={form.domicile} onChange={e => upd("domicile", e.target.value)} />
                </Field>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Email Aktif" required error={errors.email}>
                  <input type="email" className={inputCls} placeholder="nama@email.com" value={form.email} onChange={e => upd("email", e.target.value)} />
                </Field>
                <Field label="Nomor WhatsApp" required error={errors.phone_number}>
                  <input type="tel" className={inputCls} placeholder="08123456789" value={form.phone_number} onChange={e => upd("phone_number", e.target.value)} />
                </Field>
              </div>
            </div>
          )}

          {/* STEP 2: Jenis Surat */}
          {step === 2 && (
            <div className="space-y-6">
              <Field label="Pilih Jenis Surat" required error={errors.jenis_surat}>
                <div className="grid gap-3 sm:grid-cols-2">
                  {JENIS_OPTIONS.map(opt => (
                    <button key={opt.value} type="button" onClick={() => upd("jenis_surat", opt.value)}
                      className={`flex items-start gap-3 rounded-xl border-2 p-3 text-left transition-all ${form.jenis_surat === opt.value ? "border-blue-600 bg-blue-50" : "border-slate-200 hover:border-blue-300"}`}>
                      <span className="text-xl">{opt.emoji}</span>
                      <div>
                        <p className={`text-sm font-bold ${form.jenis_surat === opt.value ? "text-blue-700" : "text-slate-700"}`}>{opt.label}</p>
                        <p className="mt-0.5 text-xs text-slate-500">{opt.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="Tujuan Surat" required helper="Jelaskan keperluan pembuatan surat ini" error={errors.tujuan_surat}>
                <textarea rows={3} className={textareaCls} placeholder="Contoh: Untuk keperluan administrasi pengambilan dokumen di kantor..."
                  value={form.tujuan_surat} onChange={e => upd("tujuan_surat", e.target.value)} />
              </Field>

              {/* Conditional fields */}
              {form.jenis_surat === "surat_kuasa" && (
                <div className="space-y-4 rounded-xl border border-amber-100 bg-amber-50/50 p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-amber-600">📋 Detail Surat Kuasa</p>
                  <Field label="Data Pemberi Kuasa" helper="Nama lengkap dan identitas pemberi kuasa">
                    <textarea rows={2} className={textareaCls} placeholder="Nama: ..., NIK: ..., Alamat: ..."
                      value={form.pemberi_kuasa} onChange={e => upd("pemberi_kuasa", e.target.value)} />
                  </Field>
                  <Field label="Data Penerima Kuasa" helper="Nama lengkap dan identitas penerima kuasa">
                    <textarea rows={2} className={textareaCls} placeholder="Nama: ..., NIK: ..., Alamat: ..."
                      value={form.penerima_kuasa} onChange={e => upd("penerima_kuasa", e.target.value)} />
                  </Field>
                  <Field label="Isi / Lingkup Kuasa" helper="Jelaskan wewenang yang diberikan">
                    <textarea rows={3} className={textareaCls} placeholder="Memberikan kuasa untuk mengurus/mengambil..."
                      value={form.isi_kuasa} onChange={e => upd("isi_kuasa", e.target.value)} />
                  </Field>
                </div>
              )}

              {form.jenis_surat === "surat_perjanjian" && (
                <div className="space-y-4 rounded-xl border border-amber-100 bg-amber-50/50 p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-amber-600">🤝 Detail Surat Perjanjian</p>
                  <Field label="Data Pihak Pertama" helper="Nama, identitas, dan peran pihak pertama">
                    <textarea rows={2} className={textareaCls} placeholder="Nama: ..., sebagai PIHAK PERTAMA..."
                      value={form.pihak_pertama} onChange={e => upd("pihak_pertama", e.target.value)} />
                  </Field>
                  <Field label="Data Pihak Kedua" helper="Nama, identitas, dan peran pihak kedua">
                    <textarea rows={2} className={textareaCls} placeholder="Nama: ..., sebagai PIHAK KEDUA..."
                      value={form.pihak_kedua} onChange={e => upd("pihak_kedua", e.target.value)} />
                  </Field>
                  <Field label="Isi Perjanjian" helper="Tuliskan poin-poin perjanjian yang disepakati">
                    <textarea rows={5} className={textareaCls} placeholder="1. Pihak pertama sepakat untuk...\n2. Pihak kedua berkewajiban..."
                      value={form.isi_perjanjian} onChange={e => upd("isi_perjanjian", e.target.value)} />
                  </Field>
                </div>
              )}

              {form.jenis_surat === "surat_pernyataan" && (
                <div className="space-y-4 rounded-xl border border-amber-100 bg-amber-50/50 p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-amber-600">✍️ Detail Surat Pernyataan</p>
                  <Field label="Isi Pernyataan" helper="Tuliskan hal-hal yang ingin dinyatakan">
                    <textarea rows={4} className={textareaCls} placeholder="Dengan ini saya menyatakan bahwa..."
                      value={form.isi_pernyataan} onChange={e => upd("isi_pernyataan", e.target.value)} />
                  </Field>
                </div>
              )}

              {form.jenis_surat === "lainnya" && (
                <div className="space-y-4 rounded-xl border border-amber-100 bg-amber-50/50 p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-amber-600">📄 Jenis Surat Lainnya</p>
                  <Field label="Nama Jenis Surat" helper="Tuliskan nama jenis surat yang dibutuhkan">
                    <input className={inputCls} placeholder="Contoh: Surat Keterangan Domisili, Surat Referensi..."
                      value={form.custom_jenis} onChange={e => upd("custom_jenis", e.target.value)} />
                  </Field>
                  <Field label="Deskripsi Detail" helper="Jelaskan isi dan kebutuhan surat secara lengkap">
                    <textarea rows={4} className={textareaCls} placeholder="Ceritakan detail kebutuhan surat Anda..."
                      value={form.custom_deskripsi} onChange={e => upd("custom_deskripsi", e.target.value)} />
                  </Field>
                </div>
              )}

              <Field label="Catatan Khusus" helper="Opsional — informasi tambahan untuk admin">
                <textarea rows={2} className={textareaCls} placeholder="Ada hal khusus yang perlu diperhatikan?"
                  value={form.catatan_khusus} onChange={e => upd("catatan_khusus", e.target.value)} />
              </Field>
            </div>
          )}

          {/* STEP 3: Review */}
          {step === 3 && (
            <div className="space-y-5">
              {invalidSteps.length > 0 && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
                    <div>
                      <p className="text-sm font-bold text-red-700">Data belum lengkap di {invalidSteps.length} langkah</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {invalidSteps.map(s => (
                          <button key={s} onClick={() => setStep(s)}
                            className="flex items-center gap-1.5 rounded-lg border border-red-300 bg-white px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100">
                            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-black text-white">{s}</span>
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
              {[
                { title: "Data Diri", rows: [["Nama", form.full_name], ["Domisili", form.domicile], ["Email", form.email], ["WhatsApp", form.phone_number]] },
                { title: "Detail Surat", rows: [["Jenis Surat", jenisMeta?.label ?? "-"], ["Tujuan", form.tujuan_surat]] },
              ].map(sec => (
                <div key={sec.title} className="rounded-xl border border-slate-200 p-4">
                  <p className="mb-3 text-xs font-bold uppercase tracking-widest text-blue-600">{sec.title}</p>
                  {sec.rows.map(([label, value]) => value ? (
                    <div key={label} className="flex gap-3 border-b border-slate-100 py-2 last:border-0">
                      <span className="w-32 shrink-0 text-xs font-semibold text-slate-500">{label}</span>
                      <span className="text-sm text-slate-800 wrap-break-word">{value}</span>
                    </div>
                  ) : null)}
                </div>
              ))}
            </div>
          )}

          {submitError && (
            <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
              <p className="text-sm text-red-700">{submitError}</p>
            </div>
          )}
        </div>

        {/* Nav buttons */}
        <div className="mt-5 flex items-center justify-between">
          {step > 1 ? (
            <button onClick={() => { setErrors({}); setStep(s => s - 1); }} disabled={isLoading}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-60">
              <ChevronLeft className="h-4 w-4" />Kembali
            </button>
          ) : <div />}
          {step < STEPS.length ? (
            <button onClick={handleNext}
              className="flex items-center gap-2 rounded-xl bg-blue-700 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-blue-800 active:scale-95">
              Lanjutkan <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={isLoading}
              className="flex items-center gap-2 rounded-xl bg-blue-700 px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-blue-800 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed">
              {isLoading ? <><Loader2 className="h-4 w-4 animate-spin" />Menyimpan...</> : <><CheckCircle2 className="h-4 w-4" />Kirim & Lanjut ke WhatsApp</>}
            </button>
          )}
        </div>
        <p className="mt-4 text-center text-xs text-slate-400">🔒 Data Anda dijaga kerahasiaannya dan hanya digunakan untuk pembuatan surat.</p>
      </div>
    </div>
  );
}
