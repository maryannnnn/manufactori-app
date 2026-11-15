/**
 * Local verification for corrective industrial article selection.
 * Run: npx tsx --tsconfig tsconfig.json src/scripts/_verifyCorrectiveArticles.mts
 */
import 'dotenv/config'
import config from '@payload-config'
import { getPayload } from 'payload'
import {
  queryArticlesForIndustry,
  queryIndustrialArticlesForService,
  queryLatestIndustrialArticles,
} from '../utilities/queryIndustryArticles'

const payload = await getPayload({ config })

const primaries = await payload.find({
  collection: 'industries',
  depth: 0,
  draft: false,
  limit: 12,
  overrideAccess: false,
  where: {
    and: [{ _status: { equals: 'published' } }, { industryLevel: { equals: 'primary' } }],
  },
  sort: 'displayOrder',
})

console.log(`Primaries: ${primaries.docs.length}`)
for (const doc of primaries.docs) {
  console.log(`  - ${doc.displayOrder ?? '?'} ${doc.slug}`)
}

const landing = await queryLatestIndustrialArticles(3)
console.log('\nLanding articles:')
for (const a of landing.articles) console.log(`  - ${a.slug}`)

const samples = [
  'metalworking-metal-manufacturing',
  'cnc-precision-machining',
  'metal-fabrication',
  'sheet-metal-metal-forming',
]

for (const slug of samples) {
  const found = await payload.find({
    collection: 'industries',
    depth: 1,
    limit: 1,
    where: { slug: { equals: slug } },
  })
  const industry = found.docs[0]
  if (!industry) {
    console.log(`\nMISSING industry ${slug}`)
    continue
  }
  const children =
    industry.industryLevel === 'primary'
      ? (
          await payload.find({
            collection: 'industries',
            depth: 0,
            limit: 100,
            where: {
              and: [
                { industryLevel: { equals: 'secondary' } },
                { parentIndustry: { equals: industry.id } },
                { _status: { equals: 'published' } },
              ],
            },
          })
        ).docs
          .map((d) => d.slug)
          .filter((s): s is string => Boolean(s))
      : []
  const { articles, viewAllHref } = await queryArticlesForIndustry(industry, {
    childSlugs: children,
  })
  console.log(`\n${slug} -> ${articles.length} cards; viewAll=${viewAllHref}`)
  for (const a of articles) console.log(`  - ${a.slug}`)
}

const service = await queryIndustrialArticlesForService({ serviceCategory: 'search' })
console.log('\nService search articles:')
for (const a of service.articles) console.log(`  - ${a.slug}`)

process.exit(0)
