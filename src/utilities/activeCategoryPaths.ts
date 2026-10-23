import type { Payload } from 'payload'

import {
  getCaseStudyCategoryUrl,
  getCategorySlug,
  getCategoryUrl,
  isReservedCaseStudyCategorySlug,
  isReservedCategorySlug,
} from '@/utilities/getContentUrls'

export type PublicCategoryKind = 'post' | 'case-study'

export const collectActiveCategoryPaths = async (
  payload: Payload,
  kind: PublicCategoryKind,
): Promise<Array<{ slug: string; path: string; lastmod: string }>> => {
  const result = await payload.find({
    collection: kind === 'post' ? 'posts' : 'case-studies',
    depth: 1,
    draft: false,
    limit: 1000,
    overrideAccess: true,
    pagination: false,
    where: {
      _status: {
        equals: 'published',
      },
    },
    select:
      kind === 'post'
        ? { updatedAt: true, primary_category: true, categories: true }
        : { updatedAt: true, primary_case_study_category: true, case_study_categories: true },
  })

  const map = new Map<string, { slug: string; path: string; lastmod: string }>()

  for (const doc of result.docs as unknown as Array<Record<string, unknown>>) {
    const lastmod = typeof doc.updatedAt === 'string' ? doc.updatedAt : ''
    const refs =
      kind === 'post'
        ? [doc.primary_category, ...(Array.isArray(doc.categories) ? doc.categories : [])]
        : [
            doc.primary_case_study_category,
            ...(Array.isArray(doc.case_study_categories) ? doc.case_study_categories : []),
          ]

    for (const ref of refs) {
      const slug = getCategorySlug(ref as never)
      if (!slug) continue
      if (kind === 'post' ? isReservedCategorySlug(slug) : isReservedCaseStudyCategorySlug(slug)) {
        continue
      }
      const path =
        kind === 'post' ? getCategoryUrl(ref as never) : getCaseStudyCategoryUrl(ref as never)
      if (!path) continue
      const existing = map.get(path)
      if (existing) {
        if (lastmod > existing.lastmod) existing.lastmod = lastmod
        continue
      }
      map.set(path, { slug, path, lastmod })
    }
  }

  return [...map.values()]
}
