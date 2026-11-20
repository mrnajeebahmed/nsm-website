'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { SAMPLE_PROJECT, computeOairi, type Answers, type DeInput } from '@/lib/oairi';
import { DecisionEngine, type ShortlistItem } from './DecisionEngine';
import { OairiAssessment } from './OairiAssessment';
import { DEFAULT_ROI, RoiCalculator, type RoiState } from './RoiCalculator';
import { UseCaseRecommender } from './UseCaseRecommender';
import { usePersistentState } from './usePersistentState';

const tools = [
  { id: 'readiness', title: 'AI Readiness (oAIRI)', sub: '15 questions · 5 pillars' },
  { id: 'project', title: 'Project Decision Engine', sub: 'Score & rank AI projects' },
  { id: 'roi', title: 'ROI Calculator', sub: 'Savings & payback' },
  { id: 'recommender', title: 'Find Your First AI Win', sub: '3 clicks · blueprint' },
] as const;
type ToolId = (typeof tools)[number]['id'];

export function AssessHub() {
  const params = useSearchParams();
  const [active, setActive] = useState<ToolId>('readiness');

  const [ans, setAns] = usePersistentState<Answers>('nsm-oairi', {});
  const [step, setStep] = usePersistentState<number>('nsm-oairi-step', 0);
  const [de, setDe] = usePersistentState<DeInput>('nsm-de', SAMPLE_PROJECT);
  const [list, setList] = usePersistentState<ShortlistItem[]>('nsm-de-list', []);
  const [roi, setRoi] = usePersistentState<RoiState>('nsm-roi3', DEFAULT_ROI);
  const res = useMemo(() => computeOairi(ans), [ans]);

  useEffect(() => {
    const t = params.get('tool');
    if (t && tools.some((x) => x.id === t)) setActive(t as ToolId);
  }, [params]);

  const go = (id: ToolId) => {
    setActive(id);
    history.replaceState(null, '', `?tool=${id}`);
    document.getElementById('tool-tabs')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div>
      <div className="tool-tabs no-print" id="tool-tabs" role="tablist" aria-label="Assessment tools" style={{ scrollMarginTop: 90 }}>
        {tools.map((t, i) => (
          <button key={t.id} role="tab" id={`tab-${t.id}`} aria-controls={`panel-${t.id}`} aria-selected={active === t.id}
            className="tool-tab" onClick={() => go(t.id)}>
            <span className="card-num">TOOL {String.fromCharCode(65 + i)}</span>
            <strong>{t.title}</strong><span>{t.sub}</span>
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`panel-${active}`} aria-labelledby={`tab-${active}`}>
        {active === 'readiness' && <OairiAssessment ans={ans} setAns={setAns} step={step} setStep={setStep} res={res} goProject={() => go('project')} />}
        {active === 'project' && <DecisionEngine de={de} setDe={setDe} list={list} setList={setList} res={res} />}
        {active === 'roi' && <RoiCalculator v={roi} setV={setRoi} toProject={() => { setDe({ ...de, p3: Math.max(de.p3, 2) }); go('project'); }} />}
        {active === 'recommender' && <div className="card" style={{ padding: 'clamp(20px, 4vw, 40px)' }}><UseCaseRecommender /></div>}
      </div>
    </div>
  );
}
