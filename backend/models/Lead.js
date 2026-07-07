const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    text: { type: String },
    createdBy: { type: String },
    createdDate: { type: Date, default: Date.now },
  },
  { _id: true }
);

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'] },
    mobile: {
      type: String,
      required: [true, 'Mobile is required'],
      match: [/^[6-9]\d{9}$/, 'Mobile must be a valid 10-digit Indian number'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email must be a valid email address'],
    },
    address: { type: String },
    courseInterested: { type: String },
    leadSource: {
      type: String,
      enum: {
        values: ['Website', 'Referral', 'Walk-in', 'Social Media', 'Call Center'],
        message: '{VALUE} is not a valid lead source',
      },
    },
    status: {
      type: String,
      enum: {
        values: ['New', 'Contacted', 'Qualified', 'Proposal', 'Won', 'Converted', 'Lost'],
        message: '{VALUE} is not a valid status',
      },
      default: 'New',
    },
    assignedEmployee: { type: String },
    createdDate: { type: Date, default: Date.now },
    notes: [noteSchema],
  },
  {
    // Add a virtual `id` field that mirrors `_id` as a string
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model('Lead', leadSchema);
