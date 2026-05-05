import { makeSleepNetUrl } from '@/lib/sleepnetSites';
import type { SleepNetSite } from '@/lib/sleepnetSites';

type Props = {
  site: SleepNetSite | null;
};

export default function SiteOfTheNight({ site }: Props) {
  if (!site) {
    return (
      <section className="old-shell site-of-the-night">
        <div className="old-header">Site of the Night / Vacant</div>
        <div className="old-body">
          <p>No site selected tonight. The directory is resting.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="old-shell site-of-the-night">
      <div className="old-header">Site of the Night / Featured</div>
      <div className="old-body">
        <p className="sleepnet-url">sleepnet://{site.slug}</p>
        <h3><a href={makeSleepNetUrl(site.slug)}>{site.title}</a></h3>
        {site.tagline && <p className="site-tagline">{site.tagline}</p>}
        <p>{site.description}</p>
        <div className="sleepnet-meta">
          <span>{site.site_type.replaceAll('_', ' ')}</span>
          <span>{site.neighborhood.replaceAll('_', ' ')}</span>
          {site.canonical_weight && site.canonical_weight > 5 && <span className="red-stamp">CANONICAL</span>}
        </div>
      </div>
    </section>
  );
}
