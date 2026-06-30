import { createServerSupabaseClient } from "@/lib/supabase-server";
import type { RepositoryResult } from "@/types/common";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface LamaranClientInsert {
  full_name:    string;
  email:        string;
  phone_number: string;
  order_code:   string;
}

export interface LamaranSubmissionInsert {
  client_id:         string;
  domicile:          string;
  company_name:      string;
  position_target:   string;
  job_source:        string | null;
  hr_name:           string | null;
  motivation:        string;
  job_keywords:      string | null;
  tone_surat:        string | null;
  experience_detail: Record<string, unknown>;
}

// ─── Repository ───────────────────────────────────────────────────────────────

/**
 * LamaranRepository — HANYA bertanggung jawab atas akses database.
 * Tidak boleh mengandung business logic atau validasi.
 */
export const LamaranRepository = {
  async insertClient(
    data: LamaranClientInsert
  ): Promise<RepositoryResult<{ id: string }>> {
    const supabase = await createServerSupabaseClient();

    const { data: client, error } = await supabase
      .from("clients")
      .insert({
        full_name:    data.full_name,
        email:        data.email,
        phone_number: data.phone_number,
        service_type: "Lamaran",
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

  async insertSubmission(
    data: LamaranSubmissionInsert
  ): Promise<RepositoryResult<void>> {
    const supabase = await createServerSupabaseClient();

    const { error } = await supabase.from("lamaran_submissions").insert({
      client_id:         data.client_id,
      domicile:          data.domicile,
      company_name:      data.company_name,
      position_target:   data.position_target,
      job_source:        data.job_source,
      hr_name:           data.hr_name,
      motivation:        data.motivation,
      job_keywords:      data.job_keywords,
      tone_surat:        data.tone_surat,
      experience_detail: data.experience_detail,
    });

    if (error) {
      return { ok: false, error: error.message };
    }

    return { ok: true, data: undefined };
  },
};
