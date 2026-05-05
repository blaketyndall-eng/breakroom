import { FormEvent, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type WallPost = {
  id: string;
  alias: string | null;
  body: string;
  x: number | null;
  y: number | null;
  rotation: number | null;
  is_approved?: boolean;
};

const seed: WallPost[] = [
  { id: 'seed-1', alias: 'Rudy 44', body: 'READY AND WILLING TO MESS IT UP', x: 72, y: 18, rotation: -4 },
  { id: 'seed-2', alias: 'Eddy Pool', body: 'THIS ISN’T HELL BUT WE KNOW WHAT IT LOOKS LIKE', x: 34, y: 52, rotation: 2 },
  { id: 'seed-3', alias: 'No Eddy', body: 'NO EDDY THE POOL NOT EDDY THE MAN', x: 42, y: 38, rotation: -6 },
  { id: 'seed-4', alias: 'Lot Arms', body: 'NO WAR / RACK EM ANYWAY', x: 68, y: 40, rotation: -8 },
  { id: 'seed-5', alias: 'Reg 3', body: '573% legal maybe ask the table', x: 76, y: 78, rotation: 7 },
  { id: 'seed-6', alias: 'Unknown', body: 'EAT CHILI', x: 19, y: 28, rotation: -11 },
  { id: 'seed-7', alias: 'Room Hand', body: 'The wall remembers better than the bartender', x: 51, y: 70, rotation: -3 },
];

const markerColors = ['black', 'blue', 'red', 'gray', 'white'] as const;

function clampWallText(value: string) {
  return value.replace(/\s+/g, ' ').trim().slice(0, 90);
}

function makeLocalPost(body: string, alias: string): WallPost {
  return {
    id: `local-${Date.now()}`,
    alias: alias || 'Anonymous',
    body,
    x: Math.floor(8 + Math.random() * 76),
    y: Math.floor(16 + Math.random() * 70),
    rotation: Math.floor(-10 + Math.random() * 20),
  };
}

export default function SignWall() {
  const [posts, setPosts] = useState<WallPost[]>(seed);
  const [msg, setMsg] = useState('');
  const [alias, setAlias] = useState('');
  const [markerColor, setMarkerColor] = useState<(typeof markerColors)[number]>('black');
  const [status, setStatus] = useState('Bathroom wall loaded from local scrawl.');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function loadWall() {
      if (!supabase) return;

      const { data, error } = await supabase
        .from('wall_posts')
        .select('id, alias, body, x, y, rotation, is_approved')
        .eq('is_approved', true)
        .order('created_at', { ascending: false })
        .limit(40);

      if (ignore) return;

      if (error) {
        setStatus('Wall database unreachable. Local marker ghosts are showing.');
        return;
      }

      if (data?.length) {
        setPosts(data as WallPost[]);
        setStatus('Approved wall posts loaded from Supabase. New marks submit to the back office first.');
      }
    }

    loadWall();

    return () => {
      ignore = true;
    };
  }, []);

  const arrangedPosts = useMemo(
    () => posts.map((post, index) => ({
      ...post,
      x: post.x ?? Math.floor(8 + ((index * 17) % 78)),
      y: post.y ?? Math.floor(18 + ((index * 13) % 70)),
      rotation: post.rotation ?? (index % 2 ? -5 : 4),
    })),
    [posts],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const body = clampWallText(msg);
    const cleanAlias = clampWallText(alias).slice(0, 28);
    if (!body) return;

    const localPost = makeLocalPost(body, cleanAlias);
    setPosts((current) => [localPost, ...current]);
    setMsg('');
    setAlias('');

    if (!supabase) {
      setStatus('Local mark added. Supabase is not configured in this room.');
      return;
    }

    setIsSaving(true);
    const { error } = await supabase.from('wall_posts').insert({
      alias: cleanAlias || 'Anonymous',
      body,
      x: localPost.x,
      y: localPost.y,
      rotation: localPost.rotation,
      is_approved: false,
    });
    setIsSaving(false);

    if (error) {
      setStatus('Local mark added, but the back office rejected the database save.');
      return;
    }

    setStatus('Mark submitted. It appears locally now and waits for approval before becoming wall history.');
  }

  return (
    <div className="old-shell wall-shell">
      <div className="old-header">Bathroom Wall / Marker Layer / Approval Pending</div>
      <div className="old-body">
        <div className="wall-board" aria-label="Bathroom wall covered in writing">
          <div className="wall-ceiling">LEGAL&nbsp;&nbsp;&nbsp;LEGAL&nbsp;&nbsp;&nbsp;LEGAL</div>
          <div className="wall-wood-frame left" />
          <div className="wall-wood-frame mid" />
          <div className="wall-wood-frame right" />
          <div className="wall-peace peace-left">☮</div>
          <div className="wall-peace peace-mid">☮</div>
          <div className="wall-tag big-red">LEGAL</div>
          {arrangedPosts.map((post, index) => (
            <div
              key={post.id}
              className={`wall-mark marker-${index % 5}`}
              style={{
                left: `${post.x}%`,
                top: `${post.y}%`,
                transform: `translate(-50%, -50%) rotate(${post.rotation}deg)`,
              }}
            >
              <span>{post.body}</span>
              {post.alias && <small>{post.alias}</small>}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="wall-form">
          <input value={alias} onChange={(e) => setAlias(e.target.value)} maxLength={28} placeholder="alias / optional" />
          <input value={msg} onChange={(e) => setMsg(e.target.value)} maxLength={90} placeholder="write something short" />
          <select value={markerColor} onChange={(e) => setMarkerColor(e.target.value as (typeof markerColors)[number])}>
            {markerColors.map((color) => <option key={color}>{color}</option>)}
          </select>
          <button className="old-button" disabled={isSaving}>{isSaving ? 'Writing...' : 'Sign The Wall'}</button>
        </form>
        <p style={{ fontSize: 12, color: '#5a513f' }}>{status} Marker selected: {markerColor}. Keep it short. The wall is not a manifesto.</p>
      </div>
    </div>
  );
}
