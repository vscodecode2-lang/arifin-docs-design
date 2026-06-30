"use client";

import { useState } from "react";
import { Bell, CheckCircle2, Loader2, Lock } from "lucide-react";

interface Product {
  emoji: string;
  title: string;
  desc: string;
  badge: string;
}

interface ComingSoonClientProps {
  products: Product[];
}

export function ComingSoonClient({ products }: ComingSoonClientProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    if (!email.trim() || !email.includes("@")) {
      setStatus("error");
      setMessage("Masukkan email yang valid.");
      return;
    }

    setStatus("loading");

    // Kirim ke WhatsApp admin sebagai notifikasi minat
    // (bisa diganti dengan Supabase insert jika ada tabel waitlist)
    const waMsg = encodeURIComponent(
      `[WAITLIST] ${email} tertarik dengan produk digital Arifin Docs & Design`
    );
    const waUrl = `https://wa.me/${process.env.NEXT_PUBLIC_ADMIN_WHATSAPP ?? "6285801193410"}?text=${waMsg}`;

    // Simulasi delay kecil agar terasa prosesnya
    await new Promise((r) => setTimeout(r, 800));

    setStatus("success");
    setMessage("Kamu sudah terdaftar! Kami akan kabari saat produk siap. 🎉");
    setEmail("");

    // Buka WA admin di background (opsional, bisa dihapus)
    // window.open(waUrl, "_blank");
    void waUrl; // suppress unused warning
  };

  return (
    <div className="cs-root">
      {/* ── Card grid dengan blur effect ── */}
      <div className="cs-grid">
        {products.map((p, i) => (
          <div key={i} className="cs-card">
            {/* Blur overlay */}
            <div className="cs-blur-overlay">
              <Lock className="h-5 w-5 text-slate-400" />
              <span className="text-xs font-semibold text-slate-500">Segera Hadir</span>
            </div>

            {/* Card content (di-blur) */}
            <div className="cs-card-inner">
              <div className="cs-badge">{p.badge}</div>
              <div className="cs-emoji">{p.emoji}</div>
              <h3 className="cs-card-title">{p.title}</h3>
              <p className="cs-card-desc">{p.desc}</p>
              <div className="cs-card-price">
                <span className="cs-price-label">Harga</span>
                <span className="cs-price-value">Rp ██.███</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Email waitlist form ── */}
      <div className="cs-form-wrap">
        {status !== "success" ? (
          <>
            <div className="cs-form-icon">
              <Bell className="h-5 w-5 text-violet-600" />
            </div>
            <p className="cs-form-title">Daftar & Dapat Notifikasi Pertama</p>
            <p className="cs-form-sub">
              Masukkan emailmu dan kami kabari saat produk siap. Gratis.
            </p>
            <div className="cs-input-row">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === "error") setStatus("idle");
                }}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="emailkamu@gmail.com"
                className={`cs-input ${status === "error" ? "error" : ""}`}
                disabled={status === "loading"}
              />
              <button
                onClick={handleSubmit}
                disabled={status === "loading" || !email.trim()}
                className="cs-btn"
              >
                {status === "loading" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Bell className="h-4 w-4" />
                )}
                {status === "loading" ? "Mendaftarkan..." : "Beritahu Saya"}
              </button>
            </div>
            {status === "error" && (
              <p className="cs-error-msg">{message}</p>
            )}
            <p className="cs-privacy">🔒 Tidak ada spam. Unsubscribe kapan saja.</p>
          </>
        ) : (
          <div className="cs-success">
            <CheckCircle2 className="h-8 w-8 text-green-500" />
            <p className="cs-success-msg">{message}</p>
          </div>
        )}
      </div>

      <style>{`
        .cs-root {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        /* Grid */
        .cs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 16px;
        }

        /* Card */
        .cs-card {
          position: relative;
          border-radius: 16px;
          border: 1px dashed #c7d2fe;
          background: #fff;
          overflow: hidden;
        }
        .cs-card-inner {
          padding: 24px;
          filter: blur(4px);
          user-select: none;
          pointer-events: none;
          opacity: .6;
        }
        .cs-blur-overlay {
          position: absolute;
          inset: 0;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
          background: rgba(248,250,252,.7);
          backdrop-filter: blur(2px);
        }
        .cs-badge {
          display: inline-block;
          font-size: .65rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: .08em;
          color: #7c3aed;
          background: #ede9fe;
          border-radius: 20px;
          padding: 2px 8px;
          margin-bottom: 8px;
        }
        .cs-emoji {
          font-size: 2rem;
          margin-bottom: 10px;
          line-height: 1;
        }
        .cs-card-title {
          font-size: .95rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 8px;
          line-height: 1.3;
        }
        .cs-card-desc {
          font-size: .8rem;
          color: #64748b;
          margin: 0 0 16px;
          line-height: 1.5;
        }
        .cs-card-price {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .cs-price-label {
          font-size: .72rem;
          color: #94a3b8;
          font-weight: 500;
        }
        .cs-price-value {
          font-size: .95rem;
          font-weight: 800;
          color: #1e3a8a;
          font-family: monospace;
          letter-spacing: .05em;
        }

        /* Form */
        .cs-form-wrap {
          background: linear-gradient(135deg, #faf5ff 0%, #eff6ff 100%);
          border: 1px solid #ddd6fe;
          border-radius: 16px;
          padding: 28px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        .cs-form-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: #ede9fe;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .cs-form-title {
          font-size: 1rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }
        .cs-form-sub {
          font-size: .83rem;
          color: #64748b;
          margin: 0;
          max-width: 340px;
        }
        .cs-input-row {
          display: flex;
          gap: 8px;
          width: 100%;
          max-width: 460px;
        }
        .cs-input {
          flex: 1;
          border: 1.5px solid #ddd6fe;
          border-radius: 10px;
          padding: 10px 14px;
          font-size: .875rem;
          color: #0f172a;
          outline: none;
          transition: border-color .15s;
          background: #fff;
        }
        .cs-input:focus { border-color: #7c3aed; }
        .cs-input.error { border-color: #f87171; }
        .cs-input:disabled { opacity: .6; }
        .cs-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 18px;
          background: #7c3aed;
          color: white;
          border: none;
          border-radius: 10px;
          font-size: .83rem;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
          transition: background .15s;
        }
        .cs-btn:hover:not(:disabled) { background: #6d28d9; }
        .cs-btn:disabled { opacity: .6; cursor: not-allowed; }
        .cs-error-msg { font-size: .78rem; color: #dc2626; margin: 0; }
        .cs-privacy { font-size: .72rem; color: #94a3b8; margin: 0; }

        /* Success */
        .cs-success {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          padding: 8px 0;
        }
        .cs-success-msg {
          font-size: .9rem;
          font-weight: 600;
          color: #16a34a;
          margin: 0;
          text-align: center;
        }

        @media (max-width: 640px) {
          .cs-input-row { flex-direction: column; }
          .cs-form-wrap { padding: 20px 16px; }
        }
      `}</style>
    </div>
  );
}
