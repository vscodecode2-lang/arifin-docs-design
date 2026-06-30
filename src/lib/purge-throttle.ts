/**
 * Helper non-komponen untuk men-throttle pemanggilan purgeExpiredTrash()
 * (AUDIT HIGH-1). Dipisahkan dari page.tsx karena React/Next.js melarang
 * pemanggilan fungsi impure (Date.now(), reassignment variabel modul)
 * langsung di body Server Component (lint rule `react-hooks/purity`).
 *
 * Best-effort: membatasi eksekusi paling banyak sekali per jam per
 * instance server. Cukup untuk tujuan "hapus item trash > 7 hari",
 * tidak butuh presisi real-time.
 */
let lastPurgeAt = 0;
const PURGE_INTERVAL_MS = 60 * 60 * 1000; // 1 jam

export function shouldRunPurge(): boolean {
  const now = Date.now();
  if (now - lastPurgeAt <= PURGE_INTERVAL_MS) return false;
  lastPurgeAt = now;
  return true;
}
