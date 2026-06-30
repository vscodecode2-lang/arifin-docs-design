import type { CvFormData } from "@/types/cv";
import { FieldWrapper } from "./FieldWrapper";
import { inputClass, textareaClass, INDUSTRIES } from "../constants";

export function Step2({ data, onChange, errors }: {
  data: CvFormData["step2"];
  onChange: (field: keyof CvFormData["step2"], value: string) => void;
  errors: Record<string, string>;
}) {
  return (
    <div className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <FieldWrapper label="Email Aktif" required helper="Gunakan email profesional" error={errors.email}>
          <input type="email" className={inputClass} placeholder="nama@email.com"
            value={data.email} onChange={(e) => onChange("email", e.target.value)} />
        </FieldWrapper>
        <FieldWrapper label="Nomor WhatsApp" required helper="Contoh: 08123456789" error={errors.phone_number}>
          <input type="tel" className={inputClass} placeholder="0812xxxxxxx"
            value={data.phone_number} onChange={(e) => onChange("phone_number", e.target.value)} />
        </FieldWrapper>
      </div>

      <FieldWrapper label="LinkedIn Profile" helper="Opsional" error={errors.linkedin}>
        <input type="url" className={inputClass} placeholder="https://linkedin.com/in/username"
          value={data.linkedin} onChange={(e) => onChange("linkedin", e.target.value)} />
      </FieldWrapper>

      <div className="grid gap-5 sm:grid-cols-2">
        <FieldWrapper label="Portfolio Website" helper="Opsional" error={errors.portfolio}>
          <input type="url" className={inputClass} placeholder="https://portfolio.com"
            value={data.portfolio} onChange={(e) => onChange("portfolio", e.target.value)} />
        </FieldWrapper>
        <FieldWrapper label="GitHub Profile" helper="Untuk posisi teknikal" error={errors.github}>
          <input type="url" className={inputClass} placeholder="https://github.com/username"
            value={data.github} onChange={(e) => onChange("github", e.target.value)} />
        </FieldWrapper>
      </div>

      <FieldWrapper label="Posisi yang Dilamar" required helper="Posisi target utama Anda" error={errors.target_position}>
        <input className={inputClass} placeholder="UI/UX Designer" value={data.target_position}
          onChange={(e) => onChange("target_position", e.target.value)} />
      </FieldWrapper>

      <FieldWrapper label="Industri Target" helper="Pilih industri yang paling sesuai">
        <select className={inputClass} value={data.target_industry}
          onChange={(e) => onChange("target_industry", e.target.value)}>
          <option value="">-- Pilih Industri --</option>
          {INDUSTRIES.map((ind) => <option key={ind}>{ind}</option>)}
        </select>
      </FieldWrapper>

      <FieldWrapper label="Kata Kunci Lowongan (ATS Keywords)"
        helper="Ambil dari deskripsi pekerjaan target, pisahkan dengan koma">
        <textarea rows={3} className={textareaClass}
          placeholder="Contoh: UI Design, Figma, UX Research, Wireframing, Prototyping"
          value={data.ats_keywords} onChange={(e) => onChange("ats_keywords", e.target.value)} />
      </FieldWrapper>
    </div>
  );
}
