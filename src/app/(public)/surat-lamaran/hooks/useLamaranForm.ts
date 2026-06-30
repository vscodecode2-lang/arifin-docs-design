import { useState } from "react";
import { submitLamaranAction } from "@/app/actions/submit-lamaran";
import { generateWhatsAppLink } from "@/lib/utils";
import type { LamaranFormData } from "@/types/lamaran";
import { INITIAL_FORM, STEPS, FIELD_TO_STEP, ADMIN_WA } from "../constants";
import { validateStep, validateAllSteps } from "../schemas/validation";

/**
 * useLamaranForm — mengelola state, navigasi step, validasi, dan
 * submission logic untuk form Surat Lamaran Profesional.
 */
export function useLamaranForm() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<LamaranFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [invalidSteps, setInvalidSteps] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // ── Field updaters ──
  const updateStep1 = (f: keyof LamaranFormData["step1"], v: string) =>
    setForm((p) => ({ ...p, step1: { ...p.step1, [f]: v } }));
  const updateStep2 = (f: keyof LamaranFormData["step2"], v: string) =>
    setForm((p) => ({ ...p, step2: { ...p.step2, [f]: v } }));
  const updateStep3 = (f: keyof LamaranFormData["step3"], v: string) =>
    setForm((p) => ({ ...p, step3: { ...p.step3, [f]: v } }));

  // ── Navigation ──
  const handleNext = () => {
    const e = validateStep(step, form);
    if (Object.keys(e).length === 0) {
      setErrors({});
      setStep((s) => s + 1);
    } else {
      setErrors(e);
    }
  };

  const handleBack = () => {
    setErrors({});
    setStep((s) => s - 1);
  };

  const goToStep = (s: number) => setStep(s);

  // ── Submission ──
  const handleSubmit = async () => {
    const { errors: allErrors, invalidSteps: badSteps } = validateAllSteps(form);
    if (badSteps.length > 0) {
      setErrors(allErrors);
      setInvalidSteps(badSteps);
      return;
    }

    setIsLoading(true);
    setSubmitError(null);

    try {
      const fd = new FormData();
      Object.entries({ ...form.step1, ...form.step2, ...form.step3 }).forEach(
        ([k, v]) => { if (v !== null && v !== undefined) fd.append(k, String(v)); }
      );

      const result = await submitLamaranAction(fd);

      if (!result.success) {
        if (result.fieldErrors) {
          setErrors(result.fieldErrors);
          const badStepsFromServer = Array.from(
            new Set(Object.keys(result.fieldErrors).map((f) => FIELD_TO_STEP[f]).filter(Boolean))
          ).sort() as number[];
          setInvalidSteps(badStepsFromServer);
          if (badStepsFromServer.length > 0) setStep(badStepsFromServer[0]);
        }
        setSubmitError(result.error ?? "Terjadi kesalahan.");
        return;
      }

      // ── SUCCESS: redirect WhatsApp ──
      setInvalidSteps([]);
      window.location.href = generateWhatsAppLink(
        "Surat Lamaran Profesional",
        ADMIN_WA,
        result.orderCode
      );

    } catch {
      setSubmitError("Gagal menghubungi server. Periksa koneksi Anda.");
    } finally {
      setIsLoading(false);
    }
  };

  const progress = Math.round(((step - 1) / (STEPS.length - 1)) * 100);

  return {
    step, form, errors, invalidSteps, isLoading, submitError, progress,
    updateStep1, updateStep2, updateStep3,
    handleNext, handleBack, goToStep, handleSubmit,
  };
}
