/**
 * generateOrderCode — membuat kode unik untuk tracking order.
 *
 * Format: ADC-XXXXXX
 * - ADC = Arifin Docs Code
 * - XXXXXX = 6 karakter alphanumeric uppercase (A-Z, 0-9)
 *   dikecualikan huruf/angka ambigu: 0, O, I, 1, L
 *
 * Contoh: ADC-K7M2PQ
 *
 * Probabilitas collision: 1 / 30^6 = 1 / 729.000.000
 * Aman untuk volume hingga jutaan order.
 */

const CHARSET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // 32 karakter, tanpa 0/O/I/1/L

export function generateOrderCode(): string {
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += CHARSET[Math.floor(Math.random() * CHARSET.length)];
  }
  return `ADC-${code}`;
}

/**
 * Label status order yang ditampilkan ke user.
 * Sesuaikan dengan nilai enum di kolom `status` tabel Supabase.
 */
export const ORDER_STATUS_LABELS: Record<string, {
  label: string;
  description: string;
  color: string;   // Tailwind text color
  bg: string;      // Tailwind bg color
  step: number;    // 1–4 untuk progress bar
}> = {
  pending: {
    label: "Menunggu Konfirmasi",
    description: "Order kamu sudah kami terima. Tim sedang meninjau detail pesanan.",
    color: "text-amber-700",
    bg: "bg-amber-50 border-amber-200",
    step: 1,
  },
  confirmed: {
    label: "Dikonfirmasi",
    description: "Order sudah dikonfirmasi. Proses pengerjaan akan segera dimulai.",
    color: "text-blue-700",
    bg: "bg-blue-50 border-blue-200",
    step: 2,
  },
  in_progress: {
    label: "Sedang Dikerjakan",
    description: "Tim kami sedang mengerjakan dokumen kamu. Mohon tunggu sebentar.",
    color: "text-indigo-700",
    bg: "bg-indigo-50 border-indigo-200",
    step: 3,
  },
  completed: {
    label: "Selesai & Dikirim",
    description: "Dokumen sudah selesai dan dikirim via WhatsApp. Cek pesanmu!",
    color: "text-emerald-700",
    bg: "bg-emerald-50 border-emerald-200",
    step: 4,
  },
  revision: {
    label: "Proses Revisi",
    description: "Sedang dalam proses revisi sesuai permintaan kamu.",
    color: "text-violet-700",
    bg: "bg-violet-50 border-violet-200",
    step: 3,
  },
  cancelled: {
    label: "Dibatalkan",
    description: "Order ini telah dibatalkan. Hubungi kami jika ada pertanyaan.",
    color: "text-red-700",
    bg: "bg-red-50 border-red-200",
    step: 0,
  },
};

export type OrderStatus = keyof typeof ORDER_STATUS_LABELS;
