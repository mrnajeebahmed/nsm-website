// Anonymous context passed from the self-service tools into the advisor chat.
export type VisitorContext = {
  page?: string;
  /** oAIRI organizational readiness (scores 0–5, levels L0–L4). */
  assessment?: {
    framework: 'oAIRI';
    overall: number;
    level: number;
    levelName: string;
    gate: string;
    pillars: Record<string, number>;
    focusPillar: string;
    suggestedEngagement: string;
  };
  /** AIRI Decision Engine score for one candidate project. */
  project?: { name: string; ratings: Record<string, string>; pct: number; band: string; bottleneck: string };
  roi?: {
    teamSize: number; hoursPerWeek: number; hourlyRate: number; efficiency: string;
    annualSavings: number; annualHoursReclaimed: number; paybackMonths: number; engagement: string;
  };
  blueprint?: { industry: string; pain: string; goal: string; title: string; timeline: string };
};

const num = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? v : undefined);
const str = (v: unknown, max = 120) => (typeof v === 'string' ? v.slice(0, max) : undefined);
const obj = (v: unknown): Record<string, any> | undefined => (v && typeof v === 'object' ? (v as Record<string, any>) : undefined);

/** Server-side whitelist: drops anything not in the expected shape. */
export function sanitizeContext(raw: unknown): VisitorContext | undefined {
  const r = obj(raw);
  if (!r) return undefined;
  const out: VisitorContext = { page: str(r.page, 60) };

  const a = obj(r.assessment);
  if (a) {
    const pillars: Record<string, number> = {};
    for (const k of ['P1', 'P2', 'P3', 'P4', 'P5']) {
      const v = num(obj(a.pillars)?.[k]);
      if (v !== undefined) pillars[k] = Math.max(0, Math.min(5, v));
    }
    out.assessment = {
      framework: 'oAIRI',
      overall: Math.max(0, Math.min(5, num(a.overall) ?? 0)),
      level: Math.max(0, Math.min(4, Math.round(num(a.level) ?? 0))),
      levelName: str(a.levelName, 30) ?? '',
      gate: str(a.gate, 12) ?? '',
      pillars,
      focusPillar: str(a.focusPillar, 4) ?? '',
      suggestedEngagement: str(a.suggestedEngagement, 80) ?? '',
    };
  }

  const p = obj(r.project);
  if (p) {
    const ratings: Record<string, string> = {};
    for (const k of ['P1', 'P2', 'P3', 'P4', 'P5']) {
      const v = str(obj(p.ratings)?.[k], 12);
      if (v) ratings[k] = v;
    }
    out.project = {
      name: str(p.name, 160) ?? '', ratings, pct: Math.max(0, Math.min(100, num(p.pct) ?? 0)),
      band: str(p.band, 20) ?? '', bottleneck: str(p.bottleneck, 4) ?? '',
    };
  }

  const roi = obj(r.roi);
  if (roi) {
    out.roi = {
      teamSize: num(roi.teamSize) ?? 0, hoursPerWeek: num(roi.hoursPerWeek) ?? 0, hourlyRate: num(roi.hourlyRate) ?? 0,
      efficiency: str(roi.efficiency, 20) ?? '', annualSavings: num(roi.annualSavings) ?? 0,
      annualHoursReclaimed: num(roi.annualHoursReclaimed) ?? 0, paybackMonths: num(roi.paybackMonths) ?? 0,
      engagement: str(roi.engagement, 80) ?? '',
    };
  }

  const b = obj(r.blueprint);
  if (b) {
    out.blueprint = {
      industry: str(b.industry, 60) ?? '', pain: str(b.pain, 60) ?? '', goal: str(b.goal, 60) ?? '',
      title: str(b.title, 100) ?? '', timeline: str(b.timeline, 30) ?? '',
    };
  }
  return out;
}
