import { useState, useEffect } from 'react';
import { getNowPlaying, getRadioFeed } from '@/lib/radio';

/**
 * PocketRadioLine — single current transmission from Radio 1:47.
 * Shows just one line — the most recent broadcast. Tap to visit radio.
 * Research: radio station one-liners, ticker tape, bar TV captions.
 */

export default function PocketRadioLine() {
  const [line, setLine] = useState<string>('');
  const [source, setSource] = useState<string>('');

  useEffect(() => {
    const nowPlaying = getNowPlaying();
    if (nowPlaying) {
      setLine(nowPlaying.body || nowPlaying.title);
      setSource(nowPlaying.host || 'radio 1:47');
    } else {
      // Fallback: grab most recent feed entry
      const feed = getRadioFeed(1);
      if (feed.length > 0) {
        setLine(feed[0].body || feed[0].title);
        setSource(feed[0].host || 'radio 1:47');
      } else {
        setLine('Static. The station is between thoughts.');
        setSource('radio 1:47');
      }
    }
  }, []);

  return (
    <div className="pocket-radio">
      <div className="pocket-section-header">Radio 1:47</div>
      <a href="/radio" style={{ textDecoration: 'none' }}>
        <div className="pocket-radio-line">{line}</div>
        <div className="pocket-radio-source">{source}</div>
      </a>
    </div>
  );
}
