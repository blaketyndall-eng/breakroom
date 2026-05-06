import { useState, useEffect } from 'react';
import {
  getRandomTemplate,
  submitCreation,
  getRemainingToday,
  canCreateToday,
  type MakeTemplate,
  type Creation,
} from '@/lib/makeTemplates';
import {
  generateShareCard,
  shareViaWebAPI,
  copyPermalink,
  canShare,
  type ShareCardData,
} from '@/lib/shareCard';

/**
 * PocketMakePrompt — the "Make One Thing" creation screen.
 * One template, one field, one tap. No drafts. No preview. No editing.
 * Research: confession booth, gashapon, polaroid camera.
 *
 * States: loading → create → submitting → share-receipt → limit-reached
 */

export default function PocketMakePrompt() {
  const [template, setTemplate] = useState<MakeTemplate | null>(null);
  const [content, setContent] = useState('');
  const [remaining, setRemaining] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // Post-creation state
  const [creation, setCreation] = useState<Creation | null>(null);
  const [shareCard, setShareCard] = useState<ShareCardData | null>(null);
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  useEffect(() => {
    const r = getRemainingToday();
    setRemaining(r);
    if (r > 0) {
      setTemplate(getRandomTemplate());
    }
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!template || !content.trim() || submitting) return;

    setSubmitting(true);

    // Haptic pulse
    if ('vibrate' in navigator) {
      try { navigator.vibrate(15); } catch {}
    }

    // Receipt-printing delay
    setTimeout(() => {
      const newCreation = submitCreation(template, content.trim());
      if (!newCreation) {
        // Limit hit between load and submit
        setRemaining(0);
        setSubmitting(false);
        return;
      }

      const newRemaining = getRemainingToday();
      setRemaining(newRemaining);
      setCreation(newCreation);
      setShareCard(generateShareCard(newCreation, newRemaining));
      setSubmitting(false);
    }, 400);
  }

  async function handleShare() {
    if (!shareCard) return;
    const success = await shareViaWebAPI(shareCard);
    if (success) setShared(true);
  }

  async function handleCopy() {
    if (!shareCard) return;
    const success = await copyPermalink(shareCard.url);
    if (success) setCopied(true);
  }

  function handleDismiss() {
    // Reset for another creation or go back
    if (remaining > 0) {
      setCreation(null);
      setShareCard(null);
      setCopied(false);
      setShared(false);
      setContent('');
      setTemplate(getRandomTemplate());
    } else {
      window.location.href = '/pocket';
    }
  }

  function handleNewTemplate() {
    setTemplate(getRandomTemplate());
    setContent('');
  }

  // --- Limit reached ---
  if (remaining <= 0 && !creation) {
    return (
      <div className="pocket-make">
        <div className="pocket-make-frame">DAILY LIMIT REACHED</div>
        <div className="pocket-make-limit">
          The room accepted 3 filings today. That's the limit.
          <br />Come back tomorrow. The room will still be here.
        </div>
        <a href="/pocket" className="pocket-make-back">← Back to Pocket</a>
      </div>
    );
  }

  // --- Share receipt (post-creation) ---
  if (creation && shareCard) {
    return (
      <div className="pocket-make">
        <div className="pocket-make-frame">FILED</div>

        {shareCard.factionStamp && (
          <div className="pocket-make-stamp">{shareCard.factionStamp}</div>
        )}

        <div className="pocket-make-receipt">
          <div className="pocket-make-receipt-type">
            {creation.type.replace(/_/g, ' ').toUpperCase()}
          </div>
          <div className="pocket-make-receipt-content">"{creation.content}"</div>
          <div className="pocket-make-receipt-meta">
            {shareCard.attribution} · {new Date(creation.createdAt).toLocaleDateString()}
          </div>
        </div>

        <div className="pocket-make-filed-copy">
          {shareCard.filedCopy} {shareCard.remainingCopy}
        </div>

        <div className="pocket-make-actions">
          {canShare() && (
            <button
              className="pocket-make-btn primary"
              onClick={handleShare}
              disabled={shared}
            >
              {shared ? 'Shared' : shareCard.shareLabel}
            </button>
          )}
          <button
            className="pocket-make-btn"
            onClick={handleCopy}
            disabled={copied}
          >
            {copied ? 'Copied' : 'Copy link'}
          </button>
          <button className="pocket-make-btn dim" onClick={handleDismiss}>
            {remaining > 0 ? 'Make another' : shareCard.dismissLabel}
          </button>
        </div>
      </div>
    );
  }

  // --- Loading ---
  if (!template) {
    return (
      <div className="pocket-make">
        <div className="pocket-make-frame">MAKE ONE THING</div>
        <div className="pocket-make-loading">Selecting assignment...</div>
      </div>
    );
  }

  // --- Creation form ---
  return (
    <div className="pocket-make">
      <div className="pocket-make-frame">MAKE ONE THING</div>
      <div className="pocket-make-remaining">{remaining} remaining today</div>

      <div className="pocket-make-type">{template.label}</div>
      <div className="pocket-make-prompt">{template.prompt}</div>

      <form className="pocket-make-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="pocket-make-input"
          placeholder={template.placeholder}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={280}
          autoComplete="off"
          autoFocus
          disabled={submitting}
        />
        <button
          type="submit"
          className="pocket-make-submit"
          disabled={!content.trim() || submitting}
        >
          {submitting ? 'Filing...' : 'File It'}
        </button>
      </form>

      <button className="pocket-make-shuffle" onClick={handleNewTemplate} type="button">
        Different prompt →
      </button>

      <a href="/pocket" className="pocket-make-back">← Back to Pocket</a>
    </div>
  );
}
