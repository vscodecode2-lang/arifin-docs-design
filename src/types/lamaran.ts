// ─── Enums ────────────────────────────────────────────────────────────────────

export type LamaranCareerStatus =
  | "fresh_graduate"
  | "profesional"
  | "career_switcher"
  | "remote_worker"
  | "";

export type JobSource =
  | "LinkedIn"
  | "Jobstreet"
  | "Glints"
  | "Koran / Majalah"
  | "Referral / Kenalan"
  | "Website Perusahaan"
  | "Lainnya"
  | "";

export type ToneSurat = "formal" | "semi_formal" | "modern" | "";

// ─── Step Interfaces ──────────────────────────────────────────────────────────

export interface LamaranStep1 {
  full_name: string;
  domicile: string;
  email: string;
  phone_number: string;
  career_status: LamaranCareerStatus;
}

export interface LamaranStep2 {
  company_name: string;
  position_target: string;
  job_source: JobSource;
  hr_name: string;
  motivation: string;
  job_keywords: string;
  tone_surat: ToneSurat;
}

export interface LamaranStep3 {
  // Fresh Graduate
  org_experience: string;
  internship: string;
  campus_project: string;
  // Profesional
  work_experience: string;
  achievement: string;
  kpi: string;
  // Career Switcher
  career_switch_reason: string;
  transferable_skills: string;
  // Remote Worker
  timezone: string;
  remote_tools: string;
  remote_experience: string;
}

// ─── Full Form State ──────────────────────────────────────────────────────────

export interface LamaranFormData {
  step1: LamaranStep1;
  step2: LamaranStep2;
  step3: LamaranStep3;
}

// ─── Server Action Response ───────────────────────────────────────────────────

export interface LamaranActionResult {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
  orderCode?: string;
}