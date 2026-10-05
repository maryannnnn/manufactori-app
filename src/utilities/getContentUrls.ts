type CategoryLike = {
  slug?: string | null
} | null | undefined

type CategoryRef = number | string | CategoryLike

type PostUrlSource = {
  slug?: string | null
  primary_category?: CategoryRef
  primary_category_slug?: string | null
}

type CaseStudyUrlSource = {
  slug?: string | null
  primary_case_study_category?: CategoryRef
  primary_case_study_category_slug?: string | null
}

type ServiceUrlSource = {
  slug?: string | null
}

type TestimonialUrlSource = {
  slug?: string | null
}

/** Posts listing route; individual posts live beneath it. */
export const BLOG_ARCHIVE_PATH = '/blog'

/** Path segment for category archive pages: /blog/category/{slug} */
export const BLOG_CATEGORY_PATH_SEGMENT = 'category'

/** Reserved path segment that must not be used as a Case Study Category slug. */
export const CASE_STUDY_CATEGORY_PATH_SEGMENT = 'category'

/** Case study listing route; individual case studies live beneath it. */
export const CASE_STUDIES_ARCHIVE_PATH = '/case-studies'

/** Services listing route; individual services live beneath it. */
export const SERVICES_ARCHIVE_PATH = '/services'

/** Future testimonials listing route; individual testimonials live beneath it. */
export const TESTIMONIALS_ARCHIVE_PATH = '/testimonials'

/** Slugs that would collide with blog routing. */
export const RESERVED_CATEGORY_SLUGS = ['category', 'categories'] as const

/** Slugs that would collide with Case Studies routing. */
export const RESERVED_CASE_STUDY_CATEGORY_SLUGS = [
  CASE_STUDY_CATEGORY_PATH_SEGMENT,
  'categories',
] as const

export const isReservedCategorySlug = (slug: string | null | undefined): boolean => {
  return Boolean(slug && RESERVED_CATEGORY_SLUGS.includes(slug as (typeof RESERVED_CATEGORY_SLUGS)[number]))
}

export const isReservedCaseStudyCategorySlug = (slug: string | null | undefined): boolean => {
  return Boolean(
    slug &&
      RESERVED_CASE_STUDY_CATEGORY_SLUGS.includes(
        slug as (typeof RESERVED_CASE_STUDY_CATEGORY_SLUGS)[number],
      ),
  )
}

export const getCategorySlug = (category: CategoryRef): string | null => {
  if (category && typeof category === 'object' && category.slug) {
    return category.slug
  }

  return null
}

export const getCategoryUrl = (category: CategoryRef): string | null => {
  const slug = getCategorySlug(category)
  if (!slug) return null
  return `/blog/${BLOG_CATEGORY_PATH_SEGMENT}/${slug}`
}

export const getCaseStudyCategoryUrl = (category: CategoryRef): string | null => {
  const slug = getCategorySlug(category)
  if (!slug) return null
  return `${CASE_STUDIES_ARCHIVE_PATH}/${slug}`
}

export const getPostUrl = (post: PostUrlSource | null | undefined): string | null => {
  if (!post?.slug) return null

  const categorySlug = post.primary_category_slug || getCategorySlug(post.primary_category)
  if (!categorySlug) return `/blog/${post.slug}`

  return `/blog/${categorySlug}/${post.slug}`
}

export const getCaseStudyUrl = (doc: CaseStudyUrlSource | null | undefined): string | null => {
  if (!doc?.slug) return null

  const categorySlug =
    doc.primary_case_study_category_slug || getCategorySlug(doc.primary_case_study_category)
  if (!categorySlug) return `${CASE_STUDIES_ARCHIVE_PATH}/${doc.slug}`

  return `${CASE_STUDIES_ARCHIVE_PATH}/${categorySlug}/${doc.slug}`
}

export const getServiceUrl = (doc: ServiceUrlSource | null | undefined): string | null => {
  if (!doc?.slug) return null
  return `${SERVICES_ARCHIVE_PATH}/${doc.slug}`
}

export const getTestimonialUrl = (doc: TestimonialUrlSource | null | undefined): string | null => {
  if (!doc?.slug) return null
  return `${TESTIMONIALS_ARCHIVE_PATH}/${doc.slug}`
}

export const getReferenceUrl = (
  relationTo: string | null | undefined,
  value:
    | {
        slug?: string | null
        primary_category?: CategoryRef
        primary_category_slug?: string | null
        primary_case_study_category?: CategoryRef
        primary_case_study_category_slug?: string | null
      }
    | string
    | number
    | null
    | undefined,
): string | null => {
  if (!relationTo || value == null || typeof value !== 'object') return null

  if (relationTo === 'posts') return getPostUrl(value)
  if (relationTo === 'case-studies') return getCaseStudyUrl(value)
  if (relationTo === 'services') return getServiceUrl(value)
  if (relationTo === 'testimonials') return getTestimonialUrl(value)
  if (relationTo === 'categories') return getCategoryUrl(value)
  if (relationTo === 'case-study-categories') return getCaseStudyCategoryUrl(value)

  if (value.slug) {
    return `/${value.slug}`
  }

  return null
}
