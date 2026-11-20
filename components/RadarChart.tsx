import { dimensionLabels, type Dimension } from '@/lib/assessment';

// Accessible SVG radar: visitor scores vs SME benchmark (0–100 per axis).
export function RadarChart({ scores, benchmark }: { scores: Record<Dimension, number>; benchmark: Record<Dimension, number> }) {
  const dims: Dimension[] = ['data', 'process', 'tech', 'team'];
  const size = 300, c = size / 2, r = 100;
  const point = (i: number, v: number) => {
    const a = (Math.PI * 2 * i) / dims.length - Math.PI / 2;
    return [c + Math.cos(a) * r * (v / 100), c + Math.sin(a) * r * (v / 100)] as const;
  };
  const poly = (vals: Record<Dimension, number>) => dims.map((d, i) => point(i, vals[d]).join(',')).join(' ');
  const desc = dims.map((d) => `${dimensionLabels[d]}: ${scores[d]} vs benchmark ${benchmark[d]}`).join('; ');

  return (
    <figure style={{ margin: 0 }}>
      <svg viewBox={`0 0 ${size} ${size}`} width="100%" style={{ maxWidth: 340, display: 'block', margin: '0 auto' }} role="img" aria-label={`Radar chart. ${desc}`}>
        {[25, 50, 75, 100].map((g) => (
          <polygon key={g} points={dims.map((_, i) => point(i, g).join(',')).join(' ')} fill="none" stroke="#E2E8F0" strokeWidth={1} />
        ))}
        {dims.map((_, i) => { const [x, y] = point(i, 100); return <line key={i} x1={c} y1={c} x2={x} y2={y} stroke="#E2E8F0" />; })}
        <polygon points={poly(benchmark)} fill="rgba(100,116,139,.10)" stroke="#94A3B8" strokeWidth={1.5} strokeDasharray="4 4" />
        <polygon points={poly(scores)} fill="rgba(37,99,235,.18)" stroke="#2563EB" strokeWidth={2.5} strokeLinejoin="round" />
        {dims.map((d, i) => { const [x, y] = point(i, scores[d]); return <circle key={d} cx={x} cy={y} r={4.5} fill="#2563EB" stroke="#fff" strokeWidth={2} />; })}
        {dims.map((d, i) => {
          const [x, y] = point(i, 128);
          return (
            <text key={d} x={x} y={y} textAnchor="middle" dominantBaseline="middle" fontSize={11} fontWeight={650} fill="#0F172A">
              {dimensionLabels[d].split(' ')[0]}
              <tspan x={x} dy={13} fontWeight={800} fill="#2563EB">{scores[d]}</tspan>
            </text>
          );
        })}
      </svg>
      <figcaption style={{ display: 'flex', gap: 16, justifyContent: 'center', fontSize: '.8rem', marginTop: 8 }}>
        <span><span style={{ display: 'inline-block', width: 12, height: 3, background: '#2563EB', verticalAlign: 'middle', marginRight: 6 }} />Your business</span>
        <span><span style={{ display: 'inline-block', width: 12, height: 0, borderTop: '2px dashed #94A3B8', verticalAlign: 'middle', marginRight: 6 }} />SME benchmark</span>
      </figcaption>
    </figure>
  );
}
