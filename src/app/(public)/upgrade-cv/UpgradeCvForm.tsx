"use client";

import { useState } from "react";
import { AlertCircle, Camera, CheckCircle2, FileText, Send, Upload } from "lucide-react";
import { generateConsultationWhatsAppLink } from "@/lib/utils";

const MAX_CV_SIZE = 10 * 1024 * 1024;
const MAX_PHOTO_SIZE = 5 * 1024 * 1024;

export function UpgradeCvForm() {
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<{ cvFile?: string; photoFile?: string }>({});
  const [submitted, setSubmitted] = useState(false);

  const validateFiles = () => {
    const nextErrors: { cvFile?: string; photoFile?: string } = {};

    if (!cvFile) {
      nextErrors.cvFile = "Upload CV lama wajib diisi.";
    } else if (cvFile.size > MAX_CV_SIZE) {
      nextErrors.cvFile = "Ukuran file CV maksimal 10MB.";
    }

    if (!photoFile) {
      nextErrors.photoFile = "Upload foto profesional wajib diisi.";
    } else if (photoFile.size > MAX_PHOTO_SIZE) {
      nextErrors.photoFile = "Ukuran foto maksimal 5MB.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateFiles()) return;

    const waUrl = generateConsultationWhatsAppLink("Upgrade CV Lama");
    const message = notes.trim()
      ? `${waUrl}&text=${encodeURIComponent(`Halo Arifin Docs & Design, saya ingin upgrade CV lama. Saya sudah mengunggah CV lama dan foto profesional. Catatan: ${notes.trim()}`)}`
      : waUrl;

    window.location.href = message;
    setSubmitted(true);
  };

  return (
    <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-6 text-center">
        <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
          <FileText className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-black text-slate-900">Upload Dokumen yang Dibutuhkan</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          Untuk proses upgrade CV, kami hanya membutuhkan CV lama Anda dan foto profesional terbaru.
        </p>
      </div>

      {submitted ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-center">
          <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-600" />
          <h3 className="mt-3 text-lg font-bold text-emerald-700">Permintaan Anda siap dikirim</h3>
          <p className="mt-2 text-sm text-emerald-700">
            Kami akan menindaklanjuti permintaan upgrade CV Anda melalui WhatsApp.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
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
                onChange={(e) => {
                  setCvFile(e.target.files?.[0] ?? null);
                  if (errors.cvFile) setErrors((prev) => ({ ...prev, cvFile: undefined }));
                }}
              />
            </label>
            {errors.cvFile && (
              <p className="flex items-center gap-1 text-sm text-red-600">
                <AlertCircle className="h-4 w-4" />
                {errors.cvFile}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Camera className="h-4 w-4 text-blue-600" />
              Foto Profesional
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
                onChange={(e) => {
                  setPhotoFile(e.target.files?.[0] ?? null);
                  if (errors.photoFile) setErrors((prev) => ({ ...prev, photoFile: undefined }));
                }}
              />
            </label>
            {errors.photoFile && (
              <p className="flex items-center gap-1 text-sm text-red-600">
                <AlertCircle className="h-4 w-4" />
                {errors.photoFile}
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

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-800"
          >
            <Send className="h-4 w-4" />
            Kirim Permintaan Upgrade CV
          </button>
        </form>
      )}
    </div>
  );
}
