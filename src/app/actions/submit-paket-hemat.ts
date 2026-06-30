"use server";

import { PaketHematService } from "@/services/paket.service";
import type { PaketHematActionResult } from "@/types/paket-hemat";

/**
 * Server Action: submit form Paket Hemat (CV + Lamaran).
 * Validasi, sanitasi, dan akses database didelegasikan ke PaketHematService.
 */
export async function submitPaketHematAction(
  formData: FormData
): Promise<PaketHematActionResult> {
  return PaketHematService.submit(formData);
}
