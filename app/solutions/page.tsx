import type { Metadata } from 'next';
import { SolutionsMatrix } from '@/components/SolutionsMatrix';

export const metadata: Metadata = { title: 'Solutions & Use Cases', description: 'Filter real AI and automation use cases by department and industry.' };

export default function Solutions() {
  return (
    <>
      <section className="page-hero hero">
        <div className="container">
          <div className="eyebrow">Solutions matrix</div>
          <h1>Real AI Use Cases for <span className="accent">Growing Businesses.</span></h1>
          <p className="lead">Filter by your department or industry to see how intelligent automation solves everyday operational bottlenecks.</p>
        </div>
      </section>
      <section className="section-sm" style={{ paddingTop: 0 }}>
        <div className="container"><SolutionsMatrix /></div>
      </section>
    </>
  );
}
