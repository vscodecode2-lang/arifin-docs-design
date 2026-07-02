import type { SupabaseClient } from "@supabase/supabase-js";

const inMemoryBuckets = new Map<string, { count: number; expiresAt: number }>();

function cleanupExpiredBuckets(now: number) {
  for (const [key, bucket] of inMemoryBuckets.entries()) {
    if (bucket.expiresAt <= now) {
      inMemoryBuckets.delete(key);
    }
  }
}

export async function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<boolean> {
  const now = Date.now();
  cleanupExpiredBuckets(now);

  const existing = inMemoryBuckets.get(key);
  if (!existing) {
    inMemoryBuckets.set(key, { count: 1, expiresAt: now + windowMs });
    return true;
  }

  if (existing.count >= limit) {
    return false;
  }

  existing.count += 1;
  return true;
}

/**
 * Cek apakah email yang sama sudah pernah submit (insert ke tabel `clients`)
 * dalam window waktu tertentu.
 *
 * Mengikuti pola rate limit yang sudah ada di `submitKontakAction`
 * (src/app/actions/submit-kontak.ts) — cek baris terbaru dengan
 * identitas yang sama dalam 1 jam terakhir — tapi digeneralisasi agar
 * bisa dipakai oleh form-form publik lain (CV, Lamaran, Legal, NPWP,
 * Akademik, Data Entry, Paket Hemat) yang sebelumnya tidak punya
 * proteksi spam/throttling sama sekali.
 */
export async function isRecentDuplicateSubmission(
  supabase: SupabaseClient,
  email: string,
  windowMinutes = 60
): Promise<boolean> {
  const since = new Date(Date.now() - windowMinutes * 60 * 1000).toISOString();

  const { data } = await supabase
    .from("clients")
    .select("id")
    .eq("email", email.toLowerCase().trim())
    .gte("created_at", since)
    .limit(1);

  return !!(data && data.length > 0);
}

export const RATE_LIMIT_MESSAGE =
  "Anda baru saja mengirim formulir ini. Mohon tunggu beberapa saat sebelum mengirim lagi, atau hubungi kami langsung via WhatsApp.";
