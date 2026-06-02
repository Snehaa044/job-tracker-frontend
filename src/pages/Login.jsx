import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await api.post('/auth/login', form);
      login(res.data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials');
    } finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-base)',
      display: 'flex',
      overflow: 'hidden',
    }}>
      {/* Left Panel */}
      <div style={{
        flex: 1,
        background: 'linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-elevated) 100%)',
        borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', padding: '4rem',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Background grid */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle, var(--border) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
          opacity: 0.4,
        }} />
        {/* Glow orbs */}
        <div style={{ position: 'absolute', top: '20%', left: '10%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(0,212,255,0.08) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '20%', right: '10%', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(167,139,250,0.08) 0%, transparent 70%)', borderRadius: '50%' }} />

        <div style={{ position: 'relative', zIndex: 1, animation: 'fadeIn 0.7s ease both' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem' }}>
            <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#080c14' }}>JT</div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 700 }}>JobTracker</span>
          </div>

          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: 700, lineHeight: 1.1, marginBottom: '1.5rem' }}>
            Own your<br/>
            <span style={{ color: 'var(--accent-cyan)', fontStyle: 'italic' }}>job search.</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7, maxWidth: '380px', marginBottom: '2.5rem' }}>
            Track every application, interview, and offer in one place. Built by job seekers, for job seekers.
          </p>

          {/* Stats */}
          <div style={{ display: 'flex', gap: '2rem' }}>
            {[
              { value: '12+', label: 'Companies Tracked' },
              { value: '28%', label: 'Interview Rate' },
              { value: '20min', label: 'Saved Weekly' },
            ].map(stat => (
              <div key={stat.label}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem', fontWeight: 600, color: 'var(--accent-cyan)' }}>{stat.value}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div style={{
        width: '460px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '3rem',
        flexShrink: 0,
      }}>
        <div style={{ width: '100%', animation: 'fadeIn 0.6s ease both', animationDelay: '0.1s' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.4rem' }}>Welcome back</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '2rem' }}>
            Sign in to your account
          </p>

          {error && (
            <div style={{
              background: 'rgba(255,77,109,0.1)', border: '1px solid rgba(255,77,109,0.3)',
              color: 'var(--accent-red)', padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem',
              fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
            }}>
              ⚠ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label className="label">Email Address</label>
              <input className="input" type="email" placeholder="you@example.com"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label className="label">Password</label>
              <input className="input" type="password" placeholder="••••••••"
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
            </div>
            <button className="btn-primary" type="submit" disabled={loading}
              style={{ width: '100%', padding: '0.8rem', fontSize: '0.9rem' }}>
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            No account?{' '}
            <Link to="/register" style={{ color: 'var(--accent-cyan)', fontWeight: 600, textDecoration: 'none' }}>
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}