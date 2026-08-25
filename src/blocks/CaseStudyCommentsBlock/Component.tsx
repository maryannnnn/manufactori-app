import React from 'react'

import RichText from '@/components/RichText'
import { hasRichTextContent } from '@/utilities/richText/hasContent'

type Props = {
  case_study_comment_title?: string | null
  case_study_comment_text?: Record<string, unknown> | null
}

export const CaseStudyCommentsBlock: React.FC<Props> = ({
  case_study_comment_title,
  case_study_comment_text,
}) => {
  return (
    <div className="container">
      {case_study_comment_title ? (
        <h2 className="mb-4 text-2xl font-semibold">{case_study_comment_title}</h2>
      ) : null}
      {hasRichTextContent(case_study_comment_text) ? (
        <RichText data={case_study_comment_text as Record<string, unknown>} enableGutter={false} />
      ) : null}
    </div>
  )
}
