import {
  BLOG_ARCHIVE_PATH,
  CASE_STUDIES_ARCHIVE_PATH,
  getServiceUrl,
  SERVICES_ARCHIVE_PATH,
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
  links: NavLink[]
}

export type NavItem = {
  id: string
  label: string
  href: string
  sections?: NavSection[]
}

export const serviceNavLinks: NavLink[] = [
  {
    label: 'Marketing Strategy & Roadmap',
    href: getServiceUrl({ slug: 'marketing-strategy-roadmap' })!,
  },
  {
    label: 'Website Design & Development for Manufacturers',
    href: getServiceUrl({ slug: 'website-design-development-for-manufacturers' })!,
  },
  {
    label: 'SEO & AI Search Optimization',
    href: getServiceUrl({ slug: 'seo-ai-search-optimization' })!,
  },
  {
    label: 'Technical Content & Thought Leadership',
    href: getServiceUrl({ slug: 'technical-content-thought-leadership' })!,
  },
  {
    label: 'Lead Generation',
    href: getServiceUrl({ slug: 'lead-generation' })!,
  },
  {
    label: 'Sales Enablement & CRM',
    href: getServiceUrl({ slug: 'sales-enablement-crm' })!,
  },
]

export const mainNavigation: NavItem[] = [
  { id: 'home', label: 'Home', href: '/' },
  { id: 'about', label: 'About', href: '/about' },
  {
    id: 'services',
    label: 'Services',
    href: SERVICES_ARCHIVE_PATH,
    sections: [{ links: serviceNavLinks }],
  },
  { id: 'case-studies', label: 'Case Studies', href: CASE_STUDIES_ARCHIVE_PATH },
  { id: 'blog', label: 'Blog', href: BLOG_ARCHIVE_PATH },
  { id: 'contact', label: 'Contact', href: '/contact' },
]

/** Used by the mobile phone icon. No site phone number exists yet. */
export const contactHref = '/contact'

export const getNavSections = (item: NavItem): NavSection[] => item.sections ?? []

export const navItemHasMenu = (item: NavItem): boolean => getNavSections(item).some((section) => section.links.length > 0)
