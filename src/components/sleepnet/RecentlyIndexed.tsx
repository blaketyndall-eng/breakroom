import { makeSleepNetUrl } from '@/lib/sleepnetSites';
import type { SleepNetSite } from '@/lib/sleepnetSites';

type Props = {
  sites: SleepNetSite[];
};

export default function RecentlyIndexed({ sites }: Props) {
  if (!sites.length) {
    return (
      <section className="old-shell recently-indexed">
        <div className="old-header">Recently Indexed / Empty</div>
        <div className="old-body">
          <p>The crawler found nothing new. Or it found too much and panicked.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="old-shell recently-indexed">
      <div className="old-header">Recently Indexed / {sites.length} URL(s)</div>
      <div className="old-body">
        <ul className="recently-indexed-list">
          {sites.map((site) => (
            <li key={site.slug}>
              <a href={makeSleepNetUrl(site.slug)}>{site.title}</a>
              <span className="recently-indexed-meta">
                {site.site_type.replaceAll('_', ' ')} / {site.neighborhood.replaceAll('_', ' ')}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
