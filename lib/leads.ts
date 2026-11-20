// Lead capture service shared by the contact form and the chatbot tool.
// Forwards to a CRM/automation webhook (HubSpot, Salesforce, n8n, Make, Zapier).

export type Lead = {
  name: string;
  email: string;
  company: string;
  summary: string;
  source: 'contact_form' | 'ai_advisor';
  role?: string;
  phone?: string;
  context?: unknown;
};

export type LeadValidation = { ok: true; lead: Lead } | { ok: false; error: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const clean = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

export function validateLead(input: Record<string, unknown>, source: Lead['source']): LeadValidation {
  const lead: Lead = {
    name: clean(input.name, 120),
    email: clean(input.email, 200).toLowerCase(),
    company: clean(input.company, 160),
    summary: clean(input.summary_of_needs ?? input.summary, 3000),
    role: clean(input.role, 120) || undefined,
    phone: clean(input.phone, 40) || undefined,
    source,
    context: input.context,
  };
  if (!lead.name) return { ok: false, error: 'Name is required.' };
  if (!EMAIL_RE.test(lead.email)) return { ok: false, error: 'A valid business email is required.' };
  if (!lead.company) return { ok: false, error: 'Company is required.' };
  if (lead.summary.length < 10) return { ok: false, error: 'Please share a short summary of your needs.' };
  return { ok: true, lead };
}

export async function submitLead(lead: Lead): Promise<{ reference: string; bookingUrl: string }> {
  const reference = `NSM-${Date.now().toString(36).toUpperCase()}`;
  const bookingUrl = process.env.BOOKING_URL || '/contact';
  const payload = { reference, receivedAt: new Date().toISOString(), ...lead };

  const webhook = process.env.LEAD_WEBHOOK_URL;
  if (webhook) {
    const res = await fetch(webhook, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`Lead webhook failed with HTTP ${res.status}`);
  } else {
    // Dev fallback: no CRM configured. Log without the free-text summary.
    console.info('[leads] captured (no LEAD_WEBHOOK_URL set)', { reference, source: lead.source, company: lead.company });
  }
  return { reference, bookingUrl };
}
