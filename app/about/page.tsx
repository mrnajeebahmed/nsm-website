import type { Metadata } from 'next';
import Link from 'next/link';
import { techStack } from '@/lib/content';
import { Icon } from '@/components/Icon';

export const metadata: Metadata = { title: 'About NSM', description: 'Practical intelligence for ambitious businesses: senior AI architects focused on measurable operational impact.' };

const values = [
  { icon: 'gauge' as const, t: 'Impact over hype', d: 'Every engagement is scoped to a measurable operational outcome: hours saved, response time, revenue per head.' },
  { icon: 'users' as const, t: 'Senior by default', d: 'You work directly with solution architects and AI engineers, not a layer of account managers.' },
  { icon: 'spark' as const, t: 'Pragmatic engineering', d: 'We pick the simplest architecture and the right-sized model that meets the accuracy and cost bar.' },
];

export default function About() {
  return (
    <>
      <section className="page-hero hero">
        <div className="container">
          <div className="eyebrow">About NSM Technologies</div>
          <h1>Practical Intelligence for <span className="accent">Ambitious Businesses.</span></h1>
          <p className="lead">Enterprise-grade AI shouldn’t be locked behind million-dollar consulting retainers. NSM Technologies was founded to give growing businesses direct access to senior solution architects and AI engineers who care about one metric: measurable operational impact.</p>
        </div>
      </section>
      <section className="section-sm" style={{ paddingTop: 0 }}>
        <div className="container grid grid-3">
          {values.map((v) => (
            <div key={v.t} className="card"><div className="icon-tile"><Icon name={v.icon} /></div><h3>{v.t}</h3><p>{v.d}</p></div>
          ))}
        </div>
      </section>
      <section className="section section-alt">
        <div className="container">
          <div className="section-head">
            <div className="eyebrow">Model-agnostic technology stack</div>
            <h2>The stack we build on</h2>
            <p className="lead">We choose models and platforms per use case for accuracy, cost, latency and data residency, and design for portability so you’re never locked in.</p>
          </div>
          <div className="grid grid-3">
            {techStack.map((g) => (
              <div key={g.group} className="card stack-group">
                <h3>{g.group}</h3>
                <div className="tags">{g.items.map((i) => <span key={i} className="tag">{i}</span>)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section-sm">
        <div className="container">
          <div className="cta-banner">
            <h2>Let’s find your highest-ROI AI opportunity.</h2>
            <p className="lead">A free 20-minute strategy call with an NSM architect, with no slides and no obligation.</p>
            <Link href="/contact" className="btn btn-primary">Book a Strategy Call <Icon name="arrow" size={18} /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
