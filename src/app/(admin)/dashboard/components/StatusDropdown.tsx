import { useState, useTransition } from "react";
import { Loader2, ChevronDown } from "lucide-react";
import { updateClientStatus, type ClientStatus } from "@/app/actions/dashboardactions";
import { STATUS_META, ALL_STATUSES } from "../constants";

export function StatusDropdown({ clientId, current, onUpdate, onComplete }: {
  clientId: string;
  current: ClientStatus;
  onUpdate: (id: string, s: ClientStatus) => void;
  onComplete?: (id: string) => void;
}) {
  const [open, setOpen]            = useState(false);
  const [pending, startTransition] = useTransition();
  const meta                       = STATUS_META[current];

  const handleChange = (newStatus: ClientStatus) => {
    if (newStatus === current) { setOpen(false); return; }
    setOpen(false);
    // Jika pilih Selesai → trigger invoice modal
    if (newStatus === "completed" && onComplete) {
      onComplete(clientId);
      return;
    }
    startTransition(async () => {
      const res = await updateClientStatus(clientId, newStatus);
      if (res.success) onUpdate(clientId, newStatus);
    });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        disabled={pending}
        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition-all hover:opacity-80 disabled:opacity-60 ${meta.badge}`}
      >
        {pending
          ? <Loader2 className="h-3 w-3 animate-spin" />
          : <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />}
        {meta.label}
        <ChevronDown className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full z-20 mt-1 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-xl">
            {ALL_STATUSES.map(st => {
              const m        = STATUS_META[st];
              const isActive = st === current;
              return (
                <button key={st} onClick={() => handleChange(st)} disabled={isActive}
                  className={`flex w-full items-center gap-2.5 px-3 py-2.5 text-xs font-semibold transition-colors ${
                    isActive ? "bg-slate-50 opacity-50 cursor-default" : "hover:bg-slate-50"
                  }`}>
                  <span className={`h-2 w-2 rounded-full ${m.dot}`} />
                  {m.label}
                  {isActive && <span className="ml-auto rounded-full bg-slate-200 px-1.5 py-0.5 text-[10px]">Aktif</span>}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
