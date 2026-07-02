"use client";

import { useState, useEffect, useRef } from "react";
import { getClientDetail } from "@/app/actions/dashboardactions";
import type { ClientRow } from "../DashboardClient";
import {
  X, Loader2, MessageCircle, Copy, Check,
  Download, FileText, FileSpreadsheet, BookOpen,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface EducationItem {
  institution?: string;
  major?: string;
  year_start?: string;
  year_end?: string;
  gpa?: string | null;
}

interface WorkExperience {
  career_status?: string;
  // Fresh Graduate
  org_experience?: string;
  campus_project?: string;
  internship?: string;
  certificates?: string;
  volunteer?: string;
  // Profesional
  work_experience?: string;
  achievement?: string;
  kpi?: string;
  leadership?: string;
  work_tools?: string;
  // Career Switcher
  previous_experience?: string;
  new_career_target?: string;
  transferable_skills?: string;
  career_switch_reason?: string;
  // Extras
  gender?: string;
  linkedin?: string;
  portfolio?: string;
  github?: string;
  target_industry?: string;
  ats_keywords?: string;
  birth_place?: string;
  birth_date?: string;
  nickname?: string;
  // Remote Worker
  timezone?: string;
  remote_tools?: string;
  remote_experience?: string;
  // Lamaran
  kpi_lamaran?: string;
  [key: string]: string | null | undefined;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const CAREER_LABEL: Record<string, string> = {
  fresh_graduate:  "🎓 Fresh Graduate",
  profesional:     "💼 Profesional",
  career_switcher: "🔄 Career Switcher",
  remote_worker:   "🌐 Remote Worker",
};

function val(v: unknown): string {
  if (v === null || v === undefined || v === "") return "-";
  return String(v);
}

function textOf(v: unknown): string {
  if (v === null || v === undefined) return "";
  return String(v).trim();
}

function hasText(v: unknown): boolean {
  const text = textOf(v);
  return text.length > 0 && text !== "-" && text !== "null";
}

function formatWA(phone: string) {
  const c = phone.replace(/\D/g, "");
  if (c.startsWith("62")) return `+${c}`;
  if (c.startsWith("0"))  return `+62${c.slice(1)}`;
  return phone;
}

// ─── Section Components ───────────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-[11px] font-black uppercase tracking-widest text-blue-600">
      {children}
    </p>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  if (!value || value === "-") return null;
  return (
    <div className="flex gap-3 py-2 border-b border-slate-100 last:border-0">
      <span className="w-36 shrink-0 text-xs font-semibold text-slate-500">{label}</span>
      <span className="text-sm text-slate-800 break-words">{value}</span>
    </div>
  );
}

function EducationSection({ items }: { items: EducationItem[] }) {
  if (!items?.length) return null;
  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <SectionTitle>📚 Riwayat Pendidikan</SectionTitle>
      {items.map((edu, i) => (
        <div key={i} className={`${i > 0 ? "mt-3 pt-3 border-t border-slate-100" : ""}`}>
          <p className="text-sm font-bold text-slate-900">{val(edu.institution)}</p>
          <p className="text-sm text-slate-600">{val(edu.major)}</p>
          <div className="mt-1 flex flex-wrap gap-3">
            <span className="text-xs text-slate-500">
              📅 {val(edu.year_start)} — {val(edu.year_end)}
            </span>
            {edu.gpa && edu.gpa !== "null" && (
              <span className="text-xs text-slate-500">🎯 IPK: {edu.gpa}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function WorkSection({ data }: { data: WorkExperience }) {
  const status = data.career_status;

  // ── Informasi pribadi tambahan ──
  const extras = [
    { label: "Gender",          value: data.gender },
    { label: "Tempat Lahir",    value: data.birth_place },
    { label: "Tgl Lahir",       value: data.birth_date },
    { label: "Nama Panggilan",  value: data.nickname },
    { label: "Target Industri", value: data.target_industry },
    { label: "ATS Keywords",    value: data.ats_keywords },
    { label: "LinkedIn",        value: data.linkedin },
    { label: "Portfolio",       value: data.portfolio },
    { label: "GitHub",          value: data.github },
  ].filter(e => e.value && e.value !== "null");

  return (
    <div className="space-y-4">
      {/* Extras */}
      {extras.length > 0 && (
        <div className="rounded-xl border border-slate-200 p-4">
          <SectionTitle>👤 Informasi Tambahan</SectionTitle>
          {extras.map(e => (
            <InfoRow key={e.label} label={e.label} value={val(e.value)} />
          ))}
        </div>
      )}

      {/* Career status badge */}
      {status && (
        <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
          <SectionTitle>💼 Status Karir</SectionTitle>
          <span className="rounded-full bg-blue-700 px-3 py-1 text-sm font-bold text-white">
            {CAREER_LABEL[status] ?? status}
          </span>
        </div>
      )}

      {/* Fresh Graduate */}
      {status === "fresh_graduate" && (
        <div className="rounded-xl border border-slate-200 p-4">
          <SectionTitle>🎓 Pengalaman Fresh Graduate</SectionTitle>
          <InfoRow label="Organisasi"  value={val(data.org_experience)} />
          <InfoRow label="Magang"      value={val(data.internship)} />
          <InfoRow label="Project Kampus" value={val(data.campus_project)} />
          <InfoRow label="Sertifikat"  value={val(data.certificates)} />
          <InfoRow label="Volunteer"   value={val(data.volunteer)} />
        </div>
      )}

      {/* Profesional */}
      {status === "profesional" && (
        <div className="rounded-xl border border-slate-200 p-4">
          <SectionTitle>💼 Pengalaman Profesional</SectionTitle>
          <InfoRow label="Pengalaman Kerja" value={val(data.work_experience)} />
          <InfoRow label="Achievement"      value={val(data.achievement)} />
          <InfoRow label="KPI"              value={val(data.kpi)} />
          <InfoRow label="Leadership"       value={val(data.leadership)} />
          <InfoRow label="Tools Kerja"      value={val(data.work_tools)} />
        </div>
      )}

      {/* Career Switcher */}
      {status === "career_switcher" && (
        <div className="rounded-xl border border-slate-200 p-4">
          <SectionTitle>🔄 Career Switcher</SectionTitle>
          <InfoRow label="Pengalaman Sebelumnya" value={val(data.previous_experience)} />
          <InfoRow label="Target Karir Baru"     value={val(data.new_career_target)} />
          <InfoRow label="Transferable Skills"   value={val(data.transferable_skills)} />
          <InfoRow label="Alasan Pindah"         value={val(data.career_switch_reason)} />
        </div>
      )}

      {/* Remote Worker */}
      {status === "remote_worker" && (
        <div className="rounded-xl border border-slate-200 p-4">
          <SectionTitle>🌐 Remote Worker</SectionTitle>
          <InfoRow label="Timezone"           value={val(data.timezone)} />
          <InfoRow label="Remote Tools"       value={val(data.remote_tools)} />
          <InfoRow label="Remote Experience"  value={val(data.remote_experience)} />
        </div>
      )}
    </div>
  );
}

function LamaranSection({ data }: { data: WorkExperience }) {
  const status = data.career_status;
  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <SectionTitle>📋 Detail Pengalaman — {CAREER_LABEL[status ?? ""] ?? status}</SectionTitle>
      {status === "fresh_graduate" && (
        <>
          <InfoRow label="Organisasi"    value={val(data.org_experience)} />
          <InfoRow label="Magang"        value={val(data.internship)} />
          <InfoRow label="Project Kampus" value={val(data.campus_project)} />
        </>
      )}
      {status === "profesional" && (
        <>
          <InfoRow label="Pengalaman Kerja" value={val(data.work_experience)} />
          <InfoRow label="Achievement"      value={val(data.achievement)} />
          <InfoRow label="KPI"              value={val(data.kpi)} />
        </>
      )}
      {status === "career_switcher" && (
        <>
          <InfoRow label="Alasan Pindah"       value={val(data.career_switch_reason)} />
          <InfoRow label="Transferable Skills" value={val(data.transferable_skills)} />
        </>
      )}
      {status === "remote_worker" && (
        <>
          <InfoRow label="Timezone"          value={val(data.timezone)} />
          <InfoRow label="Remote Tools"      value={val(data.remote_tools)} />
          <InfoRow label="Remote Experience" value={val(data.remote_experience)} />
        </>
      )}
    </div>
  );
}

// ─── Render by Service Type ───────────────────────────────────────────────────

function RenderCV({ detail }: { detail: Record<string, unknown> }) {
  const edu  = detail.education_history as EducationItem[] | null;
  const work = detail.work_experience   as WorkExperience  | null;
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 p-4">
        <SectionTitle>🎯 Posisi & Domisili</SectionTitle>
        <InfoRow label="Posisi Target" value={val(detail.target_position)} />
        <InfoRow label="Domisili"      value={val(detail.domicile)} />
      </div>
      {edu  && <EducationSection items={edu} />}
      {work && <WorkSection data={work} />}
      {hasText(detail.file_url) && (
        <div className="rounded-xl border border-slate-200 p-4">
          <SectionTitle>📎 File Pendukung</SectionTitle>
          <a href={String(detail.file_url)} target="_blank" rel="noopener noreferrer"
            className="text-sm text-blue-600 underline">
            Lihat File
          </a>
        </div>
      )}
    </div>
  );
}

function RenderLamaran({ detail }: { detail: Record<string, unknown> }) {
  const expDetail = detail.experience_detail as WorkExperience | null;
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 p-4">
        <SectionTitle>🏢 Info Lamaran</SectionTitle>
        <InfoRow label="Perusahaan"   value={val(detail.company_name)} />
        <InfoRow label="Posisi"       value={val(detail.position_target)} />
        <InfoRow label="Sumber Info"  value={val(detail.job_source)} />
        <InfoRow label="Nama HR"      value={val(detail.hr_name)} />
        <InfoRow label="Domisili"     value={val(detail.domicile)} />
        <InfoRow label="Tone Surat"   value={val(detail.tone_surat)} />
      </div>
      {hasText(detail.motivation) && (
        <div className="rounded-xl border border-slate-200 p-4">
          <SectionTitle>💬 Motivasi Melamar</SectionTitle>
          <p className="whitespace-pre-wrap text-sm text-slate-700">{String(detail.motivation)}</p>
        </div>
      )}
      {hasText(detail.job_keywords) && (
        <div className="rounded-xl border border-slate-200 p-4">
          <SectionTitle>🔑 Keyword ATS</SectionTitle>
          <p className="text-sm text-slate-700">{String(detail.job_keywords)}</p>
        </div>
      )}
      {expDetail && <LamaranSection data={expDetail} />}
    </div>
  );
}

function RenderPaketHemat({ detail }: { detail: Record<string, unknown> }) {
  const edu  = detail.education_history as EducationItem[] | null;
  const exp  = detail.experience_detail as WorkExperience  | null;

  const CAREER_LABEL: Record<string, string> = {
    fresh_graduate:  "Fresh Graduate",
    profesional:     "Profesional",
    career_switcher: "Career Switcher",
    remote_worker:   "Remote Worker",
  };

  return (
    <div className="space-y-4">
      {/* Paket info */}
      <div className="rounded-xl border border-violet-200 bg-violet-50 p-4">
        <SectionTitle>✨ Paket Siap Kerja</SectionTitle>
        <InfoRow label="Layanan" value="CV ATS Friendly + Surat Lamaran Profesional" />
        <InfoRow label="Simulasi QnA HRD"
          value={detail.add_qna_hrd === true ? "Ya — termasuk QnA HRD custom (+Rp 10.000)" : "Tidak"} />
        <InfoRow label="Total Harga"
          value={detail.add_qna_hrd === true ? "Rp 50.000" : "Rp 40.000"} />
      </div>

      {/* Target karir */}
      <div className="rounded-xl border border-slate-200 p-4">
        <SectionTitle>🎯 Target Karir</SectionTitle>
        <InfoRow label="Posisi Dilamar"    value={val(detail.target_position)} />
        <InfoRow label="Nama Perusahaan"   value={val(detail.company_name)} />
        <InfoRow label="Industri Target"   value={val(detail.target_industry)} />
        <InfoRow label="Kata Kunci ATS"    value={val(detail.ats_keywords)} />
        <InfoRow label="Sumber Lowongan"   value={val(detail.job_source)} />
        <InfoRow label="Domisili"          value={val(detail.domicile)} />
      </div>

      {/* Pendidikan */}
      {edu && <EducationSection items={edu} />}

      {/* Pengalaman */}
      {exp && (
        <div className="rounded-xl border border-slate-200 p-4">
          <SectionTitle>
            💼 Pengalaman — {CAREER_LABEL[exp.career_status ?? ""] ?? exp.career_status}
          </SectionTitle>
          {/* Data tambahan pribadi */}
          <InfoRow label="Jenis Kelamin"   value={val(exp.gender)} />
          <InfoRow label="Tempat Lahir"    value={val(exp.birth_place)} />
          <InfoRow label="Tanggal Lahir"   value={val(exp.birth_date)} />
          {/* Fresh Graduate */}
          <InfoRow label="Pengalaman Organisasi" value={val(exp.org_experience)} />
          <InfoRow label="Pengalaman Magang"     value={val(exp.internship)} />
          <InfoRow label="Project Kampus"        value={val(exp.campus_project)} />
          <InfoRow label="Sertifikat"            value={val(exp.certificates)} />
          {/* Profesional */}
          <InfoRow label="Pengalaman Kerja"      value={val(exp.work_experience)} />
          <InfoRow label="Pencapaian Terbaik"    value={val(exp.achievement)} />
          <InfoRow label="KPI dan Target"        value={val(exp.kpi)} />
          <InfoRow label="Tools yang Dikuasai"   value={val(exp.work_tools)} />
          {/* Career Switcher */}
          <InfoRow label="Alasan Pindah Karir"   value={val(exp.career_switch_reason)} />
          <InfoRow label="Kemampuan yang Ditransfer" value={val(exp.transferable_skills)} />
          {/* Remote Worker */}
          <InfoRow label="Zona Waktu Kerja"      value={val(exp.timezone)} />
          <InfoRow label="Tools Remote"          value={val(exp.remote_tools)} />
          <InfoRow label="Pengalaman Remote"     value={val(exp.remote_experience)} />
        </div>
      )}

      {/* Detail surat lamaran */}
      <div className="rounded-xl border border-slate-200 p-4">
        <SectionTitle>✉️ Detail Surat Lamaran</SectionTitle>
        <InfoRow label="Nama HR atau Rekruter"   value={val(detail.hr_name)} />
        <InfoRow label="Gaya Penulisan Surat"    value={val(detail.tone_surat)} />
        <InfoRow label="Keyword dari Job Desc"   value={val(detail.job_keywords)} />
        {hasText(detail.motivation) && (
          <div className="mt-2">
            <span className="text-xs font-bold text-slate-500 block mb-1">Motivasi Melamar</span>
            <p className="whitespace-pre-wrap rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
              {String(detail.motivation)}
            </p>
          </div>
        )}
        <InfoRow label="Catatan Khusus"          value={val(detail.catatan)} />
      </div>

      {/* File */}
      {hasText(detail.file_url) && (
        <div className="rounded-xl border border-slate-200 p-4">
          <SectionTitle>📎 File Pendukung</SectionTitle>
          <a href={String(detail.file_url)} target="_blank" rel="noopener noreferrer"
            className="text-sm text-blue-600 underline">
            Lihat File
          </a>
        </div>
      )}
    </div>
  );
}

function RenderGeneric({ detail }: { detail: Record<string, unknown> }) {
  const SKIP = ["id", "client_id", "created_at"];
  return (
    <div className="rounded-xl border border-slate-200 p-4 space-y-0">
      <SectionTitle>📄 Data Submission</SectionTitle>
      {Object.entries(detail)
        .filter(([k]) => !SKIP.includes(k))
        .map(([k, v]) => {
          const isObj = typeof v === "object" && v !== null;
          return (
            <div key={k} className="py-2 border-b border-slate-100 last:border-0">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                {k.replace(/_/g, " ")}
              </span>
              {isObj
                ? <pre className="rounded-lg bg-slate-50 p-3 text-xs text-slate-700 overflow-x-auto whitespace-pre-wrap">
                    {JSON.stringify(v, null, 2)}
                  </pre>
                : <span className="text-sm text-slate-800">{val(v)}</span>
              }
            </div>
          );
        })}
    </div>
  );
}

// ─── Download Helpers ─────────────────────────────────────────────────────────

function buildMarkdown(client: ClientRow, detail: Record<string, unknown>): string {
  const edu  = detail.education_history as EducationItem[] | null;
  const work = detail.work_experience   as WorkExperience  | null;
  const exp  = detail.experience_detail as WorkExperience  | null;

  const lines: string[] = [
    `# Data Klien — ${client.service_type}`,
    ``,
    `## Informasi Utama`,
    `- **Nama:** ${client.full_name}`,
    `- **Email:** ${client.email}`,
    `- **Kode Order:** ${client.order_code ?? "-"}`,
    `- **WhatsApp:** ${formatWA(client.phone_number)}`,
    `- **Layanan:** ${client.service_type}`,
    `- **Status:** ${client.status}`,
    ``,
  ];

  if (detail.target_position) {
    lines.push(`## Posisi & Domisili`);
    lines.push(`- **Posisi Target:** ${val(detail.target_position)}`);
    lines.push(`- **Domisili:** ${val(detail.domicile)}`);
    lines.push(``);
  }

  if (detail.company_name) {
    lines.push(`## Info Lamaran`);
    lines.push(`- **Perusahaan:** ${val(detail.company_name)}`);
    lines.push(`- **Posisi:** ${val(detail.position_target)}`);
    lines.push(`- **Sumber:** ${val(detail.job_source)}`);
    lines.push(`- **Nama HR:** ${val(detail.hr_name)}`);
    lines.push(`- **Tone Surat:** ${val(detail.tone_surat)}`);
    if (detail.motivation) {
      lines.push(``);
      lines.push(`### Motivasi Melamar`);
      lines.push(String(detail.motivation));
    }
    lines.push(``);
  }

  if (edu?.length) {
    lines.push(`## Riwayat Pendidikan`);
    edu.forEach((e, i) => {
      lines.push(`### ${i + 1}. ${e.institution ?? "-"}`);
      lines.push(`- Jurusan: ${e.major ?? "-"}`);
      lines.push(`- Periode: ${e.year_start} — ${e.year_end}`);
      if (e.gpa && e.gpa !== "null") lines.push(`- IPK: ${e.gpa}`);
    });
    lines.push(``);
  }

  const workData = work ?? exp;
  if (workData) {
    const status = workData.career_status;
    lines.push(`## Pengalaman — ${CAREER_LABEL[status ?? ""] ?? status}`);

    const fields: [string, string | undefined][] = [
      ["Pengalaman Organisasi", workData.org_experience],
      ["Magang", workData.internship],
      ["Project Kampus", workData.campus_project],
      ["Sertifikat", workData.certificates],
      ["Volunteer", workData.volunteer],
      ["Pengalaman Kerja", workData.work_experience],
      ["Achievement", workData.achievement],
      ["KPI", workData.kpi],
      ["Leadership", workData.leadership],
      ["Tools Kerja", workData.work_tools],
      ["Pengalaman Sebelumnya", workData.previous_experience],
      ["Target Baru", workData.new_career_target],
      ["Transferable Skills", workData.transferable_skills],
      ["Alasan Pindah", workData.career_switch_reason],
      ["Timezone", workData.timezone],
      ["Remote Tools", workData.remote_tools],
      ["Remote Experience", workData.remote_experience],
      ["Gender", workData.gender],
      ["LinkedIn", workData.linkedin ?? undefined],
      ["GitHub", workData.github ?? undefined],
      ["Portfolio", workData.portfolio ?? undefined],
      ["ATS Keywords", workData.ats_keywords],
    ];
    fields.forEach(([label, value]) => {
      if (value && value !== "null") lines.push(`### ${label}\n${value}`);
    });
    lines.push(``);
  }

  lines.push(`---`);
  lines.push(`*Diekspor dari Arifin Docs & Design Dashboard*`);
  return lines.join("\n");
}

function buildCSV(client: ClientRow, detail: Record<string, unknown>): string {
  const SKIP = ["id", "client_id"];
  const rows: string[][] = [
    ["Field", "Value"],
    ["Nama Klien", client.full_name],
    ["Email", client.email],
    ["Kode Order", client.order_code ?? "-"],
    ["WhatsApp", formatWA(client.phone_number)],
    ["Layanan", client.service_type],
    ["Status", client.status],
  ];

  Object.entries(detail)
    .filter(([k]) => !SKIP.includes(k))
    .forEach(([k, v]) => {
      if (typeof v === "object" && v !== null) {
        rows.push([k, JSON.stringify(v)]);
      } else if (v !== null && v !== undefined) {
        rows.push([k, String(v)]);
      }
    });

  return rows.map(r =>
    r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",")
  ).join("\n");
}

function buildHTML(client: ClientRow, md: string): string {
  const htmlContent = md
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/\n/g, "<br/>");

  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8">
<style>body{font-family:Calibri,Arial,sans-serif;max-width:800px;margin:40px auto;color:#1e293b;}
h1{color:#1d4ed8;border-bottom:2px solid #1d4ed8;padding-bottom:8px;}
h2{color:#1e40af;margin-top:24px;}h3{color:#334155;}
li{margin:4px 0;}strong{color:#0f172a;}</style>
<title>Data Klien — ${client.full_name}</title>
</head><body>${htmlContent}</body></html>`;
}

function downloadBlob(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ─── Main DetailModal ─────────────────────────────────────────────────────────

export function DetailModal({
  client,
  onClose,
}: {
  client: ClientRow;
  onClose: () => void;
}) {
  const [detail, setDetail]   = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const [copied, setCopied]   = useState(false);
  const printRef              = useRef<HTMLDivElement>(null);
  const copyTimeoutRef        = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    getClientDetail(client.id, client.service_type).then(res => {
      if (res.success) setDetail(res.data ?? null);
      else setError(res.error ?? "Gagal memuat detail");
      setLoading(false);
    });
  }, [client.id, client.service_type]);

  // AUDIT MEDIUM-3: bersihkan timer "copied" saat komponen unmount.
  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    };
  }, []);

  const md = detail ? buildMarkdown(client, detail) : "";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(md);
    setCopied(true);
    if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    copyTimeoutRef.current = setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMD = () =>
    downloadBlob(md, `${client.full_name}-${client.service_type}.md`, "text/markdown");

  const handleDownloadCSV = () =>
    detail && downloadBlob(buildCSV(client, detail), `${client.full_name}-${client.service_type}.csv`, "text/csv");

  const handleDownloadWord = () =>
    downloadBlob(buildHTML(client, md), `${client.full_name}-${client.service_type}.html`, "text/html");

  const handlePrint = () => window.print();

  const SERVICE_LABEL: Record<string, string> = {
    CV: "CV ATS", Lamaran: "Surat Lamaran", Legal: "Surat Legal",
    NPWP: "NPWP", Akademik: "Akademik", "Data Entry": "Data Entry",
    "Paket Hemat": "Paket Hemat",
  };

  return (
    <>
      {/* Print styles */}
      <style>{`@media print { .no-print { display: none !important; } body * { visibility: hidden; } #printable, #printable * { visibility: visible; } #printable { position: fixed; left: 0; top: 0; width: 100%; } }`}</style>

      <div
        className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center no-print"
        onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      >
        <div className="flex max-h-[92vh] w-full max-w-2xl flex-col rounded-t-2xl bg-white shadow-2xl sm:mx-4 sm:rounded-2xl">

          {/* ── Header ── */}
          <div className="flex shrink-0 items-start justify-between border-b border-slate-100 p-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
                {SERVICE_LABEL[client.service_type] ?? client.service_type}
              </span>
              <h3 className="mt-0.5 text-lg font-black text-slate-900">{client.full_name}</h3>
              <p className="text-xs font-mono font-semibold text-blue-600">
                {client.order_code ?? "-"}
              </p>
              <p className="text-sm text-slate-500">
                {client.email} • {formatWA(client.phone_number)}
              </p>
            </div>
            <button onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* ── Download Toolbar ── */}
          {detail && (
            <div className="shrink-0 flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-5 py-2.5 overflow-x-auto no-print">
              <span className="text-xs font-semibold text-slate-400 shrink-0">Ekspor:</span>

              <button onClick={handleCopy}
                className="flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-blue-300 hover:text-blue-700 transition-colors">
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Tersalin!" : "Copy"}
              </button>

              <button onClick={handleDownloadMD}
                className="flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-blue-300 hover:text-blue-700 transition-colors">
                <FileText className="h-3.5 w-3.5" />
                Markdown
              </button>

              <button onClick={handleDownloadCSV}
                className="flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-emerald-400 hover:text-emerald-700 transition-colors">
                <FileSpreadsheet className="h-3.5 w-3.5" />
                Excel / CSV
              </button>

              <button onClick={handleDownloadWord}
                className="flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-blue-300 hover:text-blue-700 transition-colors">
                <BookOpen className="h-3.5 w-3.5" />
                Word
              </button>

              <button onClick={handlePrint}
                className="flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-red-300 hover:text-red-600 transition-colors">
                <Download className="h-3.5 w-3.5" />
                PDF
              </button>
            </div>
          )}

          {/* ── Body ── */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4" id="printable" ref={printRef}>
            {loading && (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                <span className="ml-2 text-sm text-slate-500">Memuat data klien...</span>
              </div>
            )}
            {error && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                <p className="text-sm font-semibold text-amber-700">⚠️ {error}</p>
              </div>
            )}
            {!loading && !error && detail && (
              <>
                {/* Client header info (for print) */}
                <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                  <SectionTitle>👤 Informasi Klien</SectionTitle>
                  <InfoRow label="Nama Lengkap" value={client.full_name} />
                  <InfoRow label="Email"        value={client.email} />
                  <InfoRow label="Kode Order"    value={client.order_code ?? "-"} />
                  <InfoRow label="WhatsApp"     value={formatWA(client.phone_number)} />
                  <InfoRow label="Layanan"      value={SERVICE_LABEL[client.service_type] ?? client.service_type} />
                  <InfoRow label="Status"       value={client.status === "pending" ? "Menunggu" : client.status === "in_progress" ? "Dikerjakan" : "Selesai"} />
                </div>

                {client.service_type === "CV" && <RenderCV detail={detail} />}
                {client.service_type === "Lamaran" && <RenderLamaran detail={detail} />}
                {client.service_type === "Paket Hemat" && <RenderPaketHemat detail={detail} />}
                {!["CV", "Lamaran", "Paket Hemat"].includes(client.service_type) && <RenderGeneric detail={detail} />}
              </>
            )}
            {!loading && !error && !detail && (
              <p className="py-8 text-center text-sm text-slate-500">
                Belum ada detail submission untuk klien ini.
              </p>
            )}
          </div>

          {/* ── Footer ── */}
          <div className="shrink-0 border-t border-slate-100 p-4 no-print">
            <a
              href={`https://wa.me/${formatWA(client.phone_number).replace("+", "")}?text=${encodeURIComponent(
                `Halo ${client.full_name}, terima kasih sudah menggunakan layanan Arifin Docs & Design.`
              )}`}
              target="_blank" rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white hover:bg-emerald-700 transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              Hubungi via WhatsApp
            </a>
          </div>
        </div>
      </div>
    </>
  );
}