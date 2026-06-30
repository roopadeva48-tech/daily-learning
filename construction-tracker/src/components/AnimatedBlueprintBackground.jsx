import React from 'react';

export default function AnimatedBlueprintBackground() {
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {/* Animated blueprint grid */}
      <div className="bp-grid-anim" />

      {/* Soft floating glow orbs */}
      <div className="bt-glow bt-glow-1" />
      <div className="bt-glow bt-glow-2" />
      <div className="bt-glow bt-glow-3" />

      {/* Floating geometric shapes */}
      <svg className="bt-float bt-float-1" width="64" height="64" viewBox="0 0 64 64" fill="none">
        <rect x="4" y="4" width="56" height="56" rx="12" stroke="rgba(249,115,22,0.22)" strokeWidth="1.5" />
      </svg>
      <svg className="bt-float bt-float-2" width="40" height="40" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="18" stroke="rgba(255,255,255,0.14)" strokeWidth="1.5" />
      </svg>
      <svg className="bt-float bt-float-3" width="50" height="50" viewBox="0 0 50 50" fill="none">
        <rect x="25" y="2" width="32" height="32" rx="6" transform="rotate(20 25 2)" stroke="rgba(249,115,22,0.16)" strokeWidth="1.5" />
      </svg>
      <svg className="bt-float bt-float-4" width="30" height="30" viewBox="0 0 30 30" fill="none">
        <circle cx="15" cy="15" r="13" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
      </svg>

      <style>{`
        .bp-grid-anim {
          position: absolute;
          inset: -60px;
          background-image:
            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px);
          background-size: 64px 64px;
          animation: bp-drift 38s linear infinite;
        }
        @keyframes bp-drift {
          0% { transform: translate(0, 0); }
          100% { transform: translate(64px, 64px); }
        }
        .bt-glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          opacity: 0.55;
        }
        .bt-glow-1 {
          width: 360px; height: 360px;
          top: -120px; right: -100px;
          background: radial-gradient(circle, rgba(249,115,22,0.30), transparent 70%);
          animation: bt-float-slow 16s ease-in-out infinite;
        }
        .bt-glow-2 {
          width: 300px; height: 300px;
          bottom: -80px; left: -80px;
          background: radial-gradient(circle, rgba(56,114,184,0.25), transparent 70%);
          animation: bt-float-slow 20s ease-in-out infinite reverse;
        }
        .bt-glow-3 {
          width: 220px; height: 220px;
          top: 40%; left: 30%;
          background: radial-gradient(circle, rgba(249,115,22,0.14), transparent 70%);
          animation: bt-float-slow 24s ease-in-out infinite;
        }
        @keyframes bt-float-slow {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(18px, -22px) scale(1.06); }
        }
        .bt-float {
          position: absolute;
          animation: bt-spin-drift 30s ease-in-out infinite;
        }
        .bt-float-1 { top: 14%; right: 16%; animation-duration: 26s; }
        .bt-float-2 { bottom: 22%; right: 28%; animation-duration: 22s; animation-delay: -4s; }
        .bt-float-3 { top: 56%; left: 10%; animation-duration: 32s; animation-delay: -10s; }
        .bt-float-4 { top: 30%; left: 22%; animation-duration: 19s; animation-delay: -6s; }
        @keyframes bt-spin-drift {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(10px, -14px) rotate(8deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .bp-grid-anim, .bt-glow, .bt-float { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
