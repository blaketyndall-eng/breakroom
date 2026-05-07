/**
 * RegularFileView — public profile page (UI redesign).
 *
 * Layout follows the 2005 TheFacebook 3-column profile shape, in our
 * voice: an "anti-feed" personal page where every section is hand-made.
 *
 *   ┌─────────────────────────────────────────────────────────┐
 *   │  rfp-topbar — [ @handle's file ] · wall · info · friends    │
 *   ├──────────────┬──────────────────────┬───────────────────────┤
 *   │ rfp-col-left │ rfp-col-center       │ rfp-col-right         │
 *   │  picture     │  Information table   │  /// The Wall ///     │
 *   │  id card     │  Away Message        │  Top 8                │
 *   │  quick-nav   │  Pinned Evidence     │  Visitor Counter      │
 *   │  status card │  Top Rooms           │                       │
 *   │  collage     │  Pages Made          │                       │
 *   │              │  Share               │                       │
 *   └──────────────┴──────────────────────┴───────────────────────┘
 *
 * Each section header (`rfp-section-head--*`) gets its own typographic
 * treatment in CSS so the page reads as a Citizen Phoebe-style craft
 * artifact, not a uniform shell.
 *
 * Theme classes on the root (`regular-theme-*`) drive page-level
 * wallpaper/accent vars — the theme is the user's "wall paint", not just
 * the header tint.
 *
 * Behavior unchanged from V2:
 *   - Visiting someone else's file fires recordSeenAround()
 *   - Top-8 reciprocity badge appears when you're in their list
 *   - Visitor counter ticks with signature count
 *   - ProfileGuestbook handles its own self-detection via selfHandle
 */
import { useEffect, useState } from 'react';
import { ARTIFACTS } from '@/lib/artifacts';
import RegularFileShare from '@/components/regulars/RegularFileShare';
import TopEightGrid from '@/components/regulars/TopEightGrid';
import AddToTopEightButton from '@/components/regulars/AddToTopEightButton';
import ProfileGuestbook from '@/components/regulars/ProfileGuestbook';
import { isInTopEight, recordSeenAround } from '@/lib/topEight';
import { getProfileGuestbookCount } from '@/lib/profileGuestbook';
import type { RegularFile } from '@/lib/regularFiles';

const VIEWER_KEY = 'breakroom.regular-file.v1';

function readViewerHandle(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(VIEWER_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return typeof parsed?.handle === 'string' ? parsed.handle : null;
  } catch {
    return null;
  }
}

function themeLabel(theme: string) {
  return theme.replaceAll('_', ' ');
}

function initialsFor(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return '??';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Cheap deterministic "filed since" date so the row reads consistently
// across page reloads without needing a real created_at column yet. Hashes
// the handle to a date in 2026.
function filedSinceFor(handle: string): string {
  let h = 0;
  for (let i = 0; i < handle.length; i++) h = ((h << 5) - h + handle.charCodeAt(i)) | 0;
  const day = Math.abs(h % 365);
  const d = new Date(2026, 0, 1);
  d.setDate(d.getDate() + day);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function RegularFileView({ file }: { file: RegularFile }) {
  const handle = file.handle;
  const pinned = ARTIFACTS.filter((a) => file.pinned_artifacts?.includes(a.slug));

  const [inTop8, setInTop8] = useState(false);
  const [signatureCount, setSignatureCount] = useState(0);
  const [lastSeen, setLastSeen] = useState<string>('a while ago');

  useEffect(() => {
    const me = readViewerHandle();
    setSignatureCount(getProfileGuestbookCount(handle));
    // Cosmetic "last seen" — for now it's always "just now" if you're viewing
    // your own file, otherwise a stable random-ish string per handle.
    setLastSeen(me === handle ? 'just now' : `${(handle.length * 7) % 59}m ago`);
    if (me && me !== handle) {
      recordSeenAround({
        handle,
        displayName: file.display_name,
        location: handle,
        locationType: 'locker',
      });
      setInTop8(isInTopEight(handle));
    }
  }, [handle, file.display_name]);

  const filedSince = filedSinceFor(handle);
  const counterValue = String(handle.length * 47 + signatureCount * 13).padStart(6, '0');

  return (
    <section className={`rfp-profile regular-file regular-theme-${file.theme}`}>
      {/* Top bar — Facebook-2005 strip */}
      <header className="rfp-topbar">
        <span className="rfp-tb-mark">[ @{handle}&rsquo;s file ]</span>
        <nav className="rfp-tb-nav">
          <a href="#wall">wall</a>
          <a href="#info">info</a>
          <a href="#friends">friends</a>
          <a href="#stuff">stuff</a>
          <a href="/locker" className="rfp-tb-edit">edit my file</a>
        </nav>
      </header>

      <div className="rfp-body">
        {/* LEFT COLUMN — identity + quick nav */}
        <aside className="rfp-col-left">
          {/* Picture frame — uses initials until image upload exists */}
          <div className="rfp-picture-frame">
            <div className="rfp-picture">
              <span className="rfp-picture-initials" aria-hidden="true">
                {initialsFor(file.display_name)}
              </span>
            </div>
            <p className="rfp-picture-caption">no photo on file</p>
          </div>

          {/* Identity card */}
          <div className="rfp-id-card">
            <p className="rfp-id-kicker">Regular File</p>
            <h1 className="rfp-display-name">{file.display_name}</h1>
            <p className="rfp-handle">@{handle}</p>
            <p className="rfp-fake-title">{file.fake_title}</p>
            {inTop8 && <p className="rfp-in-top8">★ in your Top 8</p>}
          </div>

          {/* Quick nav (anchors + cross-links) */}
          <nav className="rfp-quick-nav">
            <p className="rfp-qn-label">on this page</p>
            <a href="#wall">The Wall</a>
            <a href="#info">The File</a>
            <a href="#pinned">Pinned Evidence</a>
            <a href="#friends">Top 8</a>
            <a href="#pages">Pages Made</a>
            <a href="#wall" className="rfp-qn-cta">Sign My Wall</a>
          </nav>

          {/* Status card */}
          <div className="rfp-status-card">
            <div className="rfp-status-row">
              <span className="rfp-status-dot" aria-hidden="true">●</span>
              <span>{file.is_public ? 'on the wall' : 'staff only'}</span>
            </div>
            <p>last seen <b>{lastSeen}</b></p>
            <p>filed since <b>{filedSince}</b></p>
          </div>

          {/* Hand-collaged "photo wall" of pinned artifacts */}
          {pinned.length > 0 && (
            <div className="rfp-photo-collage" aria-label="Pinned artifacts">
              {pinned.slice(0, 4).map((artifact, i) => (
                <div className={`rfp-collage-tile rfp-collage-tile--${i + 1}`} key={artifact.slug}>
                  <p className="rfp-collage-stamp">{artifact.stamp}</p>
                  <p className="rfp-collage-title">{artifact.title}</p>
                </div>
              ))}
            </div>
          )}
        </aside>

        {/* CENTER COLUMN — Information + content */}
        <main className="rfp-col-center">
          {/* INFORMATION TABLE — dense paper-form rows */}
          <section className="rfp-info-card" id="info">
            <h2 className="rfp-section-head rfp-section-head--info">Information</h2>
            <dl className="rfp-info-rows">
              <div className="rfp-info-row">
                <dt>Display Name</dt>
                <dd>{file.display_name}</dd>
              </div>
              <div className="rfp-info-row">
                <dt>Handle</dt>
                <dd>
                  <a href={`/regulars/${handle}`}>@{handle}</a>
                </dd>
              </div>
              <div className="rfp-info-row">
                <dt>Fake Title</dt>
                <dd>{file.fake_title}</dd>
              </div>
              <div className="rfp-info-row">
                <dt>Filed Since</dt>
                <dd>{filedSince}</dd>
              </div>
              <div className="rfp-info-row">
                <dt>Last Seen</dt>
                <dd>{lastSeen}</dd>
              </div>
              <div className="rfp-info-row">
                <dt>Shift Status</dt>
                <dd>{file.is_public ? 'on the wall' : 'staff only'}</dd>
              </div>
              <div className="rfp-info-row">
                <dt>Theme</dt>
                <dd>{themeLabel(file.theme)}</dd>
              </div>
              <div className="rfp-info-row">
                <dt>Favorite Light</dt>
                <dd>{file.favorite_light}</dd>
              </div>
              <div className="rfp-info-row">
                <dt>Assigned Object</dt>
                <dd>{file.assigned_object}</dd>
              </div>
              <div className="rfp-info-row">
                <dt>Turf</dt>
                <dd>
                  {file.turf ? (
                    <a href={`/factions/${file.turf}`}>{file.turf}</a>
                  ) : (
                    <span className="rfp-info-muted">unaffiliated · drifting</span>
                  )}
                </dd>
              </div>
            </dl>
          </section>

          {/* AWAY MESSAGE — big quote + bio */}
          <section className="rfp-away-card">
            <h2 className="rfp-section-head rfp-section-head--away">Away Message</h2>
            <p className="rfp-away-quote">&ldquo;{file.away_message}&rdquo;</p>
            <p className="rfp-away-bio">{file.bio}</p>
          </section>

          {/* PINNED EVIDENCE — card-catalog grid */}
          <section className="rfp-pinned-card" id="pinned">
            <h2 className="rfp-section-head rfp-section-head--pinned">Pinned Evidence</h2>
            <div className="rfp-pinned-grid">
              {pinned.length > 0 ? (
                pinned.map((artifact, i) => (
                  <article
                    className={`rfp-artifact rfp-artifact--rot${(i % 3) + 1}`}
                    key={artifact.slug}
                  >
                    <span className="rfp-artifact-pin" aria-hidden="true">★</span>
                    <p className="rfp-artifact-stamp">{artifact.stamp}</p>
                    <h3 className="rfp-artifact-title">{artifact.title}</h3>
                    <p className="rfp-artifact-desc">{artifact.description}</p>
                  </article>
                ))
              ) : (
                <p className="rfp-empty">
                  No artifacts pinned yet. The drawer is still making up its mind.
                </p>
              )}
            </div>
          </section>

          {/* TOP ROOMS — handwritten note */}
          <section className="rfp-rooms-card">
            <h2 className="rfp-section-head rfp-section-head--rooms">Top Rooms</h2>
            {file.top_links && file.top_links.length > 0 ? (
              <ul className="rfp-rooms-list">
                {file.top_links.map((link) => (
                  <li key={link}>
                    <a href={link}>{link}</a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="rfp-empty">No rooms listed yet.</p>
            )}
          </section>

          {/* PAGES MADE — single CTA, replaces split SleepNet/Create modules */}
          <section className="rfp-pages-card" id="pages">
            <h2 className="rfp-section-head rfp-section-head--pages">Pages Made</h2>
            <p className="rfp-pages-empty">
              Nothing published yet. The internet underneath the internet is still waiting.
            </p>
            <a className="rfp-pages-cta" href="/sleepnet/create">
              + Make a page
            </a>
          </section>

          {/* SHARE — copy public URL */}
          <section className="rfp-share-card">
            <RegularFileShare handle={handle} />
          </section>
        </main>

        {/* RIGHT COLUMN — wall + friends + counter */}
        <aside className="rfp-col-right">
          {/* THE WALL — MySpace-style integrated comments + future stickers */}
          <section className="rfp-wall-card" id="wall">
            <h2 className="rfp-section-head rfp-section-head--wall">/// The Wall ///</h2>
            <p className="rfp-wall-meta">
              {signatureCount > 0
                ? `${signatureCount} mark${signatureCount === 1 ? '' : 's'} on the wall`
                : 'wet paint. nobody signed.'}
            </p>
            {/* Sticker zone — placeholder for V3+ "friends place objects on your wall" */}
            <div className="rfp-wall-stickers" aria-hidden="true">
              {/* future: friend-placed stickers will land here, slightly rotated */}
            </div>
            {/* Signatures (the actual guestbook island) */}
            <div className="rfp-wall-signatures">
              <ProfileGuestbook
                targetKey={handle}
                contextLabel={`@${handle}'s wall`}
                selfHandle={handle}
              />
            </div>
          </section>

          {/* TOP 8 — polaroid-ish grid */}
          <section className="rfp-friends-card" id="friends">
            <h2 className="rfp-section-head rfp-section-head--friends">Top 8 Regulars</h2>
            <TopEightGrid />
            <AddToTopEightButton handle={handle} displayName={file.display_name} />
          </section>

          {/* VISITOR COUNTER — LED strip */}
          <section className="rfp-counter-card">
            <h2 className="rfp-section-head rfp-section-head--counter">Visitor Counter</h2>
            <p className="rfp-led" aria-label="visitor count">
              {counterValue}
            </p>
            <p className="rfp-counter-foot">
              counter is approximate. it lies when watched.
            </p>
          </section>
        </aside>
      </div>
    </section>
  );
}
