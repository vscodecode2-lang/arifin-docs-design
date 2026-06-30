import { CheckCircle2 } from "lucide-react";
import type { FormState } from "../types";
import { Field } from "./Field";
import { inputCls, textareaCls, INDUSTRIES, JOB_SOURCES, BASE_PRICE, QNA_ADDON_PRICE } from "../constants";

export function Step2({ form, errors, onChange }: {
  form: FormState;
  errors: Record<string, string>;
  onChange: (f: keyof FormState, v: string | boolean | File | null) => void;
}) {
  const total = BASE_PRICE + (form.add_qna_hrd ? QNA_ADDON_PRICE : 0);

  return (
    <div className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Posisi yang Dilamar" required helper="Posisi target CV dan surat lamaran" error={errors.target_position}>
          <input className={inputCls} placeholder="UI/UX Designer"
            value={form.target_position} onChange={e => onChange("target_position", e.target.value)} />
        </Field>
        <Field label="Nama Perusahaan Tujuan" required helper="Perusahaan yang akan dilamar" error={errors.company_name}>
          <input className={inputCls} placeholder="PT ABC Indonesia"
            value={form.company_name} onChange={e => onChange("company_name", e.target.value)} />
        </Field>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Industri Target" helper="Sesuaikan keyword dengan industri ini">
          <select className={inputCls} value={form.target_industry}
            onChange={e => onChange("target_industry", e.target.value)}>
            <option value="">-- Pilih industri --</option>
            {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
          </select>
        </Field>
        <Field label="Sumber Informasi Lowongan" helper="Dari mana Anda tahu lowongan ini?">
          <select className={inputCls} value={form.job_source}
            onChange={e => onChange("job_source", e.target.value)}>
            <option value="">-- Pilih sumber --</option>
            {JOB_SOURCES.map(s => <option key={s}>{s}</option>)}
          </select>
        </Field>
      </div>
      <Field label="Kata Kunci dari Deskripsi Pekerjaan" helper="Copy dari job desc lowongan yang dituju, pisah dengan koma">
        <textarea rows={2} className={textareaCls}
          placeholder="Contoh: UI Design, Figma, User Research, Wireframing, Agile, Collaboration..."
          value={form.ats_keywords} onChange={e => onChange("ats_keywords", e.target.value)} />
      </Field>

      {/* Add-on QnA HRD */}
      <div className={`rounded-2xl border-2 p-4 transition-all cursor-pointer ${
        form.add_qna_hrd ? "border-violet-500 bg-violet-50" : "border-slate-200 hover:border-violet-300"
      }`}
        onClick={() => onChange("add_qna_hrd", !form.add_qna_hrd)}>
        <div className="flex items-start gap-3">
          <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-all ${
            form.add_qna_hrd ? "border-violet-600 bg-violet-600" : "border-slate-300"
          }`}>
            {form.add_qna_hrd && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <p className={`text-sm font-bold ${form.add_qna_hrd ? "text-violet-700" : "text-slate-800"}`}>
                Tambah: Simulasi QnA Interview HRD
              </p>
              <span className="rounded-full bg-violet-600 px-2 py-0.5 text-[10px] font-bold text-white">
                +Rp {QNA_ADDON_PRICE.toLocaleString("id-ID")}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Dapatkan 10–15 pertanyaan interview HRD yang disesuaikan dengan posisi{" "}
              <span className="font-semibold text-slate-700">
                {form.target_position || "[posisi Anda]"}
              </span>{" "}
              beserta contoh jawaban terbaik. Siapkan diri sebelum wawancara!
            </p>
          </div>
        </div>
      </div>

      {/* Total price display */}
      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
        <span className="text-sm text-slate-600">Total Paket</span>
        <div className="text-right">
          <span className="text-lg font-black text-blue-700">
            Rp {total.toLocaleString("id-ID")}
          </span>
          {form.add_qna_hrd && (
            <p className="text-xs text-violet-600 font-semibold">Termasuk QnA HRD custom</p>
          )}
        </div>
      </div>
    </div>
  );
}
