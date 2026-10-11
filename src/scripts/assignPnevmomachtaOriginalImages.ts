import 'dotenv/config'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { generateJSON } from '@tiptap/html'
import config from '@payload-config'
import { getPayload } from 'payload'

import { getTiptapExtensions } from '../utilities/richText/extensions'

const SLUG = 'pnevmomachta-long-term-digital-presence'
const IMAGE_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'assets')
const TRAILING = new Set(['csFAQ', 'csComments', 'cta'])

const rt = (html: string) => generateJSON(html, getTiptapExtensions({ headingLevels: [2, 3, 4] }))

type ImageSpec = {
  filename: string
  alt: string
  caption: string
}

const MAIN: ImageSpec = {
  filename: 'pnevmomachta-main-project.jpg',
  alt: 'White portable lighting mast with two LED floodlights on a tripod, outdoors beside a building.',
  caption: 'Portable lighting mast with two LED floodlights on a white tripod.',
}

const PRODUCTS: ImageSpec[] = [
  {
    filename: 'pnevmomachta-product-01.jpg',
    alt: 'Olive-green telescopic lighting mast on a wheeled tripod with four LED floodlights and a portable generator.',
    caption: 'Telescopic lighting mast on a wheeled tripod, shown with four LED floodlights and a portable generator.',
  },
  {
    filename: 'pnevmomachta-double-mast.jpg',
    alt: 'Paired white telescopic mast columns standing on a concrete curb.',
    caption: 'Double telescopic mast assembly.',
  },
  {
    filename: 'pnevmomachta-m15-35-projector-tripod.jpg',
    alt: 'Red wheeled lighting mast with four LED floodlights on a snowy outdoor surface.',
    caption: 'Wheeled lighting mast with four LED floodlights.',
  },
]

const upsertMedia = async (
  payload: Awaited<ReturnType<typeof getPayload>>,
  image: ImageSpec,
) => {
  const filePath = path.join(IMAGE_DIR, image.filename)
  const data = readFileSync(filePath)
  const existing = await payload.find({
    collection: 'media',
    where: { filename: { equals: image.filename } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })

  if (existing.docs[0]) {
    const media = await payload.update({
      collection: 'media',
      id: existing.docs[0].id,
      data: {
        alt: image.alt,
        caption: rt(`<p>${image.caption}</p>`),
      },
      overrideAccess: true,
      context: { disableRevalidate: true },
    })
    console.log(`reused media ${media.id} ${image.filename}`)
    return media.id
  }

  const media = await payload.create({
    collection: 'media',
    data: {
      alt: image.alt,
      caption: rt(`<p>${image.caption}</p>`),
    },
    file: {
      name: image.filename,
      data,
      mimetype: 'image/jpeg',
      size: data.byteLength,
    },
    overrideAccess: true,
    context: { disableRevalidate: true },
  })
  console.log(`created media ${media.id} ${image.filename}`)
  return media.id
}

const insertGallery = (
  layout: Array<{ blockType?: string }>,
  block: {
    blockType: 'csGallery'
    case_study_gallery_title: string
    case_study_gallery_images: number[]
  },
) => {
  const without = layout.filter((item) => item.blockType !== 'csGallery')
  const index = without.findIndex((item) => item.blockType && TRAILING.has(item.blockType))
  if (index === -1) return [...without, block]
  return [...without.slice(0, index), block, ...without.slice(index)]
}

const main = async () => {
  const payload = await getPayload({ config })

  const mainId = await upsertMedia(payload, MAIN)
  const productIds: number[] = []
  for (const image of PRODUCTS) {
    productIds.push(await upsertMedia(payload, image))
  }

  const found = await payload.find({
    collection: 'case-studies',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: { slug: { equals: SLUG } },
    select: { id: true, slug: true, layout: true, hero: true },
  })
  const doc = found.docs[0]
  if (!doc) throw new Error(`Missing case study ${SLUG}`)

  const hasPreview = (doc.layout ?? []).some((block) => block.blockType === 'csPreview')
  if (!hasPreview) throw new Error(`No csPreview block on ${SLUG}`)

  let layout = (doc.layout ?? []).map((block) => {
    if (block.blockType !== 'csPreview') return block
    return { ...block, case_study_preview_image: mainId }
  }) as Array<{ blockType?: string }>

  layout = insertGallery(layout, {
    blockType: 'csGallery',
    case_study_gallery_title: 'Products',
    case_study_gallery_images: productIds,
  })

  await payload.update({
    collection: 'case-studies',
    id: doc.id,
    data: {
      layout: layout as never,
    },
    overrideAccess: true,
    context: { disableRevalidate: true },
  })

  console.log(
    JSON.stringify(
      {
        slug: doc.slug,
        id: doc.id,
        previewMedia: mainId,
        galleryMedia: productIds,
      },
      null,
      2,
    ),
  )

  process.exit(0)
}

void main().catch((error) => {
  console.error(error)
  process.exit(1)
})
