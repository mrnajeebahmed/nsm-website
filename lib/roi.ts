// Workflow Automation ROI model. Shared by the calculator UI and the
// advisor's `calculate_roi_estimate` tool so both always agree.

export type Efficiency = 'conservative' | 'realistic' | 'aggressive';

export const efficiencyRates: Record<Efficiency, { label: string; rate: number }> = {
  conservative: { label: 'Conservative 50%', rate: 0.5 },
  realistic: { label: 'Realistic 70%', rate: 0.7 },
  aggressive: { label: 'Aggressive 85%', rate: 0.85 },
};

export type RoiInput = {
  teamSize: number;      // 1–200
  hoursPerWeek: number;  // 2–30
  hourlyRate: number;    // 15–100
  efficiency: Efficiency;
};

export type RoiResult = {
  annualHoursReclaimed: number;
  annualSavings: number;
  fteEquivalent: number;
  engagement: { name: string; investmentRange: [number, number]; description: string };
  paybackMonths: number;
};

const WORK_WEEKS = 48;
const FTE_HOURS = 1840;

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

export function calculateRoi(raw: RoiInput): RoiResult {
  const input = {
    teamSize: clamp(Math.round(raw.teamSize), 1, 200),
    hoursPerWeek: clamp(raw.hoursPerWeek, 2, 30),
    hourlyRate: clamp(raw.hourlyRate, 15, 100),
    efficiency: raw.efficiency in efficiencyRates ? raw.efficiency : 'realistic',
  };
  const rate = efficiencyRates[input.efficiency].rate;
  const annualHoursReclaimed = Math.round(input.teamSize * input.hoursPerWeek * WORK_WEEKS * rate);
  const annualSavings = Math.round(annualHoursReclaimed * input.hourlyRate);

  // Indicative investment bands; replace with your real pricing.
  let engagement: RoiResult['engagement'];
  if (annualSavings < 60_000) {
    engagement = { name: 'AI Opportunity Sprint', investmentRange: [8_000, 15_000], description: 'Validate your #1 workflow with a working proof-of-concept in 2–3 weeks.' };
  } else if (annualSavings < 400_000) {
    engagement = { name: 'Production Build & Integration', investmentRange: [35_000, 80_000], description: 'Ship a production AI workflow integrated with your systems in 6–10 weeks.' };
  } else {
    engagement = { name: 'Production Build + Managed AI Operations', investmentRange: [80_000, 160_000], description: 'Multi-workflow program with ongoing optimization and quarterly expansion sprints.' };
  }

  const midpoint = (engagement.investmentRange[0] + engagement.investmentRange[1]) / 2;
  const monthly = annualSavings / 12;
  const paybackMonths = monthly > 0 ? Math.max(1, Math.round((midpoint / monthly) * 10) / 10) : 0;

  return {
    annualHoursReclaimed,
    annualSavings,
    fteEquivalent: Math.round((annualHoursReclaimed / FTE_HOURS) * 10) / 10,
    engagement,
    paybackMonths,
  };
}

export const fmtMoney = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
export const fmtNum = (n: number) => new Intl.NumberFormat('en-US').format(n);
