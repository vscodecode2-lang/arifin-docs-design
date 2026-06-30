// ══════════════════════════════════════════════════════════════
// UBAH DATA BISNIS DAN REKENING DI BAWAH INI
// ══════════════════════════════════════════════════════════════
export const BUSINESS_INFO = {
  name:    "Arifin Docs & Design",
  email:   "muhamadarifin.dev@gmail.com",
  phone:   "6285801193410",
  website: "arifindocs.id",
  // ── Rekening Bank ──────────────────────────────────────────
  bank:         "Mandiri",
  account_no:   "1360034789906",
  account_name: "Muhamad Arifin",
  // ── Opsi Pembayaran Lain (e-wallet, transfer antar bank, dll) ──
  other_payment: "DANA: 085866116382 (Muhamad Arifin)",
};

// ── Harga default per layanan (dalam Rupiah) ─────────────────
// Ubah angka di bawah sesuai harga layanan Anda
export const DEFAULT_PRICES: Record<string, number> = {
  "CV":          35_000,
  "Lamaran":     25_000,
  "Paket Hemat": 15_000,
  "Legal":       50_000,
  "NPWP":        30_000,
  "Akademik":    0,
  "Data Entry":  0,
};

// ── Label layanan ────────────────────────────────────────────
export const SERVICE_LABELS: Record<string, string> = {
  "CV":          "CV ATS Friendly",
  "Lamaran":     "Surat Lamaran Profesional",
  "Paket Hemat": "Paket Siap Kerja (CV ATS + Surat Lamaran)",
  "Legal":       "Surat Legal Profesional",
  "NPWP":        "Pendaftaran NPWP Online",
  "Akademik":    "Pendampingan Akademik",
  "Data Entry":  "Jasa Data Entry",
};