"use client";

import {
  ChevronRight, ChevronLeft, Loader2, CheckCircle2, AlertCircle, Star,
} from "lucide-react";
import { usePaketHematForm } from "./hooks/usePaketHematForm";
import { STEPS, QNA_ADDON_PRICE } from "./constants";
import { Step1 } from "./components/Step1";
import { Step2 } from "./components/Step2";
import { Step3 } from "./components/Step3";
import { Step4 } from "./components/Step4";
import { Step5 } from "./components/Step5";
import { Step6Review } from "./components/Step6Review";

// ─── Main Page ────────────────────────────────────────────────────────────────

export function PaketHematForm() {
  const {
    step, form, errors, invalidSteps, isLoading, submitError, progress,
    updateField, handlePhotoChange,
    handleNext, handleBack, goToStep, handleSubmit,
  } = usePaketHematForm();

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-linear-to-r from-blue-600 to-violet-600 px-4 py-1.5">
            <Star className="h-3.5 w-3.5 fill-white text-white" />
            <span className="text-xs font-bold text-white uppercase tracking-widest">Paket Siap Kerja</span>
            <Star className="h-3.5 w-3.5 fill-white text-white" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">
            Formulir Paket Siap Kerja
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            CV ATS Friendly + Surat Lamaran Profesional — cukup isi satu form
          </p>
          <div className="mt-3 inline-flex items-center gap-3 rounded-2xl border border-violet-200 bg-violet-50 px-4 py-2">
            <span className="text-sm font-black text-violet-700">Rp 40.000</span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-600">
              +Rp {QNA_ADDON_PRICE.toLocaleString("id-ID")} untuk QnA HRD custom (pilih di Step 2)
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="mb-1.5 flex justify-between text-xs text-slate-500">
            <span>Langkah {step} dari {STEPS.length}</span>
            <span className="font-semibold text-blue-700">{progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-linear-to-r from-blue-600 to-violet-600 transition-all duration-500"
              style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Step indicators */}
        <div className="mb-8 flex items-center justify-between">
          {STEPS.map((s, i) => {
            const Icon = s.icon; const done = step > s.id; const active = step === s.id;
            return (
              <div key={s.id} className="flex flex-1 items-center">
                <div className="flex flex-col items-center gap-1">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all ${
                    done ? "border-violet-600 bg-violet-600" :
                    active ? "border-blue-600 bg-white" : "border-slate-300 bg-white"
                  }`}>
                    {done ? <CheckCircle2 className="h-4 w-4 text-white" /> :
                      <Icon className={`h-3.5 w-3.5 ${active ? "text-blue-600" : "text-slate-400"}`} />}
                  </div>
                  <span className={`hidden text-[9px] font-semibold sm:block ${
                    active ? "text-blue-700" : done ? "text-violet-600" : "text-slate-400"
                  }`}>{s.label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`mx-0.5 h-0.5 flex-1 transition-colors ${step > s.id ? "bg-violet-400" : "bg-slate-200"}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Form card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="mb-6 text-base font-bold text-slate-900">{STEPS[step - 1].label}</h2>

          {step === 1 && <Step1 form={form} errors={errors} onChange={updateField} onPhotoChange={handlePhotoChange} />}
          {step === 2 && <Step2 form={form} errors={errors} onChange={updateField} />}
          {step === 3 && <Step3 form={form} errors={errors} onChange={updateField} />}
          {step === 4 && <Step4 form={form} errors={errors} onChange={updateField} />}
          {step === 5 && <Step5 form={form} errors={errors} onChange={updateField} />}
          {step === 6 && <Step6Review form={form} invalidSteps={invalidSteps} onGoToStep={goToStep} />}

          {submitError && (
            <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
              <p className="text-sm text-red-700">{submitError}</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="mt-5 flex items-center justify-between">
          {step > 1 ? (
            <button onClick={handleBack} disabled={isLoading}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-60 transition-all">
              <ChevronLeft className="h-4 w-4" />Kembali
            </button>
          ) : <div />}

          {step < STEPS.length ? (
            <button onClick={handleNext}
              className="flex items-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-violet-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:opacity-90 active:scale-95 transition-all">
              Lanjutkan <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={isLoading}
              className="flex items-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-violet-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:opacity-90 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed transition-all">
              {isLoading
                ? <><Loader2 className="h-4 w-4 animate-spin" />Menyimpan...</>
                : <><CheckCircle2 className="h-4 w-4" />Kirim & Lanjut ke WhatsApp</>
              }
            </button>
          )}
        </div>
        <p className="mt-4 text-center text-xs text-slate-400">
          🔒 Data Anda dienkripsi dan hanya digunakan untuk keperluan pembuatan dokumen.
        </p>
      </div>
    </div>
  );
}
