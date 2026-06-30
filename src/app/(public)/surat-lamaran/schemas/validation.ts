import type { LamaranFormData } from "@/types/lamaran";

/**
 * Validasi client-side per step untuk form Surat Lamaran.
 */
export function validateStep(step: number, form: LamaranFormData): Record<string, string> {
  const e: Record<string, string> = {};

  if (step === 1) {
    if (!form.step1.full_name.trim()) e.full_name = "Nama lengkap wajib diisi";
    else if (form.step1.full_name.trim().length < 3) e.full_name = "Nama minimal 3 karakter";
    if (!form.step1.domicile.trim()) e.domicile = "Domisili wajib diisi";
    if (!form.step1.email.trim()) e.email = "Email wajib diisi";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.step1.email)) e.email = "Format email tidak valid";
    if (!form.step1.phone_number.trim()) e.phone_number = "Nomor WA wajib diisi";
    else if (!/^(\+62|62|0)8[1-9][0-9]{7,11}$/.test(form.step1.phone_number))
      e.phone_number = "Format nomor WA tidak valid";
    if (!form.step1.career_status) e.career_status = "Pilih status karir Anda";
  }

  if (step === 2) {
    if (!form.step2.company_name.trim()) e.company_name = "Nama perusahaan wajib diisi";
    if (!form.step2.position_target.trim()) e.position_target = "Posisi wajib diisi";
    if (!form.step2.motivation.trim()) e.motivation = "Motivasi wajib diisi";
    else if (form.step2.motivation.trim().length < 20) e.motivation = "Motivasi minimal 20 karakter";
  }

  if (step === 3 && form.step1.career_status === "profesional") {
    if (!form.step3.work_experience.trim()) e.work_experience = "Pengalaman kerja wajib diisi";
  }

  return e;
}

/**
 * Validasi semua step sekaligus. Mengembalikan { errors, invalidSteps }.
 */
export function validateAllSteps(form: LamaranFormData): {
  errors: Record<string, string>;
  invalidSteps: number[];
} {
  const allErrors: Record<string, string> = {};
  const badSteps: number[] = [];

  [1, 2, 3].forEach((n) => {
    const e = validateStep(n, form);
    if (Object.keys(e).length > 0) {
      badSteps.push(n);
      Object.assign(allErrors, e);
    }
  });

  return { errors: allErrors, invalidSteps: badSteps };
}
