import 'dotenv/config'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { generateJSON } from '@tiptap/html'
import config from '@payload-config'
import { getPayload } from 'payload'

import { getPostUrl } from '../utilities/getContentUrls'
import { getTiptapExtensions } from '../utilities/richText/extensions'

const CONTENT_FILE = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  'content/blog/agency-first-stage.html',
)

const rt = (html: string) => generateJSON(html, getTiptapExtensions({ headingLevels: [2, 3, 4] }))
const rtHero = (html: string) =>
  generateJSON(html, getTiptapExtensions({ headingLevels: [1, 2, 3, 4] }))

const escapeHtml = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const paragraphs = (text: string) => `<p>${escapeHtml(text)}</p>`

const contentBlock = (html: string) => ({
  blockType: 'postContentBlock' as const,
  columns: [{ size: 'full' as const, richText: rt(html), enableLink: false }],
})

const titleBlock = (title: string) => ({
  blockType: 'postContentTitleBlock' as const,
  postContentTitle: title,
})

const previewBlock = (title: string, text: string, imageId: number) => ({
  blockType: 'postPreviewBlock' as const,
  postPreviewTitle: title,
  postPreviewText: rt(paragraphs(text)),
  postPreviewImage: imageId,
})

const ctaBlock = (heading: string, body: string, url: string, label: string) => ({
  blockType: 'cta' as const,
  richText: rtHero(`<h2>${escapeHtml(heading)}</h2>${paragraphs(body)}`),
  links: [
    {
      link: {
        type: 'custom' as const,
        newTab: false,
        url,
        label,
        appearance: 'default' as const,
      },
    },
  ],
})

const parseArticle = (raw: string) => {
  const parts = raw.trim().split(/\n@@ /)
  const intro = parts[0].trim()
  const sections = parts.slice(1).map((part) => {
    const breakAt = part.indexOf('\n')
    if (breakAt < 0) throw new Error('Section missing body')
    return { title: part.slice(0, breakAt).trim(), html: part.slice(breakAt + 1).trim() }
  })
  return { intro, sections }
}

const requireId = (map: Map<string, number>, slug: string) => {
  const id = map.get(slug)
  if (!id) throw new Error(`Missing taxonomy slug: ${slug}`)
  return id
}

const loadIds = async (
  payload: Awaited<ReturnType<typeof getPayload>>,
  collection: 'categories' | 'site-categories',
  slugs: string[],
) => {
  const unique = [...new Set(slugs)]
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
  if (missing.length) throw new Error(`${collection} missing: ${missing.join(', ')}`)
  return map
}

const ARTICLE = {
  title: 'Building a Manufacturing Marketing Agency: Completing the First Stage of Development',
  h1: 'Building a Manufacturing Marketing Agency: Completing the First Stage of Development',
  slug: 'building-manufacturing-marketing-agency-first-stage-development',
  previewTitle: 'Building a Manufacturing Marketing Agency: First Stage Complete',
  previewText:
    'From an initial idea to a structured digital platform for manufacturing and industrial businesses.',
  metaTitle: 'Building a Manufacturing Marketing Agency: First Stage',
  metaDescription:
    'From an initial idea to a structured digital platform for manufacturing and industrial businesses: Services, Industries, Case Studies, SEO, and AI search.',
  publishedAt: '2026-11-03T12:00:00.000Z',
  imageFilename: 'svc-bright-strategy-overview-1.jpg',
  primarySlug: 'manufacturing-marketing-strategy',
  categorySlugs: [
    'manufacturing-marketing-strategy',
    'industrial-website-architecture',
    'manufacturing-seo',
    'ai-search-optimization',
    'technical-content-marketing',
    'manufacturing',
  ],
  siteCategorySlugs: [
    'manufacturing-marketing-strategy',
    'industrial-website-architecture',
    'manufacturing-website-development',
    'manufacturing-seo',
    'ai-search-optimization',
    'manufacturing-content-marketing',
    'manufacturing',
  ],
  ctaHeading: 'Talk through a manufacturing marketing project',
  ctaBody:
    'If you manufacture industrial products and want a clearer digital foundation, start with the products, industries, and enquiry path you need to support.',
  ctaLabel: 'Contact us',
  ctaUrl: '/contact',
}

const main = async () => {
  const payload = await getPayload({ config })
  const parsed = parseArticle(readFileSync(CONTENT_FILE, 'utf8'))
  const categoryMap = await loadIds(payload, 'categories', [
    ARTICLE.primarySlug,
    ...ARTICLE.categorySlugs,
  ])
  const siteMap = await loadIds(payload, 'site-categories', ARTICLE.siteCategorySlugs)

  const media = await payload.find({
    collection: 'media',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: { filename: { equals: ARTICLE.imageFilename } },
  })
  const image = media.docs[0]
  if (!image) throw new Error(`Media not found: ${ARTICLE.imageFilename}`)
  const imageId = Number(image.id)

  const data = {
    title: ARTICLE.title,
    postLongTitle: ARTICLE.h1,
    slug: ARTICLE.slug,
    generateSlug: false,
    _status: 'published' as const,
    publishedAt: ARTICLE.publishedAt,
    authors: [1],
    primary_category: requireId(categoryMap, ARTICLE.primarySlug),
    categories: ARTICLE.categorySlugs.map((slug) => requireId(categoryMap, slug)),
    site_categories: ARTICLE.siteCategorySlugs.map((slug) => requireId(siteMap, slug)),
    relatedPosts: [],
    hero: {
      type: 'mediumImpact' as const,
      media: imageId,
      richText: rtHero(
        `<h1>${escapeHtml(ARTICLE.h1)}</h1>${paragraphs(ARTICLE.previewText)}${parsed.intro}`,
      ),
    },
    layout: [
      previewBlock(ARTICLE.previewTitle, ARTICLE.previewText, imageId),
      ...parsed.sections.flatMap((section) => [
        titleBlock(section.title),
        contentBlock(section.html),
      ]),
      ctaBlock(ARTICLE.ctaHeading, ARTICLE.ctaBody, ARTICLE.ctaUrl, ARTICLE.ctaLabel),
    ],
    meta: {
      title: ARTICLE.metaTitle,
      description: ARTICLE.metaDescription,
      image: imageId,
    },
  }

  const existing = await payload.find({
    collection: 'posts',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: { slug: { equals: ARTICLE.slug } },
  })

  const context = { disableRevalidate: true, disableCategorySeo: true }

  const saved = existing.docs[0]
    ? await payload.update({
        collection: 'posts',
        id: existing.docs[0].id,
        data,
        draft: false,
        overrideAccess: true,
        context,
      })
    : await payload.create({
        collection: 'posts',
        data,
        draft: false,
        overrideAccess: true,
        context,
      })

  const verified = await payload.findByID({
    collection: 'posts',
    id: saved.id,
    depth: 1,
    draft: false,
    overrideAccess: true,
  })

  console.log(
    JSON.stringify(
      {
        id: verified.id,
        status: verified._status,
        url: getPostUrl(verified),
        slug: verified.slug,
        title: verified.title,
        postLongTitle: verified.postLongTitle,
        primary_category:
          typeof verified.primary_category === 'object'
            ? {
                id: verified.primary_category?.id,
                slug: verified.primary_category?.slug,
                title: verified.primary_category?.title,
              }
            : verified.primary_category,
        categories: (verified.categories || []).map((item) =>
          typeof item === 'object'
            ? { id: item?.id, slug: item?.slug, title: item?.title }
            : item,
        ),
        site_categories: (verified.site_categories || []).map((item) =>
          typeof item === 'object'
            ? { id: item?.id, slug: item?.slug, title: item?.title }
            : item,
        ),
        meta: {
          title: verified.meta?.title,
          description: verified.meta?.description,
          image:
            typeof verified.meta?.image === 'object'
              ? verified.meta.image?.filename
              : verified.meta?.image,
        },
        layoutBlocks: (verified.layout || []).map((block) => block.blockType),
      },
      null,
      2,
    ),
  )
}

void main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
