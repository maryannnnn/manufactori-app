import 'dotenv/config'

import config from '@payload-config'
import { getPayload } from 'payload'

import {
  MEDICAL_PRIMARY_UPDATE,
  PLANNED_BY_PRIMARY,
  PLANNED_TOTAL,
  RELATED_BY_PRIMARY,
} from './content/industrialPlannedStructure'

const context = { disableRevalidate: true, disableCategorySeo: true }

const idsFor = async (
  payload: Awaited<ReturnType<typeof getPayload>>,
  collection: 'services' | 'case-studies',
  slugs: string[],
) => {
  const unique = [...new Set(slugs)]
  if (unique.length === 0) return new Map<string, number>()
  const found = await payload.find({
    collection,
    depth: 0,
    limit: unique.length,
    overrideAccess: true,
    pagination: false,
    where: { slug: { in: unique } },
  })
  const map = new Map<string, number>()
  for (const doc of found.docs) {
    if (doc.slug) map.set(doc.slug, Number(doc.id))
  }
  const missing = unique.filter((slug) => !map.has(slug))
  if (missing.length > 0) throw new Error(`${collection} missing: ${missing.join(', ')}`)
  return map
}

const main = async () => {
  if (PLANNED_BY_PRIMARY.length !== 9) throw new Error(`Expected 9 primaries, got ${PLANNED_BY_PRIMARY.length}`)
  console.log(JSON.stringify({ plannedTotal: PLANNED_TOTAL, groups: PLANNED_BY_PRIMARY.map((g) => [g.primarySlug, g.directions.length]) }))

  const payload = await getPayload({ config })
  const allServiceSlugs = Object.values(RELATED_BY_PRIMARY).flatMap((item) => item.services)
  const allCaseSlugs = Object.values(RELATED_BY_PRIMARY).flatMap((item) => item.cases.map((c) => c.slug))
  const serviceIds = await idsFor(payload, 'services', allServiceSlugs)
  const caseIds = await idsFor(payload, 'case-studies', allCaseSlugs)

  const summary: Record<string, { planned: number; services: string[]; cases: string[] }> = {}

  for (const group of PLANNED_BY_PRIMARY) {
    const related = RELATED_BY_PRIMARY[group.primarySlug]
    if (!related) throw new Error(`Missing related picks for ${group.primarySlug}`)
    if (related.services.length > 3) throw new Error(`${group.primarySlug} has more than 3 services`)
    if (related.cases.length > 3) throw new Error(`${group.primarySlug} has more than 3 cases`)

    const existing = await payload.find({
      collection: 'industries',
      depth: 0,
      limit: 1,
      overrideAccess: true,
      pagination: false,
      where: {
        and: [{ slug: { equals: group.primarySlug } }, { industryLevel: { equals: 'primary' } }],
      },
    })
    const doc = existing.docs[0]
    if (!doc) throw new Error(`Primary industry not found: ${group.primarySlug}`)

    const data: Record<string, unknown> = {
      plannedSubindustries: group.directions.map((item) => ({
        title: item.title,
        slug: item.slug,
        displayOrder: item.displayOrder,
      })),
      recommendedServices: related.services.map((slug) => serviceIds.get(slug)!),
      relatedCaseStudies: related.cases.map((item) => ({
        caseStudy: caseIds.get(item.slug)!,
        relevance: item.relevance,
        relevanceNote: item.note,
      })),
    }

    if (group.primarySlug === 'medical-specialized-manufacturing') {
      Object.assign(data, {
        title: MEDICAL_PRIMARY_UPDATE.title,
        industryLongTitle: MEDICAL_PRIMARY_UPDATE.industryLongTitle,
        industryPreviewDescription: MEDICAL_PRIMARY_UPDATE.industryPreviewDescription,
        meta: {
          ...(typeof doc.meta === 'object' && doc.meta ? doc.meta : {}),
          title: MEDICAL_PRIMARY_UPDATE.metaTitle,
          description: MEDICAL_PRIMARY_UPDATE.metaDescription,
        },
      })
    }

    await payload.update({
      collection: 'industries',
      id: doc.id,
      context,
      data,
      draft: false,
      overrideAccess: true,
    })

    summary[group.primarySlug] = {
      planned: group.directions.length,
      services: related.services,
      cases: related.cases.map((item) => item.slug),
    }
    payload.logger.info(`Updated ${group.primarySlug}: ${group.directions.length} planned cards`)
  }

  console.log(JSON.stringify({ ok: true, plannedTotal: PLANNED_TOTAL, summary }, null, 2))
}

void main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
