'use client';

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { usePathname } from 'next/navigation';
import { useAdvisor } from './AdvisorProvider';
import { Icon } from './Icon';
import { LogoMark } from './Logo';

type Msg = { role: 'user' | 'assistant'; content: string; meta?: string };

const GREETING: Msg = {
  role: 'assistant',
  content: 'Hi, I’m the NSM AI Advisor. Tell me about a workflow that slows your team down, and I’ll suggest where AI or automation could help (and what it might save).',
};
const SUGGESTIONS = ['Where should we start with AI?', 'Estimate ROI for 10 people, 8 hrs/week, $35/hr', 'How do you handle data security?', 'Book a strategy call'];
const STORE = 'nsm.chat';

export function ChatWidget() {
  const { isOpen, openChat, closeChat, context, pendingPrompt, consumePrompt } = useAdvisor();
  const pathname = usePathname();
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORE);
      if (raw) setMessages(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);
  useEffect(() => {
    try { sessionStorage.setItem(STORE, JSON.stringify(messages.slice(-30))); } catch { /* ignore */ }
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, busy]);

  useEffect(() => {
    if (!isOpen) return;
    inputRef.current?.focus();
    if (pendingPrompt) {
      const p = consumePrompt();
      if (p) void send(p);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, pendingPrompt]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || busy) return;
    const next: Msg[] = [...messages, { role: 'user', content }];
    setMessages(next);
    setInput('');
    setBusy(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          messages: next.filter((m) => m !== GREETING).map(({ role, content }) => ({ role, content })),
          context: { ...context, page: pathname },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Request failed');
      setMessages((m) => [...m, { role: 'assistant', content: data.reply, meta: data.mode === 'offline' ? 'Offline advisor mode' : undefined }]);
    } catch (e) {
      setMessages((m) => [...m, { role: 'assistant', content: `Sorry, I hit a problem: ${(e as Error).message}. You can also reach us via the Contact page.` }]);
    } finally {
      setBusy(false);
    }
  }

  const onSubmit = (e: FormEvent) => { e.preventDefault(); void send(input); };
  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); void send(input); }
  };

  const ctxChips = [
    context.assessment && `Readiness: L${context.assessment.level} ${context.assessment.levelName} (${context.assessment.gate})`,
    context.project && `Project: ${Math.round(context.project.pct)}% DE`,
    context.roi && `ROI: $${Math.round(context.roi.annualSavings / 1000)}k/yr`,
    context.blueprint && `Blueprint: ${context.blueprint.title}`,
  ].filter(Boolean) as string[];

  if (!isOpen) {
    return (
      <button className="chat-launcher no-print" onClick={() => openChat()} aria-label="Open NSM AI Advisor">
        <span className="pulse" /> <Icon name="chat" size={20} /> <span className="txt">Ask NSM AI Advisor</span>
      </button>
    );
  }

  return (
    <section className="chat-panel no-print" role="dialog" aria-label="NSM AI Advisor">
      <header className="chat-head">
        <LogoMark size={36} />
        <div><strong>NSM AI Advisor</strong><span>Model-agnostic · grounded in NSM services</span></div>
        <button onClick={closeChat} aria-label="Close chat"><Icon name="x" size={18} /></button>
      </header>
      {ctxChips.length > 0 && (
        <div className="chat-context" title="Shared anonymously from the assessment tools">
          <Icon name="check" size={14} /> Using your results: {ctxChips.join(' · ')}
        </div>
      )}
      <div className="chat-body" ref={bodyRef} aria-live="polite">
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'contents' }}>
            <div className={`msg ${m.role}`}>{m.content}</div>
            {m.meta && <div className="msg-meta">{m.meta}</div>}
          </div>
        ))}
        {busy && <div className="msg assistant"><span className="typing"><i /><i /><i /></span></div>}
      </div>
      {messages.length <= 1 && (
        <div className="chat-suggestions">
          {SUGGESTIONS.map((s) => <button key={s} onClick={() => void send(s)}>{s}</button>)}
        </div>
      )}
      <form className="chat-form" onSubmit={onSubmit}>
        <label htmlFor="chat-input" className="sr-only">Message</label>
        <textarea id="chat-input" ref={inputRef} rows={1} value={input} maxLength={2000}
          onChange={(e) => setInput(e.target.value)} onKeyDown={onKey} placeholder="Describe a workflow or ask a question…" />
        <button type="submit" disabled={busy || !input.trim()} aria-label="Send"><Icon name="send" size={18} /></button>
      </form>
      <div className="chat-foot">AI responses may be imperfect. Don’t share sensitive data.</div>
    </section>
  );
}
