const SITE_URL =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  process.env.VERCEL_PROJECT_PRODUCTION_URL ||
  'https://example.com'

/**
 * Static next-sitemap generation is disabled. Public sitemaps are App Router
 * routes: /sitemap.xml, /pages-sitemap.xml, /posts-sitemap.xml,
 * /services-sitemap.xml, /case-studies-sitemap.xml.
 *
 * @type {import('next-sitemap').IConfig}
 */
module.exports = {
  siteUrl: SITE_URL,
  generateIndexSitemap: false,
  generateRobotsTxt: false,
  exclude: ['/**'],
}
