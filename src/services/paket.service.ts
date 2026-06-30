import { PaketHematSchema, type PaketHematInput } from "@/lib/validation/paket";
import { sanitizeText, formDataToObject } from "@/lib/validation/common";
import { generateOrderCode } from "@/lib/order-utils";
import { logger } from "@/lib/logger";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { isRecentDuplicateSubmission, RATE_LIMIT_MESSAGE } from "@/lib/rate-limit";
import { PaketRepository } from "@/repositories/paket.repository";
import type { EducationHistoryItem } from "@/repositories/cv.repository";
import type { ActionResult } from "@/types/common";

const PAKET_FIELDS = [
  "full_name", "email", "phone_number", "domicile", "gender",
  "birth_place", "birth_date", "target_position", "company_name",
  "target_industry", "ats_keywords", "add_qna_hrd", "job_source",
  "institution", "major", "year_start", "year_end", "gpa",
  "career_status", "org_experience", "internship", "campus_project",
  "certificates", "work_experience", "achievement", "kpi", "work_tools",
  "career_switch_reason", "transferable_skills", "timezone",
  "remote_tools", "remote_experience", "hr_name", "motivation",
  "tone_surat", "job_keywords", "catatan", "photo_url",
];

function buildExperienceDetail(data: PaketHematInput) {
  return {
    career_status: data.career_status,
    gender:        data.gender || null,
    birth_place:   sanitizeText(data.birth_place) || null,
    birth_date:    data.birth_date || null,
    ...(data.career_status === "fresh_graduate" && {
      org_experience: sanitizeText(data.org_experience),
      internship:     sanitizeText(data.internship),
      campus_project: sanitizeText(data.campus_project),
      certificates:   sanitizeText(data.certificates),
    }),
    ...(data.career_status === "profesional" && {
      work_experience: sanitizeText(data.work_experience),
      achievement:     sanitizeText(data.achievement),
      kpi:             sanitizeText(data.kpi),
      work_tools:      sanitizeText(data.work_tools),
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
 * PaketHematService — orkestrasi: parsing, validasi, sanitasi, lalu panggil repository.
 */
export const PaketHematService = {
  async submit(formData: FormData): Promise<ActionResult> {
    const rawData = formDataToObject(formData, PAKET_FIELDS);

    const parsed = PaketHematSchema.safeParse(rawData);
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

    // Validasi tahun (cross-field, sama seperti versi lama)
    if (parseInt(data.year_end) < parseInt(data.year_start)) {
      return {
        success: false,
        error: "Tahun lulus tidak boleh lebih kecil dari tahun masuk.",
        fieldErrors: { year_end: "Tahun lulus tidak valid" },
      };
    }

    const orderCode = generateOrderCode();
    const addQna = data.add_qna_hrd === "true";

    // ── Throttling: tolak jika email yang sama baru submit (lihat audit HIGH-4) ──
    const supabase = await createServerSupabaseClient();
    if (await isRecentDuplicateSubmission(supabase, data.email)) {
      return { success: false, error: RATE_LIMIT_MESSAGE };
    }

    const clientResult = await PaketRepository.insertClient({
      full_name:    sanitizeText(data.full_name),
      email:        data.email.toLowerCase().trim(),
      phone_number: data.phone_number.trim(),
      order_code:   orderCode,
    });

    if (!clientResult.ok) {
      logger.error("PaketHemat: gagal insert clients", clientResult.error);
      return { success: false, error: "Gagal menyimpan data. Silakan coba lagi." };
    }

    const educationHistory: EducationHistoryItem[] = [
      {
        institution: sanitizeText(data.institution),
        major:       sanitizeText(data.major),
        year_start:  data.year_start,
        year_end:    data.year_end,
        gpa:         data.gpa || null,
      },
    ];

    const submissionResult = await PaketRepository.insertSubmission({
      client_id:         clientResult.data.id,
      target_position:   sanitizeText(data.target_position),
      company_name:      sanitizeText(data.company_name),
      target_industry:   data.target_industry || null,
      ats_keywords:      sanitizeText(data.ats_keywords) || null,
      add_qna_hrd:       addQna,
      domicile:          sanitizeText(data.domicile),
      education_history: educationHistory,
      experience_detail: buildExperienceDetail(data),
      job_source:        data.job_source || null,
      hr_name:           sanitizeText(data.hr_name) || null,
      motivation:        sanitizeText(data.motivation),
      tone_surat:        data.tone_surat || null,
      job_keywords:      sanitizeText(data.job_keywords) || null,
      catatan:           sanitizeText(data.catatan) || null,
      file_url:          data.photo_url || null,
    });

    if (!submissionResult.ok) {
      logger.error("PaketHemat: gagal insert paket_hemat_submissions", submissionResult.error);
      return { success: false, error: "Gagal menyimpan detail. Coba lagi." };
    }

    logger.info("PaketHemat: order baru berhasil dibuat", { orderCode, addQna });
    return { success: true, orderCode };
  },
};
