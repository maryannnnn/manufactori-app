import type { MetadataRoute } from 'next'

import { getServerSideURL } from '@/utilities/getURL'
import { BLOCK_SITE_INDEXING, getRobotsTxtRules } from '@/utilities/siteRobots'

export default function robots(): MetadataRoute.Robots {
  const rules = getRobotsTxtRules()

  if (BLOCK_SITE_INDEXING) {
    return { rules }
  }

  return {
    rules,
    sitemap: `${getServerSideURL()}/sitemap.xml`,
    host: getServerSideURL(),
  }
}
