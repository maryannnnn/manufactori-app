import 'dotenv/config'
import config from '@payload-config'
import { getPayload } from 'payload'
import { getIndustryUrl } from '../utilities/getContentUrls'

const main = async () => {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'industries',
    depth: 0,
    draft: false,
    limit: 50,
    overrideAccess: true,
    pagination: false,
    sort: 'displayOrder',
    where: {
      and: [{ _status: { equals: 'published' } }, { industryLevel: { equals: 'primary' } }],
    },
  })
  console.log('published primaries', result.docs.length)
  for (const doc of result.docs) {
    console.log(
      JSON.stringify({
        id: doc.id,
        title: doc.title,
        slug: doc.slug,
        displayOrder: doc.displayOrder,
        url: getIndustryUrl(doc as never),
        hasPreviewImage: Boolean(doc.industryPreviewImage),
        previewLen: String(doc.industryPreviewDescription || '').length,
      }),
    )
  }

  const allPrimaryish = await payload.find({
    collection: 'industries',
    depth: 0,
    limit: 50,
    overrideAccess: true,
    pagination: false,
    where: { industryLevel: { equals: 'primary' } },
  })
  console.log('--- all primary including drafts ---', allPrimaryish.docs.length)
  for (const doc of allPrimaryish.docs) {
    console.log(`${doc.id} ${doc._status} ${doc.slug} order=${doc.displayOrder}`)
  }
  process.exit(0)
}

void main().catch((e) => {
  console.error(e)
  process.exit(1)
})
