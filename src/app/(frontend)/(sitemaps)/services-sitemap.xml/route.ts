import { getServerSideSitemap } from 'next-sitemap'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'
import { getServiceUrl } from '@/utilities/getContentUrls'
import { getServerSideURL } from '@/utilities/getURL'

const getServicesSitemap = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const SITE_URL = getServerSideURL()

    const results = await payload.find({
      collection: 'services',
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

    const dateFallback = new Date().toISOString()

    const archive = {
      loc: `${SITE_URL}/services`,
      lastmod: dateFallback,
    }

    const sitemap = results.docs
      ? results.docs
          .map((doc) => {
            const path = getServiceUrl(doc)
            if (!path) return null
            return {
              loc: `${SITE_URL}${path}`,
              lastmod: doc.updatedAt || dateFallback,
            }
          })
          .filter((entry): entry is { loc: string; lastmod: string } => Boolean(entry))
      : []

    return [archive, ...sitemap]
  },
  ['services-sitemap'],
  {
    tags: ['services-sitemap'],
  },
)

export async function GET() {
  const sitemap = await getServicesSitemap()
  return getServerSideSitemap(sitemap)
}
