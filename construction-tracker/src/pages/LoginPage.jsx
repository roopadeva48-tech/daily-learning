import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Lock, User, Eye, EyeOff, AlertTriangle,
  HardHat, Users2, LineChart, CloudCog,
} from 'lucide-react';
import AnimatedBlueprintBackground from '../components/AnimatedBlueprintBackground';
import logo from '../assets/logo.png';
import logoOnNavy from '../assets/logo-on-navy.png';

const FEATURES = [
  { icon: HardHat, title: 'Real-time expense tracking', desc: 'Every rupee logged the moment it\u2019s spent' },
  { icon: Users2, title: 'Labour management', desc: 'Attendance-based wage costing, automated' },
  { icon: LineChart, title: 'Live project analytics', desc: 'Budgets vs. actuals, always current' },
  { icon: CloudCog, title: 'Secure cloud dashboard', desc: 'One platform, every site, anywhere' },
];

export default function LoginPage() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [remember, setRemember] = useState(true);
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    const ok = login(form.username, form.password);
    setLoading(false);
    if (ok) navigate('/');
    else setError('Invalid username or password. Please try again.');
  };

  return (
    <div className="bt-login-page">
      <div className="bt-login-grid">

        {/* ============ LEFT — BRANDING (60%) ============ */}
        <div className="bt-brand-panel">
          <AnimatedBlueprintBackground />

          <div className="bt-brand-content">
            <img src={logoOnNavy} alt="BuildTrack" className="bt-brand-logo" />

            <h1 className="bt-headline">
              Build Smarter.<br />Spend Smarter.
            </h1>
            <p className="bt-subhead">
              Track labour, materials, machinery and project expenses in one intelligent platform.
            </p>

            <div className="bt-feature-grid">
              {FEATURES.map((f, i) => (
                <div className="bt-feature-card" key={f.title} style={{ animationDelay: `${0.15 + i * 0.08}s` }}>
                  <div className="bt-feature-icon">
                    <f.icon size={18} strokeWidth={1.75} />
                  </div>
                  <div>
                    <div className="bt-feature-title">{f.title}</div>
                    <div className="bt-feature-desc">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bt-trust">
              <span className="bt-trust-dot" />
              Trusted by Construction Teams
            </div>
          </div>
        </div>

        {/* ============ RIGHT — LOGIN CARD (40%) ============ */}
        <div className="bt-form-panel">
          <div className="bt-login-card">
            <img src={logo} alt="BuildTrack" className="bt-card-logo" />

            <h2 className="bt-welcome">Welcome Back</h2>
            <p className="bt-welcome-sub">Sign in to continue to your dashboard.</p>

            {error && (
              <div className="bt-error" role="alert">
                <AlertTriangle size={15} />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="bt-form" noValidate>
              <div className="bt-field">
                <label className="bt-label" htmlFor="bt-username">Username</label>
                <div className="bt-input-wrap">
                  <User size={17} className="bt-input-icon" aria-hidden="true" />
                  <input
                    id="bt-username"
                    type="text"
                    className="bt-input"
                    placeholder="Enter your username"
                    value={form.username}
                    onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                    autoComplete="off"
                    name="buildtrack-username"
                    required
                  />
                </div>
              </div>

              <div className="bt-field">
                <div className="bt-label-row">
                  <label className="bt-label" htmlFor="bt-password">Password</label>
                </div>
                <div className="bt-input-wrap">
                  <Lock size={17} className="bt-input-icon" aria-hidden="true" />
                  <input
                    id="bt-password"
                    type={showPw ? 'text' : 'password'}
                    className="bt-input"
                    style={{ paddingRight: 44 }}
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    autoComplete="new-password"
                    name="buildtrack-password"
                    required
                  />
                  <button
                    type="button"
                    className="bt-pw-toggle"
                    onClick={() => setShowPw(s => !s)}
                    aria-label={showPw ? 'Hide password' : 'Show password'}
                  >
                    {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              <div className="bt-row-between">
                <label className="bt-checkbox">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={e => setRemember(e.target.checked)}
                  />
                  <span>Remember Me</span>
                </label>
                <Link to="#" onClick={e => e.preventDefault()} className="bt-link">
                  Forgot Password?
                </Link>
              </div>

              <button type="submit" className="bt-submit" disabled={loading}>
                <span className="bt-submit-content">
                  {loading ? (
                    <>
                      <span className="bt-spinner" />
                      Signing in…
                    </>
                  ) : 'Login'}
                </span>
              </button>
            </form>

            <div className="bt-divider">
              <span>OR</span>
            </div>

            <p className="bt-access-note">
              Need access? Contact your administrator to create an account.
            </p>
          </div>

          <div className="bt-footer">
            <div>© 2026 BuildTrack</div>
            <div>Construction Expense Management Platform</div>
            <div className="bt-version">Version 1.0</div>
          </div>
        </div>
      </div>

      <style>{`
        .bt-login-page {
          min-height: 100vh;
          width: 100%;
          background: #F8FAFC;
          font-family: 'Inter', sans-serif;
        }
        .bt-login-grid {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 60% 40%;
        }

        /* ===== LEFT PANEL ===== */
        .bt-brand-panel {
          position: relative;
          overflow: hidden;
          background: linear-gradient(155deg, #0F2747 0%, #122d52 45%, #0c2240 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 64px 72px;
        }
        .bt-brand-content {
          position: relative;
          z-index: 1;
          max-width: 560px;
          width: 100%;
          animation: bt-fade-slide-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .bt-brand-logo {
          height: 38px;
          width: auto;
          display: block;
          margin-bottom: 44px;
          animation: bt-logo-fade 0.9s ease-out both;
        }
        .bt-headline {
          font-family: 'Manrope', 'Inter', sans-serif;
          font-weight: 800;
          font-size: 42px;
          line-height: 1.15;
          letter-spacing: -0.025em;
          color: #ffffff;
          margin-bottom: 18px;
        }
        .bt-subhead {
          font-size: 16px;
          line-height: 1.6;
          color: rgba(226,232,240,0.68);
          max-width: 420px;
          margin-bottom: 40px;
          font-weight: 400;
        }
        .bt-feature-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          margin-bottom: 40px;
        }
        .bt-feature-card {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 16px;
          border-radius: 14px;
          background: rgba(255,255,255,0.045);
          border: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(6px);
          transition: background 0.25s ease, border-color 0.25s ease, transform 0.25s ease;
          animation: bt-fade-slide-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .bt-feature-card:hover {
          background: rgba(255,255,255,0.075);
          border-color: rgba(249,115,22,0.3);
          transform: translateY(-2px);
        }
        .bt-feature-icon {
          width: 34px; height: 34px;
          border-radius: 9px;
          flex-shrink: 0;
          background: rgba(249,115,22,0.16);
          color: #FDBA74;
          display: flex; align-items: center; justify-content: center;
        }
        .bt-feature-title {
          font-size: 13.5px;
          font-weight: 600;
          color: #fff;
          line-height: 1.35;
          margin-bottom: 3px;
        }
        .bt-feature-desc {
          font-size: 12px;
          color: rgba(226,232,240,0.5);
          line-height: 1.45;
        }
        .bt-trust {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 12.5px;
          font-weight: 500;
          letter-spacing: 0.03em;
          color: rgba(226,232,240,0.55);
          text-transform: uppercase;
        }
        .bt-trust-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 0 3px rgba(34,197,94,0.18);
        }

        /* ===== RIGHT PANEL ===== */
        .bt-form-panel {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 48px 40px;
          background: #F8FAFC;
        }
        .bt-login-card {
          width: 100%;
          max-width: 408px;
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(14px) saturate(160%);
          border: 1px solid rgba(255,255,255,0.6);
          border-radius: 24px;
          padding: 44px 38px 32px;
          box-shadow:
            0 1px 2px rgba(15,39,71,0.04),
            0 20px 48px rgba(15,39,71,0.10),
            0 8px 20px rgba(15,39,71,0.06);
          animation: bt-card-rise 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
          animation-delay: 0.1s;
        }
        .bt-card-logo {
          height: 32px;
          width: auto;
          display: block;
          margin: 0 auto 28px;
        }
        .bt-welcome {
          font-family: 'Manrope', 'Inter', sans-serif;
          font-size: 26px;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: #111827;
          text-align: center;
          margin-bottom: 6px;
        }
        .bt-welcome-sub {
          font-size: 14px;
          color: #6B7280;
          text-align: center;
          margin-bottom: 30px;
        }
        .bt-error {
          display: flex; align-items: center; gap: 8px;
          padding: 11px 14px;
          background: #FEF2F2;
          border: 1px solid #FECACA;
          border-radius: 12px;
          margin-bottom: 20px;
          font-size: 13px;
          color: #DC2626;
          animation: bt-shake 0.4s ease;
        }
        .bt-form { display: flex; flex-direction: column; gap: 18px; }
        .bt-field { display: flex; flex-direction: column; gap: 7px; }
        .bt-label-row { display: flex; justify-content: space-between; align-items: baseline; }
        .bt-label {
          font-size: 13px;
          font-weight: 600;
          color: #374151;
          letter-spacing: 0.01em;
        }
        .bt-input-wrap { position: relative; display: flex; align-items: center; }
        .bt-input-icon {
          position: absolute;
          left: 18px;
          color: #9CA3AF;
          pointer-events: none;
          transition: color 0.2s ease;
        }
        .bt-input {
          width: 100%;
          height: 56px;
          padding: 0 18px 0 48px;
          border: 1.5px solid #E5E7EB;
          border-radius: 14px;
          font-size: 15px;
          font-family: 'Inter', sans-serif;
          color: #111827;
          background: #ffffff;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .bt-input::placeholder { color: #9CA3AF; }
        .bt-input:hover { border-color: #D1D5DB; }
        .bt-input:focus {
          outline: none;
          border-color: #3872B8;
          box-shadow: 0 0 0 4px rgba(56,114,184,0.14);
        }
        .bt-input:focus ~ .bt-input-icon,
        .bt-input-wrap:focus-within .bt-input-icon { color: #3872B8; }
        .bt-pw-toggle {
          position: absolute;
          right: 16px;
          background: none;
          border: none;
          cursor: pointer;
          color: #9CA3AF;
          padding: 4px;
          display: flex;
          align-items: center;
          border-radius: 6px;
          transition: color 0.18s ease, background 0.18s ease;
        }
        .bt-pw-toggle:hover { color: #374151; background: #F3F4F6; }

        .bt-row-between {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: -4px;
        }
        .bt-checkbox {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          cursor: pointer;
          user-select: none;
          font-size: 13.5px;
          font-weight: 500;
          color: #374151;
        }
        .bt-checkbox input[type="checkbox"] {
          appearance: none;
          width: 18px; height: 18px;
          border: 1.5px solid #D1D5DB;
          border-radius: 6px;
          background: #fff;
          cursor: pointer;
          position: relative;
          transition: all 0.18s ease;
          flex-shrink: 0;
        }
        .bt-checkbox input[type="checkbox"]:hover { border-color: #F97316; }
        .bt-checkbox input[type="checkbox"]:checked {
          background: linear-gradient(135deg, #F97316, #FB923C);
          border-color: #F97316;
        }
        .bt-checkbox input[type="checkbox"]:checked::after {
          content: '';
          position: absolute;
          left: 5.5px; top: 1.5px;
          width: 4px; height: 9px;
          border: solid #fff;
          border-width: 0 2px 2px 0;
          transform: rotate(45deg);
        }
        .bt-checkbox input[type="checkbox"]:focus-visible {
          box-shadow: 0 0 0 3px rgba(249,115,22,0.22);
        }
        .bt-link {
          font-size: 13.5px;
          font-weight: 600;
          color: #F97316;
          transition: color 0.18s ease;
        }
        .bt-link:hover { color: #EA580C; }

        .bt-submit {
          position: relative;
          width: 100%;
          height: 56px;
          margin-top: 6px;
          border-radius: 14px;
          border: none;
          cursor: pointer;
          background: linear-gradient(135deg, #F97316 0%, #FB923C 100%);
          color: #fff;
          font-size: 15.5px;
          font-weight: 700;
          letter-spacing: 0.01em;
          overflow: hidden;
          box-shadow: 0 8px 20px rgba(249,115,22,0.30), 0 2px 6px rgba(249,115,22,0.2);
          transition: transform 0.22s cubic-bezier(0.16,1,0.3,1), box-shadow 0.22s ease, filter 0.22s ease;
        }
        .bt-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 14px 32px rgba(249,115,22,0.40), 0 4px 10px rgba(249,115,22,0.25);
          filter: brightness(1.04);
        }
        .bt-submit:active:not(:disabled) { transform: translateY(0); }
        .bt-submit:disabled { opacity: 0.75; cursor: not-allowed; }
        .bt-submit:focus-visible { outline: 2px solid #0F2747; outline-offset: 3px; }
        .bt-submit-content {
          position: relative;
          z-index: 1;
          display: inline-flex;
          align-items: center;
          gap: 10px;
        }
        .bt-submit::after {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle, rgba(255,255,255,0.35) 0%, transparent 60%);
          opacity: 0;
          transform: scale(0.4);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        .bt-submit:active::after {
          opacity: 1;
          transform: scale(1.6);
          transition: 0s;
        }
        .bt-spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: #fff;
          border-radius: 50%;
          animation: bt-spin 0.7s linear infinite;
          display: inline-block;
        }

        .bt-divider {
          display: flex;
          align-items: center;
          gap: 14px;
          margin: 26px 0 18px;
          color: #9CA3AF;
          font-size: 11.5px;
          font-weight: 600;
          letter-spacing: 0.1em;
        }
        .bt-divider::before, .bt-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #E5E7EB;
        }

        .bt-access-note {
          text-align: center;
          font-size: 13px;
          color: #6B7280;
          line-height: 1.6;
          max-width: 300px;
          margin: 0 auto;
        }

        .bt-footer {
          margin-top: 28px;
          text-align: center;
          font-size: 11.5px;
          line-height: 1.8;
          color: #9CA3AF;
        }
        .bt-version { color: #C2C8D2; }

        @keyframes bt-fade-slide-up {
          0% { opacity: 0; transform: translateY(18px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes bt-card-rise {
          0% { opacity: 0; transform: translateY(28px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes bt-logo-fade {
          0% { opacity: 0; transform: translateY(-6px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes bt-spin { to { transform: rotate(360deg); } }
        @keyframes bt-shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }

        @media (prefers-reduced-motion: reduce) {
          .bt-brand-content, .bt-feature-card, .bt-login-card, .bt-brand-logo, .bt-submit, .bt-error {
            animation: none !important;
          }
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 1024px) {
          .bt-login-grid { grid-template-columns: 54% 46%; }
          .bt-headline { font-size: 34px; }
          .bt-brand-panel { padding: 52px 48px; }
          .bt-feature-grid { gap: 12px; }
        }
        @media (max-width: 860px) {
          .bt-login-grid { grid-template-columns: 1fr; }
          .bt-brand-panel { padding: 56px 40px 64px; }
          .bt-feature-grid { grid-template-columns: 1fr 1fr; }
          .bt-form-panel { padding: 48px 24px 40px; }
        }
        @media (max-width: 560px) {
          .bt-brand-panel { padding: 44px 24px 48px; }
          .bt-headline { font-size: 28px; }
          .bt-subhead { font-size: 14.5px; margin-bottom: 28px; }
          .bt-feature-grid { grid-template-columns: 1fr; gap: 10px; margin-bottom: 28px; }
          .bt-login-card { padding: 36px 22px 26px; border-radius: 20px; }
          .bt-welcome { font-size: 22px; }
          .bt-input { height: 52px; }
          .bt-submit { height: 52px; }
        }
      `}</style>
    </div>
  );
}
