import React from 'react';
import { Eye, Pencil } from 'lucide-react';
import StatusPill from '../common/StatusPill';
import { formatDate } from '../../utils/formatDate';

const COLUMNS = ['Name', 'Mobile', 'Email', 'Status', 'Assigned', 'Created', 'Actions'];

export default function LeadTable({ leads, onView, onEdit }) {
  return (
    <div className="hidden md:block bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead>
            <tr className="bg-gray-50">
              {COLUMNS.map((col) => (
                <th
                  key={col}
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {leads.map((lead) => (
              <tr
                key={lead.id}
                className="hover:bg-gray-50 transition-colors duration-100 group"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-semibold text-primary-700">
                        {lead.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-900 truncate max-w-[160px]">
                      {lead.name}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{lead.mobile}</td>
                <td className="px-4 py-3 text-sm text-gray-600 truncate max-w-[180px]">{lead.email}</td>
                <td className="px-4 py-3">
                  <StatusPill status={lead.status} />
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{lead.assigned}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{formatDate(lead.created)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    <button
                      id={`view-lead-${lead.id}`}
                      onClick={() => onView(lead)}
                      className="p-1.5 rounded-lg hover:bg-primary-50 text-gray-400 hover:text-primary-600 transition-colors"
                      title="View lead"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      id={`edit-lead-${lead.id}`}
                      onClick={() => onEdit(lead)}
                      className="p-1.5 rounded-lg hover:bg-amber-50 text-gray-400 hover:text-amber-600 transition-colors"
                      title="Edit lead"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
