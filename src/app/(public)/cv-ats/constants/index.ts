import {
  User, Phone, GraduationCap, Briefcase, ClipboardList,
} from "lucide-react";
import type { CareerStatus, CvFormData } from "@/types/cv";

export const STEPS = [
  { id: 1, label: "Pribadi", icon: User },
  { id: 2, label: "Kontak & Posisi", icon: Phone },
  { id: 3, label: "Pendidikan", icon: GraduationCap },
  { id: 4, label: "Pengalaman", icon: Briefcase },
  { id: 5, label: "Review", icon: ClipboardList },
];

export const INDUSTRIES = [
  "Teknologi", "Finance", "Startup", "Pendidikan",
  "Kesehatan", "Retail", "Manufaktur", "Lainnya",
];

export const CAREER_STATUS_OPTIONS: { value: CareerStatus; label: string; desc: string }[] = [
  { value: "fresh_graduate", label: "Fresh Graduate", desc: "Baru lulus atau belum ada pengalaman kerja formal" },
  { value: "profesional", label: "Profesional", desc: "Sudah memiliki pengalaman kerja formal" },
  { value: "career_switcher", label: "Career Switcher", desc: "Ingin pindah ke bidang karir yang berbeda" },
];

// Mapping field name → step number untuk navigasi error otomatis
export const FIELD_TO_STEP: Record<string, number> = {
  // Step 1
  full_name: 1, nickname: 1, birth_place: 1, birth_date: 1, gender: 1, domicile: 1,
  // Step 2
  email: 2, phone_number: 2, linkedin: 2, portfolio: 2, github: 2,
  target_position: 2, target_industry: 2, ats_keywords: 2,
  // Step 3
  institution: 3, major: 3, year_start: 3, year_end: 3, gpa: 3,
  // Step 4
  career_status: 4, org_experience: 4, campus_project: 4, internship: 4,
  certificates: 4, volunteer: 4, work_experience: 4, achievement: 4,
  kpi: 4, leadership: 4, work_tools: 4, previous_experience: 4,
  new_career_target: 4, transferable_skills: 4, career_switch_reason: 4,
};

export const STEP_LABELS: Record<number, string> = {
  1: "Informasi Pribadi",
  2: "Kontak & Posisi",
  3: "Pendidikan",
  4: "Pengalaman",
};

export const INITIAL_FORM: CvFormData = {
  step1: { full_name: "", nickname: "", birth_place: "", birth_date: "", gender: "", domicile: "", photo_file: null },
  step2: { email: "", phone_number: "", linkedin: "", portfolio: "", github: "", target_position: "", target_industry: "", ats_keywords: "" },
  step3: { institution: "", major: "", year_start: "", year_end: "", gpa: "" },
  step4: {
    career_status: "", org_experience: "", campus_project: "", internship: "",
    certificates: "", volunteer: "", work_experience: "", achievement: "",
    kpi: "", leadership: "", work_tools: "", previous_experience: "",
    new_career_target: "", transferable_skills: "", career_switch_reason: "",
  },
};

export const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-60";

export const textareaClass = inputClass + " resize-none";
