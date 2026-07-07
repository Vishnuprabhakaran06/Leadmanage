// ─── Real API data layer ────────────────────────────────────────────────────────
// All functions call the Node/Express/MongoDB backend via axiosClient.
// Response fields are transformed to match the frontend's expected shape.

import axiosClient from './axiosClient';

// ─── Transform helpers ──────────────────────────────────────────────────────────
// Backend uses: _id, courseInterested, leadSource, assignedEmployee, createdDate
// Frontend expects: id, course, source, assigned, created

function transformLead(lead) {
  if (!lead) return lead;
  return {
    id: lead._id,
    name: lead.name,
    mobile: lead.mobile,
    email: lead.email,
    address: lead.address,
    course: lead.courseInterested,
    source: lead.leadSource,
    status: lead.status,
    assigned: lead.assignedEmployee,
    created: lead.createdDate,
    notes: lead.notes ? lead.notes.map(transformNote) : undefined,
  };
}

function transformNote(note) {
  if (!note) return note;
  return {
    id: note._id,
    text: note.text,
    createdBy: note.createdBy,
    createdAt: note.createdDate,
  };
}

function normalizeError(err) {
  const message =
    err?.response?.data?.message ||
    err?.message ||
    'Something went wrong.';
  throw { message };
}

// ─── Service functions ──────────────────────────────────────────────────────────

export async function getLeads({ search = '', status = '', assigned = '', from = '', to = '', page = 1, pageSize = 10 } = {}) {
  try {
    const params = { search, status, assigned, from, to, page, pageSize };
    const { data } = await axiosClient.get('/leads', { params });
    return {
      data: data.data.map(transformLead),
      total: data.total,
      page: data.page,
      pageSize: data.pageSize,
    };
  } catch (err) {
    normalizeError(err);
  }
}

export async function getLead(id) {
  try {
    const { data } = await axiosClient.get(`/leads/${id}`);
    return transformLead(data);
  } catch (err) {
    normalizeError(err);
  }
}

export async function updateLead(id, payload) {
  try {
    // Transform frontend field names back to backend field names
    const backendPayload = {};
    if (payload.name !== undefined) backendPayload.name = payload.name;
    if (payload.mobile !== undefined) backendPayload.mobile = payload.mobile;
    if (payload.email !== undefined) backendPayload.email = payload.email;
    if (payload.status !== undefined) backendPayload.status = payload.status;
    if (payload.assigned !== undefined) backendPayload.assignedEmployee = payload.assigned;

    const { data } = await axiosClient.put(`/leads/${id}`, backendPayload);
    return transformLead(data);
  } catch (err) {
    normalizeError(err);
  }
}

export async function getNotes(id) {
  try {
    const { data } = await axiosClient.get(`/leads/${id}/notes`);
    return data.map(transformNote);
  } catch (err) {
    normalizeError(err);
  }
}

export async function addNote(id, text) {
  try {
    const { data } = await axiosClient.post(`/leads/${id}/notes`, {
      text,
      createdBy: 'You',
    });
    // Backend returns the full notes array; return the first (newest) note
    const notes = data.map(transformNote);
    return notes[0];
  } catch (err) {
    normalizeError(err);
  }
}

export async function updateNote(leadId, noteId, text) {
  try {
    const { data } = await axiosClient.put(`/leads/${leadId}/notes/${noteId}`, { text });
    return transformNote(data);
  } catch (err) {
    normalizeError(err);
  }
}

export async function deleteNote(leadId, noteId) {
  try {
    await axiosClient.delete(`/leads/${leadId}/notes/${noteId}`);
  } catch (err) {
    normalizeError(err);
  }
}

export async function getEmployees() {
  try {
    const { data } = await axiosClient.get('/employees');
    return data.map((emp) => ({
      id: emp._id,
      name: emp.name,
    }));
  } catch (err) {
    normalizeError(err);
  }
}
