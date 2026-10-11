import 'dotenv/config'
import { copyFileSync, mkdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import sharp from 'sharp'
import { generateJSON } from '@tiptap/html'
import config from '@payload-config'
import { getPayload } from 'payload'

import { getTiptapExtensions } from '../utilities/richText/extensions'

const SLUG = 'laser-made-two-manufacturing-websites'
const FILENAME = 'laser-made-logo-en.png'
const ALT = 'Laser Made company logo'
const SOURCE =
  'C:/Users/arsen/.cursor/projects/c-Rabota-React-Manufactori/assets/laser-made-logo-en.jpg'

const IMAGE_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'assets')
const PUBLIC_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../public/media')

const rt = (html: string) => generateJSON(html, getTiptapExtensions({ headingLevels: [2, 3, 4] }))

const run = async () => {
  mkdirSync(IMAGE_DIR, { recursive: true })
  mkdirSync(PUBLIC_DIR, { recursive: true })

  const dest = path.join(IMAGE_DIR, FILENAME)
  const trimmed = await sharp(SOURCE).trim({ threshold: 18 }).png().toBuffer()
  const meta = await sharp(trimmed).metadata()
  await sharp(trimmed).toFile(dest)
  copyFileSync(dest, path.join(PUBLIC_DIR, FILENAME))
  console.log(`Wrote ${FILENAME} ${meta.width}x${meta.height}`)

  const payload = await getPayload({ config })

  const existingMedia = await payload.find({
    collection: 'media',
    where: {
      or: [{ filename: { equals: FILENAME } }, { filename: { like: 'laser-made-logo-en' } }],
    },
    limit: 1,
    depth: 0,
    overrideAccess: true,
    sort: '-updatedAt',
  })

  let media = existingMedia.docs[0]
  if (media) {
    media = await payload.update({
      collection: 'media',
      id: media.id,
      data: {
        alt: ALT,
        caption: rt(`<p>${ALT}</p>`),
      },
      file: {
        name: FILENAME,
        data: readFileSync(dest),
        mimetype: 'image/png',
        size: readFileSync(dest).byteLength,
      },
      overrideAccess: true,
      context: { disableRevalidate: true },
    })
    console.log(`Updated media ${media.id} ${media.filename}`)
  } else {
    media = await payload.create({
      collection: 'media',
      data: {
        alt: ALT,
        caption: rt(`<p>${ALT}</p>`),
      },
      file: {
        name: FILENAME,
        data: readFileSync(dest),
        mimetype: 'image/png',
        size: readFileSync(dest).byteLength,
      },
      overrideAccess: true,
      context: { disableRevalidate: true },
    })
    console.log(`Created media ${media.id} ${media.filename}`)
  }

  const found = await payload.find({
    collection: 'case-studies',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: { slug: { equals: SLUG } },
    select: { id: true, slug: true, company_logo: true },
  })
  const doc = found.docs[0]
  if (!doc) {
    throw new Error(`Missing case study ${SLUG}`)
  }

  await payload.update({
    collection: 'case-studies',
    id: doc.id,
    data: { company_logo: media.id },
    overrideAccess: true,
    context: { disableRevalidate: true },
  })
  console.log(`Assigned logo ${media.id} to ${SLUG}`)
  process.exit(0)
}

void run().catch((error) => {
  console.error(error)
  process.exit(1)
})
