import type { SupabaseClient } from "@supabase/supabase-js";

export interface DashboardStats {
  total: number;
  pending: number;
  in_progress: number;
  completed: number;
}

export const DEFAULT_DASHBOARD_STATS: DashboardStats = {
  total: 0,
  pending: 0,
  in_progress: 0,
  completed: 0,
};

type DashboardStatsRow = {
  total: number | string | null;
  pending: number | string | null;
  in_progress: number | string | null;
  completed: number | string | null;
};

function toNumber(value: number | string | null | undefined): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number(value) || 0;
  return 0;
}

export async function fetchDashboardStats(
  supabase: SupabaseClient
): Promise<DashboardStats | null> {
  const { data, error } = await supabase.rpc("get_dashboard_stats");

  if (error || !data) {
    return null;
  }

  const row = (Array.isArray(data) ? data[0] : data) as DashboardStatsRow | undefined;

  return {
    total: toNumber(row?.total),
    pending: toNumber(row?.pending),
    in_progress: toNumber(row?.in_progress),
    completed: toNumber(row?.completed),
  };
}

export async function fetchDashboardStatsDirect(
  supabase: SupabaseClient
): Promise<DashboardStats> {
  try {
    const [total, pending, inProgress, completed] = await Promise.all([
      supabase.from("clients").select("id", { count: "exact" }).is("deleted_at", null),
      supabase
        .from("clients")
        .select("id", { count: "exact" })
        .is("deleted_at", null)
        .eq("status", "pending"),
      supabase
        .from("clients")
        .select("id", { count: "exact" })
        .is("deleted_at", null)
        .eq("status", "in_progress"),
      supabase
        .from("clients")
        .select("id", { count: "exact" })
        .is("deleted_at", null)
        .eq("status", "completed"),
    ]);

    return {
      total: total.count ?? 0,
      pending: pending.count ?? 0,
      in_progress: inProgress.count ?? 0,
      completed: completed.count ?? 0,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats directly:", error);
    return DEFAULT_DASHBOARD_STATS;
  }
}