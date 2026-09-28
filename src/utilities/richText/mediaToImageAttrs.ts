import type { Media } from '@/payload-types'

import { resolveMediaSource } from '@/utilities/getMediaUrl'

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

const withoutCacheTag = (url: string): string => url.split('?')[0] || url

export const mediaToImageAttrs = (media: MediaLike): EditorImageAttrs | null => {
  const display = resolveMediaSource(media, ['large', 'medium', 'small'])
  if (!display.src) return null

  const full = resolveMediaSource(media, ['xlarge', 'large', 'medium'])

  return {
    src: withoutCacheTag(display.src),
    srcFull: withoutCacheTag(full.src || display.src),
    alt: media.alt || '',
    mediaId: media.id ?? null,
    align: DEFAULT_IMAGE_ALIGN,
    width: DEFAULT_IMAGE_WIDTH,
    caption: null,
  }
}
