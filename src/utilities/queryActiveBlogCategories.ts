import { getPayload } from 'payload'
import { cache } from 'react'

import configPromise from '@payload-config'
import { getCategoryUrl } from '@/utilities/getContentUrls'

export type ActiveBlogCategory = {
  id: number
  title: string
  slug: string
  href: string
  score: number
  recentCount: number
}

const WINDOW_DAYS = 120
const MAX_CATEGORIES = 18

/**
 * Time-weighted Industrial blog categories for the Blog landing chips.
 * Recent publishing activity outweighs older historical volume.
 */
export const queryActiveBlogCategories = cache(async (): Promise<ActiveBlogCategory[]> => {
  const payload = await getPayload({ config: configPromise })

  const [industries, posts] = await Promise.all([
    payload.find({
      collection: 'industries',
      depth: 0,
      draft: false,
      limit: 500,
      overrideAccess: false,
      pagination: false,
      where: { _status: { equals: 'published' } },
      select: { slug: true },
    }),
    payload.find({
      collection: 'posts',
      depth: 1,
      draft: false,
      limit: 500,
      overrideAccess: false,
      pagination: false,
      sort: '-publishedAt',
      where: { _status: { equals: 'published' } },
      select: {
        publishedAt: true,
        primary_category: true,
        categories: true,
      },
    }),
  ])

  const industrialSlugs = new Set(
    industries.docs.map((doc) => doc.slug).filter((slug): slug is string => Boolean(slug)),
  )

  const now = Date.now()
  const scores = new Map<
    string,
    { id: number; title: string; slug: string; score: number; recentCount: number }
  >()

  for (const post of posts.docs) {
    const publishedAt = post.publishedAt ? Date.parse(post.publishedAt) : NaN
    if (!Number.isFinite(publishedAt)) continue
    const ageDays = Math.max(0, (now - publishedAt) / (1000 * 60 * 60 * 24))
    if (ageDays > WINDOW_DAYS) continue

    // Half-life roughly one week: recent posts dominate the ranking.
    const weight = 1 / (1 + ageDays / 7)

    const refs = [
      post.primary_category,
      ...(Array.isArray(post.categories) ? post.categories : []),
    ]

    for (const ref of refs) {
      if (!ref || typeof ref !== 'object') continue
      const slug = ref.slug
      const title = ref.title
      const id = typeof ref.id === 'number' ? ref.id : Number(ref.id)
      if (!slug || !title || !Number.isFinite(id)) continue
      if (industrialSlugs.size > 0 && !industrialSlugs.has(slug)) continue

      const existing = scores.get(slug)
      if (existing) {
        existing.score += weight
        existing.recentCount += 1
      } else {
        scores.set(slug, { id, title, slug, score: weight, recentCount: 1 })
      }
    }
  }

  return [...scores.values()]
    .sort((a, b) => b.score - a.score || b.recentCount - a.recentCount || a.title.localeCompare(b.title))
    .slice(0, MAX_CATEGORIES)
    .flatMap((item) => {
      const href = getCategoryUrl({ slug: item.slug })
      if (!href) return []
      return [{ ...item, href }]
    })
})
