import React, { useState, useRef } from 'react';
import { formatDateTime } from '../../utils/formatDate';
import { Pencil, Trash2, Check, X, AlertTriangle } from 'lucide-react';
import Button from '../common/Button';

export default function NoteItem({ note, onEdit, onDelete }) {
  const [editing, setEditing]     = useState(false);
  const [editText, setEditText]   = useState(note.text);
  const [confirming, setConfirming] = useState(false);
  const [saving, setSaving]       = useState(false);
  const [deleting, setDeleting]   = useState(false);
  const textareaRef               = useRef(null);

  const handleEditStart = () => {
    setEditText(note.text);
    setEditing(true);
    setTimeout(() => textareaRef.current?.focus(), 50);
  };

  const handleEditSave = async () => {
    if (!editText.trim()) return;
    setSaving(true);
    try {
      await onEdit(note.id, editText.trim());
      setEditing(false);
    } catch {
      // error handled by parent / hook
    } finally {
      setSaving(false);
    }
  };

  const handleEditCancel = () => {
    setEditing(false);
    setEditText(note.text);
  };

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    try {
      await onDelete(note.id);
    } catch {
      setDeleting(false);
      setConfirming(false);
    }
  };

  return (
    <div className={`rounded-xl border p-4 space-y-2 transition-all duration-150 ${note._optimistic ? 'opacity-60' : 'bg-white border-gray-100 shadow-sm'}`}>
      {editing ? (
        <div className="space-y-2">
          <textarea
            ref={textareaRef}
            id={`note-edit-${note.id}`}
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            rows={3}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900
              focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 resize-none"
          />
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" size="sm" onClick={handleEditCancel} id={`note-cancel-${note.id}`}>
              <X className="w-3.5 h-3.5" /> Cancel
            </Button>
            <Button size="sm" onClick={handleEditSave} loading={saving} disabled={!editText.trim()} id={`note-save-${note.id}`}>
              <Check className="w-3.5 h-3.5" /> Save
            </Button>
          </div>
        </div>
      ) : confirming ? (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 rounded-lg p-3">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            Are you sure you want to delete this note?
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" size="sm" onClick={() => setConfirming(false)} id={`note-cancel-delete-${note.id}`}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" loading={deleting} onClick={handleDeleteConfirm} id={`note-confirm-delete-${note.id}`}>
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </Button>
          </div>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-800 whitespace-pre-wrap">{note.text}</p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">
              {note.createdBy} · {formatDateTime(note.updatedAt || note.createdAt)}
            </span>
            <div className="flex items-center gap-1">
              <button
                id={`note-edit-btn-${note.id}`}
                onClick={handleEditStart}
                className="p-1 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                title="Edit note"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                id={`note-delete-btn-${note.id}`}
                onClick={() => setConfirming(true)}
                className="p-1 rounded-md hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                title="Delete note"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
