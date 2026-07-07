import React, { useState } from 'react';
import { Send, MessageSquare } from 'lucide-react';
import NoteItem from './NoteItem';
import Button from '../common/Button';
import Spinner from '../common/Spinner';
import EmptyState from '../common/EmptyState';

export default function NotesPanel({ notes, onAdd, onEdit, onDelete }) {
  const [text, setText]       = useState('');
  const [adding, setAdding]   = useState(false);
  const [error, setError]     = useState('');

  const handleAdd = async () => {
    const trimmed = text.trim();
    if (!trimmed) {
      setError('Note cannot be empty.');
      return;
    }
    setAdding(true);
    setError('');
    try {
      await onAdd(trimmed);
      setText('');
    } catch (err) {
      setError(err?.message || 'Failed to add note.');
    } finally {
      setAdding(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleAdd();
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
        <MessageSquare className="w-4 h-4 text-primary-500" />
        Notes
        {notes.length > 0 && (
          <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary-100 text-primary-700 rounded-full">
            {notes.length}
          </span>
        )}
      </div>

      {/* Add note input */}
      <div className="space-y-2">
        <textarea
          id="new-note-input"
          value={text}
          onChange={(e) => { setText(e.target.value); setError(''); }}
          onKeyDown={handleKeyDown}
          placeholder="Add a note… (Ctrl+Enter to save)"
          rows={3}
          className={`block w-full rounded-lg border px-3 py-2 text-sm text-gray-900
            placeholder-gray-400 focus:outline-none focus:ring-1 resize-none transition-colors
            ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'}`}
        />
        {error && <p className="text-xs text-red-600">{error}</p>}
        <div className="flex justify-end">
          <Button size="sm" onClick={handleAdd} loading={adding} disabled={!text.trim()} id="add-note-btn">
            <Send className="w-3.5 h-3.5" />
            Add Note
          </Button>
        </div>
      </div>

      {/* Notes list */}
      {notes.length === 0 ? (
        <EmptyState
          message="No notes yet."
          description="Add a note above to track your interactions."
        />
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
          {notes.map((note) => (
            <NoteItem
              key={note.id}
              note={note}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
