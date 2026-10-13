import 'dotenv/config'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { generateJSON } from '@tiptap/html'
import config from '@payload-config'
import { getPayload } from 'payload'
import sharp from 'sharp'

import { getTiptapExtensions } from '../utilities/richText/extensions'

const SLUG = 'pnevmomachta-long-term-digital-presence'
const IMAGE_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'assets')
const TRAILING = new Set(['csFAQ', 'csComments', 'cta'])
const MANAGED_BLOCK_NAMES = new Set([
  'pnevmomachta-website-title',
  'pnevmomachta-website-description',
  'pnevmomachta-website-gallery',
  'pnevmomachta-trust-title',
  'pnevmomachta-trust-description',
  'pnevmomachta-trust-media',
  'pnevmomachta-speed-title',
  'pnevmomachta-speed-description',
  'pnevmomachta-speed-media',
])

const rt = (html: string) => generateJSON(html, getTiptapExtensions({ headingLevels: [2, 3, 4] }))

type MediaSpec = {
  alt: string
  caption: string
  filename: string
  mimetype: 'image/jpeg' | 'image/png'
  source?: string
}

const WEBSITE: MediaSpec[] = [
  {
    filename: 'pnevmomachta-website-home.jpg',
    mimetype: 'image/jpeg',
    alt: 'Screenshot of the Pnevmomachta website homepage, with a product slider, company introduction, and application photographs.',
    caption:
      'Original Pnevmomachta website homepage screenshot, showing how pneumatic mast products and company information were presented.',
  },
  {
    filename: 'pnevmomachta-website-catalog.jpg',
    mimetype: 'image/jpeg',
    alt: 'Screenshot of a Pnevmomachta catalog page for telescopic masts, including product photographs, specifications, and a comparison table.',
    caption:
      'Original Pnevmomachta website catalog screenshot for telescopic mast version A, including specifications and a product table.',
  },
  {
    filename: 'pnevmomachta-website-product.jpg',
    mimetype: 'image/jpeg',
    alt: 'Screenshot of the Pnevmomachta website portfolio and news layout, with a photo grid of mast installations and company updates.',
    caption:
      'Original Pnevmomachta website screenshot of the portfolio and news structure.',
  },
]

const TRUST: MediaSpec = {
  filename: 'pnevmomachta-trust-reputation.jpg',
  source: 'pnevmomachta-trust-reputation-original.jpg',
  mimetype: 'image/jpeg',
  alt: 'ScamAdviser snapshot of the Pnevmomachta website showing a trust score of 96 out of 100, a high trust-rating banner, and zero user reviews.',
  caption:
    'Historical ScamAdviser snapshot of the Pnevmomachta website. The displayed trust score is 96/100. No user reviews are shown. This is a third-party screenshot, not a verified current rating or a business outcome.',
}

const SPEED: MediaSpec = {
  filename: 'pnevmomachta-loading-speed.jpg',
  source: 'pnevmomachta-loading-speed-original.jpg',
  mimetype: 'image/jpeg',
  alt: 'Historical PageSpeed Insights report for the Pnevmomachta website, showing Performance 97, Accessibility 91, Best Practices 100, SEO 100, and Core Web Vitals from that test.',
  caption:
    'Historical website performance report from the Pnevmomachta project. Russian labels on the original report correspond to Performance, Accessibility, Best Practices, and SEO. Interpret the measurements in the context of the original test.',
}

const LOGO_ORIGINAL: MediaSpec = {
  filename: 'pnevmomachta-logo-original.png',
  source: 'pnevmomachta-logo-original.jpg',
  mimetype: 'image/png',
  alt: 'Original Pnevmomachta logo with the orange ПМ monogram and Russian lettering for pneumatic telescopic masts.',
  caption: 'Original Pnevmomachta logo artwork, preserved separately from the English-language display version.',
}

const LOGO_EN: MediaSpec = {
  filename: 'pnevmomachta-logo-en.png',
  mimetype: 'image/png',
  alt: 'Pnevmomachta logo with the orange PM monogram and English lettering: Pnevmomachta, pneumatic telescopic masts.',
  caption: 'English-language Pnevmomachta logo based on the original orange mark, with Latin P and M and a two-line wordmark.',
}

const prepareJpegFromSource = async (spec: MediaSpec) => {
  if (!spec.source) return
  const sourcePath = path.join(IMAGE_DIR, spec.source)
  const destPath = path.join(IMAGE_DIR, spec.filename)
  if (spec.mimetype === 'image/png') {
    await sharp(sourcePath).png().toFile(destPath)
    return
  }
  await sharp(sourcePath).jpeg({ quality: 92, mozjpeg: true }).toFile(destPath)
}

const upsertMedia = async (
  payload: Awaited<ReturnType<typeof getPayload>>,
  spec: MediaSpec,
) => {
  const filePath = path.join(IMAGE_DIR, spec.filename)
  const data = readFileSync(filePath)
  const existing = await payload.find({
    collection: 'media',
    where: {
      or: [{ filename: { equals: spec.filename } }, { filename: { like: spec.filename.replace(/\.[^.]+$/, '') } }],
    },
    limit: 1,
    depth: 0,
    overrideAccess: true,
    sort: '-updatedAt',
  })

  const fields = {
    alt: spec.alt,
    caption: rt(`<p>${spec.caption}</p>`),
  }
  const file = {
    name: spec.filename,
    data,
    mimetype: spec.mimetype,
    size: data.byteLength,
  }

  if (existing.docs[0]) {
    const media = await payload.update({
      collection: 'media',
      id: existing.docs[0].id,
      data: fields,
      file,
      overrideAccess: true,
      context: { disableRevalidate: true },
    })
    console.log(`reused media ${media.id} ${spec.filename}`)
    return media.id
  }

  const media = await payload.create({
    collection: 'media',
    data: fields,
    file,
    overrideAccess: true,
    context: { disableRevalidate: true },
  })
  console.log(`created media ${media.id} ${spec.filename}`)
  return media.id
}

const contentBlock = (blockName: string, html: string) => ({
  blockType: 'csContent' as const,
  blockName,
  columns: [{ size: 'full' as const, richText: rt(html), enableLink: false }],
})

const titleBlock = (blockName: string, title: string) => ({
  blockType: 'csContentTitle' as const,
  blockName,
  case_study_content_title: title,
})

const removeManaged = (layout: Array<{ blockName?: string | null; blockType?: string }>) =>
  layout.filter((block) => !block.blockName || !MANAGED_BLOCK_NAMES.has(block.blockName))

const insertBeforeTrailing = (
  layout: Array<{ blockType?: string }>,
  blocks: Array<{ blockType?: string }>,
) => {
  const index = layout.findIndex((item) => item.blockType && TRAILING.has(item.blockType))
  if (index === -1) return [...layout, ...blocks]
  return [...layout.slice(0, index), ...blocks, ...layout.slice(index)]
}

const main = async () => {
  await prepareJpegFromSource(TRUST)
  await prepareJpegFromSource(SPEED)
  await prepareJpegFromSource(LOGO_ORIGINAL)

  const payload = await getPayload({ config })

  const websiteIds: number[] = []
  for (const image of WEBSITE) {
    websiteIds.push(await upsertMedia(payload, image))
  }
  const trustId = await upsertMedia(payload, TRUST)
  const speedId = await upsertMedia(payload, SPEED)
  const logoOriginalId = await upsertMedia(payload, LOGO_ORIGINAL)
  const logoEnId = await upsertMedia(payload, LOGO_EN)

  const found = await payload.find({
    collection: 'case-studies',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: { slug: { equals: SLUG } },
    select: { id: true, slug: true, layout: true, company_logo: true },
  })
  const doc = found.docs[0]
  if (!doc) throw new Error(`Missing case study ${SLUG}`)

  const managed = [
    titleBlock('pnevmomachta-website-title', 'Website Design and Structure'),
    contentBlock(
      'pnevmomachta-website-description',
      '<p>Screenshots of the Pnevmomachta website, illustrating the presentation of pneumatic mast products, product information, and website structure.</p>',
    ),
    {
      blockType: 'csGallery' as const,
      blockName: 'pnevmomachta-website-gallery',
      case_study_gallery_title: '',
      case_study_gallery_images: websiteIds,
    },
    titleBlock('pnevmomachta-trust-title', 'Trust and Reputation'),
    contentBlock(
      'pnevmomachta-trust-description',
      [
        '<p>A historical ScamAdviser screenshot of the Pnevmomachta website, kept separate from the website screenshots and from the loading-speed report.</p>',
        '<p>The snapshot shows a trust score of 96/100 and a banner stating that the trust rating is high. The review scale shows zero reviews. This is a third-party website-reputation screenshot from the source material, not a verified current rating and not a measured business outcome.</p>',
      ].join(''),
    ),
    {
      blockType: 'mediaBlock' as const,
      blockName: 'pnevmomachta-trust-media',
      media: trustId,
    },
    titleBlock('pnevmomachta-speed-title', 'Website Loading Speed Analysis'),
    contentBlock(
      'pnevmomachta-speed-description',
      [
        '<p>A historical website performance report from the Pnevmomachta project. Interpret the displayed measurements in the context of the original test. These figures are not presented as current performance.</p>',
        '<p>The original report labels are in Russian. Their meaning on this PageSpeed Insights screenshot is: Performance 97, Accessibility 91, Best Practices 100, and SEO 100. The same report shows First Contentful Paint 0.6 s, Total Blocking Time 20 ms, Speed Index 1.3 s, Largest Contentful Paint 1.1 s, and Cumulative Layout Shift 0.</p>',
      ].join(''),
    ),
    {
      blockType: 'mediaBlock' as const,
      blockName: 'pnevmomachta-speed-media',
      media: speedId,
    },
  ]

  const layout = insertBeforeTrailing(removeManaged((doc.layout ?? []) as Array<{ blockName?: string | null; blockType?: string }>), managed)

  await payload.update({
    collection: 'case-studies',
    id: doc.id,
    data: {
      company_logo: logoEnId,
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
        companyLogo: logoEnId,
        logoOriginal: logoOriginalId,
        websiteGallery: websiteIds,
        trustMedia: trustId,
        speedMedia: speedId,
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
