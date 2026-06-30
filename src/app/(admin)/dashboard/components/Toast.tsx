import { CheckCircle2, AlertTriangle } from "lucide-react";

export function Toast({ msg, type }: { msg: string; type: "ok" | "err" }) {
  return (
    <div
      role="status"
      aria-live={type === "ok" ? "polite" : "assertive"}
      className={`fixed right-4 top-4 z-[60] flex max-w-sm items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-xl ${
        type === "ok" ? "bg-emerald-600" : "bg-red-600"
      }`}>
      {type === "ok"
        ? <CheckCircle2 className="h-4 w-4 shrink-0" />
        : <AlertTriangle className="h-4 w-4 shrink-0" />}
      {msg}
    </div>
  );
}
