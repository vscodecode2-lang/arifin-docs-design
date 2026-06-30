import type { FormState } from "../types";
import { Field } from "./Field";
import { inputCls } from "../constants";

export function Step3({ form, errors, onChange }: {
  form: FormState;
  errors: Record<string, string>;
  onChange: (f: keyof FormState, v: string) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="rounded-xl bg-blue-50 border border-blue-100 p-3">
        <p className="text-xs text-blue-700">
          💡 Isi riwayat pendidikan terakhir atau paling relevan dengan posisi{" "}
          <span className="font-bold">{form.target_position || "yang dilamar"}</span>.
        </p>
      </div>
      <Field label="Nama Institusi Pendidikan" required error={errors.institution}>
        <input className={inputCls} placeholder="Universitas Diponegoro"
          value={form.institution} onChange={e => onChange("institution", e.target.value)} />
      </Field>
      <Field label="Jurusan / Program Studi" required error={errors.major}>
        <input className={inputCls} placeholder="Teknik Informatika"
          value={form.major} onChange={e => onChange("major", e.target.value)} />
      </Field>
      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Tahun Masuk" required error={errors.year_start}>
          <input type="number" className={inputCls} placeholder="2021"
            min="1990" max={new Date().getFullYear()}
            value={form.year_start} onChange={e => onChange("year_start", e.target.value)} />
        </Field>
        <Field label="Tahun Lulus" required helper="Estimasi jika belum lulus" error={errors.year_end}>
          <input type="number" className={inputCls} placeholder="2025"
            min="1990" max={new Date().getFullYear() + 6}
            value={form.year_end} onChange={e => onChange("year_end", e.target.value)} />
        </Field>
        <Field label="IPK" helper="Opsional (0.00–4.00)">
          <input type="number" step="0.01" min="0" max="4" className={inputCls}
            placeholder="3.75" value={form.gpa}
            onChange={e => onChange("gpa", e.target.value)} />
        </Field>
      </div>
    </div>
  );
}
