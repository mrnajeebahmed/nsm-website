// Workflow Automation ROI model (matches the NSM AI Readiness Hub).
// Shared by the calculator UI and the advisor's `calculate_roi_estimate` tool.

export type Efficiency = 'conservative' | 'realistic' | 'aggressive';

export const efficiencyRates: Record<Efficiency, { label: string; pct: string; rate: number }> = {
  conservative: { label: 'Conservative', pct: '50%', rate: 0.5 },
  realistic: { label: 'Realistic', pct: '70%', rate: 0.7 },
  aggressive: { label: 'Aggressive', pct: '85%', rate: 0.85 },
};

export type RoiInput = {
  teamSize: number;      // 1–200
  hoursPerWeek: number;  // 2–30
  hourlyRate: number;    // 15–100
  efficiency: Efficiency;
  investment?: number | null; // override of the suggested engagement's estimate
};

export type RoiResult = {
  manualHours: number;
  manualCost: number;
  annualHoursReclaimed: number;
  annualSavings: number;
  fteEquivalent: number;
  engagement: { name: string; investment: number };
  investment: number;
  paybackMonths: number;
  firstYearReturn: number;
};

export const WORK_WEEKS = 48;
const FTE_HOURS = 1880;

// Indicative investment per engagement tier. Placeholders: replace with real pricing.
const ENGAGEMENTS = [
  { max: 75_000, name: 'AI Opportunity Sprint', investment: 18_000 },
  { max: 400_000, name: 'Production Build & Integration', investment: 65_000 },
  { max: Infinity, name: 'Production Build + Managed AI Ops', investment: 140_000 },
];

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, Number.isFinite(v) ? v : min));

export function calculateRoi(raw: RoiInput): RoiResult {
  const teamSize = clamp(Math.round(raw.teamSize), 1, 200);
  const hoursPerWeek = clamp(raw.hoursPerWeek, 2, 30);
  const hourlyRate = clamp(raw.hourlyRate, 15, 100);
  const rate = (efficiencyRates[raw.efficiency] ?? efficiencyRates.realistic).rate;

  const manualHours = teamSize * hoursPerWeek * WORK_WEEKS;
  const annualHoursReclaimed = manualHours * rate;
  const annualSavings = annualHoursReclaimed * hourlyRate;
  const eng = ENGAGEMENTS.find((e) => annualSavings < e.max)!;
  const investment = raw.investment != null && raw.investment >= 0 ? raw.investment : eng.investment;

  return {
    manualHours,
    manualCost: manualHours * hourlyRate,
    annualHoursReclaimed: Math.round(annualHoursReclaimed),
    annualSavings: Math.round(annualSavings),
    fteEquivalent: Math.round((annualHoursReclaimed / FTE_HOURS) * 10) / 10,
    engagement: { name: eng.name, investment: eng.investment },
    investment,
    paybackMonths: annualSavings > 0 ? Math.round((investment / (annualSavings / 12)) * 10) / 10 : 0,
    firstYearReturn: investment > 0 ? Math.round((annualSavings / investment) * 10) / 10 : 0,
  };
}

export const fmtMoney = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
export const fmtNum = (n: number) => new Intl.NumberFormat('en-US').format(Math.round(n));
