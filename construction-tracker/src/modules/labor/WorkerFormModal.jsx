import React, { useState } from 'react';
import Modal from '../../components/ui/Modal';
import { Plus, Save } from 'lucide-react';

const ROLES = ['Mason', 'Carpenter', 'Electrician', 'Plumber', 'Helper', 'Supervisor', 'Welder', 'Painter'];

export default function WorkerFormModal({ onClose, onSubmit, initial }) {
  const [form, setForm] = useState({
    name: initial?.name || '',
    role: initial?.role || 'Mason',
    dailyWage: initial?.dailyWage || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.dailyWage) return;
    onSubmit({ ...form, dailyWage: Number(form.dailyWage) });
    onClose();
  };

  return (
    <Modal title={initial ? 'Edit Worker' : 'Add Worker'} onClose={onClose} footer={
      <>
        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button type="submit" form="worker-form" className="btn btn-primary">
          {initial ? <><Save size={15} /> Save Changes</> : <><Plus size={15} /> Add Worker</>}
        </button>
      </>
    }>
      <form id="worker-form" onSubmit={handleSubmit} className="modal-body">
        <div className="form-group">
          <label className="form-label">Worker Name *</label>
          <input type="text" className="form-input" placeholder="e.g. Ramesh Kumar"
            value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
        </div>
        <div className="grid-2" style={{ gap: 14 }}>
          <div className="form-group">
            <label className="form-label">Role *</label>
            <select className="form-select" value={form.role}
              onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Daily Wage (₹) *</label>
            <input type="number" className="form-input" placeholder="500" min="0"
              value={form.dailyWage} onChange={e => setForm(f => ({ ...f, dailyWage: e.target.value }))} required />
          </div>
        </div>
      </form>
    </Modal>
  );
}
