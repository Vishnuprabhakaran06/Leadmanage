const Lead = require('../models/Lead');

// ─── GET /api/leads ─────────────────────────────────────────────────────────────
// Query params: search, status, assigned, from, to, page, pageSize
exports.getLeads = async (req, res, next) => {
  try {
    const {
      search = '',
      status = '',
      assigned = '',
      from = '',
      to = '',
      page = 1,
      pageSize = 10,
    } = req.query;

    const filter = {};

    // Search across name, mobile, email (case-insensitive regex)
    if (search) {
      const regex = new RegExp(search, 'i');
      filter.$or = [
        { name: regex },
        { mobile: regex },
        { email: regex },
      ];
    }

    if (status) filter.status = status;
    if (assigned) filter.assignedEmployee = assigned;

    // Date range on createdDate
    if (from || to) {
      filter.createdDate = {};
      if (from) filter.createdDate.$gte = new Date(from);
      if (to) {
        // Include the entire "to" day
        const toDate = new Date(to);
        toDate.setHours(23, 59, 59, 999);
        filter.createdDate.$lte = toDate;
      }
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const size = Math.max(1, Math.min(100, parseInt(pageSize, 10) || 10));
    const skip = (pageNum - 1) * size;

    const [data, total] = await Promise.all([
      Lead.find(filter)
        .sort({ createdDate: -1 })
        .skip(skip)
        .limit(size)
        .select('-notes')   // Don't include notes in list view for performance
        .lean(),
      Lead.countDocuments(filter),
    ]);

    res.json({ data, total, page: pageNum, pageSize: size });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/leads/:id ─────────────────────────────────────────────────────────
exports.getLead = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id).lean();
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found.' });
    }
    res.json(lead);
  } catch (error) {
    next(error);
  }
};

// ─── PUT /api/leads/:id ─────────────────────────────────────────────────────────
exports.updateLead = async (req, res, next) => {
  try {
    const { name, mobile, email, status, assignedEmployee } = req.body;

    // Field-level validation
    const errors = {};

    if (name !== undefined && !name.trim()) {
      errors.name = 'Name is required.';
    }
    if (mobile !== undefined) {
      if (!/^[6-9]\d{9}$/.test(mobile)) {
        errors.mobile = 'Mobile must be a valid 10-digit Indian number.';
      }
    }
    if (email !== undefined) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = 'Email must be a valid email address.';
      }
    }
    if (status !== undefined) {
      const validStatuses = ['New', 'Contacted', 'Qualified', 'Proposal', 'Won', 'Converted', 'Lost'];
      if (!validStatuses.includes(status)) {
        errors.status = `Status must be one of: ${validStatuses.join(', ')}`;
      }
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: 'Validation failed.', errors });
    }

    const updateFields = {};
    if (name !== undefined) updateFields.name = name.trim();
    if (mobile !== undefined) updateFields.mobile = mobile;
    if (email !== undefined) updateFields.email = email;
    if (status !== undefined) updateFields.status = status;
    if (assignedEmployee !== undefined) updateFields.assignedEmployee = assignedEmployee;

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).lean();

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found.' });
    }

    res.json(lead);
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/leads/:id/notes ───────────────────────────────────────────────────
exports.getNotes = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id).select('notes').lean();
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found.' });
    }
    res.json(lead.notes || []);
  } catch (error) {
    next(error);
  }
};

// ─── POST /api/leads/:id/notes ──────────────────────────────────────────────────
exports.addNote = async (req, res, next) => {
  try {
    const { text, createdBy } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Note text is required.' });
    }

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          notes: {
            $each: [{ text: text.trim(), createdBy: createdBy || 'Unknown', createdDate: new Date() }],
            $position: 0, // prepend
          },
        },
      },
      { new: true }
    ).select('notes').lean();

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found.' });
    }

    res.status(201).json(lead.notes);
  } catch (error) {
    next(error);
  }
};

// ─── PUT /api/leads/:id/notes/:noteId ───────────────────────────────────────────
exports.updateNote = async (req, res, next) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Note text is required.' });
    }

    const lead = await Lead.findOneAndUpdate(
      { _id: req.params.id, 'notes._id': req.params.noteId },
      { $set: { 'notes.$.text': text.trim() } },
      { new: true }
    ).select('notes').lean();

    if (!lead) {
      return res.status(404).json({ message: 'Lead or note not found.' });
    }

    // Return the updated note
    const updatedNote = lead.notes.find(
      (n) => n._id.toString() === req.params.noteId
    );
    res.json(updatedNote);
  } catch (error) {
    next(error);
  }
};

// ─── DELETE /api/leads/:id/notes/:noteId ────────────────────────────────────────
exports.deleteNote = async (req, res, next) => {
  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { $pull: { notes: { _id: req.params.noteId } } },
      { new: true }
    ).select('notes').lean();

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found.' });
    }

    res.json({ message: 'Note deleted.', notes: lead.notes });
  } catch (error) {
    next(error);
  }
};
