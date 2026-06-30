// ─── Enums ────────────────────────────────────────────────────────────────────

export type CareerStatus = "fresh_graduate" | "profesional" | "career_switcher";
export type GenderType = "Laki-laki" | "Perempuan" | "";
export type IndustryType =
  | "Teknologi"
  | "Finance"
  | "Startup"
  | "Pendidikan"
  | "Kesehatan"
  | "Retail"
  | "Manufaktur"
  | "Lainnya"
  | "";

// ─── Step Interfaces ──────────────────────────────────────────────────────────

export interface Step1Data {
  full_name: string;
  nickname: string;
  birth_place: string;
  birth_date: string;
  gender: GenderType;
  domicile: string;
  photo_file: File | null;
}

export interface Step2Data {
  email: string;
  phone_number: string;
  linkedin: string;
  portfolio: string;
  github: string;
  target_position: string;
  target_industry: IndustryType;
  ats_keywords: string;
}

export interface Step3Data {
  institution: string;
  major: string;
  year_start: string;
  year_end: string;
  gpa: string;
}

export interface Step4Data {
  career_status: CareerStatus | "";
  // Fresh Graduate
  org_experience: string;
  campus_project: string;
  internship: string;
  certificates: string;
  volunteer: string;
  // Profesional
  work_experience: string;
  achievement: string;
  kpi: string;
  leadership: string;
  work_tools: string;
  // Career Switcher
  previous_experience: string;
  new_career_target: string;
  transferable_skills: string;
  career_switch_reason: string;
}

// ─── Full Form State ──────────────────────────────────────────────────────────

export interface CvFormData {
  step1: Step1Data;
  step2: Step2Data;
  step3: Step3Data;
  step4: Step4Data;
}

// ─── Server Action Response ───────────────────────────────────────────────────

export interface ActionResult {
  success: boolean;
  error?: string;
  fieldErrors?: Partial<Record<string, string>>;
  orderCode?: string; // kode tracking order (ADC-XXXXXX), ada saat success: true
}
