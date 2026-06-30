import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { HardHat, Plus, MapPin, Calendar, DollarSign, Trash2, LogOut, Building, TrendingUp, X } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/format';
import logo from '../assets/logo-on-navy.png';

function CreateSiteModal({ onClose, onCreate }) {
  const [form, setForm] = useState({ name: '', location: '', budget: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.budget) return;
    onCreate({ ...form, budget: Number(form.budget) });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h3>Create New Site</h3>
          <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Site Name *</label>
              <input type="text" className="form-input" placeholder="e.g. Site D" value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label className="form-label">Location</label>
              <input type="text" className="form-input" placeholder="e.g. West Corridor" value={form.location}
                onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Total Budget (₹) *</label>
              <input type="number" className="form-input" placeholder="500000" value={form.budget}
                onChange={e => setForm(f => ({ ...f, budget: e.target.value }))} required min="0" />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              <Plus size={15} /> Create Site
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function SitesPage() {
  const { sites, createSite, deleteSite, logout, getTotalExpenses, getTotalLaborCost } = useApp();
  const navigate = useNavigate();
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#fff',
      position: 'relative',
    }}>
      {/* Header — navy navbar */}
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 32px', height: 64,
        background: 'var(--gradient-navy)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src={logo}
            alt="BuildTrack"
            style={{ height: 34, width: 'auto', display: 'block', objectFit: 'contain' }}
          />
        </div>
        <button className="btn btn-secondary btn-sm" onClick={logout}
          style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)' }}>
          <LogOut size={14} /> Logout
        </button>
      </header>

      <main style={{ padding: '40px 32px', maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Title */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 32 }}>
          <div>
            <h1 style={{ color: 'var(--text-primary)', fontSize: 28, marginBottom: 6 }}>Construction Sites</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
              {sites.length} site{sites.length !== 1 ? 's' : ''} under management
            </p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
            <Plus size={16} /> Create New Site
          </button>
        </div>

        {/* Stats summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
          {[
            { label: 'Total Sites', value: sites.length, icon: Building, color: 'var(--orange)' },
            {
              label: 'Total Budget',
              value: formatCurrency(sites.reduce((s, site) => s + site.budget, 0)),
              icon: DollarSign, color: 'var(--green)'
            },
            {
              label: 'Total Expenses',
              value: formatCurrency(sites.reduce((s, site) => s + getTotalExpenses(site.id) + getTotalLaborCost(site.id), 0)),
              icon: TrendingUp, color: 'var(--red)'
            },
          ].map(stat => (
            <div key={stat.label} className="card" style={{
              padding: '20px 24px',
              display: 'flex', alignItems: 'center', gap: 16,
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10,
                background: `${stat.color}18`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <stat.icon size={20} color={stat.color} />
              </div>
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: 12, marginBottom: 2 }}>{stat.label}</div>
                <div style={{ color: 'var(--text-primary)', fontFamily: 'Space Grotesk', fontSize: 20, fontWeight: 700 }}>{stat.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Sites grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
          {sites.map(site => {
            const totalExp = getTotalExpenses(site.id) + getTotalLaborCost(site.id);
            const remaining = site.budget - totalExp;
            const pct = Math.min((totalExp / site.budget) * 100, 100);
            const isOver = totalExp > site.budget;

            return (
              <div
                key={site.id}
                onClick={() => navigate(`/site/${site.id}/overview`)}
                style={{
                  background: '#fff',
                  borderRadius: 16, padding: '24px',
                  paddingTop: 28,
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  border: '1px solid var(--border)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 20px 48px rgba(0,0,0,0.3)';
                  e.currentTarget.style.borderColor = `${site.color}55`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)';
                  e.currentTarget.style.borderColor = 'transparent';
                }}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: site.color }} />
                {/* Site header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 10,
                      background: `${site.color}22`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <HardHat size={20} color={site.color} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: 16, marginBottom: 2 }}>{site.name}</h3>
                      {site.location && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-muted)' }}>
                          <MapPin size={11} /> {site.location}
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    className="btn btn-ghost btn-icon btn-sm"
                    onClick={e => { e.stopPropagation(); deleteSite(site.id); }}
                    style={{ color: 'var(--red)', opacity: 0.6 }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '0.6'}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                {/* Budget progress */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Budget Used</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: isOver ? 'var(--red)' : 'var(--green)' }}>
                      {pct.toFixed(1)}%
                    </span>
                  </div>
                  <div style={{ height: 6, background: 'var(--surface-2)', borderRadius: 10, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${pct}%`,
                      background: isOver ? 'var(--red)' : pct > 75 ? 'var(--orange)' : 'var(--green)',
                      borderRadius: 10,
                      transition: 'width 0.4s ease',
                    }} />
                  </div>
                </div>

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {[
                    { label: 'Total Budget', value: formatCurrency(site.budget) },
                    { label: 'Spent', value: formatCurrency(totalExp), color: isOver ? 'var(--red)' : 'var(--text-primary)' },
                    { label: 'Remaining', value: formatCurrency(remaining), color: remaining < 0 ? 'var(--red)' : 'var(--green)' },
                    { label: 'Created', value: formatDate(site.createdAt) },
                  ].map(s => (
                    <div key={s.label} style={{
                      padding: '10px 12px', background: 'var(--surface)', borderRadius: 8,
                    }}>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>{s.label}</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: s.color || 'var(--text-primary)' }}>{s.value}</div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-muted)' }}>
                    <Calendar size={11} /> {formatDate(site.createdAt)}
                  </div>
                  <span style={{ fontSize: 12, color: 'var(--orange)', fontWeight: 600 }}>Open Dashboard →</span>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {showCreate && <CreateSiteModal onClose={() => setShowCreate(false)} onCreate={createSite} />}
    </div>
  );
}
