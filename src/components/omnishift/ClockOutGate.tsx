import { useEffect, useState } from 'react';

const steps = [
  'Ending approved session...',
  'Supervisor connection lost...',
  'Clock discrepancy detected: 1:47 AM',
  'Breakroom override accepted...',
  'CLOCKED OUT'
];

export default function ClockOutGate() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (idx >= steps.length - 1) return;
    const t = setTimeout(() => setIdx((n) => n + 1), 850);
    return () => clearTimeout(t);
  }, [idx]);

  return (
    <div className="old-shell" style={{ maxWidth: 760, margin: '80px auto', background: '#050605', color: '#33ff66' }}>
      <div className="old-header" style={{ background: '#111', color: '#33ff66' }}>Clock Out Gate</div>
      <div className="old-body" style={{ fontFamily: 'var(--type-mono)', fontSize: 18, minHeight: 220 }}>
        {steps.slice(0, idx + 1).map((step) => <p key={step} className="blink">{step}</p>)}
        {idx === steps.length - 1 && <p><a className="old-button" href="/after-hours">Enter After Hours</a></p>}
      </div>
    </div>
  );
}
