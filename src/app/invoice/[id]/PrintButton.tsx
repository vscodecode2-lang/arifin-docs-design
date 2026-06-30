"use client";

/**
 * PrintButton — Client Component kecil khusus untuk tombol cetak.
 *
 * BUG YANG DIPERBAIKI: sebelumnya `onClick={() => window.print()}` dipasang
 * langsung di dalam Server Component (`InvoicePage`, async function tanpa
 * "use client"). Event handler TIDAK BISA dikirim dari Server Component —
 * Next.js akan melempar error build/runtime karena function tidak bisa
 * diserialisasi melewati boundary server→client. Solusinya: pindahkan
 * elemen interaktif ke Client Component terpisah yang kecil ini, sehingga
 * sisa halaman invoice tetap menjadi Server Component (lebih cepat, SEO
 * friendly, dan tidak mengirim JS yang tidak perlu ke browser).
 */
export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="rounded-xl bg-blue-700 px-4 py-2 text-sm font-bold text-white hover:bg-blue-800 transition-colors"
    >
      🖨️ Cetak / Simpan PDF
    </button>
  );
}
