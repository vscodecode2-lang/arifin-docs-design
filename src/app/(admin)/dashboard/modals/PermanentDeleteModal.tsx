import { Loader2, Flame } from "lucide-react";
import type { ClientRow } from "../DashboardClient";

export function PermanentDeleteModal({
  client, onConfirm, onCancel, isLoading,
}: {
  client: ClientRow;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <Flame className="h-6 w-6 text-red-600" />
        </div>
        <h3 className="text-base font-black text-slate-900">Hapus Permanen?</h3>
        <p className="mt-2 text-sm text-slate-500">
          <span className="font-semibold text-slate-700">{client.full_name}</span> akan dihapus
          selamanya dari database. Tindakan ini <span className="font-bold text-red-600">tidak bisa dibatalkan</span>.
        </p>
        <div className="mt-5 flex gap-3">
          <button onClick={onCancel} disabled={isLoading}
            className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60 transition-colors">
            Batal
          </button>
          <button onClick={onConfirm} disabled={isLoading}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 py-2.5 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-60 transition-colors">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Flame className="h-4 w-4" />}
            Hapus Permanen
          </button>
        </div>
      </div>
    </div>
  );
}
