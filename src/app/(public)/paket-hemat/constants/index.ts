import {
  User, Target, GraduationCap, Briefcase, Mail, ClipboardList,
} from "lucide-react";
import type { FormState } from "../types";

export const ADMIN_WA = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP ?? "6285801193410";

export const STEPS = [
  { id: 1, label: "Data Pribadi",   icon: User },
  { id: 2, label: "Target Karir",   icon: Target },
  { id: 3, label: "Pendidikan",     icon: GraduationCap },
  { id: 4, label: "Pengalaman",     icon: Briefcase },
  { id: 5, label: "Detail Lamaran", icon: Mail },
  { id: 6, label: "Review",         icon: ClipboardList },
];

export const STEP_LABELS: Record<number, string> = {
  1: "Data Pribadi", 2: "Target Karir",
  3: "Pendidikan",   4: "Pengalaman",
  5: "Detail Lamaran",
};

export const FIELD_TO_STEP: Record<string, number> = {
  full_name: 1, email: 1, phone_number: 1, domicile: 1,
  target_position: 2, company_name: 2,
  institution: 3, major: 3, year_start: 3, year_end: 3,
  career_status: 4, work_experience: 4,
  motivation: 5,
};

export const INDUSTRIES = ["Teknologi", "Finance", "Startup", "Pendidikan", "Kesehatan", "Retail", "Manufaktur", "Lainnya"];
export const JOB_SOURCES = ["LinkedIn", "Jobstreet", "Glints", "Koran / Majalah", "Referral", "Website Perusahaan", "Lainnya"];

export const TONE_OPTIONS = [
  { value: "formal",      label: "Formal",      desc: "Konservatif & profesional" },
  { value: "semi_formal", label: "Semi-Formal",  desc: "Profesional tapi ramah" },
  { value: "modern",      label: "Modern",       desc: "Fresh & to-the-point" },
];

export const CAREER_OPTIONS = [
  { value: "fresh_graduate",  label: "Fresh Graduate",  emoji: "🎓", desc: "Baru lulus / belum punya pengalaman formal" },
  { value: "profesional",     label: "Profesional",     emoji: "💼", desc: "Sudah punya pengalaman kerja formal" },
  { value: "career_switcher", label: "Career Switcher", emoji: "🔄", desc: "Ingin pindah ke bidang berbeda" },
  { value: "remote_worker",   label: "Remote Worker",   emoji: "🌐", desc: "Melamar posisi remote / WFH" },
];

export const inputCls = "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20";
export const textareaCls = inputCls + " resize-none";

export const INITIAL_FORM: FormState = {
  full_name: "", email: "", phone_number: "", domicile: "",
  gender: "", birth_place: "", birth_date: "", photo_file: null,
  target_position: "", company_name: "", target_industry: "",
  ats_keywords: "", add_qna_hrd: false,
  institution: "", major: "", year_start: "", year_end: "", gpa: "",
  career_status: "", org_experience: "", internship: "",
  campus_project: "", certificates: "", work_experience: "",
  achievement: "", kpi: "", work_tools: "", career_switch_reason: "",
  transferable_skills: "", timezone: "", remote_tools: "", remote_experience: "",
  job_source: "", hr_name: "", motivation: "",
  tone_surat: "", job_keywords: "", catatan: "",
};

export const BASE_PRICE = 15000;
export const QNA_ADDON_PRICE = 10000;
