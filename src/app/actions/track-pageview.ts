"use server";

import { createServerSupabaseClient } from "@/lib/supabase-server";
import { checkRateLimit } from "@/lib/rate-limit";

/**
 * trackPageView — mencatat satu kunjungan halaman ke tabel `page_views`.
 *
 * Dipanggil oleh VisitorTracker.tsx (client component) di setiap perpindahan
 * halaman pada layout publik. Sengaja TIDAK menyimpan IP address atau
 * user-agent — cukup path, id anonim (cookie), dan referrer, supaya tetap
 * ringan dan tidak menyentuh data yang bisa mengidentifikasi orang.
 *
 * Desain gagal-diam (silent fail): analytics tidak boleh pernah membuat
 * halaman publik error atau lambat untuk pengunjung asli, jadi semua error
 * di sini ditelan, bukan dilempar ke pemanggil.
 */
export async function trackPageView(
  path: string,
  visitorId: string,
  referrer?: string
): Promise<void> {
  if (!path || !visitorId) return;

  // Rate limit per visitor — cukup longgar (60/menit) karena satu orang wajar
  // membuka banyak halaman berturut-turut, tapi tetap mencegah flood/abuse.
  const allowed = await checkRateLimit(`pageview:${visitorId}`, 60, 60_000);
  if (!allowed) return;

  try {
    const supabase = await createServerSupabaseClient();
    await supabase.from("page_views").insert({
      path: path.slice(0, 300),
      visitor_id: visitorId.slice(0, 100),
      referrer: referrer ? referrer.slice(0, 300) : null,
    });
  } catch {
    // Diam-diam gagal — lihat catatan desain di atas.
  }
}
