import type { CvFormData } from "@/types/cv";
import { FieldWrapper } from "./FieldWrapper";
import { inputClass } from "../constants";

export function Step3({ data, onChange, errors }: {
  data: CvFormData["step3"];
  onChange: (field: keyof CvFormData["step3"], value: string) => void;
  errors: Record<string, string>;
}) {
  return (
    <div className="space-y-5">
      <p className="rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-700">
        💡 Isi riwayat pendidikan terakhir atau yang paling relevan dengan posisi yang dilamar.
      </p>

      <FieldWrapper label="Nama Institusi" required error={errors.institution}>
        <input className={inputClass} placeholder="Universitas Indonesia" value={data.institution}
          onChange={(e) => onChange("institution", e.target.value)} />
      </FieldWrapper>

      <FieldWrapper label="Jurusan / Program Studi" required error={errors.major}>
        <input className={inputClass} placeholder="Teknik Informatika" value={data.major}
          onChange={(e) => onChange("major", e.target.value)} />
      </FieldWrapper>

      <div className="grid gap-5 sm:grid-cols-3">
        <FieldWrapper label="Tahun Masuk" required error={errors.year_start}>
          <input type="number" className={inputClass} placeholder="2021" min="1990"
            max={new Date().getFullYear()} value={data.year_start}
            onChange={(e) => onChange("year_start", e.target.value)} />
        </FieldWrapper>
        <FieldWrapper label="Tahun Lulus" required helper="Estimasi jika belum lulus" error={errors.year_end}>
          <input type="number" className={inputClass} placeholder="2025" min="1990"
            max={new Date().getFullYear() + 6} value={data.year_end}
            onChange={(e) => onChange("year_end", e.target.value)} />
        </FieldWrapper>
        <FieldWrapper label="IPK / Nilai" helper="Opsional (0.00 - 4.00)" error={errors.gpa}>
          <input type="number" step="0.01" min="0" max="4" className={inputClass}
            placeholder="3.75" value={data.gpa}
            onChange={(e) => onChange("gpa", e.target.value)} />
        </FieldWrapper>
      </div>
    </div>
  );
}
