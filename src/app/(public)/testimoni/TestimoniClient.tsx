"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { verifyClient, submitTestimoni } from "@/app/actions/testimoni-actions";
import type { Testimoni, TestimoniFormData, PhotoType } from "@/types/testimoni";
import { SERVICE_QUESTIONS, SERVICE_LIST } from "@/types/testimoni";
import {
  Star, Search, ChevronDown, X, CheckCircle2,
  Loader2, AlertCircle, Upload, PenLine, SlidersHorizontal,
} from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const SERVICE_COLOR: Record<string, string> = {
  CV:           "bg-blue-100 text-blue-700",
  Lamaran:      "bg-violet-100 text-violet-700",
  Legal:        "bg-amber-100 text-amber-700",
  NPWP:         "bg-emerald-100 text-emerald-700",
  Akademik:     "bg-pink-100 text-pink-700",
  "Data Entry": "bg-slate-100 text-slate-600",
};

const AVATAR_COLORS = [
  "bg-blue-500","bg-emerald-500","bg-violet-500",
  "bg-amber-500","bg-pink-500","bg-cyan-500","bg-rose-500",
];

function avatarBg(name: string) {
  return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
}

function getInitials(name: string) {
  return name.split(" ").slice(0, 2).map(n => n[0]?.toUpperCase()).join("");
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit", month: "long", year: "numeric",
  }).format(new Date(iso));
}

// ─── Star Rating Input ────────────────────────────────────────────────────────

function StarInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map(s => (
        <button key={s} type="button"
          onClick={() => onChange(s)}
          onMouseEnter={() => setHover(s)}
          onMouseLeave={() => setHover(0)}
          className="transition-transform hover:scale-110 focus:outline-none">
          <Star className={`h-7 w-7 transition-colors ${
            s <= (hover || value)
              ? "fill-amber-400 text-amber-400"
              : "text-slate-200 hover:text-amber-300"
          }`} />
        </button>
      ))}
      {value > 0 && (
        <span className="ml-2 text-sm font-bold text-amber-600">
          {["","Buruk","Kurang","Cukup","Baik","Sangat Baik"][value]}
        </span>
      )}
    </div>
  );
}

// ─── Stars Display ────────────────────────────────────────────────────────────

function StarsDisplay({ rating, size = "md" }: { rating: number; size?: "sm"|"md" }) {
  const cls = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(s => (
        <Star key={s} className={`${cls} ${s <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-slate-200"}`} />
      ))}
    </div>
  );
}

// ─── Avatar ───────────────────────────────────────────────────────────────────

function Avatar({ name, photoType, photoData, size = "md" }: {
  name: string; photoType: PhotoType; photoData: string | null; size?: "sm"|"md"|"lg";
}) {
  const [imageError, setImageError] = useState(false);
  const cls = size === "sm" ? "h-8 w-8 text-xs" : size === "lg" ? "h-14 w-14 text-lg" : "h-11 w-11 text-sm";
  const imgSize = size === "sm" ? 32 : size === "lg" ? 56 : 44;
  if (photoType === "upload" && photoData && !imageError)
    return (
      <Image
        src={photoData}
        alt={`Foto profil ${name}`}
        width={imgSize}
        height={imgSize}
        onError={() => setImageError(true)}
        className={`${cls} rounded-full object-cover ring-2 ring-white shadow`}
      />
    );
  if (photoType === "anonymous")
    return (
      <div className={`${cls} flex items-center justify-center rounded-full bg-slate-200 ring-2 ring-white shadow`}>
        <span className="text-slate-500">👤</span>
      </div>
    );
  return (
    <div className={`${cls} flex items-center justify-center rounded-full ring-2 ring-white shadow ${avatarBg(name)}`}>
      <span className="font-bold text-white">{getInitials(name)}</span>
    </div>
  );
}

// ─── Testimoni Card (Public) ──────────────────────────────────────────────────

function TestimoniCard({ t }: { t: Testimoni }) {
  return (
    <div className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Avatar name={t.client_name} photoType={t.photo_type} photoData={t.photo_data} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <p className="text-sm font-bold text-slate-900 truncate">{t.client_name}</p>
            <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">
              ✓ Terverifikasi
            </span>
          </div>
          <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${SERVICE_COLOR[t.service_type] ?? "bg-slate-100 text-slate-600"}`}>
            {t.service_type}
          </span>
        </div>
      </div>

      {/* Rating */}
      <div className="mt-3 flex items-center gap-2">
        <StarsDisplay rating={t.avg_rating} />
        <span className="text-sm font-black text-amber-600">{t.avg_rating.toFixed(1)}</span>
      </div>

      {/* Text */}
      <blockquote className="mt-3 flex-1 text-sm text-slate-600 leading-relaxed">
        {t.highlight}
      </blockquote>

      {t.suggestion && (
        <p className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500 italic">
          💡 {t.suggestion}
        </p>
      )}

      {/* Footer */}
      <p className="mt-3 text-xs text-slate-400">{formatDate(t.created_at)}</p>
    </div>
  );
}

// ─── Submit Modal ─────────────────────────────────────────────────────────────

function SubmitModal({ onClose }: { onClose: () => void }) {
  const [modalStep, setModalStep] = useState<"verify"|"service"|"rating"|"text"|"photo"|"success">("verify");
  const [identifier, setIdentifier] = useState("");
  const [verifyError, setVerifyError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [uploadPhotoError, setUploadPhotoError] = useState(false);
  const [photoBlob, setPhotoBlob] = useState<Blob | null>(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Partial<TestimoniFormData>>({
    ratings: {}, highlight: "", suggestion: "", photo_type: "initial", photo_data: null,
  });

  const upd = (key: keyof TestimoniFormData, val: unknown) =>
    setFormData(p => ({ ...p, [key]: val }));

  // Verify step
  const handleVerify = async () => {
    if (!identifier.trim()) { setVerifyError("Masukkan email atau nomor WA."); return; }
    setIsVerifying(true); setVerifyError("");
    const res = await verifyClient(identifier.trim());
    setIsVerifying(false);
    if (!res.found) { setVerifyError(res.error ?? "Tidak ditemukan."); return; }
    upd("client_id", res.client_id);
    upd("client_name", res.client_name);
    setFormData(p => ({ ...p, availableServices: res.services } as typeof p & { availableServices: string[] }));
    setModalStep("service");
  };

  // Photo handler
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validation
    if (file.size > 2 * 1024 * 1024) {
      setSubmitError("Ukuran file maksimal 2MB");
      return;
    }
    
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setSubmitError("Format file harus JPG, PNG, atau WebP");
      return;
    }
    
    setUploadPhotoError(false);
    setSubmitError("");
    
    const reader = new FileReader();
    reader.onerror = () => {
      setSubmitError("Gagal membaca file. Coba upload lagi.");
    };
    
    reader.onload = () => {
      const img = document.createElement('img') as HTMLImageElement;
      img.onerror = () => {
        setSubmitError("File bukan gambar yang valid");
      };
      
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          const MAX = 200;
          // Don't upscale - maintain aspect ratio without exceeding MAX
          const ratio = Math.min(1, MAX / Math.max(img.width, img.height));
          canvas.width = img.width * ratio;
          canvas.height = img.height * ratio;
          
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            setSubmitError("Tidak dapat memproses gambar di device Anda");
            return;
          }
          
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          // Use toBlob for better performance (avoids large data URL strings)
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                setSubmitError("Gagal mengompresi gambar");
                return;
              }
              
              // Store blob for submission
              setPhotoBlob(blob);
              upd("photo_type", "upload");
              
              // Create preview URL
              const previewUrl = URL.createObjectURL(blob);
              setPhotoPreviewUrl(previewUrl);
              
              // Reset file input so user can select same file again
              if (fileInputRef.current) fileInputRef.current.value = "";
            },
            "image/jpeg",
            0.8
          );
        } catch (err) {
          setSubmitError(`Gagal memproses gambar: ${err instanceof Error ? err.message : "Unknown error"}`);
        }
      };
      
      img.src = reader.result as string;
    };
    
    reader.readAsDataURL(file);
  };

  const questions = SERVICE_QUESTIONS[formData.service_type ?? ""] ?? [];
  const allRated  = questions.length > 0 && questions.every(q => (formData.ratings?.[q.id] ?? 0) >= 1);

  const handleSubmit = async () => {
    if (!formData.highlight?.trim() || formData.highlight.trim().length < 20) {
      setSubmitError("Teks testimoni minimal 20 karakter."); return;
    }
    setIsSubmitting(true); setSubmitError("");
    const fd = new FormData();
    fd.append("client_id",    formData.client_id!);
    fd.append("client_name",  formData.client_name!);
    fd.append("service_type", formData.service_type!);
    fd.append("ratings",      JSON.stringify(formData.ratings));
    fd.append("highlight",    formData.highlight!);
    fd.append("suggestion",   formData.suggestion ?? "");
    fd.append("photo_type",   formData.photo_type ?? "initial");
    if (formData.photo_type === "upload" && photoBlob)
      fd.append("photo_data", photoBlob);

    const res = await submitTestimoni(fd);
    setIsSubmitting(false);
    if (!res.success) { setSubmitError(res.error ?? "Gagal mengirim."); return; }
    
    // Cleanup
    if (photoPreviewUrl) URL.revokeObjectURL(photoPreviewUrl);
    
    // Reset form after 3 seconds for next use
    setTimeout(() => {
      setPhotoBlob(null);
      setPhotoPreviewUrl(null);
      setFormData({
        ratings: {}, highlight: "", suggestion: "", photo_type: "initial", photo_data: null,
      });
    }, 3000);
    
    setModalStep("success");
  };

  const availableServices = (formData as typeof formData & { availableServices?: string[] }).availableServices ?? [];
  const avgRating = questions.length > 0
    ? Object.values(formData.ratings ?? {}).reduce((a,b) => a+b, 0) / questions.length
    : 0;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (photoPreviewUrl) URL.revokeObjectURL(photoPreviewUrl);
    };
  }, [photoPreviewUrl]);

  const handleModalClose = useCallback(() => {
    // Cleanup preview URL
    if (photoPreviewUrl) URL.revokeObjectURL(photoPreviewUrl);
    onClose();
  }, [photoPreviewUrl, onClose]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && modalStep !== "success") handleModalClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [modalStep, handleModalClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center"
      onClick={e => { if (e.target === e.currentTarget) handleModalClose(); }}>
      <div className="flex max-h-[92vh] w-full max-w-lg flex-col rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl sm:mx-4">

        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h3 className="text-base font-black text-slate-900">Tulis Testimoni</h3>
            <p className="text-xs text-slate-500">
              {modalStep === "verify"  && "Verifikasi identitas Anda"}
              {modalStep === "service" && "Pilih layanan yang ingin direview"}
              {modalStep === "rating"  && `Rating untuk layanan ${formData.service_type}`}
              {modalStep === "text"    && "Ceritakan pengalaman Anda"}
              {modalStep === "photo"   && "Pilih foto profil"}
              {modalStep === "success" && "Testimoni berhasil dikirim!"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-xs text-slate-400 px-2 py-1 rounded border border-slate-200">ESC</span>
            <button onClick={handleModalClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors" title="Tutup (ESC)">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">

          {/* ── Verify ── */}
          {modalStep === "verify" && (
            <div className="space-y-4">
              <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                <p className="text-sm text-blue-700">
                  <span className="font-bold">🔐 Verifikasi Diperlukan</span><br />
                  Masukkan email atau nomor WA yang sama dengan yang Anda gunakan saat mengisi form layanan.
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Email atau Nomor WhatsApp <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors"
                  placeholder="nama@email.com atau 08123456789"
                  value={identifier}
                  onChange={e => { setIdentifier(e.target.value); setVerifyError(""); }}
                  onKeyDown={e => e.key === "Enter" && handleVerify()}
                />
                {verifyError && (
                  <p className="mt-1.5 flex items-start gap-1.5 text-xs text-red-600">
                    <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />{verifyError}
                  </p>
                )}
              </div>
              <button onClick={handleVerify} disabled={isVerifying}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 py-2.5 text-sm font-bold text-white hover:bg-blue-800 disabled:opacity-60 transition-colors">
                {isVerifying ? <><Loader2 className="h-4 w-4 animate-spin" />Memverifikasi...</> : "Verifikasi"}
              </button>
            </div>
          )}

          {/* ── Service selection ── */}
          {modalStep === "service" && (
            <div className="space-y-4">
              <p className="text-sm text-slate-600">
                Halo <span className="font-bold text-slate-900">{formData.client_name}</span>!
                Pilih layanan yang ingin Anda review:
              </p>
              <div className="grid gap-3">
                {availableServices.map(svc => (
                  <button key={svc} type="button"
                    onClick={() => { upd("service_type", svc); setModalStep("rating"); }}
                    className="flex items-center gap-3 rounded-xl border-2 border-slate-200 bg-white p-4 text-left hover:border-blue-400 hover:bg-blue-50 transition-all group">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${SERVICE_COLOR[svc] ?? "bg-slate-100 text-slate-600"}`}>
                      {svc}
                    </span>
                    <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-700">
                      Review layanan {svc}
                    </span>
                    <ChevronDown className="ml-auto h-4 w-4 -rotate-90 text-slate-400 group-hover:text-blue-600" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Rating ── */}
          {modalStep === "rating" && (
            <div className="space-y-5">
              <p className="text-sm text-slate-600">
                Beri nilai <strong>1-5 bintang</strong> untuk setiap aspek layanan:
              </p>
              {questions.map(q => (
                <div key={q.id}>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    {q.label} <span className="text-red-500">*</span>
                  </label>
                  <StarInput
                    value={formData.ratings?.[q.id] ?? 0}
                    onChange={val => upd("ratings", { ...formData.ratings, [q.id]: val })}
                  />
                </div>
              ))}
              {allRated && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-center">
                  <p className="text-xs text-amber-700">Rata-rata rating Anda:</p>
                  <div className="mt-1 flex items-center justify-center gap-2">
                    <StarsDisplay rating={avgRating} size="md" />
                    <span className="text-lg font-black text-amber-600">{avgRating.toFixed(1)}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Text ── */}
          {modalStep === "text" && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Apa yang paling Anda suka dari layanan ini? <span className="text-red-500">*</span>
                </label>
                <textarea rows={4}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm placeholder:text-slate-400 resize-none focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors"
                  placeholder="Contoh: Hasil CV saya sangat profesional dan ATS-friendly. Admin responsif dan proses cepat, hanya 12 jam sudah jadi!"
                  value={formData.highlight} onChange={e => upd("highlight", e.target.value)}
                />
                <div className="mt-1 flex items-center justify-between">
                  {formData.highlight && formData.highlight.length < 20 && (
                    <p className="text-xs text-amber-600">Minimal 20 karakter ({formData.highlight.length}/20)</p>
                  )}
                  <p className="ml-auto text-xs text-slate-400">{formData.highlight?.length ?? 0} karakter</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Ada saran untuk kami? <span className="text-slate-400 font-normal">(opsional)</span>
                </label>
                <textarea rows={2}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm placeholder:text-slate-400 resize-none focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors"
                  placeholder="Contoh: Akan lebih baik jika ada preview draft sebelum final..."
                  value={formData.suggestion} onChange={e => upd("suggestion", e.target.value)}
                />
              </div>
            </div>
          )}

          {/* ── Photo ── */}
          {modalStep === "photo" && (
            <div className="space-y-4">
              <p className="text-sm text-slate-600">Pilih tampilan foto profil untuk testimoni Anda:</p>

              {/* Inisial */}
              <button type="button"
                onClick={() => { upd("photo_type", "initial"); upd("photo_data", null); }}
                className={`flex w-full items-center gap-4 rounded-xl border-2 p-4 transition-all ${
                  formData.photo_type === "initial" ? "border-blue-600 bg-blue-50" : "border-slate-200 hover:border-blue-300"
                }`}>
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white text-base font-bold ${avatarBg(formData.client_name ?? "A")}`}>
                  {getInitials(formData.client_name ?? "A")}
                </div>
                <div className="text-left">
                  <p className={`text-sm font-bold ${formData.photo_type === "initial" ? "text-blue-700" : "text-slate-700"}`}>
                    Avatar Inisial (Rekomendasi)
                  </p>
                  <p className="text-xs text-slate-500">Gunakan inisial nama dengan warna unik otomatis</p>
                </div>
              </button>

              {/* Upload */}
              <button type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`flex w-full items-center gap-4 rounded-xl border-2 p-4 transition-all ${
                  formData.photo_type === "upload" ? "border-blue-600 bg-blue-50" : "border-slate-200 hover:border-blue-300"
                }`}>
                {formData.photo_type === "upload" && photoPreviewUrl && !uploadPhotoError ? (
                  <Image
                    src={photoPreviewUrl}
                    alt={`Foto profil ${formData.client_name ?? "testimoni"}`}
                    width={48}
                    height={48}
                    onError={() => setUploadPhotoError(true)}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-100">
                    <Upload className="h-5 w-5 text-slate-400" />
                  </div>
                )}
                <div className="text-left">
                  <p className={`text-sm font-bold ${formData.photo_type === "upload" ? "text-blue-700" : "text-slate-700"}`}>
                    Upload Foto
                  </p>
                  <p className="text-xs text-slate-500">
                    {formData.photo_type === "upload" && photoBlob ? "Foto terpilih — klik untuk ganti" : "JPG/PNG/WebP, maks 2MB"}
                  </p>
                </div>
              </button>
              <input ref={fileInputRef} type="file" className="hidden" accept="image/jpeg,image/png,image/webp" onChange={handlePhotoUpload} />

              {/* Anonim */}
              <button type="button"
                onClick={() => { upd("photo_type", "anonymous"); upd("photo_data", null); }}
                className={`flex w-full items-center gap-4 rounded-xl border-2 p-4 transition-all ${
                  formData.photo_type === "anonymous" ? "border-blue-600 bg-blue-50" : "border-slate-200 hover:border-blue-300"
                }`}>
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xl">👤</div>
                <div className="text-left">
                  <p className={`text-sm font-bold ${formData.photo_type === "anonymous" ? "text-blue-700" : "text-slate-700"}`}>
                    Anonim
                  </p>
                  <p className="text-xs text-slate-500">Tampil sebagai pengguna anonim</p>
                </div>
              </button>

              {submitError && (
                <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                  <p className="text-sm text-red-700">{submitError}</p>
                </div>
              )}
            </div>
          )}

          {/* ── Success ── */}
          {modalStep === "success" && (
            <div className="flex flex-col items-center py-8 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                <CheckCircle2 className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-black text-slate-900">Terima kasih!</h3>
              <p className="mt-2 text-sm text-slate-500">
                Testimoni Anda sedang direview oleh admin dan akan tampil dalam waktu singkat setelah disetujui.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        {modalStep !== "success" && (
          <div className="shrink-0 flex items-center justify-between border-t border-slate-100 px-5 py-4 gap-3">
            {modalStep !== "verify" && modalStep !== "service" && (
              <button
                onClick={() => {
                  const prev: Record<string, "verify" | "service" | "rating" | "text" | "photo" | "success"> = {
                    rating: "service", text: "rating", photo: "text",
                  };
                  setModalStep((prev[modalStep] ?? "verify") as typeof modalStep);
                }}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                Kembali
              </button>
            )}

            {modalStep === "rating" && (
              <button
                onClick={() => { if (allRated) setModalStep("text"); }}
                disabled={!allRated}
                className="ml-auto rounded-xl bg-blue-700 px-5 py-2 text-sm font-bold text-white hover:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                Lanjutkan
              </button>
            )}
            {modalStep === "text" && (
              <button
                onClick={() => {
                  if (!formData.highlight?.trim() || formData.highlight.trim().length < 20) {
                    setSubmitError("Minimal 20 karakter."); return;
                  }
                  setSubmitError(""); setModalStep("photo");
                }}
                className="ml-auto rounded-xl bg-blue-700 px-5 py-2 text-sm font-bold text-white hover:bg-blue-800 transition-colors">
                Lanjutkan
              </button>
            )}
            {modalStep === "photo" && (
              <button onClick={handleSubmit} disabled={isSubmitting}
                className="ml-auto flex items-center gap-2 rounded-xl bg-blue-700 px-5 py-2 text-sm font-bold text-white hover:bg-blue-800 disabled:opacity-60 transition-colors">
                {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" />Mengirim...</> : <><CheckCircle2 className="h-4 w-4" />Kirim Testimoni</>}
              </button>
            )}
          </div>
        )}
        {modalStep === "success" && (
          <div className="shrink-0 border-t border-slate-100 px-5 py-4">
            <button onClick={handleModalClose}
              className="w-full rounded-xl bg-blue-700 py-2.5 text-sm font-bold text-white hover:bg-blue-800 transition-colors">
              Tutup
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Public Page ─────────────────────────────────────────────────────────

interface PublicProps {
  testimonials: Testimoni[];
}

export function TestimoniClient({ testimonials }: PublicProps) {
  const [filterService, setFilterService] = useState("all");
  const [sortBy, setSortBy]               = useState<"terbaru"|"tertinggi"|"terendah">("terbaru");
  const [showModal, setShowModal]         = useState(false);
  const [showSort, setShowSort]           = useState(false);

  const filtered = useMemo(() => {
    let list = testimonials.filter(t =>
      filterService === "all" || t.service_type === filterService
    );
    if (sortBy === "tertinggi") list = [...list].sort((a,b) => b.avg_rating - a.avg_rating);
    else if (sortBy === "terendah") list = [...list].sort((a,b) => a.avg_rating - b.avg_rating);
    else list = [...list].sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return list;
  }, [testimonials, filterService, sortBy]);

  // Aggregate stats
  const stats = useMemo(() => {
    if (!testimonials.length) return null;
    const avg = testimonials.reduce((s,t) => s + t.avg_rating, 0) / testimonials.length;
    const breakdown = [5,4,3,2,1].map(star => ({
      star,
      count: testimonials.filter(t => Math.round(t.avg_rating) === star).length,
      pct:   Math.round((testimonials.filter(t => Math.round(t.avg_rating) === star).length / testimonials.length) * 100),
    }));
    const bySvc = SERVICE_LIST.reduce<Record<string, number>>((acc,s) => {
      acc[s] = testimonials.filter(t => t.service_type === s).length;
      return acc;
    }, {});
    return { avg, breakdown, bySvc };
  }, [testimonials]);

  const SORT_OPTIONS = [
    { key: "terbaru"   as const, label: "Terbaru" },
    { key: "tertinggi" as const, label: "Skor Tertinggi" },
    { key: "terendah"  as const, label: "Skor Terendah" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {showModal && <SubmitModal onClose={() => setShowModal(false)} />}

      {/* ── Hero ── */}
      <section className="bg-blue-950 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <span className="mb-3 inline-block rounded-full border border-blue-700/50 bg-blue-900/60 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-blue-300">
            Testimoni Klien
          </span>
          <h1 className="text-3xl font-black text-white sm:text-4xl">
            Apa Kata Mereka?
          </h1>
          <p className="mt-3 text-blue-200 text-sm sm:text-base">
            Ulasan dari klien yang sudah memakai layanan CV, surat lamaran, NPWP, hingga dokumen akademik dan legal kami.
          </p>
          <div className="mt-6 rounded-2xl border border-blue-700/40 bg-blue-900/50 px-6 py-5 text-left text-sm text-blue-100 shadow-sm">
            <p className="font-semibold text-white">Mengapa testimoni ini penting?</p>
            <p className="mt-2 leading-7">
              Kami menggunakan testimoni sebagai bukti bahwa setiap layanan dibuat untuk membantu klien mencapai hasil yang lebih siap dipakai, lebih profesional, dan lebih cepat diselesaikan.
            </p>
          </div>

          {stats && (
            <div className="mt-8 inline-flex flex-col sm:flex-row items-center gap-6 rounded-2xl border border-blue-700/50 bg-blue-900/60 px-8 py-5 backdrop-blur-sm">
              <div className="text-center">
                <p className="text-4xl font-black text-white">{stats.avg.toFixed(1)}</p>
                <StarsDisplay rating={stats.avg} size="md" />
                <p className="mt-1 text-xs text-blue-300">{testimonials.length} ulasan terverifikasi</p>
              </div>
              <div className="hidden sm:block h-12 w-px bg-blue-700/50" />
              <div className="space-y-1 min-w-40">
                {stats.breakdown.map(b => (
                  <div key={b.star} className="flex items-center gap-2">
                    <span className="text-xs text-blue-300 w-4">{b.star}</span>
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400 shrink-0" />
                    <div className="flex-1 h-1.5 rounded-full bg-blue-800 overflow-hidden">
                      <div className="h-full rounded-full bg-amber-400 transition-all" style={{ width: `${b.pct}%` }} />
                    </div>
                    <span className="text-xs text-blue-400 w-8 text-right">{b.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button onClick={() => setShowModal(true)}
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/30 hover:bg-blue-400 hover:-translate-y-0.5 transition-all">
            <PenLine className="h-4 w-4" />
            Tulis Testimoni Anda
          </button>
        </div>
      </section>

      {/* ── Filter & Sort ── */}
      <section className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-hide">
            {/* Service filter */}
            <button onClick={() => setFilterService("all")}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                filterService === "all" ? "bg-blue-700 text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}>
              Semua ({testimonials.length})
            </button>
            {SERVICE_LIST.map(svc => {
              const count = stats?.bySvc[svc] ?? 0;
              if (!count) return null;
              return (
                <button key={svc} onClick={() => setFilterService(filterService === svc ? "all" : svc)}
                  className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                    filterService === svc ? "bg-blue-700 text-white shadow-sm" : `${SERVICE_COLOR[svc]} hover:opacity-80`
                  }`}>
                  {svc}
                  <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${filterService === svc ? "bg-white/20" : "bg-white/60"}`}>
                    {count}
                  </span>
                </button>
              );
            })}

            {/* Sort */}
            <div className="relative ml-auto shrink-0">
              <button onClick={() => setShowSort(s => !s)}
                className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-blue-300 hover:text-blue-700 transition-colors">
                <SlidersHorizontal className="h-3.5 w-3.5" />
                {SORT_OPTIONS.find(s => s.key === sortBy)?.label}
                <ChevronDown className={`h-3 w-3 transition-transform ${showSort ? "rotate-180" : ""}`} />
              </button>
              {showSort && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowSort(false)} />
                  <div className="absolute right-0 top-full z-20 mt-1 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-xl">
                    {SORT_OPTIONS.map(opt => (
                      <button key={opt.key} onClick={() => { setSortBy(opt.key); setShowSort(false); }}
                        className={`flex w-full items-center px-4 py-2.5 text-xs font-semibold transition-colors hover:bg-slate-50 ${
                          sortBy === opt.key ? "text-blue-700 bg-blue-50" : "text-slate-700"
                        }`}>
                        {sortBy === opt.key && <span className="mr-2 text-blue-600">✓</span>}
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Grid ── */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Search className="mb-3 h-10 w-10 text-slate-300" />
            <p className="text-sm font-semibold text-slate-600">
              {testimonials.length === 0 ? "Belum ada testimoni" : "Tidak ada testimoni untuk filter ini"}
            </p>
            {testimonials.length === 0 && (
              <p className="mt-1 text-xs text-slate-400">Jadilah yang pertama menulis testimoni!</p>
            )}
          </div>
        ) : (
          <>
            <p className="mb-5 text-sm text-slate-500">
              Menampilkan <span className="font-semibold text-slate-700">{filtered.length}</span> testimoni
              {filterService !== "all" && ` untuk layanan "${filterService}"`}
            </p>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map(t => <TestimoniCard key={t.id} t={t} />)}
            </div>
          </>
        )}
      </section>

      {/* Floating CTA */}
      <div className="fixed bottom-6 right-6 z-40">
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-2xl bg-blue-700 px-5 py-3 text-sm font-bold text-white shadow-xl shadow-blue-700/30 hover:bg-blue-800 hover:-translate-y-0.5 transition-all">
          <PenLine className="h-4 w-4" />
          Tulis Testimoni
        </button>
      </div>
    </div>
  );
}
