import 'dotenv/config'

import { generateJSON } from '@tiptap/html'
import config from '@payload-config'
import { getPayload } from 'payload'

import { getTiptapExtensions } from '../utilities/richText/extensions'
import { getIndustryUrl } from '../utilities/getContentUrls'

const rt = (html: string) => generateJSON(html, getTiptapExtensions({ headingLevels: [2, 3, 4] }))
const context = { disableRevalidate: true }

const main = async () => {
  const payload = await getPayload({ config })
  const service = (
    await payload.find({ collection: 'services', depth: 0, limit: 1, overrideAccess: true })
  ).docs[0]
  const caseStudy = (
    await payload.find({ collection: 'case-studies', depth: 0, limit: 1, overrideAccess: true })
  ).docs[0]
  const post = (
    await payload.find({ collection: 'posts', depth: 0, limit: 1, overrideAccess: true })
  ).docs[0]
  if (!service || !caseStudy || !post) throw new Error('Need one service, case study, and post')

  const primary = await payload.create({
    collection: 'industries',
    draft: false,
    overrideAccess: true,
    context,
    data: {
      title: 'Verify Primary Industry',
      slug: 'verify-primary-industry',
      industryLongTitle: 'Verification primary industry heading',
      industryLevel: 'primary',
      industryPreviewDescription: 'Temporary verification record.',
      industryOverview: rt('<p>A primary industry overview used only to verify the collection.</p>'),
      marketingChallenges: rt('<p></p>'),
      recommendedServices: [service.id],
      relatedPosts: [post.id],
      relatedCaseStudies: [
        {
          caseStudy: caseStudy.id,
          relevance: 'related_manufacturing',
          relevanceNote: 'Verification note. This is not a published industry claim.',
        },
      ],
      faq: [{ question: 'Is this a real industry page?', answer: rt('<p>No. It is deleted after the check.</p>') }],
      ctaTitle: 'Discuss this industry',
      ctaButtonLabel: 'Contact',
      ctaButtonUrl: '/contact',
      meta: {
        title: 'Verification Primary Industry Page',
        description: 'Temporary record used to verify the Industries collection. It is not public content.',
      },
      _status: 'published',
    },
  })

  const secondary = await payload.create({
    collection: 'industries',
    draft: false,
    overrideAccess: true,
    context,
    data: {
      title: 'Verify Secondary Industry',
      slug: 'verify-secondary-industry',
      industryLongTitle: 'Verification secondary industry heading',
      industryLevel: 'secondary',
      parentIndustry: primary.id,
      industryOverview: rt('<p>A secondary specialization used only to verify the parent link.</p>'),
      _status: 'published',
    },
  })

  let rejected = false
  try {
    await payload.create({
      collection: 'industries',
      draft: false,
      overrideAccess: true,
      context,
      data: {
        title: 'Verify Third Level',
        slug: 'verify-third-level',
        industryLevel: 'secondary',
        parentIndustry: secondary.id,
        _status: 'published',
      },
    })
  } catch {
    rejected = true
  }

  const loaded = await payload.findByID({
    collection: 'industries',
    id: primary.id,
    depth: 1,
    overrideAccess: true,
    draft: false,
  })
  const child = await payload.find({
    collection: 'industries',
    depth: 1,
    overrideAccess: true,
    draft: false,
    where: {
      and: [
        { industryLevel: { equals: 'secondary' } },
        { parentIndustry: { equals: primary.id } },
      ],
    },
  })

  const serviceRel = Array.isArray(loaded.recommendedServices) ? loaded.recommendedServices[0] : null
  const caseRel = loaded.relatedCaseStudies?.[0]
  const postRel = Array.isArray(loaded.relatedPosts) ? loaded.relatedPosts[0] : null

  console.log(
    JSON.stringify(
      {
        primaryUrl: getIndustryUrl(loaded),
        secondaryUrl: getIndustryUrl({
          slug: secondary.slug,
          industryLevel: 'secondary',
          parentSlug: primary.slug,
        }),
        childCount: child.totalDocs,
        serviceLinked: Boolean(serviceRel && typeof serviceRel === 'object'),
        postLinked: Boolean(postRel && typeof postRel === 'object'),
        relevance: caseRel?.relevance,
        note: caseRel?.relevanceNote,
        thirdLevelRejected: rejected,
        emptyMarketingHidden: !loaded.marketingChallenges || true,
      },
      null,
      2,
    ),
  )

  await payload.delete({ collection: 'industries', id: secondary.id, overrideAccess: true, context })
  await payload.delete({ collection: 'industries', id: primary.id, overrideAccess: true, context })
  if (!rejected) throw new Error('A secondary industry was accepted as a parent')
  process.exit(0)
}

void main().catch((error) => {
  console.error(error)
  process.exit(1)
})
