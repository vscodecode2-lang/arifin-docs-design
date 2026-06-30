import { getInvoiceById } from "@/app/actions/invoice-actions";
import { BUSINESS_INFO } from "@/lib/invoice-config";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import { PrintButton } from "./PrintButton";

export const metadata: Metadata = {
  title: "Invoice",
  robots: { index: false, follow: false },
};

// ─── Helpers ──────────────────────────────────────────────────

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency", currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit", month: "long", year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(new Date(iso));
}

function formatPhone(phone: string) {
  const c = phone.replace(/\D/g, "");
  if (c.startsWith("62")) return `+${c}`;
  if (c.startsWith("0"))  return `+62${c.slice(1)}`;
  return phone;
}

// ─── Page ─────────────────────────────────────────────────────

export default async function InvoicePage({
  params,
}: {
  // BUG YANG DIPERBAIKI: di Next.js 15+/16, `params` pada Page bertipe
  // Promise dan WAJIB di-await sebelum diakses. Versi sebelumnya memakai
  // tipe sinkron `{ id: string }` lalu langsung membaca `params.id` —
  // ini menyebabkan error tipe sekaligus nilai `undefined` saat runtime.
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data: invoice, success } = await getInvoiceById(id);
  if (!success || !invoice) notFound();

  const isPaid = invoice.payment_status === "paid";

  return (
    <>
      {/* Print styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .invoice-card { box-shadow: none !important; border: none !important; }
        }
        @page { margin: 20mm; }
      `}</style>

      <div className="min-h-screen bg-slate-100 py-10 px-4">
        {/* Print button */}
        <div className="no-print mx-auto mb-4 flex max-w-2xl justify-end gap-2">
          <PrintButton />
        </div>

        {/* Invoice card */}
        <div className="invoice-card mx-auto max-w-2xl overflow-hidden rounded-2xl bg-white shadow-xl">

          {/* Top accent bar */}
          <div className="h-2 bg-linear-to-r from-blue-600 to-violet-600" />

          <div className="p-8">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <div className="relative mb-3 h-12 w-12 overflow-hidden rounded-xl">
                  <Image src="/logo.avif" alt={BUSINESS_INFO.name} fill sizes="48px" className="object-cover" />
                </div>
                <p className="text-lg font-black text-slate-900">{BUSINESS_INFO.name}</p>
                <p className="text-sm text-slate-500">{BUSINESS_INFO.email}</p>
                <p className="text-sm text-slate-500">{formatPhone(BUSINESS_INFO.phone)}</p>
                <p className="text-sm text-slate-500">{BUSINESS_INFO.website}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
                  Invoice
                </p>
                <p className="text-2xl font-black text-blue-700">{invoice.invoice_number}</p>
                <p className="mt-1 text-xs font-mono font-semibold text-blue-600">
                  {invoice.order_code ?? "-"}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Tanggal: {formatDate(invoice.created_at)}
                </p>
                <span className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-bold ${
                  isPaid
                    ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                    : "bg-amber-100 text-amber-700 border border-amber-200"
                }`}>
                  {isPaid ? "✓ LUNAS" : "⏳ BELUM DIBAYAR"}
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="my-6 h-px bg-slate-100" />

            {/* Bill to */}
            <div className="mb-6 grid grid-cols-2 gap-6">
              <div>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Tagihan Kepada
                </p>
                <p className="font-bold text-slate-900">{invoice.client_name}</p>
                <p className="text-xs font-mono font-semibold text-blue-600">{invoice.order_code ?? "-"}</p>
                <p className="text-sm text-slate-600">{invoice.client_email}</p>
                <p className="text-sm text-slate-600">{formatPhone(invoice.client_phone)}</p>
              </div>
              <div>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Dari
                </p>
                <p className="font-bold text-slate-900">{BUSINESS_INFO.name}</p>
                <p className="text-sm text-slate-600">Indonesia (Online Service)</p>
              </div>
            </div>

            {/* Service table */}
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Deskripsi Layanan
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-slate-500 w-16">
                      Qty
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                      Harga
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-slate-100">
                    <td className="px-4 py-4">
                      <p className="font-semibold text-slate-900">{invoice.service_label}</p>
                      <p className="mt-0.5 text-xs font-mono text-blue-600">Kode Order: {invoice.order_code ?? "-"}</p>
                      {invoice.notes && (
                        <p className="mt-0.5 text-xs text-slate-500">{invoice.notes}</p>
                      )}
                    </td>
                    <td className="px-4 py-4 text-center text-sm text-slate-600">1</td>
                    <td className="px-4 py-4 text-right font-semibold text-slate-900">
                      {formatRupiah(invoice.price)}
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr className="border-t border-slate-200 bg-blue-50">
                    <td colSpan={2} className="px-4 py-3 text-right text-sm font-black text-slate-900">
                      Total
                    </td>
                    <td className="px-4 py-3 text-right text-lg font-black text-blue-700">
                      {formatRupiah(invoice.price)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Payment info */}
            {!isPaid && (
              <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-4">
                <p className="mb-3 text-xs font-bold uppercase tracking-widest text-blue-600">
                  Informasi Pembayaran
                </p>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Bank</span>
                    <span className="text-sm font-bold text-slate-900">{BUSINESS_INFO.bank}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Nomor Rekening</span>
                    <span className="text-sm font-black text-blue-700 tracking-wider">
                      {BUSINESS_INFO.account_no}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Atas Nama</span>
                    <span className="text-sm font-bold text-slate-900">{BUSINESS_INFO.account_name}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-blue-200 pt-2 mt-2">
                    <span className="text-sm font-bold text-slate-700">Total Transfer</span>
                    <span className="text-base font-black text-blue-700">{formatRupiah(invoice.price)}</span>
                  </div>
                </div>
                <p className="mt-3 text-xs text-blue-600">
                  Setelah melakukan pembayaran, mohon konfirmasi via WhatsApp ke{" "}
                  <a
                    href={`https://wa.me/${BUSINESS_INFO.phone}`}
                    className="font-bold underline"
                    target="_blank" rel="noopener noreferrer"
                  >
                    {formatPhone(BUSINESS_INFO.phone)}
                  </a>
                </p>
              </div>
            )}

            {isPaid && invoice.paid_at && (
              <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center">
                <p className="text-sm font-bold text-emerald-700">
                  ✓ Pembayaran diterima pada {formatDate(invoice.paid_at)}
                </p>
                <p className="mt-1 text-xs text-emerald-600">
                  Terima kasih telah menggunakan layanan Arifin Docs & Design!
                </p>
              </div>
            )}

            {/* Footer */}
            <div className="mt-8 border-t border-slate-100 pt-6 text-center">
              <p className="text-xs text-slate-400">
                Invoice ini dibuat secara otomatis oleh sistem Arifin Docs & Design.
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Pertanyaan? Hubungi kami di{" "}
                <a href={`mailto:${BUSINESS_INFO.email}`} className="text-blue-600 hover:underline">
                  {BUSINESS_INFO.email}
                </a>
              </p>
            </div>
          </div>

          {/* Bottom accent bar */}
          <div className="h-2 bg-linear-to-r from-violet-600 to-blue-600" />
        </div>
      </div>
    </>
  );
}