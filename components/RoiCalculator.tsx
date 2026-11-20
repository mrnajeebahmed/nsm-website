'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { calculateRoi, efficiencyRates, fmtMoney, fmtNum, type Efficiency } from '@/lib/roi';
import { useAdvisor } from './AdvisorProvider';

function Slider(p: { id: string; label: string; min: number; max: number; step?: number; value: number; onChange: (v: number) => void; format: (v: number) => string }) {
  return (
    <div className="range-row">
      <div className="range-head">
        <label htmlFor={p.id}>{p.label}</label>
        <output htmlFor={p.id}>{p.format(p.value)}</output>
      </div>
      <input id={p.id} type="range" min={p.min} max={p.max} step={p.step ?? 1} value={p.value} onChange={(e) => p.onChange(Number(e.target.value))} />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.75rem', color: 'var(--muted)' }}><span>{p.format(p.min)}</span><span>{p.format(p.max)}</span></div>
    </div>
  );
}

export function RoiCalculator() {
  const { updateContext, openChat } = useAdvisor();
  const [teamSize, setTeam] = useState(12);
  const [hoursPerWeek, setHours] = useState(10);
  const [hourlyRate, setRate] = useState(35);
  const [efficiency, setEff] = useState<Efficiency>('realistic');
  const r = useMemo(() => calculateRoi({ teamSize, hoursPerWeek, hourlyRate, efficiency }), [teamSize, hoursPerWeek, hourlyRate, efficiency]);

  // Debounced share to advisor context.
  useEffect(() => {
    const t = setTimeout(() => updateContext({
      roi: { teamSize, hoursPerWeek, hourlyRate, efficiency, annualSavings: r.annualSavings, annualHoursReclaimed: r.annualHoursReclaimed, paybackMonths: r.paybackMonths, engagement: r.engagement.name },
    }), 500);
    return () => clearTimeout(t);
  }, [teamSize, hoursPerWeek, hourlyRate, efficiency, r, updateContext]);

  return (
    <div className="split" style={{ alignItems: 'start', gap: 40 }}>
      <div>
        <Slider id="team" label="Employees doing repetitive admin/ops tasks" min={1} max={200} value={teamSize} onChange={setTeam} format={(v) => `${v}`} />
        <Slider id="hours" label="Hours per person per week on manual work" min={2} max={30} value={hoursPerWeek} onChange={setHours} format={(v) => `${v} hrs`} />
        <Slider id="rate" label="Fully loaded hourly employee cost" min={15} max={100} value={hourlyRate} onChange={setRate} format={(v) => `$${v}/hr`} />
        <div className="range-head"><label id="eff-l">Expected automation efficiency</label></div>
        <div className="seg" role="group" aria-labelledby="eff-l">
          {(Object.keys(efficiencyRates) as Efficiency[]).map((k) => (
            <button key={k} aria-pressed={efficiency === k} onClick={() => setEff(k)}>{efficiencyRates[k].label}</button>
          ))}
        </div>
        <p style={{ fontSize: '.8rem', marginTop: 16 }}>Assumes 48 working weeks/year. Investment bands are indicative and confirmed after scoping.</p>
      </div>
      <div className="card" aria-live="polite">
        <div className="grid grid-2" style={{ gap: 12 }}>
          <div className="result-metric"><div className="label">Annual hours reclaimed</div><b>{fmtNum(r.annualHoursReclaimed)}</b><span style={{ fontSize: '.8rem' }}>≈ {r.fteEquivalent} FTE capacity</span></div>
          <div className="result-metric"><div className="label">Est. annual savings</div><b>{fmtMoney(r.annualSavings)}</b><span style={{ fontSize: '.8rem' }}>{fmtMoney(r.annualSavings / 12)} / month</span></div>
        </div>
        <div className="result-metric blue" style={{ marginTop: 12 }}>
          <div className="label">Suggested NSM engagement</div>
          <b style={{ fontSize: '1.2rem' }}>{r.engagement.name}</b>
          <p style={{ margin: '6px 0 0', fontSize: '.9rem' }}>{r.engagement.description}</p>
          <div style={{ display: 'flex', gap: 20, marginTop: 12, flexWrap: 'wrap', fontSize: '.9rem', color: 'var(--ink)' }}>
            <span>Indicative investment: <strong>{fmtMoney(r.engagement.investmentRange[0])}–{fmtMoney(r.engagement.investmentRange[1])}</strong></span>
            <span>Payback: <strong className="teal">~{r.paybackMonths} months</strong></span>
          </div>
        </div>
        <div className="btn-row" style={{ marginTop: 20 }}>
          <button className="btn btn-primary" onClick={() => openChat(`My ROI estimate shows ${fmtMoney(r.annualSavings)}/year in savings (${teamSize} people, ${hoursPerWeek} hrs/week, $${hourlyRate}/hr). Which workflows should we automate first to capture this?`)}>
            Discuss with AI Advisor
          </button>
          <Link href="/contact?from=roi" className="btn btn-secondary">Validate with an architect</Link>
        </div>
      </div>
    </div>
  );
}
