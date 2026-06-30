import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useApp } from '../../context/AppContext';
import ExpenseFormModal from './ExpenseFormModal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { formatCurrency, formatDate, CATEGORY_COLORS } from '../../utils/format';
import { exportToCSV, exportExpensesPDF } from '../../utils/exportUtils';
import { Plus, Pencil, Trash2, Receipt, Search, FileDown, FileText } from 'lucide-react';

export default function ExpensesModule({ siteId, site }) {
  const { getSiteExpenses, addExpense, updateExpense, deleteExpense } = useApp();
  const expenses = getSiteExpenses(siteId);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  const filtered = useMemo(() => {
    return expenses
      .filter(e => filterCategory === 'All' || e.category === filterCategory)
      .filter(e => e.name.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [expenses, search, filterCategory]);

  const categoryData = useMemo(() => {
    const map = {};
    expenses.forEach(e => { map[e.category] = (map[e.category] || 0) + Number(e.amount); });
    return Object.entries(map).map(([name, value]) => ({ name, value, fill: CATEGORY_COLORS[name] || '#999' }));
  }, [expenses]);

  const total = expenses.reduce((s, e) => s + Number(e.amount), 0);

  const handleSubmit = (data) => {
    if (editing) updateExpense(siteId, editing.id, data);
    else addExpense(siteId, data);
    setEditing(null);
  };

  const handleExportCSV = () => {
    exportToCSV(
      `${(site?.name || 'site').replace(/\s+/g, '-')}-expenses.csv`,
      ['Expense Name', 'Category', 'Date', 'Amount'],
      filtered.map((e) => [e.name, e.category, formatDate(e.date), e.amount])
    );
  };

  const handleExportPDF = () => {
    exportExpensesPDF(site, filtered);
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h2>Expense Entry</h2>
          <p>Track materials, transport, and miscellaneous costs</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost" onClick={handleExportCSV} disabled={filtered.length === 0}>
            <FileDown size={16} /> Export CSV
          </button>
          <button className="btn btn-ghost" onClick={handleExportPDF} disabled={filtered.length === 0}>
            <FileText size={16} /> Download PDF
          </button>
          <button className="btn btn-primary" onClick={() => { setEditing(null); setShowForm(true); }}>
            <Plus size={16} /> Add Expense
          </button>
        </div>
      </div>

      <div className="grid-3" style={{ marginBottom: 20, alignItems: 'stretch' }}>
        <div className="card" style={{ gridColumn: 'span 2' }}>
          <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
            <h4 style={{ fontSize: 14, fontWeight: 600 }}>All Expenses</h4>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ position: 'relative' }}>
                <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  className="form-input" placeholder="Search..." value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{ paddingLeft: 30, width: 180 }}
                />
              </div>
              <select className="form-select" value={filterCategory} onChange={e => setFilterCategory(e.target.value)} style={{ width: 140 }}>
                <option>All</option>
                <option>Material</option>
                <option>Transport</option>
                <option>Misc</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="empty-state">
              <Receipt size={36} />
              <h4>No expenses found</h4>
              <p>Add your first expense entry to get started</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Expense Name</th>
                    <th>Category</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(e => (
                    <tr key={e.id}>
                      <td>{e.name}</td>
                      <td>
                        <span className="badge" style={{
                          background: `${CATEGORY_COLORS[e.category]}18`,
                          color: CATEGORY_COLORS[e.category],
                        }}>{e.category}</span>
                      </td>
                      <td>{formatDate(e.date)}</td>
                      <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{formatCurrency(e.amount)}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                          <button className="btn btn-ghost btn-icon btn-sm" onClick={() => { setEditing(e); setShowForm(true); }}>
                            <Pencil size={14} />
                          </button>
                          <button className="btn btn-ghost btn-icon btn-sm" style={{ color: 'var(--red)' }}
                            onClick={() => setDeleteTarget(e)}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
            <span className="text-sm text-muted">{filtered.length} of {expenses.length} expenses</span>
            <span className="text-sm font-semibold">Total: {formatCurrency(total)}</span>
          </div>
        </div>

        <div className="card">
          <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Category Distribution</h4>
          {categoryData.length === 0 ? (
            <div className="empty-state" style={{ padding: '40px 12px' }}>
              <Receipt size={32} />
              <p>No data yet</p>
            </div>
          ) : (
            <div style={{ height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={85} paddingAngle={3}>
                    {categoryData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                  </Pie>
                  <Tooltip formatter={v => formatCurrency(v)} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <ExpenseFormModal
          initial={editing}
          onClose={() => { setShowForm(false); setEditing(null); }}
          onSubmit={handleSubmit}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete this expense?"
          message={`"${deleteTarget.name}" worth ${formatCurrency(deleteTarget.amount)} will be permanently removed.`}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => { deleteExpense(siteId, deleteTarget.id); setDeleteTarget(null); }}
        />
      )}
    </div>
  );
}
