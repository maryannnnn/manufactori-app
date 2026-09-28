import type { Media } from '@/payload-types'

export type PayloadImageSize = keyof NonNullable<Media['sizes']>

const IMAGE_FILE_EXT = /\.(?:jpe?g|png|gif|webp|avif|svg)$/i
const SIZE_FALLBACK_ORDER: PayloadImageSize[] = [
  'medium',
  'small',
  'large',
  'og',
  'thumbnail',
  'square',
  'xlarge',
]

export type ResolvedMediaSource = {
  src: string
  width?: number
  height?: number
}

export const hasImageFileExtension = (filename?: string | null): boolean => {
  if (!filename) return false
  const path = filename.split('?')[0] || ''
  return IMAGE_FILE_EXT.test(path)
}

const encodeMediaFilename = (filename: string): string => {
  return filename
    .split('/')
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join('/')
}

const safeDecodeURIComponent = (value: string): string => {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

/**
 * Public path for a file in `public/media`.
 * Encodes spaces and unicode so Vercel / next/image can fetch the static file.
 */
export const getPublicMediaPath = (filename?: string | null): string | null => {
  if (!filename) return null
  const trimmed = filename.replace(/^\/media\//, '').replace(/^\/api\/media\/file\//, '')
  return `/media/${encodeMediaFilename(trimmed)}`
}

/** Turn Payload API file URLs into Git-tracked `/media/...` static paths. */
export const toStaticMediaUrl = (url?: string | null): string | null => {
  if (!url) return null

  const [path, query] = url.split('?')
  if (!path) return url

  const asPublic = (filename: string) => {
    const publicPath = getPublicMediaPath(safeDecodeURIComponent(filename))
    return query ? `${publicPath}?${query}` : publicPath
  }

  try {
    if (/^https?:\/\//i.test(path)) {
      const parsed = new URL(url)
      if (parsed.pathname.startsWith('/api/media/file/')) {
        return asPublic(parsed.pathname.replace(/^\/api\/media\/file\//, ''))
      }
      if (parsed.pathname.startsWith('/media/')) {
        return asPublic(parsed.pathname.replace(/^\/media\//, ''))
      }
      return url
    }
  } catch {
    return url
  }

  if (path.startsWith('/api/media/file/')) {
    return asPublic(path.replace(/^\/api\/media\/file\//, ''))
  }

  if (path.startsWith('/media/')) {
    return asPublic(path.replace(/^\/media\//, ''))
  }

  return url
}

const sourceFromSize = (
  resource: Pick<Media, 'updatedAt' | 'width' | 'height'>,
  sized: NonNullable<Media['sizes']>[PayloadImageSize],
): ResolvedMediaSource | null => {
  if (!sized) return null

  const fromFilename =
    sized.filename && hasImageFileExtension(sized.filename) ? getPublicMediaPath(sized.filename) : null
  const fromUrl = toStaticMediaUrl(sized.url)
  const srcPath =
    fromFilename || (fromUrl && hasImageFileExtension(fromUrl.split('?')[0] || fromUrl) ? fromUrl : null)

  if (!srcPath) return null

  const src = getMediaUrl(srcPath, resource.updatedAt)
  if (!src) return null

  return {
    src,
    width: sized.width ?? resource.width ?? undefined,
    height: sized.height ?? resource.height ?? undefined,
  }
}

/**
 * Pick a Payload-generated size when it exists, otherwise the original file.
 * Originals uploaded without a real image extension (spaces, ".Wood", etc.)
 * are skipped in favor of the generated `.jpg` sizes that Git already tracks.
 */
export const resolveMediaSource = (
  resource: Pick<Media, 'filename' | 'url' | 'width' | 'height' | 'updatedAt' | 'sizes'>,
  prefer?: PayloadImageSize | PayloadImageSize[] | null,
): ResolvedMediaSource => {
  const preferred = prefer == null ? [] : Array.isArray(prefer) ? prefer : [prefer]
  const searchOrder: PayloadImageSize[] = [
    ...preferred,
    ...(hasImageFileExtension(resource.filename) ? [] : SIZE_FALLBACK_ORDER),
  ]

  const seen = new Set<PayloadImageSize>()
  for (const name of searchOrder) {
    if (seen.has(name)) continue
    seen.add(name)
    const resolved = sourceFromSize(resource, resource.sizes?.[name])
    if (resolved) return resolved
  }

  return {
    src: getMediaUrl(
      getPublicMediaPath(resource.filename) || toStaticMediaUrl(resource.url),
      resource.updatedAt,
    ),
    width: resource.width ?? undefined,
    height: resource.height ?? undefined,
  }
}

export const rewriteMediaSrcsInHtml = (html: string): string =>
  html.replace(
    /\b(src|data-full-src|data-src)="([^"]+)"/g,
    (_match, attr: string, value: string) => `${attr}="${toStaticMediaUrl(value) || value}"`,
  )

export const getMediaUrl = (url: string | null | undefined, cacheTag?: string | null): string => {
  if (!url) return ''

  const staticUrl = toStaticMediaUrl(url) || url

  if (cacheTag && cacheTag !== '') {
    cacheTag = encodeURIComponent(cacheTag)
  }

  if (!cacheTag) return staticUrl
  return staticUrl.includes('?') ? `${staticUrl}&${cacheTag}` : `${staticUrl}?${cacheTag}`
}
