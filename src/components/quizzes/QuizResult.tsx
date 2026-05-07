/**
 * QuizResult.tsx
 * --------------------------------------------------------------------------
 * Reveals the foundational quiz outcome: derived assignment + 8-stat
 * panel rendered as ASCII bar visualization. Reads from
 * user_profiles.quiz_outcome (or local fallback). Includes the DISPUTE
 * ASSIGNMENT gag.
 */
import { useCallback, useEffect, useState } from 'react';
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
  const filled = Math.max(0, Math.min(STAT_MAX, value));
  const empty = STAT_MAX - filled;
  return '█'.repeat(filled) + '░'.repeat(empty);
}

export default function QuizResult() {
  const [outcome, setOutcome] = useState<QuizOutcome | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [employeeId, setEmployeeId] = useState<string | null>(null);

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

  const handleAccept = () => {
    window.location.href = '/portal';
  };

  const handleDispute = useCallback(() => {
    window.alert(
      'YOUR DISPUTE HAS BEEN FILED.\n\n' +
      'The room declined to read it.\n\n' +
      '[OK]'
    );
  }, []);

  if (!loaded) {
    return <div className="qres-loading">RETRIEVING ASSIGNMENT...</div>;
  }

  if (!outcome) {
    return (
      <div className="qres-loading">
        <p>NO ASSIGNMENT FOUND ON FILE.</p>
        <p style={{ marginTop: 16 }}>
          <a href="/portal/interview" style={{ color: 'inherit' }}>► TAKE THE INTAKE QUIZ</a>
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

      <p className="qres-stats-header">► STAT PROFILE</p>
      {STAT_AXES.map((axis) => {
        const value = outcome.stats[axis.key as StatKey] ?? 0;
        return (
          <div className="qres-stat-row" key={axis.key}>
            <span className="qres-stat-label">{axis.label}</span>
            <span className="qres-stat-bar">{barFor(value)}</span>
            <span className="qres-stat-value">{value}</span>
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
        <a href="/portal/interview" className="qres-action-secondary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
          RETAKE
        </a>
      </div>
    </div>
  );
}
