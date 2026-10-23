import canUseDOM from './canUseDOM'

const stripTrailingSlash = (url: string) => url.replace(/\/+$/, '')

const hostWithProtocol = (host: string) => {
  const cleaned = host.replace(/^https?:\/\//, '')
  return `https://${cleaned}`
}

const isLocalHost = (url: string) => /localhost|127\.0\.0\.1/i.test(url)

export const getServerSideURL = () => {
  const explicit = process.env.NEXT_PUBLIC_SERVER_URL
  const vercelProductionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL

  if (process.env.VERCEL_ENV === 'production' && vercelProductionHost) {
    if (explicit && !isLocalHost(explicit)) return stripTrailingSlash(explicit)
    return stripTrailingSlash(hostWithProtocol(vercelProductionHost))
  }

  if (explicit) return stripTrailingSlash(explicit)

  if (vercelProductionHost) return stripTrailingSlash(hostWithProtocol(vercelProductionHost))

  return 'http://localhost:3000'
}

export const getClientSideURL = () => {
  if (canUseDOM) {
    const protocol = window.location.protocol
    const domain = window.location.hostname
    const port = window.location.port

    return `${protocol}//${domain}${port ? `:${port}` : ''}`
  }

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  }

  return process.env.NEXT_PUBLIC_SERVER_URL || ''
}
