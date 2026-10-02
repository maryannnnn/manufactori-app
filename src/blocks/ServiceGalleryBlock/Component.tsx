import React from 'react'

import type { ServiceGalleryBlock as ServiceGalleryBlockProps } from '@/payload-types'

import { MediaGallery } from '@/components/MediaGallery'

type Props = ServiceGalleryBlockProps

const FALLBACK_TITLE = 'Gallery'

export const ServiceGalleryBlock: React.FC<Props> = ({
  id,
  service_gallery_images,
  service_gallery_title,
}) => {
  return (
    <MediaGallery
      fallbackTitle={FALLBACK_TITLE}
      headingId={id ? `service-gallery-${id}` : 'service-gallery'}
      images={service_gallery_images}
      title={service_gallery_title}
    />
  )
}
