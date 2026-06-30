// ─── Service Questions ────────────────────────────────────────────────────────

export interface RatingQuestion {
  id: string;
  label: string;
}

export const SERVICE_QUESTIONS: Record<string, RatingQuestion[]> = {
  CV: [
    { id: "kualitas_desain",  label: "Kualitas desain & tampilan CV" },
    { id: "relevansi_keyword",label: "Relevansi keyword ATS" },
    { id: "kecepatan",        label: "Kecepatan pengerjaan" },
    { id: "responsivitas",    label: "Responsivitas & komunikasi admin" },
  ],
  Lamaran: [
    { id: "kesesuaian_tone",  label: "Kesesuaian tone & gaya penulisan" },
    { id: "personalisasi",    label: "Personalisasi isi surat" },
    { id: "kecepatan",        label: "Kecepatan pengerjaan" },
    { id: "responsivitas",    label: "Responsivitas & komunikasi admin" },
  ],
  Legal: [
    { id: "kejelasan",        label: "Kejelasan & kelengkapan dokumen" },
    { id: "kesesuaian",       label: "Kesesuaian dengan kebutuhan" },
    { id: "kecepatan",        label: "Kecepatan pengerjaan" },
    { id: "responsivitas",    label: "Responsivitas & komunikasi admin" },
  ],
  NPWP: [
    { id: "kemudahan_proses", label: "Kemudahan proses pendaftaran" },
    { id: "kelengkapan",      label: "Kelengkapan panduan & arahan" },
    { id: "kecepatan",        label: "Kecepatan proses" },
    { id: "responsivitas",    label: "Responsivitas & komunikasi admin" },
  ],
  Akademik: [
    { id: "kesesuaian",       label: "Kesesuaian dengan instruksi tugas" },
    { id: "kualitas_hasil",   label: "Kualitas hasil pengerjaan" },
    { id: "ketepatan_deadline",label: "Ketepatan deadline" },
    { id: "responsivitas",    label: "Responsivitas & komunikasi admin" },
  ],
  "Data Entry": [
    { id: "akurasi",          label: "Akurasi & ketepatan data" },
    { id: "kesesuaian_format",label: "Kesesuaian format output" },
    { id: "kecepatan",        label: "Kecepatan pengerjaan" },
    { id: "responsivitas",    label: "Responsivitas & komunikasi admin" },
  ],
};

export const SERVICE_LIST = Object.keys(SERVICE_QUESTIONS);

// ─── Testimoni Types ──────────────────────────────────────────────────────────

export type TestimoniStatus = "pending" | "approved" | "rejected";
export type PhotoType        = "initial" | "anonymous" | "upload";

export interface Testimoni {
  id:           string;
  created_at:   string;
  approved_at:  string | null;
  client_id:    string | null;
  client_name:  string;
  service_type: string;
  ratings:      Record<string, number>;  // { question_id: 1-5 }
  avg_rating:   number;
  highlight:    string;
  suggestion:   string | null;
  photo_type:   PhotoType;
  photo_data:   string | null;
  status:       TestimoniStatus;
  reject_reason:string | null;
}

// ─── Form State ───────────────────────────────────────────────────────────────

export interface VerifyResult {
  found:        boolean;
  client_id?:   string;
  client_name?: string;
  services?:    string[];  // layanan yang pernah digunakan
  error?:       string;
}

export interface TestimoniFormData {
  client_id:    string;
  client_name:  string;
  service_type: string;
  ratings:      Record<string, number>;
  highlight:    string;
  suggestion:   string;
  photo_type:   PhotoType;
  photo_data:   string | null;
}

export interface TestimoniActionResult {
  success:    boolean;
  error?:     string;
  duplicate?: boolean;  // sudah pernah submit untuk layanan ini
}
