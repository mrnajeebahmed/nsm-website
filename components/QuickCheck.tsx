'use client';

import { useState } from 'react';
import Link from 'next/link';

// Homepage mini-diagnostic: 3 questions → indicative readiness + next step.
const qs = [
  { q: 'Where does most of your operational data live?', o: [['Paper / PDFs / email', 0], ['Spreadsheets', 1], ['Cloud apps (CRM/ERP)', 2]] },
  { q: 'Are your key workflows documented?', o: [['Tribal knowledge', 0], ['Partially', 1], ['Yes, and followed', 2]] },
  { q: 'Do your core tools connect via APIs?', o: [['Not really', 0], ['Some of them', 1], ['Mostly integrated', 2]] },
] as const;

export function QuickCheck() {
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const done = i >= qs.length;
  const pct = Math.round((score / 6) * 100);
  const verdict = pct < 34
    ? { t: 'Foundation first', d: 'Start by digitizing documents and centralizing data. Document processing is often the ideal first win.' }
    : pct < 67
      ? { t: 'Pilot-ready', d: 'You can launch a focused automation pilot now, e.g. lead intake or ticket triage, with human review.' }
      : { t: 'Ready to scale', d: 'Your foundations support production AI agents and RAG copilots across teams.' };

  return (
    <div className="quick-check">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span className="tag blue">Quick-Check · 30 sec</span>
        <span style={{ fontSize: '.8rem' }}>{done ? 'Result' : `${i + 1} / ${qs.length}`}</span>
      </div>
      <div className="qc-steps" aria-hidden>{qs.map((_, k) => <span key={k} className={k < i || done ? 'on' : ''} />)}</div>
      {!done ? (
        <>
          <h3>{qs[i].q}</h3>
          <div className="option-list" style={{ marginTop: 14 }}>
            {qs[i].o.map(([label, s]) => (
              <button key={label} className="option" onClick={() => { setScore((v) => v + s); setI(i + 1); }}>
                <span className="bullet" />{label}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div aria-live="polite">
          <div className="label">Indicative readiness</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <b style={{ fontSize: '2.6rem', color: 'var(--teal)', fontWeight: 800 }}>{pct}</b><span>/ 100 · <strong style={{ color: 'var(--ink)' }}>{verdict.t}</strong></span>
          </div>
          <p style={{ fontSize: '.93rem' }}>{verdict.d}</p>
          <div className="btn-row">
            <Link href="/assess?tool=readiness" className="btn btn-primary btn-sm">Get full 10-question report →</Link>
            <button className="btn btn-ghost btn-sm" onClick={() => { setI(0); setScore(0); }}>Restart</button>
          </div>
        </div>
      )}
    </div>
  );
}
