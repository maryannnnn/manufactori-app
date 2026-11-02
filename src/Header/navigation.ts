import {
  BLOG_ARCHIVE_PATH,
  CASE_STUDIES_ARCHIVE_PATH,
  CLIENTS_PATH,
  getServiceUrl,
  INDUSTRIES_ARCHIVE_PATH,
  SERVICES_ARCHIVE_PATH,
  TESTIMONIALS_ARCHIVE_PATH,
} from '@/utilities/getContentUrls'

export type NavLink = {
  label: string
  href: string
}

/**
 * One column or named group inside a mega menu / mobile disclosure.
 * Extra sections, headings and nested groups can be added here later
 * without changing the menu components.
 */
export type NavSection = {
  heading?: string
  /** Overview page for this column. The heading links here when set. */
  href?: string
  links: NavLink[]
}

export type NavItem = {
  id: string
  label: string
  href: string
  sections?: NavSection[]
  /** Desktop mega menu: one stacked list per section, three sections across. */
  menuStyle?: 'columns'
}

const serviceHref = (slug: string) => getServiceUrl({ slug })!

export const serviceNavLinks: NavLink[] = [
  {
    label: 'Marketing Strategy & Roadmap',
    href: serviceHref('marketing-strategy-roadmap'),
  },
  {
    label: 'Industrial Website Design',
    href: serviceHref('industrial-website-design'),
  },
  {
    label: 'SEO & AI Search Optimization',
    href: serviceHref('seo-ai-search-optimization'),
  },
  {
    label: 'AI Search Optimization & Content Engineering',
    href: serviceHref('ai-search-optimization-content-engineering'),
  },
  {
    label: 'Technical Content Strategy',
    href: serviceHref('technical-content-strategy'),
  },
  {
    label: 'Outbound Lead Generation',
    href: serviceHref('outbound-lead-generation'),
  },
  {
    label: 'Sales Enablement',
    href: serviceHref('sales-enablement'),
  },
]

/**
 * Six service groups. Column headings go to overview pages.
 * Links below them are published service pages only. Names without a page
 * stay on the overview, not in the menu.
 */
export const serviceNavSections: NavSection[] = [
  {
    heading: 'Strategy & Planning',
    href: serviceHref('strategy'),
    links: [
      {
        label: 'Marketing Strategy & Roadmap',
        href: serviceHref('marketing-strategy-roadmap'),
      },
      {
        label: 'Market & Competitor Research',
        href: serviceHref('market-competitor-research'),
      },
      {
        label: 'Brand Positioning & Messaging',
        href: serviceHref('brand-positioning-messaging'),
      },
      {
        label: 'Buyer Persona Research',
        href: serviceHref('buyer-persona-research'),
      },
      {
        label: 'Fractional Marketing Advisory',
        href: serviceHref('fractional-marketing-advisory'),
      },
      {
        label: 'International Marketing Strategy',
        href: serviceHref('international-marketing-strategy'),
      },
    ],
  },
  {
    heading: 'Websites & Digital Experience',
    href: serviceHref('website'),
    links: [
      {
        label: 'Industrial Website Design',
        href: serviceHref('industrial-website-design'),
      },
      {
        label: 'Website Development',
        href: serviceHref('website-development'),
      },
      {
        label: 'Website Redesign & Audit',
        href: serviceHref('website-redesign-audit'),
      },
      {
        label: 'Product Catalogs & E-commerce',
        href: serviceHref('product-catalogs-ecommerce'),
      },
      {
        label: 'UX/UI for Engineers & B2B Buyers',
        href: serviceHref('ux-ui-for-engineers-b2b-buyers'),
      },
      {
        label: 'RFQ Forms & Conversion Optimization',
        href: serviceHref('rfq-forms-conversion-optimization'),
      },
      {
        label: 'Website Maintenance & Security',
        href: serviceHref('website-maintenance-security'),
      },
      {
        label: 'CAD & 3D Configurator Integration',
        href: serviceHref('cad-3d-configurator-integration'),
      },
    ],
  },
  {
    heading: 'Search & AI Visibility',
    href: serviceHref('search'),
    links: [
      {
        label: 'SEO & AI Search Optimization',
        href: serviceHref('seo-ai-search-optimization'),
      },
      {
        label: 'AI Search Optimization & Content Engineering',
        href: serviceHref('ai-search-optimization-content-engineering'),
      },
      {
        label: 'Industrial SEO',
        href: serviceHref('industrial-seo'),
      },
      {
        label: 'Technical SEO & Website Audits',
        href: serviceHref('technical-seo-website-audits'),
      },
      {
        label: 'AI Search Optimization (GEO)',
        href: serviceHref('ai-search-optimization-geo'),
      },
      {
        label: 'Answer Engine Optimization (AEO)',
        href: serviceHref('answer-engine-optimization-aeo'),
      },
      {
        label: 'AI Visibility & Citation Audits',
        href: serviceHref('ai-visibility-citation-audits'),
      },
      {
        label: 'Entity & Authority Building',
        href: serviceHref('entity-authority-building'),
      },
      {
        label: 'International & Multilingual SEO',
        href: serviceHref('international-multilingual-seo'),
      },
      {
        label: 'Local & Multi-Location SEO',
        href: serviceHref('local-multi-location-seo'),
      },
    ],
  },
  {
    heading: 'Paid Media & Demand Generation',
    href: serviceHref('paid-media'),
    links: [
      {
        label: 'Search Engine Marketing (SEM)',
        href: serviceHref('search-engine-marketing-sem'),
      },
      {
        label: 'Google Ads for Manufacturers',
        href: serviceHref('google-ads-manufacturers'),
      },
      {
        label: 'Microsoft Ads',
        href: serviceHref('microsoft-ads'),
      },
      {
        label: 'LinkedIn Ads & B2B Campaigns',
        href: serviceHref('linkedin-ads-b2b-campaigns'),
      },
      {
        label: 'Facebook & Instagram Ads',
        href: serviceHref('facebook-instagram-ads'),
      },
      {
        label: 'Account-Based Marketing (ABM)',
        href: serviceHref('account-based-marketing-abm'),
      },
      {
        label: 'Remarketing & Retargeting',
        href: serviceHref('remarketing-retargeting'),
      },
      {
        label: 'Paid Social Advertising',
        href: serviceHref('paid-social-advertising'),
      },
      {
        label: 'Outbound Lead Generation',
        href: serviceHref('outbound-lead-generation'),
      },
      {
        label: 'Email Marketing & Lead Nurturing',
        href: serviceHref('email-marketing-lead-nurturing'),
      },
    ],
  },
  {
    heading: 'Technical Content & Brand',
    href: serviceHref('content'),
    links: [
      {
        label: 'Technical Content Strategy',
        href: serviceHref('technical-content-strategy'),
      },
      {
        label: 'Engineering Articles & Guides',
        href: serviceHref('engineering-articles-guides'),
      },
      {
        label: 'Product & Capability Pages',
        href: serviceHref('product-capability-pages'),
      },
      {
        label: 'Technical White Papers',
        href: serviceHref('technical-white-papers'),
      },
      {
        label: 'Manufacturing Case Studies',
        href: serviceHref('manufacturing-case-studies'),
      },
      {
        label: 'Thought Leadership',
        href: serviceHref('thought-leadership'),
      },
      {
        label: 'Industrial Video & Photography',
        href: serviceHref('industrial-video-photography'),
      },
      {
        label: 'Brand Identity & Visual Communication',
        href: serviceHref('brand-identity-visual-communication'),
      },
      {
        label: 'Sales Collateral & Presentations',
        href: serviceHref('sales-collateral-presentations'),
      },
    ],
  },
  {
    heading: 'Sales Enablement & Marketing Systems',
    href: serviceHref('sales'),
    links: [
      {
        label: 'Sales Enablement',
        href: serviceHref('sales-enablement'),
      },
      {
        label: 'CRM Implementation & Integration',
        href: serviceHref('crm-implementation-integration'),
      },
      {
        label: 'Marketing Automation',
        href: serviceHref('marketing-automation'),
      },
      {
        label: 'Lead Management & Nurturing',
        href: serviceHref('lead-management-nurturing'),
      },
      {
        label: 'Analytics & Conversion Tracking',
        href: serviceHref('analytics-conversion-tracking'),
      },
      {
        label: 'RFQ Funnel Optimization',
        href: serviceHref('rfq-funnel-optimization'),
      },
      {
        label: 'Distributor & Channel Enablement',
        href: serviceHref('distributor-channel-enablement'),
      },
      {
        label: 'Trade Show & Event Marketing',
        href: serviceHref('trade-show-event-marketing'),
      },
    ],
  },
]

export const mainNavigation: NavItem[] = [
  {
    id: 'services',
    label: 'Services',
    href: SERVICES_ARCHIVE_PATH,
    sections: serviceNavSections,
  },
  { id: 'industries', label: 'Industrial', href: INDUSTRIES_ARCHIVE_PATH, menuStyle: 'columns' },
  { id: 'case-studies', label: 'Case Studies', href: CASE_STUDIES_ARCHIVE_PATH },
  { id: 'blog', label: 'Blog', href: BLOG_ARCHIVE_PATH },
  {
    id: 'about',
    label: 'About',
    href: '/about',
    sections: [
      {
        links: [
          { label: 'Clients', href: CLIENTS_PATH },
          { label: 'Testimonials', href: TESTIMONIALS_ARCHIVE_PATH },
        ],
      },
    ],
  },
  { id: 'contact', label: 'Contact', href: '/contact' },
]

export const headerCta: NavLink = {
  label: 'Get a Free Audit',
  href: '/contact',
}

/** Used by the mobile phone icon. No site phone number exists yet. */
export const contactHref = '/contact'

export const getNavSections = (item: NavItem): NavSection[] => item.sections ?? []

export const navItemHasMenu = (item: NavItem): boolean => getNavSections(item).some((section) => section.links.length > 0)

export const isNavPathCurrent = (pathname: string, href: string): boolean => {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}
