import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { getTopEight, addToTopEight, removeFromTopEight, reorderTopEight, SEEDED_REGULARS } from '@/lib/topEight';
import type { TopEightEntry } from '@/lib/topEight';

export default function TopEightEditor() {
  const [entries, setEntries] = useState<TopEightEntry[]>([]);
  const [newHandle, setNewHandle] = useState('');
  const [newName, setNewName] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setEntries(getTopEight());
  }, []);

  function refresh() {
    setEntries(getTopEight());
  }

  function handleAdd(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const handle = newHandle.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    const displayName = newName.trim() || handle;

    if (!handle) return;

    const result = addToTopEight({ handle, displayName });
    if (result) {
      setMessage(`Added ${displayName}.`);
      setNewHandle('');
      setNewName('');
      refresh();
    } else if (entries.length >= 8) {
      setMessage('Top 8 is full. Remove someone first.');
    } else {
      setMessage('Already in your Top 8.');
    }

    setTimeout(() => setMessage(null), 3000);
  }

  function handleRemove(handle: string) {
    removeFromTopEight(handle);
    refresh();
    setMessage('Removed.');
    setTimeout(() => setMessage(null), 2500);
  }

  function handleMoveUp(index: number) {
    if (index === 0) return;
    const handles = entries.map((e) => e.handle);
    [handles[index - 1], handles[index]] = [handles[index], handles[index - 1]];
    reorderTopEight(handles);
    refresh();
  }

  function handleMoveDown(index: number) {
    if (index >= entries.length - 1) return;
    const handles = entries.map((e) => e.handle);
    [handles[index], handles[index + 1]] = [handles[index + 1], handles[index]];
    reorderTopEight(handles);
    refresh();
  }

  function handleAddSeeded(handle: string, displayName: string) {
    const result = addToTopEight({ handle, displayName });
    if (result) {
      setMessage(`Added ${displayName}.`);
      refresh();
    } else {
      setMessage('Already there or full.');
    }
    setTimeout(() => setMessage(null), 2500);
  }

  const availableSeeded = SEEDED_REGULARS.filter(
    (r) => !entries.some((e) => e.handle === r.handle)
  );

  return (
    <div className="top-eight-editor">
      <h3 className="editor-section-label">Your Top 8</h3>

      {entries.length === 0 && (
        <p className="top-eight-empty-msg">Nobody in your Top 8 yet. Add people below.</p>
      )}

      <div className="top-eight-editor-list">
        {entries.map((entry, i) => (
          <div key={entry.handle} className="top-eight-editor-row">
            <span className="top-eight-editor-pos">{i + 1}.</span>
            <span className="top-eight-editor-name">{entry.displayName}</span>
            <span className="top-eight-editor-handle">@{entry.handle}</span>
            <div className="top-eight-editor-actions">
              <button type="button" onClick={() => handleMoveUp(i)} disabled={i === 0}>↑</button>
              <button type="button" onClick={() => handleMoveDown(i)} disabled={i >= entries.length - 1}>↓</button>
              <button type="button" onClick={() => handleRemove(entry.handle)} className="remove-btn">x</button>
            </div>
          </div>
        ))}
      </div>

      {entries.length < 8 && (
        <>
          <form className="top-eight-add-form" onSubmit={handleAdd}>
            <input
              type="text"
              value={newHandle}
              onChange={(e) => setNewHandle(e.target.value)}
              placeholder="handle"
              maxLength={32}
            />
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="display name (optional)"
              maxLength={40}
            />
            <button className="old-button" type="submit">Add</button>
          </form>

          {availableSeeded.length > 0 && (
            <div className="top-eight-suggestions">
              <p className="suggestion-label">Known around here:</p>
              <div className="suggestion-chips">
                {availableSeeded.slice(0, 6).map((r) => (
                  <button
                    key={r.handle}
                    type="button"
                    className="suggestion-chip"
                    onClick={() => handleAddSeeded(r.handle, r.displayName)}
                  >
                    + {r.displayName}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {message && <p className="top-eight-feedback">{message}</p>}
    </div>
  );
}
