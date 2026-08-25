import 'dotenv/config'
import config from '@payload-config'
import { getPayload } from 'payload'

import { blogCategories, blogCategoryToPayloadData } from '../data/blogCategories'

const seedBlogCategories = async () => {
  const payload = await getPayload({ config })

  const existing = await payload.find({
    collection: 'categories',
    limit: 1000,
    pagination: false,
    depth: 0,
    select: {
      title: true,
      slug: true,
    },
  })

  payload.logger.info(`Existing categories (${existing.docs.length}):`)
  for (const doc of existing.docs) {
    payload.logger.info(`  - ${doc.title} [/${doc.slug}] id=${doc.id}`)
  }

  const existingSlugs = new Set(existing.docs.map((doc) => doc.slug).filter(Boolean))

  for (const category of blogCategories) {
    if (existingSlugs.has(category.slug)) {
      payload.logger.info(`Skip existing slug: ${category.slug}`)
      continue
    }

    const created = await payload.create({
      collection: 'categories',
      data: blogCategoryToPayloadData(category),
      context: {
        disableRevalidate: true,
      },
    })

    payload.logger.info(`Created: ${created.title} → /blog/category/${created.slug}`)
  }

  const after = await payload.find({
    collection: 'categories',
    limit: 1000,
    pagination: false,
    depth: 0,
    select: { title: true, slug: true },
  })

  payload.logger.info('All categories after seed:')
  for (const doc of after.docs) {
    payload.logger.info(`  /blog/category/${doc.slug} — ${doc.title}`)
  }

  process.exit(0)
}

void seedBlogCategories().catch((error) => {
  console.error(error)
  process.exit(1)
})
