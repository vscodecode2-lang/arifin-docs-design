import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan",
  description: "Ketentuan layanan, revisi, dan prosedur pemesanan di Arifin Docs & Design.",
  alternates: { canonical: "/syarat-ketentuan" },
};

export default function SyaratKetentuanPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">Syarat & Ketentuan</p>
        <h1 className="mt-3 text-3xl font-black text-slate-900">Ketentuan layanan yang jelas dan transparan</h1>
        <p className="mt-4 text-base leading-8 text-slate-600">
          Pesanan akan diproses setelah konfirmasi pembayaran atau instruksi dari admin. Revisi dan timeline pengerjaan mengacu pada ketentuan setiap layanan yang tertera saat pemesanan.
        </p>
      </div>
    </main>
  );
}
