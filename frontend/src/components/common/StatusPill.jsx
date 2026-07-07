import React from 'react';

const STATUS_STYLES = {
  New:       'bg-blue-100 text-blue-700 ring-blue-600/20',
  Contacted: 'bg-yellow-100 text-yellow-700 ring-yellow-600/20',
  Qualified: 'bg-purple-100 text-purple-700 ring-purple-600/20',
  Converted: 'bg-teal-100 text-teal-700 ring-teal-600/20',
  Proposal:  'bg-orange-100 text-orange-700 ring-orange-600/20',
  Won:       'bg-green-100 text-green-700 ring-green-600/20',
  Lost:      'bg-red-100 text-red-600 ring-red-600/20',
};

const DEFAULT_STYLE = 'bg-gray-100 text-gray-600 ring-gray-500/20';

/**
 * Maps a status string to a color pill badge.
 */
export default function StatusPill({ status }) {
  const styles = STATUS_STYLES[status] || DEFAULT_STYLE;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${styles}`}
    >
      {status || 'Unknown'}
    </span>
  );
}

export const ALL_STATUSES = Object.keys(STATUS_STYLES);
