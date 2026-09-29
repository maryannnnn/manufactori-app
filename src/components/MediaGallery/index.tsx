import React from 'react'

import type { Media } from '@/payload-types'

import { MediaGalleryClient } from './GalleryClient'

import './gallery.css'

type Props = {
  fallbackTitle?: string | null
  headingId?: string
  images?: (number | Media | null)[] | null
  showWatermark?: boolean
  title?: string | null
}

/**
 * Shared photo gallery for Content blocks (Case Study, Posts, …).
 * The page stays a Server Component; only the grid + lightbox are client.
 */
export const MediaGallery: React.FC<Props> = ({
  fallbackTitle,
  headingId = 'media-gallery',
  images,
  showWatermark = false,
  title,
}) => {
  const items = (images ?? []).filter(
    (value): value is Media =>
      Boolean(value && typeof value === 'object' && 'id' in value && ('filename' in value || 'url' in value)),
  )
  const heading = title?.trim() || fallbackTitle || null

  if (items.length === 0) return null

  return (
    <section
      aria-labelledby={heading ? headingId : undefined}
      className="media-gallery container min-w-0 max-w-full"
    >
      {heading ? (
        <h2 className="media-gallery__title mb-6 text-xl font-semibold tracking-tight sm:text-2xl" id={headingId}>
          {heading}
        </h2>
      ) : null}
      {items.length > 0 ? <MediaGalleryClient images={items} showWatermark={showWatermark} /> : null}
    </section>
  )
}
