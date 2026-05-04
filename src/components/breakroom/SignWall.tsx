import { useState } from 'react';

const seed = [
  'Clock still wrong.',
  'I got hired by accident.',
  'Do not trust the hot dogs.',
  'Miss September saw me first.',
  'Bring a hoodie. The lot gets cold.'
];

export default function SignWall() {
  const [posts, setPosts] = useState(seed);
  const [msg, setMsg] = useState('');
  return (
    <div className="old-shell">
      <div className="old-header">Bathroom Wall / Guestbook Simulator</div>
      <div className="old-body">
        <div style={{ background: '#d8c9a6', minHeight: 280, padding: 18, border: '1px solid #14110e', display: 'grid', gap: 10 }}>
          {posts.map((p, i) => <div key={i} style={{ fontFamily: 'Caveat, cursive', fontSize: 28, transform: `rotate(${i % 2 ? -1 : 1}deg)` }}>{p}</div>)}
        </div>
        <form onSubmit={(e) => { e.preventDefault(); if (msg.trim()) { setPosts([msg.trim(), ...posts]); setMsg(''); } }} style={{ marginTop: 14, display: 'flex', gap: 8 }}>
          <input value={msg} onChange={(e) => setMsg(e.target.value)} maxLength={80} placeholder="write something short" style={{ flex: 1, padding: 10 }} />
          <button className="old-button">Sign The Wall</button>
        </form>
        <p style={{ fontSize: 12, color: '#5a513f' }}>V1 local preview only. Supabase moderation is scaffolded in migrations.</p>
      </div>
    </div>
  );
}
