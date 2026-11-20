'use client';

import { useState, type FormEvent } from 'react';
import { useAdvisor } from './AdvisorProvider';
import { fmtMoney } from '@/lib/roi';

export function ContactForm() {
  const { context } = useAdvisor();
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [ref, setRef] = useState<{ reference: string; bookingUrl?: string } | null>(null);

  const hasContext = Boolean(context.assessment || context.roi || context.blueprint);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setStatus('sending');
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...data, context }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Submission failed');
      setRef(json);
      setStatus('done');
    } catch (err) {
      setError((err as Error).message);
      setStatus('idle');
    }
  }

  if (status === 'done' && ref) {
    return (
      <div className="form-success">
        <h3 className="teal">Request received ✓</h3>
        <p style={{ color: 'var(--body)' }}>Thanks! Your reference is <strong>{ref.reference}</strong>. An NSM architect will reply within one business day with times for your 20-minute strategy call.</p>
        {ref.bookingUrl?.startsWith('http') && <a className="btn btn-primary" href={ref.bookingUrl} target="_blank" rel="noopener noreferrer">Pick a time now →</a>}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      {hasContext && (
        <div className="result-metric" style={{ marginBottom: 20, padding: 14 }}>
          <div className="label">Attached from your self-assessment</div>
          <div className="tags" style={{ marginTop: 6 }}>
            {context.assessment && <span className="tag teal">Readiness {context.assessment.overall}/100 · {context.assessment.tier}</span>}
            {context.roi && <span className="tag teal">Est. savings {fmtMoney(context.roi.annualSavings)}/yr</span>}
            {context.blueprint && <span className="tag teal">{context.blueprint.title}</span>}
          </div>
        </div>
      )}
      <div className="grid grid-2" style={{ gap: '0 16px' }}>
        <div className="field"><label htmlFor="name">Full name *</label><input className="input" id="name" name="name" required autoComplete="name" /></div>
        <div className="field"><label htmlFor="email">Business email *</label><input className="input" id="email" name="email" type="email" required autoComplete="email" /></div>
        <div className="field"><label htmlFor="company">Company *</label><input className="input" id="company" name="company" required autoComplete="organization" /></div>
        <div className="field"><label htmlFor="role">Role</label><input className="input" id="role" name="role" autoComplete="organization-title" /></div>
      </div>
      <div className="field">
        <label htmlFor="summary">What workflow or challenge would you like to discuss? *</label>
        <textarea className="textarea" id="summary" name="summary" required minLength={10}
          placeholder="e.g. Our 6-person finance team manually keys ~900 vendor invoices a month into NetSuite…" />
      </div>
      {/* Honeypot */}
      <div aria-hidden style={{ position: 'absolute', left: '-9999px' }}><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="btn btn-primary" type="submit" disabled={status === 'sending'} style={{ width: '100%' }}>
        {status === 'sending' ? 'Sending…' : 'Request my free strategy call'}
      </button>
      <p style={{ fontSize: '.8rem', marginTop: 12 }}>No obligation. We’ll only use your details to respond to this request.</p>
    </form>
  );
}
