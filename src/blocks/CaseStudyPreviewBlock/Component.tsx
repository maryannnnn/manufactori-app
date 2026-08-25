import React from 'react'

import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { hasRichTextContent } from '@/utilities/richText/hasContent'

type Props = {
  case_study_preview_title?: string | null
  case_study_preview_text?: Record<string, unknown> | null
  case_study_preview_image?: unknown
}

export const CaseStudyPreviewBlock: React.FC<Props> = ({
  case_study_preview_title,
  case_study_preview_text,
  case_study_preview_image,
}) => {
  return (
    <div className="container">
      {case_study_preview_title ? (
        <h2 className="mb-4 text-2xl font-semibold">{case_study_preview_title}</h2>
      ) : null}
      {hasRichTextContent(case_study_preview_text) ? (
        <RichText data={case_study_preview_text as Record<string, unknown>} enableGutter={false} />
      ) : null}
      {case_study_preview_image && typeof case_study_preview_image === 'object' ? (
        <div className="mt-6 max-w-[48rem]">
          <Media resource={case_study_preview_image as never} size="100vw" />
        </div>
      ) : null}
    </div>
  )
}
