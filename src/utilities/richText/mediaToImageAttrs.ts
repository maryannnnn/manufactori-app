import type { Media } from '@/payload-types'

import {
  DEFAULT_IMAGE_ALIGN,
  DEFAULT_IMAGE_WIDTH,
  type EditorImageAttrs,
} from './imageTypes'

type MediaLike = Partial<Media> & {
  id?: string | number
  url?: string | null
  thumbnailURL?: string | null
  filename?: string | null
  alt?: string | null
  sizes?: Media['sizes']
}

const firstUrl = (...candidates: Array<string | null | undefined>): string | null => {
  return candidates.find((value) => typeof value === 'string' && value.length > 0) || null
}

export const mediaToImageAttrs = (media: MediaLike): EditorImageAttrs | null => {
  const src = firstUrl(
    media.sizes?.large?.url,
    media.sizes?.medium?.url,
    media.url,
    media.thumbnailURL,
    media.filename ? `/media/${media.filename}` : null,
  )

  if (!src) return null

  const srcFull = firstUrl(media.sizes?.xlarge?.url, media.url, src)

  return {
    src,
    srcFull,
    alt: media.alt || '',
    mediaId: media.id ?? null,
    align: DEFAULT_IMAGE_ALIGN,
    width: DEFAULT_IMAGE_WIDTH,
    caption: null,
  }
}
