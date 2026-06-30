"use client";

/**
 * PriceEstimator — Widget estimasi harga instan di homepage.
 *
 * UX flow:
 * 1. User pilih layanan via pill selector
 * 2. Pilih opsi turunan (kompleksitas/jenis) jika ada
 * 3. Harga muncul dengan animasi flip — langsung di halaman, tanpa WA dulu
 * 4. CTA "Pesan Sekarang" buka WA dengan pesan kontekstual
 *
 * Performa: pure client, zero dependency tambahan, CSS transition murni.
 */

import { useState, useEffect, useRef } from "react";
import {
  FileText,
  Mail,
  Building2,
  CreditCard,
  GraduationCap,
  Database,
  Package,
  ChevronRight,
  Zap,
  Clock,
  RefreshCw,
  MessageCircle,
} from "lucide-react";

const ADMIN_WA = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP ?? "6285801193410";

// ─── Data harga per layanan ───────────────────────────────────────────────────

interface PriceOption {
  label: string;
  price: string;       // display string, misal "Rp 35.000"
  priceNum: number;    // angka asli untuk animasi
  duration: string;    // estimasi waktu
  note?: string;       // catatan kecil opsional
}

interface ServicePricing {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;       // Tailwind bg class untuk icon
  textColor: string;
  options: PriceOption[];
}

const SERVICES: ServicePricing[] = [
  {
    id: "cv",
    label: "CV ATS",
    icon: <FileText className="h-4 w-4" />,
    color: "bg-blue-100",
    textColor: "text-blue-700",
    options: [
      { label: "Fresh Graduate", price: "Rp 35.000", priceNum: 35000, duration: "1–2 hari kerja", note: "Cocok untuk lulusan baru" },
      { label: "Profesional (1–5 thn)", price: "Rp 50.000", priceNum: 50000, duration: "1–2 hari kerja", note: "Pengalaman kerja ada" },
      { label: "Senior / Manajer", price: "Rp 75.000", priceNum: 75000, duration: "2–3 hari kerja", note: "Multi-halaman, detail penuh" },
      { label: "Revisi CV Lama", price: "Rp 25.000", priceNum: 25000, duration: "1 hari kerja", note: "Upload CV, kami optimalkan" },
    ],
  },
  {
    id: "lamaran",
    label: "Surat Lamaran",
    icon: <Mail className="h-4 w-4" />,
    color: "bg-violet-100",
    textColor: "text-violet-700",
    options: [
      { label: "Standar", price: "Rp 20.000", priceNum: 20000, duration: "< 1 hari kerja" },
      { label: "Premium (personal brand)", price: "Rp 35.000", priceNum: 35000, duration: "1 hari kerja", note: "Riset perusahaan termasuk" },
      { label: "Paket CV + Lamaran", price: "Rp 55.000", priceNum: 55000, duration: "1–2 hari kerja", note: "Hemat Rp 15.000" },
    ],
  },
  {
    id: "legal",
    label: "Surat Legal",
    icon: <Building2 className="h-4 w-4" />,
    color: "bg-emerald-100",
    textColor: "text-emerald-700",
    options: [
      { label: "Surat Kuasa", price: "Rp 25.000", priceNum: 25000, duration: "< 1 hari kerja" },
      { label: "Surat Perjanjian", price: "Rp 45.000", priceNum: 45000, duration: "1–2 hari kerja", note: "Konsultasi dulu via WA" },
      { label: "Surat Pernyataan", price: "Rp 20.000", priceNum: 20000, duration: "< 1 hari kerja" },
      { label: "Dokumen Kompleks", price: "Mulai Rp 75.000", priceNum: 75000, duration: "2–3 hari kerja", note: "Harga sesuai kebutuhan" },
    ],
  },
  {
    id: "npwp",
    label: "NPWP",
    icon: <CreditCard className="h-4 w-4" />,
    color: "bg-amber-100",
    textColor: "text-amber-700",
    options: [
      { label: "NPWP Pribadi", price: "Rp 30.000", priceNum: 30000, duration: "1–3 hari kerja", note: "Termasuk pendampingan" },
      { label: "NPWP Badan Usaha", price: "Rp 75.000", priceNum: 75000, duration: "3–5 hari kerja", note: "PT, CV, UD, dll" },
    ],
  },
  {
    id: "akademik",
    label: "Akademik",
    icon: <GraduationCap className="h-4 w-4" />,
    color: "bg-rose-100",
    textColor: "text-rose-700",
    options: [
      { label: "Makalah / Essay", price: "Mulai Rp 30.000", priceNum: 30000, duration: "Sesuai deadline", note: "Harga per halaman" },
      { label: "Presentasi PPT", price: "Mulai Rp 5.000/Slide", priceNum: 5000, duration: "1–2 hari kerja" },
      { label: "Coding / Project", price: "Mulai Rp 50.000", priceNum: 50000, duration: "Sesuai kesepakatan" },
    ],
  },
  {
    id: "data-entry",
    label: "Data Entry",
    icon: <Database className="h-4 w-4" />,
    color: "bg-cyan-100",
    textColor: "text-cyan-700",
    options: [
      { label: "< 100 baris", price: "Rp 25.000", priceNum: 25000, duration: "< 1 hari kerja" },
      { label: "100–500 baris", price: "Rp 50.000", priceNum: 50000, duration: "1–2 hari kerja" },
      { label: "> 500 baris", price: "Mulai Rp 100.000", priceNum: 100000, duration: "Sesuai volume", note: "Makin banyak makin hemat" },
    ],
  },
  {
    id: "paket",
    label: "Paket Hemat",
    icon: <Package className="h-4 w-4" />,
    color: "bg-orange-100",
    textColor: "text-orange-700",
    options: [
      { label: "Paket Starter", price: "Rp 40.000", priceNum: 40000, duration: "1–2 hari kerja", note: "CV + Surat Lamaran" },
      { label: "Paket Lengkap", price: "Rp 120.000", priceNum: 120000, duration: "3–4 hari kerja", note: "CV + Lamaran + NPWP" },
      { label: "Paket Akademik Pro", price: "Rp 150.000", priceNum: 150000, duration: "Sesuai deadline", note: "Coding ringan + PPT + Revisi" },
    ],
  },
];

// Animasi flip angka
function useFlipNumber(value: string) {
  const [display, setDisplay] = useState(value);
  const [flipping, setFlipping] = useState(false);
  const prev = useRef(value);

  useEffect(() => {
    if (prev.current === value) return;
    setFlipping(true);
    const t = setTimeout(() => {
      setDisplay(value);
      setFlipping(false);
      prev.current = value;
    }, 180);
    return () => clearTimeout(t);
  }, [value]);

  return { display, flipping };
}

export function PriceEstimator() {
  const [selectedService, setSelectedService] = useState<string>("cv");
  const [selectedOption, setSelectedOption] = useState<number>(0);

  const service = SERVICES.find((s) => s.id === selectedService)!;
  const option = service.options[selectedOption];

  // Reset option saat ganti layanan
  const handleServiceChange = (id: string) => {
    setSelectedService(id);
    setSelectedOption(0);
  };

  const { display: priceDisplay, flipping } = useFlipNumber(option.price);

  const waMessage = `Halo, saya tertarik dengan layanan ${service.label} — ${option.label} (${option.price}). Bisa dibantu?`;
  const waUrl = `https://wa.me/${ADMIN_WA}?text=${encodeURIComponent(waMessage)}`;

  return (
    <div className="pe-root">
      {/* ── Header ── */}
      <div className="pe-header">
        <div className="pe-header-icon">
          <Zap className="h-4 w-4" />
        </div>
        <div>
          <p className="pe-header-title">Estimasi Harga Instan</p>
          <p className="pe-header-sub">Pilih layanan untuk lihat harga</p>
        </div>
      </div>

      {/* ── Service selector ── */}
      <div className="pe-services">
        {SERVICES.map((s) => (
          <button
            key={s.id}
            onClick={() => handleServiceChange(s.id)}
            className={`pe-service-pill ${selectedService === s.id ? "active" : ""}`}
            aria-pressed={selectedService === s.id}
          >
            <span className={`pe-service-icon ${s.color} ${s.textColor}`}>
              {s.icon}
            </span>
            {s.label}
          </button>
        ))}
      </div>

      {/* ── Option selector ── */}
      <div className="pe-options">
        {service.options.map((opt, i) => (
          <button
            key={opt.label}
            onClick={() => setSelectedOption(i)}
            className={`pe-option ${selectedOption === i ? "active" : ""}`}
            aria-pressed={selectedOption === i}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* ── Price result ── */}
      <div className="pe-result">
        <div className="pe-result-left">
          <p className="pe-result-label">Estimasi harga</p>
          <p className={`pe-result-price ${flipping ? "flipping" : ""}`}>
            {priceDisplay}
          </p>
          {option.note && (
            <p className="pe-result-note">{option.note}</p>
          )}
        </div>
        <div className="pe-result-right">
          <div className="pe-duration">
            <Clock className="h-3.5 w-3.5" />
            <span>{option.duration}</span>
          </div>
          <div className="pe-revisi">
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Revisi termasuk</span>
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="pe-cta"
      >
        <MessageCircle className="h-4 w-4" />
        Pesan Sekarang via WhatsApp
        <ChevronRight className="h-4 w-4 ml-auto" />
      </a>

      <p className="pe-disclaimer">
        * Harga dapat berubah sesuai kompleksitas. Konsultasi gratis via WhatsApp.
      </p>

      <style>{`
        .pe-root {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          padding: 20px;
          box-shadow: 0 4px 24px rgba(0,0,0,.06);
          display: flex;
          flex-direction: column;
          gap: 16px;
          width: 100%;
        }

        /* Header */
        .pe-header {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .pe-header-icon {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          background: #eff6ff;
          color: #2563eb;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .pe-header-title {
          font-size: .9rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 1px;
        }
        .pe-header-sub {
          font-size: .75rem;
          color: #94a3b8;
          margin: 0;
        }

        /* Service pills */
        .pe-services {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
        }
        .pe-service-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 20px;
          border: 1.5px solid #e2e8f0;
          background: #f8fafc;
          font-size: .78rem;
          font-weight: 600;
          color: #64748b;
          cursor: pointer;
          transition: all .15s ease;
          white-space: nowrap;
        }
        .pe-service-pill:hover {
          border-color: #93c5fd;
          color: #1e40af;
          background: #eff6ff;
        }
        .pe-service-pill.active {
          border-color: #3b82f6;
          background: #eff6ff;
          color: #1d4ed8;
        }
        .pe-service-icon {
          width: 22px;
          height: 22px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        /* Options */
        .pe-options {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .pe-option {
          padding: 5px 12px;
          border-radius: 8px;
          border: 1.5px solid #e2e8f0;
          background: #fff;
          font-size: .78rem;
          font-weight: 500;
          color: #475569;
          cursor: pointer;
          transition: all .15s ease;
        }
        .pe-option:hover {
          border-color: #94a3b8;
          color: #0f172a;
        }
        .pe-option.active {
          border-color: #1e40af;
          background: #1e3a8a;
          color: #fff;
          font-weight: 600;
        }

        /* Result */
        .pe-result {
          background: linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%);
          border: 1px solid #bfdbfe;
          border-radius: 14px;
          padding: 14px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .pe-result-label {
          font-size: .72rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: .05em;
          color: #64748b;
          margin: 0 0 4px;
        }
        .pe-result-price {
          font-size: 1.6rem;
          font-weight: 900;
          color: #1e3a8a;
          margin: 0;
          line-height: 1;
          font-variant-numeric: tabular-nums;
          transition: opacity .18s ease, transform .18s ease;
        }
        .pe-result-price.flipping {
          opacity: 0;
          transform: translateY(-6px);
        }
        .pe-result-note {
          font-size: .75rem;
          color: #64748b;
          margin: 4px 0 0;
        }
        .pe-result-right {
          display: flex;
          flex-direction: column;
          gap: 6px;
          align-items: flex-end;
          flex-shrink: 0;
        }
        .pe-duration, .pe-revisi {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: .75rem;
          color: #475569;
          font-weight: 500;
          white-space: nowrap;
        }
        .pe-duration { color: #0369a1; }
        .pe-revisi   { color: #16a34a; }

        /* CTA */
        .pe-cta {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #16a34a;
          color: white;
          border-radius: 12px;
          padding: 12px 16px;
          font-size: .88rem;
          font-weight: 700;
          text-decoration: none;
          transition: background .15s ease, transform .15s ease;
        }
        .pe-cta:hover {
          background: #15803d;
          transform: translateY(-1px);
        }
        .pe-cta:active {
          transform: translateY(0);
        }

        /* Disclaimer */
        .pe-disclaimer {
          font-size: .7rem;
          color: #94a3b8;
          margin: 0;
          text-align: center;
        }

        @media (prefers-reduced-motion: reduce) {
          .pe-result-price { transition: none; }
          .pe-cta { transition: none; }
        }
      `}</style>
    </div>
  );
}
