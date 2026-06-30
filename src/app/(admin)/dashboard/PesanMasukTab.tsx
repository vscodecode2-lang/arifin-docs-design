"use client";

import { useState, useTransition, useMemo } from "react";
import { createClient } from "@/lib/supabase";
import {
  Mail, MessageCircle, CheckCircle2, Circle,
  Trash2, Loader2, AlertTriangle, Search,
  X, Clock, Filter,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ContactMessage {
  id: string;
  created_at: string;
  full_name: string;
  contact: string;
  topic: string;
  message: string;
  is_read: boolean;
  read_at: string | null;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TOPIC_META: Record<string, { label: string; color: string }> = {
  layanan:   { label: "Tanya Layanan",   color: "bg-blue-100 text-blue-700" },
  keluhan:   { label: "Keluhan",          color: "bg-red-100 text-red-700" },
  kerjasama: { label: "Kerjasama",        color: "bg-emerald-100 text-emerald-700" },
  lainnya:   { label: "Lainnya",          color: "bg-slate-100 text-slate-600" },
};

function formatDate(iso: string) {
  const date = new Date(iso);
  const now  = new Date();
  const diff = now.getTime() - date.getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);

  if (mins < 1)   return "Baru saja";
  if (mins < 60)  return `${mins} menit lalu`;
  if (hours < 24) return `${hours} jam lalu`;
  if (days < 7)   return `${days} hari lalu`;
  return new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

function extractWAContact(value: string) {
  const matches = value.match(/(\+62|62|0)8\d{8,11}/g);
  if (!matches?.length) return null;

  const candidate = matches[0].replace(/\s/g, "");
  if (candidate.startsWith("0")) return `62${candidate.slice(1)}`;
  if (candidate.startsWith("+62")) return candidate.replace("+", "");
  return candidate;
}

function buildWAReply(msg: ContactMessage) {
  const phoneFromContact = extractWAContact(msg.contact);
  const phoneFromMessage = extractWAContact(msg.message);
  const phone = phoneFromContact ?? phoneFromMessage ?? null;

  if (!phone) {
    return null;
  }

  const text = encodeURIComponent(
    `Halo ${msg.full_name}, terima kasih sudah menghubungi Arifin Docs & Design. ` +
    `Merespons pesan Anda mengenai "${TOPIC_META[msg.topic]?.label ?? msg.topic}".`
  );

  return `https://wa.me/${phone}?text=${text}`;
}

function buildEmailReply(msg: ContactMessage) {
  const subject = encodeURIComponent(`Re: ${TOPIC_META[msg.topic]?.label ?? msg.topic} — Arifin Docs & Design`);
  const body    = encodeURIComponent(`Halo ${msg.full_name},\n\nTerima kasih sudah menghubungi kami.\n\n---\nPesan Anda:\n"${msg.message}"\n---\n\nBalasan:`);
  return `mailto:${msg.contact}?subject=${subject}&body=${body}`;
}

// ─── Message Card ─────────────────────────────────────────────────────────────

function MessageCard({
  msg, onMarkRead, onDelete,
}: {
  msg: ContactMessage;
  onMarkRead: (id: string, isRead: boolean) => void;
  onDelete: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [isPending, startTransition] = useTransition();
  const waLink = buildWAReply(msg);

  return (
    <div className={`rounded-2xl border transition-all ${
      msg.is_read
        ? "border-slate-200 bg-white"
        : "border-blue-200 bg-blue-50/40 shadow-sm"
    }`}>
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          {/* Read indicator */}
          <button
            onClick={() => startTransition(() => onMarkRead(msg.id, !msg.is_read))}
            disabled={isPending}
            title={msg.is_read ? "Tandai belum dibaca" : "Tandai sudah dibaca"}
            className="mt-0.5 shrink-0 text-slate-300 hover:text-blue-500 transition-colors disabled:opacity-50"
          >
            {isPending
              ? <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
              : msg.is_read
                ? <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                : <Circle className="h-4 w-4 text-blue-500 fill-blue-500" />
            }
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <p className={`text-sm font-bold ${msg.is_read ? "text-slate-700" : "text-slate-900"}`}>
                    {msg.full_name}
                  </p>
                  {!msg.is_read && (
                    <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-bold text-white">
                      Baru
                    </span>
                  )}
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${TOPIC_META[msg.topic]?.color ?? "bg-slate-100 text-slate-600"}`}>
                    {TOPIC_META[msg.topic]?.label ?? msg.topic}
                  </span>
                </div>
                <p className="text-xs text-slate-400">{msg.contact}</p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <Clock className="h-3 w-3 text-slate-300" />
                <span className="text-xs text-slate-400">{formatDate(msg.created_at)}</span>
              </div>
            </div>

            {/* Preview / Full message */}
            <div className="mt-2">
              {expanded ? (
                <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">
                  {msg.message}
                </p>
              ) : (
                <p className="text-sm text-slate-600 line-clamp-2">{msg.message}</p>
              )}
              {msg.message.length > 120 && (
                <button
                  onClick={() => setExpanded(e => !e)}
                  className="mt-1 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                >
                  {expanded ? "Sembunyikan" : "Baca selengkapnya"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
          <a
            href={buildEmailReply(msg)}
            onClick={() => !msg.is_read && onMarkRead(msg.id, true)}
            className="flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition-colors"
          >
            <Mail className="h-3.5 w-3.5" />
            Balas Email
          </a>

          {waLink && (
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => !msg.is_read && onMarkRead(msg.id, true)}
              className="flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              Balas WhatsApp
            </a>
          )}

          <button
            onClick={() => onMarkRead(msg.id, !msg.is_read)}
            disabled={isPending}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            {msg.is_read ? <Circle className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
            {msg.is_read ? "Belum dibaca" : "Tandai dibaca"}
          </button>

          <button
            onClick={() => onDelete(msg.id)}
            className="ml-auto flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:border-red-300 hover:bg-red-50 hover:text-red-600 transition-colors"
            title="Hapus pesan"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Delete Confirm ───────────────────────────────────────────────────────────

function DeleteModal({
  name, onConfirm, onCancel,
}: {
  name: string; onConfirm: () => void; onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <AlertTriangle className="h-6 w-6 text-red-600" />
        </div>
        <h3 className="text-base font-black text-slate-900">Hapus Pesan?</h3>
        <p className="mt-2 text-sm text-slate-500">
          Pesan dari <span className="font-semibold text-slate-700">{name}</span> akan dihapus permanen.
        </p>
        <div className="mt-5 flex gap-3">
          <button onClick={onCancel}
            className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
            Batal
          </button>
          <button onClick={onConfirm}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 py-2.5 text-sm font-bold text-white hover:bg-red-700 transition-colors">
            <Trash2 className="h-4 w-4" />Hapus
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Tab ─────────────────────────────────────────────────────────────────

interface Props {
  initialMessages: ContactMessage[];
}

export function PesanMasukTab({ initialMessages }: Props) {
  const supabase = createClient();
  const [messages, setMessages]   = useState<ContactMessage[]>(initialMessages);
  const [search, setSearch]       = useState("");
  const [filterRead, setFilterRead] = useState<"all" | "unread" | "read">("all");
  const [filterTopic, setFilterTopic] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState<ContactMessage | null>(null);
  const [toast, setToast]         = useState<{ msg: string; type: "ok"|"err" } | null>(null);
  const [, startTransition]       = useTransition();

  const showToast = (msg: string, type: "ok"|"err" = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Filtered messages
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return messages.filter(m => {
      const matchSearch = !q || m.full_name.toLowerCase().includes(q) || m.contact.toLowerCase().includes(q) || m.message.toLowerCase().includes(q);
      const matchRead   = filterRead === "all" || (filterRead === "unread" ? !m.is_read : m.is_read);
      const matchTopic  = filterTopic === "all" || m.topic === filterTopic;
      return matchSearch && matchRead && matchTopic;
    }).sort((a, b) => {
      // Unread first, then by date
      if (a.is_read !== b.is_read) return a.is_read ? 1 : -1;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [messages, search, filterRead, filterTopic]);

  const unreadCount = messages.filter(m => !m.is_read).length;

  const handleMarkRead = async (id: string, isRead: boolean) => {
    // Optimistic update
    setMessages(prev => prev.map(m =>
      m.id === id ? { ...m, is_read: isRead, read_at: isRead ? new Date().toISOString() : null } : m
    ));
    const { error } = await supabase
      .from("contact_messages")
      .update({ is_read: isRead, read_at: isRead ? new Date().toISOString() : null })
      .eq("id", id);
    if (error) {
      // Revert
      setMessages(prev => prev.map(m => m.id === id ? { ...m, is_read: !isRead } : m));
      showToast("Gagal update status", "err");
    }
  };

  const handleMarkAllRead = () => {
    startTransition(async () => {
      const unreadIds = messages.filter(m => !m.is_read).map(m => m.id);
      if (!unreadIds.length) return;
      setMessages(prev => prev.map(m => ({ ...m, is_read: true, read_at: new Date().toISOString() })));
      await supabase
        .from("contact_messages")
        .update({ is_read: true, read_at: new Date().toISOString() })
        .in("id", unreadIds);
      showToast(`${unreadIds.length} pesan ditandai sudah dibaca`);
    });
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const { error } = await supabase.from("contact_messages").delete().eq("id", deleteTarget.id);
    if (!error) {
      setMessages(prev => prev.filter(m => m.id !== deleteTarget.id));
      showToast("Pesan dihapus");
    } else {
      showToast("Gagal menghapus", "err");
    }
    setDeleteTarget(null);
  };

  return (
    <>
      {toast && (
        <div className={`fixed right-4 top-4 z-[60] flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-xl ${toast.type === "ok" ? "bg-emerald-600" : "bg-red-600"}`}>
          {toast.type === "ok" ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
          {toast.msg}
        </div>
      )}

      {deleteTarget && (
        <DeleteModal
          name={deleteTarget.full_name}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <div className="space-y-6">
        {/* Title */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-black text-slate-900">
              Pesan Masuk
              {unreadCount > 0 && (
                <span className="ml-2 rounded-full bg-blue-600 px-2.5 py-0.5 text-sm font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Pesan dari form kontak halaman publik
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              Tandai semua dibaca
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Total Pesan",      value: messages.length,                           onClick: () => setFilterRead("all") },
            { label: "Belum Dibaca",     value: messages.filter(m => !m.is_read).length,   onClick: () => setFilterRead("unread") },
            { label: "Sudah Dibaca",     value: messages.filter(m => m.is_read).length,    onClick: () => setFilterRead("read") },
          ].map(s => (
            <button key={s.label} onClick={s.onClick}
              className="rounded-2xl border-2 border-transparent bg-white p-4 text-left shadow-sm transition-all hover:border-blue-200 hover:shadow-md">
              <p className="text-2xl font-black text-slate-900">{s.value}</p>
              <p className="text-xs font-medium text-slate-500">{s.label}</p>
            </button>
          ))}
        </div>

        {/* Filter bar */}
        <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Cari nama, kontak, atau isi pesan..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-9 text-sm placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors"
            />
            {search && (
              <button onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Filter pills */}
          <div className="flex flex-wrap items-center gap-2">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            {[
              { key: "all" as const,    label: "Semua" },
              { key: "unread" as const, label: `Belum Dibaca (${messages.filter(m=>!m.is_read).length})` },
              { key: "read" as const,   label: "Sudah Dibaca" },
            ].map(f => (
              <button key={f.key} onClick={() => setFilterRead(f.key)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                  filterRead === f.key ? "bg-blue-700 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}>
                {f.label}
              </button>
            ))}

            <div className="ml-auto flex flex-wrap gap-2">
              {Object.entries(TOPIC_META).map(([key, meta]) => {
                const count = messages.filter(m => m.topic === key).length;
                if (!count) return null;
                return (
                  <button key={key} onClick={() => setFilterTopic(filterTopic === key ? "all" : key)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                      filterTopic === key ? "bg-blue-700 text-white" : `${meta.color} hover:opacity-80`
                    }`}>
                    {meta.label} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Messages list */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-16 text-center">
            <Mail className="mb-3 h-10 w-10 text-slate-300" />
            <p className="text-sm font-semibold text-slate-600">
              {messages.length === 0 ? "Belum ada pesan masuk" : "Tidak ada pesan yang cocok"}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              {messages.length === 0
                ? "Pesan dari form kontak halaman publik akan muncul di sini"
                : "Coba ubah filter atau kata kunci pencarian"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-slate-400">
              Menampilkan <span className="font-semibold text-slate-600">{filtered.length}</span> pesan
              {filtered.length !== messages.length && ` dari ${messages.length}`}
              {" "}• Belum dibaca ditampilkan paling atas
            </p>
            {filtered.map(msg => (
              <MessageCard
                key={msg.id}
                msg={msg}
                onMarkRead={handleMarkRead}
                onDelete={() => setDeleteTarget(msg)}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}