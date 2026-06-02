import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import api from '../api/axios';

const PIPELINE = ['WISHLIST','APPLIED','PHONE_SCREEN','TECHNICAL','ONSITE','OFFER','ACCEPTED'];

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/analytics'),
      api.get('/applications'),
      api.get('/interviews'),
    ]).then(([a, apps, ivs]) => {
      setAnalytics(a.data);
      setApplications(apps.data.slice(0, 5));
      setInterviews(ivs.data.filter(i => !i.completed).slice(0, 3));
    }).finally(() => setLoading(false));
  }, []);

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) return (
    <div className="page-layout">
      <Sidebar />
      <main className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', fontSize: '0.875rem', animation: 'pulse 1.5s ease infinite' }}>Loading your dashboard...</div>
        </div>
      </main>
    </div>
  );

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="main-content">
        {/* Header */}
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent-cyan)', marginBottom: '0.3rem', letterSpacing: '0.05em' }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <h1 className="page-title">{getGreeting()}, {user?.name?.split(' ')[0]} 👋</h1>
            <p className="page-subtitle">Here's your job search at a glance</p>
          </div>
          <button className="btn-primary" onClick={() => navigate('/applications')}>
            + New Application
          </button>
        </div>

        {/* Stat Cards */}
        {analytics && (
          <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '2rem' }}>
            <StatCard label="Total Applications" value={analytics.totalApplications} icon="📋" color="var(--accent-cyan)" delay={0} />
            <StatCard label="Interviews" value={analytics.interviews} icon="🎯" color="var(--accent-purple)" delay={50} />
            <StatCard label="Offers" value={analytics.offers} icon="🏆" color="var(--accent-green)" delay={100} />
            <StatCard label="Interview Rate" value={`${analytics.applicationToInterviewRate}%`} icon="📈" color="var(--accent-amber)" delay={150} />
          </div>
        )}

        {/* Pipeline */}
        {analytics && (
          <div className="card animate-fade" style={{ padding: '1.5rem', marginBottom: '2rem', animationDelay: '0.2s' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '1.25rem', color: 'var(--text-secondary)' }}>APPLICATION PIPELINE</h3>
            <div style={{ display: 'flex', gap: '0', alignItems: 'stretch' }}>
              {PIPELINE.map((status, i) => {
                const count = analytics.statusBreakdown?.[status] || 0;
                const isActive = count > 0;
                return (
                  <div key={status} style={{ flex: 1, textAlign: 'center', position: 'relative' }}>
                    {/* Connector line */}
                    {i < PIPELINE.length - 1 && (
                      <div style={{
                        position: 'absolute', right: 0, top: '20px',
                        width: '100%', height: '2px',
                        background: isActive ? 'var(--accent-cyan)' : 'var(--border)',
                        zIndex: 0,
                      }} />
                    )}
                    <div style={{
                      width: '40px', height: '40px',
                      background: isActive ? 'var(--accent-cyan-dim)' : 'var(--bg-elevated)',
                      border: `2px solid ${isActive ? 'var(--accent-cyan)' : 'var(--border)'}`,
                      borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      margin: '0 auto 0.6rem',
                      fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.9rem',
                      color: isActive ? 'var(--accent-cyan)' : 'var(--text-muted)',
                      position: 'relative', zIndex: 1,
                      transition: 'var(--transition)',
                    }}>
                      {count}
                    </div>
                    <p style={{ fontSize: '0.65rem', color: isActive ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: isActive ? 600 : 400, lineHeight: 1.2 }}>
                      {status.replace('_', ' ')}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem' }}>
          {/* Recent Applications */}
          <div className="card animate-fade" style={{ padding: '1.5rem', animationDelay: '0.25s' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>RECENT APPLICATIONS</h3>
              <button className="btn-ghost" style={{ fontSize: '0.75rem' }} onClick={() => navigate('/applications')}>View all →</button>
            </div>
            {applications.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📭</p>
                <p>No applications yet</p>
                <button className="btn-primary" style={{ marginTop: '1rem', fontSize: '0.8rem' }} onClick={() => navigate('/applications')}>Add your first</button>
              </div>
            ) : applications.map(app => (
              <div key={app.id} onClick={() => navigate(`/applications/${app.id}`)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '0.9rem', borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer', transition: 'var(--transition)',
                  marginBottom: '2px',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '36px', height: '36px',
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.85rem', fontWeight: 700,
                    color: 'var(--accent-cyan)',
                    fontFamily: 'var(--font-mono)',
                    flexShrink: 0,
                  }}>
                    {app.companyName.charAt(0)}
                  </div>
                  <div>
                    <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>{app.companyName}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{app.jobTitle}</p>
                  </div>
                </div>
                <StatusBadge status={app.status} size="sm" />
              </div>
            ))}
          </div>

          {/* Upcoming Interviews */}
          <div className="card animate-fade" style={{ padding: '1.5rem', animationDelay: '0.3s' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>UPCOMING INTERVIEWS</h3>
              <button className="btn-ghost" style={{ fontSize: '0.75rem' }} onClick={() => navigate('/interviews')}>View all →</button>
            </div>
            {interviews.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📅</p>
                <p style={{ fontSize: '0.875rem' }}>No upcoming interviews</p>
              </div>
            ) : interviews.map(iv => (
              <div key={iv.id} style={{
                padding: '1rem',
                background: 'var(--bg-elevated)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)',
                marginBottom: '0.75rem',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>{iv.companyName}</p>
                  <span style={{
                    background: 'var(--accent-amber-dim)',
                    color: 'var(--accent-amber)',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '999px',
                    fontSize: '0.65rem',
                    fontWeight: 600,
                  }}>{iv.type?.replace('_', ' ')}</span>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>{iv.jobTitle}</p>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>
                  📅 {new Date(iv.scheduledAt).toLocaleDateString()} at {new Date(iv.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}