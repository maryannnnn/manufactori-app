import type { Media } from '@/payload-types'

/**
 * Processes media resource URL to ensure proper formatting
 * @param url The original URL from the resource
 * @param cacheTag Optional cache tag to append to the URL
 * @returns Properly formatted URL with cache tag if provided
 *
 * Local paths (e.g. `/api/media/file/image.webp`) are kept relative so
 * Next.js image optimization treats them as local rather than fetching
 * through `remotePatterns`, which blocks private IPs since Next.js 16.
 */
/** Public path for a file in `public/media`, which Vercel serves as a static asset. */
export const getPublicMediaPath = (filename?: string | null): string | null => {
  if (!filename) return null
  return `/media/${filename}`
}

export type PayloadImageSize = keyof NonNullable<Media['sizes']>

export type ResolvedMediaSource = {
  src: string
  width?: number
  height?: number
}

/**
 * Pick a Payload-generated size when it exists, otherwise the original file.
 * Used by ImageMedia so gallery thumbs and lightbox slides stay on the
 * existing Media renderer instead of a second image pipeline.
 */
export const resolveMediaSource = (
  resource: Pick<Media, 'filename' | 'url' | 'width' | 'height' | 'updatedAt' | 'sizes'>,
  prefer?: PayloadImageSize | PayloadImageSize[] | null,
): ResolvedMediaSource => {
  const order = prefer == null ? [] : Array.isArray(prefer) ? prefer : [prefer]

  for (const name of order) {
    const sized = resource.sizes?.[name]
    if (sized?.filename || sized?.url) {
      return {
        src: getMediaUrl(getPublicMediaPath(sized.filename) || sized.url, resource.updatedAt),
        width: sized.width ?? resource.width ?? undefined,
        height: sized.height ?? resource.height ?? undefined,
      }
    }
  }

  return {
    src: getMediaUrl(getPublicMediaPath(resource.filename) || resource.url, resource.updatedAt),
    width: resource.width ?? undefined,
    height: resource.height ?? undefined,
  }
}

export const getMediaUrl = (url: string | null | undefined, cacheTag?: string | null): string => {
  if (!url) return ''

  if (cacheTag && cacheTag !== '') {
    cacheTag = encodeURIComponent(cacheTag)
  }

  return cacheTag ? `${url}?${cacheTag}` : url
}
