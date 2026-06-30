import { SERVICE_META } from "../constants";

/**
 * DashboardService — kumpulan helper murni (pure functions) untuk formatting
 * dan logic non-UI yang dipakai di berbagai komponen dashboard.
 * Dipisahkan dari komponen agar mudah ditest dan tidak terikat React.
 */

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", timeZone: "Asia/Jakarta",
  }).format(new Date(iso));
}

export function formatWA(phone: string): string {
  const c = phone.replace(/\D/g, "");
  if (c.startsWith("62")) return `+${c}`;
  if (c.startsWith("0"))  return `+62${c.slice(1)}`;
  return phone;
}

export function buildWALink(phone: string, name: string, service: string): string {
  const num = formatWA(phone).replace("+", "");
  const msg = encodeURIComponent(
    `Halo ${name}, terima kasih sudah menggunakan layanan Arifin Docs & Design. Pesanan ${SERVICE_META[service]?.label ?? service} Anda sedang kami proses.`
  );
  return `https://wa.me/${num}?text=${msg}`;
}

/** Hitung sisa hari sebelum dihapus permanen (retensi sampah 7 hari) */
export function getDaysLeft(deletedAt: string): number {
  const deleted = new Date(deletedAt).getTime();
  const expire  = deleted + 7 * 24 * 60 * 60 * 1000;
  const diff    = expire - Date.now();
  return Math.max(0, Math.ceil(diff / (24 * 60 * 60 * 1000)));
}
