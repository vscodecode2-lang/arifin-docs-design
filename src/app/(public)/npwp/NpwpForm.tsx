"use client";

import { useState } from "react";
import { submitNpwpAction } from "@/app/actions/submit-npwp";
import { generateWhatsAppLink } from "@/lib/utils";
import { CreditCard, User, ClipboardList, ChevronRight, ChevronLeft, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

const ADMIN_WA = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP ?? "6285801193410";

const STEPS = [
  { id: 1, label: "Data Pribadi", icon: User },
  { id: 2, label: "Jenis Layanan", icon: CreditCard },
  { id: 3, label: "Review", icon: ClipboardList },
];

const STEP_LABELS: Record<number, string> = { 1: "Data Pribadi", 2: "Jenis Layanan" };
const FIELD_TO_STEP: Record<string, number> = {
  full_name: 1, nik: 1, nomor_kk: 1, email: 1, phone_number: 1, domicile: 1,
  jenis_npwp: 2, status_pekerjaan: 2, penghasilan: 2, jenis_usaha: 2,
  npwp_lama: 2, data_yang_diubah: 2, email_akun: 2, kendala_akun: 2, nama_perusahaan: 2,
};

const JENIS_OPTIONS = [
  { value: "baru",           label: "NPWP Baru",          emoji: "🆕", desc: "Belum punya NPWP sama sekali" },
  { value: "perubahan_data", label: "Perubahan Data",      emoji: "✏️",  desc: "Update data pada NPWP yang sudah ada" },
  { value: "aktivasi",       label: "Aktivasi Akun",       emoji: "🔓", desc: "Aktivasi akun DJP Online yang bermasalah" },
  { value: "freelancer_umkm",label: "Freelancer / UMKM",  emoji: "💼", desc: "NPWP untuk usaha mandiri atau UMKM" },
  { value: "karyawan",       label: "Karyawan",            emoji: "🏢", desc: "NPWP untuk keperluan pekerjaan formal" },
];

const STATUS_PEKERJAAN_OPTIONS = ["Karyawan Swasta", "PNS / ASN", "Wirausaha", "Freelancer", "Tidak Bekerja", "Mahasiswa / Pelajar"];
const PENGHASILAN_OPTIONS      = ["Di bawah Rp 4.500.000", "Rp 4.500.000 – Rp 10.000.000", "Rp 10.000.000 – Rp 20.000.000", "Di atas Rp 20.000.000"];

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
  full_name: string; nik: string; nomor_kk: string; email: string; phone_number: string; domicile: string;
  jenis_npwp: string; status_pekerjaan: string; penghasilan: string; jenis_usaha: string;
  npwp_lama: string; data_yang_diubah: string; email_akun: string; kendala_akun: string;
  nama_perusahaan: string; catatan: string;
}

const INITIAL: FormState = {
  full_name: "", nik: "", nomor_kk: "", email: "", phone_number: "", domicile: "",
  jenis_npwp: "", status_pekerjaan: "", penghasilan: "", jenis_usaha: "",
  npwp_lama: "", data_yang_diubah: "", email_akun: "", kendala_akun: "",
  nama_perusahaan: "", catatan: "",
};

export function NpwpForm() {
  const [step, setStep]               = useState(1);
  const [form, setForm]               = useState<FormState>(INITIAL);
  const [errors, setErrors]           = useState<Record<string, string>>({});
  const [invalidSteps, setInvalidSteps] = useState<number[]>([]);
  const [isLoading, setIsLoading]     = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const upd = (f: keyof FormState, v: string) => setForm(p => ({ ...p, [f]: v }));

  const validateStep = (n: number): Record<string, string> => {
    const e: Record<string, string> = {};
    if (n === 1) {
      if (!form.full_name.trim())    e.full_name    = "Nama sesuai KTP wajib diisi";
      if (!form.nik.trim())          e.nik          = "NIK wajib diisi";
      else if (!/^\d{16}$/.test(form.nik)) e.nik   = "NIK harus 16 digit angka";
      if (!form.nomor_kk.trim())     e.nomor_kk     = "Nomor KK wajib diisi";
      else if (!/^\d{16}$/.test(form.nomor_kk)) e.nomor_kk = "Nomor KK harus 16 digit";
      if (!form.email.trim())        e.email        = "Email wajib diisi";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Format email tidak valid";
      if (!form.phone_number.trim()) e.phone_number = "Nomor WA wajib diisi";
      else if (!/^(\+62|62|0)8[1-9][0-9]{7,11}$/.test(form.phone_number)) e.phone_number = "Format tidak valid";
      if (!form.domicile.trim())     e.domicile     = "Alamat domisili wajib diisi";
    }
    if (n === 2) {
      if (!form.jenis_npwp)          e.jenis_npwp   = "Pilih jenis layanan NPWP";
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
      const result = await submitNpwpAction(fd);
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
      window.location.href = generateWhatsAppLink("Pendaftaran NPWP Online", ADMIN_WA, result.orderCode);
    } catch { setSubmitError("Gagal menghubungi server."); }
    finally { setIsLoading(false); }
  };

  const progress   = Math.round(((step - 1) / (STEPS.length - 1)) * 100);
  const jenisMeta  = JENIS_OPTIONS.find(o => o.value === form.jenis_npwp);

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <div className="mb-8 text-center">
          <span className="mb-2 inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-emerald-700">Pendaftaran NPWP</span>
          <h1 className="text-2xl font-black text-slate-900">Formulir NPWP Online</h1>
          <p className="mt-1 text-sm text-slate-500">Proses cepat, aman, dan terpercaya tanpa antri</p>
        </div>

        {/* Privacy notice */}
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
          <span className="text-lg">🔐</span>
          <p className="text-xs text-blue-700"><span className="font-bold">Keamanan Data:</span> NIK dan data pribadi Anda dienkripsi dan hanya digunakan untuk proses pendaftaran NPWP. Data tidak disebarkan ke pihak ketiga.</p>
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

          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-5">
              <Field label="Nama Sesuai KTP" required helper="Gunakan nama persis seperti di KTP" error={errors.full_name}>
                <input className={inputCls} placeholder="Muhammad Arifin" value={form.full_name} onChange={e => upd("full_name", e.target.value)} />
              </Field>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="NIK" required helper="16 digit angka sesuai KTP" error={errors.nik}>
                  <input className={inputCls} placeholder="3374xxxxxxxxxxxxxxxx" maxLength={16} value={form.nik} onChange={e => upd("nik", e.target.value.replace(/\D/g, ""))} />
                </Field>
                <Field label="Nomor KK" required helper="16 digit nomor Kartu Keluarga" error={errors.nomor_kk}>
                  <input className={inputCls} placeholder="3374xxxxxxxxxxxxxxxx" maxLength={16} value={form.nomor_kk} onChange={e => upd("nomor_kk", e.target.value.replace(/\D/g, ""))} />
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
              <Field label="Alamat Domisili" required helper="Alamat sesuai tempat tinggal saat ini" error={errors.domicile}>
                <textarea rows={2} className={textareaCls} placeholder="Jl. Contoh No. 123, Kecamatan, Kota" value={form.domicile} onChange={e => upd("domicile", e.target.value)} />
              </Field>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-6">
              <Field label="Jenis Layanan NPWP" required error={errors.jenis_npwp}>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {JENIS_OPTIONS.map(opt => (
                    <button key={opt.value} type="button" onClick={() => upd("jenis_npwp", opt.value)}
                      className={`flex items-start gap-2 rounded-xl border-2 p-3 text-left transition-all ${form.jenis_npwp === opt.value ? "border-blue-600 bg-blue-50" : "border-slate-200 hover:border-blue-300"}`}>
                      <span className="text-lg">{opt.emoji}</span>
                      <div>
                        <p className={`text-xs font-bold ${form.jenis_npwp === opt.value ? "text-blue-700" : "text-slate-700"}`}>{opt.label}</p>
                        <p className="mt-0.5 text-[11px] text-slate-500">{opt.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </Field>

              {/* Conditional */}
              {form.jenis_npwp === "baru" && (
                <div className="space-y-4 rounded-xl border border-emerald-100 bg-emerald-50/40 p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">🆕 Detail NPWP Baru</p>
                  <Field label="Status Pekerjaan" helper="Pilih status pekerjaan saat ini">
                    <select className={inputCls} value={form.status_pekerjaan} onChange={e => upd("status_pekerjaan", e.target.value)}>
                      <option value="">-- Pilih status --</option>
                      {STATUS_PEKERJAAN_OPTIONS.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </Field>
                  <Field label="Kisaran Penghasilan per Bulan">
                    <select className={inputCls} value={form.penghasilan} onChange={e => upd("penghasilan", e.target.value)}>
                      <option value="">-- Pilih kisaran --</option>
                      {PENGHASILAN_OPTIONS.map(p => <option key={p}>{p}</option>)}
                    </select>
                  </Field>
                  <Field label="Jenis Usaha / Bidang Pekerjaan" helper="Opsional — untuk wirausaha atau freelancer">
                    <input className={inputCls} placeholder="Contoh: Jasa desain grafis, Toko online, Konsultan IT..." value={form.jenis_usaha} onChange={e => upd("jenis_usaha", e.target.value)} />
                  </Field>
                </div>
              )}
              {form.jenis_npwp === "perubahan_data" && (
                <div className="space-y-4 rounded-xl border border-emerald-100 bg-emerald-50/40 p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">✏️ Perubahan Data NPWP</p>
                  <Field label="Nomor NPWP Lama" helper="Isi nomor NPWP yang sudah ada">
                    <input className={inputCls} placeholder="00.000.000.0-000.000" value={form.npwp_lama} onChange={e => upd("npwp_lama", e.target.value)} />
                  </Field>
                  <Field label="Data yang Ingin Diubah" helper="Jelaskan data apa yang perlu diperbarui">
                    <textarea rows={2} className={textareaCls} placeholder="Contoh: Perubahan alamat, nama, status perkawinan..." value={form.data_yang_diubah} onChange={e => upd("data_yang_diubah", e.target.value)} />
                  </Field>
                </div>
              )}
              {form.jenis_npwp === "aktivasi" && (
                <div className="space-y-4 rounded-xl border border-emerald-100 bg-emerald-50/40 p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">🔓 Aktivasi Akun DJP</p>
                  <Field label="Email Akun DJP Online" helper="Email yang terdaftar di sistem pajak">
                    <input type="email" className={inputCls} placeholder="email@terdaftar.com" value={form.email_akun} onChange={e => upd("email_akun", e.target.value)} />
                  </Field>
                  <Field label="Kendala yang Dialami" helper="Ceritakan masalah akun Anda">
                    <textarea rows={3} className={textareaCls} placeholder="Contoh: Lupa password, tidak bisa login, OTP tidak masuk..." value={form.kendala_akun} onChange={e => upd("kendala_akun", e.target.value)} />
                  </Field>
                </div>
              )}
              {form.jenis_npwp === "freelancer_umkm" && (
                <div className="space-y-4 rounded-xl border border-emerald-100 bg-emerald-50/40 p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">💼 Detail Freelancer / UMKM</p>
                  <Field label="Jenis Usaha / Bidang" helper="Jelaskan bidang usaha atau jenis pekerjaan Anda">
                    <textarea rows={2} className={textareaCls} placeholder="Contoh: Jasa desain grafis freelance, Toko online fashion, Warung makan, dst." value={form.jenis_usaha} onChange={e => upd("jenis_usaha", e.target.value)} />
                  </Field>
                </div>
              )}
              {form.jenis_npwp === "karyawan" && (
                <div className="space-y-4 rounded-xl border border-emerald-100 bg-emerald-50/40 p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">🏢 Detail Karyawan</p>
                  <Field label="Nama Perusahaan / Instansi" helper="Tempat Anda bekerja saat ini">
                    <input className={inputCls} placeholder="PT ABC Indonesia / Dinas Kesehatan Kota..." value={form.nama_perusahaan} onChange={e => upd("nama_perusahaan", e.target.value)} />
                  </Field>
                </div>
              )}

              <Field label="Catatan Tambahan" helper="Opsional">
                <textarea rows={2} className={textareaCls} placeholder="Informasi lain yang perlu disampaikan..." value={form.catatan} onChange={e => upd("catatan", e.target.value)} />
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
              {[
                { title: "Data Pribadi", rows: [["Nama (KTP)", form.full_name], ["NIK", form.nik.replace(/(\d{4})(?=\d)/g, "$1-")], ["Nomor KK", form.nomor_kk], ["Email", form.email], ["WhatsApp", form.phone_number]] },
                { title: "Jenis Layanan", rows: [["Jenis NPWP", jenisMeta?.label ?? "-"]] },
              ].map(sec => (
                <div key={sec.title} className="rounded-xl border border-slate-200 p-4">
                  <p className="mb-3 text-xs font-bold uppercase tracking-widest text-blue-600">{sec.title}</p>
                  {sec.rows.map(([label, value]) => (
                    <div key={label} className="flex gap-3 border-b border-slate-100 py-2 last:border-0">
                      <span className="w-32 shrink-0 text-xs font-semibold text-slate-500">{label}</span>
                      <span className="text-sm text-slate-800">{value || "-"}</span>
                    </div>
                  ))}
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
        <p className="mt-4 text-center text-xs text-slate-400">🔒 NIK dan data sensitif dienkripsi. Tidak disebarkan ke pihak ketiga.</p>
      </div>
    </div>
  );
}
