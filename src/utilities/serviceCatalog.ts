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
  'website-design-development-for-manufacturers': 'website',
  'seo-ai-search-optimization': 'search',
  'ai-search-optimization-manufacturers': 'search',
  'lead-generation': 'paid-media',
  'technical-content-thought-leadership': 'content',
  'sales-enablement-crm': 'sales',
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

export const LEGACY_SERVICE_REDIRECTS: Record<string, string> = Object.fromEntries(
  Object.entries(SERVICE_CATEGORY_BY_SLUG)
    .filter(([slug]) =>
      [
        'marketing-strategy-roadmap',
        'website-design-development-for-manufacturers',
        'seo-ai-search-optimization',
        'ai-search-optimization-manufacturers',
        'lead-generation',
        'technical-content-thought-leadership',
        'sales-enablement-crm',
      ].includes(slug),
    )
    .map(([slug, category]) => [`/services/${slug}`, `/services/${category}/${slug}`]),
)
