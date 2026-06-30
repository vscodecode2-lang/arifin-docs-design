import { AlertCircle } from "lucide-react";

export function Field({ label, required, helper, error, children }: {
  label: string; required?: boolean; helper?: string; error?: string; children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold text-slate-700">
        {label}{required && <span className="ml-1 text-red-500">*</span>}
      </label>
      {children}
      {helper && !error && <p className="text-xs text-slate-400">{helper}</p>}
      {error && (
        <p className="flex items-center gap-1 text-xs text-red-600">
          <AlertCircle className="h-3 w-3 shrink-0" />{error}
        </p>
      )}
    </div>
  );
}
