import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Sidebar from '../components/Sidebar';

export default function Interviews() {
  const [interviews, setInterviews] = useState([]);
  const [filter, setFilter] = useState('UPCOMING');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/interviews').then(r => setInterviews(r.data));
  }, []);

  const filtered = interviews.filter(i =>
    filter === 'ALL' ? true : filter === 'UPCOMING' ? !i.completed : i.completed
  );

  const TYPE_COLORS = {
    PHONE_SCREEN: 'var(--accent-purple)', TECHNICAL: 'var(--accent-cyan)',
    SYSTEM_DESIGN: 'var(--accent-amber)', HR: 'var(--accent-green)',
    ONSITE: 'var(--accent-blue)', TAKE_HOME: 'var(--accent-red)',
  };

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="page-title">Interviews</h1>
            <p className="page-subtitle">{interviews.filter(i => !i.completed).length} upcoming</p>
          </div>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            {['UPCOMING', 'COMPLETED', 'ALL'].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: '0.5rem 1rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 600,
                border: `1px solid ${filter === f ? 'var(--accent-cyan)' : 'var(--border)'}`,
                background: filter === f ? 'var(--accent-cyan-dim)' : 'transparent',
                color: filter === f ? 'var(--accent-cyan)' : 'var(--text-muted)',
                cursor: 'pointer', transition: 'var(--transition)',
              }}>{f}</button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
            <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>📅</p>
            <p style={{ color: 'var(--text-muted)' }}>No {filter.toLowerCase()} interviews</p>
            <button className="btn-primary" style={{ marginTop: '1rem' }} onClick={() => navigate('/applications')}>Go to Applications</button>
          </div>
        ) : (
          <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
            {filtered.map((iv, i) => (
              <div key={iv.id} className="card animate-fade" style={{
                padding: '1.5rem',
                borderTop: `3px solid ${TYPE_COLORS[iv.type] || 'var(--accent-cyan)'}`,
                animationDelay: `${i * 50}ms`,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div>
                    <p style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.2rem' }}>{iv.companyName}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{iv.jobTitle}</p>
                  </div>
                  <span style={{
                    background: `${TYPE_COLORS[iv.type]}22`,
                    color: TYPE_COLORS[iv.type],
                    border: `1px solid ${TYPE_COLORS[iv.type]}44`,
                    padding: '0.25rem 0.6rem',
                    borderRadius: '999px', fontSize: '0.7rem', fontWeight: 700,
                  }}>{iv.type?.replace(/_/g,' ')}</span>
                </div>

                <div style={{ padding: '0.75rem', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', marginBottom: '0.75rem' }}>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--accent-cyan)', marginBottom: iv.durationMinutes ? '0.3rem' : 0 }}>
                    {new Date(iv.scheduledAt).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    {' at '}
                    {new Date(iv.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  {iv.durationMinutes && <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>⏱ {iv.durationMinutes} minutes</p>}
                </div>

                {iv.interviewerName && <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>👤 {iv.interviewerName}</p>}
                {iv.platform && <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>📍 {iv.platform}</p>}

                {iv.completed ? (
                  <div>
                    {iv.rating && <p style={{ fontSize: '0.8rem', color: 'var(--accent-amber)' }}>{'★'.repeat(iv.rating)}{'☆'.repeat(5-iv.rating)} Rating</p>}
                    {iv.feedback && <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.4rem', fontStyle: 'italic' }}>"{iv.feedback}"</p>}
                    <span style={{ display: 'inline-block', marginTop: '0.5rem', background: 'var(--accent-green-dim)', color: 'var(--accent-green)', padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 700 }}>✓ Completed</span>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn-primary" style={{ fontSize: '0.75rem', padding: '0.45rem 0.9rem', flex: 1 }} onClick={() => navigate(`/applications/${iv.applicationId}`)}>View Details</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}