import type { CvFormData } from "@/types/cv";
import { FieldWrapper } from "./FieldWrapper";
import { inputClass, textareaClass, CAREER_STATUS_OPTIONS } from "../constants";

export function Step4({ data, onChange, errors }: {
  data: CvFormData["step4"];
  onChange: (field: keyof CvFormData["step4"], value: string) => void;
  errors: Record<string, string>;
}) {
  return (
    <div className="space-y-6">
      {/* Career Status Selector */}
      <FieldWrapper label="Status Karir Anda" required error={errors.career_status}>
        <div className="grid gap-3 sm:grid-cols-3">
          {CAREER_STATUS_OPTIONS.map((opt) => (
            <button key={opt.value} type="button"
              onClick={() => onChange("career_status", opt.value)}
              className={`rounded-xl border-2 p-3 text-left transition-all ${
                data.career_status === opt.value
                  ? "border-blue-600 bg-blue-50"
                  : "border-slate-200 hover:border-blue-300"
              }`}>
              <p className={`text-sm font-bold ${data.career_status === opt.value ? "text-blue-700" : "text-slate-700"}`}>
                {opt.label}
              </p>
              <p className="mt-0.5 text-xs text-slate-500">{opt.desc}</p>
            </button>
          ))}
        </div>
      </FieldWrapper>

      {/* ── Fresh Graduate Fields ── */}
      {data.career_status === "fresh_graduate" && (
        <div className="space-y-5 rounded-xl border border-blue-100 bg-blue-50/50 p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
            Informasi Fresh Graduate
          </p>
          <FieldWrapper label="Pengalaman Organisasi" helper="Nama organisasi, jabatan, periode">
            <textarea rows={3} className={textareaClass}
              placeholder="Contoh: Ketua BEM Fakultas (2022-2023), Himpunan Mahasiswa Teknik (2021-2022)"
              value={data.org_experience} onChange={(e) => onChange("org_experience", e.target.value)} />
          </FieldWrapper>
          <FieldWrapper label="Project Kampus" helper="Project atau tugas akhir yang relevan">
            <textarea rows={3} className={textareaClass}
              placeholder="Contoh: Aplikasi manajemen perpustakaan berbasis web (Python + Django)"
              value={data.campus_project} onChange={(e) => onChange("campus_project", e.target.value)} />
          </FieldWrapper>
          <FieldWrapper label="Pengalaman Magang" helper="Nama perusahaan, posisi, durasi">
            <textarea rows={3} className={textareaClass}
              placeholder="Contoh: Magang UI/UX Designer di PT Teknologi Maju (3 bulan, 2024)"
              value={data.internship} onChange={(e) => onChange("internship", e.target.value)} />
          </FieldWrapper>
          <div className="grid gap-5 sm:grid-cols-2">
            <FieldWrapper label="Sertifikat / Pelatihan">
              <textarea rows={2} className={textareaClass}
                placeholder="Google UX Design Certificate, AWS Cloud Practitioner..."
                value={data.certificates} onChange={(e) => onChange("certificates", e.target.value)} />
            </FieldWrapper>
            <FieldWrapper label="Kegiatan Volunteer">
              <textarea rows={2} className={textareaClass}
                placeholder="Relawan pengajar, event organizer komunitas..."
                value={data.volunteer} onChange={(e) => onChange("volunteer", e.target.value)} />
            </FieldWrapper>
          </div>
        </div>
      )}

      {/* ── Profesional Fields ── */}
      {data.career_status === "profesional" && (
        <div className="space-y-5 rounded-xl border border-blue-100 bg-blue-50/50 p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
            Informasi Profesional
          </p>
          <FieldWrapper label="Pengalaman Kerja" required={data.career_status === "profesional"}
            helper="Nama perusahaan, posisi, periode, dan deskripsi singkat tanggung jawab">
            <textarea rows={5} className={textareaClass}
              placeholder="PT ABC Indonesia — UI/UX Designer (Jan 2022 - Sekarang)&#10;- Merancang desain UI untuk 3 produk utama perusahaan&#10;- Berkolaborasi dengan tim developer dan product manager"
              value={data.work_experience} onChange={(e) => onChange("work_experience", e.target.value)} />
          </FieldWrapper>
          <FieldWrapper label="Achievement / Pencapaian" helper="Pencapaian yang bisa diukur (angka/data)">
            <textarea rows={3} className={textareaClass}
              placeholder="Contoh: Meningkatkan user retention 25%, memimpin tim 5 orang, menyelesaikan project senilai Rp500 juta"
              value={data.achievement} onChange={(e) => onChange("achievement", e.target.value)} />
          </FieldWrapper>
          <div className="grid gap-5 sm:grid-cols-2">
            <FieldWrapper label="KPI / Metrics" helper="Target atau KPI yang pernah dicapai">
              <textarea rows={2} className={textareaClass} placeholder="Revenue growth 30%, NPS score 80..."
                value={data.kpi} onChange={(e) => onChange("kpi", e.target.value)} />
            </FieldWrapper>
            <FieldWrapper label="Leadership / Manajemen">
              <textarea rows={2} className={textareaClass} placeholder="Tim dipimpin, scope proyek..."
                value={data.leadership} onChange={(e) => onChange("leadership", e.target.value)} />
            </FieldWrapper>
          </div>
          <FieldWrapper label="Tools & Software yang Dikuasai">
            <textarea rows={2} className={textareaClass}
              placeholder="Figma, Adobe XD, Jira, Notion, Slack, Google Analytics..."
              value={data.work_tools} onChange={(e) => onChange("work_tools", e.target.value)} />
          </FieldWrapper>
        </div>
      )}

      {/* ── Career Switcher Fields ── */}
      {data.career_status === "career_switcher" && (
        <div className="space-y-5 rounded-xl border border-blue-100 bg-blue-50/50 p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
            Informasi Career Switcher
          </p>
          <FieldWrapper label="Pengalaman Sebelumnya" helper="Karir/industri sebelumnya">
            <textarea rows={3} className={textareaClass}
              placeholder="Contoh: 3 tahun bekerja sebagai akuntan di perusahaan manufaktur"
              value={data.previous_experience} onChange={(e) => onChange("previous_experience", e.target.value)} />
          </FieldWrapper>
          <FieldWrapper label="Target Karir Baru" helper="Posisi atau bidang yang ingin dituju">
            <input className={inputClass} placeholder="UI/UX Designer, Product Manager, Data Analyst..."
              value={data.new_career_target} onChange={(e) => onChange("new_career_target", e.target.value)} />
          </FieldWrapper>
          <FieldWrapper label="Transferable Skills" helper="Skill dari karir lama yang relevan dengan karir baru">
            <textarea rows={3} className={textareaClass}
              placeholder="Contoh: Analytical thinking dari background akuntansi sangat relevan untuk data analysis"
              value={data.transferable_skills} onChange={(e) => onChange("transferable_skills", e.target.value)} />
          </FieldWrapper>
          <FieldWrapper label="Alasan Pindah Karir" helper="Ceritakan motivasi Anda (akan digunakan untuk narasi CV)">
            <textarea rows={3} className={textareaClass}
              placeholder="Contoh: Passion di bidang teknologi sejak lama dan melihat peluang pertumbuhan yang lebih besar..."
              value={data.career_switch_reason} onChange={(e) => onChange("career_switch_reason", e.target.value)} />
          </FieldWrapper>
        </div>
      )}
    </div>
  );
}
