// AI Readiness & Maturity Assessment: questions, scoring and recommendations.
// Pure functions, shared by the UI and the advisor's context builder.

export type Dimension = 'data' | 'process' | 'tech' | 'team';

export const dimensionLabels: Record<Dimension, string> = {
  data: 'Data Accessibility',
  process: 'Process Standardization',
  tech: 'Tech Stack Connectivity',
  team: 'Team & Governance',
};

export type Question = {
  id: string;
  dimension: Dimension;
  text: string;
  options: { label: string; score: number }[]; // score 0–4
};

export const questions: Question[] = [
  {
    id: 'q1', dimension: 'data', text: 'Where do your core business records (customers, orders, invoices) live today?',
    options: [
      { label: 'Mostly paper, PDFs or email attachments', score: 0 },
      { label: 'Spreadsheets spread across people and drives', score: 1 },
      { label: 'A mix of cloud apps and spreadsheets', score: 2 },
      { label: 'Structured cloud apps (CRM, ERP, accounting)', score: 3 },
      { label: 'A centralized warehouse or single source of truth', score: 4 },
    ],
  },
  {
    id: 'q2', dimension: 'data', text: 'How easily can you pull a clean, trusted report on last quarter’s performance?',
    options: [
      { label: 'It takes days of manual work', score: 0 },
      { label: 'Possible, but numbers often conflict', score: 1 },
      { label: 'A few hours with some cleanup', score: 2 },
      { label: 'Dashboards exist for most metrics', score: 3 },
      { label: 'Real-time, self-service and trusted', score: 4 },
    ],
  },
  {
    id: 'q3', dimension: 'data', text: 'How is internal knowledge (SOPs, policies, product info) stored?',
    options: [
      { label: 'Mostly in people’s heads', score: 0 },
      { label: 'Scattered docs nobody can find', score: 1 },
      { label: 'Shared drive with loose structure', score: 2 },
      { label: 'Organized wiki or knowledge base', score: 3 },
      { label: 'Curated, versioned and owned knowledge base', score: 4 },
    ],
  },
  {
    id: 'q4', dimension: 'process', text: 'How documented are your key operational workflows?',
    options: [
      { label: 'Tribal knowledge only', score: 0 },
      { label: 'A few documented, most not', score: 1 },
      { label: 'Core processes documented but outdated', score: 2 },
      { label: 'Documented and mostly followed', score: 3 },
      { label: 'Documented, measured and continuously improved', score: 4 },
    ],
  },
  {
    id: 'q5', dimension: 'process', text: 'How consistent is the way different team members do the same task?',
    options: [
      { label: 'Everyone does it differently', score: 0 },
      { label: 'Loosely similar', score: 1 },
      { label: 'Similar, with frequent exceptions', score: 2 },
      { label: 'Standardized with templates/checklists', score: 3 },
      { label: 'Standardized and partially automated', score: 4 },
    ],
  },
  {
    id: 'q6', dimension: 'tech', text: 'Do your core tools (CRM, ERP, helpdesk, etc.) offer modern APIs?',
    options: [
      { label: 'Not sure / mostly desktop or legacy tools', score: 0 },
      { label: 'Some do, most don’t', score: 1 },
      { label: 'Most do, but we don’t use them', score: 2 },
      { label: 'Yes, and some are connected', score: 3 },
      { label: 'Yes, and they’re integrated end-to-end', score: 4 },
    ],
  },
  {
    id: 'q7', dimension: 'tech', text: 'How do data and tasks move between your systems today?',
    options: [
      { label: 'Copy-paste and re-keying', score: 0 },
      { label: 'CSV exports/imports', score: 1 },
      { label: 'A few point-to-point integrations', score: 2 },
      { label: 'Automation platform (Zapier, Make, n8n)', score: 3 },
      { label: 'Event-driven integration layer / iPaaS', score: 4 },
    ],
  },
  {
    id: 'q8', dimension: 'tech', text: 'Have you used AI tools in production workflows yet?',
    options: [
      { label: 'No usage', score: 0 },
      { label: 'Individuals use ChatGPT-style tools ad hoc', score: 1 },
      { label: 'A pilot or proof-of-concept', score: 2 },
      { label: 'One AI workflow in production', score: 3 },
      { label: 'Multiple AI systems in production with monitoring', score: 4 },
    ],
  },
  {
    id: 'q9', dimension: 'team', text: 'How comfortable is leadership with AI-assisted decisions and workflows?',
    options: [
      { label: 'Skeptical or concerned', score: 0 },
      { label: 'Curious but cautious', score: 1 },
      { label: 'Supportive, no budget yet', score: 2 },
      { label: 'Sponsoring with budget', score: 3 },
      { label: 'AI is a board-level strategic priority', score: 4 },
    ],
  },
  {
    id: 'q10', dimension: 'team', text: 'Do you have policies for data privacy, security and responsible AI use?',
    options: [
      { label: 'None', score: 0 },
      { label: 'Informal guidance', score: 1 },
      { label: 'Data privacy policy, nothing AI-specific', score: 2 },
      { label: 'AI usage policy in place', score: 3 },
      { label: 'Governance board, reviews and audit trails', score: 4 },
    ],
  },
];

// Indicative SME benchmark (0–100) per dimension, used for the radar overlay.
export const smeBenchmark: Record<Dimension, number> = { data: 48, process: 52, tech: 45, team: 50 };

export type Tier = 'Explorer' | 'Builder' | 'Scaler' | 'AI-Native';

export type AssessmentResult = {
  overall: number;
  tier: Tier;
  tierBlurb: string;
  dimensions: Record<Dimension, number>;
  actions: string[];
};

const tierFor = (score: number): { tier: Tier; blurb: string } => {
  if (score < 35) return { tier: 'Explorer', blurb: 'You’re early in the journey. The fastest wins come from consolidating data and standardizing one high-volume workflow.' };
  if (score < 60) return { tier: 'Builder', blurb: 'You have usable foundations. You’re ready for a focused, high-ROI automation pilot with human-in-the-loop controls.' };
  if (score < 80) return { tier: 'Scaler', blurb: 'Your foundations are strong. Focus on production-grade agents, shared integration layers and governance at scale.' };
  return { tier: 'AI-Native', blurb: 'You operate at the frontier. Optimize cost, evals and multi-agent orchestration across business units.' };
};

const actionLibrary: Record<Dimension, string[]> = {
  data: [
    'Before building autonomous agents, centralize your customer records into a single CRM pipeline.',
    'Digitize your highest-volume documents with intelligent document processing so data becomes queryable.',
    'Define one owner and one source of truth for each core metric before automating reporting.',
  ],
  process: [
    'Document your top 3 repetitive workflows step-by-step. Automation can only scale what is defined.',
    'Standardize intake templates and checklists for the team doing the most repetitive work.',
    'Map handoffs between teams to find where work waits. That’s usually your first automation target.',
  ],
  tech: [
    'Audit which tools have APIs; replace or wrap the one legacy system that blocks most integrations.',
    'Introduce an automation/integration layer (n8n, Make or an iPaaS) to stop copy-paste between systems.',
    'Move from ad-hoc ChatGPT usage to one governed AI workflow in production with logging.',
  ],
  team: [
    'Publish a one-page AI usage policy covering approved tools, data handling and human review.',
    'Nominate an executive sponsor and a single success metric for your first AI initiative.',
    'Run a 2-hour leadership workshop to align on AI opportunities, risks and budget.',
  ],
};

export function scoreAssessment(answers: Record<string, number>): AssessmentResult {
  const dims: Dimension[] = ['data', 'process', 'tech', 'team'];
  const dimensions = {} as Record<Dimension, number>;
  for (const d of dims) {
    const qs = questions.filter((q) => q.dimension === d);
    const total = qs.reduce((sum, q) => sum + (answers[q.id] ?? 0), 0);
    dimensions[d] = Math.round((total / (qs.length * 4)) * 100);
  }
  const overall = Math.round(dims.reduce((s, d) => s + dimensions[d], 0) / dims.length);
  const { tier, blurb } = tierFor(overall);

  // Top 3 actions: weakest dimensions first, two from the weakest, one from the next.
  const ranked = [...dims].sort((a, b) => dimensions[a] - dimensions[b]);
  const actions = [actionLibrary[ranked[0]][0], actionLibrary[ranked[1]][0], actionLibrary[ranked[0]][1]];

  return { overall, tier, tierBlurb: blurb, dimensions, actions };
}
