/**
 * State lokal untuk form Paket Hemat (client-side).
 *
 * CATATAN MIGRASI: sebelumnya file form mengimpor `PaketHematFormState`
 * dari `@/types/paket-hemat` tapi TIDAK PERNAH memakainya (unused import) —
 * dan malah mendefinisikan ulang interface yang sama persis secara lokal.
 * Bug ini ditemukan saat audit dan diperbaiki dengan menjadikan interface
 * lokal ini sebagai satu-satunya sumber kebenaran untuk state form.
 */
export interface FormState {
  full_name: string; email: string; phone_number: string; domicile: string;
  gender: string; birth_place: string; birth_date: string; photo_file: File | null;
  target_position: string; company_name: string; target_industry: string;
  ats_keywords: string; add_qna_hrd: boolean;
  institution: string; major: string; year_start: string; year_end: string; gpa: string;
  career_status: string; org_experience: string; internship: string;
  campus_project: string; certificates: string; work_experience: string;
  achievement: string; kpi: string; work_tools: string; career_switch_reason: string;
  transferable_skills: string; timezone: string; remote_tools: string; remote_experience: string;
  job_source: string; hr_name: string; motivation: string;
  tone_surat: string; job_keywords: string; catatan: string;
}
