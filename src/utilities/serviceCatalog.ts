export const SERVICE_OVERVIEW_SLUGS = [
  'strategy',
  'website',
  'search',
  'paid-media',
  'content',
  'sales',
] as const

export type ServiceCategorySlug = (typeof SERVICE_OVERVIEW_SLUGS)[number]

export const SERVICE_CATEGORY_LABELS: Record<ServiceCategorySlug, string> = {
  strategy: 'Strategy & Planning',
  website: 'Websites & Digital Experience',
  search: 'Search & AI Visibility',
  'paid-media': 'Paid Media & Demand Generation',
  content: 'Technical Content & Brand',
  sales: 'Sales Enablement & Marketing Systems',
}

/**
 * Individual service slug to its public category.
 * Overview slugs stay one segment and are not listed here.
 */
export const SERVICE_CATEGORY_BY_SLUG: Record<string, ServiceCategorySlug> = {
  'marketing-strategy-roadmap': 'strategy',
  'market-competitor-research': 'strategy',
  'brand-positioning-messaging': 'strategy',
  'buyer-persona-research': 'strategy',
  'fractional-marketing-advisory': 'strategy',
  'international-marketing-strategy': 'strategy',
  'industrial-website-design': 'website',
  'website-development': 'website',
  'website-redesign-audit': 'website',
  'product-catalogs-ecommerce': 'website',
  'ux-ui-for-engineers-b2b-buyers': 'website',
  'rfq-forms-conversion-optimization': 'website',
  'website-maintenance-security': 'website',
  'cad-3d-configurator-integration': 'website',
  'seo-ai-search-optimization': 'search',
  'ai-search-optimization-content-engineering': 'search',
  'industrial-seo': 'search',
  'technical-seo-website-audits': 'search',
  'ai-search-optimization-geo': 'search',
  'answer-engine-optimization-aeo': 'search',
  'ai-visibility-citation-audits': 'search',
  'entity-authority-building': 'search',
  'international-multilingual-seo': 'search',
  'local-multi-location-seo': 'search',
  'search-engine-marketing-sem': 'paid-media',
  'google-ads-manufacturers': 'paid-media',
  'microsoft-ads': 'paid-media',
  'linkedin-ads-b2b-campaigns': 'paid-media',
  'facebook-instagram-ads': 'paid-media',
  'account-based-marketing-abm': 'paid-media',
  'remarketing-retargeting': 'paid-media',
  'paid-social-advertising': 'paid-media',
  'outbound-lead-generation': 'paid-media',
  'email-marketing-lead-nurturing': 'paid-media',
  'technical-content-strategy': 'content',
  'engineering-articles-guides': 'content',
  'product-capability-pages': 'content',
  'technical-white-papers': 'content',
  'manufacturing-case-studies': 'content',
  'thought-leadership': 'content',
  'industrial-video-photography': 'content',
  'brand-identity-visual-communication': 'content',
  'sales-collateral-presentations': 'content',
  'sales-enablement': 'sales',
  'crm-implementation-integration': 'sales',
  'marketing-automation': 'sales',
  'lead-management-nurturing': 'sales',
  'analytics-conversion-tracking': 'sales',
  'rfq-funnel-optimization': 'sales',
  'distributor-channel-enablement': 'sales',
  'trade-show-event-marketing': 'sales',
}

export const isServiceOverview = (slug: string | null | undefined): boolean =>
  Boolean(slug && (SERVICE_OVERVIEW_SLUGS as readonly string[]).includes(slug))

export const getServiceCategorySlug = (
  slug: string | null | undefined,
): ServiceCategorySlug | null => {
  if (!slug || isServiceOverview(slug)) return null
  return SERVICE_CATEGORY_BY_SLUG[slug] ?? null
}

export const getServiceCategory = (
  slug: string | null | undefined,
): { slug: ServiceCategorySlug; label: string } | null => {
  const category = getServiceCategorySlug(slug)
  if (!category) return null
  return { slug: category, label: SERVICE_CATEGORY_LABELS[category] }
}

export const legacyServicePath = (slug: string): string => `/services/${slug}`

const LEGACY_INDIVIDUAL_SLUGS = [
  'marketing-strategy-roadmap',
  'seo-ai-search-optimization',
] as const

export const LEGACY_SERVICE_REDIRECTS: Record<string, string> = {
  ...Object.fromEntries(
    LEGACY_INDIVIDUAL_SLUGS.map((slug) => [
      `/services/${slug}`,
      `/services/${SERVICE_CATEGORY_BY_SLUG[slug]}/${slug}`,
    ]),
  ),
  '/services/website-design-development-for-manufacturers':
    '/services/website/industrial-website-design',
  '/services/website/website-design-development-for-manufacturers':
    '/services/website/industrial-website-design',
  '/services/ai-search-optimization-manufacturers':
    '/services/search/ai-search-optimization-content-engineering',
  '/services/search/ai-search-optimization-manufacturers':
    '/services/search/ai-search-optimization-content-engineering',
  '/services/lead-generation': '/services/paid-media/outbound-lead-generation',
  '/services/paid-media/lead-generation': '/services/paid-media/outbound-lead-generation',
  '/services/technical-content-thought-leadership':
    '/services/content/technical-content-strategy',
  '/services/content/technical-content-thought-leadership':
    '/services/content/technical-content-strategy',
  '/services/sales-enablement-crm': '/services/sales/sales-enablement',
  '/services/sales/sales-enablement-crm': '/services/sales/sales-enablement',
}
