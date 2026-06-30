import type { FormState } from "../types";
import { Field } from "./Field";
import { inputCls, textareaCls, CAREER_OPTIONS } from "../constants";

export function Step4({ form, errors, onChange }: {
  form: FormState;
  errors: Record<string, string>;
  onChange: (f: keyof FormState, v: string) => void;
}) {
  return (
    <div className="space-y-6">
      <Field label="Status Karir Anda" required error={errors.career_status}>
        <div className="grid gap-3 sm:grid-cols-2">
          {CAREER_OPTIONS.map(opt => (
            <button key={opt.value} type="button"
              onClick={() => onChange("career_status", opt.value)}
              className={`flex items-start gap-3 rounded-xl border-2 p-3 text-left transition-all ${
                form.career_status === opt.value
                  ? "border-blue-600 bg-blue-50"
                  : "border-slate-200 hover:border-blue-300"
              }`}>
              <span className="text-xl">{opt.emoji}</span>
              <div>
                <p className={`text-sm font-bold ${form.career_status === opt.value ? "text-blue-700" : "text-slate-700"}`}>
                  {opt.label}
                </p>
                <p className="mt-0.5 text-xs text-slate-500">{opt.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </Field>

      {form.career_status === "fresh_graduate" && (
        <div className="space-y-4 rounded-xl border border-blue-100 bg-blue-50/40 p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-600">🎓 Data Fresh Graduate</p>
          <Field label="Pengalaman Organisasi" helper="Nama organisasi, jabatan, dan periode">
            <textarea rows={3} className={textareaCls}
              placeholder="Ketua BEM Fakultas Teknik (2022–2023), Anggota Himpunan Mahasiswa Informatika (2021–2022)"
              value={form.org_experience} onChange={e => onChange("org_experience", e.target.value)} />
          </Field>
          <Field label="Pengalaman Magang" helper="Nama perusahaan, posisi, dan durasi magang">
            <textarea rows={3} className={textareaCls}
              placeholder="Magang UI/UX Designer di PT Teknologi Maju — 3 bulan (Januari–Maret 2024)"
              value={form.internship} onChange={e => onChange("internship", e.target.value)} />
          </Field>
          <Field label="Project Kampus / Tugas Akhir" helper="Project yang relevan dengan posisi yang dilamar">
            <textarea rows={2} className={textareaCls}
              placeholder="Aplikasi manajemen perpustakaan berbasis web menggunakan React dan Node.js — Tugas Akhir 2024"
              value={form.campus_project} onChange={e => onChange("campus_project", e.target.value)} />
          </Field>
          <Field label="Sertifikat / Pelatihan" helper="Sertifikat yang relevan dan tahun perolehannya">
            <textarea rows={2} className={textareaCls}
              placeholder="Google UX Design Certificate (2023), AWS Cloud Practitioner (2024)"
              value={form.certificates} onChange={e => onChange("certificates", e.target.value)} />
          </Field>
        </div>
      )}

      {form.career_status === "profesional" && (
        <div className="space-y-4 rounded-xl border border-blue-100 bg-blue-50/40 p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-600">💼 Data Profesional</p>
          <Field label="Pengalaman Kerja" required helper="Nama perusahaan, posisi, periode, dan tanggung jawab utama" error={errors.work_experience}>
            <textarea rows={5} className={textareaCls}
              placeholder="PT ABC Indonesia — UI/UX Designer (Januari 2022 – Sekarang)&#10;Tanggung jawab: Merancang UI untuk 3 produk utama, berkolaborasi dengan tim developer dan PM&#10;&#10;PT XYZ — Junior Designer (Agustus 2020 – Desember 2021)"
              value={form.work_experience} onChange={e => onChange("work_experience", e.target.value)} />
          </Field>
          <Field label="Pencapaian Terbaik" helper="Gunakan angka atau data yang bisa diukur">
            <textarea rows={3} className={textareaCls}
              placeholder="Meningkatkan user retention sebesar 25%, memimpin tim 5 orang, menyelesaikan redesign dalam 2 minggu"
              value={form.achievement} onChange={e => onChange("achievement", e.target.value)} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="KPI / Target yang Dicapai">
              <textarea rows={2} className={textareaCls}
                placeholder="Revenue growth 30%, NPS 80, zero critical bugs per sprint"
                value={form.kpi} onChange={e => onChange("kpi", e.target.value)} />
            </Field>
            <Field label="Tools dan Software yang Dikuasai">
              <textarea rows={2} className={textareaCls}
                placeholder="Figma, Adobe XD, Jira, Notion, Google Analytics"
                value={form.work_tools} onChange={e => onChange("work_tools", e.target.value)} />
            </Field>
          </div>
        </div>
      )}

      {form.career_status === "career_switcher" && (
        <div className="space-y-4 rounded-xl border border-blue-100 bg-blue-50/40 p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-600">🔄 Data Career Switcher</p>
          <Field label="Alasan Pindah Karir" helper="Ceritakan motivasi dan latar belakang Anda">
            <textarea rows={4} className={textareaCls}
              placeholder="Selama 3 tahun bekerja sebagai akuntan, saya menemukan passion di bidang teknologi dan telah mempelajari UI/UX secara mandiri..."
              value={form.career_switch_reason} onChange={e => onChange("career_switch_reason", e.target.value)} />
          </Field>
          <Field label="Kemampuan yang Bisa Ditransfer" helper="Keahlian dari karir lama yang relevan dengan posisi baru">
            <textarea rows={3} className={textareaCls}
              placeholder="Kemampuan analitis dari background akuntansi sangat relevan untuk UX research. Problem solving, data analysis, attention to detail..."
              value={form.transferable_skills} onChange={e => onChange("transferable_skills", e.target.value)} />
          </Field>
        </div>
      )}

      {form.career_status === "remote_worker" && (
        <div className="space-y-4 rounded-xl border border-blue-100 bg-blue-50/40 p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-600">🌐 Data Remote Worker</p>
          <Field label="Zona Waktu Kerja">
            <select className={inputCls} value={form.timezone}
              onChange={e => onChange("timezone", e.target.value)}>
              <option value="">-- Pilih timezone --</option>
              <option value="WIB (UTC+7)">WIB (UTC+7) — Jawa, Sumatera</option>
              <option value="WITA (UTC+8)">WITA (UTC+8) — Bali, Sulawesi</option>
              <option value="WIT (UTC+9)">WIT (UTC+9) — Papua</option>
              <option value="Fleksibel">Fleksibel menyesuaikan klien</option>
            </select>
          </Field>
          <Field label="Tools Kolaborasi Remote">
            <textarea rows={2} className={textareaCls}
              placeholder="Slack, Notion, Zoom, Jira, Figma, Google Workspace"
              value={form.remote_tools} onChange={e => onChange("remote_tools", e.target.value)} />
          </Field>
          <Field label="Pengalaman Bekerja Secara Remote">
            <textarea rows={3} className={textareaCls}
              placeholder="Selama 2 tahun bekerja remote untuk klien di Singapura, terbiasa dengan async communication dan daily standup..."
              value={form.remote_experience} onChange={e => onChange("remote_experience", e.target.value)} />
          </Field>
        </div>
      )}
    </div>
  );
}
