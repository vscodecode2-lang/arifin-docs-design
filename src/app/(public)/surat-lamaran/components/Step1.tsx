import type { LamaranFormData } from "@/types/lamaran";
import { Field } from "./Field";
import { inputCls, CAREER_OPTIONS } from "../constants";

export function Step1({ data, errors, onChange }: {
  data: LamaranFormData["step1"];
  errors: Record<string, string>;
  onChange: (f: keyof LamaranFormData["step1"], v: string) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Nama Lengkap" required helper="Sesuai identitas resmi" error={errors.full_name}>
          <input className={inputCls} placeholder="Muhammad Arifin"
            value={data.full_name} onChange={e => onChange("full_name", e.target.value)} />
        </Field>
        <Field label="Domisili Saat Ini" required helper="Kota tempat tinggal" error={errors.domicile}>
          <input className={inputCls} placeholder="Jakarta Selatan"
            value={data.domicile} onChange={e => onChange("domicile", e.target.value)} />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Email Aktif" required helper="Gunakan email profesional" error={errors.email}>
          <input type="email" className={inputCls} placeholder="nama@email.com"
            value={data.email} onChange={e => onChange("email", e.target.value)} />
        </Field>
        <Field label="Nomor WhatsApp" required helper="Contoh: 08123456789" error={errors.phone_number}>
          <input type="tel" className={inputCls} placeholder="0812xxxxxxx"
            value={data.phone_number} onChange={e => onChange("phone_number", e.target.value)} />
        </Field>
      </div>

      <Field label="Status Karir" required error={errors.career_status}>
        <div className="grid gap-3 sm:grid-cols-2">
          {CAREER_OPTIONS.map(opt => (
            <button key={opt.value} type="button"
              onClick={() => onChange("career_status", opt.value)}
              className={`flex items-start gap-3 rounded-xl border-2 p-3 text-left transition-all ${
                data.career_status === opt.value
                  ? "border-blue-600 bg-blue-50"
                  : "border-slate-200 hover:border-blue-300 hover:bg-slate-50"
              }`}>
              <span className="text-xl">{opt.emoji}</span>
              <div>
                <p className={`text-sm font-bold ${data.career_status === opt.value ? "text-blue-700" : "text-slate-700"}`}>
                  {opt.label}
                </p>
                <p className="mt-0.5 text-xs text-slate-500">{opt.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </Field>
    </div>
  );
}
