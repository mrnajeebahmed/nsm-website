// Five-pillar radar: visitor scores (0–5) against the L2 AI Ready target (2.5).
export function PillarRadar({ values, labels }: { values: (number | null)[]; labels: string[] }) {
  const n = labels.length, cx = 200, cy = 160, R = 108;
  const pt = (i: number, v: number) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    return [cx + Math.cos(a) * R * (v / 5), cy + Math.sin(a) * R * (v / 5)] as const;
  };
  const poly = (vals: (number | null)[]) => vals.map((v, i) => pt(i, v ?? 0).join(',')).join(' ');
  const any = values.some((v) => v != null);
  const desc = labels.map((l, i) => `${l} ${values[i] == null ? 'not answered' : values[i]!.toFixed(2)}`).join(', ');

  return (
    <svg className="radar" viewBox="0 0 400 310" role="img" aria-label={`Radar chart of pillar scores against the AI Ready target of 2.5: ${desc}`}>
      {[1, 2, 3, 4, 5].map((r) => <polygon key={r} points={poly(Array(n).fill(r))} fill="none" stroke="var(--border)" />)}
      {labels.map((l, i) => { const [x, y] = pt(i, 5); return <line key={l} x1={cx} y1={cy} x2={x} y2={y} stroke="var(--border)" />; })}
      <polygon points={poly(Array(n).fill(2.5))} fill="none" stroke="var(--muted)" strokeWidth={2} strokeDasharray="5 4" />
      {any && <polygon points={poly(values)} fill="var(--teal)" fillOpacity={0.2} stroke="var(--teal)" strokeWidth={2.5} strokeLinejoin="round" />}
      {any && values.map((v, i) => v != null && <circle key={i} cx={pt(i, v)[0]} cy={pt(i, v)[1]} r={4} fill="var(--teal)" />)}
      {labels.map((l, i) => {
        const [x, y] = pt(i, 5.75);
        const anchor = x > cx + 8 ? 'start' : x < cx - 8 ? 'end' : 'middle';
        return <text key={l} x={x} y={y + 5} textAnchor={anchor} fontSize={14} fontWeight={600} fill="var(--ink)">{l}</text>;
      })}
    </svg>
  );
}
