/**
 * loading.tsx — Public Route Group
 *
 * Ditampilkan otomatis oleh Next.js (via React Suspense) saat:
 * - Navigasi antar halaman publik
 * - Server Component sedang fetch data dari Supabase
 *
 * Desain: skeleton minimal yang konsisten dengan warna bg-blue-950 (hero)
 * dan bg-slate-50 (konten), tanpa blocking UX.
 */
export default function PublicLoading() {
  return (
    <div className="min-h-screen bg-slate-50 animate-pulse">
      {/* ── Skeleton Hero ── */}
      <div className="bg-blue-950 min-h-[40vh] flex flex-col items-center justify-center gap-4 px-4">
        <div className="h-8 w-64 rounded-full bg-blue-800/60" />
        <div className="h-5 w-96 max-w-[90vw] rounded-full bg-blue-800/40" />
        <div className="flex gap-3 mt-2">
          <div className="h-11 w-36 rounded-xl bg-blue-700/50" />
          <div className="h-11 w-36 rounded-xl bg-blue-800/40" />
        </div>
      </div>

      {/* ── Skeleton Content ── */}
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-10">
        {/* Row 1 — card grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl bg-white border border-slate-200 p-6 space-y-3 shadow-sm"
            >
              <div className="h-10 w-10 rounded-xl bg-slate-200" />
              <div className="h-5 w-3/4 rounded-full bg-slate-200" />
              <div className="h-4 w-full rounded-full bg-slate-100" />
              <div className="h-4 w-5/6 rounded-full bg-slate-100" />
            </div>
          ))}
        </div>

        {/* Row 2 — wide bar */}
        <div className="h-40 w-full rounded-2xl bg-white border border-slate-200 shadow-sm" />
      </div>
    </div>
  );
}
