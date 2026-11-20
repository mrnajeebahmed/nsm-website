import Link from 'next/link';
import { site } from '@/lib/content';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Link href="/" className="logo"><span className="logo-mark">NSM</span><span>NSM Technologies<small>AI DIGITAL SOLUTIONS</small></span></Link>
            <p style={{ marginTop: 16, maxWidth: 340, fontSize: '.92rem' }}>
              Your strategic partner for AI digital solutions. From first opportunity to production operations, built for growing businesses.
            </p>
          </div>
          <div>
            <h4>Services</h4>
            <ul>
              <li><Link href="/capabilities">Capabilities</Link></li>
              <li><Link href="/solutions">Use Cases</Link></li>
              <li><Link href="/approach">How We Work</Link></li>
            </ul>
          </div>
          <div>
            <h4>Tools</h4>
            <ul>
              <li><Link href="/assess?tool=readiness">AI Readiness Assessment</Link></li>
              <li><Link href="/assess?tool=project">Project Decision Engine</Link></li>
              <li><Link href="/assess?tool=roi">ROI Calculator</Link></li>
              <li><Link href="/assess?tool=recommender">Find Your First AI Win</Link></li>
            </ul>
          </div>
          <div>
            <h4>Company</h4>
            <ul>
              <li><Link href="/about">About NSM</Link></li>
              <li><Link href="/contact">Book a Strategy Call</Link></li>
              <li><a href={`mailto:${site.email}`}>{site.email}</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} NSM Technologies. All rights reserved.</span>
          <span>Model-agnostic · 100% client-owned · No vendor lock-in</span>
        </div>
      </div>
    </footer>
  );
}
