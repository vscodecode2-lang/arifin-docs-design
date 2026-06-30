import { Upload, X } from "lucide-react";
import type { FormState } from "../types";
import { Field } from "./Field";
import { inputCls } from "../constants";

export function Step1({ form, errors, onChange, onPhotoChange }: {
  form: FormState;
  errors: Record<string, string>;
  onChange: (f: keyof FormState, v: string | boolean | File | null) => void;
  onPhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Nama Lengkap" required helper="Sesuai identitas resmi" error={errors.full_name}>
          <input className={inputCls} placeholder="Muhammad Arifin"
            value={form.full_name} onChange={e => onChange("full_name", e.target.value)} />
        </Field>
        <Field label="Domisili Saat Ini" required helper="Kota tempat tinggal" error={errors.domicile}>
          <input className={inputCls} placeholder="Semarang, Jawa Tengah"
            value={form.domicile} onChange={e => onChange("domicile", e.target.value)} />
        </Field>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Email Aktif" required helper="Gunakan email profesional" error={errors.email}>
          <input type="email" className={inputCls} placeholder="nama@email.com"
            value={form.email} onChange={e => onChange("email", e.target.value)} />
        </Field>
        <Field label="Nomor WhatsApp" required helper="Contoh: 08123456789" error={errors.phone_number}>
          <input type="tel" className={inputCls} placeholder="0812xxxxxxx"
            value={form.phone_number} onChange={e => onChange("phone_number", e.target.value)} />
        </Field>
      </div>
      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Jenis Kelamin">
          <select className={inputCls} value={form.gender} onChange={e => onChange("gender", e.target.value)}>
            <option value="">-- Pilih --</option>
            <option>Laki-laki</option>
            <option>Perempuan</option>
          </select>
        </Field>
        <Field label="Tempat Lahir" helper="Opsional">
          <input className={inputCls} placeholder="Semarang"
            value={form.birth_place} onChange={e => onChange("birth_place", e.target.value)} />
        </Field>
        <Field label="Tanggal Lahir" helper="Opsional">
          <input type="date" className={inputCls} value={form.birth_date}
            onChange={e => onChange("birth_date", e.target.value)} />
        </Field>
      </div>
      <Field label="Foto Profesional" helper="Format JPG/PNG, maks. 5MB. Opsional, untuk CV.">
        <div className="flex items-center gap-3">
          <label className="flex cursor-pointer items-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-500 hover:border-blue-400 hover:text-blue-600 transition-colors">
            <Upload className="h-4 w-4" />
            {form.photo_file ? form.photo_file.name : "Pilih foto..."}
            <input type="file" className="hidden" accept="image/jpeg,image/png" onChange={onPhotoChange} />
          </label>
          {form.photo_file && (
            <button type="button" onClick={() => onChange("photo_file", null)}
              className="text-slate-400 hover:text-red-500 transition-colors">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </Field>
    </div>
  );
}
