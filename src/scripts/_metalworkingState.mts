import 'dotenv/config'
import config from '@payload-config'
import { getPayload } from 'payload'

const payload = await getPayload({ config })
const metal = await payload.find({
  collection: 'industries',
  depth: 1,
  limit: 1,
  overrideAccess: true,
  where: { slug: { equals: 'metalworking-metal-manufacturing' } },
})
const d = metal.docs[0]
const secondaries = await payload.find({
  collection: 'industries',
  depth: 0,
  limit: 20,
  overrideAccess: true,
  where: { industryLevel: { equals: 'secondary' } },
})
const conflict = await payload.find({
  collection: 'industries',
  depth: 0,
  limit: 20,
  overrideAccess: true,
  where: {
    slug: {
      in: [
        'cnc-precision-machining',
        'metal-fabrication',
        'sheet-metal-metal-forming',
        'welding-heavy-fabrication',
        'casting-molding',
        'heat-treatment-material-processing',
        'surface-finishing-coatings',
        'laser-manufacturing',
      ],
    },
  },
})
console.log(
  JSON.stringify(
    {
      parentId: d?.id,
      planned: (d?.plannedSubindustries || []).map((x) => ({
        title: x.title,
        slug: x.slug,
        order: x.displayOrder,
      })),
      secondaryCount: secondaries.totalDocs,
      conflicts: conflict.docs.map((x) => ({ slug: x.slug, level: x.industryLevel })),
      services: (d?.recommendedServices || []).map((s) =>
        typeof s === 'object' ? s.slug : s,
      ),
      cases: (d?.relatedCaseStudies || []).map((c) => ({
        slug: typeof c.caseStudy === 'object' ? c.caseStudy?.slug : c.caseStudy,
        relevance: c.relevance,
      })),
      posts: (d?.relatedPosts || []).map((x) => (typeof x === 'object' ? x.slug : x)),
    },
    null,
    2,
  ),
)
process.exit(0)
