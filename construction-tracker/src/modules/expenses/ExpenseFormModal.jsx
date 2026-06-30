import React, { useState, useEffect } from 'react';
import Modal from '../../components/ui/Modal';
import { Plus, Save } from 'lucide-react';

const CATEGORIES = ['Material', 'Transport', 'Misc', 'Other'];

export default function ExpenseFormModal({ onClose, onSubmit, initial }) {
  const [form, setForm] = useState({
    name: initial?.name || '',
    category: initial?.category || 'Material',
    amount: initial?.amount || '',
    date: initial?.date || new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.amount || !form.date) return;
    onSubmit({ ...form, amount: Number(form.amount) });
    onClose();
  };

  return (
    <Modal title={initial ? 'Edit Expense' : 'Add Expense'} onClose={onClose} footer={
      <>
        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button type="submit" form="expense-form" className="btn btn-primary">
          {initial ? <><Save size={15} /> Save Changes</> : <><Plus size={15} /> Add Expense</>}
        </button>
      </>
    }>
      <form id="expense-form" onSubmit={handleSubmit} className="modal-body">
        <div className="form-group">
          <label className="form-label">Expense Name *</label>
          <input type="text" className="form-input" placeholder="e.g. Cement bags - 50 units"
            value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
        </div>
        <div className="grid-2" style={{ gap: 14 }}>
          <div className="form-group">
            <label className="form-label">Category *</label>
            <select className="form-select" value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Amount (₹) *</label>
            <input type="number" className="form-input" placeholder="0" min="0" step="0.01"
              value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} required />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Date *</label>
          <input type="date" className="form-input" value={form.date}
            onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required />
        </div>
      </form>
    </Modal>
  );
}
