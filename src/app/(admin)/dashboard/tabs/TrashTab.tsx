import { useTransition } from "react";
import {
  Trash2, AlertTriangle, Flame, RotateCcw,
} from "lucide-react";
import { restoreClient } from "@/app/actions/dashboardactions";
import type { ClientRow } from "../DashboardClient";
import { SERVICE_META } from "../constants";
import { formatDate, getDaysLeft } from "../services/dashboard.service";

export function TrashTab({
  items,
  onRestore,
  onPermanentDelete,
  onEmptyTrash,
}: {
  items: ClientRow[];
  onRestore: (id: string) => void;
  onPermanentDelete: (client: ClientRow) => void;
  onEmptyTrash: () => void;
}) {
  const [, startTransition] = useTransition();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
          <Trash2 className="h-7 w-7 text-slate-300" />
        </div>
        <p className="text-sm font-semibold text-slate-600">Folder sampah kosong</p>
        <p className="mt-1 text-xs text-slate-400">Data yang dihapus akan muncul di sini</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Info banner */}
      <div className="flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
          <p className="text-sm text-amber-700">
            <span className="font-bold">Data di sampah dihapus permanen otomatis setelah 7 hari.</span>
            {" "}Restore jika ingin mengembalikan.
          </p>
        </div>
        <button
          onClick={onEmptyTrash}
          className="flex shrink-0 items-center gap-1.5 rounded-lg border border-red-300 bg-white px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
        >
          <Flame className="h-3.5 w-3.5" />
          Kosongkan Sampah
        </button>
      </div>

      {/* Trash table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80">
                {["Klien", "Layanan", "Dihapus Pada", "Sisa Waktu", "Aksi"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map(client => {
                const svc      = SERVICE_META[client.service_type];
                const daysLeft = client.deleted_at ? getDaysLeft(client.deleted_at) : 0;
                const isUrgent = daysLeft <= 1;

                return (
                  <tr key={client.id} className="group hover:bg-red-50/30 transition-colors">
                    {/* Klien */}
                    <td className="px-4 py-3.5">
                      <p className="text-sm font-semibold text-slate-500 line-through">{client.full_name}</p>
                      <p className="text-xs text-slate-400">{client.email}</p>
                    </td>

                    {/* Layanan */}
                    <td className="px-4 py-3.5">
                      {svc && (
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold opacity-60 ${svc.color}`}>
                          {svc.icon}{svc.label}
                        </span>
                      )}
                    </td>

                    {/* Dihapus pada */}
                    <td className="whitespace-nowrap px-4 py-3.5 text-xs text-slate-400">
                      {client.deleted_at ? formatDate(client.deleted_at) : "-"}
                    </td>

                    {/* Sisa waktu */}
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
                        isUrgent
                          ? "bg-red-100 text-red-700"
                          : "bg-slate-100 text-slate-600"
                      }`}>
                        {daysLeft === 0 ? "⚠️ Hari ini" : `${daysLeft} hari lagi`}
                      </span>
                    </td>

                    {/* Aksi */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            startTransition(async () => {
                              const res = await restoreClient(client.id);
                              if (res.success) onRestore(client.id);
                            });
                          }}
                          title="Pulihkan data"
                          className="flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                          Pulihkan
                        </button>
                        <button
                          onClick={() => onPermanentDelete(client)}
                          title="Hapus permanen sekarang"
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-red-200 text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                          <Flame className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="border-t border-slate-100 px-5 py-3">
          <p className="text-xs text-slate-400">
            {items.length} item di sampah • Auto-hapus setelah 7 hari sejak dipindahkan
          </p>
        </div>
      </div>
    </div>
  );
}
