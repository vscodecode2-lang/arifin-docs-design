import { AlertCircle } from "lucide-react";
import type { LamaranFormData } from "@/types/lamaran";
import { STEP_LABELS } from "../constants";

function Row({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex gap-3 border-b border-slate-100 py-2 last:border-0">
      <span className="w-40 shrink-0 text-xs font-semibold text-slate-500">{label}</span>
      <span className="break-all text-sm text-slate-800">{value || <span className="italic text-slate-400">-</span>}</span>
    </div>
  );
}

export function Step4Review({ form, invalidSteps, onGoToStep }: {
  form: LamaranFormData;
  invalidSteps: number[];
  onGoToStep: (s: number) => void;
}) {
  const careerLabel: Record<string, string> = {
    fresh_graduate: "🎓 Fresh Graduate",
    profesional: "💼 Profesional",
    career_switcher: "🔄 Career Switcher",
    remote_worker: "🌐 Remote Worker",
    "": "-",
  };


  return (
    <div className="space-y-5">
      {/* Error Banner */}
      {invalidSteps.length > 0 && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
            <div className="flex-1">
              <p className="text-sm font-bold text-red-700">
                Data belum lengkap di {invalidSteps.length} langkah
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {invalidSteps.map(step => (
                  <button key={step} type="button" onClick={() => onGoToStep(step)}
                    className="flex items-center gap-1.5 rounded-lg border border-red-300 bg-white px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 transition-colors">
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
      )}

      {invalidSteps.length === 0 && (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          ✅ Semua data terisi. Klik <strong>&quot;Kirim &amp; Lanjut ke WhatsApp&quot;</strong> untuk mengirim.
        </p>
      )}

      <div className="rounded-xl border border-slate-200 p-4">
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-blue-600">Data Diri</p>
        <Row label="Nama Lengkap" value={form.step1.full_name} />
        <Row label="Domisili" value={form.step1.domicile} />
        <Row label="Email" value={form.step1.email} />
        <Row label="WhatsApp" value={form.step1.phone_number} />
        <Row label="Status Karir" value={careerLabel[form.step1.career_status]} />
      </div>

      <div className="rounded-xl border border-slate-200 p-4">
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-blue-600">Info Lamaran</p>
        <Row label="Perusahaan" value={form.step2.company_name} />
        <Row label="Posisi" value={form.step2.position_target} />
        <Row label="Sumber Lowongan" value={form.step2.job_source} />
        <Row label="Nama HR" value={form.step2.hr_name} />
        <Row label="Tone Surat" value={form.step2.tone_surat} />
        <Row label="Motivasi" value={form.step2.motivation.slice(0, 100) + (form.step2.motivation.length > 100 ? "..." : "")} />
      </div>
    </div>
  );
}
