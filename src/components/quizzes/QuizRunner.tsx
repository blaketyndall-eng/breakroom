/**
 * QuizRunner.tsx
 * --------------------------------------------------------------------------
 * The interactive React island that drives any quiz. Auth-checks via
 * supabase, walks questions one at a time, auto-advances on selection,
 * supports Finalize-from-anywhere via deterministic answer fill, and
 * persists results to user_profiles (foundational) or quiz_results
 * (scattered).
 *
 * The component is quiz-agnostic — pass any Quiz definition. Behavior
 * differs by quiz.kind:
 *   foundational → writes to user_profiles, redirects to redirectTo
 *   scattered    → inserts a row into quiz_results, redirects
 */
import { useCallback, useEffect, useState } from 'react';
import type { Quiz } from '@/lib/quizzes/engine';
import { scoreQuiz } from '@/lib/quizzes/engine';
import {
  applyContribution,
  generateProvisionalProfile,
} from '@/lib/quizzes/profileSeed';
import { supabase } from '@/lib/supabaseClient';
import type { StatVector } from '@/lib/quizzes/stats';

interface Props {
  quiz: Quiz;
  /** Where to send the user after finalize. */
  redirectTo?: string;
}

export default function QuizRunner({ quiz, redirectTo = '/portal/interview/result' }: Props) {
  const [userId, setUserId] = useState<string | null>(null);
  const [currentStats, setCurrentStats] = useState<StatVector | null>(null);
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auth + provisional stat load
  useEffect(() => {
    let canceled = false;
    async function init() {
      if (!supabase) {
        // Local-only fallback. Use a stable session id from localStorage.
        let sid = localStorage.getItem('breakroom.local_session_id');
        if (!sid) {
          sid = 'local-' + Math.random().toString(36).slice(2, 10);
          localStorage.setItem('breakroom.local_session_id', sid);
        }
        if (canceled) return;
        setUserId(sid);
        setCurrentStats(generateProvisionalProfile(sid).stats);
        return;
      }
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        window.location.href = '/signup?next=/portal/interview';
        return;
      }
      if (canceled) return;
      setUserId(data.user.id);
      // Pull current stats from user_profiles.quiz_outcome (or seed if none)
      const { data: prof } = await supabase
        .from('user_profiles')
        .select('quiz_outcome')
        .eq('id', data.user.id)
        .single();
      const existing = (prof?.quiz_outcome as { stats?: StatVector } | null)?.stats;
      if (canceled) return;
      setCurrentStats(existing ?? generateProvisionalProfile(data.user.id).stats);
    }
    init().catch((e) => setError(e instanceof Error ? e.message : 'Init failed.'));
    return () => {
      canceled = true;
    };
  }, []);

  if (!userId || !currentStats) {
    return <div className="qr-loading">CONNECTING TO MAINFRAME...</div>;
  }

  const total = quiz.questions.length;
  const currentQ = quiz.questions[currentIdx];
  const isFirst = currentIdx === 0;
  const isLast = currentIdx >= total - 1;
  const answeredCount = Object.keys(selected).length;

  const handleSelect = (optionId: string) => {
    if (submitting) return;
    setSelected((prev) => ({ ...prev, [currentQ.id]: optionId }));
    if (!isLast) {
      window.setTimeout(() => setCurrentIdx((i) => Math.min(total - 1, i + 1)), 400);
    }
  };

  const handleBack = () => {
    if (isFirst || submitting) return;
    setCurrentIdx((i) => Math.max(0, i - 1));
  };
  const handleNext = () => {
    if (isLast || submitting) return;
    setCurrentIdx((i) => Math.min(total - 1, i + 1));
  };

  const handleFinalize = useCallback(async () => {
    if (!userId || !currentStats || submitting) return;
    setSubmitting(true);
    setError(null);

    try {
      const score = scoreQuiz(quiz, { selected }, userId);
      const result = applyContribution(currentStats, score.contribution, userId);

      const outcome = {
        quiz_slug: quiz.slug,
        resolved_answers: score.resolvedAnswers,
        answered_count: score.answeredCount,
        total_questions: score.totalQuestions,
        stats: result.stats,
        assignment: result.assignment,
        finalized_at: new Date().toISOString(),
      };

      if (supabase && !userId.startsWith('local-')) {
        if (quiz.kind === 'foundational') {
          const { error: dbErr } = await supabase
            .from('user_profiles')
            .update({
              quiz_completed_at: outcome.finalized_at,
              quiz_outcome: outcome,
              department: result.assignment.department,
              role_name: result.assignment.role,
              assigned_object_slug: result.assignment.assigned_object,
              house_rule: result.assignment.house_rule,
              uniform_recommendation_slug: result.assignment.uniform,
              preferred_light: result.assignment.preferred_light,
              preferred_place: result.assignment.preferred_place,
            })
            .eq('id', userId);
          if (dbErr) throw dbErr;
        } else {
          // Scattered: append a row to quiz_results
          const { error: dbErr } = await supabase.from('quiz_results').insert({
            user_id: userId,
            quiz_slug: quiz.slug,
            outcome_key: '',
            answers: score.resolvedAnswers,
            weights: result.stats,
            contribution: score.contribution,
          });
          if (dbErr) throw dbErr;
        }
      } else {
        // Local fallback
        const key = quiz.kind === 'foundational'
          ? 'breakroom.quiz.employee_outcome'
          : 'breakroom.quiz.results';
        if (quiz.kind === 'foundational') {
          localStorage.setItem(key, JSON.stringify(outcome));
        } else {
          const existing = JSON.parse(localStorage.getItem(key) || '[]');
          existing.unshift(outcome);
          localStorage.setItem(key, JSON.stringify(existing.slice(0, 50)));
        }
      }

      window.location.href = redirectTo;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Finalize failed.');
      setSubmitting(false);
    }
  }, [userId, currentStats, submitting, quiz, selected, redirectTo]);

  return (
    <div className="qr">
      <div className="qr-question">
        <p className="qr-prompt">{currentQ.prompt}</p>
        <ul className="qr-options">
          {currentQ.options.map((opt, idx) => {
            const isSel = selected[currentQ.id] === opt.id;
            const letter = String.fromCharCode(65 + idx);
            return (
              <li key={opt.id}>
                <button
                  type="button"
                  className={`qr-opt ${isSel ? 'qr-opt-sel' : ''}`}
                  onClick={() => handleSelect(opt.id)}
                  disabled={submitting}
                >
                  <span className="qr-letter">{isSel ? '►' : ' '}{letter}</span>
                  <span className="qr-text">{opt.text}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="qr-nav">
        <button onClick={handleBack} disabled={isFirst || submitting}>← BACK</button>
        <span className="qr-progress-dots">
          {quiz.questions.map((q, i) => (
            <span
              key={q.id}
              className={`qr-dot ${i === currentIdx ? 'qr-dot-active' : ''} ${selected[q.id] ? 'qr-dot-answered' : ''}`}
            />
          ))}
        </span>
        <button onClick={handleNext} disabled={isLast || submitting}>NEXT →</button>
      </div>

      <div className="qr-finalize">
        <button
          type="button"
          className="qr-finalize-btn"
          onClick={handleFinalize}
          disabled={submitting}
        >
          {submitting ? 'FILING...' : `► FINALIZE (${answeredCount}/${total} ANSWERED)`}
        </button>
        {answeredCount < total && (
          <p className="qr-finalize-hint">UNANSWERED QUESTIONS WILL BE FILLED ON YOUR BEHALF.</p>
        )}
      </div>

      {error && <p className="qr-error">[ERROR]: {error}</p>}
    </div>
  );
}
