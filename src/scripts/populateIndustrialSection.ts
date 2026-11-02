import 'dotenv/config'
import { existsSync } from 'node:fs'
import path from 'node:path'

import { generateJSON } from '@tiptap/html'
import config from '@payload-config'
import { getPayload, type Payload } from 'payload'
import sharp from 'sharp'

import { INDUSTRIES, type IndustryCopy } from './content/industrialCopy'
import { MORE_INDUSTRIES, OVERVIEW } from './content/industrialCopyRest'
import { getTiptapExtensions } from '../utilities/richText/extensions'

const rt = (html: string) => generateJSON(html, getTiptapExtensions({ headingLevels: [2, 3, 4] }))
const context = { disableRevalidate: true, disableCategorySeo: true }
const pages = [...INDUSTRIES, ...MORE_INDUSTRIES]

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const paragraphs = (...parts: string[]) => parts.map((part) => `<p>${escapeHtml(part)}</p>`).join('')

const assertCopy = () => {
  if (pages.length !== 9) throw new Error(`Expected 9 industries, got ${pages.length}`)
  const slugs = new Set<string>()
  for (const page of pages) {
    if (slugs.has(page.slug)) throw new Error(`Duplicate ${page.slug}`)
    slugs.add(page.slug)
    if (page.h1.trim().toLowerCase() === page.title.trim().toLowerCase()) throw new Error(`${page.slug} H1 repeats title`)
    if (page.metaTitle.length < 50 || page.metaTitle.length > 60) {
      throw new Error(`${page.slug} title ${page.metaTitle.length}`)
    }
    if (page.metaDescription.length < 140 || page.metaDescription.length > 160) {
      throw new Error(`${page.slug} description ${page.metaDescription.length}`)
    }
    if (/[\u2013\u2014]/.test(JSON.stringify(page))) throw new Error(`${page.slug} has a dash`)
    if (!existsSync(path.join(process.cwd(), 'public', 'media', page.image))) {
      throw new Error(`Missing image ${page.image}`)
    }
  }
  if (OVERVIEW.metaTitle.length < 50 || OVERVIEW.metaTitle.length > 60) {
    throw new Error(`overview title ${OVERVIEW.metaTitle.length}`)
  }
  if (OVERVIEW.metaDescription.length < 140 || OVERVIEW.metaDescription.length > 160) {
    throw new Error(`overview description ${OVERVIEW.metaDescription.length}`)
  }
  if (/[\u2013\u2014]/.test(JSON.stringify(OVERVIEW))) throw new Error('overview has a dash')
}

const idsFor = async (payload: Payload, collection: 'services' | 'posts' | 'case-studies', slugs: string[]) => {
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
  const buffer = await sharp(source).rotate().resize({ width: 1800, withoutEnlargement: true }).jpeg({ quality: 82 }).toBuffer()
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
  page: IndustryCopy,
  imageId: number,
  services: Map<string, number>,
  posts: Map<string, number>,
  cases: Map<string, number>,
) => {
  const rich = Object.fromEntries(
    Object.entries(page.fields).map(([key, value]) => [key, rt(paragraphs(value))]),
  )
  return {
    title: page.title,
    industryLongTitle: page.h1,
    slug: page.slug,
    generateSlug: false,
    industryLevel: 'primary' as const,
    parentIndustry: null,
    displayOrder: page.displayOrder,
    featured: false,
    _status: 'published' as const,
    industryPreviewDescription: page.preview,
    industryPreviewImage: imageId,
    ...rich,
    plannedSubindustries: page.planned.map((item) => ({
      title: item.title,
      slug: item.slug,
      previewDescription: item.previewDescription,
      displayOrder: item.displayOrder,
    })),
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

const overviewLayout = (imageId: number) => {
  const intro = {
    blockType: 'content' as const,
    columns: [{ size: 'full' as const, richText: rt(paragraphs(...OVERVIEW.intro)) }],
  }
  const sections = OVERVIEW.sections.map((section) => ({
    blockType: 'content' as const,
    columns: [
      {
        size: 'full' as const,
        richText: rt(`<h2>${escapeHtml(section.title)}</h2>${paragraphs(...section.paragraphs)}`),
      },
    ],
  }))
  return {
    title: OVERVIEW.title,
    pageLongTitle: OVERVIEW.h1,
    slug: 'industrial',
    generateSlug: false,
    _status: 'published' as const,
    hero: { type: 'none' as const },
    layout: [intro, ...sections],
    meta: {
      title: OVERVIEW.metaTitle,
      description: OVERVIEW.metaDescription,
      image: imageId,
    },
  }
}

const populate = async () => {
  assertCopy()
  const payload = await getPayload({ config })
  const serviceIds = await idsFor(
    payload,
    'services',
    pages.flatMap((page) => page.services),
  )
  const postIds = await idsFor(
    payload,
    'posts',
    pages.flatMap((page) => page.posts),
  )
  const caseIds = await idsFor(
    payload,
    'case-studies',
    pages.flatMap((page) => page.cases.map((item) => item.slug)),
  )

  const imageIds = new Map<string, number>()
  for (const page of pages) {
    const id = await uploadFile(payload, page.image, `ind-${page.slug}.jpg`, page.alt)
    imageIds.set(page.slug, id)
  }
  const overviewImage = await uploadFile(payload, OVERVIEW.image, 'ind-industrial-overview.jpg', OVERVIEW.alt)

  for (const page of pages) {
    const data = industryData(page, imageIds.get(page.slug)!, serviceIds, postIds, caseIds)
    const existing = await payload.find({
      collection: 'industries',
      depth: 0,
      limit: 1,
      overrideAccess: true,
      pagination: false,
      where: {
        and: [{ slug: { equals: page.slug } }, { industryLevel: { equals: 'primary' } }],
      },
    })
    if (existing.docs[0]) {
      await payload.update({
        collection: 'industries',
        id: existing.docs[0].id,
        context,
        data,
        draft: false,
        overrideAccess: true,
      })
      payload.logger.info(`Updated industry /industrial/${page.slug}`)
    } else {
      await payload.create({
        collection: 'industries',
        context,
        data,
        draft: false,
        overrideAccess: true,
      })
      payload.logger.info(`Created industry /industrial/${page.slug}`)
    }
  }

  const pageData = overviewLayout(overviewImage)
  const existingPage = await payload.find({
    collection: 'pages',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    pagination: false,
    where: { slug: { equals: 'industrial' } },
  })
  if (existingPage.docs[0]) {
    await payload.update({
      collection: 'pages',
      id: existingPage.docs[0].id,
      context,
      data: pageData,
      draft: false,
      overrideAccess: true,
    })
    payload.logger.info('Updated page /industrial')
  } else {
    await payload.create({
      collection: 'pages',
      context,
      data: pageData,
      draft: false,
      overrideAccess: true,
    })
    payload.logger.info('Created page /industrial')
  }
}

void populate()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
