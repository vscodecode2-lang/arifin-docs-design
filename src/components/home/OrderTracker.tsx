"use client";

import { useState, useTransition } from "react";
import { trackOrder } from "@/app/actions/track-order";
import { ORDER_STATUS_LABELS } from "@/lib/order-utils";
import type { OrderTrackResult } from "@/app/actions/track-order";
import {
  Search,
  Package,
  CheckCircle2,
  Clock,
  Loader2,
  AlertCircle,
  MessageCircle,
  RefreshCw,
  FileText,
  CalendarDays,
} from "lucide-react";

const ADMIN_WA = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP ?? "6285801193410";

// Progress steps
const STEPS = [
  { step: 1, label: "Diterima" },
  { step: 2, label: "Dikonfirmasi" },
  { step: 3, label: "Dikerjakan" },
  { step: 4, label: "Selesai" },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatServiceType(type: string) {
  const map: Record<string, string> = {
    CV: "CV ATS Friendly",
    Lamaran: "Surat Lamaran Profesional",
    Legal: "Surat Legal",
    NPWP: "Pendaftaran NPWP",
    Akademik: "Pendampingan Akademik",
    "Data Entry": "Data Entry",
    "Paket Hemat": "Paket Hemat",
  };
  return map[type] ?? type;
}

export function OrderTracker() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState<OrderTrackResult | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleTrack = () => {
    if (!code.trim()) return;
    startTransition(async () => {
      const res = await trackOrder(code);
      setResult(res);
    });
  };

  const handleReset = () => {
    setCode("");
    setResult(null);
  };

  const statusInfo = result?.data
    ? ORDER_STATUS_LABELS[result.data.status] ?? ORDER_STATUS_LABELS.pending
    : null;

  return (
    <div className="ot-root">
      {/* ── Input area ── */}
      {!result?.success && (
        <div className="ot-input-section">
          <div className="ot-icon-wrap">
            <Package className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="ot-title">Cek Status Ordermu</h2>
          <p className="ot-subtitle">
            Masukkan kode order yang kamu terima via WhatsApp setelah melakukan
            pemesanan
          </p>

          {/* Input + Button */}
          <div className="ot-input-row">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && handleTrack()}
              placeholder="Contoh: ADC-K7M2PQ"
              maxLength={10}
              className="ot-input"
              aria-label="Kode order"
              spellCheck={false}
              autoComplete="off"
            />
            <button
              onClick={handleTrack}
              disabled={isPending || !code.trim()}
              className="ot-btn-search"
              aria-label="Cari order"
            >
              {isPending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Search className="h-5 w-5" />
              )}
              <span>{isPending ? "Mencari..." : "Cek Status"}</span>
            </button>
          </div>

          {/* Error state */}
          {result && !result.success && (
            <div className="ot-error">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <p>{result.error}</p>
            </div>
          )}

          {/* Hint */}
          <p className="ot-hint">
            Kode order dikirim via WhatsApp setelah kamu mengisi form pemesanan.
            Belum pesan?{" "}
            <a
              href={`https://wa.me/${ADMIN_WA}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline font-medium"
            >
              Hubungi kami
            </a>
          </p>
        </div>
      )}

      {/* ── Result area ── */}
      {result?.success && result.data && statusInfo && (
        <div className="ot-result">
          {/* Header result */}
          <div className={`ot-result-header ${statusInfo.bg}`}>
            <div className="ot-result-header-left">
              <span className="ot-result-code">{result.data.order_code}</span>
              <span className={`ot-status-badge ${statusInfo.color}`}>
                {statusInfo.label}
              </span>
            </div>
            <button onClick={handleReset} className="ot-reset-btn">
              <RefreshCw className="h-4 w-4" />
              Cek Lain
            </button>
          </div>

          {/* Progress bar */}
          {result.data.status !== "cancelled" && (
            <div className="ot-progress">
              {STEPS.map(({ step, label }) => {
                const current = statusInfo.step;
                const done = step < current;
                const active = step === current;
                return (
                  <div key={step} className="ot-step">
                    <div
                      className={`ot-step-circle ${done ? "done" : active ? "active" : "idle"}`}
                    >
                      {done ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : active ? (
                        <Clock className="h-4 w-4" />
                      ) : (
                        <span>{step}</span>
                      )}
                    </div>
                    <span
                      className={`ot-step-label ${active ? "font-bold text-slate-800" : "text-slate-400"}`}
                    >
                      {label}
                    </span>
                    {step < 4 && (
                      <div
                        className={`ot-connector ${done ? "done" : "idle"}`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Detail info */}
          <div className="ot-detail">
            <div className="ot-detail-row">
              <FileText className="h-4 w-4 text-slate-400" />
              <span className="ot-detail-label">Layanan</span>
              <span className="ot-detail-value">
                {formatServiceType(result.data.service_type)}
              </span>
            </div>
            <div className="ot-detail-row">
              <CalendarDays className="h-4 w-4 text-slate-400" />
              <span className="ot-detail-label">Tanggal Order</span>
              <span className="ot-detail-value">
                {formatDate(result.data.created_at)}
              </span>
            </div>
            {result.data.updated_at &&
              result.data.updated_at !== result.data.created_at && (
                <div className="ot-detail-row">
                  <Clock className="h-4 w-4 text-slate-400" />
                  <span className="ot-detail-label">Update Terakhir</span>
                  <span className="ot-detail-value">
                    {formatDate(result.data.updated_at)}
                  </span>
                </div>
              )}
          </div>

          {/* Status description */}
          <div className={`ot-status-desc ${statusInfo.bg}`}>
            <p className={statusInfo.color}>{statusInfo.description}</p>
          </div>

          {/* Admin note jika ada */}
          {result.data.note && (
            <div className="ot-admin-note">
              <p className="ot-admin-note-label">📝 Pesan dari Admin</p>
              <p className="ot-admin-note-text">{result.data.note}</p>
            </div>
          )}

          {/* CTA WA */}
          <a
            href={`https://wa.me/${ADMIN_WA}?text=${encodeURIComponent(
              `Halo, saya ingin menanyakan status order dengan kode ${result.data.order_code}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="ot-wa-cta"
          >
            <MessageCircle className="h-4 w-4" />
            Tanya Admin via WhatsApp
          </a>
        </div>
      )}

      <style>{`
        .ot-root {
          width: 100%;
          max-width: 520px;
          margin: 0 auto;
        }

        /* Input section */
        .ot-input-section {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          padding: 32px 28px;
          box-shadow: 0 4px 24px rgba(0,0,0,.06);
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }
        .ot-icon-wrap {
          width: 60px;
          height: 60px;
          border-radius: 16px;
          background: #eff6ff;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .ot-title {
          font-size: 1.3rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }
        .ot-subtitle {
          font-size: .875rem;
          color: #64748b;
          margin: 0;
          max-width: 340px;
          line-height: 1.5;
        }
        .ot-input-row {
          display: flex;
          gap: 8px;
          width: 100%;
        }
        .ot-input {
          flex: 1;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          padding: 12px 16px;
          font-size: .95rem;
          font-family: monospace;
          font-weight: 700;
          color: #0f172a;
          letter-spacing: .08em;
          outline: none;
          transition: border-color .15s;
          text-transform: uppercase;
        }
        .ot-input:focus {
          border-color: #3b82f6;
        }
        .ot-btn-search {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 12px 18px;
          background: #1e3a8a;
          color: white;
          border: none;
          border-radius: 12px;
          font-size: .875rem;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
          transition: background .15s;
        }
        .ot-btn-search:hover:not(:disabled) { background: #1d4ed8; }
        .ot-btn-search:disabled { opacity: .6; cursor: not-allowed; }

        .ot-error {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 10px;
          padding: 10px 14px;
          color: #dc2626;
          font-size: .85rem;
          width: 100%;
          text-align: left;
        }
        .ot-hint {
          font-size: .78rem;
          color: #94a3b8;
          margin: 0;
        }

        /* Result */
        .ot-result {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 4px 24px rgba(0,0,0,.06);
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .ot-result-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          border-bottom: 1px solid #e2e8f0;
          gap: 12px;
          flex-wrap: wrap;
        }
        .ot-result-header-left {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }
        .ot-result-code {
          font-family: monospace;
          font-size: 1.1rem;
          font-weight: 800;
          letter-spacing: .1em;
          color: #0f172a;
        }
        .ot-status-badge {
          font-size: .75rem;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: 20px;
          background: rgba(0,0,0,.05);
        }
        .ot-reset-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: .78rem;
          font-weight: 600;
          color: #64748b;
          background: none;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 6px 12px;
          cursor: pointer;
          transition: all .15s;
          white-space: nowrap;
        }
        .ot-reset-btn:hover { background: #f1f5f9; }

        /* Progress */
        .ot-progress {
          display: flex;
          align-items: center;
          padding: 20px 24px;
          border-bottom: 1px solid #f1f5f9;
          overflow-x: auto;
        }
        .ot-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          position: relative;
          flex-shrink: 0;
        }
        .ot-step-circle {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: .8rem;
          font-weight: 700;
          transition: all .2s;
        }
        .ot-step-circle.done   { background: #dcfce7; color: #16a34a; }
        .ot-step-circle.active { background: #1e3a8a; color: white; }
        .ot-step-circle.idle   { background: #f1f5f9; color: #94a3b8; }
        .ot-step-label {
          font-size: .7rem;
          white-space: nowrap;
          color: #94a3b8;
        }
        .ot-connector {
          position: absolute;
          top: 16px;
          left: 32px;
          width: 60px;
          height: 2px;
          transition: background .2s;
        }
        .ot-connector.done { background: #86efac; }
        .ot-connector.idle { background: #e2e8f0; }

        /* Detail */
        .ot-detail {
          padding: 16px 20px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          border-bottom: 1px solid #f1f5f9;
        }
        .ot-detail-row {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: .85rem;
        }
        .ot-detail-label {
          color: #94a3b8;
          min-width: 110px;
          font-weight: 500;
        }
        .ot-detail-value {
          color: #0f172a;
          font-weight: 600;
        }

        /* Status desc */
        .ot-status-desc {
          margin: 0 20px;
          border-radius: 10px;
          padding: 12px 14px;
          border: 1px solid transparent;
          font-size: .85rem;
          line-height: 1.5;
        }

        /* Admin note */
        .ot-admin-note {
          margin: 0 20px;
          background: #fefce8;
          border: 1px solid #fde68a;
          border-radius: 10px;
          padding: 12px 14px;
        }
        .ot-admin-note-label {
          font-size: .75rem;
          font-weight: 700;
          color: #92400e;
          margin: 0 0 4px;
        }
        .ot-admin-note-text {
          font-size: .85rem;
          color: #78350f;
          margin: 0;
          line-height: 1.5;
        }

        /* WA CTA */
        .ot-wa-cta {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin: 16px 20px 20px;
          padding: 12px;
          background: #f0fdf4;
          border: 1px solid #86efac;
          border-radius: 12px;
          color: #16a34a;
          font-size: .875rem;
          font-weight: 700;
          text-decoration: none;
          transition: background .15s;
        }
        .ot-wa-cta:hover { background: #dcfce7; }

        @media (max-width: 480px) {
          .ot-input-row { flex-direction: column; }
          .ot-input-section { padding: 24px 20px; }
          .ot-connector { width: 40px; }
        }
      `}</style>
    </div>
  );
}
