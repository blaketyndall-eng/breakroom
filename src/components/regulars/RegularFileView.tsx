import { useEffect, useState } from 'react';
import { ARTIFACTS } from '@/lib/artifacts';
import RegularFileShare from '@/components/regulars/RegularFileShare';
import TopEightGrid from '@/components/regulars/TopEightGrid';
import AddToTopEightButton from '@/components/regulars/AddToTopEightButton';
import ProfileGuestbook from '@/components/regulars/ProfileGuestbook';
import { isInTopEight, recordSeenAround } from '@/lib/topEight';
import { getProfileGuestbookCount } from '@/lib/profileGuestbook';
import type { RegularFile } from '@/lib/regularFiles';

function themeLabel(theme: string) {
  return theme.replaceAll('_', ' ');
}

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

export default function RegularFileView({ file }: { file: RegularFile }) {
  const pinned = ARTIFACTS.filter((artifact) => file.pinned_artifacts?.includes(artifact.slug));
  const handle = file.handle;

  const [inTop8, setInTop8] = useState(false);
  const [signatureCount, setSignatureCount] = useState(0);

  // On mount: record visit (Seen Around) if this isn't the viewer's own file,
  // and check Top-8 reciprocity for the in-Top-8 badge.
  useEffect(() => {
    const me = readViewerHandle();
    setSignatureCount(getProfileGuestbookCount(handle));
    if (me && me !== handle) {
      // Mark THIS handle as "seen around" location 'locker' — surfaces the
      // visited handle in the global SeenAroundBlock.
      recordSeenAround({
        handle,
        displayName: file.display_name,
        location: handle,
        locationType: 'locker',
      });
      setInTop8(isInTopEight(handle));
    }
  }, [handle, file.display_name]);

  return (
    <section className={`regular-file regular-theme-${file.theme}`}>
      <div className="regular-header">
        <div>
          <p className="regular-kicker">Regular File / Public Locker</p>
          <h1>{file.display_name}</h1>
          <p>{file.fake_title}</p>
          {inTop8 && <p className="regular-in-top8">★ in your Top 8</p>}
        </div>
        <div className="regular-badge">{file.is_public ? 'ON THE WALL' : 'STAFF ONLY'}</div>
      </div>

      <div className="regular-grid">
        <article className="old-shell regular-module span-2">
          <div className="old-header">Away Message</div>
          <div className="old-body">
            <p className="regular-away">{file.away_message}</p>
            <p>{file.bio}</p>
            <RegularFileShare handle={handle} />
          </div>
        </article>

        <article className="old-shell regular-module">
          <div className="old-header">Visitor Counter</div>
          <div className="old-body">
            <p className="visitor-counter">
              000{String(handle.length * 47 + signatureCount * 13).padStart(3, '0')}
            </p>
            <p>
              {signatureCount > 0
                ? `${signatureCount} signature${signatureCount === 1 ? '' : 's'} on the wall.`
                : 'No signatures yet.'}
              {' '}Count is approximate. The counter lies when watched.
            </p>
          </div>
        </article>

        <article className="old-shell regular-module">
          <div className="old-header">Assigned Object</div>
          <div className="old-body">
            <p>{file.assigned_object}</p>
            <p><span className="red-stamp">FILED</span></p>
          </div>
        </article>

        <article className="old-shell regular-module">
          <div className="old-header">Favorite Light</div>
          <div className="old-body">
            <p>{file.favorite_light}</p>
            <p className="regular-light-swatch">{themeLabel(file.theme)}</p>
          </div>
        </article>

        <article className="old-shell regular-module span-2">
          <div className="old-header">Pinned Evidence</div>
          <div className="old-body regular-pinned-grid">
            {pinned.length ? pinned.map((artifact) => (
              <div className="regular-artifact" key={artifact.slug}>
                <p>{artifact.stamp}</p>
                <h3>{artifact.title}</h3>
                <small>{artifact.description}</small>
              </div>
            )) : <p>No artifacts pinned yet. The drawer is still making up its mind.</p>}
          </div>
        </article>

        <article className="old-shell regular-module">
          <div className="old-header">Top Rooms</div>
          <div className="old-body">
            <ul>
              {(file.top_links ?? []).map((link) => <li key={link}><a href={link}>{link}</a></li>)}
            </ul>
          </div>
        </article>

        <article className="old-shell regular-module">
          <div className="old-header">Top 8 Regulars</div>
          <div className="old-body">
            <TopEightGrid />
            <AddToTopEightButton handle={handle} displayName={file.display_name} />
          </div>
        </article>

        <article className="old-shell regular-module span-2">
          <div className="old-header">Guestbook</div>
          <div className="old-body">
            <ProfileGuestbook
              targetKey={handle}
              contextLabel={`@${handle}'s file`}
              selfHandle={handle}
            />
          </div>
        </article>

        <article className="old-shell regular-module">
          <div className="old-header">SleepNet Pages</div>
          <div className="old-body">
            <p>Nothing published yet. The internet underneath the internet is waiting.</p>
            <a href="/sleepnet">Visit SleepNet</a>
          </div>
        </article>

        <article className="old-shell regular-module">
          <div className="old-header">Create Page</div>
          <div className="old-body">
            <p>Next: build a fake company, object archive, motel page, or other small website from the Locker.</p>
            <a className="old-button" href="/sleepnet/create">Create SleepNet Page</a>
          </div>
        </article>
      </div>
    </section>
  );
}
