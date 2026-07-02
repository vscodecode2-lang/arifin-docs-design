import { MessageCircle } from "lucide-react";

export function FloatingWhatsApp() {
  const ADMIN_WA = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP ?? "6285801193410";
  const WA_URL = `https://wa.me/${ADMIN_WA}?text=${encodeURIComponent("Halo Arifin Docs & Design, saya ingin konsultasi terlebih dahulu mengenai layanan yang Anda tawarkan.")}`;

  return (
    <a
      href={WA_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 rounded-full bg-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
      aria-label="Chat via WhatsApp"
    >
      <MessageCircle className="h-5 w-5 text-[#25D366]" />
    </a>
  );
}