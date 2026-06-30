"use server";

import { createServerSupabaseClient } from "@/lib/supabase-server";
import { createAdminSupabaseClient } from "@/lib/supabase-admin";
import { requireAdminUser } from "@/lib/auth-admin";
import { revalidatePath } from "next/cache";
import { SERVICE_LABELS } from "@/lib/invoice-config";

// ─── Types ────────────────────────────────────────────────────

export interface InvoiceData {
  id:             string;
  invoice_number: string;
  created_at:     string;
  client_id:      string | null;
  order_code?:    string | null;
  client_name:    string;
  client_email:   string;
  client_phone:   string;
  service_type:   string;
  service_label:  string;
  price:          number;
  notes:          string | null;
  payment_status: "unpaid" | "paid";
  paid_at:        string | null;
  sent_via_wa:    boolean;
  sent_via_email: boolean;
  sent_at:        string | null;
}

export interface GenerateInvoiceResult {
  success:  boolean;
  invoice?: InvoiceData;
  error?:   string;
}

// ─── Generate Invoice ─────────────────────────────────────────

export async function generateInvoice(
  clientId:    string,
  clientName:  string,
  clientEmail: string,
  clientPhone: string,
  serviceType: string,
  price:       number,
  notes?:      string
): Promise<GenerateInvoiceResult> {
  try {
    const supabase = await createServerSupabaseClient();
    const admin = await requireAdminUser(supabase);
    if (!admin) return { success: false, error: "Unauthorized" };

    const { data: clientRow, error: clientLookupError } = await supabase
      .from("clients")
      .select("order_code")
      .eq("id", clientId)
      .single();

    if (clientLookupError) {
      return { success: false, error: clientLookupError.message };
    }

    // Generate nomor invoice via fungsi SQL
    const { data: numData } = await supabase
      .rpc("generate_invoice_number");

    const invoiceNumber = numData as string;

    const serviceLabel = SERVICE_LABELS[serviceType] ?? serviceType;

    const { data: invoice, error } = await supabase
      .from("invoices")
      .insert({
        invoice_number: invoiceNumber,
        client_id:      clientId,
        order_code:     clientRow?.order_code ?? null,
        client_name:    clientName,
        client_email:   clientEmail,
        client_phone:   clientPhone,
        service_type:   serviceType,
        service_label:  serviceLabel,
        price,
        notes:          notes ?? null,
        payment_status: "unpaid",
      })
      .select("*")
      .single();

    if (error) return { success: false, error: error.message };

    const invoiceWithOrderCode: InvoiceData = {
      ...(invoice as InvoiceData),
      order_code: (invoice as InvoiceData).order_code ?? clientRow?.order_code ?? null,
    };

    // Update status klien ke completed
    await supabase
      .from("clients")
      .update({ status: "completed" })
      .eq("id", clientId);

    revalidatePath("/dashboard");
    return { success: true, invoice: invoiceWithOrderCode };
  } catch {
    return { success: false, error: "Terjadi kesalahan server." };
  }
}

// ─── Update Payment Status ────────────────────────────────────

export async function updatePaymentStatus(
  invoiceId:     string,
  paymentStatus: "unpaid" | "paid"
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createServerSupabaseClient();
    const admin = await requireAdminUser(supabase);
    if (!admin) return { success: false, error: "Unauthorized" };

    const { error } = await supabase
      .from("invoices")
      .update({
        payment_status: paymentStatus,
        paid_at: paymentStatus === "paid" ? new Date().toISOString() : null,
      })
      .eq("id", invoiceId);

    if (error) return { success: false, error: error.message };
    revalidatePath("/dashboard");
    return { success: true };
  } catch {
    return { success: false, error: "Terjadi kesalahan server." };
  }
}

// ─── Mark Invoice Sent ────────────────────────────────────────

export async function markInvoiceSent(
  invoiceId: string,
  via:       "wa" | "email" | "both"
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createServerSupabaseClient();
    const admin = await requireAdminUser(supabase);
    if (!admin) return { success: false, error: "Unauthorized" };

    const update: Record<string, boolean | string> = {
      sent_at: new Date().toISOString(),
    };
    if (via === "wa"    || via === "both") update.sent_via_wa    = true;
    if (via === "email" || via === "both") update.sent_via_email = true;

    const { error } = await supabase
      .from("invoices")
      .update(update)
      .eq("id", invoiceId);

    if (error) return { success: false, error: error.message };
    revalidatePath("/dashboard");
    return { success: true };
  } catch {
    return { success: false, error: "Terjadi kesalahan server." };
  }
}

// ─── Get Invoice by ID (for public page) ─────────────────────

export async function getInvoiceById(
  invoiceId: string
): Promise<{ success: boolean; data?: InvoiceData; error?: string }> {
  try {
    // CATATAN: halaman /invoice/[id] bersifat publik (diakses lewat link
    // WhatsApp tanpa login). Sengaja pakai admin client (service role) yang
    // melewati RLS — bukan createServerSupabaseClient() — karena pengunjung
    // anonim tidak punya session, sehingga query dengan client biasa akan
    // diblokir RLS. Lihat src/lib/supabase-admin.ts untuk detail keamanan.
    const supabase = createAdminSupabaseClient();
    const { data, error } = await supabase
      .from("invoices")
      // AUDIT HIGH-2: select kolom eksplisit (bukan "*") agar kolom baru
      // yang ditambahkan ke tabel invoices di masa depan tidak otomatis
      // ikut terekspos lewat halaman publik /invoice/[id].
      .select(
        "id, invoice_number, created_at, client_id, order_code, client_name, client_email, client_phone, service_type, service_label, price, notes, payment_status, paid_at, sent_via_wa, sent_via_email, sent_at"
      )
      .eq("id", invoiceId)
      .single();

    if (error) return { success: false, error: "Invoice tidak ditemukan." };

    const invoice = data as InvoiceData;
    if (invoice.client_id) {
      const { data: clientRow } = await supabase
        .from("clients")
        .select("order_code")
        .eq("id", invoice.client_id)
        .single();

      if (clientRow?.order_code) {
        invoice.order_code = clientRow.order_code;
      }
    }

    return { success: true, data: invoice };
  } catch {
    return { success: false, error: "Terjadi kesalahan server." };
  }
}

// ─── Get Invoices for Dashboard ──────────────────────────────

export async function getInvoiceByClientId(
  clientId: string
): Promise<InvoiceData | null> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase
      .from("invoices")
      .select("*")
      .eq("client_id", clientId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    const invoice = data as InvoiceData | null;
    if (!invoice) return null;

    const { data: clientRow } = await supabase
      .from("clients")
      .select("order_code")
      .eq("id", clientId)
      .single();

    if (clientRow?.order_code) {
      invoice.order_code = clientRow.order_code;
    }

    return invoice;
  } catch {
    return null;
  }
}