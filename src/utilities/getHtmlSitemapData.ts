import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

import type { CaseStudy, Post } from '@/payload-types'
import { legalFooterLinks } from '@/Footer/legalLinks'
import { headerCta, mainNavigation } from '@/Header/navigation'
import {
  BLOG_ARCHIVE_PATH,
  CASE_STUDIES_ARCHIVE_PATH,
  getCaseStudyUrl,
  getPostUrl,
  getServiceUrl,
  SERVICES_ARCHIVE_PATH,
} from '@/utilities/getContentUrls'
import { HTML_SITEMAP_CACHE_TAG } from '@/utilities/revalidateHtmlSitemap'

export type HtmlSitemapLink = {
  label: string
  href: string
}

export type HtmlSitemapData = {
  mainNavigation: HtmlSitemapLink[]
  services: HtmlSitemapLink[]
  caseStudies: HtmlSitemapLink[]
  posts: HtmlSitemapLink[]
  additionalPages: HtmlSitemapLink[]
  legalPages: HtmlSitemapLink[]
}

const PAGE_SIZE = 200

const MAIN_NAV_PAGE_SLUGS = new Set(['about', 'contact'])
const LEGAL_PAGE_SLUGS = new Set(legalFooterLinks.map((link) => link.href.replace(/^\//, '')))
const EXCLUDED_PAGE_SLUGS = new Set(['home', 'search', 'admin', ...MAIN_NAV_PAGE_SLUGS, ...LEGAL_PAGE_SLUGS])

const publishedWhere = {
  _status: {
    equals: 'published' as const,
  },
}

const navById = Object.fromEntries(mainNavigation.map((item) => [item.id, item]))

const mainNavigationLinks: HtmlSitemapLink[] = [
  { label: 'Home', href: '/' },
  { label: navById.about?.label || 'About', href: navById.about?.href || '/about' },
  { label: navById.services?.label || 'Services', href: navById.services?.href || SERVICES_ARCHIVE_PATH },
  {
    label: navById['case-studies']?.label || 'Case Studies',
    href: navById['case-studies']?.href || CASE_STUDIES_ARCHIVE_PATH,
  },
  { label: navById.blog?.label || 'Blog', href: navById.blog?.href || BLOG_ARCHIVE_PATH },
  { label: 'Contact', href: headerCta.href || '/contact' },
]

const collectPublished = async <T>(
  payload: Awaited<ReturnType<typeof getPayload>>,
  collection: 'pages' | 'services' | 'case-studies' | 'posts',
  args: {
    depth?: number
    sort?: string | string[]
    select: Record<string, true>
  },
): Promise<T[]> => {
  const docs: T[] = []
  let page = 1
  let totalPages = 1

  while (page <= totalPages) {
    const result = await payload.find({
      collection,
      depth: args.depth ?? 0,
      draft: false,
      limit: PAGE_SIZE,
      overrideAccess: false,
      page,
      pagination: true,
      sort: args.sort,
      select: args.select,
      where: publishedWhere,
    })

    docs.push(...(result.docs as T[]))
    totalPages = result.totalPages || 1
    page += 1
  }

  return docs
}

const loadHtmlSitemapData = async (): Promise<HtmlSitemapData> => {
  const payload = await getPayload({ config: configPromise })

  const [pages, services, caseStudies, posts] = await Promise.all([
    collectPublished<{ title?: string | null; slug?: string | null }>(payload, 'pages', {
      sort: 'title',
      select: { title: true, slug: true },
    }),
    collectPublished<{
      title?: string | null
      slug?: string | null
      service_preview_title?: string | null
    }>(payload, 'services', {
      sort: ['displayOrder', 'title'],
      select: { title: true, slug: true, service_preview_title: true },
    }),
    collectPublished<
      Pick<CaseStudy, 'title' | 'slug' | 'case_study_long_title' | 'primary_case_study_category'>
    >(payload, 'case-studies', {
      depth: 1,
      sort: ['-featured', 'displayOrder', '-publishedAt'],
      select: {
        title: true,
        slug: true,
        case_study_long_title: true,
        primary_case_study_category: true,
      },
    }),
    collectPublished<Pick<Post, 'title' | 'slug' | 'postLongTitle' | 'primary_category'>>(
      payload,
      'posts',
      {
        depth: 1,
        sort: '-publishedAt',
        select: {
          title: true,
          slug: true,
          postLongTitle: true,
          primary_category: true,
        },
      },
    ),
  ])

  const additionalPages = pages.flatMap((page) => {
    if (!page.slug || EXCLUDED_PAGE_SLUGS.has(page.slug) || !page.title) return []
    return [{ label: page.title, href: `/${page.slug}` }]
  })

  return {
    mainNavigation: mainNavigationLinks,
    services: services.flatMap((doc) => {
      const href = getServiceUrl(doc)
      const label = doc.title || doc.service_preview_title
      if (!href || !label) return []
      return [{ label, href }]
    }),
    caseStudies: caseStudies.flatMap((doc) => {
      const href = getCaseStudyUrl(doc)
      const label = doc.title || doc.case_study_long_title
      if (!href || !label) return []
      return [{ label, href }]
    }),
    posts: posts.flatMap((doc) => {
      const href = getPostUrl(doc)
      const label = doc.title || doc.postLongTitle
      if (!href || !label) return []
      return [{ label, href }]
    }),
    additionalPages,
    legalPages: legalFooterLinks,
  }
}

export const getHtmlSitemapData = unstable_cache(loadHtmlSitemapData, [HTML_SITEMAP_CACHE_TAG], {
  tags: [
    HTML_SITEMAP_CACHE_TAG,
    'pages-sitemap',
    'posts-sitemap',
    'services-sitemap',
    'case-studies-sitemap',
  ],
})
