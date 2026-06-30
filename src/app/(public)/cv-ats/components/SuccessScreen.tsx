import { generateWhatsAppLink } from "@/lib/utils";

export function SuccessScreen({ orderCode }: { orderCode: string }) {
  const waLink = generateWhatsAppLink(
    "CV ATS Friendly",
    process.env.NEXT_PUBLIC_ADMIN_WHATSAPP,
    orderCode
  );

  return (
    <div className="min-h-screen bg-slate-50 py-10 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
        {/* Icon */}
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50">
          <svg className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>

        <h2 className="text-xl font-black text-slate-900 mb-1">Order Berhasil Dikirim!</h2>
        <p className="text-sm text-slate-500 mb-6">
          Data CV kamu sudah kami terima. Simpan kode order di bawah untuk melacak status pengerjaan.
        </p>

        {/* Kode Order */}
        <div className="bg-blue-950 rounded-xl px-6 py-5 mb-6">
          <p className="text-xs font-semibold text-blue-300 uppercase tracking-widest mb-2">Kode Order Kamu</p>
          <p className="text-3xl font-black text-white tracking-widest font-mono">{orderCode}</p>
          <p className="text-xs text-blue-300 mt-2">Simpan kode ini untuk cek status di halaman <strong>/cek-order</strong></p>
        </div>

        {/* Copy button */}
        <button
          onClick={() => {
            navigator.clipboard.writeText(orderCode);
            alert("Kode order berhasil disalin!");
          }}
          className="mb-3 w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
        >
          📋 Salin Kode Order
        </button>

        {/* WA button */}
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full rounded-xl bg-green-600 py-3 text-sm font-bold text-white hover:bg-green-700 transition-colors mb-4"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Lanjutkan via WhatsApp
        </a>

        <a href="/cek-order" className="text-xs text-blue-600 hover:underline">
          Cek status order kapan saja di /cek-order →
        </a>
      </div>
    </div>
  );
}
