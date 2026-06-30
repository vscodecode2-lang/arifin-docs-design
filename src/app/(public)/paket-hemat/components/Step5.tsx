import type { FormState } from "../types";
import { Field } from "./Field";
import { inputCls, textareaCls, TONE_OPTIONS } from "../constants";

export function Step5({ form, errors, onChange }: {
  form: FormState;
  errors: Record<string, string>;
  onChange: (f: keyof FormState, v: string) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="rounded-xl bg-blue-50 border border-blue-100 p-3">
        <p className="text-xs text-blue-700">
          💡 Info ini digunakan khusus untuk surat lamaran ke{" "}
          <span className="font-bold">{form.company_name || "[nama perusahaan]"}</span>{" "}
          posisi{" "}
          <span className="font-bold">{form.target_position || "[posisi]"}</span>.
        </p>
      </div>
      <Field label="Motivasi Melamar" required
        helper="Jelaskan mengapa Anda tertarik dengan posisi dan perusahaan ini"
        error={errors.motivation}>
        <textarea rows={5} className={textareaCls}
          placeholder="Saya sangat tertarik melamar posisi ini karena... dan saya percaya pengalaman saya dalam... sangat relevan dengan kebutuhan perusahaan..."
          value={form.motivation} onChange={e => onChange("motivation", e.target.value)} />
        <p className="mt-1 text-right text-xs text-slate-400">
          {form.motivation.length}/2000 karakter (min. 20)
        </p>
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Nama HR / Rekruter" helper="Opsional — untuk personalisasi surat">
          <input className={inputCls} placeholder="Bapak Andi / Ibu Sari"
            value={form.hr_name} onChange={e => onChange("hr_name", e.target.value)} />
        </Field>
        <Field label="Keyword dari Job Description" helper="Untuk optimasi ATS surat lamaran">
          <input className={inputCls} placeholder="Leadership, Teamwork, Analytical..."
            value={form.job_keywords} onChange={e => onChange("job_keywords", e.target.value)} />
        </Field>
      </div>
      <Field label="Gaya Penulisan Surat" helper="Pilih tone yang sesuai budaya perusahaan">
        <div className="grid gap-3 sm:grid-cols-3">
          {TONE_OPTIONS.map(t => (
            <button key={t.value} type="button"
              onClick={() => onChange("tone_surat", t.value)}
              className={`rounded-xl border-2 p-3 text-left transition-all ${
                form.tone_surat === t.value ? "border-blue-600 bg-blue-50" : "border-slate-200 hover:border-blue-300"
              }`}>
              <p className={`text-sm font-bold ${form.tone_surat === t.value ? "text-blue-700" : "text-slate-700"}`}>
                {t.label}
              </p>
              <p className="text-xs text-slate-500">{t.desc}</p>
            </button>
          ))}
        </div>
      </Field>
      <Field label="Catatan Khusus" helper="Opsional — informasi tambahan untuk admin">
        <textarea rows={2} className={textareaCls}
          placeholder="Ada hal khusus yang perlu diperhatikan dalam pembuatan dokumen?"
          value={form.catatan} onChange={e => onChange("catatan", e.target.value)} />
      </Field>
    </div>
  );
}
