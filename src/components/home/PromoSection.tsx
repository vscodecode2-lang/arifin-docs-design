import { MessageCircle } from "lucide-react";

export const ContactInfo = () => {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-col items-center gap-2">
        <h2 className="text-2xl font-bold">Hubungi Kami</h2>
        <p className="text-sm text-gray-600">
          Ada pertanyaan atau ingin konsultasi? Hubungi kami.
        </p>
      </div>
      <div className="flex flex-col items-center gap-2">
        <a
          href={`https://wa.me/${process.env.NEXT_PUBLIC_ADMIN_WHATSAPP ?? "6285801193410"}?text=${encodeURIComponent("Halo Arifin Docs & Design, saya ingin konsultasi terlebih dahulu mengenai layanan yang Anda tawarkan.")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-[#25D366]/10 px-6 py-3 font-semibold text-[#25D366] border border-[#25D366]/50 transition-all hover:bg-[#25D366]/20 hover:border-[#25D366]/70"
        >
          <MessageCircle className="h-4 w-4" />
          Hubungi Sekarang
        </a>
      </div>
    </div>
  );
};