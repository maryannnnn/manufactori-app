import 'dotenv/config'

import config from '@payload-config'
import { getPayload } from 'payload'

/** Homepage order, top to bottom. Matched by slug fragment. */
const HOME_ORDER = [
  'laser-made',
  'pnevmomachta',
  'alumatrix',
  'merkan',
  'aleks-sf',
  'siblux',
] as const

const context = { disableRevalidate: true, disableCategorySeo: true }

const run = async () => {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'case-studies',
    depth: 0,
    draft: false,
    limit: 200,
    overrideAccess: true,
    pagination: false,
    select: { title: true, slug: true, featured: true, displayOrder: true },
    where: { _status: { equals: 'published' } },
  })

  const chosen = HOME_ORDER.map((fragment, index) => {
    const matches = result.docs.filter((doc) => doc.slug?.includes(fragment))
    if (matches.length !== 1) {
      throw new Error(
        `${fragment}: expected 1 case, found ${matches.map((doc) => doc.slug).join(', ') || 'none'}`,
      )
    }
    return { doc: matches[0], displayOrder: index + 1 }
  })
  const chosenIds = new Set(chosen.map((item) => item.doc.id))

  for (const item of chosen) {
    await payload.update({
      collection: 'case-studies',
      id: item.doc.id,
      draft: false,
      overrideAccess: true,
      context,
      data: { featured: true, displayOrder: item.displayOrder },
    })
    payload.logger.info(`home ${item.displayOrder} ${item.doc.slug}`)
  }

  for (const doc of result.docs) {
    if (chosenIds.has(doc.id) || doc.featured !== true) continue
    await payload.update({
      collection: 'case-studies',
      id: doc.id,
      draft: false,
      overrideAccess: true,
      context,
      data: { featured: false },
    })
    payload.logger.info(`removed from home ${doc.slug}`)
  }

  process.exit(0)
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
