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

/** Path segment for category archive pages: /blog/category/{slug} */
export const BLOG_CATEGORY_PATH_SEGMENT = 'category'

/** Path segment for case study category archives: /case-study/category/{slug} */
export const CASE_STUDY_CATEGORY_PATH_SEGMENT = 'category'

/** Slugs that would collide with blog routing. */
export const RESERVED_CATEGORY_SLUGS = ['category', 'categories'] as const

/** Slugs that would collide with case-study routing. */
export const RESERVED_CASE_STUDY_CATEGORY_SLUGS = ['category', 'categories'] as const

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
  return `/case-study/${CASE_STUDY_CATEGORY_PATH_SEGMENT}/${slug}`
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
  if (!categorySlug) return `/case-study/${doc.slug}`

  return `/case-study/${categorySlug}/${doc.slug}`
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
  if (relationTo === 'categories') return getCategoryUrl(value)
  if (relationTo === 'case-study-categories') return getCaseStudyCategoryUrl(value)

  if (value.slug) {
    return `/${value.slug}`
  }

  return null
}
