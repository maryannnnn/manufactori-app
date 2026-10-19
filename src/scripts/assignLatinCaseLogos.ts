import 'dotenv/config'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { generateJSON } from '@tiptap/html'
import config from '@payload-config'
import { getPayload } from 'payload'

import { getTiptapExtensions } from '../utilities/richText/extensions'

/**
 * Swaps only the company logo on the Sauna Shop and Siblux case studies.
 * Does not rewrite the rest of either record.
 */
const IMAGE_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'assets')
const rt = (html: string) => generateJSON(html, getTiptapExtensions({ headingLevels: [2, 3, 4] }))

const LOGOS = [
  {
    slug: 'sauna-shop-turnkey-sauna-bath',
    filename: 'sauna-shop-logo-en.png',
    alt: 'Sauna Shop logo: flame-textured lettering reading BATH and SAUNA, with the line EQUIPMENT, MATERIALS.',
    caption:
      'English adaptation of the source mark. The flame-filled letters, black outline, and two-line layout are kept. «Баня и сауна» is rendered as BATH and SAUNA. «Оборудование, материалы» is rendered as EQUIPMENT, MATERIALS.',
  },
  {
    slug: 'siblux-timber-houses-wooden-windows',
    filename: 'siblux-logo-en.png',
    alt: 'Siblux logo: a brown arch monogram above the name SIBLUX.',
    caption:
      'English adaptation of the source mark. The brown arch and the geometric panes are kept. The Cyrillic name СИБЛЮКС was replaced with SIBLUX.',
  },
]

const main = async () => {
  const payload = await getPayload({ config })
  for (const logo of LOGOS) {
    const data = readFileSync(path.join(IMAGE_DIR, logo.filename))
    const existingMedia = await payload.find({
      collection: 'media',
      where: { filename: { equals: logo.filename } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    const fields = {
      alt: logo.alt,
      caption: rt(`<p>${logo.caption.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>`),
    }
    const file = {
      name: logo.filename,
      data,
      mimetype: 'image/png',
      size: data.byteLength,
    }
    const media = existingMedia.docs[0]
      ? await payload.update({
          collection: 'media',
          id: existingMedia.docs[0].id,
          data: fields,
          file,
          overrideAccess: true,
          context: { disableRevalidate: true },
        })
      : await payload.create({
          collection: 'media',
          data: fields,
          file,
          overrideAccess: true,
          context: { disableRevalidate: true },
        })

    const cases = await payload.find({
      collection: 'case-studies',
      where: { slug: { equals: logo.slug } },
      limit: 2,
      depth: 0,
      overrideAccess: true,
    })
    if (cases.docs.length !== 1) {
      throw new Error(`Expected one case for ${logo.slug}, found ${cases.docs.length}`)
    }
    const doc = cases.docs[0]
    await payload.update({
      collection: 'case-studies',
      id: doc.id,
      data: { company_logo: media.id },
      overrideAccess: true,
      context: { disableRevalidate: true },
    })
    payload.logger.info(`logo ${media.id} ${logo.filename} set on case ${doc.id} ${doc.slug}`)
  }
  process.exit(0)
}

void main().catch((error) => {
  console.error(error)
  process.exit(1)
})
