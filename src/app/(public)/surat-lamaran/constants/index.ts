import { User, Building2, Briefcase, ClipboardList } from "lucide-react";
import type { LamaranFormData, LamaranCareerStatus } from "@/types/lamaran";

export const ADMIN_WA = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP ?? "628123456789";

export const STEPS = [
  { id: 1, label: "Data Diri",    icon: User },
  { id: 2, label: "Info Lamaran", icon: Building2 },
  { id: 3, label: "Pengalaman",   icon: Briefcase },
  { id: 4, label: "Review",       icon: ClipboardList },
];

export const STEP_LABELS: Record<number, string> = {
  1: "Data Diri",
  2: "Info Lamaran",
  3: "Pengalaman",
};

export const FIELD_TO_STEP: Record<string, number> = {
  full_name: 1, domicile: 1, email: 1, phone_number: 1, career_status: 1,
  company_name: 2, position_target: 2, job_source: 2, hr_name: 2,
  motivation: 2, job_keywords: 2, tone_surat: 2,
  org_experience: 3, internship: 3, campus_project: 3,
  work_experience: 3, achievement: 3, kpi: 3,
  career_switch_reason: 3, transferable_skills: 3,
  timezone: 3, remote_tools: 3, remote_experience: 3,
};

export const CAREER_OPTIONS: { value: LamaranCareerStatus; label: string; desc: string; emoji: string }[] = [
  { value: "fresh_graduate",  label: "Fresh Graduate",  desc: "Baru lulus, belum ada pengalaman formal", emoji: "🎓" },
  { value: "profesional",     label: "Profesional",     desc: "Sudah memiliki pengalaman kerja formal",  emoji: "💼" },
  { value: "career_switcher", label: "Career Switcher", desc: "Ingin pindah ke bidang karir berbeda",   emoji: "🔄" },
  { value: "remote_worker",   label: "Remote Worker",   desc: "Melamar posisi remote / WFH",            emoji: "🌐" },
];

export const JOB_SOURCES = [
  "LinkedIn", "Jobstreet", "Glints", "Koran / Majalah",
  "Referral / Kenalan", "Website Perusahaan", "Lainnya",
];

export const TONE_OPTIONS = [
  { value: "formal",      label: "Formal",      desc: "Konservatif & profesional" },
  { value: "semi_formal", label: "Semi-Formal",  desc: "Profesional tapi ramah" },
  { value: "modern",      label: "Modern",       desc: "Fresh & to-the-point" },
];

export const INITIAL_FORM: LamaranFormData = {
  step1: { full_name: "", domicile: "", email: "", phone_number: "", career_status: "" },
  step2: { company_name: "", position_target: "", job_source: "", hr_name: "", motivation: "", job_keywords: "", tone_surat: "" },
  step3: {
    org_experience: "", internship: "", campus_project: "",
    work_experience: "", achievement: "", kpi: "",
    career_switch_reason: "", transferable_skills: "",
    timezone: "", remote_tools: "", remote_experience: "",
  },
};

export const inputCls = "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-60";
export const textareaCls = inputCls + " resize-none";
