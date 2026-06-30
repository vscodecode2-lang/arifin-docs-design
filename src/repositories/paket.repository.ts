import { createServerSupabaseClient } from "@/lib/supabase-server";
import type { RepositoryResult } from "@/types/common";
import type { EducationHistoryItem } from "./cv.repository";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PaketClientInsert {
  full_name:    string;
  email:        string;
  phone_number: string;
  order_code:   string;
}

export interface PaketSubmissionInsert {
  client_id:         string;
  target_position:   string;
  company_name:      string;
  target_industry:   string | null;
  ats_keywords:      string | null;
  add_qna_hrd:       boolean;
  domicile:          string;
  education_history: EducationHistoryItem[];
  experience_detail: Record<string, unknown>;
  job_source:        string | null;
  hr_name:           string | null;
  motivation:        string;
  tone_surat:        string | null;
  job_keywords:      string | null;
  catatan:           string | null;
  file_url:          string | null;
}

// ─── Repository ───────────────────────────────────────────────────────────────

/**
 * PaketRepository — HANYA bertanggung jawab atas akses database.
 * Tidak boleh mengandung business logic atau validasi.
 */
export const PaketRepository = {
  async insertClient(
    data: PaketClientInsert
  ): Promise<RepositoryResult<{ id: string }>> {
    const supabase = await createServerSupabaseClient();

    const { data: client, error } = await supabase
      .from("clients")
      .insert({
        full_name:    data.full_name,
        email:        data.email,
        phone_number: data.phone_number,
        service_type: "Paket Hemat",
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
    data: PaketSubmissionInsert
  ): Promise<RepositoryResult<void>> {
    const supabase = await createServerSupabaseClient();

    const { error } = await supabase.from("paket_hemat_submissions").insert({
      client_id:         data.client_id,
      target_position:   data.target_position,
      company_name:      data.company_name,
      target_industry:   data.target_industry,
      ats_keywords:       data.ats_keywords,
      add_qna_hrd:       data.add_qna_hrd,
      domicile:          data.domicile,
      education_history: data.education_history,
      experience_detail: data.experience_detail,
      job_source:        data.job_source,
      hr_name:           data.hr_name,
      motivation:        data.motivation,
      tone_surat:        data.tone_surat,
      job_keywords:      data.job_keywords,
      catatan:           data.catatan,
      file_url:          data.file_url,
    });

    if (error) {
      return { ok: false, error: error.message };
    }

    return { ok: true, data: undefined };
  },
};
