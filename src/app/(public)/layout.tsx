import type { ReactNode } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";
import { VisitorTracker } from "@/components/layout/VisitorTracker";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
      {/* Floating WA — lazy loaded, tidak blokir render */}
      <WhatsAppFloat />
      {/* Analisis pengunjung anonim — hanya mencatat path & id acak, lihat
          src/components/layout/VisitorTracker.tsx untuk detail */}
      <VisitorTracker />
    </>
  );
}
