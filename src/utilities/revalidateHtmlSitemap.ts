import { revalidatePath, revalidateTag } from 'next/cache'

export const HTML_SITEMAP_PATH = '/sitemap'
export const HTML_SITEMAP_CACHE_TAG = 'html-sitemap'

export const revalidateHtmlSitemap = () => {
  try {
    revalidatePath(HTML_SITEMAP_PATH)
  } catch {
    // Scripts / nested ops outside a Next.js request.
  }

  try {
    revalidateTag(HTML_SITEMAP_CACHE_TAG, 'max')
  } catch {
    // Scripts / nested ops outside a Next.js request.
  }
}
