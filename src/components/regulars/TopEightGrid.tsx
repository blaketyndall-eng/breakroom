import { useState, useEffect } from 'react';
import { getTopEight, getDefaultTopEight, removeFromTopEight } from '@/lib/topEight';
import type { TopEightEntry } from '@/lib/topEight';

type Props = {
  editable?: boolean;
  previewMode?: boolean;
};

export default function TopEightGrid({ editable = false, previewMode = false }: Props) {
  const [entries, setEntries] = useState<TopEightEntry[]>([]);

  useEffect(() => {
    const saved = getTopEight();
    setEntries(saved.length > 0 ? saved : getDefaultTopEight());
  }, []);

  function handleRemove(handle: string) {
    removeFromTopEight(handle);
    const updated = getTopEight();
    setEntries(updated.length > 0 ? updated : getDefaultTopEight());
  }

  const emptySlots = 8 - entries.length;

  return (
    <div className="top-eight-grid">
      {entries.map((entry) => (
        <div key={entry.handle} className="top-eight-slot">
          <a href={`/regulars/${entry.handle}`} className="top-eight-link">
            <span className="top-eight-name">{entry.displayName}</span>
          </a>
          {editable && !previewMode && (
            <button
              className="top-eight-remove"
              onClick={() => handleRemove(entry.handle)}
              title="Remove from Top 8"
              type="button"
            >
              x
            </button>
          )}
          {entry.note && <span className="top-eight-note">{entry.note}</span>}
        </div>
      ))}
      {Array.from({ length: emptySlots }).map((_, i) => (
        <div key={`empty-${i}`} className="top-eight-slot top-eight-empty">
          <span className="top-eight-name">---</span>
        </div>
      ))}
    </div>
  );
}
