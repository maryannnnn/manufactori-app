import configPromise from '@payload-config'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'
import { cache } from 'react'

import type { CaseStudy, Industry } from '@/payload-types'

const idOf = (value: unknown): number | null => {
  if (typeof value === 'number') return value
  if (value && typeof value === 'object' && 'id' in value) {
    const id = (value as { id?: unknown }).id
    return typeof id === 'number' ? id : null
  }
  return null
}

export const querySecondaryBySlug = cache(async (slug: string) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'industries',
    depth: 2,
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      and: [{ slug: { equals: slug } }, { industryLevel: { equals: 'secondary' } }],
    },
  })
  const industry = result.docs[0]
  if (!industry) return null

  const parentId = idOf(industry.parentIndustry)
  let parent: Pick<Industry, 'id' | 'slug' | 'title'> | null = null
  if (parentId != null) {
    const parentDoc = await payload.findByID({
      collection: 'industries',
      id: parentId,
      depth: 0,
      draft: false,
      overrideAccess: false,
      disableErrors: true,
    })
    if (parentDoc?.slug) {
      parent = { id: parentDoc.id, slug: parentDoc.slug, title: parentDoc.title }
    }
  }
  return { industry, parent }
})

export const hydrateRelatedCaseStudies = async <
  T extends { relatedCaseStudies?: Industry['relatedCaseStudies'] },
>(
  industry: T,
): Promise<T> => {
  const related = industry.relatedCaseStudies ?? []
  const ids = related.map((item) => idOf(item?.caseStudy)).filter((id): id is number => id != null)
  if (ids.length === 0) return industry

  const payload = await getPayload({ config: configPromise })
  const found = await payload.find({
    collection: 'case-studies',
    depth: 1,
    draft: false,
    limit: ids.length,
    overrideAccess: false,
    pagination: false,
    where: { id: { in: ids } },
    select: {
      title: true,
      slug: true,
      layout: true,
      meta: true,
      primary_case_study_category: true,
      case_study_categories: true,
    },
  })
  const byId = new Map(found.docs.map((doc) => [Number(doc.id), doc as CaseStudy]))

  return {
    ...industry,
    relatedCaseStudies: related.map((item) => {
      const id = idOf(item?.caseStudy)
      const hydrated = id != null ? byId.get(id) : null
      if (!hydrated) return item
      return { ...item, caseStudy: hydrated }
    }),
  }
}
