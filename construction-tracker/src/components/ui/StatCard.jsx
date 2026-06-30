import React from 'react';

export default function StatCard({ icon: Icon, label, value, sublabel, color = 'var(--orange)', trend }) {
  return (
    <div
      className="card"
      style={{ display: 'flex', flexDirection: 'column', gap: 14, cursor: 'default' }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.1)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{
          width: 42, height: 42, borderRadius: 11,
          background: `linear-gradient(135deg, ${color}22, ${color}10)`,
          border: `1px solid ${color}25`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={19} color={color} />
        </div>
        {trend && (
          <span className={`badge ${trend.positive ? 'badge-green' : 'badge-red'}`}>
            {trend.value}
          </span>
        )}
      </div>
      <div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>{label}</div>
        <div style={{ fontSize: 25, fontFamily: 'Space Grotesk', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
          {value}
        </div>
        {sublabel && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{sublabel}</div>}
      </div>
    </div>
  );
}
