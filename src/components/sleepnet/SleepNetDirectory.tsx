import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { makeSleepNetUrl, searchSleepNetSites } from '@/lib/sleepnetSites';
import type { SleepNetSite } from '@/lib/sleepnetSites';
import { checkSearchPhraseTrigger, unlockDoor } from '@/lib/hiddenDoors';
import type { HiddenDoor } from '@/lib/hiddenDoors';
import { recordSearchAppearance } from '@/lib/promotionSignals';

export default function SleepNetDirectory() {
  const [query, setQuery] = useState('');
  const [sites, setSites] = useState<SleepNetSite[]>([]);
  const [status, setStatus] = useState('Indexing SleepNet pages...');
  const [doorMessage, setDoorMessage] = useState<{ door: HiddenDoor; isNew: boolean } | null>(null);

  async function runSearch(nextQuery = query) {
    const results = await searchSleepNetSites(nextQuery);
    setSites(results);
    setStatus(results.length ? `${results.length} SleepNet URL(s) found.` : 'No SleepNet URLs found. The directory coughed and looked away.');

    // Record search appearances for promotion signals (only for active searches)
    if (nextQuery.trim() && results.length) {
      for (const site of results.slice(0, 5)) {
        recordSearchAppearance(site.slug);
      }
    }

    // Check for hidden door triggers
    if (nextQuery.trim()) {
      const triggeredDoor = checkSearchPhraseTrigger(nextQuery);
      if (triggeredDoor) {
        const { isNew } = unlockDoor(triggeredDoor.slug);
        setDoorMessage({ door: triggeredDoor, isNew });
      } else {
        setDoorMessage(null);
      }
    } else {
      setDoorMessage(null);
    }
  }

  useEffect(() => {
    runSearch('').catch(() => setStatus('SleepNet directory could not be reached.'));
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    runSearch().catch(() => setStatus('Search failed. Try a worse keyword.'));
  }

  return (
    <section className="old-shell sleepnet-directory">
      <div className="old-header">SleepNet Directory / Searchable URLs / Not A Feed</div>
      <div className="old-body">
        <form className="sleepnet-search" onSubmit={handleSubmit}>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="search fake companies, motel pages, object archives..." />
          <button className="old-button">Search SleepNet</button>
        </form>
        <p className="memo-box">{status}</p>

        {doorMessage && (
          <div className={`door-reveal ${doorMessage.isNew ? 'door-new' : 'door-known'}`}>
            <p className="door-reveal-header">{doorMessage.isNew ? 'A door moved.' : 'Door already open.'}</p>
            <p className="door-reveal-title">{doorMessage.door.reward.title}</p>
            {doorMessage.door.reward.body && <p>{doorMessage.door.reward.body}</p>}
            {doorMessage.door.reward.href && (
              <p><a className="old-button" href={doorMessage.door.reward.href}>
                {doorMessage.door.reward.isExternal ? 'Follow Link (External)' : 'Enter'}
              </a></p>
            )}
          </div>
        )}

        <div className="sleepnet-results">
          {sites.map((site) => (
            <article className="sleepnet-card" key={site.slug}>
              <p className="sleepnet-url">sleepnet://{site.slug}</p>
              <h2><a href={makeSleepNetUrl(site.slug)}>{site.title}</a></h2>
              <p>{site.tagline}</p>
              <p>{site.description}</p>
              <div className="sleepnet-meta">
                <span>{site.site_type.replaceAll('_', ' ')}</span>
                <span>{site.neighborhood.replaceAll('_', ' ')}</span>
                <span>{site.theme.replaceAll('_', ' ')}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
