import { createServerSupabaseClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { DashboardClient, type ClientRow } from "./DashboardClient";
import { purgeExpiredTrash } from "@/app/actions/dashboardactions";
import { shouldRunPurge } from "@/lib/purge-throttle";
import type { Testimoni } from "@/types/testimoni";
import type { ContactMessage } from "./tabs/ContactTab";
import { logger } from "@/lib/logger";
import { computeAnalyticsStats, getThirtyDaysAgoIso, type PageViewRow } from "./services/analytics.service";

export const metadata: Metadata = { title: "Admin Dashboard" };
export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const supabase = await createServerSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Auto-purge trash > 7 hari (throttled, lihat src/lib/purge-throttle.ts)
  if (shouldRunPurge()) {
    purgeExpiredTrash().catch((err) => logger.error("Gagal purge expired trash", err));
  }

  // Parallel fetch semua data
  const thirtyDaysAgoIso = getThirtyDaysAgoIso();
  const [
    { data: activeClients },
    { data: trashedClients },
    { data: allTestimonials },
    { data: contactMessages },
    { data: pageViews },
  ] = await Promise.all([
    supabase
      .from("clients")
      .select("id, created_at, full_name, email, phone_number, service_type, status, order_code, deleted_at")
      .is("deleted_at", null)
      .order("created_at", { ascending: false }),

    supabase
      .from("clients")
      .select("id, created_at, full_name, email, phone_number, service_type, status, order_code, deleted_at")
      .not("deleted_at", "is", null)
      .order("deleted_at", { ascending: false }),

    supabase
      .from("testimonials")
      .select("*")
      .order("created_at", { ascending: false }),

    supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false }),

    // 30 hari terakhir saja — cukup untuk statistik AnalyticsTab dan jauh
    // lebih ringan daripada menarik seluruh riwayat page_views.
    supabase
      .from("page_views")
      .select("path, visitor_id, created_at")
      .gte("created_at", thirtyDaysAgoIso),
  ]);

  const testimonials  = (allTestimonials ?? []) as Testimoni[];
  const messages      = (contactMessages ?? []) as ContactMessage[];
  const analyticsStats = computeAnalyticsStats((pageViews ?? []) as PageViewRow[]);

  return (
    <DashboardClient
      clients={(activeClients ?? []) as ClientRow[]}
      trashedClients={(trashedClients ?? []) as ClientRow[]}
      adminEmail={user.email ?? ""}
      pendingTestimonials={testimonials.filter(t => t.status === "pending")}
      approvedTestimonials={testimonials.filter(t => t.status === "approved")}
      rejectedTestimonials={testimonials.filter(t => t.status === "rejected")}
      contactMessages={messages}
      analyticsStats={analyticsStats}
    />
  );
}