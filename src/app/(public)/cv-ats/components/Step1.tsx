import { Upload, X } from "lucide-react";
import type { CvFormData } from "@/types/cv";
import { FieldWrapper } from "./FieldWrapper";
import { inputClass } from "../constants";

export function Step1({ data, onChange, errors }: {
  data: CvFormData["step1"];
  onChange: (field: keyof CvFormData["step1"], value: string | File | null) => void;
  errors: Record<string, string>;
}) {
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file && file.size > 5 * 1024 * 1024) {
      alert("Ukuran foto maksimal 5MB");
      return;
    }
    onChange("photo_file", file);
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <FieldWrapper label="Nama Lengkap" required helper="Sesuai identitas resmi" error={errors.full_name}>
          <input className={inputClass} placeholder="Muhammad Arifin" value={data.full_name}
            onChange={(e) => onChange("full_name", e.target.value)} />
        </FieldWrapper>
        <FieldWrapper label="Nama Panggilan" helper="Opsional">
          <input className={inputClass} placeholder="Arifin" value={data.nickname}
            onChange={(e) => onChange("nickname", e.target.value)} />
        </FieldWrapper>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FieldWrapper label="Tempat Lahir" helper="Opsional">
          <input className={inputClass} placeholder="Semarang" value={data.birth_place}
            onChange={(e) => onChange("birth_place", e.target.value)} />
        </FieldWrapper>
        <FieldWrapper label="Tanggal Lahir" helper="Opsional">
          <input type="date" className={inputClass} value={data.birth_date}
            onChange={(e) => onChange("birth_date", e.target.value)} />
        </FieldWrapper>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FieldWrapper label="Jenis Kelamin">
          <select className={inputClass} value={data.gender}
            onChange={(e) => onChange("gender", e.target.value)}>
            <option value="">-- Pilih --</option>
            <option>Laki-laki</option>
            <option>Perempuan</option>
          </select>
        </FieldWrapper>
        <FieldWrapper label="Domisili Saat Ini" required helper="Kota tempat tinggal saat ini" error={errors.domicile}>
          <input className={inputClass} placeholder="Jakarta Selatan" value={data.domicile}
            onChange={(e) => onChange("domicile", e.target.value)} />
        </FieldWrapper>
      </div>

      <FieldWrapper label="Foto Profesional" helper="Format JPG/PNG, maksimal 5MB. Gunakan foto formal.">
        <div className="flex items-center gap-3">
          <label className="flex cursor-pointer items-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-500 transition-colors hover:border-blue-400 hover:text-blue-600">
            <Upload className="h-4 w-4" />
            {data.photo_file ? data.photo_file.name : "Pilih foto..."}
            <input type="file" className="hidden" accept="image/jpeg,image/png"
              onChange={handlePhotoChange} />
          </label>
          {data.photo_file && (
            <button type="button" onClick={() => onChange("photo_file", null)}
              className="text-slate-400 hover:text-red-500">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </FieldWrapper>
    </div>
  );
}
