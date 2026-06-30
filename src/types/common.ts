// ─── Generic Action & API Types ───────────────────────────────────────────────

/**
 * Generic server action result.
 * Gunakan sebagai return type dari semua Server Actions.
 */
export interface ActionResult<T = undefined> {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
  data?: T;
  orderCode?: string;
}

/**
 * Generic API response wrapper.
 * Gunakan untuk route handlers / API responses.
 */
export interface ApiResponse<T = unknown> {
  ok: boolean;
  message?: string;
  data?: T;
  errors?: Partial<Record<string, string>>;
}

/**
 * Generic form state untuk multi-step forms.
 */
export interface FormState<T> {
  data: T;
  errors: Record<string, string>;
  isLoading: boolean;
  submitError: string | null;
  currentStep: number;
  invalidSteps: number[];
  orderCode: string | null;
}

/**
 * Generic pagination result dari Supabase query.
 */
export interface PaginationResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

/**
 * Generic repository result — memisahkan data dari error.
 */
export type RepositoryResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

// ─── Shared Enums ─────────────────────────────────────────────────────────────

export type CareerStatusBase =
  | "fresh_graduate"
  | "profesional"
  | "career_switcher";

export type ServiceType =
  | "CV"
  | "Lamaran"
  | "Legal"
  | "NPWP"
  | "Akademik"
  | "Data Entry"
  | "Paket Hemat";

export type OrderStatus =
  | "pending"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "revision";
