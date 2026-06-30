import type { Metadata } from "next";
import { KontakClient } from "./KontakClient";

export const metadata: Metadata = {
  title: "Kontak — Hubungi Kami ",
  description:
    "Hubungi Arifin Docs & Design via WhatsApp, Email, atau Instagram. Admin siap membantu Senin–Sabtu 08.00–21.00 WIB.",
};

export default function KontakPage() {
  return <KontakClient />;
}