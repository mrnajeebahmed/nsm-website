// Anonymous context passed from the self-service tools into the advisor chat.
export type VisitorContext = {
  page?: string;
  assessment?: { overall: number; tier: string; dimensions: Record<string, number> };
  roi?: {
    teamSize: number; hoursPerWeek: number; hourlyRate: number; efficiency: string;
    annualSavings: number; annualHoursReclaimed: number; paybackMonths: number; engagement: string;
  };
  blueprint?: { industry: string; pain: string; goal: string; title: string; timeline: string };
};

const num = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? v : undefined);
const str = (v: unknown, max = 120) => (typeof v === 'string' ? v.slice(0, max) : undefined);

/** Server-side whitelist: drops anything not in the expected shape. */
export function sanitizeContext(raw: unknown): VisitorContext | undefined {
  if (!raw || typeof raw !== 'object') return undefined;
  const r = raw as Record<string, any>;
  const out: VisitorContext = { page: str(r.page, 60) };
  if (r.assessment && typeof r.assessment === 'object') {
    const dims: Record<string, number> = {};
    for (const k of ['data', 'process', 'tech', 'team']) {
      const v = num(r.assessment.dimensions?.[k]);
      if (v !== undefined) dims[k] = v;
    }
    out.assessment = { overall: num(r.assessment.overall) ?? 0, tier: str(r.assessment.tier, 20) ?? '', dimensions: dims };
  }
  if (r.roi && typeof r.roi === 'object') {
    out.roi = {
      teamSize: num(r.roi.teamSize) ?? 0, hoursPerWeek: num(r.roi.hoursPerWeek) ?? 0, hourlyRate: num(r.roi.hourlyRate) ?? 0,
      efficiency: str(r.roi.efficiency, 20) ?? '', annualSavings: num(r.roi.annualSavings) ?? 0,
      annualHoursReclaimed: num(r.roi.annualHoursReclaimed) ?? 0, paybackMonths: num(r.roi.paybackMonths) ?? 0,
      engagement: str(r.roi.engagement, 80) ?? '',
    };
  }
  if (r.blueprint && typeof r.blueprint === 'object') {
    out.blueprint = {
      industry: str(r.blueprint.industry, 60) ?? '', pain: str(r.blueprint.pain, 60) ?? '', goal: str(r.blueprint.goal, 60) ?? '',
      title: str(r.blueprint.title, 100) ?? '', timeline: str(r.blueprint.timeline, 30) ?? '',
    };
  }
  return out;
}
