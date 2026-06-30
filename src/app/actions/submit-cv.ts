"use server";

import { CvService } from "@/services/cv.service";
import type { ActionResult } from "@/types/common";

/**
 * Server Action: submit form CV ATS Friendly.
 * Validasi, sanitasi, dan akses database didelegasikan ke CvService.
 */
export async function submitCvAction(formData: FormData): Promise<ActionResult> {
  return CvService.submit(formData);
}
