import { useState, useEffect } from 'react';

export default function StatCard({ label, value, icon, color, subtitle, delay = 0 }) {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    if (typeof value !== 'number') return;
    const timer = setTimeout(() => {
      let start = 0;
      const step = Math.ceil(value / 30);
      const interval = setInterval(() => {
        start += step;
        if (start >= value) { setDisplayed(value); clearInterval(interval); }
        else setDisplayed(start);
      }, 30);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return (
    <div className="card animate-fade" style={{
      padding: '1.5rem',
      animationDelay: `${delay}ms`,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Glow effect */}
      <div style={{
        position: 'absolute', top: 0, right: 0,
        width: '80px', height: '80px',
        background: `radial-gradient(circle, ${color}22 0%, transparent 70%)`,
        borderRadius: '50%',
        transform: 'translate(20px, -20px)',
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.6rem' }}>
            {label}
          </p>
          <p style={{
            fontSize: '2.2rem', fontWeight: 700,
            fontFamily: 'var(--font-mono)',
            color,
            lineHeight: 1,
            animation: 'countUp 0.5s ease both',
            animationDelay: `${delay + 100}ms`,
          }}>
            {typeof value === 'number' ? displayed : value}
            {typeof value === 'string' && value.includes('%') && ''}
          </p>
          {subtitle && (
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
              {subtitle}
            </p>
          )}
        </div>
        <div style={{
          width: '42px', height: '42px',
          background: `${color}15`,
          border: `1px solid ${color}30`,
          borderRadius: 'var(--radius-md)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.2rem', flexShrink: 0,
        }}>
          {icon}
        </div>
      </div>
    </div>
  );
}