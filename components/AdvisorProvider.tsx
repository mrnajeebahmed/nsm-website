'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { VisitorContext } from '@/lib/visitor-context';

type AdvisorApi = {
  context: VisitorContext;
  updateContext: (patch: Partial<VisitorContext>) => void;
  isOpen: boolean;
  openChat: (prompt?: string) => void;
  closeChat: () => void;
  pendingPrompt: string | null;
  consumePrompt: () => string | null;
};

const Ctx = createContext<AdvisorApi | null>(null);
const STORAGE_KEY = 'nsm.visitorContext';

export function AdvisorProvider({ children }: { children: ReactNode }) {
  const [context, setContext] = useState<VisitorContext>({});
  const [isOpen, setOpen] = useState(false);
  const [pendingPrompt, setPending] = useState<string | null>(null);

  // Restore anonymous tool results across reloads (per-tab convenience only).
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) setContext(JSON.parse(raw));
    } catch { /* storage unavailable */ }
  }, []);

  const updateContext = useCallback((patch: Partial<VisitorContext>) => {
    setContext((prev) => {
      const next = { ...prev, ...patch };
      try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }, []);

  const openChat = useCallback((prompt?: string) => {
    if (prompt) setPending(prompt);
    setOpen(true);
  }, []);

  const consumePrompt = useCallback(() => {
    const p = pendingPrompt;
    setPending(null);
    return p;
  }, [pendingPrompt]);

  const api = useMemo<AdvisorApi>(
    () => ({ context, updateContext, isOpen, openChat, closeChat: () => setOpen(false), pendingPrompt, consumePrompt }),
    [context, updateContext, isOpen, openChat, pendingPrompt, consumePrompt],
  );
  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useAdvisor() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useAdvisor must be used inside <AdvisorProvider>');
  return v;
}
