import 'dotenv/config'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { generateJSON } from '@tiptap/html'
import config from '@payload-config'
import { getPayload } from 'payload'

import { getTiptapExtensions } from '../utilities/richText/extensions'

const IMAGE_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'assets')

const rt = (html: string) => generateJSON(html, getTiptapExtensions({ headingLevels: [2, 3, 4] }))

const logos = [
  {
    slug: 'paktrademash-packaging-equipment',
    filename: 'paktrademash-logo-en.png',
    alt: 'PakTradeMash logo',
    caption:
      'English PakTradeMash wordmark. The blue and gold C follows the original mark. Tagline: packaging technology; systems, equipment, materials.',
  },
  {
    slug: 'nesko-energy-efficiency',
    filename: 'nesko-logo-en.png',
    alt: 'Nesko logo',
    caption:
      'English Nesko wordmark. NESKO with the original line, National Energy Service Company.',
  },
  {
    slug: 'vimpel-engineering-anechoic-chambers',
    filename: 'vimpel-logo-en.png',
    alt: 'Vimpel Engineering logo',
    caption:
      'English Vimpel Engineering lockup in the red and gold of the source header. Innovation Center is the English line from that header.',
  },
  {
    slug: 'merkan-invest-stroy-ventilation-systems',
    filename: 'merkan-logo-en.png',
    alt: 'Merkan Invest Stroy logo',
    caption:
      'English Merkan Invest Stroy wordmark in the blue-green palette of the original MERKAN mark.',
  },
  {
    slug: 'security-systems-anhor',
    filename: 'anhor-logo-en.png',
    alt: 'Security Systems Anhor logo',
    caption:
      'English Anhor wordmark in the original navy, with the quotation mark kept from the source mark.',
  },
  {
    slug: 'ovik-montag-hvac-engineering-seo',
    filename: 'ovik-logo-en.png',
    alt: 'Ovik Montag logo',
    caption:
      'English Ovik Montag wordmark. The petal mark uses the original cyan and orange. The lines are heating, ventilation, air conditioning, design and installation.',
  },
  {
    slug: 'npk-binar-roofing-systems',
    filename: 'npk-binar-logo-en.png',
    alt: 'NPK BINAR logo',
    caption:
      'English NPK BINAR wordmark in charcoal and copper for the roofing case study. No original client logo file was on the source page.',
  },
  {
    slug: 'aleks-sf-jewelry-retail-equipment',
    filename: 'aleks-sf-logo-en.png',
    alt: 'Aleks SF logo',
    caption:
      'English Aleks SF wordmark. ALEKS and Retail Equipment replace the Cyrillic lines. The red lobster is the original mark.',
  },
]

const run = async () => {
  const payload = await getPayload({ config })

  for (const logo of logos) {
    const filePath = path.join(IMAGE_DIR, logo.filename)
    const data = readFileSync(filePath)
    const existingMedia = await payload.find({
      collection: 'media',
      where: { filename: { equals: logo.filename } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })

    const file = {
      name: logo.filename,
      data,
      mimetype: 'image/png',
      size: data.byteLength,
    }

    let media = existingMedia.docs[0]
    if (media) {
      media = await payload.update({
        collection: 'media',
        id: media.id,
        data: { alt: logo.alt, caption: rt(`<p>${logo.caption}</p>`) },
        file,
        overrideAccess: true,
        context: { disableRevalidate: true },
      })
    } else {
      media = await payload.create({
        collection: 'media',
        data: { alt: logo.alt, caption: rt(`<p>${logo.caption}</p>`) },
        file,
        overrideAccess: true,
        context: { disableRevalidate: true },
      })
    }

    const found = await payload.find({
      collection: 'case-studies',
      depth: 0,
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
      data: { company_logo: media.id },
      overrideAccess: true,
      context: { disableRevalidate: true },
    })
    payload.logger.info(`${logo.slug} logo ${media.id} ${logo.filename}`)
  }

  process.exit(0)
}

void run().catch((error) => {
  console.error(error)
  process.exit(1)
})
