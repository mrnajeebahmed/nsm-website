'use client';

// Transparency panel: shows exactly what the AI Advisor receives from a tool.
export function ContextPayload({ data, label = 'See what the AI Advisor receives' }: { data: unknown; label?: string }) {
  return (
    <details className="payload">
      <summary>{label}</summary>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </details>
  );
}
