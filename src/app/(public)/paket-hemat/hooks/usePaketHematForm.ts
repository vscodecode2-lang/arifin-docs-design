import { useState } from "react";
import { submitPaketHematAction } from "@/app/actions/submit-paket-hemat";
import { generateWhatsAppLink } from "@/lib/utils";
import type { FormState } from "../types";
import { INITIAL_FORM, STEPS, FIELD_TO_STEP, ADMIN_WA } from "../constants";
import { validateStep, validateAllSteps } from "../schemas/validation";

/**
 * usePaketHematForm — mengelola state, navigasi step, validasi, dan
 * submission logic untuk form Paket Hemat (CV + Lamaran).
 */
export function usePaketHematForm() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [invalidSteps, setInvalidSteps] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const updateField = (f: keyof FormState, v: string | boolean | File | null) =>
    setForm((p) => ({ ...p, [f]: v }));

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file && file.size > 5 * 1024 * 1024) {
      alert("Ukuran foto maksimal 5MB");
      return;
    }
    updateField("photo_file", file);
  };

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

  const handleSubmit = async () => {
    const { errors: allErrors, invalidSteps: badSteps } = validateAllSteps(form);
    if (badSteps.length > 0) {
      setErrors(allErrors);
      setInvalidSteps(badSteps);
      setStep(badSteps[0]);
      return;
    }

    setIsLoading(true);
    setSubmitError(null);

    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (v !== null && !(v instanceof File)) fd.append(k, String(v));
      });

      const result = await submitPaketHematAction(fd);

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

      setInvalidSteps([]);
      const serviceName = form.add_qna_hrd
        ? "Paket Siap Kerja + QnA HRD"
        : "Paket Siap Kerja";
      window.location.href = generateWhatsAppLink(serviceName, ADMIN_WA, result.orderCode);

    } catch {
      setSubmitError("Gagal menghubungi server.");
    } finally {
      setIsLoading(false);
    }
  };

  const progress = Math.round(((step - 1) / (STEPS.length - 1)) * 100);

  return {
    step, form, errors, invalidSteps, isLoading, submitError, progress,
    updateField, handlePhotoChange,
    handleNext, handleBack, goToStep, handleSubmit,
  };
}
