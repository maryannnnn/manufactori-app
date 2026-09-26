import React from 'react'

import type { Media } from '@/payload-types'

import { MediaGalleryClient } from './GalleryClient'

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
    <section aria-labelledby={heading ? headingId : undefined} className="container">
      {heading ? (
        <h2 className="mb-6 text-2xl font-semibold tracking-tight" id={headingId}>
          {heading}
        </h2>
      ) : null}
      {items.length > 0 ? <MediaGalleryClient images={items} showWatermark={showWatermark} /> : null}
    </section>
  )
}
