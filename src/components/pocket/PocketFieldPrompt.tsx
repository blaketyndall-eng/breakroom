import { useState, useEffect } from 'react';
import {
  getTodaysPrompt,
  completeFieldPrompt,
  isTodaysPromptCompleted,
  getFieldPromptCount,
  type FieldPrompt,
} from '@/lib/fieldPrompts';

/**
 * PocketFieldPrompt — the daily micro-task widget.
 * Renders in the bump zone. One prompt per day.
 * Research: fortune cookie, Daily Challenge, confession booth.
 *
 * States: loading → prompt (with input) → submitted → already-completed
 * Submitted state shows the response receipt-style, no undo.
 */

export default function PocketFieldPrompt() {
  const [prompt, setPrompt] = useState<FieldPrompt | null>(null);
  const [completed, setCompleted] = useState(false);
  const [response, setResponse] = useState('');
  const [submittedResponse, setSubmittedResponse] = useState('');
  const [totalCount, setTotalCount] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const done = isTodaysPromptCompleted();
    setCompleted(done);
    setTotalCount(getFieldPromptCount());

    if (!done) {
      const todaysPrompt = getTodaysPrompt();
      setPrompt(todaysPrompt);
    }
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt || !response.trim() || submitting) return;

    setSubmitting(true);

    // Haptic pulse on submit (subtle, 10ms)
    if ('vibrate' in navigator) {
      try { navigator.vibrate(10); } catch {}
    }

    // Small delay for the receipt-printing feel
    setTimeout(() => {
      completeFieldPrompt(prompt.id, response.trim(), prompt);
      setSubmittedResponse(response.trim());
      setCompleted(true);
      setTotalCount(prev => prev + 1);
      setSubmitting(false);
    }, 300);
  }

  // Already completed today — quiet confirmation
  if (completed && !submittedResponse) {
    return (
      <div className="pocket-field">
        <div className="pocket-field-frame">FIELD REPORT FILED</div>
        <div className="pocket-field-done">
          Today's report is in. {totalCount > 1 ? `${totalCount} total on file.` : 'First one on file.'}
        </div>
      </div>
    );
  }

  // Just submitted — receipt confirmation
  if (completed && submittedResponse) {
    return (
      <div className="pocket-field">
        <div className="pocket-field-frame">REPORT RECEIVED</div>
        <div className="pocket-field-receipt">
          <div className="pocket-field-receipt-response">"{submittedResponse}"</div>
          <div className="pocket-field-receipt-meta">
            filed · {totalCount} total on record
          </div>
        </div>
      </div>
    );
  }

  // Loading
  if (!prompt) {
    return (
      <div className="pocket-field">
        <div className="pocket-field-frame">FIELD OBSERVATION REQUESTED</div>
        <div className="pocket-field-loading">Retrieving assignment...</div>
      </div>
    );
  }

  // Active prompt
  return (
    <div className="pocket-field">
      <div className="pocket-field-frame">{prompt.frame}</div>
      <div className="pocket-field-text">{prompt.text}</div>
      <form className="pocket-field-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="pocket-field-input"
          placeholder="one line. that's all."
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          maxLength={280}
          autoComplete="off"
          disabled={submitting}
        />
        <button
          type="submit"
          className="pocket-field-submit"
          disabled={!response.trim() || submitting}
        >
          {submitting ? '...' : 'File'}
        </button>
      </form>
    </div>
  );
}
