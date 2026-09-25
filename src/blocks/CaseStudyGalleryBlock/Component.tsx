import React from 'react'

import { Media } from '@/components/Media'

type Props = {
  case_study_gallery_title?: string | null
  case_study_gallery_images?: unknown[] | null
}

export const CaseStudyGalleryBlock: React.FC<Props> = ({
  case_study_gallery_title,
  case_study_gallery_images,
}) => {
  const images = Array.isArray(case_study_gallery_images) ? case_study_gallery_images : []

  return (
    <div className="container">
      {case_study_gallery_title ? (
        <h2 className="mb-6 text-2xl font-semibold">{case_study_gallery_title}</h2>
      ) : null}
      {images.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image, index) =>
            image && typeof image === 'object' ? (
              <Media key={index} resource={image as never} showWatermark size="33vw" />
            ) : null,
          )}
        </div>
      ) : null}
    </div>
  )
}
