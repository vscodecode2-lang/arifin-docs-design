import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kebijakan Privasi | Arifin Docs & Design",
  description: "Informasi tentang bagaimana kami mengelola data pribadi Anda dengan aman dan transparan.",
  alternates: { canonical: "/kebijakan-privasi" },
};

export default function KebijakanPrivasiPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">Kebijakan Privasi</p>
        <h1 className="mt-3 text-3xl font-black text-slate-900">Privasi data Anda adalah prioritas kami</h1>
        <p className="mt-4 text-base leading-8 text-slate-600">
          Kami hanya mengumpulkan informasi yang diperlukan untuk memproses permintaan layanan Anda. Data Anda disimpan dengan aman dan tidak akan dibagikan ke pihak ketiga tanpa izin, kecuali untuk kebutuhan operasional yang sah.
        </p>
      </div>
    </main>
  );
}
