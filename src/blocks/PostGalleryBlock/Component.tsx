import React from 'react'

import type { PostGalleryBlock as PostGalleryBlockProps } from '@/payload-types'

import { MediaGallery } from '@/components/MediaGallery'

type Props = PostGalleryBlockProps

export const PostGalleryBlock: React.FC<Props> = ({ id, postGalleryImages, postGalleryTitle }) => {
  return (
    <MediaGallery
      headingId={id ? `post-gallery-${id}` : 'post-gallery'}
      images={postGalleryImages}
      title={postGalleryTitle}
    />
  )
}
