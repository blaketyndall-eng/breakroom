/**
 * QuizResult.tsx
 * --------------------------------------------------------------------------
 * Reveals the foundational quiz outcome: derived assignment + 8-stat
 * panel rendered as ASCII bar visualization. Reads from
 * user_profiles.quiz_outcome (or local fallback). Includes the DISPUTE
 * ASSIGNMENT gag as a stamped in-page modal (not window.alert).
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import type { StatVector } from '@/lib/quizzes/stats';
import { STAT_AXES, STAT_MAX, type StatKey } from '@/lib/quizzes/stats';
import type { DerivedAssignment } from '@/lib/quizzes/profileSeed';
import { supabase } from '@/lib/supabaseClient';

interface QuizOutcome {
  quiz_slug: string;
  stats: StatVector;
  assignment: DerivedAssignment;
  finalized_at?: string;
}

function barFor(value: number): string {
  const filled = Math.max(0, Math.min(STAT_MAX, Math.round(value)));
  const empty = STAT_MAX - filled;
  return '█'.repeat(filled) + '░'.repeat(empty);
}

/**
 * Deterministic dispute reference — same outcome produces same number,
 * so re-clicking DISPUTE on the same file shows the same paperwork.
 */
function disputeRef(outcome: QuizOutcome): string {
  const seed = `${outcome.quiz_slug}|${outcome.assignment.role}|${outcome.assignment.department}`;
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = ((h << 5) - h + seed.charCodeAt(i)) | 0;
  }
  return `OS-DISPUTE-${(Math.abs(h) % 99999).toString().padStart(5, '0')}`;
}

export default function QuizResult() {
  const [outcome, setOutcome] = useState<QuizOutcome | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [employeeId, setEmployeeId] = useState<string | null>(null);
  const [disputeOpen, setDisputeOpen] = useState(false);

  useEffect(() => {
    async function load() {
      if (!supabase) {
        const raw = localStorage.getItem('breakroom.quiz.employee_outcome');
        if (raw) setOutcome(JSON.parse(raw));
        setLoaded(true);
        return;
      }
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        window.location.href = '/signup?next=/portal/interview';
        return;
      }
      const { data } = await supabase
        .from('user_profiles')
        .select('quiz_outcome, employee_id')
        .eq('id', userData.user.id)
        .single();
      if (data?.quiz_outcome) setOutcome(data.quiz_outcome as QuizOutcome);
      if (data?.employee_id) setEmployeeId(data.employee_id);
      setLoaded(true);
    }
    load().catch(() => setLoaded(true));
  }, []);

  const handleAccept = useCallback(() => {
    window.location.href = '/portal';
  }, []);

  const handleDispute = useCallback(() => setDisputeOpen(true), []);
  const handleDismissDispute = useCallback(() => setDisputeOpen(false), []);

  // Esc key dismisses the dispute panel.
  useEffect(() => {
    if (!disputeOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDisputeOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [disputeOpen]);

  const reference = useMemo(() => (outcome ? disputeRef(outcome) : ''), [outcome]);

  if (!loaded) {
    return <div className="qres-loading">RETRIEVING ASSIGNMENT...</div>;
  }

  if (!outcome) {
    return (
      <div className="qres-loading">
        <p>NO ASSIGNMENT FOUND ON FILE.</p>
        <p style={{ marginTop: 16 }}>
          <a href="/portal/interview" style={{ color: 'inherit' }}>▶ TAKE THE INTAKE QUIZ</a>
        </p>
      </div>
    );
  }

  return (
    <div className="qres">
      <p className="qres-headline">OMNISHIFT HAS ISSUED YOUR FILE.</p>

      <div className="qres-fields">
        <span className="qres-field-label">EMPLOYEE ID</span>
        <span className="qres-field-value">{employeeId ?? 'OS-PENDING'}</span>
        <span className="qres-field-label">DEPARTMENT</span>
        <span className="qres-field-value">{outcome.assignment.department}</span>
        <span className="qres-field-label">ROLE</span>
        <span className="qres-field-value">{outcome.assignment.role}</span>
        <span className="qres-field-label">ASSIGNED OBJECT</span>
        <span className="qres-field-value">{outcome.assignment.assigned_object}</span>
        <span className="qres-field-label">UNIFORM</span>
        <span className="qres-field-value">{outcome.assignment.uniform}</span>
        <span className="qres-field-label">PREFERRED LIGHT</span>
        <span className="qres-field-value">{outcome.assignment.preferred_light}</span>
        <span className="qres-field-label">PREFERRED PLACE</span>
        <span className="qres-field-value">{outcome.assignment.preferred_place}</span>
      </div>

      <p className="qres-stats-header">▶ STAT PROFILE</p>
      {STAT_AXES.map((axis) => {
        const value = outcome.stats[axis.key as StatKey] ?? 0;
        return (
          <div className="qres-stat-row" key={axis.key}>
            <span className="qres-stat-label">{axis.label}</span>
            <span className="qres-stat-bar">{barFor(value)}</span>
            <span className="qres-stat-value">{Math.round(value)}</span>
          </div>
        );
      })}

      <div className="qres-house-rule">“{outcome.assignment.house_rule}”</div>

      <div className="qres-actions">
        <button type="button" className="qres-action-primary" onClick={handleAccept}>
          ACCEPT AND ENTER PORTAL
        </button>
        <button type="button" className="qres-action-secondary" onClick={handleDispute}>
          DISPUTE ASSIGNMENT
        </button>
        <a
          href="/portal/interview"
          className="qres-action-secondary"
          style={{
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            color: 'inherit',
            fontFamily: 'inherit',
            fontWeight: 'inherit',
            fontSize: 'inherit',
            letterSpacing: 'inherit',
          }}
        >
          RETAKE
        </a>
      </div>

      {disputeOpen && (
        <DisputePanel reference={reference} onDismiss={handleDismissDispute} />
      )}
    </div>
  );
}

// ============================================================
// DisputePanel — in-page DECLINED stamp modal
// ============================================================

function DisputePanel({ reference, onDismiss }: { reference: string; onDismiss: () => void }) {
  const overlayStyle: CSSProperties = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(5, 6, 5, 0.62)',
    display: 'grid',
    placeItems: 'center',
    zIndex: 10000,
    padding: 16,
  };
  const panelStyle: CSSProperties = {
    background: '#f5f0e8',
    color: '#1d2891',
    padding: '34px 30px 26px',
    maxWidth: 460,
    width: '100%',
    border: '4px ridge #1d2891',
    fontFamily: "Menlo, Consolas, 'Courier New', monospace",
    textAlign: 'center',
    boxShadow: '6px 6px 0 rgba(20,17,14,0.45)',
    position: 'relative',
  };
  const stampStyle: CSSProperties = {
    display: 'inline-block',
    border: '3px solid #b00020',
    color: '#b00020',
    padding: '6px 16px',
    fontWeight: 900,
    letterSpacing: '0.14em',
    transform: 'rotate(-3deg)',
    marginBottom: 18,
    fontSize: 13,
  };
  const headlineStyle: CSSProperties = {
    fontWeight: 900,
    letterSpacing: '0.06em',
    margin: '4px 0 6px',
    fontSize: 14,
  };
  const bodyStyle: CSSProperties = {
    margin: '8px 0 4px',
    fontStyle: 'italic',
    fontSize: 13,
    lineHeight: 1.4,
  };
  const metaStyle: CSSProperties = {
    fontSize: 10,
    margin: '20px 0 18px',
    color: '#5a513f',
    letterSpacing: '0.06em',
  };
  const dismissStyle: CSSProperties = {
    fontFamily: 'inherit',
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: '0.08em',
    background: '#d4d0c8',
    border: '2px outset #d4d0c8',
    padding: '6px 28px',
    color: '#1d2891',
    cursor: 'default',
  };

  return (
    <div
      style={overlayStyle}
      role="dialog"
      aria-modal="true"
      aria-labelledby="qres-dispute-title"
      onClick={onDismiss}
    >
      <div style={panelStyle} onClick={(e) => e.stopPropagation()}>
        <p style={stampStyle}>DECLINED BY THE ROOM</p>
        <p id="qres-dispute-title" style={headlineStyle}>YOUR DISPUTE HAS BEEN FILED.</p>
        <p style={bodyStyle}>The room declined to read it.</p>
        <p style={metaStyle}>
          Filed: 1:47 a.m. · Ref: {reference}
        </p>
        <button type="button" style={dismissStyle} onClick={onDismiss} autoFocus>
          OK
        </button>
      </div>
    </div>
  );
}
