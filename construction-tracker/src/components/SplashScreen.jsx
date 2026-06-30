import React, { useEffect, useState } from 'react';
import logo from '../assets/logo.png';

export default function SplashScreen({ onFinish, minDuration = 1800 }) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadeOut(true), minDuration);
    const finishTimer = setTimeout(() => onFinish?.(), minDuration + 400);
    return () => { clearTimeout(fadeTimer); clearTimeout(finishTimer); };
  }, [minDuration, onFinish]);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      background: '#FFFFFF',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: fadeOut ? 0 : 1,
      transition: 'opacity 0.4s ease',
      pointerEvents: fadeOut ? 'none' : 'auto',
    }}>
      <img
        src={logo}
        alt="BuildTrack"
        style={{
          width: 'min(200px, 60vw)',
          height: 'auto',
          display: 'block',
          animation: 'splash-fade-in 0.8s ease-out forwards',
        }}
      />

      <div style={{
        marginTop: 28,
        width: 140,
        height: 3,
        borderRadius: 4,
        background: 'var(--surface-2, #EDEEF2)',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: '40%',
          borderRadius: 4,
          background: 'linear-gradient(90deg, #FF8C00, #FFA333)',
          animation: 'splash-loading 1.1s ease-in-out infinite',
        }} />
      </div>

      <p style={{
        marginTop: 14,
        color: 'var(--text-muted, #9CA3AF)',
        fontSize: 12,
        letterSpacing: '0.04em',
        opacity: 0,
        animation: 'splash-text-fade 0.6s ease-out 0.3s forwards',
      }}>
        Loading your dashboard…
      </p>

      <style>{`
        @keyframes splash-fade-in {
          0% { opacity: 0; transform: scale(0.94) translateY(6px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes splash-text-fade {
          0% { opacity: 0; transform: translateY(4px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes splash-loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(350%); }
        }
      `}</style>
    </div>
  );
}
