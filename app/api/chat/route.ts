import { NextResponse } from 'next/server';
import { runAdvisor } from '@/lib/advisor';
import type { ChatTurn } from '@/lib/llm/types';
import { clientIp, rateLimit } from '@/lib/rate-limit';
import { sanitizeContext } from '@/lib/visitor-context';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_TURNS = 20;
const MAX_CHARS = 2000;

export async function POST(req: Request) {
  if (!rateLimit(`chat:${clientIp(req)}`, 30, 10 * 60_000)) {
    return NextResponse.json({ error: 'Too many messages. Please wait a few minutes.' }, { status: 429 });
  }

  let body: { messages?: unknown; context?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return NextResponse.json({ error: '`messages` must be a non-empty array.' }, { status: 400 });
  }
  const history: ChatTurn[] = body.messages
    .slice(-MAX_TURNS)
    .filter((m): m is ChatTurn => !!m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }));
  // Providers require the conversation to start with a user turn.
  while (history.length && history[0].role !== 'user') history.shift();
  if (!history.length || history[history.length - 1].role !== 'user') {
    return NextResponse.json({ error: 'The last message must be from the user.' }, { status: 400 });
  }

  try {
    const result = await runAdvisor(history, sanitizeContext(body.context));
    return NextResponse.json(result);
  } catch (err) {
    console.error('[api/chat] unexpected error', err);
    return NextResponse.json({ error: 'The advisor is temporarily unavailable.' }, { status: 500 });
  }
}
