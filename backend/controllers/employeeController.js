const Employee = require('../models/Employee');

// ─── GET /api/employees ─────────────────────────────────────────────────────────
exports.getEmployees = async (req, res, next) => {
  try {
    const employees = await Employee.find({ active: true }).lean();
    res.json(employees);
  } catch (error) {
    next(error);
  }
};
