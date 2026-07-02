import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tentang Kami | Arifin Docs & Design",
  description: "Kenali Arifin Docs & Design, tim yang membantu klien menyusun dokumen profesional untuk karier dan bisnis.",
  alternates: { canonical: "/tentang" },
};

export default function TentangPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">Tentang Kami</p>
        <h1 className="mt-3 text-3xl font-black text-slate-900">Menyusun dokumen profesional yang membantu Anda maju</h1>
        <p className="mt-4 text-base leading-8 text-slate-600">
          Arifin Docs &amp; Design membantu klien menyiapkan dokumen dan layanan pendukung untuk proses karier, administrasi, dan bisnis. Kami fokus pada hasil yang rapi, profesional, dan siap dipakai.
        </p>
      </div>
    </main>
  );
}
