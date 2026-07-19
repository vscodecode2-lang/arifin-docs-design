/**
 * AnalyticsService — helper murni (pure functions) untuk mengolah data
 * mentah `page_views` menjadi statistik siap-tampil di AnalyticsTab.
 * Dipisah dari komponen React supaya mudah ditest, sama seperti pola di
 * dashboard.service.ts.
 */

/**
 * Helper non-komponen untuk menghitung batas waktu "30 hari terakhir" —
 * dipisah dari page.tsx karena lint rule `react-hooks/purity` melarang
 * pemanggilan fungsi impure (Date.now()) langsung di body Server Component.
 * Pola yang sama seperti src/lib/purge-throttle.ts.
 */
export function getThirtyDaysAgoIso(): string {
  return new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
}

export interface PageViewRow {
  path: string;
  visitor_id: string;
  created_at: string;
}

export interface DailyPoint {
  /** YYYY-MM-DD (zona waktu Asia/Jakarta) */
  date: string;
  /** Label pendek untuk sumbu grafik, mis. "Sen", "12 Jul" */
  label: string;
  views: number;
  visitors: number;
}

export interface TopPage {
  path: string;
  views: number;
}

export interface AnalyticsStats {
  totalViews30d: number;
  uniqueVisitors30d: number;
  totalViewsToday: number;
  uniqueVisitorsToday: number;
  dailyTrend: DailyPoint[];
  topPages: TopPage[];
}

/** Format tanggal (created_at ISO) → "YYYY-MM-DD" di zona Asia/Jakarta */
function toJakartaDateKey(iso: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric", month: "2-digit", day: "2-digit",
  }).format(new Date(iso)); // "en-CA" -> format YYYY-MM-DD
}

function toShortLabel(dateKey: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta", day: "numeric", month: "short",
  }).format(new Date(`${dateKey}T00:00:00+07:00`));
}

/**
 * Mengubah baris mentah `page_views` (idealnya sudah difilter created_at
 * >= 30 hari terakhir dari query Supabase) menjadi statistik dashboard.
 */
export function computeAnalyticsStats(rows: PageViewRow[]): AnalyticsStats {
  const todayKey = toJakartaDateKey(new Date().toISOString());

  const uniqueVisitors30d = new Set<string>();
  const uniqueVisitorsTodaySet = new Set<string>();
  let totalViewsToday = 0;

  const pathCounts = new Map<string, number>();
  const dayBuckets = new Map<string, { views: number; visitors: Set<string> }>();

  for (const row of rows) {
    uniqueVisitors30d.add(row.visitor_id);
    pathCounts.set(row.path, (pathCounts.get(row.path) ?? 0) + 1);

    const dayKey = toJakartaDateKey(row.created_at);
    if (dayKey === todayKey) {
      totalViewsToday += 1;
      uniqueVisitorsTodaySet.add(row.visitor_id);
    }

    const bucket = dayBuckets.get(dayKey) ?? { views: 0, visitors: new Set<string>() };
    bucket.views += 1;
    bucket.visitors.add(row.visitor_id);
    dayBuckets.set(dayKey, bucket);
  }

  // 7 hari terakhir (termasuk hari ini), urut kronologis, isi 0 kalau tidak ada data
  const dailyTrend: DailyPoint[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dayKey = toJakartaDateKey(d.toISOString());
    const bucket = dayBuckets.get(dayKey);
    dailyTrend.push({
      date: dayKey,
      label: toShortLabel(dayKey),
      views: bucket?.views ?? 0,
      visitors: bucket?.visitors.size ?? 0,
    });
  }

  const topPages: TopPage[] = Array.from(pathCounts.entries())
    .map(([path, views]) => ({ path, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  return {
    totalViews30d: rows.length,
    uniqueVisitors30d: uniqueVisitors30d.size,
    totalViewsToday,
    uniqueVisitorsToday: uniqueVisitorsTodaySet.size,
    dailyTrend,
    topPages,
  };
}
