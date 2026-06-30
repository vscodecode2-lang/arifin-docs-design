"use client";

import { useState, useMemo, useEffect } from "react";
import { submitAkademikAction } from "@/app/actions/submit-akademik";
import { generateWhatsAppLink } from "@/lib/utils";
import { GraduationCap, BookOpen, ClipboardList, ChevronRight, ChevronLeft, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

const ADMIN_WA = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP ?? "6285801193410";

const STEPS = [
  { id: 1, label: "Data Diri", icon: GraduationCap },
  { id: 2, label: "Detail Tugas", icon: BookOpen },
  { id: 3, label: "Review", icon: ClipboardList },
];
const STEP_LABELS: Record<number, string> = { 1: "Data Diri", 2: "Detail Tugas" };
const FIELD_TO_STEP: Record<string, number> = {
  full_name: 1, email: 1, phone_number: 1,
  nama_matkul: 2, jenis_tugas: 2, deadline: 2, deskripsi_tugas: 2,
  bahasa_pemrograman: 2, framework: 2, tools_coding: 2,
  jumlah_slide: 2, style_desain: 2, jumlah_halaman: 2, format_referensi: 2,
  bab_pengerjaan: 2, topik_penelitian: 2,
};

const JENIS_OPTIONS = [
  { value: "coding",  label: "Coding / Programming", emoji: "💻", desc: "Web, mobile, algoritma, database" },
  { value: "ppt",     label: "Presentasi / PPT",      emoji: "📊", desc: "Slide profesional & menarik" },
  { value: "makalah", label: "Makalah / Essay",        emoji: "📝", desc: "Karya tulis ilmiah & laporan" },
  { value: "skripsi", label: "Skripsi / TA",           emoji: "🎓", desc: "Tugas akhir & penelitian" },
];

const inputCls    = "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors";
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
  full_name: string; email: string; phone_number: string;
  nama_matkul: string; jenis_tugas: string; deadline: string; deskripsi_tugas: string;
  bahasa_pemrograman: string; framework: string; tools_coding: string;
  jumlah_slide: string; style_desain: string;
  jumlah_halaman: string; format_referensi: string;
  bab_pengerjaan: string; topik_penelitian: string; catatan: string;
}

const INITIAL: FormState = {
  full_name: "", email: "", phone_number: "",
  nama_matkul: "", jenis_tugas: "", deadline: "", deskripsi_tugas: "",
  bahasa_pemrograman: "", framework: "", tools_coding: "",
  jumlah_slide: "", style_desain: "",
  jumlah_halaman: "", format_referensi: "",
  bab_pengerjaan: "", topik_penelitian: "", catatan: "",
};

export function AkademikForm() {
  const [step, setStep]               = useState(1);
  const [form, setForm]               = useState<FormState>(INITIAL);
  const [errors, setErrors]           = useState<Record<string, string>>({});
  const [invalidSteps, setInvalidSteps] = useState<number[]>([]);
  const [isLoading, setIsLoading]     = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const upd = (f: keyof FormState, v: string) => setForm(p => ({ ...p, [f]: v }));

  // Deadline urgency
  const deadlineInfo = useMemo(() => {
    if (!form.deadline || !now) return null;
    const diff = Math.ceil((new Date(form.deadline).getTime() - now) / (1000 * 60 * 60 * 24));
    if (diff < 0) return { label: "Deadline sudah lewat!", color: "text-red-600 bg-red-50 border-red-200" };
    if (diff === 0) return { label: "⚡ Deadline HARI INI — Segera hubungi admin!", color: "text-red-600 bg-red-50 border-red-200" };
    if (diff <= 2) return { label: `⚠️ Mepet! Hanya ${diff} hari lagi`, color: "text-amber-700 bg-amber-50 border-amber-200" };
    if (diff <= 7) return { label: `${diff} hari lagi`, color: "text-blue-700 bg-blue-50 border-blue-200" };
    return { label: `${diff} hari lagi`, color: "text-emerald-700 bg-emerald-50 border-emerald-200" };
  }, [form.deadline, now]);

  const validateStep = (n: number): Record<string, string> => {
    const e: Record<string, string> = {};
    if (n === 1) {
      if (!form.full_name.trim())    e.full_name    = "Nama wajib diisi";
      if (!form.email.trim())        e.email        = "Email wajib diisi";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Format tidak valid";
      if (!form.phone_number.trim()) e.phone_number = "Nomor WA wajib diisi";
      else if (!/^(\+62|62|0)8[1-9][0-9]{7,11}$/.test(form.phone_number)) e.phone_number = "Format tidak valid";
    }
    if (n === 2) {
      if (!form.nama_matkul.trim())  e.nama_matkul  = "Nama mata kuliah wajib diisi";
      if (!form.jenis_tugas)         e.jenis_tugas  = "Pilih jenis tugas";
      if (!form.deadline)            e.deadline     = "Deadline wajib diisi";
      else if (new Date(form.deadline) < new Date()) e.deadline = "Deadline tidak boleh di masa lalu";
      if (!form.deskripsi_tugas.trim()) e.deskripsi_tugas = "Deskripsi tugas wajib diisi";
      else if (form.deskripsi_tugas.trim().length < 10) e.deskripsi_tugas = "Minimal 10 karakter";
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
      const result = await submitAkademikAction(fd);
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
      window.location.href = generateWhatsAppLink("Pendampingan Akademik", ADMIN_WA, result.orderCode);
    } catch { setSubmitError("Gagal menghubungi server."); }
    finally { setIsLoading(false); }
  };

  const progress  = Math.round(((step - 1) / (STEPS.length - 1)) * 100);
  const jenisMeta = JENIS_OPTIONS.find(o => o.value === form.jenis_tugas);

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <div className="mb-8 text-center">
          <span className="mb-2 inline-block rounded-full bg-pink-100 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-pink-700">Pendampingan Akademik</span>
          <h1 className="text-2xl font-black text-slate-900">Formulir Pendampingan Tugas</h1>
          <p className="mt-1 text-sm text-slate-500">Deadline terjamin, revisi termasuk, kualitas profesional</p>
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

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="mb-6 text-base font-bold text-slate-900">{STEPS[step - 1].label}</h2>

          {step === 1 && (
            <div className="space-y-5">
              <Field label="Nama Lengkap" required error={errors.full_name}>
                <input className={inputCls} placeholder="Nama Anda" value={form.full_name} onChange={e => upd("full_name", e.target.value)} />
              </Field>
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

          {step === 2 && (
            <div className="space-y-6">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Nama Mata Kuliah / Pelajaran" required error={errors.nama_matkul}>
                  <input className={inputCls} placeholder="Basis Data, Pemrograman Web..." value={form.nama_matkul} onChange={e => upd("nama_matkul", e.target.value)} />
                </Field>
                <Field label="Deadline Pengumpulan" required helper={deadlineInfo ? undefined : "Pilih tanggal deadline"} error={errors.deadline}>
                  <input type="datetime-local" className={inputCls} value={form.deadline} onChange={e => upd("deadline", e.target.value)} min={new Date().toISOString().slice(0, 16)} />
                  {deadlineInfo && !errors.deadline && (
                    <span className={`mt-1 inline-block rounded-full border px-3 py-0.5 text-xs font-bold ${deadlineInfo.color}`}>{deadlineInfo.label}</span>
                  )}
                </Field>
              </div>

              <Field label="Jenis Tugas" required error={errors.jenis_tugas}>
                <div className="grid gap-3 sm:grid-cols-2">
                  {JENIS_OPTIONS.map(opt => (
                    <button key={opt.value} type="button" onClick={() => upd("jenis_tugas", opt.value)}
                      className={`flex items-start gap-3 rounded-xl border-2 p-3 text-left transition-all ${form.jenis_tugas === opt.value ? "border-blue-600 bg-blue-50" : "border-slate-200 hover:border-blue-300"}`}>
                      <span className="text-xl">{opt.emoji}</span>
                      <div>
                        <p className={`text-sm font-bold ${form.jenis_tugas === opt.value ? "text-blue-700" : "text-slate-700"}`}>{opt.label}</p>
                        <p className="mt-0.5 text-xs text-slate-500">{opt.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="Deskripsi Tugas" required helper="Jelaskan instruksi atau soal tugas secara lengkap" error={errors.deskripsi_tugas}>
                <textarea rows={4} className={textareaCls} placeholder="Buat program CRUD sederhana menggunakan PHP dan MySQL dengan fitur: tambah, edit, hapus, dan tampil data mahasiswa..."
                  value={form.deskripsi_tugas} onChange={e => upd("deskripsi_tugas", e.target.value)} />
              </Field>

              {/* Conditional */}
              {form.jenis_tugas === "coding" && (
                <div className="space-y-4 rounded-xl border border-pink-100 bg-pink-50/40 p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-pink-600">💻 Detail Coding</p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Bahasa Pemrograman" helper="Contoh: Python, PHP, JavaScript">
                      <input className={inputCls} placeholder="PHP, Python, Java, dst." value={form.bahasa_pemrograman} onChange={e => upd("bahasa_pemrograman", e.target.value)} />
                    </Field>
                    <Field label="Framework" helper="Opsional">
                      <input className={inputCls} placeholder="Laravel, React, Django, dst." value={form.framework} onChange={e => upd("framework", e.target.value)} />
                    </Field>
                  </div>
                  <Field label="Tools Wajib" helper="Database, IDE, atau tools yang harus digunakan">
                    <input className={inputCls} placeholder="MySQL, VS Code, Figma, dst." value={form.tools_coding} onChange={e => upd("tools_coding", e.target.value)} />
                  </Field>
                </div>
              )}

              {form.jenis_tugas === "ppt" && (
                <div className="space-y-4 rounded-xl border border-pink-100 bg-pink-50/40 p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-pink-600">📊 Detail PPT</p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Jumlah Slide" helper="Estimasi jumlah slide">
                      <input type="number" className={inputCls} placeholder="10" min="1" max="100" value={form.jumlah_slide} onChange={e => upd("jumlah_slide", e.target.value)} />
                    </Field>
                    <Field label="Style / Tema Desain" helper="Formal, modern, colorful, dll.">
                      <input className={inputCls} placeholder="Formal minimalis / Modern corporate" value={form.style_desain} onChange={e => upd("style_desain", e.target.value)} />
                    </Field>
                  </div>
                </div>
              )}

              {form.jenis_tugas === "makalah" && (
                <div className="space-y-4 rounded-xl border border-pink-100 bg-pink-50/40 p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-pink-600">📝 Detail Makalah</p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Jumlah Halaman" helper="Minimal halaman yang dibutuhkan">
                      <input type="number" className={inputCls} placeholder="10" min="1" value={form.jumlah_halaman} onChange={e => upd("jumlah_halaman", e.target.value)} />
                    </Field>
                    <Field label="Format Referensi" helper="APA, MLA, Chicago, dll.">
                      <input className={inputCls} placeholder="APA 7th Edition" value={form.format_referensi} onChange={e => upd("format_referensi", e.target.value)} />
                    </Field>
                  </div>
                </div>
              )}

              {form.jenis_tugas === "skripsi" && (
                <div className="space-y-4 rounded-xl border border-pink-100 bg-pink-50/40 p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-pink-600">🎓 Detail Skripsi / TA</p>
                  <Field label="BAB yang Dikerjakan" helper="Jelaskan bagian mana yang perlu dibantu">
                    <input className={inputCls} placeholder="BAB 1 (Pendahuluan) dan BAB 2 (Tinjauan Pustaka)" value={form.bab_pengerjaan} onChange={e => upd("bab_pengerjaan", e.target.value)} />
                  </Field>
                  <Field label="Topik / Judul Penelitian">
                    <textarea rows={2} className={textareaCls} placeholder="Analisis Sentimen Review Produk menggunakan NLP..." value={form.topik_penelitian} onChange={e => upd("topik_penelitian", e.target.value)} />
                  </Field>
                </div>
              )}

              <Field label="Catatan Tambahan" helper="Opsional — instruksi khusus dari dosen, format file, dll.">
                <textarea rows={2} className={textareaCls} placeholder="Format file harus .docx, gunakan Times New Roman 12pt..." value={form.catatan} onChange={e => upd("catatan", e.target.value)} />
              </Field>
            </div>
          )}

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
                          <button key={s} onClick={() => setStep(s)} className="flex items-center gap-1.5 rounded-lg border border-red-300 bg-white px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100">
                            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-black text-white">{s}</span>{STEP_LABELS[s]}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {invalidSteps.length === 0 && (
                <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">✅ Semua data terisi. Klik <strong>Kirim & Lanjut ke WhatsApp</strong> untuk mengirim.</p>
              )}
              <div className="rounded-xl border border-slate-200 p-4">
                <p className="mb-3 text-xs font-bold uppercase tracking-widest text-blue-600">Ringkasan</p>
                {[["Nama", form.full_name], ["Email", form.email], ["WhatsApp", form.phone_number], ["Mata Kuliah", form.nama_matkul], ["Jenis Tugas", jenisMeta?.label ?? "-"], ["Deadline", form.deadline ? new Date(form.deadline).toLocaleString("id-ID") : "-"]].map(([l, v]) => (
                  <div key={l} className="flex gap-3 border-b border-slate-100 py-2 last:border-0">
                    <span className="w-32 shrink-0 text-xs font-semibold text-slate-500">{l}</span>
                    <span className="text-sm text-slate-800">{v || "-"}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {submitError && (
            <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
              <p className="text-sm text-red-700">{submitError}</p>
            </div>
          )}
        </div>

        <div className="mt-5 flex items-center justify-between">
          {step > 1 ? (
            <button onClick={() => { setErrors({}); setStep(s => s - 1); }} disabled={isLoading}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-60">
              <ChevronLeft className="h-4 w-4" />Kembali
            </button>
          ) : <div />}
          {step < STEPS.length ? (
            <button onClick={handleNext} className="flex items-center gap-2 rounded-xl bg-blue-700 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-blue-800 active:scale-95">
              Lanjutkan <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={isLoading}
              className="flex items-center gap-2 rounded-xl bg-blue-700 px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-blue-800 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed">
              {isLoading ? <><Loader2 className="h-4 w-4 animate-spin" />Menyimpan...</> : <><CheckCircle2 className="h-4 w-4" />Kirim & Lanjut ke WhatsApp</>}
            </button>
          )}
        </div>
        <p className="mt-4 text-center text-xs text-slate-400">🔒 Detail tugas bersifat rahasia dan tidak disebarkan ke pihak ketiga.</p>
      </div>
    </div>
  );
}
