import { useState } from "react";
import { submitCvAction } from "@/app/actions/submit-cv";
import type { CvFormData } from "@/types/cv";
import { INITIAL_FORM, STEPS, FIELD_TO_STEP } from "../constants";
import { validateStep, validateAllSteps } from "../schemas/validation";

/**
 * useCvForm — mengelola seluruh state, navigasi step, validasi, dan
 * submission logic untuk form CV ATS Friendly.
 *
 * Dipisahkan dari UI agar komponen tetap kecil dan logic mudah ditest.
 */
export function useCvForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState<CvFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  // Menyimpan step mana saja yang punya error untuk ditampilkan di Step 5
  const [invalidSteps, setInvalidSteps] = useState<number[]>([]);
  const [orderCode, setOrderCode] = useState<string | null>(null);

  // ── Field updaters ──
  const updateStep1 = (field: keyof CvFormData["step1"], value: string | File | null) =>
    setForm((p) => ({ ...p, step1: { ...p.step1, [field]: value } }));
  const updateStep2 = (field: keyof CvFormData["step2"], value: string) =>
    setForm((p) => ({ ...p, step2: { ...p.step2, [field]: value } }));
  const updateStep3 = (field: keyof CvFormData["step3"], value: string) =>
    setForm((p) => ({ ...p, step3: { ...p.step3, [field]: value } }));
  const updateStep4 = (field: keyof CvFormData["step4"], value: string) =>
    setForm((p) => ({ ...p, step4: { ...p.step4, [field]: value } }));

  // ── Navigation ──
  const handleNext = () => {
    const stepErrors = validateStep(currentStep, form);
    if (Object.keys(stepErrors).length === 0) {
      setErrors({});
      setCurrentStep((s) => s + 1);
    } else {
      setErrors(stepErrors);
    }
  };

  const handleBack = () => {
    setErrors({});
    setCurrentStep((s) => s - 1);
  };

  const goToStep = (step: number) => setCurrentStep(step);

  // ── Submission ──
  const handleSubmit = async () => {
    // Validasi semua step sebelum kirim
    const { errors: allErrors, invalidSteps: stepsWithErrors } = validateAllSteps(form);
    if (stepsWithErrors.length > 0) {
      setErrors(allErrors);
      setInvalidSteps(stepsWithErrors);
      setCurrentStep(stepsWithErrors[0]);
      return; // banner error sudah muncul di Step 5 ketika user kembali ke step yang invalid
    }

    setIsLoading(true);
    setSubmitError(null);

    try {
      const fd = new FormData();
      Object.entries({
        ...form.step1, ...form.step2, ...form.step3, ...form.step4,
      }).forEach(([key, val]) => {
        if (val !== null && val !== undefined && !(val instanceof File)) {
          fd.append(key, String(val));
        }
      });

      const result = await submitCvAction(fd);

      if (!result.success) {
        if (result.fieldErrors) {
          // Map fieldErrors dari server ke step yang benar
          const serverErrors = result.fieldErrors as Record<string, string>;
          setErrors(serverErrors);

          // Cari step pertama yang punya error dari server
          const stepsWithServerErrors = new Set<number>();
          Object.keys(serverErrors).forEach((field) => {
            const step = FIELD_TO_STEP[field];
            if (step) stepsWithServerErrors.add(step);
          });

          const errorStepList = Array.from(stepsWithServerErrors).sort();
          setInvalidSteps(errorStepList);

          // Navigasi otomatis ke step pertama yang bermasalah
          if (errorStepList.length > 0) {
            setCurrentStep(errorStepList[0]);
          }
        }
        setSubmitError(result.error ?? "Terjadi kesalahan.");
        return;
      }

      // Sukses — simpan orderCode, tampilkan success screen
      setInvalidSteps([]);
      setOrderCode(result.orderCode ?? null);

    } catch {
      setSubmitError("Gagal menghubungi server. Periksa koneksi internet Anda.");
    } finally {
      setIsLoading(false);
    }
  };

  const progress = Math.round(((currentStep - 1) / (STEPS.length - 1)) * 100);

  return {
    // state
    currentStep, form, errors, isLoading, submitError, invalidSteps, orderCode, progress,
    // updaters
    updateStep1, updateStep2, updateStep3, updateStep4,
    // navigation
    handleNext, handleBack, goToStep,
    // submission
    handleSubmit,
  };
}
