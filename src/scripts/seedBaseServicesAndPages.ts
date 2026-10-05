import 'dotenv/config'
import { generateJSON } from '@tiptap/html'
import config from '@payload-config'
import { getPayload } from 'payload'

import { emptyTiptapDocument } from '../utilities/richText/normalizeValue'
import { getTiptapExtensions } from '../utilities/richText/extensions'
import { getServiceUrl } from '../utilities/getContentUrls'

const headingDoc = (text: string) =>
  generateJSON(`<h1>${text}</h1>`, getTiptapExtensions({ headingLevels: [1, 2, 3, 4] }))

const services = [
  {
    title: 'Marketing Strategy & Roadmap',
    slug: 'marketing-strategy-roadmap',
    seoDescription: 'Marketing strategy and roadmap for manufacturing companies.',
    displayOrder: 1,
  },
  {
    title: 'Website Design & Development for Manufacturers',
    slug: 'website-design-development-for-manufacturers',
    seoDescription: 'Website design and development for manufacturing companies.',
    displayOrder: 2,
  },
  {
    title: 'SEO & AI Search Optimization',
    slug: 'seo-ai-search-optimization',
    seoDescription: 'SEO and AI search optimization for manufacturing companies.',
    displayOrder: 3,
  },
  {
    title: 'Technical Content & Thought Leadership',
    slug: 'technical-content-thought-leadership',
    seoDescription: 'Technical content and thought leadership for manufacturing companies.',
    displayOrder: 4,
  },
  {
    title: 'Lead Generation',
    slug: 'lead-generation',
    seoDescription: 'Lead generation for manufacturing companies.',
    displayOrder: 5,
  },
  {
    title: 'Sales Enablement & CRM',
    slug: 'sales-enablement-crm',
    seoDescription: 'Sales enablement and CRM for manufacturing companies.',
    displayOrder: 6,
  },
] as const

const pages = [
  {
    title: 'About',
    slug: 'about',
    seoDescription: 'About this manufacturing marketing agency.',
  },
  {
    title: 'Contact',
    slug: 'contact',
    seoDescription: 'Contact this manufacturing marketing agency.',
  },
] as const

const seed = async () => {
  const payload = await getPayload({ config })

  const existingServices = await payload.find({
    collection: 'services',
    depth: 0,
    limit: 200,
    pagination: false,
    select: { title: true, slug: true, _status: true },
  })

  payload.logger.info(`Existing services (${existingServices.docs.length}):`)
  for (const doc of existingServices.docs) {
    payload.logger.info(`  - ${doc.title} [/${doc.slug}] status=${doc._status ?? 'n/a'}`)
  }

  const existingServiceSlugs = new Set(
    existingServices.docs.map((doc) => doc.slug).filter((slug): slug is string => Boolean(slug)),
  )

  for (const service of services) {
    if (existingServiceSlugs.has(service.slug)) {
      payload.logger.info(`Skip existing service slug: ${service.slug}`)
      continue
    }

    const created = await payload.create({
      collection: 'services',
      depth: 0,
      context: { disableRevalidate: true },
      data: {
        title: service.title,
        service_long_title: service.title,
        slug: service.slug,
        generateSlug: false,
        displayOrder: service.displayOrder,
        featured: false,
        _status: 'published',
        meta: {
          title: service.title,
          description: service.seoDescription,
        },
      },
    })

    payload.logger.info(`Created service: ${created.title} → ${getServiceUrl(created)}`)
  }

  const existingPages = await payload.find({
    collection: 'pages',
    depth: 0,
    limit: 200,
    pagination: false,
    select: { title: true, slug: true, _status: true },
  })

  payload.logger.info(`Existing pages (${existingPages.docs.length}):`)
  for (const doc of existingPages.docs) {
    payload.logger.info(`  - ${doc.title} [/${doc.slug}] status=${doc._status ?? 'n/a'}`)
  }

  const existingPageSlugs = new Set(
    existingPages.docs.map((doc) => doc.slug).filter((slug): slug is string => Boolean(slug)),
  )

  for (const page of pages) {
    if (existingPageSlugs.has(page.slug)) {
      payload.logger.info(`Skip existing page slug: ${page.slug}`)
      continue
    }

    const created = await payload.create({
      collection: 'pages',
      depth: 0,
      context: { disableRevalidate: true },
      data: {
        title: page.title,
        pageLongTitle: page.title,
        slug: page.slug,
        generateSlug: false,
        _status: 'published',
        hero: {
          type: 'lowImpact',
          richText: headingDoc(page.title),
        },
        layout: [
          {
            blockType: 'content',
            columns: [
              {
                size: 'full',
                richText: emptyTiptapDocument(),
              },
            ],
          },
        ],
        meta: {
          title: page.title,
          description: page.seoDescription,
        },
      },
    })

    payload.logger.info(`Created page: ${created.title} → /${created.slug}`)
  }

  process.exit(0)
}

void seed().catch((error) => {
  console.error(error)
  process.exit(1)
})
