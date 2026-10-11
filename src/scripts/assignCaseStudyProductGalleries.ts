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

const rt = (html: string) => generateJSON(html, getTiptapExtensions({ headingLevels: [2, 3, 4] }))

type ImageSpec = {
  filename: string
  alt: string
  caption: string
}

const CASES: Array<{
  slug: string
  title: string
  images: ImageSpec[]
}> = [
  {
    slug: 'vimpel-engineering-anechoic-chambers',
    title: 'Anechoic chamber types',
    images: [
      {
        filename: 'vimpel-anechoic-chamber-full.jpg',
        alt: 'Interior of a full electromagnetic anechoic chamber lined with pyramidal RF absorbers.',
        caption: 'Full anechoic chamber with RF absorber lining. Illustrative equipment type, not a documented project photograph.',
      },
      {
        filename: 'vimpel-compact-rf-chamber.jpg',
        alt: 'Compact enclosed RF measurement chamber with absorber lining and a small test fixture.',
        caption: 'Compact RF measurement chamber for electronic devices and antennas. Illustrative equipment type.',
      },
      {
        filename: 'vimpel-antenna-measurement-system.jpg',
        alt: 'Antenna measurement installation with a positioning turntable inside an absorber-lined hall.',
        caption: 'Antenna measurement arrangement in an absorber-lined hall. Illustrative equipment type.',
      },
    ],
  },
  {
    slug: 'paktrademash-packaging-equipment',
    title: 'Packaging equipment types',
    images: [
      {
        filename: 'paktrademash-meat-packaging-line.jpg',
        alt: 'Stainless-steel industrial meat packaging line with vacuum-packed portions on a conveyor.',
        caption: 'Meat packaging line with vacuum packing equipment. Illustrative equipment type, not a documented project photograph.',
      },
      {
        filename: 'paktrademash-dairy-packaging-line.jpg',
        alt: 'Hygienic dairy line slicing and packing cheese on stainless-steel equipment.',
        caption: 'Dairy packaging line for sliced cheese. Illustrative equipment type.',
      },
      {
        filename: 'paktrademash-automated-food-packaging.jpg',
        alt: 'Automated tray-sealing line for prepared meals with infeed and outfeed conveyors.',
        caption: 'Automated tray-sealing system for prepared foods. Illustrative equipment type.',
      },
    ],
  },
  {
    slug: 'nesko-energy-efficiency',
    title: 'Electrical engineering systems',
    images: [
      {
        filename: 'nesko-industrial-electrical-distribution.jpg',
        alt: 'Industrial electrical distribution room with closed switchgear cabinets and overhead cable trays.',
        caption: 'Industrial electrical distribution and switchgear. Illustrative installation type, not a documented project photograph.',
      },
      {
        filename: 'nesko-industrial-electrical-installation.jpg',
        alt: 'Factory electrical installation with cable trays, cabinets, and equipment connections.',
        caption: 'Electrical installation and integration in a manufacturing facility. Illustrative installation type.',
      },
      {
        filename: 'nesko-engineering-energy-efficiency.jpg',
        alt: 'Engineering workstation beside industrial electrical cabinets, with drawings and a clamp meter.',
        caption: 'Engineering review of electrical infrastructure. Illustrative setting, no measured results shown.',
      },
    ],
  },
]

const TRAILING = new Set(['csFAQ', 'csComments', 'cta'])

const insertGallery = (
  layout: Array<{ blockType?: string }>,
  block: { blockType: 'csGallery'; case_study_gallery_title: string; case_study_gallery_images: number[] },
) => {
  const without = layout.filter((item) => item.blockType !== 'csGallery')
  const index = without.findIndex((item) => item.blockType && TRAILING.has(item.blockType))
  if (index === -1) return [...without, block]
  return [...without.slice(0, index), block, ...without.slice(index)]
}

const main = async () => {
  mkdirSync(IMAGE_DIR, { recursive: true })
  const payload = await getPayload({ config })

  for (const item of CASES) {
    const mediaIds: number[] = []

    for (const image of item.images) {
      const dest = path.join(IMAGE_DIR, image.filename)
      copyFileSync(path.join(SOURCE_DIR, image.filename), dest)

      const existing = await payload.find({
        collection: 'media',
        where: { filename: { equals: image.filename } },
        limit: 1,
        depth: 0,
        overrideAccess: true,
      })

      let media = existing.docs[0]
      if (!media) {
        media = await payload.create({
          collection: 'media',
          data: {
            alt: image.alt,
            caption: rt(`<p>${image.caption}</p>`),
          },
          file: {
            name: image.filename,
            data: readFileSync(dest),
            mimetype: 'image/jpeg',
            size: readFileSync(dest).byteLength,
          },
          overrideAccess: true,
          context: { disableRevalidate: true },
        })
        console.log(`created media ${media.id} ${image.filename}`)
      } else {
        await payload.update({
          collection: 'media',
          id: media.id,
          data: {
            alt: image.alt,
            caption: rt(`<p>${image.caption}</p>`),
          },
          overrideAccess: true,
          context: { disableRevalidate: true },
        })
        console.log(`reused media ${media.id} ${image.filename}`)
      }

      mediaIds.push(media.id)
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
      console.error(`missing case study ${item.slug}`)
      continue
    }

    const layout = insertGallery([...(doc.layout ?? [])] as Array<{ blockType?: string }>, {
      blockType: 'csGallery',
      case_study_gallery_title: item.title,
      case_study_gallery_images: mediaIds,
    })

    await payload.update({
      collection: 'case-studies',
      id: doc.id,
      data: { layout: layout as never },
      overrideAccess: true,
      context: { disableRevalidate: true },
    })

    console.log(
      JSON.stringify(
        { slug: item.slug, id: doc.id, galleryTitle: item.title, mediaIds },
        null,
        2,
      ),
    )
  }

  process.exit(0)
}

void main().catch((error) => {
  console.error(error)
  process.exit(1)
})
