import { z } from "zod";

/**
 * Skema Zod yang digunakan berulang di seluruh form & server actions.
 * Import dari sini — JANGAN duplikasi regex / constraint di tempat lain.
 */

// ─── Primitif ─────────────────────────────────────────────────────────────────

export const NameSchema = z
  .string()
  .min(3, "Nama lengkap minimal 3 karakter")
  .max(100, "Nama terlalu panjang")
  .transform((v) => v.trim());

export const NicknameSchema = z.string().max(50).optional();

export const EmailSchema = z
  .string()
  .email("Format email tidak valid")
  .transform((v) => v.trim().toLowerCase());

export const PhoneSchema = z
  .string()
  .regex(
    /^(\+62|62|0)8[1-9][0-9]{7,11}$/,
    "Format nomor WA tidak valid (contoh: 08123456789)"
  );

export const DomisiliSchema = z
  .string()
  .min(3, "Domisili wajib diisi")
  .max(100)
  .transform((v) => v.trim());

export const UrlOptionalSchema = z
  .string()
  .url("Format URL tidak valid")
  .optional()
  .or(z.literal(""));

export const YearSchema = (label: string, maxOffset = 0) =>
  z
    .string()
    .regex(/^\d{4}$/, "Tahun tidak valid")
    .refine((val) => {
      const year = parseInt(val);
      const max = new Date().getFullYear() + maxOffset;
      return year >= 1990 && year <= max;
    }, `${label} tidak valid`);

export const GpaSchema = z
  .string()
  .optional()
  .refine((val) => {
    if (!val || val === "") return true;
    const num = parseFloat(val);
    return !isNaN(num) && num >= 0 && num <= 4.0;
  }, "IPK harus antara 0.00 - 4.00");

// ─── Shared Career Status ─────────────────────────────────────────────────────

export const CareerStatusBaseSchema = z.enum(
  ["fresh_graduate", "profesional", "career_switcher"],
  { error: "Status karir wajib dipilih" }
);

export const CareerStatusExtendedSchema = z.enum(
  ["fresh_graduate", "profesional", "career_switcher", "remote_worker"],
  { error: "Status karir wajib dipilih" }
);

// ─── Sanitizer ────────────────────────────────────────────────────────────────

/**
 * Hapus karakter HTML berbahaya untuk mencegah XSS.
 * Gunakan sebelum menyimpan data ke database.
 */
export function sanitizeText(str?: string): string {
  return str?.replace(/[<>]/g, "").trim() ?? "";
}

/**
 * Konversi FormData ke plain object, null → undefined.
 * Gunakan di Server Actions sebelum parsing Zod.
 */
export function formDataToObject(
  formData: FormData,
  keys: string[]
): Record<string, string | undefined> {
  return Object.fromEntries(
    keys.map((key) => [key, (formData.get(key) as string | null) ?? undefined])
  );
}
