import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Menggabungkan class Tailwind dengan aman, menghindari konflik class.
 * Digunakan di seluruh komponen sebagai pengganti string concatenation biasa.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Membuat URL WhatsApp dengan format pesan standar Arifin Docs & Design.
 * @param serviceName - Nama layanan yang dipilih klien
 * @param adminPhone  - Nomor WA admin (tanpa tanda + atau spasi, contoh: "628123456789")
 */
export function generateWhatsAppLink(
  serviceName: string,
  adminPhone: string = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP ?? "6285801193410",
  orderCode?: string
): string {
  const orderCodeLine = orderCode ? `\nKode Order: ${orderCode}` : "";
  const message = encodeURIComponent(
    `Halo Arifin Docs & Design, saya sudah mengisi formulir layanan ${serviceName}.${orderCodeLine}`
  );
  return `https://wa.me/${adminPhone}?text=${message}`;
}
