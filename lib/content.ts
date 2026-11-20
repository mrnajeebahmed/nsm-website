// Single source of truth for marketing content shared across pages,
// tools and the AI advisor's offline responder.

export const site = {
  name: 'NSM Technologies',
  tagline: 'Your Strategic Partner for AI Digital Solutions',
  email: 'hello@nsmtechnologies.com',
};

export const nav = [
  { href: '/capabilities', label: 'Capabilities' },
  { href: '/solutions', label: 'Solutions' },
  { href: '/assess', label: 'AI Readiness Tools', pill: true },
  { href: '/approach', label: 'Approach' },
  { href: '/about', label: 'About' },
];

export const trustPillars = [
  { title: 'Outcome-Scoped', body: 'Production systems shipped in weeks, not endless slide decks.' },
  { title: 'Model-Agnostic', body: 'Built on OpenAI, Anthropic Claude, or open-weight models, whichever fits best.' },
  { title: '100% Client-Owned', body: 'You own the code, the agents, the data, and the playbooks.' },
  { title: 'Built for Everyday Scale', body: 'Practical, high-ROI automation designed for growing teams.' },
];

export type Capability = {
  id: string;
  num: string;
  title: string;
  short: string;
  what: string;
  deliverable: string;
  icon: 'compass' | 'flow' | 'brain' | 'layers' | 'rocket';
};

export const coreCapabilities: Capability[] = [
  {
    id: 'strategy', num: '01', icon: 'compass',
    title: 'AI Strategy & Opportunity Mapping',
    short: 'Cut through the hype. We audit your operations, pinpoint high-ROI automation targets, and build a phased implementation roadmap.',
    what: 'Executive workshops, process bottleneck audits, feasibility scoring, and governance frameworks.',
    deliverable: 'A prioritized 90-day execution blueprint ranked by payback period and technical effort.',
  },
  {
    id: 'automation', num: '02', icon: 'flow',
    title: 'End-to-End Workflow Automation',
    short: 'Eliminate repetitive manual handoffs across sales, operations, finance, and support using intelligent document processing and agentic workflows.',
    what: 'Automate multi-step business processes (lead qualification, invoice reconciliation, customer onboarding, and ticket triage) with human-in-the-loop safeguards.',
    deliverable: 'Production-grade automated pipelines integrated directly into your existing tools.',
  },
  {
    id: 'rag', num: '03', icon: 'brain',
    title: 'Custom AI Copilots & Knowledge Systems (RAG)',
    short: 'Turn your company’s SOPs, manuals, and databases into secure, conversational assistants for your staff and customers.',
    what: 'Deploy secure, hallucination-checked LLM applications connected to your proprietary data (Retrieval-Augmented Generation) and multi-agent task runners.',
    deliverable: 'Custom internal copilots and customer-facing AI assistants powered by OpenAI, Claude, or private models.',
  },
  {
    id: 'integration', num: '04', icon: 'layers',
    title: 'Data & Systems Integration',
    short: 'Connect your CRM, ERP, and communication tools into a unified, AI-ready foundation with clean data governance.',
    what: 'API-first integration of CRM, ERP, finance and messaging systems; data modelling, quality rules and governance.',
    deliverable: 'A unified, AI-ready data foundation with documented pipelines and access controls.',
  },
];

// Capabilities page uses the four detailed pillars from the blueprint.
export const servicePillars: Capability[] = [
  { ...coreCapabilities[0], title: 'Strategic AI Consultation & Roadmapping' },
  { ...coreCapabilities[1], title: 'Intelligent Workflow & Process Automation' },
  { ...coreCapabilities[2], title: 'Generative AI & Enterprise Knowledge Agents' },
  {
    id: 'product', num: '04', icon: 'rocket',
    title: 'Digital Product & Venture Engineering',
    short: 'Architect, prototype and launch AI-native products.',
    what: 'Rapidly architect, prototype, and launch new AI-native digital products or modernize legacy customer portals for scale.',
    deliverable: 'Full-stack, cloud-native applications built for reliability and rapid iteration.',
  },
];

export const useCaseFilters = [
  'All', 'Sales & Marketing', 'Customer Operations', 'Finance & Admin',
  'Supply Chain & Logistics', 'Healthcare & Services',
] as const;
export type UseCaseFilter = (typeof useCaseFilters)[number];

export type UseCase = {
  id: string;
  title: string;
  categories: Exclude<UseCaseFilter, 'All'>[];
  bottleneck: string;
  solution: string;
  impact: string;
  stack: string;
};

export const useCases: UseCase[] = [
  {
    id: 'lead-intake', title: 'Automated Lead Intake & Qualification',
    categories: ['Sales & Marketing'],
    bottleneck: 'Inbound leads wait hours or days for a reply and often go cold before sales responds.',
    solution: 'AI reads inbound inquiries across web, email, and WhatsApp, enriches company data, scores intent, and books meetings directly onto your sales team’s calendar.',
    impact: '5x faster speed-to-lead', stack: 'LLM classifier · CRM API · Calendar API',
  },
  {
    id: 'idp', title: 'Intelligent Document & Invoice Processing',
    categories: ['Finance & Admin', 'Supply Chain & Logistics'],
    bottleneck: 'Staff re-key purchase orders, bills of lading and invoices into ERP by hand.',
    solution: 'Automatically extract, validate, and reconcile purchase orders, bills of lading, and vendor invoices directly into your ERP/accounting software.',
    impact: '80% reduction in manual data entry', stack: 'Vision LLM · Validation rules · ERP connector',
  },
  {
    id: 'concierge', title: '24/7 Tier-1 Customer & Policy Concierge',
    categories: ['Customer Operations', 'Healthcare & Services'],
    bottleneck: 'Support teams answer the same catalog, pricing and policy questions all day.',
    solution: 'A grounded AI assistant trained on your exact catalog, pricing, and policies that resolves routine questions and escalates complex cases with full context.',
    impact: '60–75% ticket deflection', stack: 'RAG · Helpdesk API · Escalation workflow',
  },
  {
    id: 'sop-copilot', title: 'Internal SOP & Onboarding Copilot',
    categories: ['Customer Operations', 'Healthcare & Services', 'Finance & Admin'],
    bottleneck: 'Knowledge is locked in handbooks, drives and senior employees’ heads.',
    solution: 'Give every employee instant, cited answers from your internal handbooks, technical docs, and historical project files.',
    impact: 'Cuts new-hire ramp time in half', stack: 'RAG · SSO · Document connectors',
  },
  {
    id: 'reporting', title: 'Automated KPI Reporting & Forecasting',
    categories: ['Finance & Admin', 'Sales & Marketing'],
    bottleneck: 'Weekly reports are stitched together manually from spreadsheets and exports.',
    solution: 'Pipelines consolidate CRM, ERP and finance data; an AI analyst drafts narrative summaries and flags anomalies for leadership.',
    impact: '10+ hrs/week saved per analyst', stack: 'Data pipeline · Warehouse · LLM summarizer',
  },
  {
    id: 'shipment', title: 'Shipment Exception & Carrier Triage',
    categories: ['Supply Chain & Logistics', 'Customer Operations'],
    bottleneck: 'Delays and exceptions are discovered late through customer complaints.',
    solution: 'Agents monitor carrier feeds and emails, classify exceptions, notify customers proactively and open tasks for the ops team.',
    impact: '40% fewer “where is my order” tickets', stack: 'Event stream · Agent workflow · Messaging API',
  },
  {
    id: 'patient-intake', title: 'Patient & Client Intake Automation',
    categories: ['Healthcare & Services'],
    bottleneck: 'Front-desk teams manually process forms, insurance details and scheduling.',
    solution: 'Secure intake flows extract form data, verify completeness, pre-fill practice systems and confirm appointments, with human review on sensitive fields.',
    impact: '50% less front-desk admin time', stack: 'IDP · Practice-management API · HITL review',
  },
  {
    id: 'content-ops', title: 'Personalized Campaign & Content Ops',
    categories: ['Sales & Marketing'],
    bottleneck: 'Marketing can’t produce enough tailored content for each segment and channel.',
    solution: 'Brand-governed generation pipelines draft campaign variants, product copy and follow-ups, routed through approval before publishing.',
    impact: '3x content throughput', stack: 'LLM + brand guardrails · CMS · Approval flow',
  },
];

export const deliverySteps = [
  { num: '01', title: 'Discover', body: 'Identify high-ROI bottlenecks' },
  { num: '02', title: 'Architect', body: 'Design a secure, model-agnostic blueprint' },
  { num: '03', title: 'Prototype', body: 'Validate with real business data in weeks' },
  { num: '04', title: 'Integrate', body: 'Connect to CRM, ERP and APIs' },
  { num: '05', title: 'Govern', body: 'Guardrails, accuracy evals & human-in-the-loop' },
  { num: '06', title: 'Operate & Scale', body: 'Handover, team training & continuous optimization' },
];

export const engagementModels = [
  {
    id: 'sprint', name: 'AI Opportunity Sprint', duration: '2–3 Weeks',
    body: 'Deep-dive process audit, data readiness check, and a working proof-of-concept for your #1 workflow.',
    includes: ['Process & data audit', 'Prioritized use-case backlog', 'Working proof-of-concept', '90-day roadmap'],
  },
  {
    id: 'build', name: 'Production Build & Integration', duration: '6–10 Weeks',
    body: 'Full end-to-end engineering, testing, security hardening, and deployment of a custom AI system into your daily operations.',
    includes: ['Solution architecture', 'Integrations & data pipelines', 'Evals, guardrails & security review', 'Deployment & training'],
    featured: true,
  },
  {
    id: 'managed', name: 'Managed AI Operations & Advisory', duration: 'Ongoing',
    body: 'Continuous model monitoring, prompt/pipeline optimization, cost management, and quarterly expansion sprints.',
    includes: ['Monitoring & incident response', 'Model & cost optimization', 'Quarterly expansion sprints', 'Executive advisory'],
  },
];

export const techStack = [
  { group: 'LLMs & Reasoning', items: ['OpenAI (GPT series)', 'Anthropic (Claude)', 'Google (Gemini)', 'Meta (Llama)'] },
  { group: 'Orchestration & Frameworks', items: ['LangGraph', 'LlamaIndex', 'Python / FastAPI', 'n8n', 'Make'] },
  { group: 'Cloud & Data', items: ['AWS', 'Microsoft Azure', 'PostgreSQL (pgvector)', 'Pinecone', 'Supabase'] },
];
