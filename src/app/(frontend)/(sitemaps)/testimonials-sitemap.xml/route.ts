import { getServerSideSitemap } from 'next-sitemap'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'
import { getTestimonialUrl, TESTIMONIALS_ARCHIVE_PATH } from '@/utilities/getContentUrls'
import { getServerSideURL } from '@/utilities/getURL'

const getTestimonialsSitemap = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const siteUrl = getServerSideURL()

    const results = await payload.find({
      collection: 'testimonials',
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

    const docs = results.docs ?? []
    const latest = docs.reduce<string | undefined>((current, doc) => {
      if (!doc.updatedAt) return current
      if (!current || doc.updatedAt > current) return doc.updatedAt
      return current
    }, undefined)

    return [
      {
        loc: `${siteUrl}${TESTIMONIALS_ARCHIVE_PATH}`,
        ...(latest ? { lastmod: latest } : {}),
      },
      ...docs.flatMap((doc) => {
        const path = getTestimonialUrl(doc)
        if (!path) return []
        return [
          {
            loc: `${siteUrl}${path}`,
            ...(doc.updatedAt ? { lastmod: doc.updatedAt } : {}),
          },
        ]
      }),
    ]
  },
  ['testimonials-sitemap'],
  {
    tags: ['testimonials-sitemap'],
  },
)

export async function GET() {
  const sitemap = await getTestimonialsSitemap()
  return getServerSideSitemap(sitemap)
}
