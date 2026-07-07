import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Select from '../common/Select';

const PAGE_SIZE_OPTIONS = [
  { value: 10, label: '10 / page' },
  { value: 25, label: '25 / page' },
  { value: 50, label: '50 / page' },
];

export default function Pagination({ page, pageSize, total, onPageChange, onPageSizeChange }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from       = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to         = Math.min(page * pageSize, total);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white rounded-xl border border-gray-200 shadow-sm px-4 py-3">
      {/* Summary */}
      <p className="text-sm text-gray-500 order-2 sm:order-1">
        {total === 0 ? 'No results' : `Showing ${from}–${to} of ${total}`}
      </p>

      {/* Controls */}
      <div className="flex items-center gap-3 order-1 sm:order-2">
        {/* Page size */}
        <div className="w-32">
          <Select
            id="page-size-select"
            options={PAGE_SIZE_OPTIONS}
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
          />
        </div>

        {/* Prev/Next */}
        <div className="flex items-center gap-1">
          <button
            id="pagination-prev"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50
              disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="px-3 py-1.5 text-sm font-medium text-gray-700 min-w-[80px] text-center">
            {page} / {totalPages}
          </span>

          <button
            id="pagination-next"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50
              disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150"
            aria-label="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
