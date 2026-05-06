import { ARTIFACTS } from '@/lib/artifacts';
import RegularFileShare from '@/components/regulars/RegularFileShare';
import TopEightGrid from '@/components/regulars/TopEightGrid';
import AddToTopEightButton from '@/components/regulars/AddToTopEightButton';
import type { RegularFile } from '@/lib/regularFiles';

function themeLabel(theme: string) {
  return theme.replaceAll('_', ' ');
}

export default function RegularFileView({ file }: { file: RegularFile }) {
  const pinned = ARTIFACTS.filter((artifact) => file.pinned_artifacts?.includes(artifact.slug));
  const handle = file.handle;

  return (
    <section className={`regular-file regular-theme-${file.theme}`}>
      <div className="regular-header">
        <div>
          <p className="regular-kicker">Regular File / Public Locker</p>
          <h1>{file.display_name}</h1>
          <p>{file.fake_title}</p>
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
            <p className="visitor-counter">000{String(handle.length * 47).padStart(3, '0')}</p>
            <p>Count is approximate. The counter lies when watched.</p>
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

        <article className="old-shell regular-module">
          <div className="old-header">Guestbook</div>
          <div className="old-body">
            <p><b>Room Hand:</b> nice file. bad lighting. correct.</p>
            <p><b>Unknown:</b> sign mine after midnight.</p>
            <button className="old-button" type="button">Guestbook soon</button>
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
