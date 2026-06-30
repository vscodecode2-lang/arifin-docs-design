"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import {
  approveTestimoni, rejectTestimoni, deleteTestimoni,
} from "@/app/actions/testimoni-actions";
import type { Testimoni } from "@/types/testimoni";
import { SERVICE_QUESTIONS } from "@/types/testimoni";
import {
  CheckCircle2, XCircle, Trash2, Star, Loader2,
  AlertTriangle, ChevronDown, ChevronUp, MessageSquare,
} from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const SERVICE_COLOR: Record<string, string> = {
  CV:           "bg-blue-100 text-blue-700",
  Lamaran:      "bg-violet-100 text-violet-700",
  Legal:        "bg-amber-100 text-amber-700",
  NPWP:         "bg-emerald-100 text-emerald-700",
  Akademik:     "bg-pink-100 text-pink-700",
  "Data Entry": "bg-slate-100 text-slate-600",
};

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  }).format(new Date(iso));
}

function getInitials(name: string) {
  return name.split(" ").slice(0, 2).map(n => n[0]?.toUpperCase()).join("");
}

const AVATAR_COLORS = [
  "bg-blue-500","bg-emerald-500","bg-violet-500",
  "bg-amber-500","bg-pink-500","bg-cyan-500",
];

function avatarColor(name: string) {
  const idx = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

function StarsDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(s => (
        <Star key={s} className={`h-3.5 w-3.5 ${s <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-slate-200"}`} />
      ))}
      <span className="ml-1 text-xs font-bold text-slate-700">{rating.toFixed(1)}</span>
    </div>
  );
}

function Avatar({ name, photoType, photoData }: {
  name: string; photoType: string; photoData: string | null;
}) {
  if (photoType === "upload" && photoData) {
    return (
      <div className="relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-white shadow">
        <Image
          src={photoData}
          alt={name}
          fill
          sizes="40px"
          className="object-cover"
          unoptimized
        />
      </div>
    );
  }
  if (photoType === "anonymous") {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-300 ring-2 ring-white shadow">
        <span className="text-sm text-slate-600">👤</span>
      </div>
    );
  }
  return (
    <div className={`flex h-10 w-10 items-center justify-center rounded-full ring-2 ring-white shadow ${avatarColor(name)}`}>
      <span className="text-sm font-bold text-white">{getInitials(name)}</span>
    </div>
  );
}

// ─── Reject Modal ─────────────────────────────────────────────────────────────

function RejectModal({
  testimoni, onConfirm, onCancel, isLoading,
}: {
  testimoni: Testimoni;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
  isLoading: boolean;
}) {
  const [reason, setReason] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <h3 className="text-base font-black text-slate-900">Tolak Testimoni</h3>
        <p className="mt-1 text-sm text-slate-500">
          Testimoni dari <span className="font-semibold">{testimoni.client_name}</span> akan ditolak.
        </p>
        <div className="mt-4">
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Alasan penolakan <span className="text-slate-400 font-normal">(opsional)</span>
          </label>
          <textarea rows={3} value={reason} onChange={e => setReason(e.target.value)}
            placeholder="Contoh: Mengandung konten tidak pantas, tidak relevan, dll."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm resize-none focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-400/20" />
        </div>
        <div className="mt-4 flex gap-3">
          <button onClick={onCancel} disabled={isLoading}
            className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60">
            Batal
          </button>
          <button onClick={() => onConfirm(reason)} disabled={isLoading}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 py-2.5 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-60">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
            Tolak
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Testimoni Card (Admin) ───────────────────────────────────────────────────

function TestimoniCard({
  t, onApprove, onReject, onDelete, showActions,
}: {
  t: Testimoni;
  onApprove?: (id: string) => void;
  onReject?: (t: Testimoni) => void;
  onDelete?: (id: string) => void;
  showActions: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const questions = SERVICE_QUESTIONS[t.service_type] ?? [];

  return (
    <div className={`rounded-2xl border bg-white shadow-sm transition-all ${
      t.status === "pending" ? "border-amber-200" :
      t.status === "approved" ? "border-emerald-200" : "border-red-200"
    }`}>
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          <Avatar name={t.client_name} photoType={t.photo_type} photoData={t.photo_data} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-bold text-slate-900">{t.client_name}</p>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${SERVICE_COLOR[t.service_type] ?? "bg-slate-100 text-slate-600"}`}>
                {t.service_type}
              </span>
            </div>
            <StarsDisplay rating={t.avg_rating} />
            <p className="mt-0.5 text-xs text-slate-400">{formatDate(t.created_at)}</p>
          </div>
          {t.status === "pending" && (
            <span className="shrink-0 rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-700">
              Menunggu
            </span>
          )}
          {t.status === "rejected" && (
            <span className="shrink-0 rounded-full bg-red-100 px-2.5 py-0.5 text-[10px] font-bold text-red-700">
              Ditolak
            </span>
          )}
        </div>

        {/* Highlight */}
        <div className="mt-3 rounded-xl bg-slate-50 p-3">
          <p className="text-sm text-slate-700 leading-relaxed">“{t.highlight}”</p>
          {t.suggestion && (
            <p className="mt-2 text-xs text-slate-500 italic">Saran: {t.suggestion}</p>
          )}
        </div>

        {/* Reject reason */}
        {t.status === "rejected" && t.reject_reason && (
          <div className="mt-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2">
            <p className="text-xs text-red-600"><span className="font-semibold">Alasan:</span> {t.reject_reason}</p>
          </div>
        )}

        {/* Expand ratings */}
        <button onClick={() => setExpanded(e => !e)}
          className="mt-3 flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors">
          {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          {expanded ? "Sembunyikan" : "Lihat"} detail rating
        </button>

        {expanded && (
          <div className="mt-2 space-y-1.5 rounded-xl bg-slate-50 p-3">
            {questions.map(q => {
              const r = t.ratings[q.id] ?? 0;
              return (
                <div key={q.id} className="flex items-center justify-between gap-2">
                  <span className="text-xs text-slate-600">{q.label}</span>
                  <div className="flex items-center gap-1 shrink-0">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} className={`h-3 w-3 ${s <= r ? "fill-amber-400 text-amber-400" : "text-slate-200"}`} />
                    ))}
                    <span className="ml-0.5 text-xs font-bold text-slate-600">{r}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Action buttons */}
        {showActions && (
          <div className="mt-3 flex items-center gap-2">
            {onApprove && (
              <button onClick={() => onApprove(t.id)}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition-colors">
                <CheckCircle2 className="h-3.5 w-3.5" />Approve
              </button>
            )}
            {onReject && (
              <button onClick={() => onReject(t)}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-white py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors">
                <XCircle className="h-3.5 w-3.5" />Tolak
              </button>
            )}
            {onDelete && (
              <button onClick={() => onDelete(t.id)}
                className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:border-red-300 hover:bg-red-50 hover:text-red-600 transition-colors">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface Props {
  initialPending:  Testimoni[];
  initialApproved: Testimoni[];
  initialRejected: Testimoni[];
}

export function TestimoniModerationTab({ initialPending, initialApproved, initialRejected }: Props) {
  const [subTab, setSubTab]         = useState<"pending"|"approved"|"rejected">("pending");
  const [pending, setPending]       = useState<Testimoni[]>(initialPending);
  const [approved, setApproved]     = useState<Testimoni[]>(initialApproved);
  const [rejected, setRejected]     = useState<Testimoni[]>(initialRejected);
  const [rejectTarget, setRejectTarget] = useState<Testimoni | null>(null);
  const [isRejecting, setIsRejecting]   = useState(false);
  const [toast, setToast]               = useState<{msg:string;type:"ok"|"err"}|null>(null);
  const [, startTransition]             = useTransition();

  const showToast = (msg: string, type: "ok"|"err" = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleApprove = (id: string) => {
    startTransition(async () => {
      const res = await approveTestimoni(id);
      if (res.success) {
        const item = pending.find(t => t.id === id);
        if (item) {
          setPending(prev => prev.filter(t => t.id !== id));
          setApproved(prev => [{ ...item, status: "approved", approved_at: new Date().toISOString() }, ...prev]);
          showToast("Testimoni disetujui & tampil di halaman publik");
        }
      } else showToast(res.error ?? "Gagal approve", "err");
    });
  };

  const handleRejectConfirm = async (reason: string) => {
    if (!rejectTarget) return;
    setIsRejecting(true);
    const res = await rejectTestimoni(rejectTarget.id, reason);
    setIsRejecting(false);
    if (res.success) {
      const item = pending.find(t => t.id === rejectTarget.id);
      if (item) {
        setPending(prev => prev.filter(t => t.id !== rejectTarget.id));
        setRejected(prev => [{ ...item, status: "rejected", reject_reason: reason }, ...prev]);
        showToast("Testimoni ditolak");
      }
    } else showToast(res.error ?? "Gagal menolak", "err");
    setRejectTarget(null);
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const res = await deleteTestimoni(id);
      if (res.success) {
        setApproved(prev => prev.filter(t => t.id !== id));
        setRejected(prev => prev.filter(t => t.id !== id));
        setPending(prev => prev.filter(t => t.id !== id));
        showToast("Testimoni dihapus");
      } else showToast(res.error ?? "Gagal hapus", "err");
    });
  };

  const current = subTab === "pending" ? pending : subTab === "approved" ? approved : rejected;

  const SUB_TABS = [
    { key: "pending"  as const, label: "Menunggu",  count: pending.length,  color: "border-amber-500 text-amber-700",   badge: "bg-amber-100 text-amber-700" },
    { key: "approved" as const, label: "Disetujui", count: approved.length, color: "border-emerald-500 text-emerald-700", badge: "bg-emerald-100 text-emerald-700" },
    { key: "rejected" as const, label: "Ditolak",   count: rejected.length, color: "border-red-500 text-red-600",       badge: "bg-red-100 text-red-600" },
  ];

  return (
    <>
      {toast && (
        <div className={`fixed right-4 top-4 z-[60] flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-xl ${toast.type === "ok" ? "bg-emerald-600" : "bg-red-600"}`}>
          {toast.type === "ok" ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
          {toast.msg}
        </div>
      )}

      {rejectTarget && (
        <RejectModal
          testimoni={rejectTarget}
          onConfirm={handleRejectConfirm}
          onCancel={() => setRejectTarget(null)}
          isLoading={isRejecting}
        />
      )}

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Moderasi Testimoni</h1>
          <p className="mt-1 text-sm text-slate-500">Tinjau, setujui, atau tolak testimoni dari klien</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {SUB_TABS.map(t => (
            <button key={t.key} onClick={() => setSubTab(t.key)}
              className={`rounded-2xl border-2 bg-white p-4 text-left shadow-sm transition-all hover:shadow-md ${
                subTab === t.key ? "border-blue-500 ring-2 ring-blue-200" : "border-transparent hover:border-slate-200"
              }`}>
              <p className="text-2xl font-black text-slate-900">{t.count}</p>
              <p className="text-xs font-medium text-slate-500">{t.label}</p>
            </button>
          ))}
        </div>

        {/* Sub-tab pills */}
        <div className="flex gap-1 border-b border-slate-200">
          {SUB_TABS.map(t => (
            <button key={t.key} onClick={() => setSubTab(t.key)}
              className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors ${
                subTab === t.key ? t.color : "border-transparent text-slate-500 hover:text-slate-700"
              }`}>
              {t.label}
              {t.count > 0 && (
                <span className={`rounded-full px-1.5 py-0.5 text-xs font-bold ${
                  subTab === t.key ? t.badge : "bg-slate-100 text-slate-600"
                }`}>{t.count}</span>
              )}
            </button>
          ))}
        </div>

        {/* Cards */}
        {current.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-16 text-center">
            <MessageSquare className="mb-3 h-10 w-10 text-slate-300" />
            <p className="text-sm font-semibold text-slate-600">
              {subTab === "pending" ? "Tidak ada testimoni menunggu review" :
               subTab === "approved" ? "Belum ada testimoni yang disetujui" :
               "Tidak ada testimoni yang ditolak"}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {current.map(t => (
              <TestimoniCard key={t.id} t={t}
                onApprove={subTab === "pending" ? handleApprove : undefined}
                onReject={subTab === "pending" ? setRejectTarget : undefined}
                onDelete={subTab !== "pending" ? handleDelete : undefined}
                showActions={true}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
