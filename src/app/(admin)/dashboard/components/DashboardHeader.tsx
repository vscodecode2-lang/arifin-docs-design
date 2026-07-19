import Image from "next/image";
import {
  Users, Trash2, Star, Inbox, LogOut, RefreshCw, Loader2, BarChart3,
} from "lucide-react";

type TabKey = "clients" | "trash" | "testimoni" | "pesan" | "analytics";

export function DashboardHeader({
  adminEmail, activeTab, onTabChange, onRefresh, onLogout, isLoggingOut,
  clientCount, trashCount, pendingTestimoniCount, unreadMessageCount,
}: {
  adminEmail: string;
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  onRefresh: () => void;
  onLogout: () => void;
  isLoggingOut: boolean;
  clientCount: number;
  trashCount: number;
  pendingTestimoniCount: number;
  unreadMessageCount: number;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-lg">
            <Image src="/logo.avif" alt="Arifin Docs & Design" fill sizes="32px" className="object-cover" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">Admin Dashboard</p>
            <p className="hidden text-xs text-slate-500 sm:block">{adminEmail}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onRefresh}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
            <RefreshCw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button onClick={onLogout} disabled={isLoggingOut}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-60 transition-colors">
            {isLoggingOut ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <LogOut className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex gap-1 border-t border-slate-100">
          <button
            onClick={() => onTabChange("clients")}
            className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors ${
              activeTab === "clients"
                ? "border-blue-600 text-blue-700"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            <Users className="h-4 w-4" />
            Klien Aktif
            <span className={`rounded-full px-1.5 py-0.5 text-xs font-bold ${
              activeTab === "clients" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"
            }`}>
              {clientCount}
            </span>
          </button>
          <button
            onClick={() => onTabChange("trash")}
            className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors ${
              activeTab === "trash"
                ? "border-red-500 text-red-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            <Trash2 className="h-4 w-4" />
            Sampah
            {trashCount > 0 && (
              <span className={`rounded-full px-1.5 py-0.5 text-xs font-bold ${
                activeTab === "trash" ? "bg-red-100 text-red-600" : "bg-slate-100 text-slate-600"
              }`}>
                {trashCount}
              </span>
            )}
          </button>
          <button
            onClick={() => onTabChange("testimoni")}
            className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors ${
              activeTab === "testimoni"
                ? "border-amber-500 text-amber-700"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            <Star className="h-4 w-4" />
            Testimoni
            {pendingTestimoniCount > 0 && (
              <span className="rounded-full px-1.5 py-0.5 text-xs font-bold bg-amber-100 text-amber-700">
                {pendingTestimoniCount}
              </span>
            )}
          </button>
          <button
            onClick={() => onTabChange("pesan")}
            className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors ${
              activeTab === "pesan"
                ? "border-blue-500 text-blue-700"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            <Inbox className="h-4 w-4" />
            Pesan Masuk
            {unreadMessageCount > 0 && (
              <span className="rounded-full bg-blue-600 px-1.5 py-0.5 text-xs font-bold text-white">
                {unreadMessageCount}
              </span>
            )}
          </button>
          <button
            onClick={() => onTabChange("analytics")}
            className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors ${
              activeTab === "analytics"
                ? "border-violet-500 text-violet-700"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            Analisis Pengunjung
          </button>
        </div>
      </div>
    </header>
  );
}
