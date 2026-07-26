"use client";

import { useState } from "react";
import {
  AlertCircle, Camera, FileText, Loader2, Mail, Phone, Send, Upload, User,
} from "lucide-react";
import { generateWhatsAppLink } from "@/lib/utils";
import { submitUpgradeCvAction } from "@/app/actions/submit-upgrade-cv";

const MAX_CV_SIZE    = 10 * 1024 * 1024;
const MAX_PHOTO_SIZE = 5 * 1024 * 1024;
const ADMIN_WA = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP ?? "6285801193410";

interface FormErrors {
  full_name?:    string;
  email?:        string;
  phone_number?: string;
  cv_file?:      string;
  photo_file?:   string;
}

const inputCls =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm placeholder:text-slate-400 " +
  "focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors";

export function UpgradeCvForm() {
  const [fullName, setFullName]       = useState("");
  const [email, setEmail]             = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [notes, setNotes]             = useState("");
  const [cvFile, setCvFile]           = useState<File | null>(null);
  const [photoFile, setPhotoFile]     = useState<File | null>(null);
  const [errors, setErrors]           = useState<FormErrors>({});
  const [isLoading, setIsLoading]     = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validate = (): FormErrors => {
    const next: FormErrors = {};

    if (!fullName.trim() || fullName.trim().length < 3) {
      next.full_name = "Nama lengkap minimal 3 karakter.";
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = "Format email tidak valid.";
    }
    if (!phoneNumber.trim() || !/^(\+62|62|0)8[1-9][0-9]{7,11}$/.test(phoneNumber.trim())) {
      next.phone_number = "Format nomor WA tidak valid (contoh: 08123456789).";
    }
    if (!cvFile) {
      next.cv_file = "Upload CV lama wajib diisi.";
    } else if (cvFile.size > MAX_CV_SIZE) {
      next.cv_file = "Ukuran file CV maksimal 10MB.";
    }
    if (photoFile && photoFile.size > MAX_PHOTO_SIZE) {
      next.photo_file = "Ukuran foto maksimal 5MB.";
    }

    return next;
  };

  const clearError = (field: keyof FormErrors) => {
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsLoading(true);

    const fd = new FormData();
    fd.append("full_name", fullName.trim());
    fd.append("email", email.trim());
    fd.append("phone_number", phoneNumber.trim());
    if (notes.trim()) fd.append("notes", notes.trim());
    if (cvFile) fd.append("cv_file", cvFile);
    if (photoFile) fd.append("photo", photoFile);

    try {
      const res = await submitUpgradeCvAction(fd);

      if (!res.success) {
        if (res.fieldErrors) {
          setErrors((prev) => ({ ...prev, ...res.fieldErrors }));
        }
        setSubmitError(res.error ?? "Gagal mengirim permintaan. Silakan coba lagi.");
        setIsLoading(false);
        return;
      }

      // Redirect ke WhatsApp dengan kode order — konsisten dengan form lain
      // (NPWP, Legal, dll): navigasi langsung, tidak ada layar "submitted"
      // yang tanggung karena redirect sudah terjadi lebih dulu.
      window.location.href = generateWhatsAppLink("Upgrade CV Lama", ADMIN_WA, res.orderCode);
    } catch {
      setSubmitError("Gagal menghubungi server. Silakan coba lagi.");
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-6 text-center">
        <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
          <FileText className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-black text-slate-900">Isi Data & Upload Dokumen</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          Untuk proses upgrade CV, kami membutuhkan data kontak Anda, CV lama, dan foto profesional terbaru.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <User className="h-4 w-4 text-blue-600" />
            Nama Lengkap
          </label>
          <input
            type="text"
            className={inputCls}
            placeholder="Nama lengkap Anda"
            value={fullName}
            onChange={(e) => { setFullName(e.target.value); clearError("full_name"); }}
          />
          {errors.full_name && (
            <p className="flex items-center gap-1 text-sm text-red-600">
              <AlertCircle className="h-4 w-4" />{errors.full_name}
            </p>
          )}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Mail className="h-4 w-4 text-blue-600" />
              Email
            </label>
            <input
              type="email"
              className={inputCls}
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); clearError("email"); }}
            />
            {errors.email && (
              <p className="flex items-center gap-1 text-sm text-red-600">
                <AlertCircle className="h-4 w-4" />{errors.email}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Phone className="h-4 w-4 text-blue-600" />
              Nomor WhatsApp
            </label>
            <input
              type="tel"
              className={inputCls}
              placeholder="08123456789"
              value={phoneNumber}
              onChange={(e) => { setPhoneNumber(e.target.value); clearError("phone_number"); }}
            />
            {errors.phone_number && (
              <p className="flex items-center gap-1 text-sm text-red-600">
                <AlertCircle className="h-4 w-4" />{errors.phone_number}
              </p>
            )}
          </div>
        </div>

        <p className="rounded-xl bg-blue-50 px-4 py-2.5 text-xs text-blue-700">
          💡 Gunakan nama, email, dan nomor WA yang sama saat nanti mengisi testimoni, agar sistem bisa
          memverifikasi pesanan Anda.
        </p>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <FileText className="h-4 w-4 text-blue-600" />
            CV Lama
          </label>
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center transition hover:border-blue-400 hover:bg-blue-50">
            <Upload className="h-5 w-5 text-slate-500" />
            <span className="mt-2 text-sm font-medium text-slate-700">
              {cvFile ? cvFile.name : "Pilih file CV lama (PDF/DOC/DOCX)"}
            </span>
            <span className="mt-1 text-xs text-slate-400">Maksimal 10MB</span>
            <input
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx"
              onChange={(e) => { setCvFile(e.target.files?.[0] ?? null); clearError("cv_file"); }}
            />
          </label>
          {errors.cv_file && (
            <p className="flex items-center gap-1 text-sm text-red-600">
              <AlertCircle className="h-4 w-4" />{errors.cv_file}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Camera className="h-4 w-4 text-blue-600" />
            Foto Profesional <span className="font-normal text-slate-400">(opsional)</span>
          </label>
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center transition hover:border-blue-400 hover:bg-blue-50">
            <Upload className="h-5 w-5 text-slate-500" />
            <span className="mt-2 text-sm font-medium text-slate-700">
              {photoFile ? photoFile.name : "Pilih foto profesional (JPG/PNG)"}
            </span>
            <span className="mt-1 text-xs text-slate-400">Maksimal 5MB</span>
            <input
              type="file"
              className="hidden"
              accept="image/jpeg,image/png,image/jpg"
              onChange={(e) => { setPhotoFile(e.target.files?.[0] ?? null); clearError("photo_file"); }}
            />
          </label>
          {errors.photo_file && (
            <p className="flex items-center gap-1 text-sm text-red-600">
              <AlertCircle className="h-4 w-4" />{errors.photo_file}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Catatan Tambahan (opsional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            placeholder="Contoh: ingin tampil lebih ATS-friendly, ingin menonjolkan pengalaman kerja tertentu."
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>

        {submitError && (
          <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
            <p className="text-sm text-red-700">{submitError}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? (
            <><Loader2 className="h-4 w-4 animate-spin" />Mengirim...</>
          ) : (
            <><Send className="h-4 w-4" />Kirim & Lanjut ke WhatsApp</>
          )}
        </button>
      </form>
    </div>
  );
}
