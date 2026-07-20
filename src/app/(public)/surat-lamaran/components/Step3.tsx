import type { LamaranFormData, LamaranCareerStatus } from "@/types/lamaran";
import { ExperienceEntryList } from "@/components/forms/ExperienceEntryList";
import { Field } from "./Field";
import { inputCls, textareaCls } from "../constants";

export function Step3({ data, errors, careerStatus, onChange }: {
  data: LamaranFormData["step3"];
  errors: Record<string, string>;
  careerStatus: LamaranCareerStatus;
  onChange: (f: keyof LamaranFormData["step3"], v: string) => void;
}) {
  if (!careerStatus) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-center">
        <p className="text-sm font-semibold text-amber-700">
          Kembali ke Step 1 dan pilih Status Karir Anda terlebih dahulu.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Fresh Graduate ── */}
      {careerStatus === "fresh_graduate" && (
        <div className="space-y-5 rounded-xl border border-blue-100 bg-blue-50/40 p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-600">🎓 Fresh Graduate</p>
          <Field label="Pengalaman Organisasi" helper="Nama org, jabatan, periode" error={errors.org_experience}>
            <textarea rows={3} className={textareaCls}
              placeholder="Ketua BEM Fakultas (2022-2023), Anggota Himpunan Mahasiswa (2021-2022)"
              value={data.org_experience} onChange={e => onChange("org_experience", e.target.value)} />
          </Field>
          <Field label="Pengalaman Magang" helper="Perusahaan, posisi, durasi" error={errors.internship}>
            <textarea rows={3} className={textareaCls}
              placeholder="Magang UI/UX Designer di PT Teknologi Maju — 3 bulan (2024)"
              value={data.internship} onChange={e => onChange("internship", e.target.value)} />
          </Field>
          <Field label="Project Kampus" helper="Project atau tugas akhir yang relevan" error={errors.campus_project}>
            <textarea rows={3} className={textareaCls}
              placeholder="Aplikasi manajemen inventaris berbasis web (React + Node.js) — Tugas Akhir 2024"
              value={data.campus_project} onChange={e => onChange("campus_project", e.target.value)} />
          </Field>
        </div>
      )}

      {/* ── Profesional ── */}
      {careerStatus === "profesional" && (
        <div className="space-y-5 rounded-xl border border-blue-100 bg-blue-50/40 p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-600">💼 Profesional</p>
          <ExperienceEntryList
            label="Pengalaman Kerja"
            required
            helper="Tambah pengalaman kerja secara terpisah agar lebih mudah dan lebih friendly saat mengisi."
            error={errors.work_experience}
            value={data.work_experience}
            onChange={(value) => onChange("work_experience", value)}
          />
          <Field label="Achievement / Pencapaian" helper="Gunakan angka/data jika memungkinkan" error={errors.achievement}>
            <textarea rows={3} className={textareaCls}
              placeholder="Meningkatkan user retention 25%, menyelesaikan redesign dalam 2 minggu, memimpin tim 5 orang"
              value={data.achievement} onChange={e => onChange("achievement", e.target.value)} />
          </Field>
          <Field label="KPI / Target yang Pernah Dicapai" error={errors.kpi}>
            <textarea rows={2} className={textareaCls}
              placeholder="Revenue growth 30%, NPS 80, zero critical bugs per sprint"
              value={data.kpi} onChange={e => onChange("kpi", e.target.value)} />
          </Field>
        </div>
      )}

      {/* ── Career Switcher ── */}
      {careerStatus === "career_switcher" && (
        <div className="space-y-5 rounded-xl border border-blue-100 bg-blue-50/40 p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-600">🔄 Career Switcher</p>
          <Field label="Alasan Pindah Karir" helper="Jelaskan motivasi dan latar belakang perpindahan" error={errors.career_switch_reason}>
            <textarea rows={4} className={textareaCls}
              placeholder="Selama 3 tahun bekerja sebagai akuntan, saya menemukan passion di bidang teknologi dan telah mempelajari UI/UX secara mandiri melalui..."
              value={data.career_switch_reason} onChange={e => onChange("career_switch_reason", e.target.value)} />
          </Field>
          <Field label="Transferable Skills" helper="Keahlian dari karir lama yang relevan dengan posisi baru" error={errors.transferable_skills}>
            <textarea rows={4} className={textareaCls}
              placeholder="Analytical thinking dari background akuntansi sangat relevan untuk UX research. Problem solving, data analysis, attention to detail..."
              value={data.transferable_skills} onChange={e => onChange("transferable_skills", e.target.value)} />
          </Field>
        </div>
      )}

      {/* ── Remote Worker ── */}
      {careerStatus === "remote_worker" && (
        <div className="space-y-5 rounded-xl border border-blue-100 bg-blue-50/40 p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-600">🌐 Remote Worker</p>
          <Field label="Timezone" helper="Zona waktu tempat Anda bekerja" error={errors.timezone}>
            <select className={inputCls} value={data.timezone}
              onChange={e => onChange("timezone", e.target.value)}>
              <option value="">-- Pilih timezone --</option>
              <option value="WIB (UTC+7)">WIB (UTC+7) — Sumatera, Jawa, Kalimantan Barat</option>
              <option value="WITA (UTC+8)">WITA (UTC+8) — Kalimantan Tengah & Timur, Sulawesi, Bali</option>
              <option value="WIT (UTC+9)">WIT (UTC+9) — Maluku, Papua</option>
              <option value="Fleksibel">Fleksibel / Menyesuaikan klien</option>
            </select>
          </Field>
          <Field label="Remote Tools yang Dikuasai" error={errors.remote_tools}>
            <textarea rows={2} className={textareaCls}
              placeholder="Slack, Notion, Zoom, Jira, Trello, Figma, Google Workspace, Asana..."
              value={data.remote_tools} onChange={e => onChange("remote_tools", e.target.value)} />
          </Field>
          <Field label="Pengalaman Remote Collaboration" helper="Ceritakan pengalaman bekerja secara remote" error={errors.remote_experience}>
            <textarea rows={4} className={textareaCls}
              placeholder="Selama 2 tahun saya bekerja remote untuk klien di Singapura dan Australia, terbiasa dengan async communication dan daily standup via Zoom..."
              value={data.remote_experience} onChange={e => onChange("remote_experience", e.target.value)} />
          </Field>
        </div>
      )}
    </div>
  );
}
