import { NextResponse } from 'next/server';
import { submitLead, validateLead } from '@/lib/leads';
import { clientIp, rateLimit } from '@/lib/rate-limit';
import { sanitizeContext } from '@/lib/visitor-context';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  if (!rateLimit(`lead:${clientIp(req)}`, 5, 60 * 60_000)) {
    return NextResponse.json({ error: 'Too many submissions. Please try again later.' }, { status: 429 });
  }
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }
  // Honeypot: bots fill hidden fields.
  if (typeof body.website === 'string' && body.website) return NextResponse.json({ ok: true, reference: 'NSM-OK' });

  const v = validateLead({ ...body, context: sanitizeContext(body.context) }, 'contact_form');
  if (!v.ok) return NextResponse.json({ error: v.error }, { status: 422 });
  try {
    const { reference, bookingUrl } = await submitLead(v.lead);
    return NextResponse.json({ ok: true, reference, bookingUrl });
  } catch (err) {
    console.error('[api/lead] submission failed', err);
    return NextResponse.json({ error: 'We couldn’t submit your request. Please email us directly.' }, { status: 502 });
  }
}
