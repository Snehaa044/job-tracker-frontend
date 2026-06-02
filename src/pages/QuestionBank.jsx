import { useEffect, useState } from 'react';
import api from '../api/axios';
import Sidebar from '../components/Sidebar';

const DIFFICULTIES = ['EASY', 'MEDIUM', 'HARD'];
const CATEGORIES = ['DSA', 'System Design', 'Behavioral', 'Java', 'Spring Boot', 'React', 'SQL', 'Other'];

const DIFF_COLORS = { EASY: 'var(--accent-green)', MEDIUM: 'var(--accent-amber)', HARD: 'var(--accent-red)' };

const emptyForm = { question: '', answer: '', company: '', role: '', tags: '', difficulty: 'MEDIUM', category: 'DSA' };

export default function QuestionBank() {
  const [questions, setQuestions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [filterDiff, setFilterDiff] = useState('ALL');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    api.get('/questions').then(r => setQuestions(r.data));
  }, []);

  const filtered = questions.filter(q => {
    const matchDiff = filterDiff === 'ALL' || q.difficulty === filterDiff;
    const matchSearch = !search || q.question.toLowerCase().includes(search.toLowerCase()) || q.company?.toLowerCase().includes(search.toLowerCase()) || q.tags?.toLowerCase().includes(search.toLowerCase());
    return matchDiff && matchSearch;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) await api.put(`/questions/${editId}`, form);
    else await api.post('/questions', form);
    const r = await api.get('/questions');
    setQuestions(r.data);
    setShowForm(false); setEditId(null); setForm(emptyForm);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this question?')) return;
    await api.delete(`/questions/${id}`);
    setQuestions(questions.filter(q => q.id !== id));
  };

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="page-title">Question Bank</h1>
            <p className="page-subtitle">{questions.length} questions · Your personal interview prep library</p>
          </div>
          <button className="btn-primary" onClick={() => { setShowForm(!showForm); setEditId(null); setForm(emptyForm); }}>
            {showForm ? '✕ Cancel' : '+ Add Question'}
          </button>
        </div>

        {/* Stats */}
        <div className="stagger" style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          {DIFFICULTIES.map(d => {
            const count = questions.filter(q => q.difficulty === d).length;
            return (
              <div key={d} className="card animate-fade" style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '8px', height: '32px', background: DIFF_COLORS[d], borderRadius: '4px' }} />
                <div>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem', fontWeight: 700, color: DIFF_COLORS[d], lineHeight: 1 }}>{count}</p>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{d}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Form */}
        {showForm && (
          <div className="card animate-fade" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: '1.25rem' }}>
              {editId ? '✏ EDIT QUESTION' : '+ NEW QUESTION'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label className="label">Question *</label>
                <textarea className="input" rows={3} placeholder="What is the difference between HashMap and LinkedHashMap?" value={form.question} onChange={e => setForm({...form, question: e.target.value})} required style={{ resize: 'vertical' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
                <div><label className="label">Company</label><input className="input" placeholder="Google" value={form.company} onChange={e => setForm({...form, company: e.target.value})} /></div>
                <div><label className="label">Role</label><input className="input" placeholder="SDE-2" value={form.role} onChange={e => setForm({...form, role: e.target.value})} /></div>
                <div><label className="label">Difficulty</label>
                  <select className="input" value={form.difficulty} onChange={e => setForm({...form, difficulty: e.target.value})}>
                    {DIFFICULTIES.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div><label className="label">Category</label>
                  <select className="input" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label className="label">Tags (comma separated)</label>
                <input className="input" placeholder="hashmap, collections, java" value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label className="label">Your Answer</label>
                <textarea className="input" rows={4} placeholder="Write your answer here..." value={form.answer} onChange={e => setForm({...form, answer: e.target.value})} style={{ resize: 'vertical', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }} />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button className="btn-primary" type="submit">{editId ? 'Update' : 'Save Question'}</button>
                <button className="btn-secondary" type="button" onClick={() => { setShowForm(false); setForm(emptyForm); setEditId(null); }}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* Filters */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', alignItems: 'center' }}>
          <input className="input" placeholder="🔍 Search questions, companies, tags..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: '340px' }} />
          {['ALL', ...DIFFICULTIES].map(d => (
            <button key={d} onClick={() => setFilterDiff(d)} style={{
              padding: '0.4rem 0.8rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600,
              border: `1px solid ${filterDiff === d ? (DIFF_COLORS[d] || 'var(--accent-cyan)') : 'var(--border)'}`,
              background: filterDiff === d ? `${DIFF_COLORS[d] || 'var(--accent-cyan)'}22` : 'transparent',
              color: filterDiff === d ? (DIFF_COLORS[d] || 'var(--accent-cyan)') : 'var(--text-muted)',
              cursor: 'pointer', transition: 'var(--transition)',
            }}>{d}</button>
          ))}
        </div>

        {/* Questions List */}
        <div className="stagger" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filtered.length === 0 ? (
            <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
              <p style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📚</p>
              <p style={{ color: 'var(--text-muted)' }}>No questions yet. Add your first!</p>
            </div>
          ) : filtered.map((q, i) => (
            <div key={q.id} className="card animate-fade" style={{ padding: '1.25rem', borderLeft: `3px solid ${DIFF_COLORS[q.difficulty] || 'var(--border)'}`, animationDelay: `${i * 30}ms` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                    {q.difficulty && <span style={{ background: `${DIFF_COLORS[q.difficulty]}22`, color: DIFF_COLORS[q.difficulty], padding: '0.15rem 0.5rem', borderRadius: '999px', fontSize: '0.65rem', fontWeight: 700 }}>{q.difficulty}</span>}
                    {q.category && <span style={{ background: 'var(--accent-cyan-dim)', color: 'var(--accent-cyan)', padding: '0.15rem 0.5rem', borderRadius: '999px', fontSize: '0.65rem', fontWeight: 700 }}>{q.category}</span>}
                    {q.company && <span style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)', padding: '0.15rem 0.5rem', borderRadius: '999px', fontSize: '0.65rem', border: '1px solid var(--border)' }}>{q.company}</span>}
                    {q.tags && q.tags.split(',').map(tag => (
                      <span key={tag} style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)', padding: '0.15rem 0.5rem', borderRadius: '999px', fontSize: '0.65rem' }}>#{tag.trim()}</span>
                    ))}
                  </div>
                  <p style={{ fontSize: '0.9rem', fontWeight: 600, lineHeight: 1.5, cursor: 'pointer' }} onClick={() => setExpanded(expanded === q.id ? null : q.id)}>
                    {q.question}
                  </p>

                  {expanded === q.id && q.answer && (
                    <div style={{ marginTop: '0.75rem', padding: '1rem', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--accent-green)', animation: 'fadeIn 0.3s ease both' }}>
                      <p style={{ fontSize: '0.65rem', color: 'var(--accent-green)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Answer</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.7, fontFamily: 'var(--font-mono)', whiteSpace: 'pre-wrap' }}>{q.answer}</p>
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
                  <button className="btn-ghost" style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }} onClick={() => setExpanded(expanded === q.id ? null : q.id)}>
                    {expanded === q.id ? '▲' : '▼'}
                  </button>
                  <button className="btn-ghost" style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }} onClick={() => { setForm({ question: q.question, answer: q.answer || '', company: q.company || '', role: q.role || '', tags: q.tags || '', difficulty: q.difficulty || 'MEDIUM', category: q.category || 'DSA' }); setEditId(q.id); setShowForm(true); window.scrollTo(0,0); }}>Edit</button>
                  <button className="btn-ghost" style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', color: 'var(--accent-red)' }} onClick={() => handleDelete(q.id)}>Del</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}