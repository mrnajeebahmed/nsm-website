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
        <div className="container cap-list">
          {[...servicePillars, { ...coreCapabilities[3], num: '05' }].map((p, i) => (
            <article key={p.id} id={p.id} className={`cap-row ${i % 2 ? 'reverse' : ''}`}>
              <div className="cap-media media-card">
                <span className="media"><img src={p.image} alt="" loading="lazy" /></span>
                <span className="cap-num">{p.num}</span>
              </div>
              <div className="cap-body">
                <div className="icon-tile"><Icon name={p.icon} /></div>
                <h2>{p.title}</h2>
                <div className="label">What we do</div>
                <p>{p.what}</p>
                <div className="cap-deliverable">
                  <span className="check-dot"><Icon name="check" size={14} /></span>
                  <div><div className="label" style={{ color: 'var(--teal)' }}>Deliverable</div><p>{p.deliverable}</p></div>
                </div>
                <Link href="/contact" className="btn btn-secondary">Discuss this service <Icon name="arrow" size={16} /></Link>
              </div>
            </article>
          ))}
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
