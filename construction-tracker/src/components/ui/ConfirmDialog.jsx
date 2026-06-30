import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmDialog({ title = 'Are you sure?', message, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onCancel()}>
      <div className="modal" style={{ maxWidth: 400 }}>
        <div className="modal-body" style={{ alignItems: 'center', textAlign: 'center', paddingTop: 32 }}>
          <div style={{
            width: 48, height: 48, borderRadius: '50%',
            background: 'var(--red-light)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', marginBottom: 4,
          }}>
            <AlertTriangle size={22} color="var(--red)" />
          </div>
          <h3 style={{ fontSize: 16 }}>{title}</h3>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{message}</p>
        </div>
        <div className="modal-footer" style={{ justifyContent: 'center' }}>
          <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
          <button className="btn btn-danger" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}
