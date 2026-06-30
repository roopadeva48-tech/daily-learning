import React, { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line,
} from 'recharts';
import { useApp } from '../../context/AppContext';
import StatCard from '../../components/ui/StatCard';
import { formatCurrency, CATEGORY_COLORS, getMonthKey } from '../../utils/format';
import { Wallet, TrendingDown, PiggyBank, Users, FileBarChart } from 'lucide-react';

function ChartCard({ title, subtitle, children, height = 300 }) {
  return (
    <div className="card">
      <div style={{ marginBottom: 18, paddingLeft: 12, borderLeft: '3px solid var(--orange)' }}>
        <h4 style={{ fontSize: 14, fontWeight: 600 }}>{title}</h4>
        {subtitle && <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{subtitle}</p>}
      </div>
      <div style={{ height }}>{children}</div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#fff', border: '1px solid var(--border)', borderRadius: 8,
      padding: '10px 14px', boxShadow: 'var(--shadow)', fontSize: 12,
    }}>
      <div style={{ fontWeight: 600, marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, display: 'flex', justifyContent: 'space-between', gap: 16 }}>
          <span>{p.name}</span>
          <strong>{formatCurrency(p.value)}</strong>
        </div>
      ))}
    </div>
  );
};

export default function OverviewModule({ siteId, site }) {
  const { getSiteExpenses, getSiteWorkers, getTotalLaborCost, getTotalExpenses } = useApp();
  const expenses = getSiteExpenses(siteId);
  const workers = getSiteWorkers(siteId);
  const materialExpenses = getTotalExpenses(siteId);
  const laborCost = getTotalLaborCost(siteId);
  const totalSpent = materialExpenses + laborCost;
  const remaining = site.budget - totalSpent;

  const budgetVsExpenseData = useMemo(() => ([
    { name: 'Budget', value: site.budget, fill: 'var(--navy)' },
    { name: 'Expenses', value: totalSpent, fill: 'var(--orange)' },
  ]), [site.budget, totalSpent]);

  const categoryData = useMemo(() => {
    const map = {};
    expenses.forEach(e => { map[e.category] = (map[e.category] || 0) + Number(e.amount); });
    if (laborCost > 0) map['Labor'] = laborCost;
    return Object.entries(map).map(([name, value]) => ({ name, value, fill: CATEGORY_COLORS[name] || '#999' }));
  }, [expenses, laborCost]);

  const trendData = useMemo(() => {
    const map = {};
    expenses.forEach(e => {
      const key = getMonthKey(e.date);
      map[key] = (map[key] || 0) + Number(e.amount);
    });
    const entries = Object.entries(map).map(([month, amount]) => ({ month, amount }));
    if (entries.length === 0) return [{ month: 'No Data', amount: 0 }];
    return entries;
  }, [expenses]);

  return (
    <div>
      <div className="page-header">
        <h2>Overview Dashboard</h2>
        <p>Real-time financial snapshot for {site.name}</p>
      </div>

      {/* Summary cards */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        <StatCard icon={Wallet} label="Total Budget" value={formatCurrency(site.budget)} color="#0B1F3B" />
        <StatCard icon={TrendingDown} label="Total Expenses" value={formatCurrency(totalSpent)} color="#FF8C00"
          sublabel={`${expenses.length} entries`} />
        <StatCard icon={PiggyBank} label="Remaining Budget" value={formatCurrency(remaining)}
          color={remaining < 0 ? '#dc2626' : '#16a34a'}
          trend={{ value: `${((totalSpent / site.budget) * 100).toFixed(1)}% used`, positive: remaining >= 0 }} />
        <StatCard icon={Users} label="Total Labor Cost" value={formatCurrency(laborCost)} color="#7C3AED"
          sublabel={`${workers.length} workers`} />
      </div>

      {/* Charts row 1 */}
      <div className="grid-2" style={{ marginBottom: 20 }}>
        <ChartCard title="Budget vs Expenses" subtitle="Planned budget compared to actual spend">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={budgetVsExpenseData} barSize={64}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={{ stroke: 'var(--border)' }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false}
                tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--surface)' }} />
              <Bar dataKey="value" name="Amount" radius={[8, 8, 0, 0]}>
                {budgetVsExpenseData.map((d, i) => <Cell key={i} fill={d.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Expense Breakdown" subtitle="Distribution by category">
          {categoryData.length === 0 ? (
            <div className="empty-state" style={{ height: '100%' }}>
              <FileBarChart size={36} />
              <h4>No expense data yet</h4>
              <p>Add expenses to see the breakdown</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%"
                  innerRadius={60} outerRadius={95} paddingAngle={3}>
                  {categoryData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>

      {/* Trend chart */}
      <ChartCard title="Expense Trend" subtitle="Monthly spending pattern over time" height={280}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={{ stroke: 'var(--border)' }} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false}
              tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="amount" name="Expenses" stroke="var(--orange)" strokeWidth={3}
              dot={{ r: 4, fill: 'var(--orange)' }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
