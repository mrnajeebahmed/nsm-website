import type { Metadata } from 'next';
import { Suspense } from 'react';
import { AssessHub } from '@/components/AssessHub';

export const metadata: Metadata = { title: 'AI Readiness & ROI Hub', description: 'Benchmark your AI readiness, estimate automation ROI and discover your highest-leverage use cases. No sales call required.' };

export default function Assess() {
  return (
    <>
      <section className="page-hero hero no-print">
        <div className="container">
          <div className="eyebrow">AI readiness & ROI hub</div>
          <h1>Evaluate Your AI <span className="accent">Transformation Needs.</span></h1>
          <p className="lead">Interactive self-service tools to benchmark your readiness, estimate your automation ROI, and discover your highest-leverage use cases. No sales call required.</p>
        </div>
      </section>
      <section className="section-sm" style={{ paddingTop: 0 }}>
        <div className="container">
          <Suspense fallback={<div className="card">Loading tools…</div>}><AssessHub /></Suspense>
          <p className="no-print" style={{ fontSize: '.85rem', marginTop: 16, textAlign: 'center' }}>
            Your answers stay in your browser. They’re shared with our AI Advisor only when you choose to discuss them.
          </p>
        </div>
      </section>
    </>
  );
}
