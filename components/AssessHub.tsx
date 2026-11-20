'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ReadinessQuiz } from './ReadinessQuiz';
import { RoiCalculator } from './RoiCalculator';
import { UseCaseRecommender } from './UseCaseRecommender';

const tools = [
  { id: 'readiness', title: 'AI Readiness Assessment', sub: '10 questions · 3 minutes' },
  { id: 'roi', title: 'Automation ROI Calculator', sub: 'Savings & payback estimate' },
  { id: 'recommender', title: 'Find Your First AI Win', sub: '3 clicks · solution blueprint' },
] as const;
type ToolId = (typeof tools)[number]['id'];

export function AssessHub() {
  const params = useSearchParams();
  const [active, setActive] = useState<ToolId>('readiness');
  useEffect(() => {
    const t = params.get('tool');
    if (t && tools.some((x) => x.id === t)) setActive(t as ToolId);
  }, [params]);

  return (
    <div>
      <div className="tool-tabs no-print" role="tablist" aria-label="Assessment tools">
        {tools.map((t, i) => (
          <button key={t.id} role="tab" id={`tab-${t.id}`} aria-controls={`panel-${t.id}`} aria-selected={active === t.id}
            className="tool-tab" onClick={() => { setActive(t.id); history.replaceState(null, '', `?tool=${t.id}`); }}>
            <span className="card-num">TOOL {String.fromCharCode(65 + i)}</span>
            <strong>{t.title}</strong><span>{t.sub}</span>
          </button>
        ))}
      </div>
      <div className="card" style={{ padding: 'clamp(20px, 4vw, 40px)' }} role="tabpanel" id={`panel-${active}`} aria-labelledby={`tab-${active}`}>
        {active === 'readiness' && <ReadinessQuiz />}
        {active === 'roi' && <RoiCalculator />}
        {active === 'recommender' && <UseCaseRecommender />}
      </div>
    </div>
  );
}
