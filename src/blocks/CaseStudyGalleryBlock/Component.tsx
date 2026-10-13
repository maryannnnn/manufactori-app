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
  const heading = case_study_gallery_title?.trim()

  return (
    <MediaGallery
      fallbackTitle={heading ? FALLBACK_TITLE : null}
      headingId={id ? `case-study-gallery-${id}` : 'case-study-gallery'}
      images={case_study_gallery_images}
      showWatermark
      title={heading || null}
    />
  )
}
