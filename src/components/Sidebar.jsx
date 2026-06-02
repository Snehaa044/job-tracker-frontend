import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { path: '/dashboard',    icon: '⬡',  label: 'Dashboard' },
  { path: '/applications', icon: '◈',  label: 'Applications' },
  { path: '/interviews',   icon: '◎',  label: 'Interviews' },
  { path: '/questions',    icon: '◇',  label: 'Question Bank' },
  { path: '/analytics',   icon: '◉',  label: 'Analytics' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <aside style={{
      width: '240px',
      background: 'var(--bg-surface)',
      borderRight: '1px solid var(--border)',
      position: 'fixed',
      top: 0, left: 0, bottom: 0,
      display: 'flex', flexDirection: 'column',
      padding: '0',
      zIndex: 50,
    }}>
      {/* Logo */}
      <div style={{
        padding: '1.75rem 1.5rem 1.25rem',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '32px', height: '32px',
            background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))',
            borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.9rem', fontWeight: 700, color: '#080c14',
            fontFamily: 'var(--font-mono)',
          }}>JT</div>
          <div>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>
              JobTracker
            </p>
            <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
              v1.0
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: '1rem 0.75rem', flex: 1 }}>
        <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0 0.75rem', marginBottom: '0.5rem' }}>
          Navigation
        </p>
        {NAV_ITEMS.map((item, i) => (
          <NavLink key={item.path} to={item.path} style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            padding: '0.65rem 0.75rem',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '2px',
            textDecoration: 'none',
            fontSize: '0.875rem',
            fontWeight: isActive ? 600 : 400,
            color: isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)',
            background: isActive ? 'var(--accent-cyan-dim)' : 'transparent',
            border: isActive ? '1px solid rgba(0,212,255,0.2)' : '1px solid transparent',
            transition: 'var(--transition)',
            animation: `slideIn 0.3s ease both`,
            animationDelay: `${i * 50}ms`,
          })}
          onMouseEnter={e => {
            if (!e.currentTarget.style.background.includes('cyan-dim')) {
              e.currentTarget.style.background = 'var(--bg-hover)';
              e.currentTarget.style.color = 'var(--text-primary)';
            }
          }}
          onMouseLeave={e => {
            if (!e.currentTarget.style.background.includes('cyan-dim')) {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }
          }}>
            <span style={{ fontSize: '1rem', opacity: 0.8 }}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div style={{
        padding: '1rem 1.25rem',
        borderTop: '1px solid var(--border)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          padding: '0.75rem',
          background: 'var(--bg-elevated)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)',
          marginBottom: '0.5rem',
        }}>
          <div style={{
            width: '32px', height: '32px',
            background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.75rem', fontWeight: 700, color: '#080c14',
            flexShrink: 0,
          }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.name}
            </p>
            <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'var(--font-mono)' }}>
              {user?.email}
            </p>
          </div>
        </div>
        <button onClick={handleLogout} className="btn-ghost" style={{ width: '100%', textAlign: 'left', fontSize: '0.8rem' }}>
          ↪ Sign out
        </button>
      </div>
    </aside>
  );
}