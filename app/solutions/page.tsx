import type { Metadata } from 'next';
import { PageHero } from '@/components/PageHero';
import { Suspense } from 'react';
import { SolutionsMatrix } from '@/components/SolutionsMatrix';

export const metadata: Metadata = { title: 'Solutions & Use Cases', description: 'Filter real AI and automation use cases by department and industry.' };

export default function Solutions() {
  return (
    <>
      <PageHero image="/images/page-solutions.webp" eyebrow="Solutions matrix" title={<>Real AI Use Cases for <span className="accent-light">Growing Businesses.</span></>} lead="Filter by your department or industry to see how intelligent automation solves everyday operational bottlenecks." />
      <section className="section-sm">
        <div className="container"><Suspense fallback={null}><SolutionsMatrix /></Suspense></div>
      </section>
    </>
  );
}
