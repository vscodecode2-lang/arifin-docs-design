import { createServerSupabaseClient } from "@/lib/supabase-server";
import type { Metadata } from "next";
import { TestimoniClient } from "./TestimoniClient";
import type { Testimoni } from "@/types/testimoni";

export const metadata: Metadata = {
  title: "Testimoni Klien | Arifin Docs & Design",
  description:
    "Baca testimoni nyata dari klien yang telah menggunakan layanan CV ATS, Surat Lamaran, NPWP, dan layanan dokumen profesional lainnya.",
};

export const dynamic = "force-dynamic";

export default async function TestimoniPage() {
  const supabase = await createServerSupabaseClient();

  const { data: testimonials } = await supabase
    .from("testimonials")
    .select("*")
    .eq("status", "approved")
    .order("approved_at", { ascending: false });

  return (
    <TestimoniClient testimonials={(testimonials ?? []) as Testimoni[]} />
  );
}
