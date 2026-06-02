const STATUS_CONFIG = {
  WISHLIST:     { label: 'Wishlist',     color: '#7a90b0', bg: 'rgba(122,144,176,0.12)' },
  APPLIED:      { label: 'Applied',      color: '#00d4ff', bg: 'rgba(0,212,255,0.12)' },
  PHONE_SCREEN: { label: 'Phone Screen', color: '#a78bfa', bg: 'rgba(167,139,250,0.12)' },
  TECHNICAL:    { label: 'Technical',    color: '#ffb547', bg: 'rgba(255,181,71,0.12)' },
  ONSITE:       { label: 'Onsite',       color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
  OFFER:        { label: 'Offer',        color: '#00e5a0', bg: 'rgba(0,229,160,0.12)' },
  ACCEPTED:     { label: 'Accepted! 🎉', color: '#00e5a0', bg: 'rgba(0,229,160,0.2)' },
  REJECTED:     { label: 'Rejected',     color: '#ff4d6d', bg: 'rgba(255,77,109,0.12)' },
  WITHDRAWN:    { label: 'Withdrawn',    color: '#4a5f7a', bg: 'rgba(74,95,122,0.12)' },
};

export default function StatusBadge({ status, size = 'md' }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.APPLIED;
  const fontSize = size === 'sm' ? '0.7rem' : '0.75rem';
  const padding = size === 'sm' ? '0.2rem 0.5rem' : '0.3rem 0.7rem';

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.35rem',
      background: config.bg,
      color: config.color,
      border: `1px solid ${config.color}33`,
      borderRadius: '999px',
      fontSize,
      fontWeight: 600,
      padding,
      fontFamily: 'var(--font-ui)',
      whiteSpace: 'nowrap',
      letterSpacing: '0.02em',
    }}>
      <span style={{
        width: '5px', height: '5px',
        borderRadius: '50%',
        background: config.color,
        flexShrink: 0,
      }} />
      {config.label}
    </span>
  );
}