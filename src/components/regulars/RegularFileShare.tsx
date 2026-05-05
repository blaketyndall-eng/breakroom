import { useMemo, useState } from 'react';

export default function RegularFileShare({ handle }: { handle: string }) {
  const [status, setStatus] = useState('copy link');
  const href = useMemo(() => {
    if (typeof window === 'undefined') return `/regulars/${handle}`;
    return `${window.location.origin}/regulars/${handle}`;
  }, [handle]);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(href);
      setStatus('copied to clipboard');
      window.setTimeout(() => setStatus('copy link'), 2400);
    } catch {
      setStatus('copy failed / select link');
    }
  }

  return (
    <div className="regular-share-box">
      <p className="regular-kicker">Share File</p>
      <input value={href} readOnly aria-label="Regular File share URL" />
      <button className="old-button" type="button" onClick={copyLink}>{status}</button>
    </div>
  );
}
