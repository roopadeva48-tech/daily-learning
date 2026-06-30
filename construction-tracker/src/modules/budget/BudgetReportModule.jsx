import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { useApp } from '../../context/AppContext';
import { formatCurrency, CATEGORY_COLORS } from '../../utils/format';
import { exportBudgetReportPDF, exportBudgetReportCSV } from '../../utils/exportUtils';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, FileDown, FileText } from 'lucide-react';

function CircularProgress({ pct, isOver }) {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(pct, 100);
  const offset = circumference - (clamped / 100) * circumference;
  const color = isOver ? 'var(--red)' : pct > 80 ? 'var(--orange)' : 'var(--green)';

  return (
    <svg width={170} height={170} viewBox="0 0 170 170">
      <circle cx="85" cy="85" r={radius} fill="none" stroke="var(--surface-2)" strokeWidth="14" />
      <circle
        cx="85" cy="85" r={radius} fill="none" stroke={color} strokeWidth="14"
        strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
        transform="rotate(-90 85 85)"
        style={{ transition: 'stroke-dashoffset 0.6s ease' }}
      />
      <text x="85" y="80" textAnchor="middle" fontSize="26" fontWeight="700" fontFamily="Space Grotesk" fill="var(--text-primary)">
        {pct.toFixed(0)}%
      </text>
      <text x="85" y="100" textAnchor="middle" fontSize="11" fill="var(--text-muted)">
        of budget used
      </text>
    </svg>
  );
}

export default function BudgetReportModule({ siteId, site }) {
  const { getSiteExpenses, getTotalLaborCost, getTotalExpenses } = useApp();
  const expenses = getSiteExpenses(siteId);
  const materialCost = getTotalExpenses(siteId);
  const laborCost = getTotalLaborCost(siteId);
  const totalActual = materialCost + laborCost;
  const difference = site.budget - totalActual;
  const isOver = difference < 0;
  const pct = (totalActual / site.budget) * 100;

  const categoryBreakdown = useMemo(() => {
    const map = {};
    expenses.forEach(e => { map[e.category] = (map[e.category] || 0) + Number(e.amount); });
    if (laborCost > 0) map['Labor'] = laborCost;
    return Object.entries(map).map(([name, value]) => ({ name, value, fill: CATEGORY_COLORS[name] || '#999' }));
  }, [expenses, laborCost]);

  const comparisonData = [
    { name: 'Planned Budget', value: site.budget, fill: 'var(--navy)' },
    { name: 'Actual Spend', value: totalActual, fill: isOver ? 'var(--red)' : 'var(--orange)' },
  ];

  const reportData = { site, materialCost, laborCost, totalActual, difference, isOver, categoryBreakdown };

  const handleExportPDF = () => exportBudgetReportPDF(reportData);
  const handleExportCSV = () => exportBudgetReportCSV(site, reportData);

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h2>Budget vs Actual Report</h2>
          <p>Compare planned budget against real spending for {site.name}</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost" onClick={handleExportCSV}>
            <FileDown size={16} /> Export CSV
          </button>
          <button className="btn btn-primary" onClick={handleExportPDF}>
            <FileText size={16} /> Download PDF
          </button>
        </div>
      </div>

      {/* Status banner */}
      <div className="card" style={{
        marginBottom: 20,
        display: 'flex', alignItems: 'center', gap: 16,
        background: isOver ? 'var(--red-light)' : 'var(--green-light)',
        border: `1px solid ${isOver ? 'var(--red)' : 'var(--green)'}33`,
      }}>
        {isOver ? <AlertTriangle size={26} color="var(--red)" /> : <CheckCircle2 size={26} color="var(--green)" />}
        <div>
          <h4 style={{ fontSize: 15, color: isOver ? 'var(--red)' : 'var(--green)' }}>
            {isOver ? 'Over Budget' : 'Within Budget'}
          </h4>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            {isOver
              ? `Spending has exceeded the planned budget by ${formatCurrency(Math.abs(difference))}.`
              : `${formatCurrency(difference)} remaining out of the total planned budget.`}
          </p>
        </div>
      </div>

      <div className="grid-3" style={{ marginBottom: 20 }}>
        {/* Progress circle */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
          <CircularProgress pct={pct} isOver={isOver} />
          <div style={{ display: 'flex', gap: 20, fontSize: 12 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--navy)', margin: '0 auto 4px' }} />
              Budget
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: isOver ? 'var(--red)' : 'var(--orange)', margin: '0 auto 4px' }} />
              Actual
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="card" style={{ gridColumn: 'span 2' }}>
          <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 18 }}>Financial Summary</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
            {[
              { label: 'Planned Budget', value: formatCurrency(site.budget), icon: null },
              { label: 'Actual Spending', value: formatCurrency(totalActual), icon: null },
              { label: 'Material + Misc Costs', value: formatCurrency(materialCost) },
              { label: 'Labor Costs', value: formatCurrency(laborCost) },
            ].map(s => (
              <div key={s.label} style={{ padding: '14px 16px', background: 'var(--surface)', borderRadius: 10 }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontSize: 18, fontWeight: 700, fontFamily: 'Space Grotesk' }}>{s.value}</div>
              </div>
            ))}
          </div>
          <div style={{
            marginTop: 14, padding: '14px 16px', borderRadius: 10,
            background: isOver ? 'var(--red-light)' : 'var(--green-light)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: isOver ? 'var(--red)' : 'var(--green)' }}>
              {isOver ? 'Over Budget By' : 'Under Budget By'}
            </span>
            <span style={{ fontSize: 20, fontWeight: 700, fontFamily: 'Space Grotesk', color: isOver ? 'var(--red)' : 'var(--green)', display: 'flex', alignItems: 'center', gap: 6 }}>
              {isOver ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
              {formatCurrency(Math.abs(difference))}
            </span>
          </div>
        </div>
      </div>

      {/* Comparison chart */}
      <div className="grid-2">
        <div className="card">
          <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Budget vs Actual Comparison</h4>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>Direct comparison of planned vs spent amounts</p>
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} barSize={80}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={{ stroke: 'var(--border)' }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false}
                  tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={(v) => formatCurrency(v)} cursor={{ fill: 'var(--surface)' }} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {comparisonData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                  <LabelList dataKey="value" position="top" formatter={(v) => formatCurrency(v)} style={{ fontSize: 11, fontWeight: 600, fill: 'var(--text-secondary)' }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Category-wise Spend</h4>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>Where the actual budget is going</p>
          {categoryBreakdown.length === 0 ? (
            <div className="empty-state" style={{ height: 240 }}>
              <TrendingUp size={32} />
              <p>No spending data yet</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {categoryBreakdown.sort((a,b)=>b.value-a.value).map(c => {
                const cPct = (c.value / totalActual) * 100;
                return (
                  <div key={c.name}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                      <span style={{ fontWeight: 500 }}>{c.name}</span>
                      <span style={{ color: 'var(--text-muted)' }}>{formatCurrency(c.value)} ({cPct.toFixed(0)}%)</span>
                    </div>
                    <div style={{ height: 8, background: 'var(--surface-2)', borderRadius: 10, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${cPct}%`, background: c.fill, borderRadius: 10, transition: 'width 0.4s ease' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
