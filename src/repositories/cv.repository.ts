import { createServerSupabaseClient } from "@/lib/supabase-server";
import type { RepositoryResult } from "@/types/common";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CvClientInsert {
  full_name:    string;
  email:        string;
  phone_number: string;
  order_code:   string;
}

export interface CvSubmissionInsert {
  client_id:         string;
  target_position:   string;
  domicile:          string;
  education_history: EducationHistoryItem[];
  work_experience:   Record<string, unknown>;
  file_url:          string | null;
}

export interface EducationHistoryItem {
  institution: string;
  major:       string;
  year_start:  string;
  year_end:    string;
  gpa:         string | null;
}

// ─── Repository ───────────────────────────────────────────────────────────────

/**
 * CvRepository — HANYA bertanggung jawab atas akses database.
 * Tidak boleh mengandung business logic atau validasi.
 */
export const CvRepository = {
  /**
   * Insert record ke tabel `clients` dan kembalikan id-nya.
   */
  async insertClient(
    data: CvClientInsert
  ): Promise<RepositoryResult<{ id: string }>> {
    const supabase = await createServerSupabaseClient();

    const { data: client, error } = await supabase
      .from("clients")
      .insert({
        full_name:    data.full_name,
        email:        data.email,
        phone_number: data.phone_number,
        service_type: "CV",
        status:       "pending",
        order_code:   data.order_code,
      })
      .select("id")
      .single();

    if (error || !client) {
      return { ok: false, error: error?.message ?? "clients insert failed" };
    }

    return { ok: true, data: { id: client.id } };
  },

  /**
   * Insert record ke tabel `cv_submissions`.
   */
  async insertSubmission(
    data: CvSubmissionInsert
  ): Promise<RepositoryResult<void>> {
    const supabase = await createServerSupabaseClient();

    const { error } = await supabase.from("cv_submissions").insert({
      client_id:         data.client_id,
      target_position:   data.target_position,
      domicile:          data.domicile,
      education_history: data.education_history,
      work_experience:   data.work_experience,
      file_url:          data.file_url,
    });

    if (error) {
      return { ok: false, error: error.message };
    }

    return { ok: true, data: undefined };
  },
};
