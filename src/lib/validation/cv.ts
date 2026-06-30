import { z } from "zod";
import {
  NameSchema, EmailSchema, PhoneSchema, DomisiliSchema,
  UrlOptionalSchema, GpaSchema, CareerStatusBaseSchema,
} from "./common";

/**
 * Skema validasi server-side untuk form CV ATS Friendly.
 * Di-import oleh: submit-cv.ts dan cv.service.ts
 */
export const CvSubmissionSchema = z
  .object({
    // ── Step 1 ──
    full_name:   NameSchema,
    nickname:    z.string().max(50).optional(),
    birth_place: z.string().max(100).optional(),
    birth_date:  z.string().optional(),
    gender:      z.string().optional(),
    domicile:    DomisiliSchema,

    // ── Step 2 ──
    email:           EmailSchema,
    phone_number:    PhoneSchema,
    linkedin:        UrlOptionalSchema,
    portfolio:       UrlOptionalSchema,
    github:          UrlOptionalSchema,
    target_position: z.string().min(2, "Posisi yang dilamar wajib diisi").max(100),
    target_industry: z.string().optional(),
    ats_keywords:    z.string().max(500).optional(),

    // ── Step 3 ──
    institution: z.string().min(3, "Nama institusi wajib diisi").max(150),
    major:       z.string().min(2, "Jurusan wajib diisi").max(100),
    year_start: z
      .string()
      .regex(/^\d{4}$/, "Tahun tidak valid")
      .refine(
        (val) => { const y = parseInt(val); return y >= 1990 && y <= new Date().getFullYear(); },
        "Tahun masuk tidak valid"
      ),
    year_end: z
      .string()
      .regex(/^\d{4}$/, "Tahun tidak valid")
      .refine(
        (val) => { const y = parseInt(val); return y >= 1990 && y <= new Date().getFullYear() + 6; },
        "Tahun lulus tidak valid"
      ),
    gpa: GpaSchema,

    // ── Step 4 — Conditional ──
    career_status:        CareerStatusBaseSchema,
    org_experience:       z.string().max(1000).optional(),
    campus_project:       z.string().max(1000).optional(),
    internship:           z.string().max(1000).optional(),
    certificates:         z.string().max(1000).optional(),
    volunteer:            z.string().max(1000).optional(),
    work_experience:      z.string().max(2000).optional(),
    achievement:          z.string().max(1000).optional(),
    kpi:                  z.string().max(500).optional(),
    leadership:           z.string().max(500).optional(),
    work_tools:           z.string().max(500).optional(),
    previous_experience:  z.string().max(1000).optional(),
    new_career_target:    z.string().max(500).optional(),
    transferable_skills:  z.string().max(1000).optional(),
    career_switch_reason: z.string().max(1000).optional(),

    photo_url: z.string().optional(),
  })
  .refine(
    (d) => parseInt(d.year_end) >= parseInt(d.year_start),
    { message: "Tahun lulus tidak boleh lebih kecil dari tahun masuk", path: ["year_end"] }
  );

export type CvSubmissionInput = z.infer<typeof CvSubmissionSchema>;
