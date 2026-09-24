import React from 'react'

import type { CaseStudy } from '@/payload-types'

import { CaseStudySection } from './Section'
import { RichTextField } from './RichTextField'

type Props = {
  insight: CaseStudy['expertInsight']
}

export const CaseStudyInsight: React.FC<Props> = ({ insight }) => {
  return (
    <CaseStudySection id="insight" title="Expert Insight">
      <div className="border-l-2 border-primary bg-card px-7 py-7 md:px-8">
        <RichTextField
          className="max-w-[64ch] [&_p]:text-lg [&_p]:leading-snug [&_p]:font-medium [&_p]:text-foreground [&_p:last-child]:mb-0"
          value={insight}
        />
      </div>
    </CaseStudySection>
  )
}
