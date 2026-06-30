import type { FormState } from "../types";

/**
 * Validasi client-side per step untuk form Paket Hemat.
 */
export function validateStep(step: number, form: FormState): Record<string, string> {
  const e: Record<string, string> = {};

  if (step === 1) {
    if (!form.full_name.trim() || form.full_name.trim().length < 3) e.full_name = "Nama minimal 3 karakter";
    if (!form.email.trim()) e.email = "Email wajib diisi";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Format email tidak valid";
    if (!form.phone_number.trim()) e.phone_number = "Nomor WA wajib diisi";
    else if (!/^(\+62|62|0)8[1-9][0-9]{7,11}$/.test(form.phone_number)) e.phone_number = "Format nomor WA tidak valid";
    if (!form.domicile.trim()) e.domicile = "Domisili wajib diisi";
  }

  if (step === 2) {
    if (!form.target_position.trim()) e.target_position = "Posisi yang dilamar wajib diisi";
    if (!form.company_name.trim()) e.company_name = "Nama perusahaan wajib diisi";
  }

  if (step === 3) {
    if (!form.institution.trim()) e.institution = "Nama institusi wajib diisi";
    if (!form.major.trim()) e.major = "Jurusan wajib diisi";
    if (!form.year_start) e.year_start = "Tahun masuk wajib diisi";
    if (!form.year_end) e.year_end = "Tahun lulus wajib diisi";
    if (form.year_start && form.year_end && parseInt(form.year_end) < parseInt(form.year_start))
      e.year_end = "Tahun lulus tidak boleh lebih kecil dari tahun masuk";
  }

  if (step === 4) {
    if (!form.career_status) e.career_status = "Pilih status karir Anda";
    if (form.career_status === "profesional" && !form.work_experience.trim())
      e.work_experience = "Pengalaman kerja wajib diisi untuk Profesional";
  }

  if (step === 5) {
    if (!form.motivation.trim()) e.motivation = "Motivasi melamar wajib diisi";
    else if (form.motivation.trim().length < 20) e.motivation = "Motivasi minimal 20 karakter";
  }

  return e;
}

/**
 * Validasi semua step sekaligus. Mengembalikan { errors, invalidSteps }.
 */
export function validateAllSteps(form: FormState): {
  errors: Record<string, string>;
  invalidSteps: number[];
} {
  const allErrors: Record<string, string> = {};
  const badSteps: number[] = [];

  [1, 2, 3, 4, 5].forEach((n) => {
    const e = validateStep(n, form);
    if (Object.keys(e).length > 0) {
      badSteps.push(n);
      Object.assign(allErrors, e);
    }
  });

  return { errors: allErrors, invalidSteps: badSteps };
}
