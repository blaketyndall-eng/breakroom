/**
 * ChaosPopups — six interaction-shape components used by CatastropheCascade.
 *
 * Each variant component owns its own state machine and self-dismisses
 * when its bit is over. The cascade just renders <ChaosPopup variant slot/>
 * for each picked popup; the dispatcher routes to the right component.
 *
 * Why one file: the components are small, share imports/styles, and live
 * or die together. Splitting them across six files would add zero value.
 */
import { useEffect, useState, type ReactNode } from 'react';
import type {
  ChaosPopupVariant,
  LoyaltyCardPopupVariant,
  OregonTrailPopupVariant,
  PromptPopupVariant,
  RpsPopupVariant,
  RudePromptPopupVariant,
  StatementPopupVariant,
} from '@/content/data/chaosPopups';

/* ------------------------------------------------------------------------- */
/*  Dispatcher                                                                */
/* ------------------------------------------------------------------------- */

interface ChaosPopupProps {
  variant: ChaosPopupVariant;
  /** Cascade CSS slot 1..8 — drives position + animation-delay. */
  slot: number;
}

export default function ChaosPopup({ variant, slot }: ChaosPopupProps) {
  switch (variant.kind) {
    case 'statement':
      return <StatementPopup variant={variant} slot={slot} />;
    case 'prompt':
      return <PromptPopup variant={variant} slot={slot} />;
    case 'rude-prompt':
      return <RudePromptPopup variant={variant} slot={slot} />;
    case 'rps':
      return <RpsPopup variant={variant} slot={slot} />;
    case 'oregon-trail':
      return <OregonTrailPopup variant={variant} slot={slot} />;
    case 'loyalty-card':
      return <LoyaltyCardPopup variant={variant} slot={slot} />;
  }
}

/* ------------------------------------------------------------------------- */
/*  Shared shell — Win95 chrome wrapper used by every popup body             */
/* ------------------------------------------------------------------------- */

function PopupShell({
  slot,
  title,
  mood,
  closing,
  children,
  bodyClass,
}: {
  slot: number;
  title: string;
  mood?: StatementPopupVariant['mood'];
  closing?: boolean;
  children: ReactNode;
  bodyClass?: string;
}) {
  return (
    <div
      className={`bpc-cascade-item${closing ? ' bpc-cascade-item--closing' : ''}`}
      data-slot={slot}
    >
      <div className="bpc-popup" data-mood={mood ?? null}>
        <div className="bpc-popup-titlebar">
          <span className="bpc-popup-title-text">{title}</span>
          <span className="bpc-popup-x" aria-hidden="true">×</span>
        </div>
        <div className={bodyClass ?? 'bpc-popup-body'}>{children}</div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------- */
/*  StatementPopup — title + body + optional sub + optional image            */
/* ------------------------------------------------------------------------- */

function StatementPopup({
  variant,
  slot,
}: {
  variant: StatementPopupVariant;
  slot: number;
}) {
  const [imageBroken, setImageBroken] = useState(false);
  const showImage = !!variant.imageKey && !imageBroken;

  return (
    <PopupShell slot={slot} title={variant.title} mood={variant.mood}>
      <div className={`bpc-statement bpc-statement--${variant.mood ?? 'lowfi'}`}>
        {showImage && (
          <div className="bpc-statement-photo">
            <img
              src={`/void/${variant.imageKey}.jpg`}
              alt=""
              onError={() => setImageBroken(true)}
            />
          </div>
        )}
        <div className="bpc-statement-text">
          <strong>{variant.body}</strong>
          {variant.sub && <span className="bpc-statement-sub">{variant.sub}</span>}
        </div>
      </div>
    </PopupShell>
  );
}

/* ------------------------------------------------------------------------- */
/*  PromptPopup — body + N choice buttons; click swaps body to response     */
/* ------------------------------------------------------------------------- */

function PromptPopup({
  variant,
  slot,
}: {
  variant: PromptPopupVariant;
  slot: number;
}) {
  const [response, setResponse] = useState<string | null>(null);

  const handlePick = (resp: string) => {
    setResponse(resp);
  };

  return (
    <PopupShell slot={slot} title={variant.title}>
      <div className="bpc-prompt">
        <p className="bpc-prompt-body">
          {response ?? variant.body}
        </p>
        {response === null && (
          <div className="bpc-prompt-buttons">
            {variant.choices.map((c) => (
              <button
                key={c.label}
                type="button"
                className="bpc-prompt-btn"
                onClick={() => handlePick(c.response)}
              >
                <span className="bpc-prompt-btn-arrow" aria-hidden="true">&gt;</span>
                {c.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </PopupShell>
  );
}

/* ------------------------------------------------------------------------- */
/*  RudePromptPopup — any answer fires the same comeback                     */
/* ------------------------------------------------------------------------- */

function RudePromptPopup({
  variant,
  slot,
}: {
  variant: RudePromptPopupVariant;
  slot: number;
}) {
  const [picked, setPicked] = useState(false);

  return (
    <PopupShell slot={slot} title={variant.title}>
      <div className="bpc-prompt">
        <p className="bpc-prompt-body">
          {picked ? variant.comeback : variant.body}
        </p>
        {!picked && (
          <div className="bpc-prompt-buttons">
            {variant.choices.map((label) => (
              <button
                key={label}
                type="button"
                className="bpc-prompt-btn"
                onClick={() => setPicked(true)}
              >
                <span className="bpc-prompt-btn-arrow" aria-hidden="true">&gt;</span>
                {label}
              </button>
            ))}
          </div>
        )}
      </div>
    </PopupShell>
  );
}

/* ------------------------------------------------------------------------- */
/*  RpsPopup — rigged rock-paper-scissors. Computer always picks rock.        */
/* ------------------------------------------------------------------------- */

type RpsChoice = 'rock' | 'paper' | 'scissors';

function RpsPopup({
  variant,
  slot,
}: {
  variant: RpsPopupVariant;
  slot: number;
}) {
  const [pick, setPick] = useState<RpsChoice | null>(null);

  return (
    <PopupShell slot={slot} title={variant.title}>
      <div className="bpc-rps">
        {pick === null ? (
          <>
            <p className="bpc-rps-body">{variant.body}</p>
            <div className="bpc-rps-buttons">
              <RpsButton choice="rock" onPick={setPick} />
              <RpsButton choice="paper" onPick={setPick} />
              <RpsButton choice="scissors" onPick={setPick} />
            </div>
          </>
        ) : (
          <div className="bpc-rps-result">
            <p className="bpc-rps-row">
              <span className="bpc-rps-label">you:</span>
              <RpsGlyph choice={pick} />
            </p>
            <p className="bpc-rps-row">
              <span className="bpc-rps-label">me:</span>
              <RpsGlyph choice="rock" />
            </p>
            <p className="bpc-rps-verdict">{variant.verdict}</p>
          </div>
        )}
      </div>
    </PopupShell>
  );
}

function RpsButton({
  choice,
  onPick,
}: {
  choice: RpsChoice;
  onPick: (c: RpsChoice) => void;
}) {
  return (
    <button
      type="button"
      className="bpc-rps-btn"
      data-choice={choice}
      onClick={() => onPick(choice)}
    >
      <RpsGlyph choice={choice} />
      <span className="bpc-rps-btn-label">{choice}</span>
    </button>
  );
}

function RpsGlyph({ choice }: { choice: RpsChoice }) {
  if (choice === 'rock') return <span className="bpc-rps-glyph">▲</span>;
  if (choice === 'paper') return <span className="bpc-rps-glyph">▥</span>;
  return <span className="bpc-rps-glyph">✂</span>;
}

/* ------------------------------------------------------------------------- */
/*  OregonTrailPopup — multi-stage gag                                        */
/*    Stage 1 'ask'      : "Let's settle this like adults" + 2 choices       */
/*    Stage 2A 'rps-rigged' (if user picks "settle like adults"):            */
/*               classic RPS where computer always picks rock                 */
/*    Stage 2B 'thinking' (if user picks "like Oregon Trail?"):              */
/*               pulsing dots → 'disgusting' → RPS appears → user picks →    */
/*               "Honestly, I don't even want to anymore." → close           */
/* ------------------------------------------------------------------------- */

type OtPhase =
  | 'ask'
  | 'rps-rigged-pick'
  | 'rps-rigged-result'
  | 'thinking'
  | 'disgusting'
  | 'rps-bored-pick'
  | 'rps-bored-result'
  | 'closed';

function OregonTrailPopup({
  variant,
  slot,
}: {
  variant: OregonTrailPopupVariant;
  slot: number;
}) {
  const [phase, setPhase] = useState<OtPhase>('ask');
  const [pick, setPick] = useState<RpsChoice | null>(null);

  // Multi-stage timing
  useEffect(() => {
    if (phase === 'thinking') {
      const t = window.setTimeout(() => setPhase('disgusting'), 1500);
      return () => window.clearTimeout(t);
    }
    if (phase === 'disgusting') {
      const t = window.setTimeout(() => setPhase('rps-bored-pick'), 1100);
      return () => window.clearTimeout(t);
    }
    if (phase === 'rps-bored-result') {
      const t = window.setTimeout(() => setPhase('closed'), 1500);
      return () => window.clearTimeout(t);
    }
    return undefined;
  }, [phase]);

  if (phase === 'closed') return null;

  return (
    <PopupShell slot={slot} title={variant.title} closing={phase === 'closed'}>
      <div className="bpc-rps">
        {phase === 'ask' && (
          <>
            <p className="bpc-rps-body">{variant.body ?? "Let's settle this like adults."}</p>
            <div className="bpc-prompt-buttons">
              <button
                type="button"
                className="bpc-prompt-btn"
                onClick={() => setPhase('rps-rigged-pick')}
              >
                <span className="bpc-prompt-btn-arrow" aria-hidden="true">&gt;</span>
                settle like adults
              </button>
              <button
                type="button"
                className="bpc-prompt-btn"
                onClick={() => setPhase('thinking')}
              >
                <span className="bpc-prompt-btn-arrow" aria-hidden="true">&gt;</span>
                like Oregon Trail?
              </button>
            </div>
          </>
        )}

        {phase === 'rps-rigged-pick' && (
          <>
            <p className="bpc-rps-body">Best of one. Pick.</p>
            <div className="bpc-rps-buttons">
              <RpsButton
                choice="rock"
                onPick={(c) => {
                  setPick(c);
                  setPhase('rps-rigged-result');
                }}
              />
              <RpsButton
                choice="paper"
                onPick={(c) => {
                  setPick(c);
                  setPhase('rps-rigged-result');
                }}
              />
              <RpsButton
                choice="scissors"
                onPick={(c) => {
                  setPick(c);
                  setPhase('rps-rigged-result');
                }}
              />
            </div>
          </>
        )}

        {phase === 'rps-rigged-result' && pick && (
          <div className="bpc-rps-result">
            <p className="bpc-rps-row">
              <span className="bpc-rps-label">you:</span>
              <RpsGlyph choice={pick} />
            </p>
            <p className="bpc-rps-row">
              <span className="bpc-rps-label">me:</span>
              <RpsGlyph choice="rock" />
            </p>
            <p className="bpc-rps-verdict">I picked rock. I always pick rock.</p>
          </div>
        )}

        {phase === 'thinking' && (
          <div className="bpc-thinking">
            <span className="bpc-thinking-dot" />
            <span className="bpc-thinking-dot" />
            <span className="bpc-thinking-dot" />
          </div>
        )}

        {phase === 'disgusting' && (
          <div className="bpc-disgusting">disgusting</div>
        )}

        {phase === 'rps-bored-pick' && (
          <>
            <p className="bpc-rps-body">fine. pick.</p>
            <div className="bpc-rps-buttons">
              <RpsButton
                choice="rock"
                onPick={(c) => {
                  setPick(c);
                  setPhase('rps-bored-result');
                }}
              />
              <RpsButton
                choice="paper"
                onPick={(c) => {
                  setPick(c);
                  setPhase('rps-bored-result');
                }}
              />
              <RpsButton
                choice="scissors"
                onPick={(c) => {
                  setPick(c);
                  setPhase('rps-bored-result');
                }}
              />
            </div>
          </>
        )}

        {phase === 'rps-bored-result' && (
          <p className="bpc-rps-verdict bpc-rps-verdict--bored">
            Honestly, I don't even want to anymore.
          </p>
        )}
      </div>
    </PopupShell>
  );
}

/* ------------------------------------------------------------------------- */
/*  LoyaltyCardPopup — fake punch-card animation                              */
/*  9 already-stamped + 1 last-punch animation, then VOID overstamp.          */
/* ------------------------------------------------------------------------- */

function LoyaltyCardPopup({
  variant,
  slot,
}: {
  variant: LoyaltyCardPopupVariant;
  slot: number;
}) {
  const [stage, setStage] = useState<'punching' | 'unlocked' | 'voided'>('punching');

  useEffect(() => {
    const t1 = window.setTimeout(() => setStage('unlocked'), 1200);
    const t2 = window.setTimeout(() => setStage('voided'), 2100);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  return (
    <PopupShell slot={slot} title={variant.title}>
      <div className="bpc-loyalty">
        <p className="bpc-loyalty-brand">{variant.brand}</p>
        <div className="bpc-loyalty-card">
          {/* 9 punches already filled. The 10th gets the staggered-stamp animation. */}
          {[...Array(10)].map((_, i) => (
            <span
              key={i}
              className="bpc-loyalty-hole"
              data-stamped={i < 9 ? 'true' : (stage !== 'punching' ? 'true' : 'false')}
              style={i === 9 ? { animationDelay: '0.6s' } : undefined}
            >
              {i < 9 ? '✓' : (stage !== 'punching' ? '✓' : '')}
            </span>
          ))}
        </div>
        {stage === 'unlocked' && (
          <p className="bpc-loyalty-unlocked">{variant.unlocked}</p>
        )}
        {stage === 'voided' && (
          <p className="bpc-loyalty-voided">{variant.voided}</p>
        )}
      </div>
    </PopupShell>
  );
}
