import React from 'react'

import type { CaseStudyGalleryBlock as CaseStudyGalleryBlockProps } from '@/payload-types'

import { MediaGallery } from '@/components/MediaGallery'

type Props = CaseStudyGalleryBlockProps

const FALLBACK_TITLE = 'Gallery'

export const CaseStudyGalleryBlock: React.FC<Props> = ({
  case_study_gallery_images,
  case_study_gallery_title,
  id,
}) => {
  return (
    <MediaGallery
      fallbackTitle={FALLBACK_TITLE}
      headingId={id ? `case-study-gallery-${id}` : 'case-study-gallery'}
      images={case_study_gallery_images}
      showWatermark
      title={case_study_gallery_title}
    />
  )
}
