import { z } from "zod";
import {
  NameSchema, EmailSchema, PhoneSchema, DomisiliSchema,
  CareerStatusExtendedSchema,
} from "./common";

/**
 * Skema validasi server-side untuk form Surat Lamaran Profesional.
 */
export const LamaranSchema = z.object({
  // ── Step 1 ──
  full_name:     NameSchema,
  domicile:      DomisiliSchema,
  email:         EmailSchema,
  phone_number:  PhoneSchema,
  career_status: CareerStatusExtendedSchema,

  // ── Step 2 ──
  company_name:    z.string().min(2, "Nama perusahaan wajib diisi").max(150),
  position_target: z.string().min(2, "Posisi yang dilamar wajib diisi").max(100),
  job_source:      z.string().optional(),
  hr_name:         z.string().max(100).optional(),
  motivation: z
    .string()
    .min(20, "Motivasi minimal 20 karakter — ceritakan lebih detail")
    .max(2000),
  job_keywords: z.string().max(500).optional(),
  tone_surat:   z.string().optional(),

  // ── Step 3 — Conditional (semua opsional, validasi wajib di client) ──
  org_experience:       z.string().max(1000).optional(),
  internship:           z.string().max(1000).optional(),
  campus_project:       z.string().max(1000).optional(),
  work_experience:      z.string().max(2000).optional(),
  achievement:          z.string().max(1000).optional(),
  kpi:                  z.string().max(500).optional(),
  career_switch_reason: z.string().max(1000).optional(),
  transferable_skills:  z.string().max(1000).optional(),
  timezone:             z.string().max(100).optional(),
  remote_tools:         z.string().max(500).optional(),
  remote_experience:    z.string().max(1000).optional(),
});

export type LamaranInput = z.infer<typeof LamaranSchema>;
