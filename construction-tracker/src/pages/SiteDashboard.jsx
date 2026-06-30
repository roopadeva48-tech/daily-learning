import React, { useState } from 'react';
import { Routes, Route, NavLink, useParams, useNavigate, Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  HardHat, LayoutDashboard, DollarSign, Users, BarChart2,
  ChevronLeft, LogOut, Menu, X, MapPin
} from 'lucide-react';
import OverviewModule from '../modules/overview/OverviewModule';
import ExpensesModule from '../modules/expenses/ExpensesModule';
import LaborModule from '../modules/labor/LaborModule';
import BudgetReportModule from '../modules/budget/BudgetReportModule';
import logo from '../assets/logo-on-navy.png';

const NAV_ITEMS = [
  { to: 'overview', label: 'Overview', icon: LayoutDashboard },
  { to: 'expenses', label: 'Expenses', icon: DollarSign },
  { to: 'labor', label: 'Labor', icon: Users },
  { to: 'budget', label: 'Budget Report', icon: BarChart2 },
];

export default function SiteDashboard() {
  const { siteId } = useParams();
  const { getSite, logout } = useApp();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const site = getSite(siteId);

  if (!site) return <Navigate to="/" replace />;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--surface)' }}>
      {/* Sidebar */}
      <aside className="blueprint-grid" style={{
        width: 'var(--sidebar-width)',
        background: 'var(--gradient-navy)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0, left: 0, bottom: 0,
        zIndex: 100,
        transition: 'transform 0.2s',
        transform: mobileOpen ? 'translateX(0)' : undefined,
        boxShadow: '4px 0 24px rgba(0,0,0,0.15)',
      }}>
        {/* Logo */}
        <div style={{
          padding: '0 20px',
          height: 'var(--header-height)',
          display: 'flex',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}>
          <img
            src={logo}
            alt="BuildTrack"
            style={{ height: 30, width: 'auto', display: 'block', objectFit: 'contain' }}
          />
        </div>

        {/* Site info */}
        <div style={{
          margin: '12px 12px 4px',
          padding: '12px',
          background: 'rgba(255,255,255,0.06)',
          borderRadius: 10,
          border: '1px solid rgba(255,255,255,0.08)',
        }}>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Active Site</div>
          <div style={{ color: '#fff', fontWeight: 600, fontSize: 14 }}>{site.name}</div>
          {site.location && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 3 }}>
              <MapPin size={10} /> {site.location}
            </div>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '8px 12px', overflowY: 'auto' }}>
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.to}
              to={`/site/${siteId}/${item.to}`}
              onClick={() => setMobileOpen(false)}
              className="sidebar-nav-link"
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                borderRadius: 8,
                marginBottom: 2,
                fontSize: 14,
                fontWeight: 500,
                transition: 'all 0.15s',
                textDecoration: 'none',
                color: isActive ? '#fff' : 'rgba(255,255,255,0.5)',
                background: isActive ? 'var(--orange)' : 'transparent',
                borderLeft: isActive ? '3px solid #fff' : '3px solid transparent',
                boxShadow: isActive ? '0 2px 8px rgba(255,140,0,0.3)' : 'none',
              })}
            >
              {({ isActive }) => (
                <>
                  <item.icon size={17} color={isActive ? '#fff' : 'rgba(255,255,255,0.4)'} />
                  {item.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer actions */}
        <div style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <button
            className="btn"
            onClick={() => navigate('/')}
            style={{
              width: '100%', justifyContent: 'center', gap: 8,
              background: 'rgba(255,255,255,0.06)',
              color: 'rgba(255,255,255,0.6)',
              marginBottom: 8, fontSize: 13,
            }}
          >
            <ChevronLeft size={15} /> All Sites
          </button>
          <button
            className="btn"
            onClick={logout}
            style={{
              width: '100%', justifyContent: 'center', gap: 8,
              background: 'rgba(220,38,38,0.1)',
              color: 'rgba(255,100,100,0.8)',
              fontSize: 13,
            }}
          >
            <LogOut size={15} /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 99 }}
        />
      )}

      {/* Main content */}
      <div style={{ flex: 1, marginLeft: 'var(--sidebar-width)', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top bar */}
        <header style={{
          height: 'var(--header-height)',
          background: 'var(--white)',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 28px',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
        }}>
          <button className="btn btn-ghost btn-icon" onClick={() => setMobileOpen(true)} style={{ display: 'none' }}>
            <Menu size={20} />
          </button>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 600 }}>{site.name} Dashboard</h2>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              Budget: <strong style={{ color: 'var(--text-primary)' }}>₹{site.budget.toLocaleString('en-IN')}</strong>
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: '50%',
              background: 'var(--gradient-navy)',
              border: '2px solid var(--orange)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 700, color: '#fff',
            }}>
              A
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: '28px', overflowY: 'auto' }}>
          <Routes>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<OverviewModule siteId={siteId} site={site} />} />
            <Route path="expenses" element={<ExpensesModule siteId={siteId} site={site} />} />
            <Route path="labor" element={<LaborModule siteId={siteId} site={site} />} />
            <Route path="budget" element={<BudgetReportModule siteId={siteId} site={site} />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
