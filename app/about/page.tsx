import type { Metadata } from 'next';
import { PageHero } from '@/components/PageHero';
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
      <PageHero image="/images/page-about.webp" eyebrow="About NSM Technologies" title={<>Practical Intelligence for <span className="accent-light">Ambitious Businesses.</span></>} lead="Enterprise-grade AI shouldn’t be locked behind million-dollar consulting retainers. NSM Technologies was founded to give growing businesses direct access to senior solution architects and AI engineers who care about one metric: measurable operational impact." />
      <section className="section-sm">
        <div className="container grid grid-3">
          {values.map((v) => (
            <div key={v.t} className="card"><div className="icon-tile"><Icon name={v.icon} /></div><h3>{v.t}</h3><p>{v.d}</p></div>
          ))}
        </div>
      </section>
      <section className="section">
        <div className="container split">
          <div className="media-card rounded-media"><span className="media media-tall"><img src="/images/section-team.webp" alt="NSM architects and engineers collaborating" loading="lazy" /></span></div>
          <div>
            <div className="eyebrow">Senior by default</div>
            <h2>Direct access to the people who build your systems</h2>
            <p className="lead">No hand-offs from sales to a junior delivery team. The architects who scope your engagement are the ones who design, build and hand it over.</p>
            <ul className="checklist">
              <li>Solution architects and AI engineers on every engagement</li>
              <li>Weekly demos on real business data, not slideware</li>
              <li>Documentation and training so your team can own it</li>
            </ul>
          </div>
        </div>
      </section>
      <section className="section section-alt" id="stack" style={{ scrollMarginTop: 120 }}>
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
