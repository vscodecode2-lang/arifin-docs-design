"use server";

import { createServerSupabaseClient } from "@/lib/supabase-server";
import { requireAdminUser } from "@/lib/auth-admin";
import { revalidatePath } from "next/cache";
import type { VerifyResult, TestimoniActionResult } from "@/types/testimoni";

// ─── Verifikasi Klien ─────────────────────────────────────────────────────────

export async function verifyClient(
  identifier: string  // email atau nomor WA
): Promise<VerifyResult> {
  try {
    const supabase = await createServerSupabaseClient();
    const cleaned  = identifier.trim().toLowerCase();

    // Validasi format ketat SEBELUM masuk ke string filter `.or()`.
    // Root cause (AUDIT CRITICAL-2): `cleaned` sebelumnya diinterpolasi
    // langsung ke filter PostgREST tanpa validasi, sehingga karakter
    // seperti koma/kurung bisa mengubah logika filter (query injection).
    // Hanya format email atau nomor WA yang valid yang boleh lanjut,
    // sehingga karakter berbahaya (`,`, `(`, `)`, `"`) tidak pernah
    // mencapai query.
    const isEmail = /^[^\s@,()]+@[^\s@,()]+\.[^\s@,()]+$/.test(cleaned);
    const isPhone = /^(\+62|62|0)?[0-9]{8,15}$/.test(cleaned);

    if (!isEmail && !isPhone) {
      return { found: false, error: "Email atau nomor WA tidak ditemukan. Pastikan menggunakan data yang sama saat mengisi form layanan." };
    }

    // Cari berdasarkan email atau nomor WA
    const { data: clients, error } = await supabase
      .from("clients")
      .select("id, full_name, email, phone_number, service_type")
      .or(`email.eq.${cleaned},phone_number.eq.${cleaned},phone_number.eq.0${cleaned.replace(/^(\+62|62)/, "")}`)
      .is("deleted_at", null);

    if (error) return { found: false, error: "Gagal memverifikasi. Coba lagi." };
    if (!clients || clients.length === 0)
      return { found: false, error: "Email atau nomor WA tidak ditemukan. Pastikan menggunakan data yang sama saat mengisi form layanan." };

    // Kumpulkan semua layanan unik yang pernah digunakan
    const services = [...new Set(clients.map(c => c.service_type))];
    const latest   = clients[0];

    // Cek layanan mana yang sudah ada testimoni approved/pending
    const { data: existingTestimonials } = await supabase
      .from("testimonials")
      .select("service_type")
      .eq("client_id", latest.id)
      .in("status", ["approved", "pending"]);

    const reviewedServices = new Set((existingTestimonials ?? []).map(t => t.service_type));
    const availableServices = services.filter(s => !reviewedServices.has(s));

    if (availableServices.length === 0)
      return {
        found: false,
        error: "Anda sudah mengirim testimoni untuk semua layanan yang pernah digunakan. Terima kasih!",
      };

    return {
      found:       true,
      client_id:   latest.id,
      client_name: latest.full_name,
      services:    availableServices,
    };
  } catch {
    return { found: false, error: "Terjadi kesalahan server." };
  }
}

// ─── Submit Testimoni ─────────────────────────────────────────────────────────

export async function submitTestimoni(formData: FormData): Promise<TestimoniActionResult> {
  try {
    const supabase = await createServerSupabaseClient();

    const client_id    = formData.get("client_id")    as string;
    const client_name  = formData.get("client_name")  as string;
    const service_type = formData.get("service_type") as string;
    const highlight    = formData.get("highlight")    as string;
    const suggestion   = formData.get("suggestion")   as string | null;
    const photo_type   = formData.get("photo_type")   as string;
    const photo_data   = formData.get("photo_data")   as string | null;
    const ratingsJson  = formData.get("ratings")      as string;

    // Validasi server-side
    if (!client_id || !client_name || !service_type)
      return { success: false, error: "Data tidak lengkap." };
    if (!highlight?.trim() || highlight.trim().length < 20)
      return { success: false, error: "Teks testimoni minimal 20 karakter." };

    let ratings: Record<string, number>;
    try {
      ratings = JSON.parse(ratingsJson);
    } catch {
      return { success: false, error: "Data rating tidak valid." };
    }

    // Semua pertanyaan wajib dijawab
    const ratingValues = Object.values(ratings);
    if (ratingValues.length === 0 || ratingValues.some(v => v < 1 || v > 5))
      return { success: false, error: "Semua pertanyaan wajib dinilai." };

    const avg_rating = ratingValues.reduce((a, b) => a + b, 0) / ratingValues.length;

    // Cek duplikat
    const { data: existing } = await supabase
      .from("testimonials")
      .select("id")
      .eq("client_id", client_id)
      .eq("service_type", service_type)
      .in("status", ["approved", "pending"])
      .single();

    if (existing) return { success: false, duplicate: true, error: "Anda sudah mengirim testimoni untuk layanan ini." };

    // Sanitasi XSS
    const s = (str?: string | null) => str?.replace(/[<>]/g, "").trim() ?? null;

    // Validasi ukuran photo_data (max ~300KB base64)
    if (photo_data && photo_data.length > 400_000)
      return { success: false, error: "Ukuran foto terlalu besar. Maksimal 300KB." };

    const { error: insertError } = await supabase.from("testimonials").insert({
      client_id,
      client_name:  s(client_name)!,
      service_type,
      ratings,
      avg_rating:   parseFloat(avg_rating.toFixed(2)),
      highlight:    s(highlight)!,
      suggestion:   s(suggestion) || null,
      photo_type,
      photo_data:   photo_type === "upload" ? photo_data : null,
      status:       "pending",
    });

    if (insertError) {
      if (insertError.code === "23505")
        return { success: false, duplicate: true, error: "Anda sudah mengirim testimoni untuk layanan ini." };
      return { success: false, error: "Gagal menyimpan testimoni. Coba lagi." };
    }

    revalidatePath("/testimoni");
    return { success: true };
  } catch {
    return { success: false, error: "Terjadi kesalahan server." };
  }
}

// ─── Approve Testimoni ────────────────────────────────────────────────────────

export async function approveTestimoni(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createServerSupabaseClient();
    const admin = await requireAdminUser(supabase);
    if (!admin) return { success: false, error: "Unauthorized" };

    const { error } = await supabase
      .from("testimonials")
      .update({ status: "approved", approved_at: new Date().toISOString(), reject_reason: null })
      .eq("id", id);

    if (error) return { success: false, error: error.message };
    revalidatePath("/testimoni");
    revalidatePath("/dashboard");
    return { success: true };
  } catch {
    return { success: false, error: "Kesalahan server." };
  }
}

// ─── Reject Testimoni ─────────────────────────────────────────────────────────

export async function rejectTestimoni(
  id: string,
  reason: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createServerSupabaseClient();
    const admin = await requireAdminUser(supabase);
    if (!admin) return { success: false, error: "Unauthorized" };

    const { error } = await supabase
      .from("testimonials")
      .update({ status: "rejected", reject_reason: reason.trim() || "Tidak memenuhi kriteria" })
      .eq("id", id);

    if (error) return { success: false, error: error.message };
    revalidatePath("/testimoni");
    revalidatePath("/dashboard");
    return { success: true };
  } catch {
    return { success: false, error: "Kesalahan server." };
  }
}

// ─── Delete Testimoni ─────────────────────────────────────────────────────────

export async function deleteTestimoni(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createServerSupabaseClient();
    const admin = await requireAdminUser(supabase);
    if (!admin) return { success: false, error: "Unauthorized" };

    const { error } = await supabase.from("testimonials").delete().eq("id", id);
    if (error) return { success: false, error: error.message };
    revalidatePath("/testimoni");
    revalidatePath("/dashboard");
    return { success: true };
  } catch {
    return { success: false, error: "Kesalahan server." };
  }
}

// ─── Fetch untuk Dashboard ────────────────────────────────────────────────────

export async function fetchAllTestimonials(): Promise<{
  pending: unknown[];
  approved: unknown[];
  rejected: unknown[];
}> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase
      .from("testimonials")
      .select("*")
      .order("created_at", { ascending: false });

    const all = data ?? [];
    return {
      pending:  all.filter((t: { status: string }) => t.status === "pending"),
      approved: all.filter((t: { status: string }) => t.status === "approved"),
      rejected: all.filter((t: { status: string }) => t.status === "rejected"),
    };
  } catch {
    return { pending: [], approved: [], rejected: [] };
  }
}
