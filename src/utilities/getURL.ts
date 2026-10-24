import canUseDOM from './canUseDOM'

/** Public production origin. Local and preview builds do not use this host. */
export const PUBLIC_SITE_URL = 'https://manufacturing.neo-lines.com'

const stripTrailingSlash = (url: string) => url.replace(/\/+$/, '')

const hostWithProtocol = (host: string) => {
  const cleaned = host.replace(/^https?:\/\//, '')
  return `https://${cleaned}`
}

/**
 * Server-side site origin.
 * Production always uses the public domain, even when the Vercel host or a
 * copied localhost NEXT_PUBLIC_SERVER_URL would otherwise become the canonical.
 * Local development keeps NEXT_PUBLIC_SERVER_URL. Preview keeps its own host.
 */
export const getServerSideURL = () => {
  if (process.env.VERCEL_ENV === 'production') return PUBLIC_SITE_URL

  const explicit = process.env.NEXT_PUBLIC_SERVER_URL
  if (explicit) return stripTrailingSlash(explicit)

  if (process.env.VERCEL_URL) return stripTrailingSlash(hostWithProtocol(process.env.VERCEL_URL))

  return 'http://localhost:3000'
}

/** Origins allowed to call the CMS. Includes the public domain and the Vercel host. */
export const getAllowedOrigins = (): string[] => {
  const origins = new Set<string>([getServerSideURL()])
  const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL
  if (vercelHost) origins.add(stripTrailingSlash(hostWithProtocol(vercelHost)))
  return [...origins].filter(Boolean)
}

export const getClientSideURL = () => {
  if (canUseDOM) {
    const protocol = window.location.protocol
    const domain = window.location.hostname
    const port = window.location.port

    return `${protocol}//${domain}${port ? `:${port}` : ''}`
  }

  return getServerSideURL()
}
