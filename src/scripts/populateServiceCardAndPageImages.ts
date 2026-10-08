import 'dotenv/config'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { generateJSON } from '@tiptap/html'
import config from '@payload-config'
import { getPayload } from 'payload'

import { getTiptapExtensions } from '../utilities/richText/extensions'

const IMAGE_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'assets')

const SERVICES = [
  {
    slug: 'marketing-strategy-roadmap',
    card: 'svc-card-strategy.jpg',
    page: 'svc-page-strategy.jpg',
    cardAlt: 'Unmarked manufacturing drawings and metal parts on a factory office table.',
    pageAlt: 'Manufacturing planning table with drawings, calipers and metal samples.',
  },
  {
    slug: 'website-design-development-for-manufacturers',
    card: 'svc-card-website.jpg',
    page: 'svc-page-website.jpg',
    cardAlt: 'Industrial office desk with a dark unmarked monitor beside a machined metal part.',
    pageAlt: 'Factory floor seen from an unmarked industrial office.',
  },
  {
    slug: 'seo-ai-search-optimization',
    card: 'svc-card-seo.jpg',
    page: 'svc-page-seo.jpg',
    cardAlt: 'Technical documents on a workbench in a manufacturing plant.',
    pageAlt: 'Technical manuals on a workbench with CNC machines in the background.',
  },
  {
    slug: 'technical-content-thought-leadership',
    card: 'svc-card-content.jpg',
    page: 'svc-page-content.jpg',
    cardAlt: 'Engineer reviewing a specification beside a precision-machined part.',
    pageAlt: 'Workshop table with a technical drawing and a machined metal component.',
  },
  {
    slug: 'lead-generation',
    card: 'svc-card-leads.jpg',
    page: 'svc-page-leads.jpg',
    cardAlt: 'Unmarked documents and a tablet on an industrial desk.',
    pageAlt: 'Paper documents on an industrial desk with a factory floor beyond the glass.',
  },
  {
    slug: 'sales-enablement-crm',
    card: 'svc-card-sales.jpg',
    page: 'svc-page-sales.jpg',
    cardAlt: 'Unmarked monitors on a steel desk in a manufacturing office.',
    pageAlt: 'Empty manufacturing office with dark unmarked screens.',
  },
] as const

const rt = (html: string) => generateJSON(html, getTiptapExtensions({ headingLevels: [2, 3, 4] }))

const toId = (value: unknown): number | null => {
  if (typeof value === 'number') return value
  if (value && typeof value === 'object' && 'id' in value) {
    const id = (value as { id?: unknown }).id
    return typeof id === 'number' ? id : null
  }
  return null
}

const loadImage = (filename: string) => {
  const data = readFileSync(path.join(IMAGE_DIR, filename))
  return {
    name: filename,
    data,
    mimetype: 'image/jpeg' as const,
    size: data.byteLength,
  }
}

const run = async () => {
  const payload = await getPayload({ config })

  const upload = async (filename: string, alt: string) => {
    const existing = await payload.find({
      collection: 'media',
      where: { filename: { equals: filename } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    if (existing.docs[0]) {
      console.log(`Reusing media ${existing.docs[0].id} (${filename})`)
      return existing.docs[0]
    }
    const created = await payload.create({
      collection: 'media',
      data: {
        alt,
        caption: rt(`<p>${alt}</p>`),
      },
      file: loadImage(filename),
      overrideAccess: true,
      context: { disableRevalidate: true },
    })
    console.log(`Created media ${created.id} ${created.filename}`)
    return created
  }

  for (const item of SERVICES) {
    const found = await payload.find({
      collection: 'services',
      depth: 0,
      limit: 1,
      overrideAccess: true,
      where: { slug: { equals: item.slug } },
      select: { id: true, slug: true, service_preview_image: true, service_card_image: true },
    })
    const service = found.docs[0]
    if (!service) {
      console.error(`Missing service ${item.slug}`)
      continue
    }

    const card = await upload(item.card, item.cardAlt)
    const page = await upload(item.page, item.pageAlt)
    const existingPreview = toId(service.service_preview_image)

    await payload.update({
      collection: 'services',
      id: service.id,
      data: {
        service_card_image: card.id,
        ...(existingPreview ? {} : { service_preview_image: page.id }),
      },
      overrideAccess: true,
      context: { disableRevalidate: true },
    })
    console.log(
      `Updated ${item.slug} card=${card.id} page=${existingPreview ? `kept ${existingPreview}` : page.id}`,
    )
  }

  process.exit(0)
}

void run().catch((error) => {
  console.error(error)
  process.exit(1)
})
