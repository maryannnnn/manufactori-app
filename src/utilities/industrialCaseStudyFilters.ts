import type { Where } from 'payload'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

/** Agreed Industrial filters, in display order. Titles come from the CMS records. */
export const INDUSTRIAL_CASE_STUDY_FILTER_SLUGS = [
  'furniture-manufacturing',
  'retail-equipment-manufacturing',
  'structural-steel-fabrication',
  'custom-metal-products',
  'wooden-house-manufacturing',
  'upholstered-furniture',
  'ventilated-facade-manufacturing',
  'construction',
  'engineering-systems',
  'sauna-and-bath-construction',
  'construction-materials-manufacturing',
  'industrial-packaging',
  'advertising-products-manufacturing',
  'hvac--climate-equipment',
] as const

export type IndustrialCaseStudyFilter = {
  id: number
  slug: string
  title: string
}

const idOf = (value: unknown): number | null => {
  if (typeof value === 'number') return value
  if (value && typeof value === 'object' && 'id' in value && typeof value.id === 'number') {
    return value.id
  }
  return null
}

/**
 * Loads the agreed Industrial Case Study Categories from CMS.
 * A record counts only when it sits in the Industrial branch.
 */
export const getIndustrialCaseStudyFilters = async (): Promise<IndustrialCaseStudyFilter[]> => {
  const payload = await getPayload({ config: configPromise })
  const roots = await payload.find({
    collection: 'case-study-categories',
    depth: 0,
    limit: 10,
    overrideAccess: false,
    where: { slug: { equals: 'industrial' } },
    select: { title: true, slug: true, parent: true },
  })
  const industrialId = roots.docs.find((doc) => idOf(doc.parent) == null)?.id
  if (industrialId == null) return []

  const result = await payload.find({
    collection: 'case-study-categories',
    depth: 0,
    limit: INDUSTRIAL_CASE_STUDY_FILTER_SLUGS.length,
    overrideAccess: false,
    pagination: false,
    where: {
      slug: { in: [...INDUSTRIAL_CASE_STUDY_FILTER_SLUGS] },
    },
    select: { title: true, slug: true, parent: true, breadcrumbs: true },
  })

  const inIndustrial = result.docs.filter((doc) => {
    if (doc.id === industrialId) return true
    if (idOf(doc.parent) === industrialId) return true
    return (doc.breadcrumbs ?? []).some((crumb) => idOf(crumb.doc) === industrialId)
  })

  const order = new Map(INDUSTRIAL_CASE_STUDY_FILTER_SLUGS.map((slug, index) => [slug, index]))

  return inIndustrial
    .flatMap((doc) => {
      if (!doc.slug || !doc.title) return []
      return [{ id: doc.id, slug: doc.slug, title: doc.title }]
    })
    .sort((a, b) => (order.get(a.slug as never) ?? 99) - (order.get(b.slug as never) ?? 99))
}

export const caseStudyCategoryWhere = (categoryId: number): Where => ({
  case_study_categories: { in: [categoryId] },
})
