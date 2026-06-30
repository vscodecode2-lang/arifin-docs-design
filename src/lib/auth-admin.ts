import type { SupabaseClient, User } from "@supabase/supabase-js";

/**
 * Role/admin allowlist check (AUDIT CRITICAL-1).
 *
 * Sebelumnya, login admin dan seluruh server actions di area admin hanya
 * memverifikasi bahwa `user` ada (siapa pun yang berhasil login dengan
 * akun Supabase valid), tanpa memverifikasi role/admin allowlist. Helper
 * ini menambahkan satu lapis pengecekan tambahan: email user harus ada
 * di ADMIN_EMAILS sebelum dianggap admin.
 *
 * Fail-closed: jika ADMIN_EMAILS tidak diset di environment, tidak ada
 * yang dianggap admin (lebih aman daripada membiarkan semua user lolos).
 */
function getAdminEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS ?? "";
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const adminEmails = getAdminEmails();
  if (adminEmails.length === 0) return false;
  return adminEmails.includes(email.toLowerCase());
}

/**
 * Dipakai di server actions area admin. Mengganti pola lama:
 *   const { data: { user } } = await supabase.auth.getUser();
 *   if (!user) return { success: false, error: "Unauthorized" };
 *
 * dengan:
 *   const admin = await requireAdminUser(supabase);
 *   if (!admin) return { success: false, error: "Unauthorized" };
 */
export async function requireAdminUser(
  supabase: SupabaseClient
): Promise<User | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdminEmail(user.email)) return null;
  return user;
}
