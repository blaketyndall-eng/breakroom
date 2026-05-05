import { useEffect, useMemo, useState } from 'react';
import {
  getMySleepNetSites,
  labelSleepNetValue,
  makeSleepNetProtocolUrl,
  makeSleepNetUrl,
  removeMySleepNetSite,
  updateMySleepNetSiteStatus,
} from '@/lib/sleepnetSites';
import type { SleepNetSite } from '@/lib/sleepnetSites';

export default function SleepNetOwnerDashboard() {
  const [sites, setSites] = useState<SleepNetSite[]>([]);
  const [status, setStatus] = useState('Opening Back Office...');
  const [busySlug, setBusySlug] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'draft' | 'published' | 'hidden'>('all');

  async function loadSites() {
    const results = await getMySleepNetSites();
    setSites(results);
    setStatus(results.length ? `${results.length} SleepNet page(s) found in your drawer.` : 'No SleepNet pages yet. Create one before the internet closes.');
  }

  useEffect(() => {
    loadSites().catch(() => setStatus('Back Office could not open the SleepNet drawer.'));
  }, []);

  const counts = useMemo(() => ({
    all: sites.length,
    draft: sites.filter((site) => site.status === 'draft').length,
    published: sites.filter((site) => site.status === 'published').length,
    hidden: sites.filter((site) => site.status === 'hidden').length,
  }), [sites]);

  const visibleSites = useMemo(() => (
    filter === 'all' ? sites : sites.filter((site) => site.status === filter)
  ), [filter, sites]);

  async function setSiteStatus(slug: string, nextStatus: 'draft' | 'published' | 'hidden') {
    setBusySlug(slug);
    try {
      await updateMySleepNetSiteStatus(slug, nextStatus);
      await loadSites();
      setStatus(`Updated ${makeSleepNetProtocolUrl(slug)} to ${nextStatus}.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Could not update SleepNet page.');
    } finally {
      setBusySlug(null);
    }
  }

  async function removeSite(slug: string) {
    setBusySlug(slug);
    try {
      await removeMySleepNetSite(slug);
      await loadSites();
      setStatus(`${makeSleepNetProtocolUrl(slug)} was removed from the wire.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Could not remove SleepNet page.');
    } finally {
      setBusySlug(null);
    }
  }

  return (
    <section className="old-shell sleepnet-owner-dashboard">
      <div className="old-header">Back Office / SleepNet Pages / Owner Drawer</div>
      <div className="old-body">
        <p className="memo-box">{status}</p>
        <div className="sleepnet-owner-toolbar">
          <a className="old-button" href="/sleepnet/create">Create New SleepNet Page</a>
          {(['all', 'draft', 'published', 'hidden'] as const).map((item) => (
            <button key={item} className={filter === item ? 'old-button sleepnet-filter active' : 'old-button sleepnet-filter'} type="button" onClick={() => setFilter(item)}>
              {item} / {counts[item]}
            </button>
          ))}
        </div>
        <div className="sleepnet-owner-list">
          {visibleSites.map((site) => (
            <article className={`sleepnet-owner-card status-${site.status}`} key={site.slug}>
              <p className="sleepnet-url">{makeSleepNetProtocolUrl(site.slug)}</p>
              <h2>{site.title}</h2>
              <p>{site.tagline}</p>
              <p>{site.description}</p>
              <div className="sleepnet-meta">
                <span>{site.status}</span>
                <span>{site.is_public ? 'public' : 'private'}</span>
                <span>{labelSleepNetValue(site.neighborhood)}</span>
              </div>
              <div className="sleepnet-owner-actions">
                <a className="old-button" href={makeSleepNetUrl(site.slug)}>View</a>
                <a className="old-button" href={`/sleepnet/create?slug=${site.slug}`}>Edit</a>
                <button className="old-button" disabled={busySlug === site.slug || site.status === 'published'} onClick={() => setSiteStatus(site.slug, 'published')}>Publish</button>
                <button className="old-button" disabled={busySlug === site.slug || site.status === 'hidden'} onClick={() => setSiteStatus(site.slug, 'hidden')}>Hide</button>
                <button className="old-button danger" disabled={busySlug === site.slug} onClick={() => removeSite(site.slug)}>Remove</button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
