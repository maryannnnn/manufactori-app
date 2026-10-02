'use client'

import React from 'react'

import { ArchiveSearch } from '@/components/ArchiveSearch'
import { CASE_STUDIES_ARCHIVE_PATH } from '@/utilities/getContentUrls'

type Props = {
  className?: string
  initialValue?: string
}

export const CaseStudySearch: React.FC<Props> = (props) => {
  return (
    <ArchiveSearch
      archivePath={CASE_STUDIES_ARCHIVE_PATH}
      inputId="case-study-search"
      label="Search case studies"
      placeholder="Search case studies"
      {...props}
    />
  )
}
