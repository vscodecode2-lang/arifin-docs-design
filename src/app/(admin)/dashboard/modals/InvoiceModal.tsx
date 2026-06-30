"use client";

import { useState } from "react";
import Image from "next/image";
import {
  generateInvoice, markInvoiceSent,
  type InvoiceData,
} from "@/app/actions/invoice-actions";
import { BUSINESS_INFO, DEFAULT_PRICES, SERVICE_LABELS } from "@/lib/invoice-config";
import {
  X, FileText, MessageCircle, Mail, Download,
  CheckCircle2, Loader2, AlertCircle, SkipForward,
  CreditCard, Building2,
} from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency", currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit", month: "long", year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(new Date(iso));
}

function formatPhone(phone: string): string {
  const c = phone.replace(/\D/g, "");
  if (c.startsWith("62")) return `+${c}`;
  if (c.startsWith("0"))  return `+62${c.slice(1)}`;
  return phone;
}

// ─── Invoice Preview Component ────────────────────────────────

function InvoicePreview({ invoice }: { invoice: InvoiceData }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-slate-100 pb-4">
        <div>
          <div className="relative mb-2 h-10 w-10 overflow-hidden rounded-xl">
            <Image src="/logo.avif" alt={BUSINESS_INFO.name} fill sizes="40px" className="object-cover" />
          </div>
          <p className="font-black text-slate-900">{BUSINESS_INFO.name}</p>
          <p className="text-xs text-slate-500">{BUSINESS_INFO.email}</p>
          <p className="text-xs text-slate-500">{formatPhone(BUSINESS_INFO.phone)}</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-black text-blue-700">{invoice.invoice_number}</p>
          <p className="text-xs text-slate-500">Tanggal: {formatDate(invoice.created_at)}</p>
          <span className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
            invoice.payment_status === "paid"
              ? "bg-emerald-100 text-emerald-700"
              : "bg-amber-100 text-amber-700"
          }`}>
            {invoice.payment_status === "paid" ? "✓ Lunas" : "Belum Dibayar"}
          </span>
        </div>
      </div>

      {/* Client info */}
      <div className="my-4">
        <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">Tagihan Kepada</p>
        <p className="font-bold text-slate-900">{invoice.client_name}</p>
        <p className="text-xs font-mono font-semibold text-blue-600">{invoice.order_code ?? "-"}</p>
        <p className="text-xs text-slate-500">{invoice.client_email}</p>
        <p className="text-xs text-slate-500">{formatPhone(invoice.client_phone)}</p>
      </div>

      {/* Service table */}
      <div className="overflow-hidden rounded-xl border border-slate-200">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-slate-50">
              <th className="px-3 py-2 text-left font-bold text-slate-600">Layanan</th>
              <th className="px-3 py-2 text-right font-bold text-slate-600">Jumlah</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-slate-100">
              <td className="px-3 py-3 text-slate-800">{invoice.service_label}</td>
              <td className="px-3 py-3 text-right font-bold text-slate-900">
                {formatRupiah(invoice.price)}
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-slate-200 bg-blue-50">
              <td className="px-3 py-2.5 font-black text-slate-900">Total</td>
              <td className="px-3 py-2.5 text-right font-black text-blue-700">
                {formatRupiah(invoice.price)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Payment info */}
      <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
        <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          Informasi Pembayaran
        </p>
        <div className="flex items-center gap-2">
          <Building2 className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-xs text-slate-700 font-semibold">{BUSINESS_INFO.bank}</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <CreditCard className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-xs font-bold text-slate-900">{BUSINESS_INFO.account_no}</span>
          <span className="text-xs text-slate-500">a.n. {BUSINESS_INFO.account_name}</span>
        </div>
      </div>

      {/* Notes */}
      {invoice.notes && (
        <p className="mt-3 text-xs text-slate-500 italic">Catatan: {invoice.notes}</p>
      )}
    </div>
  );
}

// ─── Main Modal ───────────────────────────────────────────────

interface Props {
  clientId:    string;
  clientName:  string;
  clientEmail: string;
  clientPhone: string;
  serviceType: string;
  onConfirm:   (invoice: InvoiceData) => void;
  onSkip:      () => void;
  onClose:     () => void;
}

export function InvoiceModal({
  clientId, clientName, clientEmail, clientPhone,
  serviceType, onConfirm, onSkip, onClose,
}: Props) {
  const defaultPrice = DEFAULT_PRICES[serviceType] ?? 0;

  const [price, setPrice]   = useState<number>(defaultPrice);
  const [notes, setNotes]   = useState("");
  const [step, setStep]     = useState<"form" | "preview" | "send">("form");
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]   = useState("");

  const BASE_URL = typeof window !== "undefined"
    ? `${window.location.protocol}//${window.location.host}`
    : "https://arifindocs.id";

  const invoiceUrl = invoice ? `${BASE_URL}/invoice/${invoice.id}` : "";

  // ── Handlers ──

  const handleGenerate = async () => {
    if (price <= 0) { setError("Harga harus lebih dari 0."); return; }
    setIsLoading(true); setError("");

    const res = await generateInvoice(
      clientId, clientName, clientEmail, clientPhone,
      serviceType, price, notes || undefined
    );

    setIsLoading(false);
    if (!res.success) { setError(res.error ?? "Gagal membuat invoice."); return; }
    setInvoice(res.invoice!);
    setStep("send");
    onConfirm(res.invoice!);
  };

  const handleSendWA = async () => {
    if (!invoice) return;
    const msg = encodeURIComponent(
      `Halo ${clientName}, terima kasih telah menggunakan layanan Arifin Docs & Design!\n\n` +
      `Berikut invoice untuk layanan Anda:\n` +
      `📄 ${invoice.invoice_number}\n` +
      `🧾 ${invoice.order_code ?? "-"}\n` +
      `💼 ${invoice.service_label}\n` +
      `💰 ${formatRupiah(invoice.price)}\n\n` +
      `Lihat invoice lengkap: ${invoiceUrl}\n\n` +
      `Pembayaran ke ${BUSINESS_INFO.bank} ${BUSINESS_INFO.account_no} a.n. ${BUSINESS_INFO.account_name}`
    );
    const phone = clientPhone.replace(/\D/g,"");
    const normalized = phone.startsWith("0") ? `62${phone.slice(1)}` : phone.startsWith("62") ? phone : `62${phone}`;
    window.open(`https://wa.me/${normalized}?text=${msg}`, "_blank");
    await markInvoiceSent(invoice.id, "wa");
    setInvoice(prev => prev ? { ...prev, sent_via_wa: true } : prev);
  };

  const handleSendEmail = async () => {
    if (!invoice) return;
    const subject = encodeURIComponent(`Invoice ${invoice.invoice_number} — Arifin Docs & Design`);
    const body    = encodeURIComponent(
      `Halo ${clientName},\n\nTerima kasih telah menggunakan layanan Arifin Docs & Design!\n\n` +
      `Invoice: ${invoice.invoice_number}\n` +
      `Kode Order: ${invoice.order_code ?? "-"}\n` +
      `Layanan: ${invoice.service_label}\n` +
      `Total: ${formatRupiah(invoice.price)}\n\n` +
      `Lihat invoice lengkap: ${invoiceUrl}\n\n` +
      `Pembayaran:\nBank: ${BUSINESS_INFO.bank}\nNo. Rek: ${BUSINESS_INFO.account_no}\nA.n.: ${BUSINESS_INFO.account_name}\n\n` +
      `Terima kasih,\nArifin Docs & Design`
    );
    window.open(`mailto:${clientEmail}?subject=${subject}&body=${body}`);
    await markInvoiceSent(invoice.id, "email");
    setInvoice(prev => prev ? { ...prev, sent_via_email: true } : prev);
  };

  const handleDownloadPDF = () => {
    if (!invoice) return;
    window.open(`/invoice/${invoice.id}?print=1`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="flex max-h-[92vh] w-full max-w-lg flex-col rounded-t-2xl bg-white shadow-2xl sm:mx-4 sm:rounded-2xl">

        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <h3 className="text-base font-black text-slate-900">
                {step === "form" ? "Buat Invoice" : step === "send" ? "Kirim Invoice" : "Preview Invoice"}
              </h3>
            </div>
            <p className="mt-0.5 text-xs text-slate-500">
              {clientName} — {SERVICE_LABELS[serviceType] ?? serviceType}
            </p>
          </div>
          <button onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">

          {/* ── STEP: Form ── */}
          {step === "form" && (
            <>
              <div className="rounded-xl border border-blue-100 bg-blue-50 p-3">
                <p className="text-xs text-blue-700">
                  Status klien akan diubah ke <span className="font-bold">Selesai</span> setelah invoice dibuat.
                  Anda bisa mengedit harga sebelum mengirim.
                </p>
              </div>

              {/* Harga */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-700">
                  Harga Layanan <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500">
                    Rp
                  </span>
                  <input
                    type="number" min="0" step="1000"
                    value={price}
                    onChange={e => { setPrice(Number(e.target.value)); setError(""); }}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm font-bold text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors"
                  />
                </div>
                <p className="text-xs text-slate-400">
                  Default: {formatRupiah(defaultPrice || 0)} — ubah jika ada penyesuaian harga
                </p>
              </div>

              {/* Catatan */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-700">
                  Catatan <span className="text-slate-400 font-normal">(opsional)</span>
                </label>
                <textarea rows={2}
                  value={notes} onChange={e => setNotes(e.target.value)}
                  placeholder="Contoh: Termasuk 2x revisi gratis"
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors"
                />
              </div>

              {error && (
                <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}
            </>
          )}

          {/* ── STEP: Send ── */}
          {step === "send" && invoice && (
            <>
              <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
                <div>
                  <p className="text-sm font-bold text-emerald-700">Invoice berhasil dibuat!</p>
                  <p className="text-xs text-emerald-600">{invoice.invoice_number} — {invoice.order_code ?? "-"} — {formatRupiah(invoice.price)}</p>
                </div>
              </div>

              <InvoicePreview invoice={invoice} />

              <div className="space-y-2.5">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Kirim ke Klien</p>

                <button onClick={handleSendWA}
                  className={`flex w-full items-center gap-3 rounded-xl border-2 p-3.5 text-left transition-all hover:shadow-sm ${
                    invoice.sent_via_wa ? "border-emerald-300 bg-emerald-50" : "border-slate-200 hover:border-emerald-300"
                  }`}>
                  <MessageCircle className={`h-5 w-5 ${invoice.sent_via_wa ? "text-emerald-600" : "text-emerald-500"}`} />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-800">Kirim via WhatsApp</p>
                    <p className="text-xs text-slate-500">{formatPhone(clientPhone)}</p>
                  </div>
                  {invoice.sent_via_wa && (
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                      Terkirim
                    </span>
                  )}
                </button>

                <button onClick={handleSendEmail}
                  className={`flex w-full items-center gap-3 rounded-xl border-2 p-3.5 text-left transition-all hover:shadow-sm ${
                    invoice.sent_via_email ? "border-blue-300 bg-blue-50" : "border-slate-200 hover:border-blue-300"
                  }`}>
                  <Mail className={`h-5 w-5 ${invoice.sent_via_email ? "text-blue-600" : "text-blue-500"}`} />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-800">Kirim via Email</p>
                    <p className="text-xs text-slate-500">{clientEmail}</p>
                  </div>
                  {invoice.sent_via_email && (
                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                      Terkirim
                    </span>
                  )}
                </button>

                <button onClick={handleDownloadPDF}
                  className="flex w-full items-center gap-3 rounded-xl border-2 border-slate-200 p-3.5 text-left hover:border-slate-300 transition-all">
                  <Download className="h-5 w-5 text-slate-500" />
                  <div>
                    <p className="text-sm font-bold text-slate-800">Download PDF</p>
                    <p className="text-xs text-slate-500">Buka halaman invoice → Ctrl+P → Save as PDF</p>
                  </div>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-slate-100 px-5 py-4">
          {step === "form" && (
            <div className="flex gap-3">
              <button onClick={onSkip}
                className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                <SkipForward className="h-4 w-4" />
                Skip Invoice
              </button>
              <button onClick={handleGenerate} disabled={isLoading}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-700 py-2.5 text-sm font-bold text-white hover:bg-blue-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors">
                {isLoading
                  ? <><Loader2 className="h-4 w-4 animate-spin" />Membuat...</>
                  : <><FileText className="h-4 w-4" />Buat Invoice</>
                }
              </button>
            </div>
          )}
          {step === "send" && (
            <button onClick={onClose}
              className="w-full rounded-xl bg-emerald-600 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 transition-colors">
              Selesai
            </button>
          )}
        </div>
      </div>
    </div>
  );
}