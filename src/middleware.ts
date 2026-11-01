import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { LEGACY_SERVICE_REDIRECTS } from './utilities/serviceCatalog'

export function middleware(request: NextRequest) {
  const destination = LEGACY_SERVICE_REDIRECTS[request.nextUrl.pathname]
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
  ],
}
