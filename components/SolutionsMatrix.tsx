'use client';

import { useState } from 'react';
import { useCaseFilters, useCases, type UseCaseFilter } from '@/lib/content';
import { useAdvisor } from './AdvisorProvider';

export function SolutionsMatrix() {
  const [filter, setFilter] = useState<UseCaseFilter>('All');
  const { openChat } = useAdvisor();
  const list = filter === 'All' ? useCases : useCases.filter((u) => u.categories.includes(filter));

  return (
    <>
      <div className="seg" role="tablist" aria-label="Filter use cases" style={{ marginBottom: 28 }}>
        {useCaseFilters.map((f) => (
          <button key={f} role="tab" aria-selected={filter === f} onClick={() => setFilter(f)}>
            {f} <span style={{ opacity: .6 }}>({f === 'All' ? useCases.length : useCases.filter((u) => u.categories.includes(f)).length})</span>
          </button>
        ))}
      </div>
      <div className="grid grid-2">
        {list.map((u) => (
          <article key={u.id} className="card card-hover usecase">
            <div className="tags" style={{ marginBottom: 12 }}>{u.categories.map((c) => <span key={c} className="tag">{c}</span>)}</div>
            <h3>{u.title}</h3>
            <div className="uc-block"><div className="label">The bottleneck</div><p>{u.bottleneck}</p></div>
            <div className="uc-block"><div className="label">The NSM solution</div><p>{u.solution}</p></div>
            <div className="uc-block"><div className="label">Typical stack</div><p style={{ fontSize: '.85rem' }}>{u.stack}</p></div>
            <div className="impact">
              <span><span className="label" style={{ display: 'block' }}>Typical impact</span><b>{u.impact}</b></span>
              <button className="btn btn-secondary btn-sm" onClick={() => openChat(`Tell me how "${u.title}" would work for my business. What do you need to know about our setup?`)}>
                Discuss with AI
              </button>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
