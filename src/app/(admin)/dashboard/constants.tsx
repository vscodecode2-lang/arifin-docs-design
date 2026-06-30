import {
  FileText, Mail, Building2, CreditCard, GraduationCap, Database, Sparkles,
} from "lucide-react";
import type { ClientStatus } from "@/app/actions/dashboardactions";

export const SERVICE_META: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  CV:           { label: "CV ATS",        icon: <FileText className="h-3 w-3" />,      color: "bg-blue-100 text-blue-700" },
  Lamaran:      { label: "Surat Lamaran", icon: <Mail className="h-3 w-3" />,          color: "bg-violet-100 text-violet-700" },
  Legal:        { label: "Surat Legal",   icon: <Building2 className="h-3 w-3" />,     color: "bg-amber-100 text-amber-700" },
  NPWP:         { label: "NPWP Online",   icon: <CreditCard className="h-3 w-3" />,    color: "bg-emerald-100 text-emerald-700" },
  Akademik:     { label: "Akademik",      icon: <GraduationCap className="h-3 w-3" />, color: "bg-pink-100 text-pink-700" },
  "Data Entry": { label: "Data Entry",    icon: <Database className="h-3 w-3" />,      color: "bg-slate-100 text-slate-600" },
  "Paket Hemat": { label: "Paket Hemat", icon: <Sparkles className="h-3 w-3" />,     color: "bg-rose-100 text-rose-700" },
};

export const STATUS_META: Record<ClientStatus, { label: string; badge: string; dot: string }> = {
  pending:     { label: "Menunggu",   badge: "bg-amber-50 text-amber-700 border border-amber-200",       dot: "bg-amber-400" },
  in_progress: { label: "Dikerjakan", badge: "bg-blue-50 text-blue-700 border border-blue-200",          dot: "bg-blue-500 animate-pulse" },
  completed:   { label: "Selesai",    badge: "bg-emerald-50 text-emerald-700 border border-emerald-200", dot: "bg-emerald-500" },
};

export const ALL_STATUSES: ClientStatus[] = ["pending", "in_progress", "completed"];
export const ALL_SERVICES = Object.keys(SERVICE_META);
