import { NextResponse } from 'next/server'

import { getServerSideURL } from '@/utilities/getURL'

export function GET() {
  const base = getServerSideURL()
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap><loc>${base}/pages-sitemap.xml</loc></sitemap>
  <sitemap><loc>${base}/posts-sitemap.xml</loc></sitemap>
  <sitemap><loc>${base}/services-sitemap.xml</loc></sitemap>
  <sitemap><loc>${base}/case-studies-sitemap.xml</loc></sitemap>
</sitemapindex>`

  return new NextResponse(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
