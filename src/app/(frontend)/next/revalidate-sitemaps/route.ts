import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

import { INDUSTRIES_ARCHIVE_PATH } from '@/utilities/getContentUrls'
import { HTML_SITEMAP_CACHE_TAG, HTML_SITEMAP_PATH } from '@/utilities/revalidateHtmlSitemap'

/**
 * One-shot cache bust for local scripts that write Industries with disableRevalidate.
 * Protected by PREVIEW_SECRET.
 */
export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('previewSecret')
  if (!secret || secret !== process.env.PREVIEW_SECRET) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  revalidateTag('industries-sitemap', 'max')
  revalidateTag('pages-sitemap', 'max')
  revalidateTag(HTML_SITEMAP_CACHE_TAG, 'max')
  revalidatePath('/sitemap.xml')
  revalidatePath(HTML_SITEMAP_PATH)
  revalidatePath(INDUSTRIES_ARCHIVE_PATH)
  revalidatePath(`${INDUSTRIES_ARCHIVE_PATH}/[slug]`, 'page')
  revalidatePath(`${INDUSTRIES_ARCHIVE_PATH}/[slug]/[child]`, 'page')

  return NextResponse.json({ ok: true })
}
