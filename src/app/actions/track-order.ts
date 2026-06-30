"use server";

import { createServerSupabaseClient } from "@/lib/supabase-server";
import type { OrderStatus } from "@/lib/order-utils";

export interface OrderTrackResult {
  success: boolean;
  error?: string;
  data?: {
    order_code: string;
    full_name: string;
    service_type: string;
    status: OrderStatus;
    created_at: string;
    updated_at?: string;
    note?: string; // pesan dari admin, opsional
  };
}

/**
 * trackOrder — cari order berdasarkan kode unik.
 *
 * Query ke tabel `clients` karena kode order dan status
 * disimpan di sana (tabel master untuk semua layanan).
 *
 * Security:
 * - Hanya kolom non-sensitif yang di-select (tidak ada email/phone)
 * - Input di-sanitize dan di-validate format sebelum query
 */
export async function trackOrder(
  orderCode: string
): Promise<OrderTrackResult> {
  // Validasi format kode: ADC- diikuti 6 karakter alphanumeric
  const sanitized = orderCode.trim().toUpperCase();
  const isValidFormat = /^ADC-[A-Z0-9]{6}$/.test(sanitized);

  if (!sanitized) {
    return { success: false, error: "Kode order tidak boleh kosong." };
  }
  if (!isValidFormat) {
    return {
      success: false,
      error: 'Format kode tidak valid. Contoh yang benar: ADC-K7M2PQ',
    };
  }

  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("clients")
    .select(
      "order_code, full_name, service_type, status, created_at, updated_at, admin_note"
    )
    .eq("order_code", sanitized)
    .single();

  if (error || !data) {
    return {
      success: false,
      error:
        "Kode order tidak ditemukan. Pastikan kode yang kamu masukkan sudah benar.",
    };
  }

  return {
    success: true,
    data: {
      order_code: data.order_code,
      full_name: data.full_name,
      service_type: data.service_type,
      status: (data.status as OrderStatus) ?? "pending",
      created_at: data.created_at,
      updated_at: data.updated_at,
      note: data.admin_note,
    },
  };
}
