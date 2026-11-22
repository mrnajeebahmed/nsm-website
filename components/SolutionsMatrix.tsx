'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCaseFilters, useCases, type UseCaseFilter } from '@/lib/content';
import { useAdvisor } from './AdvisorProvider';

export function SolutionsMatrix() {
  const params = useSearchParams();
  const [filter, setFilter] = useState<UseCaseFilter>('All');
  const { openChat } = useAdvisor();
  useEffect(() => {
    const f = params.get('f');
    if (f && (useCaseFilters as readonly string[]).includes(f)) setFilter(f as UseCaseFilter);
    const hash = window.location.hash.slice(1);
    if (hash) setTimeout(() => document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  }, [params]);
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
          <article key={u.id} id={u.id} className="card media-card usecase" style={{ scrollMarginTop: 150 }}>
            <span className="media usecase-media"><img src={u.image} alt="" loading="lazy" /></span>
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
