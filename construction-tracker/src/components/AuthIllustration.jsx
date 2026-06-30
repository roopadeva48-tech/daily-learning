import React from 'react';

export default function AuthIllustration({ className }) {
  return (
    <svg
      viewBox="0 0 420 380"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: '100%', height: 'auto', display: 'block' }}
    >
      {/* Ground line */}
      <line x1="20" y1="320" x2="400" y2="320" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />

      {/* Background buildings (silhouettes) */}
      <rect x="40" y="220" width="46" height="100" rx="3" fill="rgba(255,255,255,0.05)" />
      <rect x="96" y="180" width="40" height="140" rx="3" fill="rgba(255,255,255,0.06)" />
      <rect x="320" y="200" width="52" height="120" rx="3" fill="rgba(255,255,255,0.05)" />

      {/* Window grids on background buildings */}
      {[0, 1, 2, 3].map(row => (
        <g key={`bg1-${row}`}>
          {[0, 1].map(col => (
            <rect
              key={col}
              x={48 + col * 18}
              y={232 + row * 20}
              width="10"
              height="12"
              rx="1.5"
              fill="rgba(255,140,0,0.18)"
            />
          ))}
        </g>
      ))}

      {/* Main building under construction — scaffold style */}
      <rect x="160" y="120" width="100" height="200" rx="4" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />

      {/* Floors with windows */}
      {[0, 1, 2, 3, 4].map(row => (
        <g key={`main-${row}`}>
          <line x1="160" y1={140 + row * 36} x2="260" y2={140 + row * 36} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          {[0, 1, 2].map(col => (
            <rect
              key={col}
              x={172 + col * 28}
              y={148 + row * 36}
              width="16"
              height="20"
              rx="2"
              fill={row < 2 ? 'rgba(255,140,0,0.35)' : 'rgba(255,255,255,0.08)'}
            />
          ))}
        </g>
      ))}

      {/* Crane mast */}
      <line x1="210" y1="120" x2="210" y2="40" stroke="var(--orange, #FF8C00)" strokeWidth="3" strokeLinecap="round" />
      {/* Crane jib */}
      <line x1="210" y1="48" x2="320" y2="48" stroke="var(--orange, #FF8C00)" strokeWidth="3" strokeLinecap="round" />
      <line x1="210" y1="48" x2="160" y2="48" stroke="var(--orange, #FF8C00)" strokeWidth="3" strokeLinecap="round" />
      {/* Crane counter cable */}
      <line x1="180" y1="48" x2="180" y2="64" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
      <rect x="170" y="64" width="20" height="14" rx="2" fill="rgba(255,255,255,0.18)" />
      {/* Crane support cables */}
      <line x1="210" y1="58" x2="250" y2="48" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
      <line x1="210" y1="58" x2="180" y2="48" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
      {/* Crane hook cable + load */}
      <line x1="290" y1="48" x2="290" y2="110" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
      <rect x="276" y="110" width="28" height="20" rx="3" fill="var(--orange, #FF8C00)" opacity="0.85" />

      {/* Crane base */}
      <rect x="200" y="316" width="20" height="10" rx="2" fill="rgba(255,255,255,0.15)" />

      {/* Foreground small building with foundation */}
      <rect x="290" y="260" width="60" height="60" rx="3" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
      <rect x="300" y="272" width="14" height="16" rx="2" fill="rgba(255,140,0,0.3)" />
      <rect x="322" y="272" width="14" height="16" rx="2" fill="rgba(255,140,0,0.3)" />
      <rect x="300" y="296" width="36" height="10" rx="2" fill="rgba(255,255,255,0.1)" />

      {/* Floating accent dots (subtle depth) */}
      <circle cx="60" cy="100" r="2.5" fill="rgba(255,140,0,0.4)" />
      <circle cx="380" cy="150" r="2" fill="rgba(255,255,255,0.25)" />
      <circle cx="340" cy="80" r="1.5" fill="rgba(255,140,0,0.3)" />
    </svg>
  );
}
