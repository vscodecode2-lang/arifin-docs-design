"use client";

import { Eye, Users, TrendingUp, FileBarChart } from "lucide-react";
import type { AnalyticsStats } from "../services/analytics.service";

export function AnalyticsTab({ stats }: { stats: AnalyticsStats }) {
  const maxViews = Math.max(1, ...stats.dailyTrend.map((d) => d.views));
  const maxPageViews = Math.max(1, ...stats.topPages.map((p) => p.views));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Analisis Pengunjung</h1>
        <p className="mt-1 text-sm text-slate-500">
          Statistik kunjungan halaman publik — dihitung dari id anonim, tanpa data pribadi.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {([
          { label: "Kunjungan Hari Ini", value: stats.totalViewsToday, icon: <Eye className="h-5 w-5" />, color: "bg-blue-100 text-blue-700" },
          { label: "Pengunjung Hari Ini", value: stats.uniqueVisitorsToday, icon: <Users className="h-5 w-5" />, color: "bg-emerald-100 text-emerald-700" },
          { label: "Total Kunjungan (30 Hari)", value: stats.totalViews30d, icon: <TrendingUp className="h-5 w-5" />, color: "bg-violet-100 text-violet-700" },
          { label: "Pengunjung Unik (30 Hari)", value: stats.uniqueVisitors30d, icon: <FileBarChart className="h-5 w-5" />, color: "bg-amber-100 text-amber-700" },
        ] as const).map((s) => (
          <div key={s.label} className="flex items-center gap-3 rounded-2xl border-2 border-transparent bg-white p-4 shadow-sm">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${s.color}`}>
              {s.icon}
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">{s.value.toLocaleString("id-ID")}</p>
              <p className="text-xs font-medium text-slate-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Trend 7 hari */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-bold text-slate-900">Tren 7 Hari Terakhir</p>
        <p className="mt-0.5 text-xs text-slate-500">Jumlah kunjungan halaman per hari</p>

        <div className="mt-6 flex items-end justify-between gap-2 sm:gap-4" style={{ height: 160 }}>
          {stats.dailyTrend.map((d) => {
            const heightPct = Math.max(4, Math.round((d.views / maxViews) * 100));
            return (
              <div key={d.date} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                <p className="text-xs font-bold text-slate-700">{d.views}</p>
                <div
                  className="w-full max-w-10 rounded-t-md bg-gradient-to-t from-blue-600 to-blue-400 transition-all"
                  style={{ height: `${heightPct}%` }}
                  title={`${d.views} kunjungan, ${d.visitors} pengunjung unik`}
                />
                <p className="text-[11px] font-medium text-slate-500">{d.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Halaman terpopuler */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-bold text-slate-900">Halaman Terpopuler</p>
        <p className="mt-0.5 text-xs text-slate-500">30 hari terakhir, berdasarkan jumlah kunjungan</p>

        {stats.topPages.length === 0 ? (
          <p className="mt-6 text-center text-sm text-slate-400">Belum ada data kunjungan.</p>
        ) : (
          <div className="mt-5 space-y-3">
            {stats.topPages.map((p) => (
              <div key={p.path} className="flex items-center gap-3">
                <p className="w-32 shrink-0 truncate text-xs font-semibold text-slate-700 sm:w-56" title={p.path}>
                  {p.path === "/" ? "Beranda" : p.path}
                </p>
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-blue-500"
                    style={{ width: `${Math.max(4, Math.round((p.views / maxPageViews) * 100))}%` }}
                  />
                </div>
                <p className="w-10 shrink-0 text-right text-xs font-bold text-slate-600">{p.views}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
