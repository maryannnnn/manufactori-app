import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'

const verify = async () => {
  const payload = await getPayload({ config })

  const parent = await payload.create({
    collection: 'case-study-categories',
    data: {
      title: 'Manufacturing',
      case_study_long_title: 'Manufacturing Case Studies',
      slug: 'manufacturing',
      generateSlug: false,
    },
    context: { disableRevalidate: true },
  })

  const child = await payload.create({
    collection: 'case-study-categories',
    data: {
      title: 'CNC Machining',
      case_study_long_title: 'CNC Machining Case Studies',
      slug: 'cnc-machining',
      parent: parent.id,
      generateSlug: false,
    },
    context: { disableRevalidate: true },
  })

  const loaded = await payload.findByID({
    collection: 'case-study-categories',
    id: child.id,
    depth: 1,
  })

  const parentTitle =
    loaded.parent && typeof loaded.parent === 'object' ? loaded.parent.title : loaded.parent
  const crumbs = loaded.breadcrumbs?.map((b) => b.label).join(' > ')

  payload.logger.info(
    `OK child=${loaded.title} parent=${parentTitle} crumbs=${crumbs} url=/case-study/category/${loaded.slug}`,
  )

  await payload.delete({
    collection: 'case-study-categories',
    where: { id: { in: [child.id, parent.id] } },
    context: { disableRevalidate: true },
  })

  payload.logger.info('Case Study Categories parent/child verified and samples removed')
  process.exit(0)
}

void verify().catch((error) => {
  console.error(error)
  process.exit(1)
})
