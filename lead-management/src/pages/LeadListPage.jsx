import React, { useState, useEffect } from 'react';
import { useLeads } from '../hooks/useLeads';
import { useLeadDetail } from '../hooks/useLeadDetail';
import { getEmployees } from '../api/leadService';
import FilterBar from '../components/leads/FilterBar';
import LeadTable from '../components/leads/LeadTable';
import LeadCard from '../components/leads/LeadCard';
import Pagination from '../components/leads/Pagination';
import LeadDetailModal from '../components/leads/LeadDetailModal';
import LeadEditForm from '../components/leads/LeadEditForm';
import Spinner from '../components/common/Spinner';
import ErrorState from '../components/common/ErrorState';
import EmptyState from '../components/common/EmptyState';
import { Users, TrendingUp } from 'lucide-react';

export default function LeadListPage() {
  const {
    leads, total, loading, error,
    search, filters, page, pageSize,
    setSearch, setFilters, setPage, setPageSize,
    resetFilters, refetch,
  } = useLeads();

  const [employees, setEmployees] = useState([]);

  // Selected lead IDs for modals
  const [viewId, setViewId]   = useState(null);
  const [editLead, setEditLead] = useState(null);

  // Fetch employees for filters + edit form
  useEffect(() => {
    getEmployees().then(setEmployees).catch(() => {});
  }, []);

  // Detail hook (view modal)
  const {
    lead: detailLead,
    notes,
    loading: detailLoading,
    error: detailError,
    updateLeadLocal,
    addNote,
    editNote,
    removeNote,
  } = useLeadDetail(viewId);

  const handleView = (lead) => setViewId(lead.id);
  const handleEdit = (lead) => setEditLead(lead);

  // When edit saves, update detail view + list row optimistically
  const handleEditSuccess = (updated) => {
    // Reflect in detail modal if open
    if (viewId === updated.id) updateLeadLocal(updated);
    // Refetch list to show updated row
    refetch();
  };

  // Trigger edit from detail modal
  const handleEditFromDetail = (lead) => {
    setEditLead(lead);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50/30">
      {/* Top nav */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-semibold text-gray-900">LeadManage</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Users className="w-4 h-4" />
            <span>{total} leads</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
        {/* Page title */}
        <div>
          <h1 className="text-xl font-bold text-gray-900">Lead Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">Track, filter, and manage your sales leads.</p>
        </div>

        {/* Filter bar */}
        <FilterBar
          search={search}
          filters={filters}
          employees={employees}
          onSearchChange={setSearch}
          onFilterChange={setFilters}
          onReset={resetFilters}
        />

        {/* Content area */}
        {loading ? (
          <Spinner fullPage message="Loading leads…" />
        ) : error ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : leads.length === 0 ? (
          <EmptyState
            message="No leads found."
            description="Try adjusting your filters or search query."
          />
        ) : (
          <>
            {/* Desktop table */}
            <LeadTable leads={leads} onView={handleView} onEdit={handleEdit} />

            {/* Mobile cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:hidden">
              {leads.map((lead) => (
                <LeadCard key={lead.id} lead={lead} onView={handleView} onEdit={handleEdit} />
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              page={page}
              pageSize={pageSize}
              total={total}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
            />
          </>
        )}
      </main>

      {/* View Modal */}
      <LeadDetailModal
        isOpen={!!viewId}
        onClose={() => setViewId(null)}
        lead={detailLead}
        notes={notes}
        loading={detailLoading}
        error={detailError}
        onAddNote={addNote}
        onEditNote={editNote}
        onDeleteNote={removeNote}
        onEditLead={handleEditFromDetail}
      />

      {/* Edit Modal */}
      <LeadEditForm
        isOpen={!!editLead}
        onClose={() => setEditLead(null)}
        lead={editLead}
        employees={employees}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
}
