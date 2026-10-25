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
import { getServerSideURL } from '@/utilities/getURL'

export type PublicSitemapEntry = {
  loc: string
  lastmod?: string
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

class SitemapList {
  private entries = new Map<string, PublicSitemapEntry>()

  add(loc: string, lastmod?: string | null) {
    const existing = this.entries.get(loc)
    if (!existing) {
      this.entries.set(loc, {
        loc,
        ...(lastmod ? { lastmod } : {}),
      })
      return
    }
    if (lastmod && (!existing.lastmod || lastmod > existing.lastmod)) existing.lastmod = lastmod
  }

  list(): PublicSitemapEntry[] {
    return [...this.entries.values()]
  }
}

const findPublished = async <
  T extends 'pages' | 'posts' | 'services' | 'case-studies' | 'testimonials',
>(
  payload: Payload,
  collection: T,
  depth = 0,
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
      findPublished(payload, 'posts', 1),
      findPublished(payload, 'services'),
      findPublished(payload, 'case-studies', 1),
      findPublished(payload, 'testimonials'),
      collectActiveCategoryPaths(payload, 'post'),
      collectActiveCategoryPaths(payload, 'case-study'),
    ])

  const home = pages.docs.find((page) => page.slug === 'home')
  list.add(`${base}/`, home?.updatedAt)
  list.add(absolute(base, BLOG_ARCHIVE_PATH))
  list.add(absolute(base, CLIENTS_PATH))
  list.add(absolute(base, SERVICES_ARCHIVE_PATH))
  list.add(absolute(base, CASE_STUDIES_ARCHIVE_PATH))
  list.add(absolute(base, TESTIMONIALS_ARCHIVE_PATH))

  for (const page of pages.docs) {
    if (!page.slug || EXCLUDED_PAGE_SLUGS.has(page.slug)) continue
    list.add(absolute(base, `/${page.slug}`), page.updatedAt)
  }

  for (const doc of services.docs) {
    const path = getServiceUrl(doc)
    if (!path) continue
    list.add(absolute(base, SERVICES_ARCHIVE_PATH), doc.updatedAt)
    list.add(absolute(base, path), doc.updatedAt)
  }

  for (const doc of caseStudies.docs) {
    const path = getCaseStudyUrl(doc)
    if (!path) continue
    list.add(absolute(base, CASE_STUDIES_ARCHIVE_PATH), doc.updatedAt)
    list.add(absolute(base, CLIENTS_PATH), doc.updatedAt)
    list.add(absolute(base, path), doc.updatedAt)
  }

  for (const doc of posts.docs) {
    const path = getPostUrl(doc)
    if (!path) continue
    list.add(absolute(base, BLOG_ARCHIVE_PATH), doc.updatedAt)
    list.add(absolute(base, path), doc.updatedAt)
  }

  for (const doc of testimonials.docs) {
    const path = getTestimonialUrl(doc)
    if (!path) continue
    list.add(absolute(base, TESTIMONIALS_ARCHIVE_PATH), doc.updatedAt)
    list.add(absolute(base, path), doc.updatedAt)
  }

  for (const category of postCategories) {
    list.add(absolute(base, category.path), category.lastmod)
  }

  for (const category of caseCategories) {
    list.add(absolute(base, category.path), category.lastmod)
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
    .map((entry) =>
      [
        '  <url>',
        `    <loc>${escapeXml(entry.loc)}</loc>`,
        entry.lastmod ? `    <lastmod>${escapeXml(entry.lastmod)}</lastmod>` : '',
        '  </url>',
      ]
        .filter(Boolean)
        .join('\n'),
    )
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`
}
