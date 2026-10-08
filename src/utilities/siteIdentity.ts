import { getServerSideURL } from './getURL'

/** Legal / brand name shown in the logo wordmark and footer copyright. */
export const ORGANIZATION_NAME = 'Maryan Polyak'

/** Public site name used in metadata, Open Graph, and the logo subtitle. */
export const SITE_NAME = 'Manufacturing Marketing Agency'

export const HOME_TITLE = 'Manufacturing Marketing Agency | SEO, Websites & Lead Generation'

export const HOME_DESCRIPTION =
  'Digital marketing, SEO, websites and lead generation for manufacturers and industrial companies. Turn technical expertise into qualified B2B opportunities.'

export const ORGANIZATION_DESCRIPTION =
  'Manufacturing marketing, SEO and digital growth for industrial companies.'

export const HOME_H1 = 'Marketing That Turns Manufacturing Expertise Into Qualified Pipeline'

export const stripTrailingSlash = (url: string): string => url.replace(/\/+$/, '')

export const absoluteUrl = (path: string = '/'): string => {
  const base = stripTrailingSlash(getServerSideURL())
  if (!path || path === '/') return `${base}/`
  if (/^https?:\/\//i.test(path)) return path
  return `${base}${path.startsWith('/') ? path : `/${path}`}`
}

export const entityId = (fragment: string): string => `${stripTrailingSlash(getServerSideURL())}/#${fragment}`

export const brandTitle = (pageTitle: string | null | undefined): string => {
  const trimmed = pageTitle?.trim()
  if (!trimmed) return SITE_NAME
  if (trimmed.includes(SITE_NAME) || trimmed.includes(ORGANIZATION_NAME)) return trimmed
  return `${trimmed} | ${SITE_NAME}`
}
