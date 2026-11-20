'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { ALL_QUESTIONS, FOCUS, LEVELS, PILLARS, band, engagementFor, f2, focusPillars, type Answers, type OairiResult } from '@/lib/oairi';
import { useAdvisor } from './AdvisorProvider';
import { ContextPayload } from './ContextPayload';
import { PillarRadar } from './PillarRadar';

type Props = {
  ans: Answers; setAns: (a: Answers) => void;
  step: number; setStep: (s: number) => void;
  res: OairiResult; goProject: () => void;
};

export function OairiAssessment({ ans, setAns, step, setStep, res, goProject }: Props) {
  const { updateContext, openChat } = useAdvisor();
  const topRef = useRef<HTMLDivElement>(null);
  const done = step >= PILLARS.length;
  const P = PILLARS[Math.min(step, PILLARS.length - 1)];
  const pillarDone = P.qs.every((q) => ans[q.id] != null);

  const move = (s: number) => {
    setStep(s);
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const reset = () => { setAns({}); move(0); };

  const showResults = done && res.complete;
  const { strongest, focus } = showResults ? focusPillars(res) : { strongest: null, focus: null };
  const eng = engagementFor(res.level, res.gate.k);
  const capped = res.level < res.bandLevel;

  // Share the completed result with the AI Advisor.
  useEffect(() => {
    if (!showResults || !focus) return;
    updateContext({
      assessment: {
        framework: 'oAIRI', overall: +f2(res.overall), level: res.level, levelName: LEVELS[res.level].n, gate: res.gate.k,
        pillars: Object.fromEntries(PILLARS.map((p) => [p.id, +f2(res.pillar[p.id] ?? 0)])),
        focusPillar: focus.id, suggestedEngagement: eng.name,
      },
    });
  }, [showResults, res, focus, eng.name, updateContext]);

  const payload = showResults && strongest && focus ? {
    framework: 'oAIRI', score_version: 'v3.2',
    ...Object.fromEntries(PILLARS.map((p) => [`oairi_${p.id.toLowerCase()}`, +f2(res.pillar[p.id] ?? 0)])),
    oairi_overall: +f2(res.overall), oairi_level: `L${res.level} - ${LEVELS[res.level].n}`, oairi_gate: res.gate.k,
    strongest_pillar: strongest.id, focus_pillar: focus.id, suggested_engagement: eng.name,
  } : null;

  const left = showResults && strongest && focus ? (
    <div>
      <p className="kicker">Your organizational AI readiness (oAIRI)</p>
      <div className="score-line">
        <span className="big-num">{f2(res.overall)}</span><span className="muted">/ 5.00</span>
        <span className="pill">L{res.level} {LEVELS[res.level].n}</span>
        <span className={`pill ${res.gate.k}`}>Ethics gate: {res.gate.k}</span>
      </div>
      <div className="ladder" aria-label="Maturity ladder">
        {LEVELS.map((l, i) => <div key={l.n} className={`${i === res.level ? 'on' : ''} ${i === 2 ? 'tgt' : ''}`}>L{i}<br />{l.n}</div>)}
      </div>
      <p className="small muted" style={{ margin: 0 }}>
        Outlined: L2 AI Ready, the success target.{' '}
        {capped && <b style={{ color: 'var(--amber)' }}>Your score bands at L{res.bandLevel}, but the ethics gate caps your level at L{res.level}.</b>}
      </p>

      <h3 style={{ marginTop: 22 }}>Project prioritization posture</h3>
      <div className="posture">
        <div className="stat-box"><span>Execution multiplier (P1, 2x)</span><b>L{band(res.pillar.P1!)} {LEVELS[band(res.pillar.P1!)].n}</b></div>
        <div className="stat-box"><span>Viability (P3)</span><b>L{band(res.pillar.P3!)} {LEVELS[band(res.pillar.P3!)].n}</b></div>
        <div className="stat-box"><span>Feasibility (0.7 P4 + 0.3 P5)</span><b>{f2(0.7 * res.pillar.P4! + 0.3 * res.pillar.P5!)}</b></div>
      </div>

      <div className={`callout ${res.gate.k === 'STOP' ? 'stop' : res.gate.k === 'CONDITIONS' ? 'warn' : ''}`}>
        <p style={{ margin: '0 0 4px', color: 'var(--ink)' }}><b>Strongest pillar:</b> {strongest.name}. <b>Strengthen first:</b> {focus.name}.</p>
        <p className="small" style={{ margin: 0 }}>{FOCUS[focus.id]}</p>
      </div>
      <div className="callout">
        <h3>Recommended next step: {eng.name}</h3>
        <p className="small" style={{ margin: '0 0 14px' }}>{eng.why}</p>
        <div className="btn-row no-print">
          <button className="btn btn-primary" onClick={goProject}>Score your first AI project</button>
          <button className="btn btn-secondary" onClick={() => openChat(`I scored ${f2(res.overall)}/5 on the AI readiness assessment: L${res.level} ${LEVELS[res.level].n}, ethics gate ${res.gate.k}. My focus pillar is ${focus.name}. What should my first AI project be?`)}>
            Discuss with AI Advisor
          </button>
        </div>
        <div className="btn-row no-print" style={{ marginTop: 6 }}>
          <Link href="/contact?from=assessment" className="btn btn-ghost">Book a strategy call</Link>
          <button className="btn btn-ghost" onClick={() => window.print()}>Save as PDF</button>
          <button className="btn btn-ghost" onClick={reset}>Retake</button>
        </div>
        {payload && <ContextPayload data={payload} />}
      </div>
    </div>
  ) : (
    <div>
      {step === 0 && (
        <p className="small muted" style={{ marginTop: 0 }}>
          15 questions, about 10 minutes. Pick the option that matches what you actually see in your organization today, not what you plan. There are no wrong answers, and <b>L2 AI Ready</b> is the target, not expert status.
        </p>
      )}
      <p className="kicker">Pillar {Math.min(step, PILLARS.length - 1) + 1} of {PILLARS.length} · {res.answered} of {ALL_QUESTIONS.length} answered</p>
      <div className="quiz-progress" role="progressbar" aria-valuenow={res.answered} aria-valuemin={0} aria-valuemax={ALL_QUESTIONS.length}>
        <div style={{ width: `${(res.answered / ALL_QUESTIONS.length) * 100}%` }} />
      </div>
      <h2 style={{ fontSize: '1.5rem' }}>{P.name}</h2>
      <p className="muted" style={{ margin: 0 }}>{P.what}</p>
      {P.qs.map((q) => (
        <div className="question" key={q.id}>
          <div className="dim">{q.dim}</div>
          <h3>{q.q}</h3>
          <div className="option-list" role="group" aria-label={q.dim}>
            {q.o.map((o, v) => (
              <button key={v} className="option" aria-pressed={ans[q.id] === v} onClick={() => setAns({ ...ans, [q.id]: v })}>
                <span className="bullet" />{o}
              </button>
            ))}
          </div>
        </div>
      ))}
      <div className="btn-row" style={{ justifyContent: 'space-between', marginTop: 24 }}>
        <button className="btn btn-secondary" disabled={step === 0} onClick={() => move(step - 1)}>Back</button>
        <button className="btn btn-primary" disabled={!pillarDone} onClick={() => move(step + 1)}>
          {step >= PILLARS.length - 1 ? 'See my results' : 'Next pillar'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="tool-grid" ref={topRef} style={{ scrollMarginTop: 90 }}>
      <div className="card">{left}</div>
      <div className="card sticky-panel">
        <p className="kicker">{showResults ? 'Your five pillars vs. the AI Ready target' : 'Your profile, building live'}</p>
        <PillarRadar values={PILLARS.map((p) => res.pillar[p.id])} labels={PILLARS.map((p) => p.short)} />
        <div className="legend">
          <span style={{ ['--c' as string]: 'var(--teal)' }}>Your organization</span>
          <span style={{ ['--c' as string]: 'var(--muted)' }}>L2 AI Ready target (2.50)</span>
        </div>
        <div className="dims">
          {PILLARS.map((p) => {
            const s = res.pillar[p.id];
            return (
              <div className="dim-row" key={p.id}>
                <span>{p.short}</span>
                <div className="bar"><i style={{ width: `${((s ?? 0) / 5) * 100}%` }} /><b /></div>
                <span className="num">{s == null ? '–' : `${f2(s)} · L${band(s)}`}</span>
              </div>
            );
          })}
        </div>
        <p className="small muted" style={{ marginTop: 14, marginBottom: 0 }}>Overall score is the mean of all 15 answers. Answers stay in this browser.</p>
      </div>
    </div>
  );
}
