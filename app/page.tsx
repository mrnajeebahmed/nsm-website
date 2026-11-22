import Link from 'next/link';
import { coreCapabilities, deliverySteps, trustPillars, useCases } from '@/lib/content';
import { Icon } from '@/components/Icon';
import { QuickCheck } from '@/components/QuickCheck';
import { TechCarousel } from '@/components/TechCarousel';

export default function Home() {
  return (
    <>
      <section className="hero-corp">
        <img className="hero-bg" src="/images/hero-earth-network.webp" alt="" />
        <div className="hero-overlay" />
        <div className="container hero-corp-grid">
          <div className="hero-copy">
            <div className="eyebrow eyebrow-light">Your strategic partner for AI digital solutions</div>
            <h1>Solutions for Growing Businesses. <span className="accent-light">Built to Scale Intelligently.</span></h1>
            <p className="lead">From identifying the right opportunity to building and operating the systems behind it, we help bold businesses unlock AI at scale, automate core workflows, and launch future-ready operations.</p>
            <div className="btn-row">
              <Link href="/assess?tool=readiness" className="btn btn-primary btn-lg">Take the AI Readiness Assessment <Icon name="arrow" size={18} /></Link>
              <Link href="/solutions" className="btn btn-outline-light btn-lg">Explore Use Cases</Link>
            </div>
            <div className="hero-proof">
              <div><b>2–3 wks</b><span>to a working proof of concept</span></div>
              <div><b>6–10 wks</b><span>to production</span></div>
              <div><b>100%</b><span>client-owned IP</span></div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-frame media-card">
              <span className="media"><img src="/images/hero-ai.webp" alt="Abstract 3D rendering of the letters AI" /></span>
            </div>
            <div className="float-card float-a">
              <span className="float-icon"><Icon name="spark" size={18} /></span>
              <div><b>5x</b><span>faster speed-to-lead</span></div>
            </div>
            <div className="float-card float-b">
              <span className="float-icon teal"><Icon name="layers" size={18} /></span>
              <div><b>Model-agnostic</b><span>OpenAI · Claude · Gemini</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="trust-band">
        <div className="container">
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

      <section className="section">
        <div className="container split">
          <div className="image-stack">
            <div className="media-card rounded-media">
              <span className="media"><img src="/images/section-difference.webp" alt="Two colleagues celebrating a successful project at a laptop" loading="lazy" /></span>
            </div>
            <div className="stat-badge">
              <b>80%</b><span>less manual data entry with intelligent document processing</span>
            </div>
          </div>
          <div>
            <div className="eyebrow">The NSM difference</div>
            <h2>Transform Your Business with Intelligent AI</h2>
            <p className="lead">Most businesses don’t fail at AI because of the technology. They stall because they start with tools instead of operational bottlenecks.</p>
            <p>At NSM Technologies, we bridge the gap between strategic AI consultation and complete automation implementation. Whether you are modernizing legacy workflows or launching AI-powered customer experiences, we engineer systems that pay for themselves.</p>
            <div className="stat-row" style={{ margin: '24px 0' }}>
              <div className="stat"><b>5x</b><span>faster speed-to-lead</span></div>
              <div className="stat"><b>60–75%</b><span>Tier-1 ticket deflection</span></div>
              <div className="stat"><b>50%</b><span>faster new-hire ramp-up</span></div>
            </div>
            <Link href="/approach" className="btn btn-ghost">See how we work <Icon name="arrow" size={18} /></Link>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-head">
            <div className="eyebrow">Core capabilities</div>
            <h2>Everything you need to move from AI idea to AI in production</h2>
          </div>
          <div className="grid grid-4">
            {coreCapabilities.map((c) => (
              <Link key={c.id} href={`/capabilities#${c.id}`} className="card media-card image-card">
                <span className="media"><img src={c.image} alt="" loading="lazy" /></span>
                <span className="image-card-body">
                  <span className="icon-tile floating"><Icon name={c.icon} /></span>
                  <h3>{c.title}</h3>
                  <p>{c.short}</p>
                  <span className="card-link">Learn more <Icon name="arrow" size={16} /></span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head row-head">
            <div>
              <div className="eyebrow">AI & technology in action</div>
              <h2 style={{ margin: 0 }}>The technology behind every NSM engagement</h2>
            </div>
            <Link href="/about#stack" className="btn btn-secondary">Our technology stack</Link>
          </div>
          <TechCarousel />
        </div>
      </section>

      <section className="section-sm">
        <div className="container">
          <div className="cta-banner cta-image">
            <img className="cta-bg" src="/images/tech-network.webp" alt="" loading="lazy" />
            <div className="cta-content split">
              <div>
                <div className="eyebrow eyebrow-light">Interactive assessment hub</div>
                <h2>Not sure where AI fits in your business?</h2>
                <p className="lead">Benchmark your organization on the five AIRI readiness pillars, score and rank your candidate AI projects, and size the savings. No sales call required.</p>
                <div className="btn-row">
                  <Link href="/assess" className="btn btn-primary">Launch Interactive Assessment Hub <Icon name="arrow" size={18} /></Link>
                  <Link href="/assess?tool=roi" className="btn btn-outline-light">Open ROI Calculator</Link>
                </div>
              </div>
              <QuickCheck />
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
          <div className="section-head row-head">
            <div><div className="eyebrow">Popular first wins</div><h2 style={{ margin: 0 }}>Real use cases, measurable impact</h2></div>
            <Link href="/solutions" className="btn btn-secondary">View all use cases</Link>
          </div>
          <div className="grid grid-4">
            {useCases.slice(0, 4).map((u) => (
              <Link key={u.id} href={`/solutions#${u.id}`} className="card media-card image-card">
                <span className="media"><img src={u.image} alt="" loading="lazy" /></span>
                <span className="image-card-body">
                  <h3 style={{ fontSize: '1.02rem' }}>{u.title}</h3>
                  <p>{u.solution.slice(0, 110)}…</p>
                  <span className="tag teal">{u.impact}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
