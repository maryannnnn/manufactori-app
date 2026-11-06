import config from '@payload-config'
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'

import { getIndustryUrl } from '@/utilities/getContentUrls'

const loadSecondaryIndustryPaths = async (): Promise<Record<string, string>> => {
  const payload = await getPayload({ config })
  const found = await payload.find({
    collection: 'industries',
    depth: 1,
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
      industryLevel: true,
      parentIndustry: true,
    },
    where: {
      and: [{ _status: { equals: 'published' } }, { industryLevel: { equals: 'secondary' } }],
    },
  })

  const paths: Record<string, string> = {}
  for (const doc of found.docs) {
    const path = getIndustryUrl(doc)
    if (doc.slug && path && path !== `/industrial/${doc.slug}`) paths[doc.slug] = path
  }
  return paths
}

export const getSecondaryIndustryPaths = unstable_cache(
  loadSecondaryIndustryPaths,
  ['secondary-industry-paths', 'nested-industry-urls'],
  { tags: ['industries-sitemap'] },
)
