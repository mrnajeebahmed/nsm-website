// "Find Your First AI Win": maps industry × pain × goal to a solution blueprint.

export const industries = ['E-commerce/Retail', 'Professional Services', 'Healthcare', 'Logistics/Manufacturing', 'SaaS/Tech', 'Financial Services'] as const;
export const pains = ['Slow lead response', 'Drowning in documents/invoices', 'High customer support volume', 'Disconnected software tools', 'Slow reporting/forecasting'] as const;
export const goals = ['Cut operational costs', 'Scale revenue without adding headcount', 'Improve customer response speed'] as const;

export type Industry = (typeof industries)[number];
export type Pain = (typeof pains)[number];
export type Goal = (typeof goals)[number];

export type Blueprint = {
  title: string;
  summary: string;
  architecture: string[];
  llmStack: string;
  timeline: string;
  engagement: string;
  kpis: string[];
};

const base: Record<Pain, Omit<Blueprint, 'summary'> & { summary: (i: Industry) => string }> = {
  'Slow lead response': {
    title: 'AI Lead Intake & Qualification Agent',
    summary: (i) => `An always-on agent that captures every inbound ${i.toLowerCase()} inquiry, qualifies it, and books the meeting before a competitor replies.`,
    architecture: ['Omnichannel intake (web forms, email, WhatsApp)', 'LLM intent classifier + company enrichment', 'Lead scoring rules synced to CRM', 'Calendar booking + rep notification', 'Human review queue for high-value deals'],
    llmStack: 'GPT-4o-mini or Claude Haiku for classification; Claude Sonnet for drafting replies',
    timeline: '3–5 weeks', engagement: 'AI Opportunity Sprint → Production Build',
    kpis: ['Speed-to-lead < 5 min', 'Meeting-booked rate', 'Lead-to-opportunity conversion'],
  },
  'Drowning in documents/invoices': {
    title: 'Intelligent Document Processing Pipeline',
    summary: (i) => `Automated extraction, validation and posting of ${i === 'Healthcare' ? 'intake forms, claims and invoices' : 'invoices, POs and shipping documents'} directly into your system of record.`,
    architecture: ['Inbox/upload ingestion with OCR', 'Vision-LLM field extraction to a typed schema', 'Business-rule & 3-way-match validation', 'ERP/accounting API posting', 'Exception queue with human-in-the-loop approval'],
    llmStack: 'Gemini or GPT-4o vision for extraction; deterministic validators for accuracy',
    timeline: '4–7 weeks', engagement: 'Production Build & Integration',
    kpis: ['Straight-through processing rate', 'Cost per document', 'Exception rate'],
  },
  'High customer support volume': {
    title: 'Grounded Tier-1 Customer Concierge (RAG)',
    summary: (i) => `A customer assistant grounded in your ${i.toLowerCase()} catalog, pricing and policies that resolves routine questions and escalates with full context.`,
    architecture: ['Knowledge ingestion (help center, policies, catalog)', 'Vector store (pgvector) + hybrid retrieval', 'Claude/GPT answer generation with citations', 'Helpdesk integration & escalation handoff', 'Answer-quality evals and feedback loop'],
    llmStack: 'Claude Sonnet or GPT-4o with automatic provider failover',
    timeline: '4–6 weeks', engagement: 'Production Build + Managed AI Operations',
    kpis: ['Ticket deflection 60–75%', 'CSAT', 'First-response time'],
  },
  'Disconnected software tools': {
    title: 'Unified Integration & Automation Layer',
    summary: (i) => `An API-first integration backbone connecting your ${i.toLowerCase()} CRM, ERP and comms tools so data and tasks flow without re-keying.`,
    architecture: ['System inventory & canonical data model', 'Integration layer (n8n / iPaaS / custom FastAPI)', 'Event-driven sync with retries & audit log', 'Data quality rules and master records', 'AI agents on top of the unified layer'],
    llmStack: 'Model-agnostic; LLMs added per workflow once data flows cleanly',
    timeline: '5–8 weeks', engagement: 'AI Opportunity Sprint → Production Build',
    kpis: ['Manual handoffs eliminated', 'Data sync latency', 'Integration error rate'],
  },
  'Slow reporting/forecasting': {
    title: 'AI Analyst & Automated KPI Reporting',
    summary: (i) => `Automated pipelines and an AI analyst that turn ${i.toLowerCase()} operational data into trusted weekly reports and forecasts.`,
    architecture: ['Pipelines from CRM/ERP/finance to a warehouse', 'Semantic metrics layer', 'Forecasting models + anomaly detection', 'LLM narrative summaries for leadership', 'Natural-language Q&A over metrics'],
    llmStack: 'Claude or GPT for narrative + SQL generation over a governed semantic layer',
    timeline: '5–8 weeks', engagement: 'Production Build & Integration',
    kpis: ['Report prep time', 'Forecast accuracy', 'Decision latency'],
  },
};

const goalNote: Record<Goal, string> = {
  'Cut operational costs': 'Optimized for cost: we prioritize straight-through automation and cheaper models where accuracy allows.',
  'Scale revenue without adding headcount': 'Optimized for growth: capacity freed is redirected to revenue-generating work, measured per rep/agent.',
  'Improve customer response speed': 'Optimized for speed: real-time triggers and SLA-driven escalation are built in from day one.',
};

export function recommend(industry: Industry, pain: Pain, goal: Goal): Blueprint & { goalNote: string } {
  const b = base[pain];
  return { ...b, summary: b.summary(industry), goalNote: goalNote[goal] };
}
