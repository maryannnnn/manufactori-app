import config from '@payload-config'
import { unstable_cache } from 'next/cache'
import { getPayload, type Payload } from 'payload'

import { collectActiveCategoryPaths } from '@/utilities/activeCategoryPaths'
import {
  BLOG_ARCHIVE_PATH,
  CASE_STUDIES_ARCHIVE_PATH,
  CLIENTS_PATH,
  getCaseStudyUrl,
  getPostUrl,
  getServiceUrl,
  getTestimonialUrl,
  SERVICES_ARCHIVE_PATH,
  TESTIMONIALS_ARCHIVE_PATH,
} from '@/utilities/getContentUrls'
import { getPublicMediaPath, hasImageFileExtension, toStaticMediaUrl } from '@/utilities/getMediaUrl'
import { getServerSideURL } from '@/utilities/getURL'

export type PublicSitemapEntry = {
  loc: string
  lastmod?: string
  images: string[]
}

const EXCLUDED_PAGE_SLUGS = new Set(['home', 'search', 'admin', 'image-editor-check'])

const publishedWhere = {
  _status: {
    equals: 'published' as const,
  },
}

const absolute = (base: string, path: string): string => {
  if (/^https?:\/\//i.test(path)) return path.replace(/\/+$/, '') || path
  const normalized = path.startsWith('/') ? path : `/${path}`
  if (normalized === '/') return `${base}/`
  return `${base}${normalized}`
}

const imageLoc = (base: string, record: Record<string, unknown>): string | null => {
  const filename = typeof record.filename === 'string' ? record.filename : null
  const mimeType = typeof record.mimeType === 'string' ? record.mimeType : ''
  const url = typeof record.url === 'string' ? record.url : null
  const isImage =
    mimeType.startsWith('image/') || hasImageFileExtension(filename) || hasImageFileExtension(url)
  if (!isImage) return null

  const path = getPublicMediaPath(filename) || toStaticMediaUrl(url)
  if (!path) return null
  return absolute(base, path.split('?')[0] || path)
}

const collectImages = (value: unknown, base: string, into: Set<string>) => {
  if (!value || typeof value !== 'object') return
  if (Array.isArray(value)) {
    for (const item of value) collectImages(item, base, into)
    return
  }

  const record = value as Record<string, unknown>
  const loc = imageLoc(base, record)
  if (loc) into.add(loc)

  for (const [key, child] of Object.entries(record)) {
    if (key === 'sizes') continue
    if (child && typeof child === 'object') collectImages(child, base, into)
  }
}

class SitemapList {
  private entries = new Map<string, PublicSitemapEntry>()

  add(loc: string, lastmod?: string | null, images?: Iterable<string>) {
    const existing = this.entries.get(loc)
    const nextImages = [...(images ?? [])]
    if (!existing) {
      this.entries.set(loc, {
        loc,
        ...(lastmod ? { lastmod } : {}),
        images: nextImages,
      })
      return
    }
    if (lastmod && (!existing.lastmod || lastmod > existing.lastmod)) existing.lastmod = lastmod
    for (const image of nextImages) {
      if (!existing.images.includes(image)) existing.images.push(image)
    }
  }

  list(): PublicSitemapEntry[] {
    return [...this.entries.values()]
  }
}

const imagesOf = (doc: unknown, base: string): string[] => {
  const images = new Set<string>()
  collectImages(doc, base, images)
  return [...images]
}

const findPublished = async <
  T extends 'pages' | 'posts' | 'services' | 'case-studies' | 'testimonials',
>(
  payload: Payload,
  collection: T,
  depth = 1,
) => {
  return payload.find({
    collection,
    depth,
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    where: publishedWhere,
  })
}

export const loadPublicSitemap = async (): Promise<PublicSitemapEntry[]> => {
  const payload = await getPayload({ config })
  const base = getServerSideURL().replace(/\/+$/, '')
  const list = new SitemapList()

  const [pages, posts, services, caseStudies, testimonials, postCategories, caseCategories] =
    await Promise.all([
      findPublished(payload, 'pages'),
      findPublished(payload, 'posts'),
      findPublished(payload, 'services'),
      findPublished(payload, 'case-studies'),
      findPublished(payload, 'testimonials', 2),
      collectActiveCategoryPaths(payload, 'post'),
      collectActiveCategoryPaths(payload, 'case-study'),
    ])

  const home = pages.docs.find((page) => page.slug === 'home')
  list.add(`${base}/`, home?.updatedAt, imagesOf(home, base))
  list.add(absolute(base, BLOG_ARCHIVE_PATH))
  list.add(absolute(base, CLIENTS_PATH))
  list.add(absolute(base, SERVICES_ARCHIVE_PATH))
  list.add(absolute(base, CASE_STUDIES_ARCHIVE_PATH))
  list.add(absolute(base, TESTIMONIALS_ARCHIVE_PATH))

  for (const page of pages.docs) {
    if (!page.slug || EXCLUDED_PAGE_SLUGS.has(page.slug)) continue
    list.add(absolute(base, `/${page.slug}`), page.updatedAt, imagesOf(page, base))
  }

  for (const doc of services.docs) {
    const path = getServiceUrl(doc)
    if (!path) continue
    list.add(absolute(base, SERVICES_ARCHIVE_PATH), doc.updatedAt)
    list.add(absolute(base, path), doc.updatedAt, imagesOf(doc, base))
  }

  for (const doc of caseStudies.docs) {
    const path = getCaseStudyUrl(doc)
    if (!path) continue
    list.add(absolute(base, CASE_STUDIES_ARCHIVE_PATH), doc.updatedAt)
    list.add(absolute(base, CLIENTS_PATH), doc.updatedAt, imagesOf(doc.company_logo, base))
    list.add(absolute(base, path), doc.updatedAt, imagesOf(doc, base))
  }

  for (const doc of posts.docs) {
    const path = getPostUrl(doc)
    if (!path) continue
    list.add(absolute(base, BLOG_ARCHIVE_PATH), doc.updatedAt)
    list.add(absolute(base, path), doc.updatedAt, imagesOf(doc, base))
  }

  for (const doc of testimonials.docs) {
    const path = getTestimonialUrl(doc)
    if (!path) continue
    const caseStudy = doc.caseStudy && typeof doc.caseStudy === 'object' ? doc.caseStudy : null
    const images = [
      ...imagesOf({ ...doc, caseStudy: null }, base),
      ...imagesOf(caseStudy?.company_logo, base),
    ]
    list.add(absolute(base, TESTIMONIALS_ARCHIVE_PATH), doc.updatedAt, imagesOf(caseStudy?.company_logo, base))
    list.add(absolute(base, path), doc.updatedAt, images)
  }

  const [postCategoryDocs, caseCategoryDocs] = await Promise.all([
    postCategories.length
      ? payload.find({
          collection: 'categories',
          depth: 1,
          limit: 1000,
          overrideAccess: false,
          pagination: false,
          where: { slug: { in: postCategories.map((category) => category.slug) } },
        })
      : Promise.resolve({ docs: [] }),
    caseCategories.length
      ? payload.find({
          collection: 'case-study-categories',
          depth: 1,
          limit: 1000,
          overrideAccess: false,
          pagination: false,
          where: { slug: { in: caseCategories.map((category) => category.slug) } },
        })
      : Promise.resolve({ docs: [] }),
  ])

  const postCategoryBySlug = new Map(
    postCategoryDocs.docs.flatMap((doc) => (doc.slug ? [[doc.slug, doc] as const] : [])),
  )
  const caseCategoryBySlug = new Map(
    caseCategoryDocs.docs.flatMap((doc) => (doc.slug ? [[doc.slug, doc] as const] : [])),
  )

  for (const category of postCategories) {
    const doc = postCategoryBySlug.get(category.slug)
    list.add(absolute(base, category.path), doc?.updatedAt || category.lastmod, imagesOf(doc, base))
  }

  for (const category of caseCategories) {
    const doc = caseCategoryBySlug.get(category.slug)
    list.add(absolute(base, category.path), doc?.updatedAt || category.lastmod, imagesOf(doc, base))
  }

  return list.list()
}

export const getPublicSitemap = unstable_cache(loadPublicSitemap, ['public-sitemap'], {
  tags: [
    'pages-sitemap',
    'posts-sitemap',
    'services-sitemap',
    'case-studies-sitemap',
    'testimonials-sitemap',
  ],
})

const escapeXml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

export const renderPublicSitemap = (entries: PublicSitemapEntry[]): string => {
  const urls = entries
    .map((entry) => {
      const images = entry.images
        .map((image) => `    <image:image><image:loc>${escapeXml(image)}</image:loc></image:image>`)
        .join('\n')
      return [
        '  <url>',
        `    <loc>${escapeXml(entry.loc)}</loc>`,
        entry.lastmod ? `    <lastmod>${escapeXml(entry.lastmod)}</lastmod>` : '',
        images,
        '  </url>',
      ]
        .filter(Boolean)
        .join('\n')
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls}
</urlset>`
}
