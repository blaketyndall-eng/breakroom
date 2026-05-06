import type { Creation } from '@/lib/makeTemplates';

/**
 * PocketShareCard — visual preview of a creation.
 * Receipt-paper style, monospace, faction-stamped.
 * Used in share confirmation and permalink pages.
 * This is the marketing — every shared creation is an invite.
 */

type Props = {
  creation: Creation;
};

const TYPE_LABELS: Record<string, string> = {
  fake_ad: 'FAKE AD',
  object_listing: 'OBJECT',
  rumor: 'RUMOR',
  classified: 'CLASSIFIED',
  guestbook_line: 'GUESTBOOK ENTRY',
  agent_quote: 'AGENT QUOTE',
  pool_hall_classified: 'POOL HALL CLASSIFIED',
  lot_listing: 'LOT LISTING',
  bar_napkin_note: 'BAR NAPKIN NOTE',
  fence_posting: 'FENCE POSTING',
  open_field_report: 'OPEN FIELD REPORT',
};

const FACTION_STAMPS: Record<string, string> = {
  'the-players': 'FILED VIA THE PLAYERS',
  'lot-racers': 'LOT RACERS DISPATCH',
  'night-drinkers': 'SLID DOWN THE BAR',
  'the-smokers': 'POSTED TO THE FENCE',
  'cowboys': 'OPEN FIELD FILING',
};

export default function PocketShareCard({ creation }: Props) {
  const typeLabel = TYPE_LABELS[creation.type] || 'FILING';
  const stamp = creation.factionSlug ? FACTION_STAMPS[creation.factionSlug] : null;
  const date = new Date(creation.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="share-card">
      <div className="share-card-header">
        <span className="share-card-type">{typeLabel}</span>
        <span className="share-card-date">{date}</span>
      </div>

      <div className="share-card-content">
        {creation.content}
      </div>

      <div className="share-card-footer">
        <span className="share-card-attribution">
          {creation.handle !== 'unknown employee'
            ? `Filed by ${creation.handle}`
            : 'Source: unknown'}
        </span>
        {stamp && <span className="share-card-stamp">{stamp}</span>}
      </div>

      <div className="share-card-brand">
        the breakroom · after-hours internet
      </div>
    </div>
  );
}
