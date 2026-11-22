import type { Metadata } from 'next';
import { PageHero } from '@/components/PageHero';
import { Suspense } from 'react';
import { AssessHub } from '@/components/AssessHub';

export const metadata: Metadata = { title: 'AI Readiness & ROI Hub', description: 'Benchmark your AI readiness, estimate automation ROI and discover your highest-leverage use cases. No sales call required.' };

export default function Assess() {
  return (
    <>
      <PageHero className="no-print" image="/images/page-assess.webp" eyebrow="AI readiness & ROI hub" title={<>Evaluate Your AI <span className="accent-light">Transformation Needs.</span></>} lead="Benchmark your organization on the five AIRI pillars, score your first AI project, and size the savings. No sales call required." />
      <section className="section-sm">
        <div className="container">
          <Suspense fallback={<div className="card">Loading tools…</div>}><AssessHub /></Suspense>
          <p className="no-print" style={{ fontSize: '.85rem', marginTop: 16, textAlign: 'center' }}>
            Your answers stay in your browser. They’re shared with our AI Advisor only when you open the chat.
          </p>
          <p className="attribution">
            Readiness assessment and Decision Engine adapted from the AIRI Framework v3.2 (oAIRI) and AIRI Decision Engine v3.0 by Laurence Liew,{' '}
            <a href="https://airi.foundation" target="_blank" rel="noopener noreferrer">airi.foundation</a>, licensed under{' '}
            <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">CC BY 4.0</a>. Wording lightly edited for US English.
            NSM Technologies is not affiliated with airi.foundation or AI Singapore. Estimates are directional; an NSM architect can validate them with you in a 20-minute strategy session.
          </p>
        </div>
      </section>
    </>
  );
}
