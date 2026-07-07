const express = require('express');
const router = express.Router();
const {
  getLeads,
  getLead,
  updateLead,
  getNotes,
  addNote,
  updateNote,
  deleteNote,
} = require('../controllers/leadController');

router.get('/', getLeads);
router.get('/:id', getLead);
router.put('/:id', updateLead);

// Notes sub-resource
router.get('/:id/notes', getNotes);
router.post('/:id/notes', addNote);
router.put('/:id/notes/:noteId', updateNote);
router.delete('/:id/notes/:noteId', deleteNote);

module.exports = router;
