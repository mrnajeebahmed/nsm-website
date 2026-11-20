// AI Readiness framework: oAIRI v3.2 organizational assessment + AIRI Decision Engine v3.0.
// Adapted from the AIRI Framework by Laurence Liew (airi.foundation), licensed CC BY 4.0.
// https://creativecommons.org/licenses/by/4.0/ · NSM Technologies is not affiliated with airi.foundation.
// Pure functions, shared by the UI and the advisor's context handling.

export const PTS = [0, 1.25, 2.5, 3.75, 5] as const;

export const LEVELS = [
  { n: 'AI Unaware', p: 'Bystander' },
  { n: 'AI Aware', p: 'Explorer' },
  { n: 'AI Ready', p: 'Practitioner' },
  { n: 'AI Competent', p: 'Builder' },
  { n: 'AI Catalyst', p: 'Pioneer' },
] as const;

export type Gate = 'STOP' | 'CONDITIONS' | 'GO';
export const band = (s: number) => (s < 1 ? 0 : s < 2 ? 1 : s < 3 ? 2 : s < 4 ? 3 : 4);
export const gateOf = (l: number): { k: Gate; m: number } =>
  l === 0 ? { k: 'STOP', m: 0 } : l === 1 ? { k: 'CONDITIONS', m: 0.5 } : { k: 'GO', m: 1 };

export type PillarId = 'P1' | 'P2' | 'P3' | 'P4' | 'P5';
export type Question = { id: string; dim: string; q: string; o: [string, string, string, string, string] };
export type Pillar = { id: PillarId; name: string; short: string; what: string; qs: Question[] };

export const PILLARS: Pillar[] = [
  {
    id: 'P1', name: 'Leadership & Culture', short: 'Leadership',
    what: 'Leadership commitment, workforce AI literacy, AI talent, how roles are adapting, and how you run experiments. AI projects rarely fail on technology. They fail on people and culture, which is why this pillar counts double when projects are prioritized.',
    qs: [
      { id: 'OAIRI_P1_D1_MGMT', dim: 'Management Support', q: 'How actively does your senior management support AI initiatives?', o: ['No discussion or budget allocation for AI initiatives', 'Leadership mentions AI occasionally but no dedicated budget exists', 'Active interest with pilot budget approved (>S$50,000 allocated)', 'Strong support: a dedicated AI budget, people and resources, with AI goals built into how performance is measured', 'AI is a board-level strategic priority with a multi-year investment roadmap'] },
      { id: 'OAIRI_P1_D2_LITERACY', dim: 'AI Literacy', q: 'What is the level of AI understanding across your organization?', o: ['Most employees have no understanding of AI capabilities', 'Basic awareness exists; some employees have tried GenAI chatbots personally', 'More than 30% of employees have completed AI training or use AI tools regularly', 'Organization-wide AI training with more than 60% completion and measured application', 'AI literacy is part of the culture: most employees use AI in their daily work, with ongoing training as tools change'] },
      { id: 'OAIRI_P1_D3_TALENT', dim: 'AI Talent', q: 'What AI talent does your organization have?', o: ['No AI-specific talent or roles', 'Some IT staff with basic AI awareness but no specialists', 'Small AI team (1 to 5 people) or dedicated AI champions in departments', 'An established AI team (6+ people), including specialists who build and run AI systems', 'A full in-house AI center with research, building, and product skills'] },
      { id: 'OAIRI_P1_D4_ADAPT', dim: 'Workforce Adaptation', q: 'How is your organization adapting its workforce structure for AI?', o: ['No assessment of how AI affects roles or team structures', 'Leadership acknowledges AI will change roles but no formal review has been conducted', 'Key roles audited for AI impact, with coordination-heavy roles at risk of transformation identified', 'Active role redesign underway with transition plans, reskilling programs, and new role definitions that emphasize human judgment', 'A continuous workforce program that regularly realigns roles, teams, and value chains around evolving AI capabilities'] },
      { id: 'OAIRI_P1_D5_EXPERIMENT', dim: 'Experimentation Culture', q: 'How does your organization approach AI experimentation?', o: ['No AI experimentation or pilots', 'Employees try AI on their own, but there’s no list of trials, no success measures, and no tracking', 'Structured pilot process with 2 to 5 pilots completed and learnings documented', 'A clear process for trying AI, with 6 or more trials completed and a way to scale up what works', 'Trying and improving AI is part of everyday operations, with successful trials quickly put to real use'] },
    ],
  },
  {
    id: 'P2', name: 'Ethics & Governance', short: 'Ethics',
    what: 'Your AI rules, how you control AI risk, and how you handle chatbot and agent risks like made-up answers, data leaks and unchecked actions. This pillar is a gate: your overall level can never be higher than your level here.',
    qs: [
      { id: 'OAIRI_P2_D6_GOVERN', dim: 'AI Governance', q: 'What rules and oversight does your organization have for using AI responsibly?', o: ['No AI rules or policies in place', 'Ad-hoc decisions without formal structure, considering creating guidelines', 'Basic AI guidelines exist, with a rule that a person reviews important decisions', 'Established AI oversight with clear policies, accountability, and regular reviews', 'A complete, well-recognized set of AI rules in line with leading national or international standards'] },
      { id: 'OAIRI_P2_D7_RISK', dim: 'AI Risk Control', q: 'How does your organization manage AI-related risks?', o: ['No consideration of AI risks', 'Aware of risks but no formal management or documented controls', 'Basic risk identification with some controls and an incident response process', 'Systematic risk assessment with documented mitigations and regular audits', 'A complete risk approach with ongoing monitoring and thorough, regular testing of AI before and after it’s used'] },
      { id: 'OAIRI_P2_D8_GENAI_RISK', dim: 'GenAI & Agent Risk', q: 'How do you manage risks from AI chatbots and agents, like made-up answers, leaked information, and actions taken without anyone checking?', o: ['No awareness of GenAI or agent-specific risks; employees use public AI tools and agents freely', 'Aware of GenAI and agent risks but no specific controls; informal guidance only', 'A basic policy: an approved-tools list, rules on what AI agents may do, and staff training', 'Formal policies with controls that stop sensitive data leaving, approved company tools, limits on what agents can reach, and monitoring of what they do', 'A complete approach: automatic controls, full records of what agents do, detection of unapproved AI use, and rules for tasks AI runs on its own'] },
    ],
  },
  {
    id: 'P3', name: 'Business Value', short: 'Value',
    what: 'Whether you have clearly defined AI use cases, and whether you can show measured value from the AI you already use. The bar has moved from saving a few hours to restructuring work so AI handles production and people handle judgment.',
    qs: [
      { id: 'OAIRI_P3_D9_USECASE', dim: 'Business Use Case', q: 'How well-defined are your AI use cases and value propositions?', o: ['No clear AI use cases identified', 'AI uses discussed in meetings but none written down with a business reason or a check on whether the data exists', '2 to 3 use cases documented with basic value estimates and data requirements identified', 'A set of AI uses covering both doing existing work faster and rethinking how work is done, each with clear expected benefits and leadership backing', 'A full set of AI uses with proven benefits; value is measured from genuinely changing how work is done, not just time saved'] },
      { id: 'OAIRI_P3_D10_GENAI_VALUE', dim: 'GenAI Value Realization', q: 'How effectively is your organization capturing productivity gains from GenAI tools?', o: ['No AI chatbots in use across the organization', 'Some employees trying everyday AI tools on their own', 'GenAI tools adopted in some departments with anecdotal productivity reports', 'AI chatbots used across the organization with measured time savings, and we’re starting to track the value of reorganizing work', 'AI built into core ways of working, with recorded benefits from both time saved and reorganized work'] },
    ],
  },
  {
    id: 'P4', name: 'Data Foundation', short: 'Data',
    what: 'Whether your data, including documents and knowledge bases, is clean, joined up and reachable by AI. A project with strong backing and a clear business case still fails if the data isn’t there.',
    qs: [
      { id: 'OAIRI_P4_D11_DATA', dim: 'Data Quality', q: 'What is the quality and accessibility of your organization’s data for AI?', o: ['Poor data quality, stuck in separate systems, with nothing ready for AI to use', 'Data exists in multiple systems but has known issues (duplicates, gaps, inconsistent formats) and needs manual effort to access', 'Key business data is consistent and tidy, and documents are organized so AI can search and use them', 'Good quality with centralized data management for both structured and unstructured data', 'Excellent quality, with data brought together in one place and organized so AI can use it easily'] },
      { id: 'OAIRI_P4_D12_REF', dim: 'Reference Data', q: 'How mature is your master and reference data management?', o: ['No reference data management; inconsistent definitions everywhere', 'Inconsistent data definitions across systems, ad-hoc fixes', 'Some standardization efforts underway with documentation started', 'Well-managed core data with clear ownership and one trusted version for key things like customers and products', 'Core data managed consistently across the whole organization, with quality checked continuously'] },
    ],
  },
  {
    id: 'P5', name: 'Infrastructure & Standards', short: 'Infra',
    what: 'The technology to run AI, shared standards for how people hand work to AI, and how far you have rolled out chatbots and agents. Ad-hoc prompts never scale the way shared templates and quality checks do.',
    qs: [
      { id: 'OAIRI_P5_D13_ML', dim: 'AI & Data Infrastructure', q: 'What technology setup does your organization have to run AI and manage its data?', o: ['No setup for running AI, and no access to AI tools', 'Basic tools like spreadsheets and dashboards, but nothing to run AI; getting at the data takes a lot of manual work', 'Company access to ready-made AI services, or basic AI tools used manually; data systems can feed AI through standard connections', 'A proper system to run AI, with data flowing into it automatically from central stores', 'A complete, professional setup for building, improving and running AI end to end, fed by one reliable, real-time data system'] },
      { id: 'OAIRI_P5_D14_SPEC', dim: 'Specification Standards', q: 'How mature are your organization’s standards for how people hand work to AI?', o: ['No organizational standards for how employees specify work for AI tools or agents', 'Each person writes their own AI instructions, with no shared templates or quality standards', 'Shared instruction templates exist for common tasks, with basic quality checks on what AI produces', 'Step-by-step guides built into how teams work, with reusable templates, set quality checks, and documented good practice', 'An organization-wide system of shared, version-controlled templates, common standards, and measured quality for AI-done work'] },
      { id: 'OAIRI_P5_D15_GENAI_ADOPT', dim: 'GenAI & Agent Deployment', q: 'How far has your organization rolled out AI chatbots and AI agents for real use?', o: ['No ability to roll out AI chatbots or agents', 'Using AI chatbots only through public websites; no company-run AI agents', 'Company AI chatbots given to staff, or AI agents set up with proper limits and approved connections', 'Custom AI tools (like assistants that answer from your own documents), or company agents with role-based access and monitored activity', 'Chatbots and agents used widely in real operations, some working together or on a schedule, all under proper controls, records and monitoring'] },
    ],
  },
];
export const ALL_QUESTIONS = PILLARS.flatMap((p) => p.qs);

// NSM-authored guidance mapped to the framework.
export const FOCUS: Record<PillarId, string> = {
  P1: 'Name an executive sponsor, approve a pilot budget, and set one measurable AI goal for the next 90 days. NSM’s AI Strategy & Opportunity Mapping workshop is built for this.',
  P2: 'Publish basic AI guidelines: approved tools, what AI agents may and may not do, and human review of important decisions. NSM sets up governance frameworks as part of every engagement.',
  P3: 'Write down 2 to 3 use cases with value estimates and data requirements. Use the ROI calculator here to size the first one.',
  P4: 'Clean up and centralize key business data, and organize documents so AI can search them. This is NSM’s Data & Systems Integration work.',
  P5: 'Get company access to enterprise AI services and create shared instruction templates with quality checks before scaling agents.',
};

export function engagementFor(level: number, gate: Gate) {
  if (gate === 'STOP') return { name: 'AI Opportunity Sprint, governance first', why: 'Your ethics gate is at STOP. Before any build, put AI rules, risk controls and an approved-tools list in place. The sprint delivers those plus a ranked roadmap.' };
  if (level <= 1) return { name: 'AI Opportunity Sprint (2 to 3 weeks)', why: gate === 'CONDITIONS' ? 'Start with a proof of concept on your most painful, repetitive workflow, alongside a governance remediation plan to lift the CONDITIONS gate.' : 'Start with a proof of concept on your most painful, repetitive workflow (AI automation track).' };
  if (level === 2) return { name: 'Production Build & Integration (6 to 10 weeks)', why: 'You’re AI Ready. Move a validated use case into production and start asking how work should be restructured around AI, not just automated.' };
  return { name: 'Managed AI Operations & Advisory', why: 'Focus on transformation: AI agents handling production work under oversight, plus quarterly expansion sprints.' };
}

export type Answers = Record<string, number>;

export type OairiResult = {
  pillar: Record<PillarId, number | null>;
  overall: number;
  complete: boolean;
  answered: number;
  gate: { k: Gate; m: number };
  level: number;
  bandLevel: number;
};

export function computeOairi(ans: Answers): OairiResult {
  const pillar = {} as Record<PillarId, number | null>;
  for (const p of PILLARS) {
    const got = p.qs.filter((q) => ans[q.id] != null);
    pillar[p.id] = got.length ? got.reduce((s, q) => s + PTS[ans[q.id]], 0) / got.length : null;
  }
  const answered = ALL_QUESTIONS.filter((q) => ans[q.id] != null);
  const overall = answered.length ? answered.reduce((s, q) => s + PTS[ans[q.id]], 0) / answered.length : 0;
  const p2band = pillar.P2 == null ? 0 : band(pillar.P2);
  const gate = gateOf(p2band);
  return {
    pillar, overall,
    complete: answered.length === ALL_QUESTIONS.length,
    answered: answered.length,
    gate,
    level: Math.min(band(overall), p2band),
    bandLevel: band(overall),
  };
}

/** Strongest pillar and the pillar to strengthen first (the ethics gate overrides). */
export function focusPillars(res: OairiResult) {
  const scored = PILLARS.filter((p) => res.pillar[p.id] != null);
  const strongest = [...scored].sort((a, b) => res.pillar[b.id]! - res.pillar[a.id]!)[0];
  const focus = res.gate.k !== 'GO' ? PILLARS[1] : [...scored].sort((a, b) => res.pillar[a.id]! - res.pillar[b.id]!)[0];
  return { strongest, focus };
}

/* ── Decision Engine (AIRI DE Worksheet v3.0) ───────────────────────────── */

export type DeKey = 'p1' | 'p2' | 'p3' | 'p4' | 'p5';
export const DE_PILLARS: { k: DeKey; id: PillarId; name: string; q: string; w: string; r: string[] }[] = [
  { k: 'p1', id: 'P1', name: 'Leadership & Culture', q: 'Do we have the leadership, talent, and change capacity?', w: '2x', r: ['No sponsor, no AI skills, no change plan', 'Informal interest, basic awareness only', 'Named sponsor with budget, training planned', 'Dedicated team, change management underway', 'Executive champion, cross-functional AI team'] },
  { k: 'p2', id: 'P2', name: 'Ethics & Governance', q: 'Do we have the governance and risk framework?', w: 'Gate', r: ['No AI policies, no risk awareness', 'Informal guidance only', 'Basic policy exists, risks identified'] },
  { k: 'p3', id: 'P3', name: 'Business Value', q: 'How strong is the business case?', w: '1x', r: ['Vague idea, no quantified benefit', 'General sense of value, no data', 'Clear problem statement, estimated ROI', 'Validated with data, stakeholder buy-in', 'Proven from pilot, board-level priority'] },
  { k: 'p4', id: 'P4', name: 'Data Foundation', q: 'Do we have the data this project needs?', w: '0.7x', r: ['No relevant data, completely inaccessible', 'Data exists but messy, siloed', 'Data identified, accessible, adequate for pilot', 'Clean data, pipelines in place', 'Production-grade pipeline, enterprise governance'] },
  { k: 'p5', id: 'P5', name: 'Infrastructure & Standards', q: 'Can we run this project technically?', w: '0.3x', r: ['No AI tools, no cloud, no compute', 'Basic tools but no ML/AI platform', 'Enterprise AI API access, can run a pilot', 'AI platform with deployment capability', 'Enterprise MLOps, CI/CD for ML, monitoring'] },
];

export type DeTone = 'STOP' | 'amber' | 'GO';
const DE_BANDS: { min: number; label: string; tone: DeTone; act: string }[] = [
  { min: -1, label: 'Ethics-killed', tone: 'STOP', act: 'Don’t proceed. Build the governance framework first. It’s not a rejection, it’s a roadmap.' },
  { min: 0.0001, label: 'Very low', tone: 'STOP', act: 'Drop for now. Fix the bottleneck pillar and re-run in 6 months.' },
  { min: 25, label: 'Weak', tone: 'amber', act: 'Significant gaps. Fix the bottleneck pillar before committing budget.' },
  { min: 50, label: 'Moderate', tone: 'GO', act: 'Go, but watch the weak pillars.' },
  { min: 75, label: 'Strong', tone: 'GO', act: 'High confidence. Prioritize and resource it.' },
];

export type DeInput = { name: string } & Record<DeKey, number>;
export const SAMPLE_PROJECT: DeInput = { name: 'AI chatbot for tier-1 customer queries', p1: 2, p2: 2, p3: 1, p4: 1, p5: 2 };

export function deScore(d: DeInput) {
  const feas = 0.7 * PTS[d.p4] + 0.3 * PTS[d.p5];
  const val = feas + PTS[d.p3];
  const ppl = val + 2 * PTS[d.p1];
  const g = gateOf(d.p2);
  const total = ppl * g.m;
  const pct = (total / 20) * 100;
  const b = [...DE_BANDS].reverse().find((x) => (total === 0 ? -1 : pct) >= x.min)!;
  const order: DeKey[] = ['p1', 'p4', 'p3', 'p5'];
  const low = Math.min(...order.map((k) => d[k]));
  const bottleneck: DeKey = g.k !== 'GO' ? 'p2' : order.find((k) => d[k] === low)!;
  return { feas, val, ppl, g, total, pct, b, bottleneck };
}

export const f2 = (n: number) => n.toFixed(2);
