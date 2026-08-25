import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'

const verify = async () => {
  const payload = await getPayload({ config })

  const resources = await payload.create({
    collection: 'site-categories',
    data: { title: 'Resources', slug: 'resources', generateSlug: false },
  })

  const blog = await payload.create({
    collection: 'site-categories',
    data: { title: 'Blog', slug: 'blog', parent: resources.id, generateSlug: false },
  })

  const guides = await payload.create({
    collection: 'site-categories',
    data: { title: 'Guides', slug: 'guides', parent: blog.id, generateSlug: false },
  })

  const tree = await payload.find({
    collection: 'site-categories',
    depth: 1,
    sort: 'createdAt',
    where: {
      id: {
        in: [resources.id, blog.id, guides.id],
      },
    },
  })

  for (const doc of tree.docs) {
    const parentTitle =
      doc.parent && typeof doc.parent === 'object' ? doc.parent.title : doc.parent
    const crumbs = doc.breadcrumbs?.map((b) => b.label).join(' > ')
    payload.logger.info(`${doc.title} | parent=${parentTitle ?? 'none'} | crumbs=${crumbs}`)
  }

  await payload.delete({
    collection: 'site-categories',
    where: {
      id: {
        in: [guides.id, blog.id, resources.id],
      },
    },
  })

  payload.logger.info('Site Categories parent/child verified and sample docs removed')
  process.exit(0)
}

void verify().catch((error) => {
  console.error(error)
  process.exit(1)
})
