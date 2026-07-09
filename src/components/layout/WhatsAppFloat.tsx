"use client";

/**
 * WhatsAppFloat — Floating action button WhatsApp untuk semua halaman publik.
 *
 * Desain: bukan tombol hijau bulat biasa. Pakai treatment "pill terbuka"
 * yang muncul dari kanan bawah — collapsed jadi ikon, expand jadi mini card
 * dengan konteks percakapan. Signature: glow pulse ring hijau yang berhenti
 * setelah user hover pertama (tidak mengganggu selamanya).
 *
 * Performa:
 * - Tidak ada library eksternal
 * - CSS transition murni (no framer-motion)
 * - Hanya render di client, lazy via dynamic import di layout
 * - prefers-reduced-motion dihormati
 */

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

const ADMIN_WA = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP ?? "6285801193410";

// Pesan berbeda per jalur URL — lebih personal, konversi lebih tinggi
const CONTEXT_MESSAGES: Record<string, string> = {
  "/cv-ats":        "Halo, saya tertarik dengan layanan CV ATS Friendly. Boleh info lebih lanjut?",
  "/surat-lamaran": "Halo, saya ingin tanya tentang layanan Surat Lamaran Profesional.",
  "/legal":         "Halo, saya butuh bantuan pembuatan Surat Legal. Bisa dibantu?",
  "/npwp":          "Halo, saya ingin daftar NPWP online melalui Arifin Docs. Bagaimana prosesnya?",
  "/akademik":      "Halo, saya butuh bantuan pendampingan akademik. Ada yang bisa dibantu?",
  "/data-entry":    "Halo, saya ada kebutuhan Data Entry. Bisa minta info harga?",
  "/paket-hemat":   "Halo, saya tertarik dengan Paket Hemat yang ditawarkan. Bisa jelaskan lebih lanjut?",
  "/testimoni":     "Halo, saya sudah lihat testimoninya dan tertarik menggunakan layanan. Bisa konsultasi?",
  "/kontak":        "Halo, saya ingin menghubungi tim Arifin Docs & Design.",
};

const DEFAULT_MESSAGE =
  "Halo Arifin Docs & Design, saya ingin konsultasi mengenai layanan yang tersedia.";

function getWAUrl(pathname: string): string {
  const msg =
    Object.entries(CONTEXT_MESSAGES).find(([key]) =>
      pathname.startsWith(key)
    )?.[1] ?? DEFAULT_MESSAGE;
  return `https://wa.me/${ADMIN_WA}?text=${encodeURIComponent(msg)}`;
}

// Label tooltip per halaman
const CONTEXT_LABELS: Record<string, string> = {
  "/cv-ats":        "Tanya soal CV ATS",
  "/surat-lamaran": "Tanya soal Surat Lamaran",
  "/legal":         "Tanya soal Surat Legal",
  "/npwp":          "Tanya soal Daftar NPWP",
  "/akademik":      "Tanya soal Akademik",
  "/data-entry":    "Tanya soal Data Entry",
  "/paket-hemat":   "Tanya soal Paket Hemat",
};

const DEFAULT_LABEL = "Chat konsultasi gratis";

function getLabel(pathname: string): string {
  return (
    Object.entries(CONTEXT_LABELS).find(([key]) =>
      pathname.startsWith(key)
    )?.[1] ?? DEFAULT_LABEL
  );
}

export function WhatsAppFloat() {
  const pathname = usePathname() ?? "/";
  const [expanded, setExpanded] = useState(false);
  const [hasHovered, setHasHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  // Auto-expand sekali setelah 4 detik untuk menarik perhatian (desktop only)
  const [autoShown, setAutoShown] = useState(false);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Auto-expand setelah 4 detik HANYA di desktop, tutup otomatis setelah 6 detik
  useEffect(() => {
    if (autoShown || isMobile) return;
    const openTimer = setTimeout(() => {
      setExpanded(true);
      setAutoShown(true);
    }, 4000);
    const closeTimer = setTimeout(() => {
      setExpanded(false);
    }, 10000);
    return () => {
      clearTimeout(openTimer);
      clearTimeout(closeTimer);
    };
  }, [autoShown, isMobile]);

  const handleMouseEnter = useCallback(() => {
    setExpanded(true);
    if (!hasHovered) setHasHovered(true);
  }, [hasHovered]);

  const handleMouseLeave = useCallback(() => {
    setExpanded(false);
  }, []);

  // Close bubble jika ada form yang sedang di-focus (mencegah gangguan saat input)
  useEffect(() => {
    const handleFocusIn = () => {
      // Jika form input di-focus, tutup bubble otomatis
      setExpanded(false);
    };

    document.addEventListener("focusin", handleFocusIn);
    return () => document.removeEventListener("focusin", handleFocusIn);
  }, []);

  const waUrl = getWAUrl(pathname);
  const label = getLabel(pathname);

  return (
    <div
      className="wa-float-root"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* ── Bubble percakapan — muncul saat expand ── */}
      <div
        className="wa-bubble"
        aria-hidden={!expanded}
        style={{ opacity: expanded ? 1 : 0, transform: expanded ? "translateY(0) scale(1)" : "translateY(8px) scale(0.95)" }}
      >
        <div className="wa-bubble-avatar">
          <Image src="/logo.avif" alt="Arifin Docs & Design" fill sizes="34px" className="object-cover" />
        </div>
        <div className="wa-bubble-body">
          <p className="wa-bubble-name">Arifin Docs &amp; Design</p>
          <p className="wa-bubble-msg">{label} 👋</p>
        </div>
      </div>

      {/* ── Tombol utama ── */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="wa-btn"
        aria-label="Chat WhatsApp dengan Arifin Docs & Design"
        onClick={() => setHasHovered(true)}
      >
        {/* Pulse ring — berhenti setelah hover pertama */}
        {!hasHovered && <span className="wa-pulse" aria-hidden="true" />}

        {/* WhatsApp SVG icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="wa-icon"
          aria-hidden="true"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>

      <style>{`
        .wa-float-root {
          position: fixed;
          bottom: 28px;
          right: 24px;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 10px;
        }

        /* ── Bubble ── */
        .wa-bubble {
          background: #fff;
          border-radius: 16px 16px 4px 16px;
          box-shadow: 0 4px 24px rgba(0,0,0,.12), 0 1px 4px rgba(0,0,0,.06);
          padding: 12px 14px;
          display: flex;
          align-items: center;
          gap: 10px;
          max-width: 220px;
          transition: opacity .22s ease, transform .22s ease;
          pointer-events: none;
          will-change: opacity, transform;
        }
        .wa-bubble-avatar {
          position: relative;
          flex-shrink: 0;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          overflow: hidden;
          background: #fff;
          border: 1px solid rgba(15, 23, 42, 0.08);
        }
        .wa-bubble-name {
          font-size: 11px;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 2px;
          white-space: nowrap;
        }
        .wa-bubble-msg {
          font-size: 12px;
          color: #475569;
          margin: 0;
          line-height: 1.4;
        }

        /* ── Button ── */
        .wa-btn {
          position: relative;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: #fff;
          color: #25d366;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 16px rgba(0,0,0,.12), 0 2px 6px rgba(0,0,0,.08);
          transition: transform .18s ease, box-shadow .18s ease;
          text-decoration: none;
          cursor: pointer;
          border: 1px solid rgba(37,211,102,.16);
        }
        .wa-btn:hover {
          transform: scale(1.08);
          box-shadow: 0 6px 24px rgba(37,211,102,.18), 0 2px 8px rgba(0,0,0,.12);
        }
        .wa-btn:active {
          transform: scale(0.96);
        }
        .wa-icon {
          width: 28px;
          height: 28px;
        }

        /* ── Pulse ring ── */
        .wa-pulse {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: rgba(37,211,102,.2);
          animation: wa-pulse-ring 2s ease-out infinite;
        }
        @keyframes wa-pulse-ring {
          0%   { transform: scale(1);   opacity: .7; }
          70%  { transform: scale(1.6); opacity: 0; }
          100% { transform: scale(1.6); opacity: 0; }
        }

        /* ── Reduced motion ── */
        @media (prefers-reduced-motion: reduce) {
          .wa-pulse { animation: none; }
          .wa-bubble { transition: none; }
          .wa-btn { transition: none; }
        }

        /* ── Mobile: geser sedikit ke kiri bawah ── */
        @media (max-width: 768px) {
          .wa-float-root {
            bottom: 16px;
            right: 12px;
          }
          .wa-btn {
            width: 48px;
            height: 48px;
          }
          .wa-icon {
            width: 24px;
            height: 24px;
          }
          .wa-bubble {
            max-width: 160px;
            padding: 10px 12px;
          }
          .wa-bubble-name {
            font-size: 10px;
          }
          .wa-bubble-msg {
            font-size: 11px;
          }
          .wa-bubble-avatar {
            width: 30px;
            height: 30px;
          }
          /* Disable pulse animation di mobile agar tidak mengganggu pengisian form */
          .wa-pulse {
            animation: none;
            display: none;
          }
          /* Reduce transition smoothness di mobile untuk performa lebih baik */
          .wa-bubble {
            transition: opacity 0.15s ease, transform 0.15s ease;
          }
          .wa-btn {
            transition: transform 0.1s ease, box-shadow 0.1s ease;
          }
          .wa-btn:hover {
            transform: scale(1.05);
            box-shadow: 0 4px 16px rgba(37,211,102,.12), 0 1px 4px rgba(0,0,0,.08);
          }
        }
      `}</style>
    </div>
  );
}
