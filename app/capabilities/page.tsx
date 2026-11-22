import type { Metadata } from 'next';
import { PageHero } from '@/components/PageHero';
import Link from 'next/link';
import { servicePillars, coreCapabilities } from '@/lib/content';
import { Icon } from '@/components/Icon';

export const metadata: Metadata = { title: 'Capabilities', description: 'AI strategy, intelligent workflow automation, generative AI knowledge agents, and digital product engineering.' };

export default function Capabilities() {
  return (
    <>
      <PageHero image="/images/page-capabilities.webp" eyebrow="Capabilities" title={<>From First Opportunity to <span className="accent-light">Production Operations.</span></>} lead="Comprehensive AI and digital transformation services designed for growing enterprises ready to move beyond experimentation." />
      <section className="section-sm">
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
                <div>
                  <div className="media-card rounded-media" style={{ marginBottom: 16 }}>
                    <span className="media media-wide"><img src={p.image} alt="" loading="lazy" /></span>
                  </div>
                  <div className="result-metric">
                    <div className="label">Deliverable</div>
                    <p style={{ color: 'var(--ink)', fontWeight: 600, fontSize: '1.05rem', marginBottom: 8 }}>{p.deliverable}</p>
                    <Link href="/contact" className="btn btn-ghost btn-sm">Discuss this service <Icon name="arrow" size={16} /></Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
          <article id="integration" className="card" style={{ scrollMarginTop: 90 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
              <div className="icon-tile teal" style={{ margin: 0 }}><Icon name="layers" /></div>
              <span className="card-num">FOUNDATION</span>
            </div>
            <div className="split" style={{ gap: 32, alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '1.6rem' }}>{coreCapabilities[3].title}</h2>
                <p>{coreCapabilities[3].short} {coreCapabilities[3].deliverable}</p>
              </div>
              <div className="media-card rounded-media"><span className="media media-wide"><img src={coreCapabilities[3].image} alt="" loading="lazy" /></span></div>
            </div>
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
