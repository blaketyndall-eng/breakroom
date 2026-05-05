import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import {
  SLEEPNET_NEIGHBORHOODS,
  SLEEPNET_PROMPT_EXAMPLES,
  generateFauxCompanyDraft,
  getMySleepNetSiteBySlug,
  labelSleepNetValue,
  loadLocalSleepNetDraft,
  makeSleepNetProtocolUrl,
  makeSleepNetUrl,
  normalizeSleepNetSlug,
  saveMySleepNetSite,
} from '@/lib/sleepnetSites';
import type { SleepNetSection, SleepNetSite } from '@/lib/sleepnetSites';

function sectionText(sections: SleepNetSection[]) {
  return sections.map((section) => `${section.title}\n${section.body}`).join('\n\n---\n\n');
}

function parseSections(value: string): SleepNetSection[] {
  return value
    .split(/\n\s*---\s*\n/g)
    .map((chunk) => {
      const [title, ...body] = chunk.split('\n');
      return { title: title?.trim() || 'Untitled Section', body: body.join('\n').trim() || 'No explanation was filed.' };
    })
    .filter((section) => section.title || section.body)
    .slice(0, 8);
}

function getQuerySlug() {
  if (typeof window === 'undefined') return '';
  return normalizeSleepNetSlug(new URLSearchParams(window.location.search).get('slug') ?? '');
}

export default function SleepNetSiteEditor() {
  const [prompt, setPrompt] = useState(SLEEPNET_PROMPT_EXAMPLES[0]);
  const [site, setSite] = useState<SleepNetSite>(() => generateFauxCompanyDraft(SLEEPNET_PROMPT_EXAMPLES[0]));
  const [sections, setSections] = useState(sectionText(site.sections));
  const [status, setStatus] = useState('Describe something badly. The directory will make it worse in a useful way.');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const querySlug = getQuerySlug();
      const existing = querySlug ? await getMySleepNetSiteBySlug(querySlug) : loadLocalSleepNetDraft();
      if (existing) {
        setSite(existing);
        setPrompt(existing.description ?? SLEEPNET_PROMPT_EXAMPLES[0]);
        setSections(sectionText(existing.sections));
        setStatus(querySlug ? `Loaded ${makeSleepNetProtocolUrl(existing.slug)} for editing.` : 'Loaded local unfinished SleepNet page.');
      }
    }

    load().catch(() => setStatus('Could not load that SleepNet page. Starting from a blank drawer.'));
  }, []);

  function update<K extends keyof SleepNetSite>(key: K, value: SleepNetSite[K]) {
    setSite((current) => {
      const next = { ...current, [key]: value };
      if (key === 'title') next.slug = normalizeSleepNetSlug(String(value));
      return next;
    });
  }

  function generateDraft(seed = prompt) {
    const next = generateFauxCompanyDraft(seed);
    setSite(next);
    setSections(sectionText(next.sections));
    setStatus('Draft generated. Edit before putting it on the wire.');
  }

  async function save(status: 'draft' | 'published') {
    setIsSaving(true);
    try {
      const next = {
        ...site,
        sections: parseSections(sections),
        status,
        is_public: status === 'published',
      };
      const result = await saveMySleepNetSite(next);
      if (result.source === 'none' || !result.site) {
        setStatus(result.source === 'none' ? result.reason : 'SleepNet did not return a saved page.');
        return;
      }
      setSite(result.site);
      setStatus(result.source === 'supabase'
        ? `Saved ${makeSleepNetProtocolUrl(result.site.slug)} as ${status}.`
        : `Saved locally as ${status}. Sign in to put this page fully on the wire.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'SleepNet rejected the page.');
    } finally {
      setIsSaving(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    save('draft');
  }

  return (
    <form className="old-shell sleepnet-editor" onSubmit={handleSubmit}>
      <div className="old-header">SleepNet Create / Faux Company / Put It On The Wire</div>
      <div className="old-body">
        <p className="memo-box">{status}</p>
        <div className="sleepnet-prompt-examples">
          <p className="regular-kicker">Prompt scraps</p>
          {SLEEPNET_PROMPT_EXAMPLES.map((example) => (
            <button key={example} type="button" className="sleepnet-example" onClick={() => { setPrompt(example); generateDraft(example); }}>
              {example}
            </button>
          ))}
        </div>
        <label>Describe it badly
          <textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} />
        </label>
        <p><button type="button" className="old-button" onClick={() => generateDraft()}>Generate Faux Company Draft</button></p>

        <div className="sleepnet-editor-grid">
          <label>Title
            <input value={site.title} onChange={(event) => update('title', event.target.value)} />
          </label>
          <label>SleepNet URL
            <input value={site.slug} onChange={(event) => update('slug', normalizeSleepNetSlug(event.target.value))} />
          </label>
          <label>Neighborhood
            <select value={site.neighborhood} onChange={(event) => update('neighborhood', event.target.value)}>
              {SLEEPNET_NEIGHBORHOODS.map((item) => <option key={item} value={item}>{labelSleepNetValue(item)}</option>)}
            </select>
          </label>
        </div>

        <label>Tagline
          <input value={site.tagline ?? ''} onChange={(event) => update('tagline', event.target.value)} />
        </label>
        <label>Description
          <textarea value={site.description ?? ''} onChange={(event) => update('description', event.target.value)} />
        </label>
        <label>Sections / separate with ---
          <textarea value={sections} onChange={(event) => setSections(event.target.value)} />
        </label>

        <div className="regular-public-strip">
          <span>SleepNet URL: {makeSleepNetProtocolUrl(site.slug)}</span>
          <a href={makeSleepNetUrl(site.slug)}>Preview {makeSleepNetUrl(site.slug)}</a>
        </div>

        <p>
          <button className="old-button" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Draft'}</button>{' '}
          <button type="button" className="old-button" disabled={isSaving} onClick={() => save('published')}>Publish SleepNet URL</button>
        </p>
      </div>
    </form>
  );
}
