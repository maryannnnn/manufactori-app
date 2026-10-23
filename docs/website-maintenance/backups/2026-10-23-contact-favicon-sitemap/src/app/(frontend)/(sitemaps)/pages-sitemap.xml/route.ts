import { getServerSideSitemap } from 'next-sitemap'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'
import { BLOG_ARCHIVE_PATH, CLIENTS_PATH } from '@/utilities/getContentUrls'
import { getServerSideURL } from '@/utilities/getURL'

const EXCLUDED_PAGE_SLUGS = new Set(['home', 'search', 'admin', 'clients', 'image-editor-check'])

const getPagesSitemap = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const SITE_URL = getServerSideURL()

    const results = await payload.find({
      collection: 'pages',
      overrideAccess: false,
      draft: false,
      depth: 0,
      limit: 1000,
      pagination: false,
      where: {
        _status: {
          equals: 'published',
        },
      },
      select: {
        slug: true,
        updatedAt: true,
      },
    })

    const home = results.docs?.find((page) => page.slug === 'home')

    const entries: { loc: string; lastmod?: string }[] = [
      {
        loc: `${SITE_URL}/`,
        ...(home?.updatedAt ? { lastmod: home.updatedAt } : {}),
      },
      { loc: `${SITE_URL}${BLOG_ARCHIVE_PATH}` },
      { loc: `${SITE_URL}${CLIENTS_PATH}` },
    ]

    for (const page of results.docs ?? []) {
      if (!page?.slug || EXCLUDED_PAGE_SLUGS.has(page.slug)) continue
      entries.push({
        loc: `${SITE_URL}/${page.slug}`,
        ...(page.updatedAt ? { lastmod: page.updatedAt } : {}),
      })
    }

    return entries
  },
  ['pages-sitemap'],
  {
    tags: ['pages-sitemap'],
  },
)

export async function GET() {
  const sitemap = await getPagesSitemap()

  return getServerSideSitemap(sitemap)
}
