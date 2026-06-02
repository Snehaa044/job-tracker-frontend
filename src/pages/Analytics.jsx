import { useEffect, useState } from 'react';
import api from '../api/axios';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line, CartesianGrid
} from 'recharts';

const STATUS_COLORS = {
  WISHLIST: '#7a90b0', APPLIED: '#00d4ff', PHONE_SCREEN: '#a78bfa',
  TECHNICAL: '#ffb547', ONSITE: '#3b82f6', OFFER: '#00e5a0',
  ACCEPTED: '#00e5a0', REJECTED: '#ff4d6d', WITHDRAWN: '#4a5f7a',
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '0.75rem 1rem' }}>
      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ fontSize: '0.875rem', fontFamily: 'var(--font-mono)', color: p.color, fontWeight: 600 }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
};

export default function Analytics() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/analytics').then(r => setData(r.data));
  }, []);

  if (!data) return (
    <div className="page-layout"><Sidebar />
      <main className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', animation: 'pulse 1.5s infinite' }}>Crunching numbers...</p>
      </main>
    </div>
  );

  const statusData = Object.entries(data.statusBreakdown || {}).map(([name, value]) => ({ name: name.replace(/_/g,' '), value, fill: STATUS_COLORS[name] || '#7a90b0' }));
  const platformData = Object.entries(data.platformBreakdown || {}).map(([name, value]) => ({ name: name.replace(/_/g,' '), value }));
  const monthlyData = (data.monthlyStats || []).map(m => ({ month: m.month, Applied: m.applied }));

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <h1 className="page-title">Analytics</h1>
          <p className="page-subtitle">Your job search performance at a glance</p>
        </div>

        {/* KPI Cards */}
        <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '2rem' }}>
          <StatCard label="Total Applications" value={data.totalApplications} icon="📋" color="var(--accent-cyan)" delay={0} />
          <StatCard label="Interviews Scheduled" value={data.interviews} icon="🎯" color="var(--accent-purple)" delay={50} subtitle="From all applications" />
          <StatCard label="Offers Received" value={data.offers} icon="🏆" color="var(--accent-green)" delay={100} />
          <StatCard label="Rejected" value={data.rejected} icon="📉" color="var(--accent-red)" delay={150} />
        </div>

        {/* Rate Cards */}
        <div className="stagger" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
          <div className="card animate-fade" style={{ padding: '1.5rem', animationDelay: '0.2s' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>Application → Interview Rate</p>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem', marginBottom: '1rem' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '3rem', fontWeight: 700, color: 'var(--accent-cyan)', lineHeight: 1 }}>{data.applicationToInterviewRate}%</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', paddingBottom: '0.4rem' }}>conversion rate</p>
            </div>
            <div style={{ height: '8px', background: 'var(--bg-elevated)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${Math.min(data.applicationToInterviewRate, 100)}%`, background: 'linear-gradient(90deg, var(--accent-cyan), var(--accent-purple))', borderRadius: '4px', transition: 'width 1s cubic-bezier(0.4,0,0.2,1)' }} />
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Industry avg: ~20–25%</p>
          </div>

          <div className="card animate-fade" style={{ padding: '1.5rem', animationDelay: '0.25s' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>Application → Offer Rate</p>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem', marginBottom: '1rem' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '3rem', fontWeight: 700, color: 'var(--accent-green)', lineHeight: 1 }}>{data.offerRate}%</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', paddingBottom: '0.4rem' }}>offer rate</p>
            </div>
            <div style={{ height: '8px', background: 'var(--bg-elevated)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${Math.min(data.offerRate, 100)}%`, background: 'linear-gradient(90deg, var(--accent-green), var(--accent-cyan))', borderRadius: '4px', transition: 'width 1s cubic-bezier(0.4,0,0.2,1)' }} />
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Industry avg: ~2–5%</p>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div className="card animate-fade" style={{ padding: '1.5rem', animationDelay: '0.3s' }}>
            <h3 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: '1.25rem' }}>STATUS BREAKDOWN</h3>
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} innerRadius={40}>
                    {statusData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend iconType="circle" iconSize={8} formatter={(value) => <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{value}</span>} />
                </PieChart>
              </ResponsiveContainer>
            ) : <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>No data yet</p>}
          </div>

          <div className="card animate-fade" style={{ padding: '1.5rem', animationDelay: '0.35s' }}>
            <h3 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: '1.25rem' }}>PLATFORM EFFECTIVENESS</h3>
            {platformData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={platformData} layout="vertical">
                  <XAxis type="number" stroke="var(--text-muted)" fontSize={11} />
                  <YAxis type="category" dataKey="name" stroke="var(--text-muted)" fontSize={11} width={100} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" fill="var(--accent-cyan)" radius={[0,4,4,0]} name="Applications" />
                </BarChart>
              </ResponsiveContainer>
            ) : <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>No data yet</p>}
          </div>
        </div>

        {/* Monthly Chart */}
        {monthlyData.length > 0 && (
          <div className="card animate-fade" style={{ padding: '1.5rem', animationDelay: '0.4s' }}>
            <h3 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: '1.25rem' }}>MONTHLY APPLICATION ACTIVITY</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={11} />
                <YAxis stroke="var(--text-muted)" fontSize={11} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="Applied" stroke="var(--accent-cyan)" strokeWidth={2} dot={{ fill: 'var(--accent-cyan)', r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </main>
    </div>
  );
}