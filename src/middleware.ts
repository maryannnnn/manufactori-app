import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { LEGACY_SERVICE_REDIRECTS } from './utilities/serviceCatalog'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (pathname === '/industries' || pathname.startsWith('/industries/')) {
    const url = request.nextUrl.clone()
    url.pathname = pathname.replace(/^\/industries/, '/industrial')
    return NextResponse.redirect(url, 301)
  }

  const destination = LEGACY_SERVICE_REDIRECTS[pathname]
  if (!destination) return NextResponse.next()

  const url = request.nextUrl.clone()
  url.pathname = destination
  return NextResponse.redirect(url, 301)
}

export const config = {
  matcher: [
    '/services/marketing-strategy-roadmap',
    '/services/website-design-development-for-manufacturers',
    '/services/website/website-design-development-for-manufacturers',
    '/services/seo-ai-search-optimization',
    '/services/ai-search-optimization-manufacturers',
    '/services/search/ai-search-optimization-manufacturers',
    '/services/lead-generation',
    '/services/paid-media/lead-generation',
    '/services/technical-content-thought-leadership',
    '/services/content/technical-content-thought-leadership',
    '/services/sales-enablement-crm',
    '/services/sales/sales-enablement-crm',
    '/industries',
    '/industries/:path*',
  ],
}
