import React from 'react'

type Props = {
  case_study_content_title?: string | null
}

export const CaseStudyContentTitleBlock: React.FC<Props> = ({ case_study_content_title }) => {
  if (!case_study_content_title) return null

  return (
    <div className="container">
      <h2 className="text-2xl font-semibold tracking-tight">{case_study_content_title}</h2>
    </div>
  )
}
