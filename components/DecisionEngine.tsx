'use client';

import { useEffect } from 'react';
import { DE_PILLARS, PILLARS, PTS, band, deScore, f2, type DeInput, type DeKey, type OairiResult } from '@/lib/oairi';
import { useAdvisor } from './AdvisorProvider';
import { ContextPayload } from './ContextPayload';

export type ShortlistItem = DeInput & { pct: number; gate: string; at: number };

type Props = {
  de: DeInput; setDe: (d: DeInput) => void;
  list: ShortlistItem[]; setList: (l: ShortlistItem[]) => void;
  res: OairiResult;
};

export function DecisionEngine({ de, setDe, list, setList, res }: Props) {
  const { updateContext, openChat } = useAdvisor();
  const s = deScore(de);
  const orgLevels = res.complete ? Object.fromEntries(PILLARS.map((p) => [p.id, band(res.pillar[p.id] ?? 0)])) : null;
  const track = res.complete ? (res.level <= 1 ? 'A' : 'B') : null;
  const set = (k: DeKey, v: number) => setDe({ ...de, [k]: v });
  const bottleneck = DE_PILLARS.find((p) => p.k === s.bottleneck)!;
  const tone = s.b.tone === 'GO' ? 'var(--teal)' : s.b.tone === 'amber' ? 'var(--amber)' : 'var(--red)';

  const ratings = { P1: `L${de.p1}`, P2: s.g.k, P3: `L${de.p3}`, P4: `L${de.p4}`, P5: `L${de.p5}` };
  useEffect(() => {
    const t = setTimeout(() => updateContext({
      project: { name: de.name, ratings, pct: +s.pct.toFixed(1), band: s.b.label, bottleneck: bottleneck.id },
    }), 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [de, s.pct, s.b.label, bottleneck.id, updateContext]);

  const add = () => setList([...list, { ...de, name: de.name.trim() || 'Untitled project', pct: s.pct, gate: s.g.k, at: Date.now() }]);
  const ranked = [...list].sort((a, b) => Number(a.gate === 'STOP') - Number(b.gate === 'STOP') || b.pct - a.pct || b.p1 - a.p1);

  return (
    <div className="tool-grid">
      <div className="card">
        <p className="kicker">AIRI Decision Engine</p>
        <h2 style={{ fontSize: '1.5rem' }}>Score one AI project on five pillars</h2>
        <div className="field" style={{ marginTop: 14 }}>
          <label htmlFor="pname">Project statement</label>
          <input id="pname" className="input" maxLength={160} value={de.name} onChange={(e) => setDe({ ...de, name: e.target.value })} />
          <p className="small muted" style={{ margin: 0 }}>
            {track === 'B'
              ? 'Track B (transformation): AI agents handle [production work], freeing [role] to focus on [judgment or strategy].'
              : 'Track A (automation): Use AI to [do what] for [which process], reducing [pain metric].'}
            {track && ' Picked from your oAIRI level.'}
          </p>
        </div>
        {DE_PILLARS.map((p) => {
          const isGate = p.k === 'p2';
          const org = orgLevels?.[p.id];
          const over = org != null && (isGate ? Math.min(de[p.k], 2) > Math.min(org, 2) : de[p.k] > org);
          return (
            <div className="de-pillar" key={p.k}>
              <div className="de-head">
                <h3 style={{ margin: 0 }}>{p.id} {p.name}</h3>
                <span className="weight">{isGate ? 'Ethics gate ×0 / ×0.5 / ×1' : `Weight ${p.w}`}</span>
              </div>
              <p className="small muted" style={{ margin: '2px 0 0' }}>{p.q}</p>
              <div className="stars" role="group" aria-label={p.name}>
                {isGate
                  ? (['STOP', 'CONDITIONS', 'GO'] as const).map((g, i) => (
                    <button key={g} className={`star gate ${g}`} aria-pressed={de.p2 === i} onClick={() => set('p2', i)}>{g}</button>
                  ))
                  : [0, 1, 2, 3, 4].map((i) => (
                    <button key={i} className="star" aria-pressed={de[p.k] === i} aria-label={`${i + 1} stars, L${i}`} onClick={() => set(p.k, i)}>
                      {'★'.repeat(i + 1)}
                    </button>
                  ))}
              </div>
              <p className="small" style={{ margin: 0, color: 'var(--ink)' }}><b>{isGate ? ['L0', 'L1', 'L2+'][de.p2] : `L${de[p.k]}`}:</b> {p.r[de[p.k]]}</p>
              {over && <p className="warnline">Higher than your organization’s oAIRI {p.id} level (L{org}). Make sure this project really is the exception.</p>}
            </div>
          );
        })}
      </div>

      <div className="card sticky-panel">
        <p className="kicker">Decision Engine score</p>
        <div className="score-line">
          <span className="big-num" style={{ color: tone }}>{Math.round(s.pct)}%</span>
          <span className={`pill ${s.b.tone}`}>{s.b.label}</span>
          <span className={`pill ${s.g.k}`}>{s.g.k}</span>
        </div>
        <p style={{ margin: '10px 0 16px', color: 'var(--ink)' }}>{s.b.act}</p>
        <div className="calc">
          <div><span>Feasibility: 0.7 × P4 + 0.3 × P5</span><span>{f2(s.feas)}</span></div>
          <div><span>+ Value: P3 ({f2(PTS[de.p3])})</span><span>{f2(s.val)}</span></div>
          <div><span>+ People: 2 × P1 ({f2(PTS[de.p1])})</span><span>{f2(s.ppl)}</span></div>
          <div><span>× Ethics gate ({s.g.m})</span><span>{f2(s.total)}</span></div>
          <div><span>÷ 20 maximum</span><span>{s.pct.toFixed(1)}%</span></div>
        </div>
        <div className={`callout ${s.g.k === 'STOP' ? 'stop' : 'warn'}`}>
          <b style={{ color: 'var(--ink)' }}>Bottleneck: {bottleneck.id} {bottleneck.name}.</b>{' '}
          <span className="small">{s.bottleneck === 'p2' ? 'Lift governance to GO before anything else; the gate overrides every other score.' : 'Raise this pillar first, then re-run the engine.'}</span>
        </div>
        <div className="btn-row no-print" style={{ marginTop: 16 }}>
          <button className="btn btn-primary" onClick={add}>Add to shortlist</button>
          <button className="btn btn-secondary" onClick={() => openChat(`My project "${de.name}" scores ${Math.round(s.pct)}% (${s.b.label}) in the Decision Engine, and the bottleneck is ${bottleneck.id} ${bottleneck.name}. How do we raise it, and what would NSM build first?`)}>
            Discuss with AI Advisor
          </button>
        </div>

        {list.length > 0 && (
          <>
            <h3 style={{ marginTop: 22 }}>Shortlist, ranked</h3>
            <table className="shortlist">
              <thead><tr><th>#</th><th>Project</th><th>Gate</th><th className="n">DE</th><th><span className="sr-only">Actions</span></th></tr></thead>
              <tbody>
                {ranked.map((p, i) => (
                  <tr key={p.at} style={i >= 5 ? { opacity: 0.55 } : undefined}>
                    <td data-l="#">{p.gate === 'STOP' ? '–' : i + 1}</td>
                    <td data-l="Project">{p.name}</td>
                    <td data-l="Gate"><span className={`pill ${p.gate}`}>{p.gate}</span></td>
                    <td data-l="DE" className="n">{Math.round(p.pct)}%</td>
                    <td><button className="btn btn-secondary btn-sm" onClick={() => setList(list.filter((x) => x.at !== p.at))} aria-label={`Remove ${p.name}`}>Remove</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="small muted" style={{ marginTop: 10 }}>Ethics-gated projects drop out. Ties go to the higher P1. Keep the top 5 for leadership voting.</p>
          </>
        )}
        <ContextPayload data={{ framework: 'AIRI Decision Engine', version: 'v3.0', project: de.name, ratings, de_score: +f2(s.total), de_pct: +s.pct.toFixed(1), band: s.b.label, bottleneck: bottleneck.id }} />
      </div>
    </div>
  );
}
