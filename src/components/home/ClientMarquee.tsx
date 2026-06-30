"use client";

/**
 * ClientMarquee — Strip logo/nama perusahaan klien yang scroll infinite.
 *
 * Desain: dua baris marquee berlawanan arah (kiri & kanan) untuk
 * menghindari tampilan monoton. Setiap item adalah pill dengan
 * inisial avatar + nama perusahaan.
 *
 * Performa:
 * - CSS animation murni (transform: translateX) — di-handle GPU
 * - Tidak ada JS scroll listener
 * - prefers-reduced-motion dihormati (animasi berhenti)
 * - Items di-duplicate di DOM untuk seamless loop tanpa JS
 */

// ─── Data klien (ganti dengan data asli, anonim jika perlu) ──────────────────

interface ClientItem {
  name: string;       // nama perusahaan/instansi/universitas
  initial: string;    // 2 huruf untuk avatar
  color: string;      // warna avatar (Tailwind bg class)
  type: "company" | "university" | "government" | "startup";
}

const CLIENTS_ROW_1: ClientItem[] = [
  { name: "Bank BRI", initial: "BR", color: "#1d4ed8", type: "company" },
  { name: "Telkom Indonesia", initial: "TI", color: "#dc2626", type: "company" },
  { name: "Univ. Diponegoro", initial: "UD", color: "#16a34a", type: "university" },
  { name: "Astra International", initial: "AI", color: "#d97706", type: "company" },
  { name: "Kemenkes RI", initial: "KM", color: "#0891b2", type: "government" },
  { name: "Gojek", initial: "GJ", color: "#059669", type: "startup" },
  { name: "Univ. Gadjah Mada", initial: "UG", color: "#7c3aed", type: "university" },
  { name: "PLN Persero", initial: "PL", color: "#ea580c", type: "company" },
  { name: "Tokopedia", initial: "TP", color: "#16a34a", type: "startup" },
  { name: "Pemkab Batang", initial: "PB", color: "#0369a1", type: "government" },
];

const CLIENTS_ROW_2: ClientItem[] = [
  { name: "Univ. Brawijaya", initial: "UB", color: "#dc2626", type: "university" },
  { name: "Shopee Indonesia", initial: "SI", color: "#ea580c", type: "startup" },
  { name: "Pertamina", initial: "PT", color: "#16a34a", type: "company" },
  { name: "Univ. Sebelas Maret", initial: "US", color: "#7c3aed", type: "university" },
  { name: "Bank Mandiri", initial: "BM", color: "#d97706", type: "company" },
  { name: "Bukalapak", initial: "BL", color: "#dc2626", type: "startup" },
  { name: "BPJS Kesehatan", initial: "BP", color: "#0891b2", type: "government" },
  { name: "Unilever Indonesia", initial: "UI", color: "#1d4ed8", type: "company" },
  { name: "Traveloka", initial: "TV", color: "#0369a1", type: "startup" },
  { name: "Univ. Airlangga", initial: "UA", color: "#059669", type: "university" },
];

const TYPE_LABELS: Record<ClientItem["type"], string> = {
  company: "Perusahaan",
  university: "Universitas",
  government: "Instansi Pemerintah",
  startup: "Startup",
};

function ClientPill({ item }: { item: ClientItem }) {
  return (
    <div className="cm-pill">
      <div
        className="cm-avatar"
        style={{ background: item.color }}
        aria-hidden="true"
      >
        {item.initial}
      </div>
      <div className="cm-pill-text">
        <span className="cm-pill-name">{item.name}</span>
        <span className="cm-pill-type">{TYPE_LABELS[item.type]}</span>
      </div>
    </div>
  );
}

function MarqueeRow({
  items,
  direction = "left",
  speed = 35,
}: {
  items: ClientItem[];
  direction?: "left" | "right";
  speed?: number;
}) {
  // Duplicate 3x untuk seamless infinite loop
  const duplicated = [...items, ...items, ...items];
  const duration = `${(items.length * speed)}s`;

  return (
    <div className="cm-row" aria-hidden="true">
      <div
        className={`cm-track ${direction === "right" ? "cm-track-reverse" : ""}`}
        style={{ animationDuration: duration }}
      >
        {duplicated.map((item, i) => (
          <ClientPill key={`${item.name}-${i}`} item={item} />
        ))}
      </div>
    </div>
  );
}

export function ClientMarquee() {
  return (
    <section className="cm-section">
      {/* Header */}
      <div className="cm-header">
        <p className="cm-header-label">Dipercaya klien dari</p>
        <div className="cm-stats">
          <span className="cm-stat-chip">🏢 Perusahaan Swasta</span>
          <span className="cm-stat-chip">🎓 Universitas Negeri</span>
          <span className="cm-stat-chip">🏛️ Instansi Pemerintah</span>
          <span className="cm-stat-chip">🚀 Startup</span>
        </div>
      </div>

      {/* Marquee rows */}
      <div className="cm-marquee-wrap">
        {/* Fade edges */}
        <div className="cm-fade-left" aria-hidden="true" />
        <div className="cm-fade-right" aria-hidden="true" />

        <MarqueeRow items={CLIENTS_ROW_1} direction="left" speed={40} />
        <MarqueeRow items={CLIENTS_ROW_2} direction="right" speed={35} />
      </div>

      {/* Footer note */}
      <p className="cm-footer">
        500+ klien dari seluruh Indonesia · Data ditampilkan secara anonim
      </p>

      <style>{`
        .cm-section {
          background: #fff;
          padding: 48px 0 40px;
          overflow: hidden;
          border-top: 1px solid #f1f5f9;
          border-bottom: 1px solid #f1f5f9;
        }

        /* Header */
        .cm-header {
          text-align: center;
          padding: 0 20px;
          margin-bottom: 28px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        .cm-header-label {
          font-size: .7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: .1em;
          color: #94a3b8;
          margin: 0;
        }
        .cm-stats {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 8px;
        }
        .cm-stat-chip {
          font-size: .75rem;
          font-weight: 600;
          color: #475569;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          padding: 4px 12px;
        }

        /* Marquee wrapper */
        .cm-marquee-wrap {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 10px;
          overflow: hidden;
        }
        .cm-fade-left, .cm-fade-right {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 120px;
          z-index: 2;
          pointer-events: none;
        }
        .cm-fade-left {
          left: 0;
          background: linear-gradient(to right, #fff 0%, transparent 100%);
        }
        .cm-fade-right {
          right: 0;
          background: linear-gradient(to left, #fff 0%, transparent 100%);
        }

        /* Row */
        .cm-row {
          overflow: hidden;
          width: 100%;
        }
        .cm-track {
          display: flex;
          gap: 10px;
          width: max-content;
          animation: cm-scroll-left linear infinite;
          will-change: transform;
        }
        .cm-track-reverse {
          animation-name: cm-scroll-right;
        }

        @keyframes cm-scroll-left {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        @keyframes cm-scroll-right {
          0%   { transform: translateX(-33.333%); }
          100% { transform: translateX(0); }
        }

        /* Pause on hover */
        .cm-marquee-wrap:hover .cm-track {
          animation-play-state: paused;
        }

        /* Pill */
        .cm-pill {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 10px 16px;
          white-space: nowrap;
          cursor: default;
          transition: border-color .15s, box-shadow .15s;
        }
        .cm-pill:hover {
          border-color: #cbd5e1;
          box-shadow: 0 2px 8px rgba(0,0,0,.06);
        }
        .cm-avatar {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          color: #fff;
          font-size: .7rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          letter-spacing: .02em;
        }
        .cm-pill-text {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }
        .cm-pill-name {
          font-size: .82rem;
          font-weight: 700;
          color: #0f172a;
          line-height: 1;
        }
        .cm-pill-type {
          font-size: .68rem;
          color: #94a3b8;
          font-weight: 500;
        }

        /* Footer */
        .cm-footer {
          text-align: center;
          font-size: .72rem;
          color: #94a3b8;
          margin: 20px 0 0;
          padding: 0 20px;
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .cm-track {
            animation: none !important;
          }
          .cm-row {
            overflow-x: auto;
          }
        }
      `}</style>
    </section>
  );
}
