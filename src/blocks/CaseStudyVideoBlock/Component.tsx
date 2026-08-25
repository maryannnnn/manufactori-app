import React from 'react'

import RichText from '@/components/RichText'
import { hasRichTextContent } from '@/utilities/richText/hasContent'

type Props = {
  case_study_video_title?: string | null
  case_study_video_description?: Record<string, unknown> | null
  case_study_video_code?: string | null
}

export const CaseStudyVideoBlock: React.FC<Props> = ({
  case_study_video_title,
  case_study_video_description,
  case_study_video_code,
}) => {
  return (
    <div className="container">
      {case_study_video_title ? (
        <h2 className="mb-4 text-2xl font-semibold">{case_study_video_title}</h2>
      ) : null}
      {hasRichTextContent(case_study_video_description) ? (
        <div className="mb-6">
          <RichText
            data={case_study_video_description as Record<string, unknown>}
            enableGutter={false}
          />
        </div>
      ) : null}
      {case_study_video_code ? (
        <div
          className="aspect-video w-full overflow-hidden [&_iframe]:h-full [&_iframe]:w-full"
          dangerouslySetInnerHTML={{ __html: case_study_video_code }}
        />
      ) : null}
    </div>
  )
}
