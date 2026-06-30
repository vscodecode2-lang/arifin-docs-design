"use client";

/**
 * error.tsx — Public Route Group
 *
 * Ditampilkan otomatis oleh Next.js saat terjadi runtime error
 * di Server/Client Component dalam route group (public).
 *
 * Kasus umum: Supabase timeout, fetch gagal, data undefined.
 *
 * WAJIB "use client" — error boundary hanya bisa berupa Client Component.
 */

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function PublicError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log ke console (bisa diganti dengan error reporting service seperti Sentry)
    console.error("[PublicError]", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-red-100 shadow-sm p-8 text-center space-y-5">

        {/* Icon */}
        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-2xl bg-red-50 flex items-center justify-center">
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
        </div>

        {/* Pesan */}
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-800">
            Oops, ada yang tidak beres
          </h2>
          <p className="text-sm text-slate-500">
            Halaman ini mengalami masalah saat memuat data. Silakan coba lagi —
            biasanya ini hanya gangguan sementara.
          </p>
        </div>

        {/* Error digest (untuk debugging, hanya tampil di development) */}
        {process.env.NODE_ENV === "development" && error?.message && (
          <div className="rounded-xl bg-slate-100 p-3 text-left">
            <p className="text-xs font-mono text-slate-600 break-all">
              {error.message}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-900 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Coba Lagi
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Home className="h-4 w-4" />
            Kembali ke Beranda
          </Link>
        </div>

        {/* Kontak WA jika masih error */}
        <p className="text-xs text-slate-400">
          Masalah terus terjadi?{" "}
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_ADMIN_WHATSAPP ?? "6285801193410"}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline font-medium"
          >
            Hubungi kami via WhatsApp
          </a>
        </p>
      </div>
    </div>
  );
}
