import { getServerSideSitemap } from 'next-sitemap'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'
import { CASE_STUDIES_ARCHIVE_PATH, getCaseStudyUrl } from '@/utilities/getContentUrls'
import { collectActiveCategoryPaths } from '@/utilities/activeCategoryPaths'
import { getServerSideURL } from '@/utilities/getURL'

const getCaseStudiesSitemap = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const SITE_URL = getServerSideURL()

    const [results, activeCategories] = await Promise.all([
      payload.find({
        collection: 'case-studies',
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
          primary_case_study_category: true,
        },
      }),
      collectActiveCategoryPaths(payload, 'case-study'),
    ])

    const newest = results.docs
      ?.map((doc) => doc.updatedAt)
      .filter((value): value is string => Boolean(value))
      .sort()
      .at(-1)
    const entries: { loc: string; lastmod?: string }[] = [
      {
        loc: `${SITE_URL}${CASE_STUDIES_ARCHIVE_PATH}`,
        ...(newest ? { lastmod: newest } : {}),
      },
    ]

    for (const doc of results.docs ?? []) {
      const path = getCaseStudyUrl(doc)
      if (path) {
        entries.push({
          loc: `${SITE_URL}${path}`,
          ...(doc.updatedAt ? { lastmod: doc.updatedAt } : {}),
        })
      }
    }

    for (const category of activeCategories) {
      entries.push({
        loc: `${SITE_URL}${category.path}`,
        ...(category.lastmod ? { lastmod: category.lastmod } : {}),
      })
    }

    return entries
  },
  ['case-studies-sitemap'],
  {
    tags: ['case-studies-sitemap'],
  },
)

export async function GET() {
  const sitemap = await getCaseStudiesSitemap()
  return getServerSideSitemap(sitemap)
}
