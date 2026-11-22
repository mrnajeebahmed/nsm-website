import type { Metadata } from 'next';
import { PageHero } from '@/components/PageHero';
import Link from 'next/link';
import { deliverySteps, engagementModels } from '@/lib/content';
import { Icon } from '@/components/Icon';

export const metadata: Metadata = { title: 'How We Work', description: 'Six-step delivery lifecycle, transparent engagement models and full client ownership, with no vendor lock-in.' };

const guarantees = [
  { icon: 'lock' as const, t: 'You own everything', d: 'Code, agents, prompts, data pipelines and playbooks are yours, deployed in your cloud where possible.' },
  { icon: 'layers' as const, t: 'No model lock-in', d: 'A gateway architecture lets you switch between OpenAI, Claude, Gemini or open-weight models without a rewrite.' },
  { icon: 'shield' as const, t: 'Governed by design', d: 'Accuracy evals, guardrails, audit logs and human-in-the-loop review are built in, not bolted on.' },
];

export default function Approach() {
  return (
    <>
      <PageHero image="/images/page-approach.webp" eyebrow="How we work" title={<>Built for Speed, Transparency, <span className="accent-light">and Ownership.</span></>} lead="A proven, outcome-scoped delivery model that gets working systems into your operations in weeks, with no black boxes." />
      <section className="section-sm">
        <div className="container">
          <div className="card" style={{ padding: 'clamp(24px, 4vw, 48px)' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: 32 }}>Our 6-step delivery lifecycle</h2>
            <div className="stepper">
              {deliverySteps.map((s) => (
                <div key={s.num} className="step"><div className="step-dot">{s.num}</div><div><h3>{s.title}</h3><p>{s.body}</p></div></div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="section" id="engagement" style={{ scrollMarginTop: 120 }}>
        <div className="container">
          <div className="section-head"><div className="eyebrow">Engagement models</div><h2>Transparent ways to work together</h2></div>
          <div className="grid grid-3" style={{ alignItems: 'stretch' }}>
            {engagementModels.map((m) => (
              <article key={m.id} className={`card engagement ${m.featured ? 'featured' : ''}`}>
                {m.featured && <span className="badge">Most popular</span>}
                <span className="tag blue">{m.duration}</span>
                <h3 style={{ fontSize: '1.3rem', marginTop: 14 }}>{m.name}</h3>
                <p>{m.body}</p>
                <ul className="checklist">{m.includes.map((i) => <li key={i}>{i}</li>)}</ul>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section section-alt">
        <div className="container">
          <div className="split" style={{ marginBottom: 40 }}>
            <div>
              <div className="eyebrow">Ownership guarantees</div><h2>No vendor lock-in. Ever.</h2>
              <p className="lead">Everything we build is yours: deployed in your cloud, documented, and portable across AI providers.</p>
            </div>
            <div className="media-card rounded-media"><span className="media media-wide"><img src="/images/section-office.webp" alt="Modern open-plan office" loading="lazy" /></span></div>
          </div>
          <div className="grid grid-3">
            {guarantees.map((g) => (
              <div key={g.t} className="card"><div className="icon-tile teal"><Icon name={g.icon} /></div><h3>{g.t}</h3><p>{g.d}</p></div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <Link href="/contact" className="btn btn-primary">Start with an AI Opportunity Sprint <Icon name="arrow" size={18} /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
