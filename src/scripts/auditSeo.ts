import 'dotenv/config'

/**
 * Lightweight local SEO audit of public routes.
 *
 * Usage:
 *   pnpm audit:seo
 *   pnpm audit:seo -- --base http://localhost:3000
 *
 * This is a development helper. It does not change CMS content and is not
 * a substitute for Google Search Console, Bing, or PageSpeed Insights.
 */

type PageAudit = {
  path: string
  status: number
  title: string | null
  description: string | null
  canonical: string | null
  robots: string | null
  h1: string[]
  jsonLdTypes: string[]
  localhostUrls: boolean
  ogTitle: string | null
  ogImage: string | null
}

const args = process.argv.slice(2)
const baseIndex = args.indexOf('--base')
const BASE =
  (baseIndex >= 0 ? args[baseIndex + 1] : null) ||
  process.env.AUDIT_BASE_URL ||
  process.env.NEXT_PUBLIC_SERVER_URL ||
  'http://localhost:3000'

const ROUTES = [
  '/',
  '/services',
  '/services/seo-ai-search-optimization',
  '/case-studies',
  '/blog',
  '/about',
  '/contact',
  '/search',
  '/robots.txt',
  '/sitemap.xml',
  '/pages-sitemap.xml',
  '/posts-sitemap.xml',
  '/services-sitemap.xml',
  '/case-studies-sitemap.xml',
  '/llms.txt',
  '/this-page-should-404',
]

const meta = (html: string, name: string) => {
  const re = new RegExp(
    `<meta[^>]+(?:name|property)=["']${name}["'][^>]*content=["']([^"']*)["']`,
    'i',
  )
  const re2 = new RegExp(
    `<meta[^>]+content=["']([^"']*)["'][^>]*(?:name|property)=["']${name}["']`,
    'i',
  )
  return html.match(re)?.[1] || html.match(re2)?.[1] || null
}

const jsonLdTypes = (html: string): string[] => {
  const types = new Set<string>()
  const blocks = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
  for (const block of blocks) {
    try {
      const data = JSON.parse(block[1] || '{}')
      const nodes = Array.isArray(data['@graph']) ? data['@graph'] : [data]
      for (const node of nodes) {
        const value = node?.['@type']
        if (typeof value === 'string') types.add(value)
        if (Array.isArray(value)) value.forEach((item) => typeof item === 'string' && types.add(item))
      }
    } catch {
      types.add('INVALID_JSON')
    }
  }
  return [...types]
}

const auditPath = async (path: string): Promise<PageAudit> => {
  const response = await fetch(`${BASE}${path}`, { redirect: 'manual' })
  const contentType = response.headers.get('content-type') || ''
  const body = await response.text()
  const html = contentType.includes('text/html') ? body : ''

  return {
    path,
    status: response.status,
    title: html.match(/<title>([^<]*)<\/title>/i)?.[1] || null,
    description: meta(html, 'description'),
    canonical:
      html.match(/rel=["']canonical["'][^>]*href=["']([^"']*)["']/i)?.[1] ||
      html.match(/href=["']([^"']*)["'][^>]*rel=["']canonical["']/i)?.[1] ||
      null,
    robots: meta(html, 'robots'),
    h1: [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((match) =>
      match[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(),
    ),
    jsonLdTypes: jsonLdTypes(html),
    localhostUrls: /localhost|127\.0\.0\.1/i.test(html),
    ogTitle: meta(html, 'og:title'),
    ogImage: meta(html, 'og:image'),
  }
}

const main = async () => {
  console.log(`SEO audit against ${BASE}\n`)
  const rows: PageAudit[] = []

  for (const path of ROUTES) {
    try {
      const row = await auditPath(path)
      rows.push(row)
      const h1 = row.h1.length === 1 ? '1 H1' : `${row.h1.length} H1`
      console.log(
        `${row.status} ${path.padEnd(42)} ${h1.padEnd(6)} ${(row.title || '').slice(0, 70)}`,
      )
    } catch (error) {
      console.error(`ERR ${path}`, error)
    }
  }

  const titles = new Map<string, string[]>()
  for (const row of rows) {
    if (!row.title) continue
    const list = titles.get(row.title) || []
    list.push(row.path)
    titles.set(row.title, list)
  }

  console.log('\nDuplicate titles:')
  let duplicates = 0
  for (const [title, paths] of titles) {
    if (paths.length > 1) {
      duplicates += 1
      console.log(`- ${title}: ${paths.join(', ')}`)
    }
  }
  if (!duplicates) console.log('(none in sampled routes)')

  const localhostPages = rows.filter((row) => row.localhostUrls && row.status === 200)
  console.log('\nLocalhost URLs in HTML:')
  if (localhostPages.length === 0) console.log('(none in sampled HTML routes)')
  else localhostPages.forEach((row) => console.log(`- ${row.path}`))

  console.log('\nJSON-LD types:')
  rows
    .filter((row) => row.jsonLdTypes.length)
    .forEach((row) => console.log(`- ${row.path}: ${row.jsonLdTypes.join(', ')}`))
}

void main()
