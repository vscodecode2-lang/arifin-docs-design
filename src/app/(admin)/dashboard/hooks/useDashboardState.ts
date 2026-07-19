import { useState, useMemo, useTransition, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import {
  updateClientStatus, softDeleteClient,
  permanentDeleteClient, emptyTrash,
  type ClientStatus,
} from "@/app/actions/dashboardactions";
import type { ClientRow } from "../DashboardClient";
import { STATUS_META, ALL_SERVICES } from "../constants";

/**
 * useDashboardState — mengelola seluruh state dan business logic dashboard:
 * filter klien, tab aktif, toast, soft/restore/permanent delete, dan stats.
 *
 * Dipisahkan dari komponen UI agar DashboardClient.tsx tetap ramping.
 */
export function useDashboardState(initialClients: ClientRow[], initialTrashed: ClientRow[]) {
  const router   = useRouter();
  const supabase = createClient();

  const [activeTab, setActiveTab] = useState<"clients" | "trash" | "testimoni" | "pesan" | "analytics">("clients");
  const [clients, setClients]             = useState<ClientRow[]>(initialClients);
  const [trashed, setTrashed]             = useState<ClientRow[]>(initialTrashed);
  const [search, setSearch]               = useState("");
  const [filterService, setFilterService] = useState("all");
  const [filterStatus, setFilterStatus]   = useState("all");
  const [detailClient, setDetailClient]   = useState<ClientRow | null>(null);
  const [deleteTarget, setDeleteTarget]   = useState<ClientRow | null>(null);
  const [invoiceTarget, setInvoiceTarget] = useState<ClientRow | null>(null);
  const [isDeleting, setIsDeleting]       = useState(false);
  const [isLoggingOut, setIsLoggingOut]   = useState(false);
  const [toast, setToast]                 = useState<{ msg: string; type: "ok" | "err" } | null>(null);
  const [, startTransition]               = useTransition();

  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (msg: string, type: "ok" | "err" = "ok") => {
    setToast({ msg, type });
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => setToast(null), 3500);
  };

  // AUDIT MEDIUM-3: bersihkan timer toast saat hook/komponen unmount
  // agar tidak setState setelah unmount.
  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  // ── Filtered list ──
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return clients.filter((c) => {
      const matchSearch  = !q || c.full_name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.phone_number.includes(q);
      const matchService = filterService === "all" || c.service_type === filterService;
      const matchStatus  = filterStatus  === "all" || c.status === filterStatus;
      return matchSearch && matchService && matchStatus;
    });
  }, [clients, search, filterService, filterStatus]);

  // ── Stats ──
  const stats = useMemo(() => ({
    total:       clients.length,
    pending:     clients.filter((c) => c.status === "pending").length,
    in_progress: clients.filter((c) => c.status === "in_progress").length,
    completed:   clients.filter((c) => c.status === "completed").length,
  }), [clients]);

  const serviceCounts = useMemo(() =>
    ALL_SERVICES.reduce<Record<string, number>>((acc, s) => {
      acc[s] = clients.filter((c) => c.service_type === s).length;
      return acc;
    }, {}),
  [clients]);

  const hasActiveFilter = filterService !== "all" || filterStatus !== "all" || !!search;

  const resetFilters = () => {
    setFilterService("all");
    setFilterStatus("all");
    setSearch("");
  };

  // ── Handlers ──
  const handleStatusUpdate = (id: string, newStatus: ClientStatus) => {
    setClients((prev) => prev.map((c) => c.id === id ? { ...c, status: newStatus } : c));
    showToast(`Status diubah ke "${STATUS_META[newStatus].label}"`);
  };

  const handleSoftDelete = (clientId: string) => {
    startTransition(async () => {
      const res = await softDeleteClient(clientId);
      if (res.success) {
        const target = clients.find((c) => c.id === clientId);
        if (target) {
          const deletedItem = { ...target, deleted_at: new Date().toISOString() };
          setClients((prev) => prev.filter((c) => c.id !== clientId));
          setTrashed((prev) => [deletedItem, ...prev]);
          showToast(`${target.full_name} dipindahkan ke sampah`);
        }
      } else {
        showToast(res.error ?? "Gagal memindahkan ke sampah", "err");
      }
    });
  };

  const handleRestore = (clientId: string) => {
    const target = trashed.find((c) => c.id === clientId);
    if (target) {
      const restored = { ...target, deleted_at: null };
      setTrashed((prev) => prev.filter((c) => c.id !== clientId));
      setClients((prev) => [restored, ...prev]);
      showToast(`${target.full_name} berhasil dipulihkan`);
    }
  };

  const handlePermanentDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    const res = await permanentDeleteClient(deleteTarget.id);
    setIsDeleting(false);
    if (res.success) {
      setTrashed((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      showToast(`${deleteTarget.full_name} dihapus permanen`);
      setDeleteTarget(null);
    } else {
      showToast(res.error ?? "Gagal menghapus", "err");
    }
  };

  const handleEmptyTrash = () => {
    startTransition(async () => {
      const res = await emptyTrash();
      if (res.success) {
        setTrashed([]);
        showToast(`${res.count ?? 0} item dihapus permanen dari sampah`);
      } else {
        showToast(res.error ?? "Gagal mengosongkan sampah", "err");
      }
    });
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const handleInvoiceConfirm = (invoiceNumber: string) => {
    if (!invoiceTarget) return;
    setClients((prev) =>
      prev.map((c) => c.id === invoiceTarget.id ? { ...c, status: "completed" as ClientStatus } : c)
    );
    showToast(`Invoice ${invoiceNumber} berhasil dibuat`);
  };

  const handleInvoiceSkip = () => {
    if (!invoiceTarget) return;
    const targetId = invoiceTarget.id;
    startTransition(async () => {
      const res = await updateClientStatus(targetId, "completed");
      if (res.success) {
        setClients((prev) =>
          prev.map((c) => c.id === targetId ? { ...c, status: "completed" as ClientStatus } : c)
        );
        showToast(`Status diubah ke "Selesai"`);
      }
    });
    setInvoiceTarget(null);
  };

  return {
    router,
    activeTab, setActiveTab,
    clients, trashed, filtered, stats, serviceCounts, hasActiveFilter,
    search, setSearch, filterService, setFilterService, filterStatus, setFilterStatus, resetFilters,
    detailClient, setDetailClient,
    deleteTarget, setDeleteTarget,
    invoiceTarget, setInvoiceTarget,
    isDeleting, isLoggingOut,
    toast,
    handleStatusUpdate, handleSoftDelete, handleRestore,
    handlePermanentDelete, handleEmptyTrash, handleLogout,
    handleInvoiceConfirm, handleInvoiceSkip,
  };
}
