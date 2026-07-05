// ─── In-memory mock data ───────────────────────────────────────────────────────
// Swap this file's implementation to real endpoints without changing any
// import outside this file.

const STATUSES = ['New', 'Contacted', 'Qualified', 'Proposal', 'Won', 'Lost'];
const SOURCES  = ['Website', 'Referral', 'Cold Call', 'Social Media', 'Exhibition'];
const COURSES  = ['MBA', 'B.Tech', 'BCA', 'MCA', 'B.Sc', 'M.Sc', 'Diploma'];
const ADDRESSES = [
  'Chennai, Tamil Nadu',
  'Mumbai, Maharashtra',
  'Delhi, NCR',
  'Bangalore, Karnataka',
  'Hyderabad, Telangana',
  'Pune, Maharashtra',
  'Kolkata, West Bengal',
];

const employees = [
  { id: 1, name: 'Aisha Patel' },
  { id: 2, name: 'Rohan Mehta' },
  { id: 3, name: 'Priya Sharma' },
  { id: 4, name: 'Vikram Singh' },
  { id: 5, name: 'Nisha Thomas' },
];

function rand(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(start, end) {
  const d = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return d.toISOString().split('T')[0];
}

let leads = Array.from({ length: 47 }, (_, i) => ({
  id:       i + 1,
  name:     `Lead ${String(i + 1).padStart(2, '0')} — ${['Arjun Kumar', 'Meera Nair', 'Sanjay Rao', 'Divya Menon', 'Rahul Gupta', 'Lakshmi Iyer', 'Amit Shah', 'Pooja Joshi'][i % 8]}`,
  mobile:   `9${String(Math.floor(Math.random() * 1e9)).padStart(9, '0')}`,
  email:    `lead${i + 1}@example.com`,
  address:  rand(ADDRESSES),
  course:   rand(COURSES),
  source:   rand(SOURCES),
  status:   rand(STATUSES),
  assigned: rand(employees).name,
  created:  randomDate(new Date(2024, 0, 1), new Date()),
}));

let notesStore = {};
let nextNoteId = 1;

function delay(ms = 350) {
  return new Promise((r) => setTimeout(r, ms));
}

function normalizeError(err) {
  const message = err?.message || 'Something went wrong.';
  throw { message };
}

// ─── Service functions ─────────────────────────────────────────────────────────

export async function getLeads({ search = '', status = '', assigned = '', from = '', to = '', page = 1, pageSize = 10 } = {}) {
  await delay();
  try {
    let result = [...leads];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.email.toLowerCase().includes(q) ||
          l.mobile.includes(q)
      );
    }
    if (status)   result = result.filter((l) => l.status === status);
    if (assigned) result = result.filter((l) => l.assigned === assigned);
    if (from)     result = result.filter((l) => l.created >= from);
    if (to)       result = result.filter((l) => l.created <= to);

    const total = result.length;
    const start = (page - 1) * pageSize;
    const data  = result.slice(start, start + pageSize);

    return { data, total, page: Number(page), pageSize: Number(pageSize) };
  } catch (err) {
    normalizeError(err);
  }
}

export async function getLead(id) {
  await delay();
  try {
    const lead = leads.find((l) => l.id === Number(id));
    if (!lead) throw { message: 'Lead not found.' };
    return lead;
  } catch (err) {
    normalizeError(err);
  }
}

export async function updateLead(id, payload) {
  await delay();
  try {
    const idx = leads.findIndex((l) => l.id === Number(id));
    if (idx === -1) throw { message: 'Lead not found.' };
    leads[idx] = { ...leads[idx], ...payload };
    return leads[idx];
  } catch (err) {
    normalizeError(err);
  }
}

export async function getNotes(id) {
  await delay();
  try {
    return notesStore[id] ? [...notesStore[id]] : [];
  } catch (err) {
    normalizeError(err);
  }
}

export async function addNote(id, text) {
  await delay();
  try {
    const note = {
      id:        nextNoteId++,
      text,
      createdAt: new Date().toISOString(),
      createdBy: 'You',
    };
    if (!notesStore[id]) notesStore[id] = [];
    notesStore[id].unshift(note);
    return note;
  } catch (err) {
    normalizeError(err);
  }
}

export async function updateNote(id, noteId, text) {
  await delay();
  try {
    const notes = notesStore[id];
    if (!notes) throw { message: 'Notes not found.' };
    const idx = notes.findIndex((n) => n.id === noteId);
    if (idx === -1) throw { message: 'Note not found.' };
    notes[idx] = { ...notes[idx], text, updatedAt: new Date().toISOString() };
    return notes[idx];
  } catch (err) {
    normalizeError(err);
  }
}

export async function deleteNote(id, noteId) {
  await delay();
  try {
    if (!notesStore[id]) return;
    notesStore[id] = notesStore[id].filter((n) => n.id !== noteId);
  } catch (err) {
    normalizeError(err);
  }
}

export async function getEmployees() {
  await delay(150);
  try {
    return [...employees];
  } catch (err) {
    normalizeError(err);
  }
}
