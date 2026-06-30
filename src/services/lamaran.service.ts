import { LamaranSchema, type LamaranInput } from "@/lib/validation/lamaran";
import { sanitizeText, formDataToObject } from "@/lib/validation/common";
import { generateOrderCode } from "@/lib/order-utils";
import { logger } from "@/lib/logger";
import { LamaranRepository } from "@/repositories/lamaran.repository";
import type { ActionResult } from "@/types/common";

const LAMARAN_FIELDS = [
  "full_name", "domicile", "email", "phone_number", "career_status",
  "company_name", "position_target", "job_source", "hr_name", "motivation",
  "job_keywords", "tone_surat", "org_experience", "internship",
  "campus_project", "work_experience", "achievement", "kpi",
  "career_switch_reason", "transferable_skills", "timezone",
  "remote_tools", "remote_experience",
];

/**
 * Bangun object `experience_detail` (JSON kolom) berdasarkan career_status.
 */
function buildExperienceDetail(data: LamaranInput) {
  return {
    career_status: data.career_status,
    ...(data.career_status === "fresh_graduate" && {
      org_experience: sanitizeText(data.org_experience),
      internship:     sanitizeText(data.internship),
      campus_project: sanitizeText(data.campus_project),
    }),
    ...(data.career_status === "profesional" && {
      work_experience: sanitizeText(data.work_experience),
      achievement:     sanitizeText(data.achievement),
      kpi:             sanitizeText(data.kpi),
    }),
    ...(data.career_status === "career_switcher" && {
      career_switch_reason: sanitizeText(data.career_switch_reason),
      transferable_skills:  sanitizeText(data.transferable_skills),
    }),
    ...(data.career_status === "remote_worker" && {
      timezone:          sanitizeText(data.timezone),
      remote_tools:      sanitizeText(data.remote_tools),
      remote_experience: sanitizeText(data.remote_experience),
    }),
  };
}

/**
 * LamaranService — orkestrasi: parsing, validasi, sanitasi, lalu panggil repository.
 */
export const LamaranService = {
  async submit(formData: FormData): Promise<ActionResult> {
    const rawData = formDataToObject(formData, LAMARAN_FIELDS);

    const parsed = LamaranSchema.safeParse(rawData);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (field !== undefined && typeof field !== "symbol") {
          fieldErrors[String(field)] = issue.message;
        }
      });
      return { success: false, error: "Validasi gagal. Periksa kembali data Anda.", fieldErrors };
    }

    const data = parsed.data;
    const orderCode = generateOrderCode();

    const clientResult = await LamaranRepository.insertClient({
      full_name:    sanitizeText(data.full_name),
      email:        data.email.trim().toLowerCase(),
      phone_number: data.phone_number.trim(),
      order_code:   orderCode,
    });

    if (!clientResult.ok) {
      logger.error("Lamaran: gagal insert clients", clientResult.error);
      return { success: false, error: "Gagal menyimpan data. Silakan coba lagi." };
    }

    const submissionResult = await LamaranRepository.insertSubmission({
      client_id:         clientResult.data.id,
      domicile:          sanitizeText(data.domicile),
      company_name:      sanitizeText(data.company_name),
      position_target:   sanitizeText(data.position_target),
      job_source:        data.job_source ?? null,
      hr_name:           sanitizeText(data.hr_name) || null,
      motivation:        sanitizeText(data.motivation),
      job_keywords:      sanitizeText(data.job_keywords) || null,
      tone_surat:        data.tone_surat ?? null,
      experience_detail: buildExperienceDetail(data),
    });

    if (!submissionResult.ok) {
      logger.error("Lamaran: gagal insert lamaran_submissions", submissionResult.error);
      return { success: false, error: "Gagal menyimpan detail lamaran. Silakan coba lagi." };
    }

    logger.info("Lamaran: order baru berhasil dibuat", { orderCode });
    return { success: true, orderCode };
  },
};
