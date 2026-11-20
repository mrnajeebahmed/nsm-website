'use client';

import { useEffect, useRef, useState } from 'react';

// localStorage-backed state for per-visitor conveniences (tool progress).
// Hydrates after mount to avoid SSR mismatches; survives storage being blocked.
export function usePersistentState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const hydrated = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw != null) setValue(JSON.parse(raw) as T);
    } catch { /* storage unavailable or corrupt */ }
    hydrated.current = true;
  }, [key]);

  useEffect(() => {
    if (!hydrated.current) return;
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignore */ }
  }, [key, value]);

  return [value, setValue] as const;
}
