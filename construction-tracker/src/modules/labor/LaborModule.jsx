import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line } from 'recharts';
import { useApp } from '../../context/AppContext';
import WorkerFormModal from './WorkerFormModal';
import AttendanceModal from './AttendanceModal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import StatCard from '../../components/ui/StatCard';
import { formatCurrency } from '../../utils/format';
import { exportToCSV, exportLaborPDF } from '../../utils/exportUtils';
import { Plus, Pencil, Trash2, CalendarCheck, Users, Wallet, HardHat, TrendingUp, FileDown, FileText } from 'lucide-react';

const ROLE_COLORS = ['#FF8C00', '#0B1F3B', '#16a34a', '#7C3AED', '#dc2626', '#0891b2', '#d97706', '#db2777'];

export default function LaborModule({ siteId, site }) {
  const { getSiteWorkers, addWorker, updateWorker, deleteWorker, getWorkerDaysPresent, getTotalLaborCost, getWorkerAttendance } = useApp();
  const workers = getSiteWorkers(siteId);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [attendanceWorker, setAttendanceWorker] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const totalLaborCost = getTotalLaborCost(siteId);

  const workerCostData = useMemo(() => {
    return workers.map((w, i) => {
      const days = getWorkerDaysPresent(siteId, w.id);
      return {
        name: w.name.split(' ')[0],
        cost: days * w.dailyWage,
        days,
        fill: ROLE_COLORS[i % ROLE_COLORS.length],
      };
    }).sort((a, b) => b.cost - a.cost);
  }, [workers, siteId]);

  const laborTrendData = useMemo(() => {
    const map = {};
    workers.forEach(w => {
      const dates = getWorkerAttendance(siteId, w.id);
      dates.forEach(date => {
        const month = new Date(date).toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
        map[month] = (map[month] || 0) + w.dailyWage;
      });
    });
    const entries = Object.entries(map).map(([month, cost]) => ({ month, cost }));
    return entries.length ? entries : [{ month: 'No Data', cost: 0 }];
  }, [workers, siteId]);

  const handleSubmit = (data) => {
    if (editing) updateWorker(siteId, editing.id, data);
    else addWorker(siteId, data);
    setEditing(null);
  };

  const handleExportCSV = () => {
    exportToCSV(
      `${(site?.name || 'site').replace(/\s+/g, '-')}-labor.csv`,
      ['Worker', 'Role', 'Daily Wage', 'Days Present', 'Total Cost'],
      workers.map((w) => {
        const days = getWorkerDaysPresent(siteId, w.id);
        return [w.name, w.role, w.dailyWage, days, days * w.dailyWage];
      })
    );
  };

  const handleExportPDF = () => {
    exportLaborPDF(site, workers, (workerId) => getWorkerDaysPresent(siteId, workerId), totalLaborCost);
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h2>Labor Cost Tracking</h2>
          <p>Manage workers, attendance, and auto-calculated wages</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost" onClick={handleExportCSV} disabled={workers.length === 0}>
            <FileDown size={16} /> Export CSV
          </button>
          <button className="btn btn-ghost" onClick={handleExportPDF} disabled={workers.length === 0}>
            <FileText size={16} /> Download PDF
          </button>
          <button className="btn btn-primary" onClick={() => { setEditing(null); setShowForm(true); }}>
            <Plus size={16} /> Add Worker
          </button>
        </div>
      </div>

      <div className="grid-3" style={{ marginBottom: 20 }}>
        <StatCard icon={Users} label="Total Workers" value={workers.length} color="#0B1F3B" />
        <StatCard icon={Wallet} label="Total Labor Cost" value={formatCurrency(totalLaborCost)} color="#FF8C00" />
        <StatCard icon={HardHat} label="Avg. Daily Wage" value={formatCurrency(workers.length ? workers.reduce((s,w)=>s+w.dailyWage,0)/workers.length : 0)} color="#16a34a" />
      </div>

      {/* Workers table */}
      <div className="card" style={{ marginBottom: 20 }}>
        <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Worker Directory</h4>
        {workers.length === 0 ? (
          <div className="empty-state">
            <Users size={36} />
            <h4>No workers added yet</h4>
            <p>Add a worker to start tracking attendance and labor costs</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Worker</th>
                  <th>Role</th>
                  <th>Daily Wage</th>
                  <th>Days Present</th>
                  <th>Total Cost</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {workers.map(w => {
                  const days = getWorkerDaysPresent(siteId, w.id);
                  return (
                    <tr key={w.id}>
                      <td>{w.name}</td>
                      <td><span className="badge badge-gray">{w.role}</span></td>
                      <td>{formatCurrency(w.dailyWage)}</td>
                      <td>
                        <button className="btn btn-sm" style={{ background: 'var(--orange-dim)', color: 'var(--orange)' }}
                          onClick={() => setAttendanceWorker(w)}>
                          <CalendarCheck size={13} /> {days} days
                        </button>
                      </td>
                      <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{formatCurrency(days * w.dailyWage)}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                          <button className="btn btn-ghost btn-icon btn-sm" onClick={() => { setEditing(w); setShowForm(true); }}>
                            <Pencil size={14} />
                          </button>
                          <button className="btn btn-ghost btn-icon btn-sm" style={{ color: 'var(--red)' }}
                            onClick={() => setDeleteTarget(w)}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border)', textAlign: 'right' }}>
          <span className="text-sm font-semibold">Total Labor Cost for Site: {formatCurrency(totalLaborCost)}</span>
        </div>
      </div>

      {/* Charts */}
      <div className="grid-2">
        <div className="card">
          <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Worker-wise Cost</h4>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>Total earned per worker based on attendance</p>
          {workerCostData.length === 0 ? (
            <div className="empty-state" style={{ height: 280 }}><TrendingUp size={32} /><p>No data</p></div>
          ) : (
            <div style={{ height: 280, overflowY: 'auto', overflowX: 'hidden' }}>
              <div style={{ height: Math.max(280, workerCostData.length * 36) }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={workerCostData} layout="vertical" margin={{ left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
                    <XAxis type="number" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false}
                      tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} width={70} />
                    <Tooltip formatter={(v) => formatCurrency(v)} cursor={{ fill: 'var(--surface)' }} />
                    <Bar dataKey="cost" radius={[0, 6, 6, 0]} barSize={20}>
                      {workerCostData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>

        <div className="card">
          <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Labor Cost Over Time</h4>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>Monthly labor expenditure trend</p>
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={laborTrendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={{ stroke: 'var(--border)' }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false}
                  tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={(v) => formatCurrency(v)} />
                <Line type="monotone" dataKey="cost" stroke="#7C3AED" strokeWidth={3} dot={{ r: 4, fill: '#7C3AED' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {showForm && (
        <WorkerFormModal
          initial={editing}
          onClose={() => { setShowForm(false); setEditing(null); }}
          onSubmit={handleSubmit}
        />
      )}

      {attendanceWorker && (
        <AttendanceModal siteId={siteId} worker={attendanceWorker} onClose={() => setAttendanceWorker(null)} />
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Remove this worker?"
          message={`"${deleteTarget.name}" and their attendance records will be permanently removed.`}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => { deleteWorker(siteId, deleteTarget.id); setDeleteTarget(null); }}
        />
      )}
    </div>
  );
}
