"use client";

import type { ClientStatus } from "@/app/actions/dashboardactions";
import type { Testimoni } from "@/types/testimoni";
import type { InvoiceData } from "@/app/actions/invoice-actions";
import type { AnalyticsStats } from "./services/analytics.service";

import { useDashboardState } from "./hooks/useDashboardState";
import { DashboardHeader } from "./components/DashboardHeader";
import { Toast } from "./components/Toast";
import { ClientTab } from "./tabs/ClientTab";
import { TrashTab } from "./tabs/TrashTab";
import { TestimoniModerationTab } from "./tabs/TestimoniTab";
import { PesanMasukTab, type ContactMessage } from "./tabs/ContactTab";
import { AnalyticsTab } from "./tabs/AnalyticsTab";
import { DetailModal } from "./modals/DetailModal";
import { InvoiceModal } from "./modals/InvoiceModal";
import { PermanentDeleteModal } from "./modals/PermanentDeleteModal";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ClientRow {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  phone_number: string;
  service_type: string;
  status: ClientStatus;
  order_code: string | null;
  deleted_at: string | null;
}

interface Props {
  clients: ClientRow[];
  trashedClients: ClientRow[];
  adminEmail: string;
  pendingTestimonials:  Testimoni[];
  approvedTestimonials: Testimoni[];
  rejectedTestimonials: Testimoni[];
  contactMessages: ContactMessage[];
  analyticsStats: AnalyticsStats;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function DashboardClient({
  clients: initialClients,
  trashedClients: initialTrashed,
  adminEmail,
  pendingTestimonials,
  approvedTestimonials,
  rejectedTestimonials,
  contactMessages,
  analyticsStats,
}: Props) {
  const {
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
  } = useDashboardState(initialClients, initialTrashed);

  return (
    <div className="min-h-screen bg-slate-50">
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      {detailClient && (
        <DetailModal client={detailClient} onClose={() => setDetailClient(null)} />
      )}

      {deleteTarget && (
        <PermanentDeleteModal
          client={deleteTarget}
          onConfirm={handlePermanentDelete}
          onCancel={() => setDeleteTarget(null)}
          isLoading={isDeleting}
        />
      )}

      {invoiceTarget && (
        <InvoiceModal
          clientId={invoiceTarget.id}
          clientName={invoiceTarget.full_name}
          clientEmail={invoiceTarget.email}
          clientPhone={invoiceTarget.phone_number}
          serviceType={invoiceTarget.service_type}
          onConfirm={(invoice: InvoiceData) => handleInvoiceConfirm(invoice.invoice_number)}
          onSkip={handleInvoiceSkip}
          onClose={() => setInvoiceTarget(null)}
        />
      )}

      <DashboardHeader
        adminEmail={adminEmail}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onRefresh={() => router.refresh()}
        onLogout={handleLogout}
        isLoggingOut={isLoggingOut}
        clientCount={clients.length}
        trashCount={trashed.length}
        pendingTestimoniCount={pendingTestimonials.length}
        unreadMessageCount={contactMessages.filter(m => !m.is_read).length}
      />

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">

        {activeTab === "clients" && (
          <ClientTab
            clients={clients}
            filtered={filtered}
            stats={stats}
            serviceCounts={serviceCounts}
            hasActiveFilter={hasActiveFilter}
            search={search}
            onSearchChange={setSearch}
            filterService={filterService}
            onFilterServiceChange={setFilterService}
            filterStatus={filterStatus}
            onFilterStatusChange={setFilterStatus}
            onResetFilters={resetFilters}
            onStatusUpdate={(id: string, s: ClientStatus) => handleStatusUpdate(id, s)}
            onComplete={(id) => {
              const target = clients.find(c => c.id === id);
              if (target) setInvoiceTarget(target);
            }}
            onViewDetail={setDetailClient}
            onSoftDelete={handleSoftDelete}
          />
        )}

        {activeTab === "trash" && (
          <>
            <div>
              <h1 className="text-2xl font-black text-slate-900">Folder Sampah</h1>
              <p className="mt-1 text-sm text-slate-500">
                Data dihapus otomatis permanen setelah 7 hari. Klik Pulihkan untuk membatalkan.
              </p>
            </div>
            <TrashTab
              items={trashed}
              onRestore={handleRestore}
              onPermanentDelete={(client) => setDeleteTarget(client)}
              onEmptyTrash={handleEmptyTrash}
            />
          </>
        )}

        {activeTab === "testimoni" && (
          <TestimoniModerationTab
            initialPending={pendingTestimonials}
            initialApproved={approvedTestimonials}
            initialRejected={rejectedTestimonials}
          />
        )}

        {activeTab === "pesan" && (
          <PesanMasukTab initialMessages={contactMessages} />
        )}

        {activeTab === "analytics" && (
          <AnalyticsTab stats={analyticsStats} />
        )}

      </main>
    </div>
  );
}
