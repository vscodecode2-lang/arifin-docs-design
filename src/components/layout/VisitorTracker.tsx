"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackPageView } from "@/app/actions/track-pageview";

const VISITOR_COOKIE_NAME = "adv_id";
const VISITOR_COOKIE_MAX_AGE_SECONDS = 365 * 24 * 60 * 60; // 1 tahun

/**
 * Ambil id pengunjung anonim dari cookie, atau buat baru kalau belum ada.
 * Cookie (bukan localStorage) dipakai supaya konsisten dibaca lintas tab,
 * dan cukup untuk membedakan "pengunjung unik" tanpa perlu login/akun.
 * Tidak ada data pribadi apa pun di dalamnya — cuma UUID acak.
 */
function getOrCreateVisitorId(): string {
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${VISITOR_COOKIE_NAME}=([^;]*)`));
  if (match) return decodeURIComponent(match[1]);

  const id = crypto.randomUUID();
  document.cookie = `${VISITOR_COOKIE_NAME}=${id}; path=/; max-age=${VISITOR_COOKIE_MAX_AGE_SECONDS}; SameSite=Lax`;
  return id;
}

/**
 * VisitorTracker — dipasang sekali di layout publik (src/app/(public)/layout.tsx).
 * Tidak merender apa pun; hanya mencatat page view setiap kali `pathname`
 * berubah (termasuk navigasi client-side antar halaman, bukan cuma hard
 * reload). Lihat src/app/actions/track-pageview.ts untuk sisi server-nya.
 */
export function VisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const visitorId = getOrCreateVisitorId();
    trackPageView(pathname, visitorId, document.referrer || undefined).catch(() => {});
  }, [pathname]);

  return null;
}
