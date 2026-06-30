// ─── Enums ────────────────────────────────────────────────────────────────────

export type PaketCareerStatus =
  | "fresh_graduate"
  | "profesional"
  | "career_switcher"
  | "remote_worker"
  | "";

export type PaketToneSurat = "formal" | "semi_formal" | "modern" | "";
export type PaketIndustry  = "Teknologi" | "Finance" | "Startup" | "Pendidikan" |
                              "Kesehatan" | "Retail"  | "Manufaktur" | "Lainnya" | "";
export type PaketJobSource = "LinkedIn" | "Jobstreet" | "Glints" | "Koran / Majalah" |
                              "Referral" | "Website Perusahaan" | "Lainnya" | "";

// ─── Form State ───────────────────────────────────────────────────────────────

export interface PaketHematFormState {
  // Step 1 — Data Pribadi
  full_name:    string;
  email:        string;
  phone_number: string;
  domicile:     string;
  gender:       string;
  birth_place:  string;
  birth_date:   string;
  photo_file:   File | null;

  // Step 2 — Target Karir
  target_position: string;
  company_name:    string;
  target_industry: PaketIndustry;
  ats_keywords:    string;
  add_qna_hrd:     boolean;
  job_source:      PaketJobSource;

  // Step 3 — Pendidikan
  institution: string;
  major:       string;
  year_start:  string;
  year_end:    string;
  gpa:         string;

  // Step 4 — Pengalaman (conditional)
  career_status: PaketCareerStatus;
  // Fresh Graduate
  org_experience: string;
  internship:     string;
  campus_project: string;
  certificates:   string;
  // Profesional
  work_experience: string;
  achievement:     string;
  kpi:             string;
  work_tools:      string;
  // Career Switcher
  career_switch_reason: string;
  transferable_skills:  string;
  // Remote Worker
  timezone:          string;
  remote_tools:      string;
  remote_experience: string;

  // Step 5 — Detail Lamaran
  hr_name:     string;
  motivation:  string;
  tone_surat:  PaketToneSurat;
  job_keywords:string;
  catatan:     string;
}

// ─── Server Action Response ───────────────────────────────────────────────────

export interface PaketHematActionResult {
  success:     boolean;
  error?:      string;
  fieldErrors?: Record<string, string>;
  orderCode?:  string;
}