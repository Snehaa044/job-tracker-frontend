import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Sidebar from '../components/Sidebar';
import StatusBadge from '../components/StatusBadge';

const STATUSES = ['WISHLIST','APPLIED','PHONE_SCREEN','TECHNICAL','ONSITE','OFFER','ACCEPTED','REJECTED','WITHDRAWN'];
const INTERVIEW_TYPES = ['PHONE_SCREEN','TECHNICAL','SYSTEM_DESIGN','HR','ONSITE','TAKE_HOME'];

export default function ApplicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [app, setApp] = useState(null);
  const [interviews, setInterviews] = useState([]);
  const [showInterviewForm, setShowInterviewForm] = useState(false);
  const [ivForm, setIvForm] = useState({ applicationId: id, type: 'TECHNICAL', scheduledAt: '', durationMinutes: 60, interviewerName: '', platform: '', notes: '' });

  useEffect(() => {
    api.get(`/applications/${id}`).then(r => setApp(r.data));
    api.get(`/interviews/application/${id}`).then(r => setInterviews(r.data));
  }, [id]);

  const updateStatus = async (status) => {
    await api.put(`/applications/${id}/status?status=${status}`);
    const r = await api.get(`/applications/${id}`);
    setApp(r.data);
  };

  const scheduleInterview = async (e) => {
    e.preventDefault();
    await api.post('/interviews', { ...ivForm, applicationId: parseInt(id) });
    const r = await api.get(`/interviews/application/${id}`);
    setInterviews(r.data);
    setShowInterviewForm(false);
  };

  const completeInterview = async (ivId) => {
    const feedback = prompt('Add feedback (optional):') || '';
    const rating = parseInt(prompt('Rate 1-5:') || '3');
    await api.put(`/interviews/${ivId}/complete?feedback=${feedback}&rating=${rating}`);
    const r = await api.get(`/interviews/application/${id}`);
    setInterviews(r.data);
  };

  if (!app) return (
    <div className="page-layout"><Sidebar />
      <main className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', animation: 'pulse 1.5s infinite' }}>Loading...</p>
      </main>
    </div>
  );

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <button className="btn-ghost" onClick={() => navigate('/applications')} style={{ marginBottom: '0.5rem', fontSize: '0.8rem' }}>← Back to Applications</button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '1.2rem', color: 'var(--accent-cyan)' }}>
                {app.companyName.charAt(0)}
              </div>
              <div>
                <h1 className="page-title">{app.companyName}</h1>
                <p className="page-subtitle">{app.jobTitle} {app.location && `· ${app.location}`}</p>
              </div>
            </div>
          </div>
          <StatusBadge status={app.status} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem' }}>
          {/* Main */}
          <div>
            {/* Details Card */}
            <div className="card animate-fade" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: '1.25rem' }}>APPLICATION DETAILS</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {[
                  { label: 'Platform', value: app.platform?.replace(/_/g,' ') },
                  { label: 'Applied Date', value: app.appliedDate || 'Not set' },
                  { label: 'Deadline', value: app.deadlineDate || 'Not set' },
                  { label: 'Salary', value: app.salaryRange || 'Not specified' },
                  { label: 'Remote', value: app.remoteOption ? 'Yes' : 'No' },
                  { label: 'Interviews', value: `${app.interviewCount} scheduled` },
                ].map(item => (
                  <div key={item.label} style={{ padding: '0.75rem', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                    <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.3rem' }}>{item.label}</p>
                    <p style={{ fontSize: '0.875rem', fontWeight: 500 }}>{item.value}</p>
                  </div>
                ))}
              </div>
              {app.jobUrl && (
                <a href={app.jobUrl} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginTop: '1rem', fontSize: '0.8rem', color: 'var(--accent-cyan)', textDecoration: 'none', fontWeight: 600 }}>
                  🔗 View Job Posting →
                </a>
              )}
              {app.notes && (
                <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--accent-cyan)' }}>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Notes</p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{app.notes}</p>
                </div>
              )}
            </div>

            {/* Interviews */}
            <div className="card animate-fade" style={{ padding: '1.5rem', animationDelay: '0.1s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em' }}>INTERVIEWS ({interviews.length})</h3>
                <button className="btn-primary" style={{ fontSize: '0.75rem', padding: '0.45rem 0.9rem' }} onClick={() => setShowInterviewForm(!showInterviewForm)}>+ Schedule</button>
              </div>

              {showInterviewForm && (
                <form onSubmit={scheduleInterview} style={{ padding: '1.25rem', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div><label className="label">Type</label>
                      <select className="input" value={ivForm.type} onChange={e => setIvForm({...ivForm, type: e.target.value})}>
                        {INTERVIEW_TYPES.map(t => <option key={t}>{t.replace(/_/g,' ')}</option>)}
                      </select>
                    </div>
                    <div><label className="label">Scheduled At</label>
                      <input className="input" type="datetime-local" value={ivForm.scheduledAt} onChange={e => setIvForm({...ivForm, scheduledAt: e.target.value})} required />
                    </div>
                    <div><label className="label">Duration (mins)</label>
                      <input className="input" type="number" value={ivForm.durationMinutes} onChange={e => setIvForm({...ivForm, durationMinutes: parseInt(e.target.value)})} />
                    </div>
                    <div><label className="label">Interviewer</label>
                      <input className="input" placeholder="Name (optional)" value={ivForm.interviewerName} onChange={e => setIvForm({...ivForm, interviewerName: e.target.value})} />
                    </div>
                  </div>
                  <div style={{ marginBottom: '0.75rem' }}><label className="label">Platform (Zoom, Meet...)</label>
                    <input className="input" placeholder="Google Meet" value={ivForm.platform} onChange={e => setIvForm({...ivForm, platform: e.target.value})} />
                  </div>
                  <button className="btn-primary" type="submit" style={{ fontSize: '0.8rem' }}>Schedule Interview</button>
                </form>
              )}

              {interviews.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'center', padding: '1.5rem' }}>No interviews scheduled yet</p>
              ) : interviews.map(iv => (
                <div key={iv.id} style={{ padding: '1rem', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)', border: `1px solid ${iv.completed ? 'rgba(0,229,160,0.2)' : 'var(--border)'}`, marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ background: 'var(--accent-amber-dim)', color: 'var(--accent-amber)', padding: '0.2rem 0.5rem', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 600 }}>
                        {iv.type?.replace(/_/g,' ')}
                      </span>
                      {iv.completed && <span style={{ background: 'var(--accent-green-dim)', color: 'var(--accent-green)', padding: '0.2rem 0.5rem', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 600 }}>✓ Done</span>}
                    </div>
                    {!iv.completed && <button className="btn-ghost" style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', color: 'var(--accent-green)' }} onClick={() => completeInterview(iv.id)}>Mark Complete</button>}
                  </div>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--accent-cyan)', marginBottom: '0.3rem' }}>
                    📅 {new Date(iv.scheduledAt).toLocaleString()}
                    {iv.durationMinutes && ` · ${iv.durationMinutes} min`}
                  </p>
                  {iv.interviewerName && <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>👤 {iv.interviewerName}</p>}
                  {iv.platform && <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>📍 {iv.platform}</p>}
                  {iv.feedback && <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem', fontStyle: 'italic' }}>"{iv.feedback}"</p>}
                  {iv.rating && <p style={{ fontSize: '0.75rem', color: 'var(--accent-amber)', marginTop: '0.3rem' }}>{'★'.repeat(iv.rating)}{'☆'.repeat(5-iv.rating)}</p>}
                </div>
              ))}
            </div>
          </div>

          {/* Status Updater */}
          <div>
            <div className="card animate-fade" style={{ padding: '1.5rem', animationDelay: '0.15s' }}>
              <h3 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: '1.25rem' }}>UPDATE STATUS</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {STATUSES.map(s => (
                  <button key={s} onClick={() => updateStatus(s)} style={{
                    padding: '0.65rem 0.9rem', borderRadius: 'var(--radius-sm)',
                    border: `1px solid ${app.status === s ? 'var(--accent-cyan)' : 'var(--border)'}`,
                    background: app.status === s ? 'var(--accent-cyan-dim)' : 'transparent',
                    color: app.status === s ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                    cursor: 'pointer', fontSize: '0.8rem', fontWeight: app.status === s ? 700 : 400,
                    textAlign: 'left', transition: 'var(--transition)',
                  }}>
                    {app.status === s ? '● ' : '○ '}{s.replace(/_/g, ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}