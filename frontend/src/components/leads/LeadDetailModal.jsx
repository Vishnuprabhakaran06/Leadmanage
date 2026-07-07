import React from 'react';
import Modal from '../common/Modal';
import StatusPill from '../common/StatusPill';
import NotesPanel from './NotesPanel';
import Spinner from '../common/Spinner';
import ErrorState from '../common/ErrorState';
import { formatDate } from '../../utils/formatDate';
import { User, Phone, Mail, MapPin, BookOpen, Globe, UserCheck, Calendar } from 'lucide-react';

function Field({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-gray-50 last:border-0">
      <div className="w-7 h-7 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="w-3.5 h-3.5 text-primary-600" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-400 mb-0.5">{label}</p>
        <p className="text-sm font-medium text-gray-900 break-words">{value || '—'}</p>
      </div>
    </div>
  );
}

export default function LeadDetailModal({ isOpen, onClose, lead, notes, loading, error, onAddNote, onEditNote, onDeleteNote, onEditLead }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Lead Details" size="xl">
      {loading && <Spinner message="Loading lead…" />}
      {error && <ErrorState message={error} />}

      {!loading && !error && lead && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Lead Info */}
          <div>
            {/* Lead header */}
            <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100">
              <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                <span className="text-xl font-bold text-primary-700">
                  {lead.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900">{lead.name}</h3>
                <StatusPill status={lead.status} />
              </div>
              {onEditLead && (
                <button
                  id="detail-edit-lead-btn"
                  onClick={() => onEditLead(lead)}
                  className="ml-auto text-xs font-medium text-primary-600 hover:text-primary-800 hover:underline"
                >
                  Edit
                </button>
              )}
            </div>

            {/* 9 required fields */}
            <div className="space-y-0">
              <Field icon={User}      label="Name"              value={lead.name} />
              <Field icon={Phone}     label="Mobile"            value={lead.mobile} />
              <Field icon={Mail}      label="Email"             value={lead.email} />
              <Field icon={MapPin}    label="Address"           value={lead.address} />
              <Field icon={BookOpen}  label="Course Interested" value={lead.course} />
              <Field icon={Globe}     label="Lead Source"       value={lead.source} />
              <Field icon={UserCheck} label="Assigned Employee" value={lead.assigned} />
              <Field icon={Calendar}  label="Created Date"      value={formatDate(lead.created)} />
              <div className="flex items-start gap-3 py-2.5">
                <div className="w-7 h-7 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary-600">S</span>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Status</p>
                  <StatusPill status={lead.status} />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Notes */}
          <div className="lg:border-l lg:border-gray-100 lg:pl-6">
            <NotesPanel
              notes={notes}
              onAdd={onAddNote}
              onEdit={onEditNote}
              onDelete={onDeleteNote}
            />
          </div>
        </div>
      )}
    </Modal>
  );
}
