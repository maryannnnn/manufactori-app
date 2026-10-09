import 'dotenv/config'
import { copyFileSync, mkdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { generateJSON } from '@tiptap/html'
import config from '@payload-config'
import { getPayload } from 'payload'

import { getTiptapExtensions } from '../utilities/richText/extensions'

const SOURCE_DIR = 'C:/Users/arsen/.cursor/projects/c-Rabota-React-Manufactori/assets'
const IMAGE_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'assets')

const ASSIGNMENTS = [
  {
    slug: 'paktrademash-packaging-equipment',
    filename: 'cs-preview-paktrademash.jpg',
    alt: 'Unmarked industrial packaging line with stainless-steel machinery and blank cartons on a conveyor.',
  },
  {
    slug: 'nesko-energy-efficiency',
    filename: 'cs-preview-nesko.jpg',
    alt: 'Industrial energy-management room with electrical cabinets and monitoring equipment, no readable data.',
  },
  {
    slug: 'vimpel-engineering-anechoic-chambers',
    filename: 'cs-preview-vimpel.jpg',
    alt: 'Interior of an anechoic chamber with pyramid RF-absorbing panels and an unmarked test fixture.',
  },
] as const

const rt = (html: string) => generateJSON(html, getTiptapExtensions({ headingLevels: [2, 3, 4] }))

const run = async () => {
  mkdirSync(IMAGE_DIR, { recursive: true })
  const payload = await getPayload({ config })

  for (const item of ASSIGNMENTS) {
    const dest = path.join(IMAGE_DIR, item.filename)
    copyFileSync(path.join(SOURCE_DIR, item.filename), dest)

    const existing = await payload.find({
      collection: 'media',
      where: { filename: { equals: item.filename } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })

    let media = existing.docs[0]
    if (!media) {
      media = await payload.create({
        collection: 'media',
        data: {
          alt: item.alt,
          caption: rt(`<p>${item.alt}</p>`),
        },
        file: {
          name: item.filename,
          data: readFileSync(dest),
          mimetype: 'image/jpeg',
          size: readFileSync(dest).byteLength,
        },
        overrideAccess: true,
        context: { disableRevalidate: true },
      })
      console.log(`Created media ${media.id} ${media.filename}`)
    } else {
      console.log(`Reusing media ${media.id} (${item.filename})`)
    }

    const found = await payload.find({
      collection: 'case-studies',
      depth: 0,
      limit: 1,
      overrideAccess: true,
      where: { slug: { equals: item.slug } },
      select: { id: true, slug: true, layout: true },
    })
    const doc = found.docs[0]
    if (!doc) {
      console.error(`Missing case study ${item.slug}`)
      continue
    }

    const layout = (doc.layout ?? []).map((block) => {
      if (block.blockType !== 'csPreview') return block
      return { ...block, case_study_preview_image: media.id }
    })

    if (!(doc.layout ?? []).some((block) => block.blockType === 'csPreview')) {
      console.error(`No csPreview block on ${item.slug}`)
      continue
    }

    await payload.update({
      collection: 'case-studies',
      id: doc.id,
      data: { layout },
      overrideAccess: true,
      context: { disableRevalidate: true },
    })
    console.log(`Assigned preview image ${media.id} to ${item.slug}`)
  }

  process.exit(0)
}

void run().catch((error) => {
  console.error(error)
  process.exit(1)
})
