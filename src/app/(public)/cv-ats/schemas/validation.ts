import type { CvFormData } from "@/types/cv";

/**
 * Validasi client-side per step. Mengembalikan object errors (bukan void)
 * supaya bisa langsung dipakai untuk set state errors di komponen/hook.
 */
export function validateStep(step: number, form: CvFormData): Record<string, string> {
  const newErrors: Record<string, string> = {};

  if (step === 1) {
    if (!form.step1.full_name.trim())
      newErrors.full_name = "Nama lengkap wajib diisi";
    else if (form.step1.full_name.trim().length < 3)
      newErrors.full_name = "Nama minimal 3 karakter";
    if (!form.step1.domicile.trim())
      newErrors.domicile = "Domisili wajib diisi";
  }

  if (step === 2) {
    if (!form.step2.email.trim())
      newErrors.email = "Email wajib diisi";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.step2.email))
      newErrors.email = "Format email tidak valid";

    if (!form.step2.phone_number.trim())
      newErrors.phone_number = "Nomor WA wajib diisi";
    else if (!/^(\+62|62|0)8[1-9][0-9]{7,11}$/.test(form.step2.phone_number))
      newErrors.phone_number = "Format nomor WA tidak valid (contoh: 08123456789)";

    if (!form.step2.target_position.trim())
      newErrors.target_position = "Posisi yang dilamar wajib diisi";

    if (form.step2.linkedin && !/^https?:\/\/.+/.test(form.step2.linkedin))
      newErrors.linkedin = "Format URL LinkedIn tidak valid";
    if (form.step2.portfolio && !/^https?:\/\/.+/.test(form.step2.portfolio))
      newErrors.portfolio = "Format URL Portfolio tidak valid";
    if (form.step2.github && !/^https?:\/\/.+/.test(form.step2.github))
      newErrors.github = "Format URL GitHub tidak valid";
  }

  if (step === 3) {
    if (!form.step3.institution.trim())
      newErrors.institution = "Nama institusi wajib diisi";
    if (!form.step3.major.trim())
      newErrors.major = "Jurusan wajib diisi";
    if (!form.step3.year_start)
      newErrors.year_start = "Tahun masuk wajib diisi";
    else if (!/^\d{4}$/.test(form.step3.year_start))
      newErrors.year_start = "Tahun tidak valid";
    if (!form.step3.year_end)
      newErrors.year_end = "Tahun lulus wajib diisi";
    else if (!/^\d{4}$/.test(form.step3.year_end))
      newErrors.year_end = "Tahun tidak valid";
    if (
      form.step3.year_start && form.step3.year_end &&
      parseInt(form.step3.year_end) < parseInt(form.step3.year_start)
    )
      newErrors.year_end = "Tahun lulus tidak boleh lebih kecil dari tahun masuk";
    if (form.step3.gpa) {
      const gpaNum = parseFloat(form.step3.gpa);
      if (isNaN(gpaNum) || gpaNum < 0 || gpaNum > 4.0)
        newErrors.gpa = "IPK harus antara 0.00 - 4.00";
    }
  }

  if (step === 4) {
    if (!form.step4.career_status)
      newErrors.career_status = "Pilih status karir Anda";
    if (
      form.step4.career_status === "profesional" &&
      !form.step4.work_experience.trim()
    )
      newErrors.work_experience = "Pengalaman kerja wajib diisi untuk Profesional";
  }

  return newErrors;
}

/**
 * Validasi semua step sekaligus — dipakai saat submit di Step 5.
 * Mengembalikan { errors, invalidSteps }.
 */
export function validateAllSteps(form: CvFormData): {
  errors: Record<string, string>;
  invalidSteps: number[];
} {
  const allErrors: Record<string, string> = {};
  const stepsWithErrors: number[] = [];

  [1, 2, 3, 4].forEach((step) => {
    const stepErrs = validateStep(step, form);
    if (Object.keys(stepErrs).length > 0) {
      stepsWithErrors.push(step);
      Object.assign(allErrors, stepErrs);
    }
  });

  return { errors: allErrors, invalidSteps: stepsWithErrors };
}
