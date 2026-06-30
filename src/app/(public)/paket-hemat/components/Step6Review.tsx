import { AlertCircle } from "lucide-react";
import type { FormState } from "../types";
import { STEP_LABELS, BASE_PRICE, QNA_ADDON_PRICE } from "../constants";

export function Step6Review({ form, invalidSteps, onGoToStep }: {
  form: FormState;
  invalidSteps: number[];
  onGoToStep: (s: number) => void;
}) {
  const total = BASE_PRICE + (form.add_qna_hrd ? QNA_ADDON_PRICE : 0);

  const sections = [
    {
      title: "Data Pribadi",
      rows: [
        ["Nama Lengkap", form.full_name],
        ["Email", form.email],
        ["Nomor WhatsApp", form.phone_number],
        ["Domisili", form.domicile],
        ["Jenis Kelamin", form.gender],
      ],
    },
    {
      title: "Target Karir",
      rows: [
        ["Posisi Dilamar", form.target_position],
        ["Perusahaan", form.company_name],
        ["Industri", form.target_industry],
        ["Simulasi QnA HRD", form.add_qna_hrd ? "Ya (+Rp 10.000)" : "Tidak"],
      ],
    },
    {
      title: "Pendidikan",
      rows: [
        ["Institusi", form.institution],
        ["Jurusan", form.major],
        ["Periode", `${form.year_start} – ${form.year_end}`],
        ["IPK", form.gpa],
      ],
    },
  ];

  return (
    <div className="space-y-5">
      {invalidSteps.length > 0 && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
            <div>
              <p className="text-sm font-bold text-red-700">
                Data belum lengkap di {invalidSteps.length} langkah
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {invalidSteps.map(s => (
                  <button key={s} onClick={() => onGoToStep(s)}
                    className="flex items-center gap-1.5 rounded-lg border border-red-300 bg-white px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 transition-colors">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-black text-white">{s}</span>
                    {STEP_LABELS[s]}
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

      {/* Ringkasan Paket */}
      <div className="rounded-xl border border-violet-200 bg-violet-50 p-4">
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-violet-600">Ringkasan Paket</p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-900">Paket Siap Kerja</p>
            <p className="text-xs text-slate-500">CV ATS Friendly + Surat Lamaran Profesional</p>
            {form.add_qna_hrd && (
              <p className="text-xs font-semibold text-violet-600">+ Simulasi QnA Interview HRD Custom</p>
            )}
          </div>
          <span className="text-xl font-black text-blue-700">
            Rp {total.toLocaleString("id-ID")}
          </span>
        </div>
      </div>

      {sections.map(sec => (
        <div key={sec.title} className="rounded-xl border border-slate-200 p-4">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-blue-600">{sec.title}</p>
          {sec.rows.filter(([, v]) => v).map(([label, value]) => (
            <div key={label} className="flex gap-3 border-b border-slate-100 py-2 last:border-0">
              <span className="w-36 shrink-0 text-xs font-semibold text-slate-500">{label}</span>
              <span className="text-sm text-slate-800 wrap-break-word">{value}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
