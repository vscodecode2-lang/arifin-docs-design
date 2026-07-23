"use client";

import {
  ChevronRight, ChevronLeft, Loader2, CheckCircle2, AlertCircle,
} from "lucide-react";
import { useCvForm } from "./hooks/useCvForm";
import { STEPS } from "./constants";
import { Step1 } from "./components/Step1";
import { Step2 } from "./components/Step2";
import { Step3 } from "./components/Step3";
import { Step4 } from "./components/Step4";
import { Step5Review } from "./components/Step5Review";
import { SuccessScreen } from "./components/SuccessScreen";

interface CvFormVariant {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  privacyNote?: string;
}

// ─── Main Page Component ──────────────────────────────────────────────────────

export function CvAtsForm({ variant }: { variant?: CvFormVariant }) {
  const {
    currentStep, form, errors, isLoading, submitError, invalidSteps, orderCode, progress,
    updateStep1, updateStep2, updateStep3, updateStep4,
    handleNext, handleBack, goToStep, handleSubmit,
  } = useCvForm();

  // ── Success screen ──
  if (orderCode) {
    return <SuccessScreen orderCode={orderCode} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">

        {/* ── Header ── */}
        <div className="mb-8 text-center">
          <span className="mb-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-blue-700">
            {variant?.eyebrow ?? "Layanan CV ATS Friendly"}
          </span>
          <h1 className="text-2xl font-black text-slate-900">{variant?.title ?? "Formulir Pembuatan CV"}</h1>
          <p className="mt-1 text-sm text-slate-500">
            {variant?.subtitle ?? "Isi data dengan lengkap untuk hasil CV terbaik"}
          </p>
        </div>

        {/* ── Progress Bar ── */}
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
            <span>Langkah {currentStep} dari {STEPS.length}</span>
            <span className="font-semibold text-blue-700">{progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* ── Step Indicators ── */}
        <div className="mb-8 flex items-center justify-between">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            const isDone = currentStep > step.id;
            const isActive = currentStep === step.id;
            return (
              <div key={step.id} className="flex flex-1 items-center">
                <div className="flex flex-col items-center gap-1">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all ${
                    isDone ? "border-blue-600 bg-blue-600" :
                    isActive ? "border-blue-600 bg-white" : "border-slate-300 bg-white"
                  }`}>
                    {isDone
                      ? <CheckCircle2 className="h-4 w-4 text-white" />
                      : <Icon className={`h-4 w-4 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                    }
                  </div>
                  <span className={`hidden text-[10px] font-semibold sm:block ${
                    isActive ? "text-blue-700" : isDone ? "text-blue-500" : "text-slate-400"
                  }`}>
                    {step.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`mx-1 h-0.5 flex-1 transition-colors ${
                    currentStep > step.id ? "bg-blue-600" : "bg-slate-200"
                  }`} />
                )}
              </div>
            );
          })}
        </div>

        {/* ── Form Card ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="mb-6 text-base font-bold text-slate-900">
            {STEPS[currentStep - 1].label}
          </h2>

          {currentStep === 1 && <Step1 data={form.step1} onChange={updateStep1} errors={errors} />}
          {currentStep === 2 && <Step2 data={form.step2} onChange={updateStep2} errors={errors} />}
          {currentStep === 3 && <Step3 data={form.step3} onChange={updateStep3} errors={errors} />}
          {currentStep === 4 && <Step4 data={form.step4} onChange={updateStep4} errors={errors} />}
          {currentStep === 5 && (
            <Step5Review
              form={form}
              invalidSteps={invalidSteps}
              onGoToStep={goToStep}
            />
          )}

          {/* Submit error */}
          {submitError && (
            <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
              <p className="text-sm text-red-700">{submitError}</p>
            </div>
          )}
        </div>

        {/* ── Navigation ── */}
        <div className="mt-5 flex items-center justify-between">
          {currentStep > 1 ? (
            <button onClick={handleBack} disabled={isLoading}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 disabled:opacity-60">
              <ChevronLeft className="h-4 w-4" />
              Kembali
            </button>
          ) : <div />}

          {currentStep < STEPS.length ? (
            <button onClick={handleNext}
              className="flex items-center gap-2 rounded-xl bg-blue-700 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-blue-800 active:scale-95">
              Lanjutkan
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={isLoading}
              className="flex items-center gap-2 rounded-xl bg-blue-700 px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-blue-800 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60">
              {isLoading ? (
                <><Loader2 className="h-4 w-4 animate-spin" />Menyimpan...</>
              ) : (
                <><CheckCircle2 className="h-4 w-4" />Kirim & Lanjut ke WhatsApp</>
              )}
            </button>
          )}
        </div>

        {/* Privacy note */}
        <p className="mt-4 text-center text-xs text-slate-400">
          {variant?.privacyNote ?? "🔒 Data Anda disimpan dengan aman dan hanya digunakan untuk keperluan pembuatan CV."}
        </p>
      </div>
    </div>
  );
}
