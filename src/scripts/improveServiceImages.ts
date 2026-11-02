import 'dotenv/config'
import { copyFileSync, existsSync } from 'node:fs'
import path from 'node:path'

import { generateJSON } from '@tiptap/html'
import config from '@payload-config'
import { getPayload, type Payload } from 'payload'
import sharp from 'sharp'

import { getTiptapExtensions } from '../utilities/richText/extensions'

const ASSETS =
  process.env.SERVICE_IMAGE_ASSETS ||
  path.resolve('C:/Users/arsen/.cursor/projects/c-Rabota-React-Manufactori/assets')
const PUBLIC_MEDIA = path.join(process.cwd(), 'public', 'media')
const context = { disableRevalidate: true, disableCategorySeo: true }

const rt = (html: string) => generateJSON(html, getTiptapExtensions({ headingLevels: [2, 3, 4] }))
const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

type Assignment = {
  slug: string
  file: string
  alt: string
  caption: string
}

/** Columns 1–4 replacements. Content & Sales columns intentionally omitted (already bright). */
const ASSIGNMENTS: Assignment[] = [
  {
    slug: 'strategy',
    file: 'svc-bright-strategy-overview.jpg',
    alt: 'A bright manufacturing strategy meeting with roadmap papers and metal samples on a white table.',
    caption: 'Strategy and planning for manufacturing marketers, shown in a bright conference setting.',
  },
  {
    slug: 'marketing-strategy-roadmap',
    file: 'svc-bright-marketing-strategy.jpg',
    alt: 'A manufacturing planning table with strategy notes, calipers, and machined metal samples in daylight.',
    caption: 'Marketing strategy and roadmap work for industrial companies, photographed in soft natural light.',
  },
  {
    slug: 'market-competitor-research',
    file: 'svc-bright-market-research.jpg',
    alt: 'Two professionals comparing industrial components and notes on a bright workbench.',
    caption: 'Market and competitor research for manufacturers, shown as a bright product comparison session.',
  },
  {
    slug: 'brand-positioning-messaging',
    file: 'svc-bright-brand-positioning.jpg',
    alt: 'Metal product samples and pale color swatches on a bright industrial brand design table.',
    caption: 'Brand positioning and messaging for manufacturing companies in a clean daylight studio.',
  },
  {
    slug: 'buyer-persona-research',
    file: 'svc-bright-buyer-persona.jpg',
    alt: 'A sales engineer and a plant buyer reviewing a metal valve and a questionnaire in a bright meeting room.',
    caption: 'Buyer persona research for industrial B2B purchases, shown in a bright professional meeting.',
  },
  {
    slug: 'fractional-marketing-advisory',
    file: 'svc-bright-fractional-advisory.jpg',
    alt: 'An advisor and a plant manager reviewing a binder at a bright desk overlooking a sunlit factory floor.',
    caption: 'Fractional marketing advisory for manufacturers, photographed in a bright factory office.',
  },
  {
    slug: 'international-marketing-strategy',
    file: 'svc-bright-international-strategy.jpg',
    alt: 'A manager reviewing export documents beside crates in a bright modern warehouse loading area.',
    caption: 'International marketing strategy for manufacturers, shown in a bright export warehouse.',
  },
  {
    slug: 'website',
    file: 'svc-bright-website-overview.jpg',
    alt: 'A bright industrial office with a blank monitor and a view of a clean sunlit factory floor.',
    caption: 'Websites and digital experience for manufacturers, shown in a bright factory-adjacent office.',
  },
  {
    slug: 'industrial-website-design',
    file: 'svc-bright-website-design.jpg',
    alt: 'Wireframe printouts, a tablet, and a machined metal part on a bright website design desk.',
    caption: 'Industrial website design work with product reference parts in soft daylight.',
  },
  {
    slug: 'website-development',
    file: 'svc-bright-website-development.jpg',
    alt: 'A bright development desk with dual monitors and a small industrial sensor module.',
    caption: 'Website development for manufacturing companies in a clean, well-lit workspace.',
  },
  {
    slug: 'website-redesign-audit',
    file: 'svc-bright-website-redesign.jpg',
    alt: 'Two professionals reviewing website printouts and sticky notes on a bright conference table.',
    caption: 'Website redesign and audit discussion in a bright manufacturing office.',
  },
  {
    slug: 'product-catalogs-ecommerce',
    file: 'svc-bright-product-catalogs.jpg',
    alt: 'Bright warehouse shelving with organized metal fittings and a tablet used for catalog checks.',
    caption: 'Product catalogs and ecommerce for industrial parts, photographed in a bright warehouse aisle.',
  },
  {
    slug: 'ux-ui-for-engineers-b2b-buyers',
    file: 'svc-bright-ux-ui-engineers.jpg',
    alt: 'An engineer and a designer reviewing a tablet product page in a bright industrial office.',
    caption: 'UX and UI work for engineers and B2B buyers, shown in a bright collaboration session.',
  },
  {
    slug: 'rfq-forms-conversion-optimization',
    file: 'svc-bright-rfq-forms.jpg',
    alt: 'A bright sales desk with an RFQ checklist, a metal sample, a caliper, and a laptop form.',
    caption: 'RFQ forms and conversion optimization for manufacturers in a bright enquiry workspace.',
  },
  {
    slug: 'website-maintenance-security',
    file: 'svc-bright-website-maintenance.jpg',
    alt: 'A bright IT workstation with a laptop, checklist, and a softly lit network panel.',
    caption: 'Website maintenance and security for manufacturing sites, shown in a calm daylight office.',
  },
  {
    slug: 'cad-3d-configurator-integration',
    file: 'svc-bright-cad-configurator.jpg',
    alt: 'A bright engineering desk with a 3D CAD model on screen and metal prototypes beside the keyboard.',
    caption: 'CAD and 3D configurator integration for manufacturers in a bright engineering workspace.',
  },
  {
    slug: 'search',
    file: 'svc-bright-search-overview.jpg',
    alt: 'Technical manuals, sticky notes, and a laptop on a bright desk overlooking a clean factory.',
    caption: 'Search and AI visibility work for manufacturers, photographed in soft daylight.',
  },
  {
    slug: 'seo-ai-search-optimization',
    file: 'svc-bright-seo-ai.jpg',
    alt: 'A bright analyst desk with research papers, a tablet, and printed industrial product photos.',
    caption: 'SEO and AI search optimization for manufacturers in a bright research workspace.',
  },
  {
    slug: 'industrial-seo',
    file: 'svc-bright-industrial-seo.jpg',
    alt: 'An engineer with a tablet beside CNC machines on a bright, clean factory aisle.',
    caption: 'Industrial SEO on a modern, well-lit manufacturing floor.',
  },
  {
    slug: 'technical-seo-website-audits',
    file: 'svc-bright-technical-seo.jpg',
    alt: 'A bright technical audit desk with a laptop, checklist, and network cable.',
    caption: 'Technical SEO and website audits for manufacturing sites in a clean daylight office.',
  },
  {
    slug: 'ai-search-optimization-geo',
    file: 'svc-bright-geo.jpg',
    alt: 'A bright knowledge workspace with a whiteboard of entity bubbles and specification sheets.',
    caption: 'AI search optimization (GEO) for manufacturers in a bright content workspace.',
  },
  {
    slug: 'answer-engine-optimization-aeo',
    file: 'svc-bright-aeo.jpg',
    alt: 'Printed Q and A cards, technical drawings, and a laptop on a bright content desk.',
    caption: 'Answer engine optimization for manufacturers, shown in a bright editorial workspace.',
  },
  {
    slug: 'ai-visibility-citation-audits',
    file: 'svc-bright-citation-audits.jpg',
    alt: 'Printed citation lists, highlighters, and a tablet on a bright analyst desk.',
    caption: 'AI visibility and citation audits for manufacturers in soft daylight.',
  },
  {
    slug: 'entity-authority-building',
    file: 'svc-bright-entity-authority.jpg',
    alt: 'A product sample on a pedestal beside a company profile binder in a bright atrium.',
    caption: 'Entity and authority building for manufacturers, photographed in a bright lobby setting.',
  },
  {
    slug: 'international-multilingual-seo',
    file: 'svc-bright-international-seo.jpg',
    alt: 'A bright desk with multilingual product sheets, a soft world map backdrop, and a laptop.',
    caption: 'International and multilingual SEO for manufacturers in a bright global marketing workspace.',
  },
  {
    slug: 'local-multi-location-seo',
    file: 'svc-bright-local-seo.jpg',
    alt: 'The bright exterior entrance of a modern manufacturing facility in daylight.',
    caption: 'Local and multi-location SEO for manufacturing sites, shown as a clean facility exterior.',
  },
  {
    slug: 'paid-media',
    file: 'svc-bright-paid-media-overview.jpg',
    alt: 'A bright marketing desk with campaign sticky notes, a laptop, and an industrial product sample.',
    caption: 'Paid media and demand generation planning for manufacturers in soft daylight.',
  },
  {
    slug: 'search-engine-marketing-sem',
    file: 'svc-bright-sem.jpg',
    alt: 'A bright SEM workspace with a monitor of abstract search results and a metal component.',
    caption: 'Search engine marketing for manufacturers in a clean, well-lit office.',
  },
  {
    slug: 'google-ads-manufacturers',
    file: 'svc-bright-google-ads.jpg',
    alt: 'A bright advertising desk with a laptop, campaign notes, and a machined aluminum part.',
    caption: 'Google Ads for manufacturers, photographed in a bright digital advertising workspace.',
  },
  {
    slug: 'microsoft-ads',
    file: 'svc-bright-microsoft-ads.jpg',
    alt: 'A bright B2B advertising desk with dual monitors showing abstract charts and catalog pages.',
    caption: 'Microsoft Ads for industrial companies in a bright campaign operations office.',
  },
  {
    slug: 'linkedin-ads-b2b-campaigns',
    file: 'svc-bright-linkedin-ads.jpg',
    alt: 'Two professionals discussing a capability one-pager and a metal sample in a sunlit office.',
    caption: 'LinkedIn ads and B2B campaigns for manufacturers in a bright meeting setting.',
  },
  {
    slug: 'facebook-instagram-ads',
    file: 'svc-bright-meta-ads.jpg',
    alt: 'A bright creative desk with a smartphone on a stand and blank social ad mockups of metal parts.',
    caption: 'Facebook and Instagram ads for manufacturers in a bright content studio.',
  },
  {
    slug: 'remarketing-retargeting',
    file: 'svc-bright-remarketing.jpg',
    alt: 'A bright desk with a monitor showing blank industrial product cards and a funnel notebook.',
    caption: 'Remarketing and retargeting for manufacturers in a clean daylight office.',
  },
  {
    slug: 'paid-social-advertising',
    file: 'svc-bright-paid-social.jpg',
    alt: 'A bright studio desk with a camera, soft ring light, and industrial product samples on a white sweep.',
    caption: 'Paid social advertising for manufacturers, shown as bright product photography prep.',
  },
  {
    slug: 'email-marketing-lead-nurturing',
    file: 'svc-bright-email-nurturing.jpg',
    alt: 'Printed newsletter layouts, a tablet, and a metal component on a bright email marketing desk.',
    caption: 'Email marketing and lead nurturing for manufacturers in soft window light.',
  },
]

/** Kept services that already meet brightness/uniqueness — ensure caption metadata exists. */
const KEEP_CAPTIONS: { slug: string; caption: string }[] = [
  {
    slug: 'ai-search-optimization-content-engineering',
    caption: 'AI search optimization and content engineering for manufacturers in a bright assembly-adjacent workspace.',
  },
  {
    slug: 'account-based-marketing-abm',
    caption: 'Account-based marketing for manufacturers, using a bright planning table with drawings and samples.',
  },
  {
    slug: 'outbound-lead-generation',
    caption: 'Outbound lead generation for manufacturers, shown with enquiry documents in a bright industrial office.',
  },
]

const prepareJpeg = async (sourcePath: string, destName: string) => {
  const destPath = path.join(PUBLIC_MEDIA, destName)
  const buffer = await sharp(sourcePath)
    .rotate()
    .resize({ width: 1800, withoutEnlargement: true })
    .jpeg({ quality: 84 })
    .toBuffer()
  await sharp(buffer).toFile(destPath)
  return { destPath, buffer, size: buffer.byteLength }
}

const upsertMedia = async (payload: Payload, fileName: string, alt: string, caption: string) => {
  const source = path.join(ASSETS, fileName)
  if (!existsSync(source)) throw new Error(`Missing asset ${source}`)
  const { buffer, size } = await prepareJpeg(source, fileName)
  const existing = await payload.find({
    collection: 'media',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: { filename: { equals: fileName } },
  })
  const file = { name: fileName, data: buffer, mimetype: 'image/jpeg' as const, size }
  const data = { alt, caption: rt(`<p>${escapeHtml(caption)}</p>`) }
  if (existing.docs[0]) {
    const updated = await payload.update({
      collection: 'media',
      id: existing.docs[0].id,
      data,
      file,
      overrideAccess: true,
      context,
    })
    return updated
  }
  return payload.create({
    collection: 'media',
    data,
    file,
    overrideAccess: true,
    context,
  })
}

const idOf = (value: unknown): number | null => {
  if (typeof value === 'number') return value
  if (value && typeof value === 'object' && 'id' in value) {
    const id = (value as { id?: unknown }).id
    return typeof id === 'number' ? id : null
  }
  return null
}

const main = async () => {
  if (!existsSync(ASSETS)) throw new Error(`Assets folder missing: ${ASSETS}`)
  const payload = await getPayload({ config })
  const summary: Record<string, { mediaId: number; file: string; action: string }> = {}

  for (const item of ASSIGNMENTS) {
    const media = await upsertMedia(payload, item.file, item.alt, item.caption)
    const found = await payload.find({
      collection: 'services',
      depth: 0,
      limit: 1,
      overrideAccess: true,
      pagination: false,
      where: { slug: { equals: item.slug } },
    })
    const doc = found.docs[0]
    if (!doc) throw new Error(`Service missing: ${item.slug}`)

    const meta =
      typeof doc.meta === 'object' && doc.meta
        ? { ...doc.meta, image: media.id }
        : { image: media.id }

    await payload.update({
      collection: 'services',
      id: doc.id,
      context,
      draft: false,
      overrideAccess: true,
      data: {
        service_preview_image: media.id,
        service_card_image: media.id,
        meta,
      },
    })
    summary[item.slug] = { mediaId: Number(media.id), file: item.file, action: 'replaced' }
    payload.logger.info(`Replaced image for ${item.slug} -> ${item.file} (#${media.id})`)
  }

  for (const item of KEEP_CAPTIONS) {
    const found = await payload.find({
      collection: 'services',
      depth: 1,
      limit: 1,
      overrideAccess: true,
      where: { slug: { equals: item.slug } },
    })
    const doc = found.docs[0]
    if (!doc) continue
    const mediaId = idOf(doc.service_preview_image) || idOf(doc.meta?.image) || idOf(doc.service_card_image)
    if (!mediaId) continue
    await payload.update({
      collection: 'media',
      id: mediaId,
      context,
      overrideAccess: true,
      data: { caption: rt(`<p>${escapeHtml(item.caption)}</p>`) },
    })
    summary[item.slug] = {
      mediaId,
      file: typeof doc.service_preview_image === 'object' ? String((doc.service_preview_image as { filename?: string }).filename) : 'kept',
      action: 'caption-updated',
    }
  }

  // Also ensure Content & Sales media captions exist where missing (no image replace).
  const later = await payload.find({
    collection: 'services',
    depth: 1,
    draft: false,
    limit: 200,
    overrideAccess: true,
    pagination: false,
    where: {
      and: [
        { _status: { equals: 'published' } },
        {
          slug: {
            in: [
              'content',
              'technical-content-strategy',
              'engineering-articles-guides',
              'product-capability-pages',
              'technical-white-papers',
              'manufacturing-case-studies',
              'thought-leadership',
              'industrial-video-photography',
              'brand-identity-visual-communication',
              'sales-collateral-presentations',
              'sales',
              'sales-enablement',
              'crm-implementation-integration',
              'marketing-automation',
              'lead-management-nurturing',
              'analytics-conversion-tracking',
              'rfq-funnel-optimization',
              'distributor-channel-enablement',
              'trade-show-event-marketing',
            ],
          },
        },
      ],
    },
  })

  for (const doc of later.docs) {
    const media =
      (typeof doc.service_preview_image === 'object' && doc.service_preview_image) ||
      (typeof doc.meta?.image === 'object' && doc.meta.image) ||
      (typeof doc.service_card_image === 'object' && doc.service_card_image) ||
      null
    if (!media || typeof media !== 'object' || !('id' in media)) continue
    if (media.caption) {
      summary[doc.slug || String(doc.id)] = {
        mediaId: Number(media.id),
        file: String(media.filename || ''),
        action: 'retained',
      }
      continue
    }
    const alt = media.alt || doc.title || 'Manufacturing service photography'
    await payload.update({
      collection: 'media',
      id: media.id,
      context,
      overrideAccess: true,
      data: {
        caption: rt(`<p>${escapeHtml(String(alt))}</p>`),
      },
    })
    summary[doc.slug || String(doc.id)] = {
      mediaId: Number(media.id),
      file: String(media.filename || ''),
      action: 'retained-caption-added',
    }
  }

  console.log(JSON.stringify({ replaced: ASSIGNMENTS.length, summary }, null, 2))
}

void main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
