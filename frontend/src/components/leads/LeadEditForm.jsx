import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { validateLead, hasErrors } from '../../utils/validators';
import { updateLead } from '../../api/leadService';
import { ALL_STATUSES } from '../common/StatusPill';
import { CheckCircle2 } from 'lucide-react';

export default function LeadEditForm({ isOpen, onClose, lead, employees, onSuccess }) {
  const [form, setForm]       = useState({ name: '', mobile: '', email: '', status: '', assigned: '' });
  const [errors, setErrors]   = useState({});
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);
  const [apiError, setApiError] = useState('');

  const employeeNames = employees.map((e) => e.name);

  // Initialize form when lead changes
  useEffect(() => {
    if (lead) {
      setForm({
        name:     lead.name     || '',
        mobile:   lead.mobile   || '',
        email:    lead.email    || '',
        status:   lead.status   || '',
        assigned: lead.assigned || '',
      });
      setErrors({});
      setSaved(false);
      setApiError('');
    }
  }, [lead]);

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear field error on change
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateLead(form, ALL_STATUSES, employeeNames);
    if (hasErrors(validationErrors)) {
      setErrors(validationErrors);
      return;
    }

    setSaving(true);
    setApiError('');
    try {
      const updated = await updateLead(lead.id, {
        name:     form.name.trim(),
        mobile:   form.mobile.trim(),
        email:    form.email.trim(),
        status:   form.status,
        assigned: form.assigned,
      });
      setSaved(true);
      onSuccess?.(updated);
      setTimeout(() => {
        setSaved(false);
        onClose();
      }, 900);
    } catch (err) {
      setApiError(err?.message || 'Failed to save lead.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Lead" size="md">
      {lead && (
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <Input
            id="edit-name"
            label="Name *"
            type="text"
            value={form.name}
            onChange={handleChange('name')}
            error={errors.name}
            placeholder="Full name"
            autoFocus
          />

          <Input
            id="edit-mobile"
            label="Mobile *"
            type="tel"
            value={form.mobile}
            onChange={handleChange('mobile')}
            error={errors.mobile}
            placeholder="10-digit mobile number"
            maxLength={10}
          />

          <Input
            id="edit-email"
            label="Email *"
            type="email"
            value={form.email}
            onChange={handleChange('email')}
            error={errors.email}
            placeholder="email@example.com"
          />

          <Select
            id="edit-status"
            label="Status *"
            options={ALL_STATUSES}
            value={form.status}
            onChange={handleChange('status')}
            error={errors.status}
            placeholder="Select status"
          />

          <Select
            id="edit-assigned"
            label="Assigned To *"
            options={employeeNames}
            value={form.assigned}
            onChange={handleChange('assigned')}
            error={errors.assigned}
            placeholder="Select employee"
          />

          {apiError && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{apiError}</p>
          )}

          {saved && (
            <div className="flex items-center gap-2 text-green-700 bg-green-50 rounded-lg px-3 py-2 text-sm">
              <CheckCircle2 className="w-4 h-4" />
              Lead updated successfully!
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" className="flex-1" onClick={onClose} id="edit-cancel-btn">
              Cancel
            </Button>
            <Button type="submit" className="flex-1" loading={saving} id="edit-save-btn">
              {saved ? 'Saved!' : 'Save Changes'}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
