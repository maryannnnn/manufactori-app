import type { MetadataRoute } from 'next'

import { BLOCK_SITE_INDEXING, getRobotsTxtRules } from '@/utilities/siteRobots'

export default function robots(): MetadataRoute.Robots {
  if (!BLOCK_SITE_INDEXING) {
    return {
      rules: {
        userAgent: '*',
        disallow: '/admin/',
      },
    }
  }

  return {
    rules: getRobotsTxtRules(),
  }
}
