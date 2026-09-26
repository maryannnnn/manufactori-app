import type { SlideImage } from 'yet-another-react-lightbox'

import type { Media } from '@/payload-types'
import { resolveMediaSource } from '@/utilities/getMediaUrl'
import { getRichTextPlainText } from '@/utilities/richText/getPlainText'

export type GallerySlide = SlideImage & {
  resource: Media
}

export const isPopulatedMedia = (value: unknown): value is Media =>
  Boolean(value && typeof value === 'object' && 'id' in value && ('filename' in value || 'url' in value))

export const buildGallerySlides = (images: Media[]): GallerySlide[] =>
  images.map((image, index) => {
    const large = resolveMediaSource(image, ['xlarge', 'large', 'medium'])
    const thumb = resolveMediaSource(image, ['medium', 'small', 'thumbnail'])
    const caption = getRichTextPlainText(image.caption)

    return {
      src: large.src,
      alt: image.alt?.trim() || `Gallery image ${index + 1}`,
      width: large.width,
      height: large.height,
      srcSet: [
        { src: thumb.src, width: thumb.width ?? 600, height: thumb.height ?? 400 },
        { src: large.src, width: large.width ?? 1920, height: large.height ?? 1080 },
      ],
      description: caption || undefined,
      resource: image,
    }
  })
