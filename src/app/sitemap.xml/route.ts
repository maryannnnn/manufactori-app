import { NextResponse } from 'next/server'

import { getPublicSitemap, renderPublicSitemap } from '@/utilities/buildPublicSitemap'

export async function GET() {
  const entries = await getPublicSitemap()

  return new NextResponse(renderPublicSitemap(entries), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
