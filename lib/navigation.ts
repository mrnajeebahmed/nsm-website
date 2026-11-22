// Mega menu information architecture.
import type { IconName } from '@/components/Icon';

export type MenuLink = { href: string; label: string; desc?: string; icon?: IconName };
export type Menu = {
  id: string;
  label: string;
  overview: { href: string; title: string; text: string };
  columns: { heading: string; links: MenuLink[] }[];
  feature: { image: string; eyebrow: string; title: string; href: string; cta: string };
};

const fn = (f: string) => `/solutions?f=${encodeURIComponent(f)}`;

export const menus: Menu[] = [
  {
    id: 'capabilities',
    label: 'Capabilities',
    overview: { href: '/capabilities', title: 'All capabilities', text: 'From first opportunity to production operations.' },
    columns: [
      {
        heading: 'Service pillars',
        links: [
          { href: '/capabilities#strategy', label: 'AI Strategy & Roadmapping', desc: 'Opportunity mapping and a 90-day blueprint', icon: 'compass' },
          { href: '/capabilities#automation', label: 'Workflow Automation', desc: 'Agentic workflows with human review', icon: 'flow' },
          { href: '/capabilities#rag', label: 'AI Copilots & Knowledge (RAG)', desc: 'Secure assistants grounded in your data', icon: 'brain' },
        ],
      },
      {
        heading: 'Engineering',
        links: [
          { href: '/capabilities#integration', label: 'Data & Systems Integration', desc: 'CRM, ERP and tools on one AI-ready layer', icon: 'layers' },
          { href: '/capabilities#product', label: 'Digital Product Engineering', desc: 'AI-native products and portals', icon: 'rocket' },
          { href: '/about#stack', label: 'Model-Agnostic Stack', desc: 'OpenAI, Claude, Gemini, Llama', icon: 'spark' },
        ],
      },
    ],
    feature: { image: '/images/cap-rag.webp', eyebrow: 'Featured', title: 'Turn your SOPs into a secure AI copilot', href: '/capabilities#rag', cta: 'Explore copilots' },
  },
  {
    id: 'solutions',
    label: 'Solutions',
    overview: { href: '/solutions', title: 'Solutions matrix', text: 'Real AI use cases, filterable by function.' },
    columns: [
      {
        heading: 'By business function',
        links: [
          { href: fn('Sales & Marketing'), label: 'Sales & Marketing' },
          { href: fn('Customer Operations'), label: 'Customer Operations' },
          { href: fn('Finance & Admin'), label: 'Finance & Admin' },
          { href: fn('Supply Chain & Logistics'), label: 'Supply Chain & Logistics' },
          { href: fn('Healthcare & Services'), label: 'Healthcare & Services' },
        ],
      },
      {
        heading: 'Popular use cases',
        links: [
          { href: '/solutions#lead-intake', label: 'Lead Intake & Qualification', desc: '5x faster speed-to-lead' },
          { href: '/solutions#idp', label: 'Document & Invoice Processing', desc: '80% less manual data entry' },
          { href: '/solutions#concierge', label: '24/7 Customer Concierge', desc: '60–75% ticket deflection' },
          { href: '/solutions#sop-copilot', label: 'SOP & Onboarding Copilot', desc: 'Ramp time cut in half' },
        ],
      },
    ],
    feature: { image: '/images/uc-reporting.webp', eyebrow: 'Find your fit', title: 'Get a tailored solution blueprint in three clicks', href: '/assess?tool=recommender', cta: 'Find your first AI win' },
  },
  {
    id: 'tools',
    label: 'AI Readiness Tools',
    overview: { href: '/assess', title: 'AI Readiness Hub', text: 'Self-service diagnostics. No sales call required.' },
    columns: [
      {
        heading: 'Assess & plan',
        links: [
          { href: '/assess?tool=readiness', label: 'AI Readiness (oAIRI)', desc: '15 questions across 5 pillars', icon: 'gauge' },
          { href: '/assess?tool=project', label: 'Project Decision Engine', desc: 'Score and rank AI projects', icon: 'target' },
        ],
      },
      {
        heading: 'Size the value',
        links: [
          { href: '/assess?tool=roi', label: 'ROI Calculator', desc: 'Savings and payback in seconds', icon: 'calc' },
          { href: '/assess?tool=recommender', label: 'Find Your First AI Win', desc: 'A blueprint in three clicks', icon: 'spark' },
        ],
      },
    ],
    feature: { image: '/images/page-assess.webp', eyebrow: '10-minute assessment', title: 'Benchmark your AI maturity against the AI Ready target', href: '/assess?tool=readiness', cta: 'Start the assessment' },
  },
  {
    id: 'company',
    label: 'Company',
    overview: { href: '/about', title: 'About NSM', text: 'Practical intelligence for ambitious businesses.' },
    columns: [
      {
        heading: 'How we work',
        links: [
          { href: '/approach', label: 'Delivery Approach', desc: 'Six steps from bottleneck to production', icon: 'flow' },
          { href: '/approach#engagement', label: 'Engagement Models', desc: 'Sprint, build and managed operations', icon: 'briefcase' },
        ],
      },
      {
        heading: 'NSM Technologies',
        links: [
          { href: '/about', label: 'About Us', desc: 'Philosophy and values', icon: 'users' },
          { href: '/contact', label: 'Contact', desc: 'Book a free strategy call', icon: 'mail' },
        ],
      },
    ],
    feature: { image: '/images/section-team.webp', eyebrow: 'Talk to an architect', title: 'Book a free 20-minute strategy call', href: '/contact', cta: 'Book a call' },
  },
];
