import { CvSubmissionSchema, type CvSubmissionInput } from "@/lib/validation/cv";
import { sanitizeText, formDataToObject } from "@/lib/validation/common";
import { generateOrderCode } from "@/lib/order-utils";
import { logger } from "@/lib/logger";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { isRecentDuplicateSubmission, RATE_LIMIT_MESSAGE } from "@/lib/rate-limit";
import { CvRepository, type EducationHistoryItem } from "@/repositories/cv.repository";
import type { ActionResult } from "@/types/common";

const CV_FIELDS = [
  "full_name", "nickname", "birth_place", "birth_date", "gender", "domicile",
  "email", "phone_number", "linkedin", "portfolio", "github",
  "target_position", "target_industry", "ats_keywords",
  "institution", "major", "year_start", "year_end", "gpa",
  "career_status", "org_experience", "campus_project", "internship",
  "certificates", "volunteer", "work_experience", "achievement",
  "kpi", "leadership", "work_tools", "previous_experience",
  "new_career_target", "transferable_skills", "career_switch_reason",
  "photo_url",
];

/**
 * Bangun object `work_experience` (JSON kolom) berdasarkan career_status.
 * Hanya field yang relevan dengan status karir yang disertakan.
 */
function buildWorkExperience(data: CvSubmissionInput) {
  return {
    career_status: data.career_status,
    ...(data.career_status === "fresh_graduate" && {
      org_experience: sanitizeText(data.org_experience),
      campus_project: sanitizeText(data.campus_project),
      internship:     sanitizeText(data.internship),
      certificates:   sanitizeText(data.certificates),
      volunteer:      sanitizeText(data.volunteer),
    }),
    ...(data.career_status === "profesional" && {
      work_experience: sanitizeText(data.work_experience),
      achievement:     sanitizeText(data.achievement),
      kpi:             sanitizeText(data.kpi),
      leadership:      sanitizeText(data.leadership),
      work_tools:      sanitizeText(data.work_tools),
    }),
    ...(data.career_status === "career_switcher" && {
      previous_experience:  sanitizeText(data.previous_experience),
      new_career_target:    sanitizeText(data.new_career_target),
      transferable_skills:  sanitizeText(data.transferable_skills),
      career_switch_reason: sanitizeText(data.career_switch_reason),
    }),
    linkedin:        data.linkedin || null,
    portfolio:       data.portfolio || null,
    github:          data.github || null,
    target_industry: data.target_industry || null,
    ats_keywords:    sanitizeText(data.ats_keywords),
    birth_place:     sanitizeText(data.birth_place),
    birth_date:      data.birth_date || null,
    gender:          data.gender || null,
    nickname:        sanitizeText(data.nickname),
  };
}

/**
 * CvService — orkestrasi: parsing, validasi, sanitasi, lalu panggil repository.
 * Business logic (bukan UI, bukan query mentah) hidup di sini.
 */
export const CvService = {
  async submit(formData: FormData): Promise<ActionResult> {
    // ── 1. Parse FormData ──
    const rawData = formDataToObject(formData, CV_FIELDS);

    // ── 2. Validasi Zod ──
    const parsed = CvSubmissionSchema.safeParse(rawData);
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

    // ── 2b. Throttling: tolak jika email yang sama baru submit (lihat audit HIGH-4) ──
    const supabase = await createServerSupabaseClient();
    if (await isRecentDuplicateSubmission(supabase, data.email)) {
      return { success: false, error: RATE_LIMIT_MESSAGE };
    }

    // ── 3. Insert client ──
    const clientResult = await CvRepository.insertClient({
      full_name:    sanitizeText(data.full_name),
      email:        data.email.trim().toLowerCase(),
      phone_number: data.phone_number.trim(),
      order_code:   orderCode,
    });

    if (!clientResult.ok) {
      logger.error("CV: gagal insert clients", clientResult.error);
      return { success: false, error: "Gagal menyimpan data. Silakan coba lagi." };
    }

    // ── 4. Insert detail submission ──
    const educationHistory: EducationHistoryItem[] = [
      {
        institution: sanitizeText(data.institution),
        major:       sanitizeText(data.major),
        year_start:  data.year_start,
        year_end:    data.year_end,
        gpa:         data.gpa || null,
      },
    ];

    const submissionResult = await CvRepository.insertSubmission({
      client_id:         clientResult.data.id,
      target_position:   sanitizeText(data.target_position),
      domicile:           sanitizeText(data.domicile),
      education_history: educationHistory,
      work_experience:   buildWorkExperience(data),
      file_url:          data.photo_url || null,
    });

    if (!submissionResult.ok) {
      logger.error("CV: gagal insert cv_submissions", submissionResult.error);
      return { success: false, error: "Gagal menyimpan detail CV. Silakan coba lagi." };
    }

    logger.info("CV: order baru berhasil dibuat", { orderCode });
    return { success: true, orderCode };
  },
};
