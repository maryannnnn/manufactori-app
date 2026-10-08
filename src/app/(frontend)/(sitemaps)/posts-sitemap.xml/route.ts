import { getServerSideSitemap } from 'next-sitemap'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'
import { getPostUrl } from '@/utilities/getContentUrls'
import { collectActiveCategoryPaths } from '@/utilities/activeCategoryPaths'
import { getServerSideURL } from '@/utilities/getURL'

const getPostsSitemap = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const SITE_URL = getServerSideURL()

    const [results, activeCategories] = await Promise.all([
      payload.find({
        collection: 'posts',
        overrideAccess: false,
        draft: false,
        depth: 1,
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
          primary_category: true,
        },
      }),
      collectActiveCategoryPaths(payload, 'post'),
    ])

    const dateFallback = new Date().toISOString()

    const sitemap = results.docs
      ? results.docs
          .map((post) => {
            const path = getPostUrl(post)
            if (!path) return null
            return {
              loc: `${SITE_URL}${path}`,
              lastmod: post.updatedAt || dateFallback,
            }
          })
          .filter((entry): entry is { loc: string; lastmod: string } => Boolean(entry))
      : []

    for (const category of activeCategories) {
      sitemap.push({
        loc: `${SITE_URL}${category.path}`,
        lastmod: category.lastmod || dateFallback,
      })
    }

    return sitemap
  },
  ['posts-sitemap'],
  {
    tags: ['posts-sitemap'],
  },
)

export async function GET() {
  const sitemap = await getPostsSitemap()

  return getServerSideSitemap(sitemap)
}
