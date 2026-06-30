"use server";

import { LamaranService } from "@/services/lamaran.service";
import type { LamaranActionResult } from "@/types/lamaran";

/**
 * Server Action: submit form Surat Lamaran Profesional.
 * Validasi, sanitasi, dan akses database didelegasikan ke LamaranService.
 */
export async function submitLamaranAction(
  formData: FormData
): Promise<LamaranActionResult> {
  return LamaranService.submit(formData);
}
