import { z } from "zod";
import {
  NameSchema, EmailSchema, PhoneSchema, DomisiliSchema,
  GpaSchema, CareerStatusExtendedSchema,
} from "./common";

/**
 * Skema validasi server-side untuk form Paket Hemat (CV + Lamaran).
 */
export const PaketHematSchema = z.object({
  // ── Step 1 — Data Pribadi ──
  full_name:   NameSchema,
  email:       EmailSchema,
  phone_number: PhoneSchema,
  domicile:    DomisiliSchema,
  gender:      z.string().optional(),
  birth_place: z.string().max(100).optional(),
  birth_date:  z.string().optional(),

  // ── Step 2 — Target Karir ──
  target_position: z.string().min(2, "Posisi yang dilamar wajib diisi").max(150),
  company_name:    z.string().min(2, "Nama perusahaan wajib diisi").max(150),
  target_industry: z.string().optional(),
  ats_keywords:    z.string().max(500).optional(),
  add_qna_hrd:     z.string().optional(), // "true" | "false"
  job_source:      z.string().optional(),

  // ── Step 3 — Pendidikan ──
  institution: z.string().min(3, "Nama institusi wajib diisi").max(150),
  major:       z.string().min(2, "Jurusan wajib diisi").max(100),
  year_start:  z.string().regex(/^\d{4}$/, "Tahun tidak valid"),
  year_end:    z.string().regex(/^\d{4}$/, "Tahun tidak valid"),
  gpa:         GpaSchema,

  // ── Step 4 — Pengalaman Conditional ──
  career_status:        CareerStatusExtendedSchema,
  org_experience:       z.string().max(1000).optional(),
  internship:           z.string().max(1000).optional(),
  campus_project:       z.string().max(1000).optional(),
  certificates:         z.string().max(500).optional(),
  work_experience:      z.string().max(2000).optional(),
  achievement:          z.string().max(1000).optional(),
  kpi:                  z.string().max(500).optional(),
  work_tools:           z.string().max(500).optional(),
  career_switch_reason: z.string().max(1000).optional(),
  transferable_skills:  z.string().max(1000).optional(),
  timezone:             z.string().max(100).optional(),
  remote_tools:         z.string().max(500).optional(),
  remote_experience:    z.string().max(1000).optional(),

  // ── Step 5 — Detail Lamaran ──
  hr_name:      z.string().max(100).optional(),
  motivation:   z.string().min(20, "Motivasi minimal 20 karakter").max(2000),
  tone_surat:   z.string().optional(),
  job_keywords: z.string().max(500).optional(),
  catatan:      z.string().max(500).optional(),
  photo_url:    z.string().optional(),
});

export type PaketHematInput = z.infer<typeof PaketHematSchema>;
