const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema(
  {
    name: { type: String },
    role: { type: String },
    active: { type: Boolean, default: true },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model('Employee', employeeSchema);
