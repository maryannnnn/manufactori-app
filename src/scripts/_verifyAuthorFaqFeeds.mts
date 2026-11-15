/**
 * Verify author template constants + FAQ/discussion aggregation + category activity.
 * Run: npx tsx --tsconfig tsconfig.json src/scripts/_verifyAuthorFaqFeeds.mts
 */
import 'dotenv/config'
import config from '@payload-config'
import { getPayload } from 'payload'
import { AUTHOR_IDENTITY } from '../utilities/authorIdentity'
import { queryActiveBlogCategories } from '../utilities/queryActiveBlogCategories'
import { queryAggregatedDiscussions } from '../utilities/queryAggregatedDiscussions'
import { queryAggregatedFaqs } from '../utilities/queryAggregatedFaqs'

const payload = await getPayload({ config })

const posts = await payload.find({
  collection: 'posts',
  depth: 0,
  draft: false,
  limit: 0,
  overrideAccess: false,
  where: { _status: { equals: 'published' } },
})

console.log('AUTHOR_IDENTITY', AUTHOR_IDENTITY)
console.log('published posts', posts.totalDocs)

const cats = await queryActiveBlogCategories()
console.log('\nActive blog categories', cats.length)
for (const c of cats.slice(0, 8)) console.log(`  ${c.score.toFixed(2)} ${c.slug}`)

const homeFaqs = await queryAggregatedFaqs({
  limit: 5,
  quota: { services: 1, 'case-studies': 1, industries: 1, posts: 2 },
})
console.log('\nHome FAQs')
for (const item of homeFaqs) {
  console.log(`  [${item.sourceCollection}] ${item.sourceTitle} — ${item.question.slice(0, 60)}`)
}

const homeDisc = await queryAggregatedDiscussions({ limit: 5 })
console.log('\nHome discussions')
for (const item of homeDisc) {
  console.log(`  [${item.sourceCollection}] ${item.sourceTitle} — ${item.author}`)
}

const svc = await queryAggregatedFaqs({ limit: 5, allow: ['services'], quota: { services: 5 } })
console.log('\nServices FAQs', svc.length)

const csFaq = await queryAggregatedFaqs({
  limit: 5,
  allow: ['case-studies'],
  quota: { 'case-studies': 5 },
})
const csDisc = await queryAggregatedDiscussions({ limit: 5, allow: ['case-studies'] })
console.log('Case study FAQ/disc', csFaq.length, csDisc.length)

const indFaq = await queryAggregatedFaqs({
  limit: 5,
  allow: ['industries'],
  quota: { industries: 5 },
})
const indDisc = await queryAggregatedDiscussions({
  limit: 5,
  allow: ['posts'],
  industrialOnly: true,
})
console.log('Industrial FAQ/disc', indFaq.length, indDisc.length)

process.exit(0)
