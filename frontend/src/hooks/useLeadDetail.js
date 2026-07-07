import { useState, useEffect, useCallback, useRef } from 'react';
import { getLead, getNotes, addNote, updateNote, deleteNote } from '../api/leadService';

export function useLeadDetail(id) {
  const [lead, setLead]       = useState(null);
  const [notes, setNotes]     = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  useEffect(() => {
    if (!id) return;

    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        const [leadData, notesData] = await Promise.all([getLead(id), getNotes(id)]);
        if (mounted.current) {
          setLead(leadData);
          setNotes(notesData);
        }
      } catch (err) {
        if (mounted.current) {
          setError(err?.message || 'Failed to load lead details.');
        }
      } finally {
        if (mounted.current) setLoading(false);
      }
    };

    fetchAll();
  }, [id]);

  // Update lead locally (called after edit success from parent)
  const updateLeadLocal = useCallback((updatedLead) => {
    setLead(updatedLead);
  }, []);

  // Optimistic add note
  const addNoteAction = useCallback(async (text) => {
    const optimistic = {
      id: `temp_${Date.now()}`,
      text,
      createdAt: new Date().toISOString(),
      createdBy: 'You',
      _optimistic: true,
    };
    setNotes((prev) => [optimistic, ...prev]);

    try {
      const saved = await addNote(id, text);
      setNotes((prev) =>
        prev.map((n) => (n.id === optimistic.id ? saved : n))
      );
      return saved;
    } catch (err) {
      // Roll back
      setNotes((prev) => prev.filter((n) => n.id !== optimistic.id));
      throw err;
    }
  }, [id]);

  // Optimistic edit note
  const editNoteAction = useCallback(async (noteId, text) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === noteId ? { ...n, text, _optimistic: true } : n))
    );

    let original;
    setNotes((prev) => {
      original = prev.find((n) => n.id === noteId);
      return prev;
    });

    try {
      const saved = await updateNote(id, noteId, text);
      setNotes((prev) =>
        prev.map((n) => (n.id === noteId ? { ...saved, _optimistic: false } : n))
      );
      return saved;
    } catch (err) {
      // Roll back
      if (original) {
        setNotes((prev) =>
          prev.map((n) => (n.id === noteId ? original : n))
        );
      }
      throw err;
    }
  }, [id]);

  // Optimistic delete note
  const removeNoteAction = useCallback(async (noteId) => {
    let removed;
    setNotes((prev) => {
      removed = prev.find((n) => n.id === noteId);
      return prev.filter((n) => n.id !== noteId);
    });

    try {
      await deleteNote(id, noteId);
    } catch (err) {
      // Roll back
      if (removed) {
        setNotes((prev) => [removed, ...prev]);
      }
      throw err;
    }
  }, [id]);

  return {
    lead,
    notes,
    loading,
    error,
    updateLeadLocal,
    addNote: addNoteAction,
    editNote: editNoteAction,
    removeNote: removeNoteAction,
  };
}
