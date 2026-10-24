import { getPayload } from 'payload'
import React, { cache } from 'react'

import type { CaseStudy } from '@/payload-types'

import { CaseStudyArchive } from '@/components/CaseStudyArchive'
import configPromise from '@payload-config'
import { getCaseStudyListPreview } from '@/utilities/getCaseStudyListPreview'

const LIMIT = 3
const PAGE_SIZE = 100

/** Numeric ids from a hasMany site-categories relationship, populated or raw. */
export const siteCategoryIds = (value: unknown): number[] => {
  if (!Array.isArray(value)) return []

  const ids = value.flatMap((item) => {
    if (typeof item === 'number' && Number.isFinite(item)) return [item]
    if (typeof item === 'string' && /^\d+$/.test(item)) return [Number(item)]
    if (item && typeof item === 'object' && 'id' in item) {
      const id = (item as { id?: unknown }).id
      if (typeof id === 'number' && Number.isFinite(id)) return [id]
      if (typeof id === 'string' && /^\d+$/.test(id)) return [Number(id)]
    }
    return []
  })

  return [...new Set(ids)]
}

const sampleDistinct = <T,>(items: T[], count: number): T[] => {
  const pool = items.slice()
  const take = Math.min(count, pool.length)

  for (let index = 0; index < take; index++) {
    const swap = index + Math.floor(Math.random() * (pool.length - index))
    const current = pool[index]
    pool[index] = pool[swap]
    pool[swap] = current
  }

  return pool.slice(0, take)
}

/**
 * Published case studies that share any of the given Site Categories.
 * The pool is the union of every assigned category, then a random sample.
 * Cached for the request so a client interaction cannot redraw the cards.
 * `sourceKey` keeps two posts that share categories from reusing one sample.
 */
const queryRelatedCaseStudies = cache(async (categoryKey: string, sourceKey: string) => {
  const ids = categoryKey.split(',').map(Number).filter((id) => Number.isFinite(id))
  if (!ids.length || !sourceKey) return []

  const payload = await getPayload({ config: configPromise })
  const matched = new Map<
    number,
    Pick<
      CaseStudy,
      'id' | 'title' | 'slug' | 'layout' | 'case_study_categories' | 'primary_case_study_category' | 'meta'
    >
  >()
  let page = 1

  while (page <= 20) {
    const result = await payload.find({
      collection: 'case-studies',
      depth: 1,
      draft: false,
      limit: PAGE_SIZE,
      overrideAccess: false,
      page,
      pagination: true,
      select: {
        title: true,
        slug: true,
        case_study_categories: true,
        primary_case_study_category: true,
        meta: true,
        layout: true,
      },
      where: {
        and: [{ _status: { equals: 'published' } }, { site_categories: { in: ids } }],
      },
    })

    for (const doc of result.docs) {
      matched.set(doc.id, doc)
    }

    if (!result.hasNextPage) break
    page += 1
  }

  return sampleDistinct([...matched.values()], LIMIT).map((doc) => {
    const preview = getCaseStudyListPreview(doc)
    return {
      title: doc.title,
      slug: doc.slug,
      case_study_categories: doc.case_study_categories,
      primary_case_study_category: doc.primary_case_study_category,
      meta: doc.meta,
      previewTitle: preview.previewTitle,
      previewText: preview.previewText,
      previewImage: preview.previewImage,
    }
  })
})

/**
 * Up to three published case studies that share a hidden Site Category with the
 * current post. Site Category titles are never rendered. The section is omitted
 * when the post has no site categories or no matching case studies.
 */
export const RelatedSiteContent: React.FC<{
  siteCategories: unknown
  sourceId: number | string
}> = async ({ siteCategories, sourceId }) => {
  const ids = siteCategoryIds(siteCategories)
  if (!ids.length) return null

  const docs = await queryRelatedCaseStudies(
    [...ids].sort((a, b) => a - b).join(','),
    String(sourceId),
  )
  if (!docs.length) return null

  return (
    <section
      aria-labelledby="related-case-studies-heading"
      className="border-t border-border py-16 md:py-20"
    >
      <div className="container">
        <h2
          className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl"
          id="related-case-studies-heading"
        >
          Related Case Studies
        </h2>
      </div>
      <CaseStudyArchive className="mt-10" docs={docs} />
    </section>
  )
}
