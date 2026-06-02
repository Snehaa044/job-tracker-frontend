import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Sidebar from '../components/Sidebar';
import StatusBadge from '../components/StatusBadge';

const STATUSES = ['WISHLIST','APPLIED','PHONE_SCREEN','TECHNICAL','ONSITE','OFFER','ACCEPTED','REJECTED','WITHDRAWN'];
const PLATFORMS = ['LINKEDIN','NAUKRI','INDEED','GLASSDOOR','COMPANY_WEBSITE','REFERRAL','OTHER'];

const emptyForm = {
  companyName: '', jobTitle: '', jobUrl: '', platform: 'LINKEDIN',
  status: 'WISHLIST', appliedDate: '', deadlineDate: '',
  notes: '', location: '', salaryRange: '', remoteOption: false,
};

export default function Applications() {
  const [apps, setApps] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { fetchApps(); }, []);

  const fetchApps = async () => {
    const res = await api.get('/applications');
    setApps(res.data);
  };

  const filtered = apps.filter(a => {
    const matchStatus = filterStatus === 'ALL' || a.status === filterStatus;
    const matchSearch = !search || a.companyName.toLowerCase().includes(search.toLowerCase()) || a.jobTitle.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const payload = {
        ...form,
        appliedDate: form.appliedDate || null,
        deadlineDate: form.deadlineDate || null,
      };
      if (editId) await api.put(`/applications/${editId}`, payload);
      else await api.post('/applications', payload);
      setShowForm(false); setEditId(null); setForm(emptyForm);
      fetchApps();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save');
    } finally { setLoading(false); }
  };

  const handleEdit = (app) => {
    setForm({
      companyName: app.companyName, jobTitle: app.jobTitle,
      jobUrl: app.jobUrl || '', platform: app.platform || 'LINKEDIN',
      status: app.status, appliedDate: app.appliedDate || '',
      deadlineDate: app.deadlineDate || '', notes: app.notes || '',
      location: app.location || '', salaryRange: app.salaryRange || '',
      remoteOption: app.remoteOption || false,
    });
    setEditId(app.id); setShowForm(true);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this application?')) return;
    await api.delete(`/applications/${id}`);
    fetchApps();
  };

  const quickStatusUpdate = async (id, status) => {
    await api.put(`/applications/${id}/status?status=${status}`);
    fetchApps();
  };

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="page-title">Applications</h1>
            <p className="page-subtitle">{apps.length} total · {filtered.length} shown</p>
          </div>
          <button className="btn-primary" onClick={() => { setShowForm(!showForm); setEditId(null); setForm(emptyForm); }}>
            {showForm ? '✕ Cancel' : '+ Add Application'}
          </button>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="card animate-fade" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>
              {editId ? '✏ EDIT APPLICATION' : '+ NEW APPLICATION'}
            </h3>
            {error && <div style={{ background: 'rgba(255,77,109,0.1)', border: '1px solid rgba(255,77,109,0.3)', color: 'var(--accent-red)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</div>}
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label className="label">Company Name *</label>
                  <input className="input" placeholder="Google" value={form.companyName} onChange={e => setForm({ ...form, companyName: e.target.value })} required />
                </div>
                <div>
                  <label className="label">Job Title *</label>
                  <input className="input" placeholder="Software Engineer" value={form.jobTitle} onChange={e => setForm({ ...form, jobTitle: e.target.value })} required />
                </div>
                <div>
                  <label className="label">Status</label>
                  <select className="input" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                    {STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Platform</label>
                  <select className="input" value={form.platform} onChange={e => setForm({ ...form, platform: e.target.value })}>
                    {PLATFORMS.map(p => <option key={p} value={p}>{p.replace(/_/g, ' ')}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Applied Date</label>
                  <input className="input" type="date" value={form.appliedDate} onChange={e => setForm({ ...form, appliedDate: e.target.value })} />
                </div>
                <div>
                  <label className="label">Deadline</label>
                  <input className="input" type="date" value={form.deadlineDate} onChange={e => setForm({ ...form, deadlineDate: e.target.value })} />
                </div>
                <div>
                  <label className="label">Location</label>
                  <input className="input" placeholder="Bangalore, India" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
                </div>
                <div>
                  <label className="label">Salary Range</label>
                  <input className="input" placeholder="₹15-20 LPA" value={form.salaryRange} onChange={e => setForm({ ...form, salaryRange: e.target.value })} />
                </div>
                <div>
                  <label className="label">Job URL</label>
                  <input className="input" placeholder="https://..." value={form.jobUrl} onChange={e => setForm({ ...form, jobUrl: e.target.value })} />
                </div>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label className="label">Notes</label>
                <textarea className="input" rows={3} placeholder="Key requirements, company notes, contacts..." value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} style={{ resize: 'vertical' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  <input type="checkbox" checked={form.remoteOption} onChange={e => setForm({ ...form, remoteOption: e.target.checked })} />
                  Remote Option
                </label>
                <button className="btn-primary" type="submit" disabled={loading}>{loading ? 'Saving...' : editId ? 'Update Application' : 'Save Application'}</button>
                <button className="btn-secondary" type="button" onClick={() => { setShowForm(false); setEditId(null); setForm(emptyForm); }}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* Filters */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <input className="input" placeholder="🔍 Search company or role..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: '280px' }} />
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {['ALL', ...STATUSES].map(s => (
              <button key={s} onClick={() => setFilterStatus(s)} style={{
                padding: '0.4rem 0.8rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600,
                border: `1px solid ${filterStatus === s ? 'var(--accent-cyan)' : 'var(--border)'}`,
                background: filterStatus === s ? 'var(--accent-cyan-dim)' : 'transparent',
                color: filterStatus === s ? 'var(--accent-cyan)' : 'var(--text-muted)',
                cursor: 'pointer', transition: 'var(--transition)',
              }}>
                {s === 'ALL' ? 'All' : s.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Applications Table */}
        <div className="card animate-fade" style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Company', 'Role', 'Status', 'Platform', 'Applied', 'Salary', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '0.9rem 1rem', textAlign: 'left', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', background: 'var(--bg-elevated)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>No applications found</td></tr>
              ) : filtered.map((app, i) => (
                <tr key={app.id} style={{ borderBottom: '1px solid var(--border)', animation: 'fadeIn 0.3s ease both', animationDelay: `${i * 30}ms` }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '0.9rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <div style={{ width: '32px', height: '32px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', flexShrink: 0 }}>
                        {app.companyName.charAt(0)}
                      </div>
                      <div>
                        <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>{app.companyName}</p>
                        {app.location && <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>📍 {app.location}</p>}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '0.9rem 1rem' }}>
                    <p style={{ fontSize: '0.875rem' }}>{app.jobTitle}</p>
                    {app.remoteOption && <span style={{ fontSize: '0.65rem', color: 'var(--accent-green)', fontWeight: 600 }}>REMOTE</span>}
                  </td>
                  <td style={{ padding: '0.9rem 1rem' }}>
                    <StatusBadge status={app.status} size="sm" />
                  </td>
                  <td style={{ padding: '0.9rem 1rem', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {app.platform?.replace(/_/g, ' ') || '—'}
                  </td>
                  <td style={{ padding: '0.9rem 1rem', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {app.appliedDate || '—'}
                  </td>
                  <td style={{ padding: '0.9rem 1rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {app.salaryRange || '—'}
                  </td>
                  <td style={{ padding: '0.9rem 1rem' }}>
                    <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                      <button className="btn-ghost" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }} onClick={() => navigate(`/applications/${app.id}`)}>View</button>
                      <button className="btn-ghost" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }} onClick={() => handleEdit(app)}>Edit</button>
                      <button className="btn-ghost" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', color: 'var(--accent-red)' }} onClick={() => handleDelete(app.id)}>Del</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}