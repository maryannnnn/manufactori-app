import {
  BLOG_ARCHIVE_PATH,
  CASE_STUDIES_ARCHIVE_PATH,
  CLIENTS_PATH,
  getServiceUrl,
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
}

const serviceHref = (slug: string) => getServiceUrl({ slug })!

export const serviceNavLinks: NavLink[] = [
  {
    label: 'Marketing Strategy & Roadmap',
    href: serviceHref('marketing-strategy-roadmap'),
  },
  {
    label: 'Website Design & Development for Manufacturers',
    href: serviceHref('website-design-development-for-manufacturers'),
  },
  {
    label: 'SEO & AI Search Optimization',
    href: serviceHref('seo-ai-search-optimization'),
  },
  {
    label: 'AI Search Optimization & Content Engineering',
    href: serviceHref('ai-search-optimization-manufacturers'),
  },
  {
    label: 'Technical Content & Thought Leadership',
    href: serviceHref('technical-content-thought-leadership'),
  },
  {
    label: 'Lead Generation',
    href: serviceHref('lead-generation'),
  },
  {
    label: 'Sales Enablement & CRM',
    href: serviceHref('sales-enablement-crm'),
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
        label: 'Website Design & Development for Manufacturers',
        href: serviceHref('website-design-development-for-manufacturers'),
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
        href: serviceHref('ai-search-optimization-manufacturers'),
      },
    ],
  },
  {
    heading: 'Paid Media & Demand Generation',
    href: serviceHref('paid-media'),
    links: [
      {
        label: 'Lead Generation',
        href: serviceHref('lead-generation'),
      },
    ],
  },
  {
    heading: 'Technical Content & Brand',
    href: serviceHref('content'),
    links: [
      {
        label: 'Technical Content & Thought Leadership',
        href: serviceHref('technical-content-thought-leadership'),
      },
    ],
  },
  {
    heading: 'Sales Enablement & Marketing Systems',
    href: serviceHref('sales'),
    links: [
      {
        label: 'Sales Enablement & CRM',
        href: serviceHref('sales-enablement-crm'),
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
