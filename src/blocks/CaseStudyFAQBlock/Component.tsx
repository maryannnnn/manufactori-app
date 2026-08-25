import React from 'react'

import RichText from '@/components/RichText'
import { hasRichTextContent } from '@/utilities/richText/hasContent'

type Props = {
  case_study_faq_title?: string | null
  case_study_faq_text?: Record<string, unknown> | null
}

export const CaseStudyFAQBlock: React.FC<Props> = ({
  case_study_faq_title,
  case_study_faq_text,
}) => {
  return (
    <div className="container">
      {case_study_faq_title ? (
        <h2 className="mb-4 text-2xl font-semibold">{case_study_faq_title}</h2>
      ) : null}
      {hasRichTextContent(case_study_faq_text) ? (
        <RichText data={case_study_faq_text as Record<string, unknown>} enableGutter={false} />
      ) : null}
    </div>
  )
}
