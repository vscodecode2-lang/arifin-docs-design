import type { LamaranFormData } from "@/types/lamaran";
import { Field } from "./Field";
import { inputCls, textareaCls, JOB_SOURCES, TONE_OPTIONS } from "../constants";

export function Step2({ data, errors, onChange }: {
  data: LamaranFormData["step2"];
  errors: Record<string, string>;
  onChange: (f: keyof LamaranFormData["step2"], v: string) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Nama Perusahaan" required error={errors.company_name}>
          <input className={inputCls} placeholder="PT ABC Indonesia"
            value={data.company_name} onChange={e => onChange("company_name", e.target.value)} />
        </Field>
        <Field label="Posisi yang Dilamar" required error={errors.position_target}>
          <input className={inputCls} placeholder="UI/UX Designer"
            value={data.position_target} onChange={e => onChange("position_target", e.target.value)} />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Sumber Lowongan" helper="Dari mana Anda mengetahui lowongan ini?">
          <select className={inputCls} value={data.job_source}
            onChange={e => onChange("job_source", e.target.value)}>
            <option value="">-- Pilih sumber --</option>
            {JOB_SOURCES.map(s => <option key={s}>{s}</option>)}
          </select>
        </Field>
        <Field label="Nama HR / Recruiter" helper="Opsional — untuk personalisasi surat">
          <input className={inputCls} placeholder="Bapak Andi / Ibu Sari"
            value={data.hr_name} onChange={e => onChange("hr_name", e.target.value)} />
        </Field>
      </div>

      <Field label="Motivasi Melamar" required
        helper="Jelaskan mengapa Anda tertarik dengan posisi dan perusahaan ini"
        error={errors.motivation}>
        <textarea rows={4} className={textareaCls}
          placeholder="Saya tertarik melamar posisi ini karena... dan saya percaya pengalaman saya dalam... sangat relevan dengan kebutuhan perusahaan."
          value={data.motivation} onChange={e => onChange("motivation", e.target.value)} />
        <p className="mt-1 text-right text-xs text-slate-400">
          {data.motivation.length}/2000 karakter (min. 20)
        </p>
      </Field>

      <Field label="Keyword Lowongan" helper="Ambil dari deskripsi pekerjaan, pisah dengan koma">
        <textarea rows={2} className={textareaCls}
          placeholder="UI Design, Figma, Prototyping, User Research, Agile..."
          value={data.job_keywords} onChange={e => onChange("job_keywords", e.target.value)} />
      </Field>

      <Field label="Tone / Gaya Penulisan Surat" helper="Pilih gaya yang sesuai dengan budaya perusahaan">
        <div className="grid gap-2 sm:grid-cols-3">
          {TONE_OPTIONS.map(t => (
            <button key={t.value} type="button"
              onClick={() => onChange("tone_surat", t.value)}
              className={`rounded-xl border-2 p-3 text-left transition-all ${
                data.tone_surat === t.value
                  ? "border-blue-600 bg-blue-50"
                  : "border-slate-200 hover:border-blue-300"
              }`}>
              <p className={`text-sm font-bold ${data.tone_surat === t.value ? "text-blue-700" : "text-slate-700"}`}>
                {t.label}
              </p>
              <p className="text-xs text-slate-500">{t.desc}</p>
            </button>
          ))}
        </div>
      </Field>
    </div>
  );
}
