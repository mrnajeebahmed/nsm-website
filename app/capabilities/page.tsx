import type { Metadata } from 'next';
import Link from 'next/link';
import { servicePillars, coreCapabilities } from '@/lib/content';
import { Icon } from '@/components/Icon';

export const metadata: Metadata = { title: 'Capabilities', description: 'AI strategy, intelligent workflow automation, generative AI knowledge agents, and digital product engineering.' };

export default function Capabilities() {
  return (
    <>
      <section className="page-hero hero">
        <div className="container">
          <div className="eyebrow">Capabilities</div>
          <h1>From First Opportunity to <span className="accent">Production Operations.</span></h1>
          <p className="lead">Comprehensive AI and digital transformation services designed for growing enterprises ready to move beyond experimentation.</p>
        </div>
      </section>
      <section className="section-sm" style={{ paddingTop: 0 }}>
        <div className="container" style={{ display: 'grid', gap: 20 }}>
          {servicePillars.map((p) => (
            <article key={p.id} id={p.id} className="card" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 0, scrollMarginTop: 90 }}>
              <div className="split" style={{ gap: 32, alignItems: 'start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
                    <div className="icon-tile" style={{ margin: 0 }}><Icon name={p.icon} /></div>
                    <span className="card-num">{p.num}</span>
                  </div>
                  <h2 style={{ fontSize: '1.6rem' }}>{p.title}</h2>
                  <div className="label">What we do</div>
                  <p>{p.what}</p>
                </div>
                <div className="result-metric" style={{ alignSelf: 'stretch' }}>
                  <div className="label">Deliverable</div>
                  <p style={{ color: 'var(--ink)', fontWeight: 600, fontSize: '1.05rem' }}>{p.deliverable}</p>
                  <Link href="/contact" className="btn btn-ghost btn-sm">Discuss this service <Icon name="arrow" size={16} /></Link>
                </div>
              </div>
            </article>
          ))}
          <article id="integration" className="card" style={{ scrollMarginTop: 90 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
              <div className="icon-tile teal" style={{ margin: 0 }}><Icon name="layers" /></div>
              <span className="card-num">FOUNDATION</span>
            </div>
            <h2 style={{ fontSize: '1.6rem' }}>{coreCapabilities[3].title}</h2>
            <p>{coreCapabilities[3].short} {coreCapabilities[3].deliverable}</p>
          </article>
        </div>
      </section>
      <section className="section-sm">
        <div className="container">
          <div className="cta-banner">
            <h2>Not sure which capability you need first?</h2>
            <p className="lead">Answer 3 quick questions and get a tailored solution blueprint with architecture, LLM stack and timeline.</p>
            <Link href="/assess?tool=recommender" className="btn btn-primary">Find Your First AI Win <Icon name="arrow" size={18} /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
