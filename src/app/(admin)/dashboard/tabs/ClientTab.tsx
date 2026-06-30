import {
  Users, Clock, Loader2, CheckCircle2, Search, Trash2,
  Eye, MessageCircle, X,
} from "lucide-react";
import type { ClientStatus } from "@/app/actions/dashboardactions";
import type { ClientRow } from "../DashboardClient";
import { SERVICE_META, STATUS_META, ALL_STATUSES, ALL_SERVICES } from "../constants";
import { formatDate, formatWA, buildWALink } from "../services/dashboard.service";
import { StatusDropdown } from "../components/StatusDropdown";

interface Stats {
  total: number; pending: number; in_progress: number; completed: number;
}

export function ClientTab({
  clients, filtered, stats, serviceCounts, hasActiveFilter,
  search, onSearchChange,
  filterService, onFilterServiceChange,
  filterStatus, onFilterStatusChange,
  onResetFilters,
  onStatusUpdate, onComplete,
  onViewDetail, onSoftDelete,
}: {
  clients: ClientRow[];
  filtered: ClientRow[];
  stats: Stats;
  serviceCounts: Record<string, number>;
  hasActiveFilter: boolean;
  search: string;
  onSearchChange: (v: string) => void;
  filterService: string;
  onFilterServiceChange: (v: string) => void;
  filterStatus: string;
  onFilterStatusChange: (v: string) => void;
  onResetFilters: () => void;
  onStatusUpdate: (id: string, s: ClientStatus) => void;
  onComplete: (id: string) => void;
  onViewDetail: (client: ClientRow) => void;
  onSoftDelete: (id: string) => void;
}) {
  return (
    <>
      <div>
        <h1 className="text-2xl font-black text-slate-900">Rekap Klien Masuk</h1>
        <p className="mt-1 text-sm text-slate-500">Kelola status, lihat detail, dan hubungi klien</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {([
          { label: "Total Klien",  value: stats.total,       icon: <Users className="h-5 w-5" />,        color: "bg-blue-100 text-blue-700",       filter: "all" },
          { label: "Menunggu",     value: stats.pending,     icon: <Clock className="h-5 w-5" />,        color: "bg-amber-100 text-amber-700",     filter: "pending" },
          { label: "Dikerjakan",   value: stats.in_progress, icon: <Loader2 className="h-5 w-5" />,      color: "bg-blue-100 text-blue-600",       filter: "in_progress" },
          { label: "Selesai",      value: stats.completed,   icon: <CheckCircle2 className="h-5 w-5" />, color: "bg-emerald-100 text-emerald-700", filter: "completed" },
        ] as const).map(s => (
          <button key={s.label}
            onClick={() => onFilterStatusChange(filterStatus === s.filter ? "all" : s.filter)}
            className={`flex items-center gap-3 rounded-2xl border-2 bg-white p-4 text-left shadow-sm transition-all hover:shadow-md ${
              filterStatus === s.filter ? "border-blue-500 ring-2 ring-blue-200" : "border-transparent hover:border-slate-200"
            }`}>
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${s.color}`}>
              {s.icon}
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">{s.value}</p>
              <p className="text-xs font-medium text-slate-500">{s.label}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Filter */}
      <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input type="text" value={search} onChange={e => onSearchChange(e.target.value)}
            placeholder="Cari nama, email, atau nomor WA..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-9 text-sm placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors" />
          {search && (
            <button onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <button onClick={() => onFilterServiceChange("all")}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
              filterService === "all" ? "bg-blue-700 text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}>
            Semua ({clients.length})
          </button>
          {ALL_SERVICES.map(svc => {
            const meta    = SERVICE_META[svc];
            const count   = serviceCounts[svc];
            const isActive = filterService === svc;
            return (
              <button key={svc} onClick={() => onFilterServiceChange(isActive ? "all" : svc)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                  isActive ? "bg-blue-700 text-white shadow-sm" : `${meta.color} hover:opacity-80`
                }`}>
                {meta.icon}{meta.label}
                <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${isActive ? "bg-white/20" : "bg-white/60"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400">Status:</span>
          <button onClick={() => onFilterStatusChange("all")}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
              filterStatus === "all" ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}>Semua</button>
          {ALL_STATUSES.map(st => {
            const m = STATUS_META[st];
            const isActive = filterStatus === st;
            return (
              <button key={st} onClick={() => onFilterStatusChange(isActive ? "all" : st)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                  isActive ? "bg-slate-800 text-white" : `${m.badge} hover:opacity-80`
                }`}>
                <span className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-white" : m.dot}`} />
                {m.label}
              </button>
            );
          })}
          {hasActiveFilter && (
            <button onClick={onResetFilters}
              className="flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold text-slate-400 hover:text-red-500 transition-colors">
              <X className="h-3 w-3" />Reset
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5">
          <h2 className="text-sm font-bold text-slate-900">
            Daftar Klien
            <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-700">
              {filtered.length}{filtered.length !== clients.length && ` / ${clients.length}`}
            </span>
          </h2>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
              <Users className="h-7 w-7 text-slate-400" />
            </div>
            <p className="text-sm font-semibold text-slate-600">
              {clients.length === 0 ? "Belum ada klien" : "Tidak ada hasil yang cocok"}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              {clients.length === 0 ? "Data akan muncul setelah ada yang mengisi form" : "Coba ubah filter atau pencarian"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80">
                  {["#", "Klien", "WhatsApp", "Layanan", "Status", "Waktu Masuk", "Aksi"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((client, i) => {
                  const svc = SERVICE_META[client.service_type];
                  return (
                    <tr key={client.id} className="group transition-colors hover:bg-blue-50/30">
                      <td className="px-4 py-4 text-xs font-medium text-slate-400">{filtered.length - i}</td>
                      <td className="px-4 py-4">
                        <p className="text-sm font-semibold text-slate-900">{client.full_name}</p>
                        <p className="mt-0.5 text-[11px] font-mono font-semibold text-blue-600">{client.order_code ?? "-"}</p>
                        <p className="text-xs text-slate-400">{client.email}</p>
                      </td>
                      <td className="px-4 py-4">
                        <a href={buildWALink(client.phone_number, client.full_name, client.service_type)}
                          target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors">
                          <MessageCircle className="h-3 w-3" />
                          {formatWA(client.phone_number)}
                        </a>
                      </td>
                      <td className="px-4 py-4">
                        {svc ? (
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${svc.color}`}>
                            {svc.icon}{svc.label}
                          </span>
                        ) : <span className="text-xs text-slate-400">{client.service_type}</span>}
                      </td>
                      <td className="px-4 py-4">
                        <StatusDropdown
                          clientId={client.id}
                          current={client.status}
                          onUpdate={onStatusUpdate}
                          onComplete={onComplete}
                        />
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-xs text-slate-500">
                        {formatDate(client.created_at)}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => onViewDetail(client)} title="Lihat detail"
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 transition-colors">
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                          <button onClick={() => onSoftDelete(client.id)} title="Pindahkan ke sampah"
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:border-red-300 hover:bg-red-50 hover:text-red-600 transition-colors">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        {filtered.length > 0 && (
          <div className="border-t border-slate-100 px-5 py-3">
            <p className="text-xs text-slate-400">
              {filtered.length} klien{filtered.length !== clients.length && ` dari ${clients.length}`} • Waktu dalam WIB
            </p>
          </div>
        )}
      </div>
    </>
  );
}
