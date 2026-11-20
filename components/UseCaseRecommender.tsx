'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { goals, industries, pains, recommend, type Goal, type Industry, type Pain } from '@/lib/recommender';
import { useAdvisor } from './AdvisorProvider';

function ChipQuestion<T extends string>({ n, label, options, value, onChange }: { n: number; label: string; options: readonly T[]; value: T | null; onChange: (v: T) => void }) {
  return (
    <fieldset style={{ border: 0, padding: 0, margin: '0 0 24px' }}>
      <legend style={{ fontWeight: 700, color: 'var(--ink)', marginBottom: 10 }}><span className="card-num">0{n} </span>{label}</legend>
      <div className="chip-group">
        {options.map((o) => <button key={o} type="button" className="chip" aria-pressed={value === o} onClick={() => onChange(o)}>{o}</button>)}
      </div>
    </fieldset>
  );
}

export function UseCaseRecommender() {
  const { updateContext, openChat } = useAdvisor();
  const [industry, setIndustry] = useState<Industry | null>(null);
  const [pain, setPain] = useState<Pain | null>(null);
  const [goal, setGoal] = useState<Goal | null>(null);
  const bp = useMemo(() => (industry && pain && goal ? recommend(industry, pain, goal) : null), [industry, pain, goal]);

  const sendToAdvisor = () => {
    if (!bp || !industry || !pain || !goal) return;
    updateContext({ blueprint: { industry, pain, goal, title: bp.title, timeline: bp.timeline } });
    openChat(`I'm in ${industry}. My biggest pain is "${pain}" and my goal is to "${goal}". You recommended the "${bp.title}" blueprint. Can we explore how it would work for us?`);
  };

  return (
    <div>
      <ChipQuestion n={1} label="Primary industry" options={industries} value={industry} onChange={setIndustry} />
      <ChipQuestion n={2} label="Biggest current pain point" options={pains} value={pain} onChange={setPain} />
      <ChipQuestion n={3} label="Primary goal" options={goals} value={goal} onChange={setGoal} />

      {bp ? (
        <article className="card blueprint" aria-live="polite">
          <span className="tag teal">Your Solution Blueprint</span>
          <h3 style={{ fontSize: '1.5rem', marginTop: 12 }}>{bp.title}</h3>
          <p>{bp.summary}</p>
          <div className="kv">
            <div><div className="label">Build timeline</div><b>{bp.timeline}</b></div>
            <div><div className="label">Engagement</div><b>{bp.engagement}</b></div>
            <div><div className="label">LLM stack</div><b style={{ fontSize: '.85rem' }}>{bp.llmStack}</b></div>
          </div>
          <div className="grid grid-2" style={{ gap: 24 }}>
            <div><div className="label">Recommended architecture</div><ul>{bp.architecture.map((a) => <li key={a}>{a}</li>)}</ul></div>
            <div><div className="label">KPIs we’d track</div><ul>{bp.kpis.map((k) => <li key={k}>{k}</li>)}</ul><p style={{ fontSize: '.88rem', marginTop: 12 }}>{bp.goalNote}</p></div>
          </div>
          <div className="btn-row" style={{ marginTop: 20 }}>
            <button className="btn btn-primary" onClick={sendToAdvisor}>Send this blueprint to our AI Assistant →</button>
            <Link href="/contact?from=blueprint" className="btn btn-secondary">Book a strategy call</Link>
          </div>
        </article>
      ) : (
        <div className="card" style={{ background: 'var(--canvas)', borderStyle: 'dashed', textAlign: 'center' }}>
          <p style={{ margin: 0 }}>Make 3 quick selections to generate your tailored Solution Blueprint.</p>
        </div>
      )}
    </div>
  );
}
