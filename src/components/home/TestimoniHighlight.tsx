"use client";

/**
 * TestimoniHighlight — Grid testimoni unggulan untuk homepage.
 *
 * Menampilkan 4 testimoni approved dengan avg_rating tertinggi.
 * Layout: 1 card besar (featured) + 3 card kecil di grid.
 *
 * Foto: support photo_type "initial" (inisial nama), "anonymous" (🙈),
 * dan "upload" (base64 dari Supabase).
 */

import Image from "next/image";
import { Star } from "lucide-react";
import type { Testimoni } from "@/types/testimoni";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="th-stars" aria-label={`Rating ${rating.toFixed(1)} dari 5`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`h-3.5 w-3.5 ${
            s <= Math.round(rating)
              ? "fill-amber-400 text-amber-400"
              : "fill-slate-200 text-slate-200"
          }`}
        />
      ))}
      <span className="th-rating-num">{rating.toFixed(1)}</span>
    </div>
  );
}

function Avatar({ item }: { item: Testimoni }) {
  if (item.photo_type === "upload" && item.photo_data) {
    return (
      <Image
        src={item.photo_data}
        alt={item.client_name}
        className="th-avatar-img"
        loading="lazy"
        width={48}
        height={48}
        unoptimized
      />
    );
  }
  if (item.photo_type === "anonymous") {
    return <div className="th-avatar-init">🙈</div>;
  }
  // Default: inisial nama
  const initials = item.client_name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const colors = [
    "#1e3a8a", "#7c3aed", "#0369a1",
    "#16a34a", "#d97706", "#dc2626",
  ];
  const color = colors[item.client_name.charCodeAt(0) % colors.length];

  return (
    <div className="th-avatar-init" style={{ background: color }}>
      {initials}
    </div>
  );
}

const SERVICE_LABELS: Record<string, string> = {
  CV: "CV ATS Friendly",
  Lamaran: "Surat Lamaran",
  Legal: "Surat Legal",
  NPWP: "Daftar NPWP",
  Akademik: "Akademik",
  "Data Entry": "Data Entry",
  "Paket Hemat": "Paket Hemat",
};

function TestimoniCard({
  item,
  featured = false,
}: {
  item: Testimoni;
  featured?: boolean;
}) {
  return (
    <div className={`th-card ${featured ? "featured" : ""}`}>
      {/* Quote mark */}
      <div className="th-quote" aria-hidden="true"></div>

      {/* Rating */}
      <StarRating rating={item.avg_rating} />

      {/* Highlight text */}
      <p className={`th-highlight ${featured ? "featured" : ""}`}>
        {item.highlight}
      </p>

      {/* Footer */}
      <div className="th-footer">
        <Avatar item={item} />
        <div>
          <p className="th-name">{item.client_name}</p>
          <p className="th-service">
            {SERVICE_LABELS[item.service_type] ?? item.service_type}
          </p>
        </div>
      </div>
    </div>
  );
}

export function TestimoniHighlight({
  testimonials,
}: {
  testimonials: Testimoni[];
}) {
  if (testimonials.length === 0) return null;

  const [featured, ...rest] = testimonials;

  return (
    <div className="th-root">
      {/* Featured card — full width di mobile, 2 kolom di desktop */}
      <div className="th-layout">
        <div className="th-featured-col">
          <TestimoniCard item={featured} featured />
        </div>

        {rest.length > 0 && (
          <div className="th-grid-col">
            {rest.map((item) => (
              <TestimoniCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>

      <style>{`
        .th-root { width: 100%; }

        .th-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }
        @media (min-width: 768px) {
          .th-layout {
            grid-template-columns: 1fr 1fr;
          }
        }

        .th-featured-col { display: flex; flex-direction: column; }
        .th-grid-col {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }
        @media (min-width: 480px) and (max-width: 767px) {
          .th-grid-col { grid-template-columns: 1fr 1fr; }
        }

        /* Card */
        .th-card {
          position: relative;
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          box-shadow: 0 2px 8px rgba(0,0,0,.04);
          transition: box-shadow .2s, border-color .2s;
          height: 100%;
        }
        .th-card:hover {
          box-shadow: 0 4px 20px rgba(0,0,0,.08);
          border-color: #bfdbfe;
        }
        .th-card.featured {
          background: linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%);
          border-color: transparent;
          color: white;
          padding: 28px;
        }

        /* Quote mark */
        .th-quote {
          font-size: 3rem;
          line-height: 1;
          font-family: Georgia, serif;
          color: #e2e8f0;
          margin-bottom: -8px;
          margin-top: -4px;
        }
        .th-card.featured .th-quote { color: rgba(255,255,255,.2); }

        /* Stars */
        .th-stars {
          display: flex;
          align-items: center;
          gap: 2px;
        }
        .th-rating-num {
          font-size: .75rem;
          font-weight: 700;
          color: #64748b;
          margin-left: 4px;
        }
        .th-card.featured .th-rating-num { color: rgba(255,255,255,.7); }

        /* Highlight */
        .th-highlight {
          font-size: .875rem;
          color: #334155;
          line-height: 1.65;
          flex: 1;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .th-highlight.featured {
          color: rgba(255,255,255,.9);
          font-size: 1rem;
          -webkit-line-clamp: 6;
        }

        /* Footer */
        .th-footer {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 4px;
          padding-top: 12px;
          border-top: 1px solid #f1f5f9;
        }
        .th-card.featured .th-footer {
          border-top-color: rgba(255,255,255,.15);
        }

        /* Avatar */
        .th-avatar-img {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          object-fit: cover;
          flex-shrink: 0;
        }
        .th-avatar-init {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: #3b82f6;
          color: white;
          font-size: .8rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          letter-spacing: .02em;
        }

        /* Name & service */
        .th-name {
          font-size: .85rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
        }
        .th-card.featured .th-name { color: white; }
        .th-service {
          font-size: .72rem;
          color: #64748b;
          margin: 0;
          font-weight: 500;
        }
        .th-card.featured .th-service { color: rgba(255,255,255,.6); }
      `}</style>
    </div>
  );
}
