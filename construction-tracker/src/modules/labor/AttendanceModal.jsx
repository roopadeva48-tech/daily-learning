import React, { useState, useMemo } from 'react';
import Modal from '../../components/ui/Modal';
import { useApp } from '../../context/AppContext';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { formatCurrency } from '../../utils/format';

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export default function AttendanceModal({ siteId, worker, onClose }) {
  const { getWorkerAttendance, toggleAttendance, getWorkerDaysPresent } = useApp();
  const [viewDate, setViewDate] = useState(new Date());

  const presentDates = useMemo(() => getWorkerAttendance(siteId, worker.id), [siteId, worker.id]);
  const daysPresent = getWorkerDaysPresent(siteId, worker.id);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const fmtKey = (d) => `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  const today = new Date().toISOString().split('T')[0];

  return (
    <Modal title={`Attendance — ${worker.name}`} onClose={onClose} maxWidth={420} footer={
      <button className="btn btn-secondary" onClick={onClose} style={{ width: '100%', justifyContent: 'center' }}>Close</button>
    }>
      <div className="modal-body">
        {/* Summary */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '14px 16px', background: 'var(--surface)', borderRadius: 10,
        }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Days Present</div>
            <div style={{ fontSize: 20, fontWeight: 700, fontFamily: 'Space Grotesk' }}>{daysPresent}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Total Cost</div>
            <div style={{ fontSize: 20, fontWeight: 700, fontFamily: 'Space Grotesk', color: 'var(--orange)' }}>
              {formatCurrency(daysPresent * worker.dailyWage)}
            </div>
          </div>
        </div>

        {/* Month nav */}
        <div className="flex items-center justify-between">
          <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setViewDate(new Date(year, month - 1, 1))}>
            <ChevronLeft size={16} />
          </button>
          <span style={{ fontWeight: 600, fontSize: 14 }}>
            {viewDate.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
          </span>
          <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setViewDate(new Date(year, month + 1, 1))}>
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Calendar grid */}
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 6 }}>
            {WEEKDAYS.map((d, i) => (
              <div key={i} style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{d}</div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
            {cells.map((d, i) => {
              if (!d) return <div key={i} />;
              const key = fmtKey(d);
              const isPresent = presentDates.includes(key);
              const isToday = key === today;
              const isFuture = key > today;
              return (
                <button
                  key={i}
                  disabled={isFuture}
                  onClick={() => toggleAttendance(siteId, worker.id, key)}
                  style={{
                    aspectRatio: '1',
                    borderRadius: 8,
                    border: isToday ? '1.5px solid var(--orange)' : '1px solid var(--border)',
                    background: isPresent ? 'var(--green)' : isFuture ? 'var(--surface)' : '#fff',
                    color: isPresent ? '#fff' : isFuture ? 'var(--text-muted)' : 'var(--text-primary)',
                    fontSize: 12,
                    fontWeight: isToday ? 700 : 500,
                    cursor: isFuture ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.1s',
                    opacity: isFuture ? 0.5 : 1,
                  }}
                >
                  {isPresent ? <Check size={13} /> : d}
                </button>
              );
            })}
          </div>
        </div>

        <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center' }}>
          Tap a day to mark/unmark attendance. Future dates are disabled.
        </p>
      </div>
    </Modal>
  );
}
