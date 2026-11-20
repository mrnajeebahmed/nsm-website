'use client';

import { useMemo, useState } from 'react';
import { dimensionLabels, questions, scoreAssessment, smeBenchmark, type Dimension } from '@/lib/assessment';
import { useAdvisor } from './AdvisorProvider';
import { RadarChart } from './RadarChart';
import Link from 'next/link';

export function ReadinessQuiz() {
  const { updateContext, openChat } = useAdvisor();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const done = step >= questions.length;
  const result = useMemo(() => (done ? scoreAssessment(answers) : null), [done, answers]);

  const choose = (qid: string, score: number) => {
    const next = { ...answers, [qid]: score };
    setAnswers(next);
    if (step === questions.length - 1) {
      const r = scoreAssessment(next);
      updateContext({ assessment: { overall: r.overall, tier: r.tier, dimensions: r.dimensions } });
    }
    setTimeout(() => setStep((s) => s + 1), 180);
  };

  if (result) {
    const circ = 2 * Math.PI * 64;
    return (
      <div>
        <div className="split" style={{ alignItems: 'start', gap: 40 }}>
          <div>
            <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap', marginBottom: 20 }}>
              <div className="score-ring">
                <svg width="150" height="150" viewBox="0 0 150 150" aria-hidden>
                  <circle cx="75" cy="75" r="64" fill="none" stroke="#E2E8F0" strokeWidth="12" />
                  <circle cx="75" cy="75" r="64" fill="none" stroke="url(#g)" strokeWidth="12" strokeLinecap="round"
                    strokeDasharray={circ} strokeDashoffset={circ * (1 - result.overall / 100)} />
                  <defs><linearGradient id="g"><stop offset="0" stopColor="#2563EB" /><stop offset="1" stopColor="#0D9488" /></linearGradient></defs>
                </svg>
                <div className="val"><div><b>{result.overall}</b><small>/ 100</small></div></div>
              </div>
              <div>
                <div className="label">Your AI maturity tier</div>
                <h3 style={{ fontSize: '1.8rem', marginBottom: 6 }} className="teal">{result.tier}</h3>
                <div className="tags">
                  {(['Explorer', 'Builder', 'Scaler', 'AI-Native'] as const).map((t) => (
                    <span key={t} className={`tag ${t === result.tier ? 'teal' : ''}`}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
            <p>{result.tierBlurb}</p>
            <div className="grid grid-2" style={{ gap: 10, marginBottom: 24 }}>
              {(Object.keys(dimensionLabels) as Dimension[]).map((d) => (
                <div key={d} className="stat" style={{ padding: 14 }}>
                  <div className="label">{dimensionLabels[d]}</div>
                  <b style={{ fontSize: '1.3rem', color: result.dimensions[d] >= smeBenchmark[d] ? 'var(--teal)' : 'var(--amber)' }}>
                    {result.dimensions[d]}<span style={{ fontSize: '.8rem', color: 'var(--muted)', fontWeight: 600 }}> vs {smeBenchmark[d]} avg</span>
                  </b>
                </div>
              ))}
            </div>
          </div>
          <div className="card" style={{ background: 'var(--canvas)' }}>
            <RadarChart scores={result.dimensions} benchmark={smeBenchmark} />
          </div>
        </div>
        <h3 style={{ marginTop: 12 }}>Your top 3 immediate action items</h3>
        <ol className="action-list">
          {result.actions.map((a, i) => <li key={i}><span className="n">{i + 1}</span>{a}</li>)}
        </ol>
        <div className="btn-row no-print" style={{ marginTop: 24 }}>
          <button className="btn btn-primary" onClick={() => openChat(`I just scored ${result.overall}/100 (${result.tier}) on the AI readiness assessment. My weakest areas need work — what should my first AI project be?`)}>
            Discuss results with AI Advisor
          </button>
          <Link href="/contact?from=assessment" className="btn btn-secondary">Book a strategy call</Link>
          <button className="btn btn-ghost" onClick={() => window.print()}>Save as PDF</button>
          <button className="btn btn-ghost" onClick={() => { setAnswers({}); setStep(0); }}>Retake</button>
        </div>
        <p style={{ fontSize: '.8rem', marginTop: 16 }}>Benchmarks are indicative SME averages and for guidance only.</p>
      </div>
    );
  }

  const q = questions[step];
  return (
    <div style={{ maxWidth: 720 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.85rem', marginBottom: 8 }}>
        <span className="tag blue">{dimensionLabels[q.dimension]}</span>
        <span>Question {step + 1} of {questions.length}</span>
      </div>
      <div className="quiz-progress" role="progressbar" aria-valuenow={step} aria-valuemin={0} aria-valuemax={questions.length}>
        <div style={{ width: `${(step / questions.length) * 100}%` }} />
      </div>
      <h3 style={{ fontSize: '1.35rem', marginBottom: 20 }}>{q.text}</h3>
      <div className="option-list">
        {q.options.map((o) => (
          <button key={o.label} className="option" aria-pressed={answers[q.id] === o.score} onClick={() => choose(q.id, o.score)}>
            <span className="bullet" />{o.label}
          </button>
        ))}
      </div>
      {step > 0 && <button className="btn btn-ghost" style={{ marginTop: 16 }} onClick={() => setStep(step - 1)}>← Back</button>}
    </div>
  );
}
