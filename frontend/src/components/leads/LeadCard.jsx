import React from 'react';
import { Eye, Pencil, Mail, Phone, Calendar } from 'lucide-react';
import StatusPill from '../common/StatusPill';
import { formatDate } from '../../utils/formatDate';

export default function LeadCard({ lead, onView, onEdit }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-3 hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-semibold text-primary-700">
              {lead.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{lead.name}</p>
            <p className="text-xs text-gray-400">Assigned: {lead.assigned}</p>
          </div>
        </div>
        <StatusPill status={lead.status} />
      </div>

      {/* Details */}
      <div className="space-y-1.5 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <Phone className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{lead.mobile}</span>
        </div>
        <div className="flex items-center gap-2">
          <Mail className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate">{lead.email}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{formatDate(lead.created)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-1 border-t border-gray-100">
        <button
          id={`card-view-lead-${lead.id}`}
          onClick={() => onView(lead)}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium text-primary-600
            bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors duration-150"
        >
          <Eye className="w-3.5 h-3.5" /> View
        </button>
        <button
          id={`card-edit-lead-${lead.id}`}
          onClick={() => onEdit(lead)}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium text-amber-600
            bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors duration-150"
        >
          <Pencil className="w-3.5 h-3.5" /> Edit
        </button>
      </div>
    </div>
  );
}
