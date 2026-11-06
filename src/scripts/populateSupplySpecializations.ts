import 'dotenv/config'
import { existsSync } from 'node:fs'
import path from 'node:path'

import { generateJSON } from '@tiptap/html'
import config from '@payload-config'
import { getPayload, type Payload } from 'payload'
import sharp from 'sharp'

import {
  SUPPLY_SPECIALIZATIONS,
  PARENT_FIELD_UPDATES,
  type SupplySpecializationCopy,
} from './content/supplySpecializations'
import { SUPPLY_FIELD_KEYS } from './content/supplySpecializations'
import { getTiptapExtensions } from '../utilities/richText/extensions'

const PARENT_SLUG = 'agriculture-mining-industrial-supply'

/**
 * Shared Site Categories are a marketing and technology taxonomy, not industry
 * verticals. Distributor-growth nodes describe a marketing goal, not this
 * industry page, so they are not assigned.
 */
const SITE_CATEGORY_SLUGS: Record<string, string[]> = {}

const rt = (html: string) => generateJSON(html, getTiptapExtensions({ headingLevels: [2, 3, 4] }))
const context = { disableRevalidate: true, disableCategorySeo: true }

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const LINK = /<a href="(\/industrial\/[a-z0-9-]+)">([^<]+)<\/a>/g

const paragraphs = (...parts: string[]) =>
  parts
    .flatMap((part) => part.split(/\n\n+/).map((p) => p.trim()).filter(Boolean))
    .map((part) => {
      const tokens: string[] = []
      const masked = part.replace(LINK, (_match, href: string, text: string) => {
        tokens.push(`<a href="${href}">${escapeHtml(text)}</a>`)
        return `@@LINK${tokens.length - 1}@@`
      })
      const html = escapeHtml(masked).replace(/@@LINK(\d+)@@/g, (_m, index: string) => tokens[Number(index)] ?? '')
      return `<p>${html}</p>`
    })
    .join('')

const assertCopy = () => {
  if (SUPPLY_SPECIALIZATIONS.length !== 3) {
    throw new Error(`Expected 3 specializations, got ${SUPPLY_SPECIALIZATIONS.length}`)
  }
  const slugs = new Set<string>()
  for (const page of SUPPLY_SPECIALIZATIONS) {
    if (slugs.has(page.slug)) throw new Error(`Duplicate ${page.slug}`)
    slugs.add(page.slug)
    if (page.h1.trim().toLowerCase() === page.title.trim().toLowerCase()) {
      throw new Error(`${page.slug} H1 repeats title`)
    }
    if (page.metaTitle.length < 50 || page.metaTitle.length > 60) {
      throw new Error(`${page.slug} title ${page.metaTitle.length}`)
    }
    if (page.metaDescription.length < 140 || page.metaDescription.length > 160) {
      throw new Error(`${page.slug} description ${page.metaDescription.length}`)
    }
    if (/[\u2013\u2014]/.test(JSON.stringify(page))) throw new Error(`${page.slug} has a dash`)
    if (page.services.length !== 3) throw new Error(`${page.slug} needs exactly 3 services`)
    if (page.faq.length < 8 || page.faq.length > 12) {
      throw new Error(`${page.slug} FAQ count ${page.faq.length}`)
    }
    for (const key of SUPPLY_FIELD_KEYS) {
      if (!page.fields[key]?.trim()) throw new Error(`${page.slug} missing field ${key}`)
    }
    if (!existsSync(path.join(process.cwd(), 'public', 'media', page.image))) {
      throw new Error(`Missing image ${page.image}`)
    }
  }
}

const idsFor = async (
  payload: Payload,
  collection: 'services' | 'posts' | 'case-studies' | 'site-categories',
  slugs: string[],
) => {
  const unique = [...new Set(slugs)]
  if (unique.length === 0) return new Map<string, number>()
  const found = await payload.find({
    collection,
    depth: 0,
    limit: unique.length,
    overrideAccess: true,
    pagination: false,
    where: { slug: { in: unique } },
  })
  const map = new Map<string, number>()
  for (const doc of found.docs) {
    if (doc.slug) map.set(doc.slug, Number(doc.id))
  }
  const missing = unique.filter((slug) => !map.has(slug))
  if (missing.length > 0) throw new Error(`${collection} missing: ${missing.join(', ')}`)
  return map
}

const uploadFile = async (payload: Payload, sourceName: string, fileName: string, alt: string) => {
  const source = path.join(process.cwd(), 'public', 'media', sourceName)
  const buffer = await sharp(source)
    .rotate()
    .resize({ width: 1800, withoutEnlargement: true })
    .jpeg({ quality: 82 })
    .toBuffer()
  const file = { name: fileName, data: buffer, mimetype: 'image/jpeg' as const, size: buffer.byteLength }
  const existing = await payload.find({
    collection: 'media',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: { filename: { equals: fileName } },
  })
  if (existing.docs[0]) {
    await payload.update({
      collection: 'media',
      id: existing.docs[0].id,
      context,
      data: { alt },
      overrideAccess: true,
    })
    return Number(existing.docs[0].id)
  }
  const created = await payload.create({
    collection: 'media',
    context,
    data: { alt },
    file,
    overrideAccess: true,
  })
  return Number(created.id)
}

const industryData = (
  page: SupplySpecializationCopy,
  parentId: number,
  imageId: number,
  services: Map<string, number>,
  posts: Map<string, number>,
  cases: Map<string, number>,
  siteCategories: number[],
) => {
  const rich = Object.fromEntries(
    Object.entries(page.fields).map(([key, value]) => [key, rt(paragraphs(value))]),
  )
  return {
    title: page.title,
    industryLongTitle: page.h1,
    slug: page.slug,
    generateSlug: false,
    industryLevel: 'secondary' as const,
    parentIndustry: parentId,
    displayOrder: page.displayOrder,
    featured: false,
    site_categories: siteCategories,
    _status: 'published' as const,
    industryPreviewDescription: page.preview,
    industryPreviewImage: imageId,
    ...rich,
    plannedSubindustries: [],
    recommendedServices: page.services.map((slug) => services.get(slug)!),
    relatedPosts: page.posts.map((slug) => posts.get(slug)!),
    relatedCaseStudies: page.cases.map((item) => ({
      caseStudy: cases.get(item.slug)!,
      relevance: item.relevance,
      relevanceNote: item.note,
    })),
    faq: page.faq.map((item) => ({
      question: item.question,
      answer: rt(paragraphs(item.answer)),
    })),
    ctaTitle: page.ctaTitle,
    ctaDescription: page.ctaDescription,
    ctaButtonLabel: 'Get a Free Audit',
    ctaButtonUrl: '/contact',
    meta: {
      title: page.metaTitle,
      description: page.metaDescription,
      image: imageId,
    },
  }
}

const populate = async () => {
  assertCopy()
  const payload = await getPayload({ config })

  const parents = await payload.find({
    collection: 'industries',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    pagination: false,
    where: {
      and: [{ slug: { equals: PARENT_SLUG } }, { industryLevel: { equals: 'primary' } }],
    },
  })
  const parent = parents.docs[0]
  if (!parent) throw new Error(`Parent industry ${PARENT_SLUG} not found`)
  const parentId = Number(parent.id)

  const serviceIds = await idsFor(
    payload,
    'services',
    SUPPLY_SPECIALIZATIONS.flatMap((page) => page.services),
  )
  const postIds = await idsFor(
    payload,
    'posts',
    SUPPLY_SPECIALIZATIONS.flatMap((page) => page.posts),
  )
  const siteSlugs = [...new Set(Object.values(SITE_CATEGORY_SLUGS).flat())]
  const siteIds = await idsFor(payload, 'site-categories', siteSlugs)
  const caseIds = await idsFor(
    payload,
    'case-studies',
    SUPPLY_SPECIALIZATIONS.flatMap((page) => page.cases.map((item) => item.slug)),
  )

  const created: string[] = []
  for (const page of SUPPLY_SPECIALIZATIONS) {
    const mediaFileName = page.image.replace(/\.jpg$/i, '-cms.jpg')
    const imageId = await uploadFile(payload, page.image, mediaFileName, page.alt)
    const pageSites = (SITE_CATEGORY_SLUGS[page.slug] ?? []).map((slug) => siteIds.get(slug)!)
    const data = industryData(page, parentId, imageId, serviceIds, postIds, caseIds, pageSites)

    const existing = await payload.find({
      collection: 'industries',
      depth: 0,
      limit: 1,
      overrideAccess: true,
      pagination: false,
      where: {
        and: [
          { slug: { equals: page.slug } },
          { industryLevel: { equals: 'secondary' } },
          { parentIndustry: { equals: parentId } },
        ],
      },
    })

    if (existing.docs[0]) {
      await payload.update({
        collection: 'industries',
        id: existing.docs[0].id,
        context,
        data,
        overrideAccess: true,
      })
      created.push(`updated:${page.slug}`)
    } else {
      await payload.create({
        collection: 'industries',
        context,
        data,
        overrideAccess: true,
      })
      created.push(`created:${page.slug}`)
    }
  }

  const parentRich = Object.fromEntries(
    Object.entries(PARENT_FIELD_UPDATES).map(([key, value]) => [key, rt(paragraphs(value))]),
  )

  await payload.update({
    collection: 'industries',
    id: parentId,
    context,
    data: { plannedSubindustries: [], ...parentRich },
    overrideAccess: true,
  })

  const secret = process.env.PREVIEW_SECRET
  const base = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
  if (secret) {
    try {
      const res = await fetch(`${base}/next/revalidate-sitemaps?previewSecret=${encodeURIComponent(secret)}`)
      console.log(`revalidate: ${res.status}`)
    } catch (error) {
      console.log(`revalidate skipped: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  console.log(JSON.stringify({ parentId, created, remainingPlanned: 0 }, null, 2))
  process.exit(0)
}

void populate().catch((error) => {
  console.error(error)
  process.exit(1)
})
