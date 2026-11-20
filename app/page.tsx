import Link from 'next/link';
import { coreCapabilities, deliverySteps, trustPillars, useCases } from '@/lib/content';
import { Icon } from '@/components/Icon';
import { QuickCheck } from '@/components/QuickCheck';

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="hero-grid">
            <div>
              <div className="eyebrow">Your strategic partner for AI digital solutions</div>
              <h1>Solutions for Growing Businesses. <span className="accent">Built to Scale Intelligently.</span></h1>
              <p className="lead">From identifying the right opportunity to building and operating the systems behind it, we help bold businesses unlock AI at scale, automate core workflows, and launch future-ready operations.</p>
              <div className="btn-row">
                <Link href="/assess?tool=readiness" className="btn btn-primary">Take the 3-Minute AI Readiness Assessment <Icon name="arrow" size={18} /></Link>
                <Link href="/solutions" className="btn btn-secondary">Explore Use Cases</Link>
              </div>
            </div>
            <QuickCheck />
          </div>
          <div className="trust-strip">
            {trustPillars.map((p) => (
              <div key={p.title} className="trust-item">
                <span className="check-dot"><Icon name="check" size={14} /></span>
                <div><strong>{p.title}</strong><span>{p.body}</span></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container split">
          <div>
            <div className="eyebrow">The NSM difference</div>
            <h2>Transform Your Business with Intelligent AI</h2>
            <p className="lead">Most businesses don’t fail at AI because of the technology. They stall because they start with tools instead of operational bottlenecks.</p>
            <p>At NSM Technologies, we bridge the gap between strategic AI consultation and complete automation implementation. Whether you are modernizing legacy workflows or launching AI-powered customer experiences, we engineer systems that pay for themselves.</p>
            <Link href="/approach" className="btn btn-ghost">See how we work <Icon name="arrow" size={18} /></Link>
          </div>
          <div className="stat-row">
            <div className="stat"><b>5x</b><span>faster speed-to-lead with AI intake</span></div>
            <div className="stat"><b>80%</b><span>less manual data entry</span></div>
            <div className="stat"><b>60–75%</b><span>Tier-1 ticket deflection</span></div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div className="eyebrow">Core capabilities</div>
            <h2>Everything you need to move from AI idea to AI in production</h2>
          </div>
          <div className="grid grid-4">
            {coreCapabilities.map((c) => (
              <Link key={c.id} href={`/capabilities#${c.id}`} className="card card-hover" style={{ color: 'inherit' }}>
                <div className="icon-tile"><Icon name={c.icon} /></div>
                <h3>{c.title}</h3>
                <p style={{ fontSize: '.93rem' }}>{c.short}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-sm">
        <div className="container">
          <div className="cta-banner">
            <div className="eyebrow" style={{ color: '#5EEAD4' }}>Interactive assessment hub</div>
            <h2>Not sure where AI fits in your business?</h2>
            <p className="lead">Use our self-service diagnostic tools to benchmark your AI maturity, calculate potential labor savings, and generate a custom use-case shortlist in under 3 minutes.</p>
            <div className="btn-row" style={{ position: 'relative', zIndex: 1 }}>
              <Link href="/assess" className="btn btn-primary">Launch Interactive Assessment Hub <Icon name="arrow" size={18} /></Link>
              <Link href="/assess?tool=roi" className="btn btn-secondary">Open ROI Calculator</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head center">
            <div className="eyebrow">Delivery framework</div>
            <h2>Six steps from bottleneck to production</h2>
          </div>
          <div className="stepper">
            {deliverySteps.map((s) => (
              <div key={s.num} className="step"><div className="step-dot">{s.num}</div><div><h3>{s.title}</h3><p>{s.body}</p></div></div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', maxWidth: 'none', flexWrap: 'wrap', gap: 16 }}>
            <div><div className="eyebrow">Popular first wins</div><h2 style={{ margin: 0 }}>Real use cases, measurable impact</h2></div>
            <Link href="/solutions" className="btn btn-secondary">View all use cases</Link>
          </div>
          <div className="grid grid-4">
            {useCases.slice(0, 4).map((u) => (
              <div key={u.id} className="card">
                <h3 style={{ fontSize: '1.02rem' }}>{u.title}</h3>
                <p style={{ fontSize: '.9rem' }}>{u.solution.slice(0, 110)}…</p>
                <span className="tag teal">{u.impact}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
