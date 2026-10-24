import 'dotenv/config'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'url'

import { generateJSON } from '@tiptap/html'
import config from '@payload-config'
import { getPayload } from 'payload'

import { getTiptapExtensions } from '../utilities/richText/extensions'

const IMAGE_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'assets')
const rt = (html: string) => generateJSON(html, getTiptapExtensions({ headingLevels: [2, 3, 4] }))
const context = { disableRevalidate: true, disableCategorySeo: true }

const logos = [
  {
    slug: 'alumatrix-facade-systems',
    filename: 'alumatrix-logo-en.png',
    mimetype: 'image/png',
    alt: 'AluMatrix logo with the line Aluminum Composite Panels.',
    caption:
      'AluMatrix mark. The AM monogram and ALUMATRIX wordmark are kept. The small line is Aluminum Composite Panels.',
  },
  {
    slug: 'ventfasad-ventilated-facade-installation',
    filename: 'ventfasad-logo-en.png',
    mimetype: 'image/png',
    alt: 'VentFasad logo reading VENT and FACADE.',
    caption:
      'VentFasad banner. VENT and FACADE sit in a light-blue rectangle with an even margin. The gold 20 and the blue, gold, and green colors are kept.',
  },
  {
    slug: 'gptm-group-facade-systems',
    filename: 'gptm-group-logo.jpg',
    mimetype: 'image/jpeg',
    alt: 'GPTM GROUP International logo.',
    caption: 'GPTM GROUP logo, used as supplied.',
  },
  {
    slug: 'promtehmontg-facade-engineering-installation',
    filename: 'promtehmontg-logo-en.png',
    mimetype: 'image/png',
    alt: 'PromTehMontg logo: blue oval, cylinder, and the letters PM.',
    caption:
      'PromTehMontg mark. The blue oval is kept without the ring wording. The Cyrillic Pe is replaced with a Latin P.',
  },
  {
    slug: 'siblux-timber-houses-wooden-windows',
    filename: 'siblux-logo-en.png',
    mimetype: 'image/png',
    alt: 'Siblux logo: brown arch monogram above the name SIBLUX.',
    caption: 'Siblux mark. The original arch is unchanged. The lower name reads SIBLUX.',
  },
]

const run = async () => {
  const payload = await getPayload({ config })
  const only = process.argv[2]

  for (const logo of logos) {
    if (only && logo.filename !== only && logo.slug !== only) continue
    const filePath = path.join(IMAGE_DIR, logo.filename)
    const data = readFileSync(filePath)
    const file = {
      name: logo.filename,
      data,
      mimetype: logo.mimetype,
      size: data.byteLength,
    }
    const fields = {
      alt: logo.alt,
      caption: rt(`<p>${logo.caption}</p>`),
    }
    const existing = await payload.find({
      collection: 'media',
      depth: 0,
      limit: 1,
      overrideAccess: true,
      where: { filename: { equals: logo.filename } },
    })
    const media = existing.docs[0]
      ? await payload.update({
          collection: 'media',
          id: existing.docs[0].id,
          data: fields,
          file,
          overrideAccess: true,
          context,
        })
      : await payload.create({
          collection: 'media',
          data: fields,
          file,
          overrideAccess: true,
          context,
        })

    const found = await payload.find({
      collection: 'case-studies',
      depth: 0,
      draft: false,
      limit: 1,
      overrideAccess: true,
      where: { slug: { equals: logo.slug } },
      select: { id: true, slug: true },
    })
    const doc = found.docs[0]
    if (!doc) throw new Error(`Missing case study ${logo.slug}`)

    await payload.update({
      collection: 'case-studies',
      id: doc.id,
      draft: false,
      data: { company_logo: media.id },
      overrideAccess: true,
      context,
    })
    payload.logger.info(`${logo.slug} logo ${media.id} ${logo.filename}`)
  }

  process.exit(0)
}

void run().catch((error) => {
  console.error(error)
  process.exit(1)
})
