"use server";

import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export interface KontakActionResult {
  success: boolean;
  error?: string;
  rateLimited?: boolean;
}

const KontakSchema = z.object({
  full_name: z.string().min(3, "Nama minimal 3 karakter").max(100),
  contact:   z.string().min(5, "Email atau nomor WA wajib diisi").max(100),
  topic:     z.enum(["layanan","keluhan","kerjasama","lainnya"], {
    error: "Pilih topik pesan",
  }),
  message:   z.string().min(20, "Pesan minimal 20 karakter").max(2000),
});

export async function submitKontakAction(
  formData: FormData
): Promise<KontakActionResult> {
  const rawData = {
    full_name: formData.get("full_name") ?? undefined,
    contact:   formData.get("contact")   ?? undefined,
    topic:     formData.get("topic")     ?? undefined,
    message:   formData.get("message")   ?? undefined,
  };

  // Validasi Zod
  const parsed = KontakSchema.safeParse(rawData);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return { success: false, error: first?.message ?? "Validasi gagal." };
  }

  const d = parsed.data;
  const s = (v: string) => v.replace(/[<>]/g, "").trim();

  try {
    const supabase = await createServerSupabaseClient();

    // Rate limiting: cek apakah contact yang sama sudah kirim dalam 1 jam terakhir
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { data: recent } = await supabase
      .from("contact_messages")
      .select("id")
      .eq("contact", d.contact.trim())
      .gte("created_at", oneHourAgo)
      .limit(1);

    if (recent && recent.length > 0) {
      return {
        success: false,
        rateLimited: true,
        error: "Anda sudah mengirim pesan dalam 1 jam terakhir. Silakan tunggu sebelum mengirim lagi, atau hubungi kami langsung via WhatsApp.",
      };
    }

    // Insert pesan
    const { error } = await supabase.from("contact_messages").insert({
      full_name: s(d.full_name),
      contact:   s(d.contact),
      topic:     d.topic,
      message:   s(d.message),
      is_read:   false,
    });

    if (error) return { success: false, error: "Gagal mengirim pesan. Coba lagi." };
    return { success: true };
  } catch {
    return { success: false, error: "Terjadi kesalahan server." };
  }
}