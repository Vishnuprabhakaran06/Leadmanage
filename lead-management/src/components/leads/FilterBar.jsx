import React, { useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { ALL_STATUSES } from '../common/StatusPill';

export default function FilterBar({ search, filters, employees, onSearchChange, onFilterChange, onReset }) {
  const [showFilters, setShowFilters] = useState(false);

  const hasActiveFilters =
    search || filters.status || filters.assigned || filters.from || filters.to;

  const employeeOptions = employees.map((e) => ({ value: e.name, label: e.name }));
  const statusOptions   = ALL_STATUSES.map((s) => ({ value: s, label: s }));

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-3">
      {/* Row 1: Search + Toggle */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            id="lead-search"
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search name, email, or mobile…"
            className="block w-full rounded-lg border border-gray-300 bg-white pl-9 pr-3 py-2 text-sm text-gray-900
              placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500
              transition-colors duration-150"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <Button
          variant={showFilters ? 'primary' : 'secondary'}
          size="md"
          onClick={() => setShowFilters((v) => !v)}
          id="toggle-filters-btn"
          className="flex-shrink-0"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="hidden sm:inline">Filters</span>
          {hasActiveFilters && (
            <span className="w-2 h-2 bg-primary-400 rounded-full sm:hidden" />
          )}
        </Button>

        {hasActiveFilters && (
          <Button variant="ghost" size="md" onClick={onReset} id="reset-filters-btn" className="flex-shrink-0 text-red-500 hover:text-red-600 hover:bg-red-50">
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Reset</span>
          </Button>
        )}
      </div>

      {/* Row 2: Filter fields (collapsible on mobile) */}
      {showFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-gray-100">
          <Select
            id="filter-status"
            label="Status"
            placeholder="All Statuses"
            options={statusOptions}
            value={filters.status}
            onChange={(e) => onFilterChange({ status: e.target.value })}
          />
          <Select
            id="filter-assigned"
            label="Assigned To"
            placeholder="All Employees"
            options={employeeOptions}
            value={filters.assigned}
            onChange={(e) => onFilterChange({ assigned: e.target.value })}
          />
          <Input
            id="filter-from"
            label="From Date"
            type="date"
            value={filters.from}
            onChange={(e) => onFilterChange({ from: e.target.value })}
          />
          <Input
            id="filter-to"
            label="To Date"
            type="date"
            value={filters.to}
            onChange={(e) => onFilterChange({ to: e.target.value })}
          />
        </div>
      )}

      {/* Active filter summary (always visible on desktop) */}
      {hasActiveFilters && (
        <div className="hidden sm:flex flex-wrap gap-2 pt-1">
          {filters.status && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary-50 text-primary-700 text-xs rounded-full">
              Status: {filters.status}
              <button onClick={() => onFilterChange({ status: '' })} className="hover:text-primary-900" aria-label="Remove status filter"><X className="w-3 h-3" /></button>
            </span>
          )}
          {filters.assigned && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary-50 text-primary-700 text-xs rounded-full">
              Assigned: {filters.assigned}
              <button onClick={() => onFilterChange({ assigned: '' })} className="hover:text-primary-900" aria-label="Remove assigned filter"><X className="w-3 h-3" /></button>
            </span>
          )}
          {filters.from && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary-50 text-primary-700 text-xs rounded-full">
              From: {filters.from}
              <button onClick={() => onFilterChange({ from: '' })} className="hover:text-primary-900" aria-label="Remove from filter"><X className="w-3 h-3" /></button>
            </span>
          )}
          {filters.to && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary-50 text-primary-700 text-xs rounded-full">
              To: {filters.to}
              <button onClick={() => onFilterChange({ to: '' })} className="hover:text-primary-900" aria-label="Remove to filter"><X className="w-3 h-3" /></button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
