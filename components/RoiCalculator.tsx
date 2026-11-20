'use client';

import { useEffect, useMemo } from 'react';
import { WORK_WEEKS, calculateRoi, efficiencyRates, fmtMoney, fmtNum, type Efficiency } from '@/lib/roi';
import { useAdvisor } from './AdvisorProvider';
import { ContextPayload } from './ContextPayload';

export type RoiState = { teamSize: number; hoursPerWeek: number; hourlyRate: number; efficiency: Efficiency; investment: number | null };
export const DEFAULT_ROI: RoiState = { teamSize: 12, hoursPerWeek: 10, hourlyRate: 35, efficiency: 'realistic', investment: null };

const sliders = [
  { k: 'teamSize', l: 'People doing repetitive admin or ops tasks', min: 1, max: 200, f: (x: number) => `${x}` },
  { k: 'hoursPerWeek', l: 'Hours each spends per week on manual work', min: 2, max: 30, f: (x: number) => `${x} hrs` },
  { k: 'hourlyRate', l: 'Average fully loaded hourly cost', min: 15, max: 100, f: (x: number) => `$${x}/hr` },
] as const;

export function RoiCalculator({ v, setV, toProject }: { v: RoiState; setV: (v: RoiState) => void; toProject: () => void }) {
  const { updateContext, openChat } = useAdvisor();
  const r = useMemo(() => calculateRoi(v), [v]);

  useEffect(() => {
    const t = setTimeout(() => updateContext({
      roi: {
        teamSize: v.teamSize, hoursPerWeek: v.hoursPerWeek, hourlyRate: v.hourlyRate, efficiency: v.efficiency,
        annualSavings: r.annualSavings, annualHoursReclaimed: r.annualHoursReclaimed, paybackMonths: r.paybackMonths, engagement: r.engagement.name,
      },
    }), 500);
    return () => clearTimeout(t);
  }, [v, r, updateContext]);

  return (
    <div className="tool-grid">
      <div className="card">
        <p className="kicker">Your inputs</p>
        <h2 style={{ fontSize: '1.5rem' }}>How much manual work is in your week?</h2>
        {sliders.map((s) => (
          <div className="range-row" key={s.k} style={{ marginTop: 18 }}>
            <div className="range-head">
              <label htmlFor={`r-${s.k}`}>{s.l}</label>
              <output htmlFor={`r-${s.k}`}>{s.f(v[s.k])}</output>
            </div>
            <input id={`r-${s.k}`} type="range" min={s.min} max={s.max} value={v[s.k]} onChange={(e) => setV({ ...v, [s.k]: Number(e.target.value) })} />
          </div>
        ))}
        <div className="range-head"><label id="eff-l">Expected automation efficiency</label></div>
        <div className="seg-3" role="group" aria-labelledby="eff-l">
          {(Object.keys(efficiencyRates) as Efficiency[]).map((k) => (
            <button key={k} aria-pressed={v.efficiency === k} onClick={() => setV({ ...v, efficiency: k })}>
              {efficiencyRates[k].label}<br /><span className="small muted">{efficiencyRates[k].pct}</span>
            </button>
          ))}
        </div>
        <p className="small muted" style={{ marginTop: 16 }}>
          Based on {WORK_WEEKS} working weeks a year. Today that’s {fmtNum(r.manualHours)} hours of manual work, costing {fmtMoney(r.manualCost)} a year.
        </p>
      </div>

      <div className="card sticky-panel">
        <p className="kicker">Estimated annual savings</p>
        <div className="big-num" aria-live="polite">{fmtMoney(r.annualSavings)}</div>
        <div className="stats-2">
          <div className="stat-box"><span>Hours reclaimed / year</span><b>{fmtNum(r.annualHoursReclaimed)}</b></div>
          <div className="stat-box"><span>Full-time equivalent</span><b>{r.fteEquivalent.toFixed(1)} FTE</b></div>
          <div className="stat-box"><span>Payback after go-live</span><b>{r.paybackMonths.toFixed(1)} months</b></div>
          <div className="stat-box"><span>First-year return</span><b>{r.firstYearReturn.toFixed(1)}x</b></div>
        </div>
        <div className="callout">
          <h3>Suggested engagement: {r.engagement.name}</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <label htmlFor="inv" className="small muted">Estimated investment ($)</label>
            <input id="inv" className="input" style={{ width: '9em' }} type="number" min={0} step={1000} value={r.investment}
              onChange={(e) => setV({ ...v, investment: e.target.value === '' ? null : Math.max(0, Number(e.target.value)) })} />
            {v.investment != null && <button className="btn btn-secondary btn-sm" onClick={() => setV({ ...v, investment: null })}>Reset</button>}
          </div>
          <p className="small" style={{ margin: '12px 0 0' }}>An estimated ROI is what the Decision Engine calls an L2 business case.</p>
          <div className="btn-row no-print" style={{ marginTop: 12 }}>
            <button className="btn btn-primary" onClick={toProject}>Score this as a project</button>
            <button className="btn btn-secondary" onClick={() => openChat(`My ROI estimate shows ${fmtMoney(r.annualSavings)}/year in savings (${v.teamSize} people, ${v.hoursPerWeek} hrs/week, $${v.hourlyRate}/hr). Which workflows should we automate first to capture this?`)}>
              Discuss with AI Advisor
            </button>
          </div>
          <ContextPayload data={{ source: 'roi_calculator', team_size: v.teamSize, manual_hours_per_week: v.hoursPerWeek, hourly_rate: v.hourlyRate, efficiency: efficiencyRates[v.efficiency].rate, annual_hours_reclaimed: r.annualHoursReclaimed, annual_savings_usd: r.annualSavings, suggested_engagement: r.engagement.name, payback_months: r.paybackMonths }} />
        </div>
        <p className="small muted" style={{ marginTop: 14, marginBottom: 0 }}>Reclaimed hours become savings only when that time is redeployed or hiring is avoided. Investment figures are indicative.</p>
      </div>
    </div>
  );
}
