import { AlertCircle } from "lucide-react";
import type { CvFormData } from "@/types/cv";
import { STEP_LABELS } from "../constants";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3 py-2 border-b border-slate-100 last:border-0">
      <span className="w-40 shrink-0 text-xs font-semibold text-slate-500">{label}</span>
      <span className="text-sm text-slate-800 break-all">{value || "-"}</span>
    </div>
  );
}

export function Step5Review({ form, invalidSteps, onGoToStep }: {
  form: CvFormData;
  invalidSteps: number[];
  onGoToStep: (step: number) => void;
}) {
  const statusLabel: Record<string, string> = {
    fresh_graduate: "Fresh Graduate",
    profesional: "Profesional",
    career_switcher: "Career Switcher",
    "": "-",
  };


  return (
    <div className="space-y-6">
      {/* ── Validation Error Banner ── */}
      {invalidSteps.length > 0 ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
            <div className="flex-1">
              <p className="text-sm font-bold text-red-700">
                Data belum lengkap di {invalidSteps.length} langkah
              </p>
              <p className="mt-1 text-xs text-red-600">
                Klik langkah di bawah untuk memperbaiki:
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {invalidSteps.map((step) => (
                  <button
                    key={step}
                    type="button"
                    onClick={() => onGoToStep(step)}
                    className="flex items-center gap-1.5 rounded-lg border border-red-300 bg-white px-3 py-1.5 text-xs font-semibold text-red-700 transition-colors hover:bg-red-100"
                  >
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-black text-white">
                      {step}
                    </span>
                    {STEP_LABELS[step]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          ✅ Semua data terisi dengan benar. Klik <strong>&quot;Kirim &amp; Lanjut ke WhatsApp&quot;</strong> untuk melanjutkan.
        </p>
      )}

      <div className="rounded-xl border border-slate-200 p-4">
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-blue-600">Informasi Pribadi</p>
        <Row label="Nama Lengkap" value={form.step1.full_name} />
        <Row label="Domisili" value={form.step1.domicile} />
        <Row label="Jenis Kelamin" value={form.step1.gender} />
      </div>

      <div className="rounded-xl border border-slate-200 p-4">
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-blue-600">Kontak & Posisi</p>
        <Row label="Email" value={form.step2.email} />
        <Row label="WhatsApp" value={form.step2.phone_number} />
        <Row label="Posisi Target" value={form.step2.target_position} />
        <Row label="Industri" value={form.step2.target_industry} />
      </div>

      <div className="rounded-xl border border-slate-200 p-4">
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-blue-600">Pendidikan</p>
        <Row label="Institusi" value={form.step3.institution} />
        <Row label="Jurusan" value={form.step3.major} />
        <Row label="Periode" value={`${form.step3.year_start} - ${form.step3.year_end}`} />
        {form.step3.gpa && <Row label="IPK" value={form.step3.gpa} />}
      </div>

      <div className="rounded-xl border border-slate-200 p-4">
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-blue-600">Status Karir</p>
        <Row label="Tipe" value={statusLabel[form.step4.career_status]} />
        {form.step1.photo_file && <Row label="Foto" value={form.step1.photo_file.name} />}
      </div>
    </div>
  );
}
