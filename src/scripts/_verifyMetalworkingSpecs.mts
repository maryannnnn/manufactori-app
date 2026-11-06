import 'dotenv/config'
import config from '@payload-config'
import { getPayload } from 'payload'
import { getIndustryUrl } from '../utilities/getContentUrls'

const SLUGS = [
  'cnc-precision-machining',
  'metal-fabrication',
  'sheet-metal-metal-forming',
  'welding-heavy-fabrication',
  'casting-molding',
  'heat-treatment-material-processing',
  'surface-finishing-coatings',
  'laser-manufacturing',
]

const run = async () => {
  const payload = await getPayload({ config })
  const parent = await payload.find({
    collection: 'industries',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: { slug: { equals: 'metalworking-metal-manufacturing' } },
  })
  const parentDoc = parent.docs[0]
  const children = await payload.find({
    collection: 'industries',
    depth: 1,
    limit: 20,
    overrideAccess: true,
    pagination: false,
    sort: 'displayOrder',
    where: {
      and: [
        { industryLevel: { equals: 'secondary' } },
        { parentIndustry: { equals: parentDoc!.id } },
        { _status: { equals: 'published' } },
      ],
    },
  })

  const report = children.docs.map((doc) => ({
    slug: doc.slug,
    title: doc.title,
    h1: doc.industryLongTitle,
    metaTitle: doc.meta?.title,
    metaDescription: doc.meta?.description,
    url: getIndustryUrl({
      slug: doc.slug,
      industryLevel: 'secondary',
      parentSlug: parentDoc!.slug,
    }),
    services: (doc.recommendedServices ?? []).length,
    posts: (doc.relatedPosts ?? []).length,
    cases: (doc.relatedCaseStudies ?? []).length,
    faq: (doc.faq ?? []).length,
    hasImage: Boolean(doc.industryPreviewImage),
    status: doc._status,
  }))

  console.log(
    JSON.stringify(
      {
        parentPlanned: parentDoc?.plannedSubindustries?.length ?? 0,
        childCount: children.docs.length,
        expected: SLUGS.length,
        missing: SLUGS.filter((slug) => !children.docs.some((doc) => doc.slug === slug)),
        report,
      },
      null,
      2,
    ),
  )
  process.exit(0)
}

void run()
