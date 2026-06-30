"use server";

import { createServerSupabaseClient } from "@/lib/supabase-server";
import { requireAdminUser } from "@/lib/auth-admin";
import { revalidatePath } from "next/cache";

export type ClientStatus = "pending" | "in_progress" | "completed";

// ─── Update Status ────────────────────────────────────────────────────────────

export async function updateClientStatus(
  clientId: string,
  newStatus: ClientStatus
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createServerSupabaseClient();
    const admin = await requireAdminUser(supabase);
    if (!admin) return { success: false, error: "Unauthorized" };

    const { error } = await supabase
      .from("clients")
      .update({ status: newStatus })
      .eq("id", clientId)
      .is("deleted_at", null); // jangan update yang sudah di trash

    if (error) return { success: false, error: error.message };
    revalidatePath("/dashboard");
    return { success: true };
  } catch {
    return { success: false, error: "Terjadi kesalahan server" };
  }
}

// ─── Soft Delete (Pindah ke Sampah) ──────────────────────────────────────────

export async function softDeleteClient(
  clientId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createServerSupabaseClient();
    const admin = await requireAdminUser(supabase);
    if (!admin) return { success: false, error: "Unauthorized" };

    const { error } = await supabase
      .from("clients")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", clientId);

    if (error) return { success: false, error: error.message };
    revalidatePath("/dashboard");
    return { success: true };
  } catch {
    return { success: false, error: "Terjadi kesalahan server" };
  }
}

// ─── Restore dari Sampah ──────────────────────────────────────────────────────

export async function restoreClient(
  clientId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createServerSupabaseClient();
    const admin = await requireAdminUser(supabase);
    if (!admin) return { success: false, error: "Unauthorized" };

    const { error } = await supabase
      .from("clients")
      .update({ deleted_at: null })
      .eq("id", clientId);

    if (error) return { success: false, error: error.message };
    revalidatePath("/dashboard");
    return { success: true };
  } catch {
    return { success: false, error: "Terjadi kesalahan server" };
  }
}

// ─── Hapus Permanen ───────────────────────────────────────────────────────────

export async function permanentDeleteClient(
  clientId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createServerSupabaseClient();
    const admin = await requireAdminUser(supabase);
    if (!admin) return { success: false, error: "Unauthorized" };

    // Hanya boleh hapus permanen jika sudah di trash
    const { error } = await supabase
      .from("clients")
      .delete()
      .eq("id", clientId)
      .not("deleted_at", "is", null); // safety: pastikan sudah di trash

    if (error) return { success: false, error: error.message };
    revalidatePath("/dashboard");
    return { success: true };
  } catch {
    return { success: false, error: "Terjadi kesalahan server" };
  }
}

// ─── Kosongkan Semua Sampah ───────────────────────────────────────────────────

export async function emptyTrash(): Promise<{ success: boolean; error?: string; count?: number }> {
  try {
    const supabase = await createServerSupabaseClient();
    const admin = await requireAdminUser(supabase);
    if (!admin) return { success: false, error: "Unauthorized" };

    const { data, error } = await supabase
      .from("clients")
      .delete()
      .not("deleted_at", "is", null)
      .select("id");

    if (error) return { success: false, error: error.message };
    revalidatePath("/dashboard");
    return { success: true, count: data?.length ?? 0 };
  } catch {
    return { success: false, error: "Terjadi kesalahan server" };
  }
}

// ─── Purge Manual (hapus item > 7 hari) ──────────────────────────────────────

export async function purgeExpiredTrash(): Promise<{ success: boolean; count?: number; error?: string }> {
  try {
    const supabase = await createServerSupabaseClient();
    const admin = await requireAdminUser(supabase);
    if (!admin) return { success: false, error: "Unauthorized" };

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const { data, error } = await supabase
      .from("clients")
      .delete()
      .not("deleted_at", "is", null)
      .lt("deleted_at", sevenDaysAgo)
      .select("id");

    if (error) return { success: false, error: error.message };
    return { success: true, count: data?.length ?? 0 };
  } catch {
    return { success: false, error: "Terjadi kesalahan server" };
  }
}

// ─── Get Client Detail ────────────────────────────────────────────────────────

export async function getClientDetail(
  clientId: string,
  serviceType: string
): Promise<{ success: boolean; data?: Record<string, unknown>; error?: string }> {
  try {
    const supabase = await createServerSupabaseClient();
    const admin = await requireAdminUser(supabase);
    if (!admin) return { success: false, error: "Unauthorized" };

    const tableMap: Record<string, string> = {
      CV:            "cv_submissions",
      Lamaran:       "lamaran_submissions",
      Legal:         "legal_submissions",
      NPWP:          "npwp_submissions",
      Akademik:      "akademik_submissions",
      "Data Entry":  "data_entry_submissions",
      "Paket Hemat": "paket_hemat_submissions",
    };

    const table = tableMap[serviceType];
    if (!table) return { success: false, error: "Tabel tidak ditemukan" };

    const { data, error } = await supabase
      .from(table)
      .select("*")
      .eq("client_id", clientId)
      .single();

    if (error) {
      if (error.code === "42P01")
        return { success: false, error: `Tabel ${table} belum dibuat. Jalankan SQL migration.` };
      return { success: false, error: error.message };
    }

    return { success: true, data: data as Record<string, unknown> };
  } catch {
    return { success: false, error: "Terjadi kesalahan server" };
  }
}