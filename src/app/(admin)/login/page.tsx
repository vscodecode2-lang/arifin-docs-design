"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { AuthApiError } from "@supabase/auth-js";
import { verifyAdminAccess } from "@/app/actions/auth-actions";
import { Eye, EyeOff, Lock, Mail, AlertCircle, Loader2 } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface LoginFormState {
  email: string;
  password: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminLoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [form, setForm] = useState<LoginFormState>({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // ── Client-side validation ──
    if (!form.email || !form.password) {
      setErrorMessage("Email dan password wajib diisi.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setErrorMessage("Format email tidak valid.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      // BUGFIX: bersihkan dulu sesi lokal yang mungkin masih nyangkut
      // (misal refresh token basi dari sesi sebelumnya) sebelum sign-in
      // baru. scope "local" hanya menghapus cookie di browser ini, tidak
      // memanggil Supabase Auth API — jadi aman & cepat, tidak menambah
      // request rate-limit.
      await supabase.auth.signOut({ scope: "local" });

      const { error } = await supabase.auth.signInWithPassword({
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });

      if (error) {
        if (
          error instanceof AuthApiError &&
          error.code === "over_request_rate_limit"
        ) {
          setErrorMessage(
            "Terlalu banyak permintaan ke sistem login. Tunggu beberapa detik lalu coba lagi."
          );
        } else {
          setErrorMessage("Email atau password salah. Silakan coba lagi.");
        }
        return;
      }

      // AUDIT CRITICAL-1: login berhasil hanya berarti akun Supabase valid,
      // belum berarti admin. Verifikasi allowlist lewat server action
      // (single source of truth dengan middleware/server actions lain;
      // allowlist tidak boleh ikut terekspos ke bundle client) agar pesan
      // error untuk akun non-admin jelas, bukan redirect loop yang
      // membingungkan.
      const { isAdmin } = await verifyAdminAccess();
      if (!isAdmin) {
        await supabase.auth.signOut();
        setErrorMessage("Akun ini tidak memiliki akses admin.");
        return;
      }

      // Redirect ke dashboard setelah login berhasil dan lolos role check
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "AUTH_RATE_LIMIT"
      ) {
        setErrorMessage(
          "Terlalu banyak permintaan ke sistem login. Tunggu beberapa detik lalu coba lagi."
        );
      } else if (
        error instanceof Error &&
        error.message === "AUTH_SESSION_INVALID"
      ) {
        // Sesi yang baru saja dibuat ternyata langsung dianggap tidak
        // valid oleh server (jarang, biasanya sisa cookie basi). Sesi
        // lokal sudah otomatis dibersihkan di awal fungsi ini — coba
        // lagi sekali biasanya langsung berhasil.
        setErrorMessage(
          "Sesi login bermasalah. Silakan coba masuk sekali lagi."
        );
      } else {
        setErrorMessage("Terjadi kesalahan. Silakan coba beberapa saat lagi.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      {/* Card */}
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          {/* Logo mark */}
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-700 shadow-lg">
            <Lock className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">
            Masuk untuk mengelola data klien
          </p>
        </div>

        {/* Form card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Error alert */}
            {errorMessage && (
              <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                <p className="text-sm text-red-700">{errorMessage}</p>
              </div>
            )}

            {/* Email field */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-slate-700"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="admin@arifindocs.com"
                  disabled={isLoading}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-slate-700"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  disabled={isLoading}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-11 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-blue-800 hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                "Masuk ke Dashboard"
              )}
            </button>
          </form>
        </div>

        {/* Footer note */}
        <p className="mt-6 text-center text-xs text-slate-400">
          Halaman ini hanya untuk admin Arifin Docs & Design.
          <br />
          Jika ada masalah akses, hubungi pengelola sistem.
        </p>
      </div>
    </div>
  );
}
