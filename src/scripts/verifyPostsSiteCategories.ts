import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'

const verify = async () => {
  const payload = await getPayload({ config })

  const siteA = await payload.create({
    collection: 'site-categories',
    data: { title: 'Manufacturing', slug: 'verify-manufacturing', generateSlug: false },
    context: { disableRevalidate: true },
  })

  const siteB = await payload.create({
    collection: 'site-categories',
    data: {
      title: 'Industries',
      slug: 'verify-industries',
      parent: siteA.id,
      generateSlug: false,
    },
    context: { disableRevalidate: true },
  })

  const blogCat = await payload.find({
    collection: 'categories',
    limit: 1,
    depth: 0,
  })

  if (!blogCat.docs[0]) {
    throw new Error('Need at least one Blog Category to create a Post for this check')
  }

  const post = await payload.create({
    collection: 'posts',
    draft: true,
    data: {
      title: 'Verify Site Categories Rel',
      slug: 'verify-site-categories-rel',
      primary_category: blogCat.docs[0].id,
      categories: [blogCat.docs[0].id],
      site_categories: [siteA.id, siteB.id],
      hero: { type: 'lowImpact' },
      layout: [],
    },
    context: { disableRevalidate: true },
  })

  const loaded = await payload.findByID({
    collection: 'posts',
    id: post.id,
    depth: 1,
    draft: true,
  })

  const siteTitles = (loaded.site_categories || [])
    .map((item) => (typeof item === 'object' ? item.title : item))
    .join(', ')

  payload.logger.info(
    `OK post=${loaded.title} blogCats=${Array.isArray(loaded.categories) ? loaded.categories.length : 0} siteCats=${siteTitles}`,
  )

  await payload.delete({
    collection: 'posts',
    id: post.id,
    context: { disableRevalidate: true },
  })

  await payload.delete({
    collection: 'site-categories',
    where: { id: { in: [siteB.id, siteA.id] } },
    context: { disableRevalidate: true },
  })

  payload.logger.info('posts.site_categories verified and samples removed')
  process.exit(0)
}

void verify().catch((error) => {
  console.error(error)
  process.exit(1)
})
