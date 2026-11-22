import type { Metadata } from 'next';
import { PageHero } from '@/components/PageHero';
import Link from 'next/link';
import { ContactForm } from '@/components/ContactForm';
import { Icon } from '@/components/Icon';
import { site } from '@/lib/content';

export const metadata: Metadata = { title: 'Contact & Strategy Call', description: 'Book a free 20-minute strategy call with an NSM Technologies AI architect.' };

const expect = [
  'A 20-minute call with a senior NSM architect',
  'Review of your assessment results and top bottlenecks',
  '2–3 prioritized AI opportunities with rough ROI',
  'A recommended next step: no pressure, no slides',
];

export default function Contact() {
  return (
    <>
      <PageHero image="/images/page-contact.webp" eyebrow="Contact & strategy call" title={<>Let’s Map Your <span className="accent-light">First AI Win.</span></>} lead="Tell us about your workflow. If you’ve used our assessment tools, your results are attached automatically so we can skip the basics." />
      <section className="section-sm">
        <div className="container split" style={{ alignItems: 'start' }}>
          <div className="card" style={{ padding: 'clamp(20px, 4vw, 36px)' }}><ContactForm /></div>
          <div>
            <div className="media-card rounded-media" style={{ marginBottom: 24 }}><span className="media media-wide"><img src="/images/tech-robot-learning.webp" alt="" loading="lazy" /></span></div>
            <h3>What to expect</h3>
            <ul className="checklist" style={{ marginBottom: 28 }}>{expect.map((e) => <li key={e}>{e}</li>)}</ul>
            <div className="card" style={{ background: 'var(--canvas)' }}>
              <div className="label">Haven’t assessed yet?</div>
              <p>Take the 10-minute AI readiness assessment first. It makes the call far more productive.</p>
              <Link href="/assess?tool=readiness" className="btn btn-secondary btn-sm">Start assessment <Icon name="arrow" size={16} /></Link>
            </div>
            <p style={{ marginTop: 20 }}>Prefer email? <a href={`mailto:${site.email}`}>{site.email}</a></p>
          </div>
        </div>
      </section>
    </>
  );
}
