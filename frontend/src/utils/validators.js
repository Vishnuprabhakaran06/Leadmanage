/**
 * Validate a lead form payload.
 * Returns an object where keys are field names and values are error strings.
 * An empty object means the form is valid.
 */
export function validateLead({ name, mobile, email, status, assigned }, allowedStatuses = [], allowedAssigned = []) {
  const errors = {};

  // Name: required, non-empty after trim
  if (!name || !name.trim()) {
    errors.name = 'Name is required.';
  }

  // Mobile: exactly 10 digits, must start 6–9
  if (!mobile) {
    errors.mobile = 'Mobile number is required.';
  } else if (!/^[6-9]\d{9}$/.test(mobile.trim())) {
    errors.mobile = 'Enter a valid 10-digit mobile number starting with 6–9.';
  }

  // Email: standard email regex
  if (!email) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.email = 'Enter a valid email address.';
  }

  // Status: must be one of allowed enum values
  if (allowedStatuses.length > 0 && !allowedStatuses.includes(status)) {
    errors.status = 'Please select a valid status.';
  }

  // Assigned: must be one of allowed enum values
  if (allowedAssigned.length > 0 && !allowedAssigned.includes(assigned)) {
    errors.assigned = 'Please select a valid employee.';
  }

  return errors;
}

export function hasErrors(errors) {
  return Object.keys(errors).length > 0;
}
