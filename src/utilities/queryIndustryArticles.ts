import type { Payload, Where } from 'payload'
import { getPayload } from 'payload'

import type { CardPostData } from '@/components/Card'
import type { Industry, Post } from '@/payload-types'
import configPromise from '@payload-config'
import { BLOG_ARCHIVE_PATH, BLOG_CATEGORY_PATH_SEGMENT } from '@/utilities/getContentUrls'
import { getPostListPreview } from '@/utilities/getPostListPreview'
import { siteCategoryIds } from '@/components/RelatedSiteContent'

export const INDUSTRIAL_ARTICLE_LIMIT = 3

const POST_CARD_SELECT = {
  title: true,
  slug: true,
  publishedAt: true,
  categories: true,
  primary_category: true,
  meta: true,
  layout: true,
  site_categories: true,
} as const

const toCard = (doc: Post): CardPostData | null => {
  if (!doc.slug) return null
  const preview = getPostListPreview(doc)
  return {
    title: doc.title,
    slug: doc.slug,
    publishedAt: doc.publishedAt,
    categories: doc.categories,
    primary_category: doc.primary_category,
    meta: doc.meta,
    previewTitle: preview.previewTitle,
    previewText: preview.previewText,
    previewImage: preview.previewImage,
  }
}

const slugOf = (value: unknown): string | null => {
  if (!value) return null
  if (typeof value === 'object' && value !== null && 'slug' in value) {
    const slug = (value as { slug?: unknown }).slug
    return typeof slug === 'string' && slug ? slug : null
  }
  return null
}

const uniqueSlugs = (values: Array<string | null | undefined>): string[] =>
  [...new Set(values.filter((value): value is string => Boolean(value)))]

/** Blog category archive for an industry slug when that category exists. */
export const industryArticlesViewAllHref = (industrySlug: string | null | undefined): string => {
  if (!industrySlug) return BLOG_ARCHIVE_PATH
  return `/blog/${BLOG_CATEGORY_PATH_SEGMENT}/${industrySlug}`
}

const postsWhereForSlugs = (slugs: string[], siteCategoryIdList: number[]): Where | null => {
  const or: Where[] = []
  if (slugs.length > 0) {
    or.push({ 'primary_category.slug': { in: slugs } })
    or.push({ 'site_categories.slug': { in: slugs } })
  }
  if (siteCategoryIdList.length > 0) {
    or.push({ site_categories: { in: siteCategoryIdList } })
  }
  if (or.length === 0) return null
  return {
    and: [{ _status: { equals: 'published' } }, { or }],
  }
}

const queryPosts = async (
  payload: Payload,
  where: Where,
  limit: number,
  excludeSlugs: Set<string>,
): Promise<Post[]> => {
  const result = await payload.find({
    collection: 'posts',
    depth: 1,
    draft: false,
    limit: Math.max(limit * 3, limit),
    overrideAccess: false,
    pagination: false,
    sort: '-publishedAt',
    where,
    select: POST_CARD_SELECT,
  })

  return (result.docs as Post[]).filter((doc) => doc.slug && !excludeSlugs.has(doc.slug))
}

const appendUnique = (target: CardPostData[], incoming: Post[], limit: number): void => {
  const seen = new Set(target.map((doc) => doc.slug).filter(Boolean) as string[])

  for (const doc of incoming) {
    if (target.length >= limit) break
    if (!doc.slug || seen.has(doc.slug)) continue
    const card = toCard(doc)
    if (!card) continue
    seen.add(doc.slug)
    target.push(card)
  }
}

type IndustryArticleSource = {
  id?: number | string | null
  slug?: string | null
  industryLevel?: 'primary' | 'secondary' | null
  parentIndustry?: Industry['parentIndustry'] | { slug?: string | null; title?: string | null } | null
  site_categories?: Industry['site_categories']
}

/**
 * Published article cards for an Industrial page.
 *
 * Priority:
 * 1. Posts whose primary_category or site-category matches this specialization
 * 2. Parent industrial category (for nested pages)
 * 3. Child / sibling specializations under the same primary
 *
 * Selection is category-driven so newly published articles appear automatically.
 * Does not pad with unrelated general marketing posts.
 */
export const queryArticlesForIndustry = async (
  industry: IndustryArticleSource,
  options?: { childSlugs?: string[]; limit?: number },
): Promise<{ articles: CardPostData[]; viewAllHref: string }> => {
  const payload = await getPayload({ config: configPromise })
  const limit = options?.limit ?? INDUSTRIAL_ARTICLE_LIMIT
  const articles: CardPostData[] = []
  const excludeSlugs = new Set<string>()

  const ownSlug = industry.slug || null
  const parentSlug = slugOf(industry.parentIndustry)
  const siteIds = siteCategoryIds(industry.site_categories)
  const childSlugs = uniqueSlugs(options?.childSlugs ?? [])

  const trySlugs = async (slugs: string[], ids: number[] = []) => {
    if (articles.length >= limit) return
    const where = postsWhereForSlugs(uniqueSlugs(slugs), ids)
    if (!where) return
    const docs = await queryPosts(payload, where, limit - articles.length, excludeSlugs)
    for (const doc of docs) {
      if (doc.slug) excludeSlugs.add(doc.slug)
    }
    appendUnique(articles, docs, limit)
  }

  await trySlugs(ownSlug ? [ownSlug] : [], siteIds)

  if (industry.industryLevel === 'secondary' && parentSlug) {
    await trySlugs([parentSlug], [])
  }

  if (childSlugs.length > 0) {
    await trySlugs(childSlugs, [])
  }

  return {
    articles: articles.slice(0, limit),
    viewAllHref: industryArticlesViewAllHref(ownSlug),
  }
}

/**
 * Latest published articles across all Industrial specializations.
 */
export const queryLatestIndustrialArticles = async (
  limit: number = INDUSTRIAL_ARTICLE_LIMIT,
): Promise<{ articles: CardPostData[]; viewAllHref: string }> => {
  const payload = await getPayload({ config: configPromise })
  const industries = await payload.find({
    collection: 'industries',
    depth: 0,
    draft: false,
    limit: 500,
    overrideAccess: false,
    pagination: false,
    where: { _status: { equals: 'published' } },
    select: { slug: true },
  })

  const slugs = uniqueSlugs(industries.docs.map((doc) => doc.slug))
  if (slugs.length === 0) {
    return { articles: [], viewAllHref: BLOG_ARCHIVE_PATH }
  }

  const where = postsWhereForSlugs(slugs, [])
  if (!where) return { articles: [], viewAllHref: BLOG_ARCHIVE_PATH }

  const docs = await queryPosts(payload, where, limit, new Set())
  const articles = docs.flatMap((doc) => {
    const card = toCard(doc)
    return card ? [card] : []
  })

  return {
    articles: articles.slice(0, limit),
    viewAllHref: BLOG_ARCHIVE_PATH,
  }
}

/** Preferred blog / site-category slugs for each services overview bucket. */
const SERVICE_INDUSTRIAL_TOPIC_SLUGS: Record<string, string[]> = {
  strategy: [
    'manufacturing-marketing-strategy',
    'metalworking-metal-manufacturing',
    'industrial-machinery-equipment',
    'engineering-technical-services',
  ],
  website: [
    'industrial-website-architecture',
    'product-catalog-website',
    'manufacturing-website-development',
    'metalworking-metal-manufacturing',
  ],
  search: [
    'manufacturing-seo',
    'industrial-product-seo',
    'ai-search-optimization',
    'metalworking-metal-manufacturing',
  ],
  'paid-media': [
    'b2b-lead-generation',
    'lead-generation--new-business',
    'procurement-buyer-acquisition',
    'supplier-discovery',
  ],
  content: [
    'manufacturing-content-marketing',
    'engineering-content-marketing',
    'technical-content-for-ai-search',
    'metalworking-metal-manufacturing',
  ],
  sales: [
    'b2b-lead-generation',
    'supplier-discovery',
    'procurement-buyer-acquisition',
    'metalworking-metal-manufacturing',
  ],
}

/**
 * Industrial article previews for a Services page.
 * Uses thematic category slugs when possible, then falls back to latest industrial posts.
 */
export const queryIndustrialArticlesForService = async (args: {
  serviceSlug?: string | null
  serviceCategory?: string | null
  siteCategories?: unknown
  limit?: number
}): Promise<{ articles: CardPostData[]; viewAllHref: string }> => {
  const payload = await getPayload({ config: configPromise })
  const limit = args.limit ?? INDUSTRIAL_ARTICLE_LIMIT
  const articles: CardPostData[] = []
  const excludeSlugs = new Set<string>()

  const topicSlugs = uniqueSlugs([
    ...(args.serviceCategory ? SERVICE_INDUSTRIAL_TOPIC_SLUGS[args.serviceCategory] ?? [] : []),
  ])
  const siteIds = siteCategoryIds(args.siteCategories)

  const where = postsWhereForSlugs(topicSlugs, siteIds)
  if (where) {
    const docs = await queryPosts(payload, where, limit, excludeSlugs)
    for (const doc of docs) {
      if (doc.slug) excludeSlugs.add(doc.slug)
    }
    appendUnique(articles, docs, limit)
  }

  if (articles.length < limit) {
    const fallback = await queryLatestIndustrialArticles(limit)
    for (const card of fallback.articles) {
      if (articles.length >= limit) break
      if (!card.slug || excludeSlugs.has(card.slug)) continue
      excludeSlugs.add(card.slug)
      articles.push(card)
    }
  }

  const viewAllHref =
    topicSlugs[0] != null
      ? `/blog/${BLOG_CATEGORY_PATH_SEGMENT}/${topicSlugs[0]}`
      : BLOG_ARCHIVE_PATH

  return { articles: articles.slice(0, limit), viewAllHref }
}
