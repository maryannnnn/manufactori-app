import React from 'react'

import type { CaseStudyCardData } from '@/components/CaseStudyCard'

import { CaseStudyCard } from '@/components/CaseStudyCard'
import { cn } from '@/utilities/ui'

export type { CaseStudyCardData }

type Props = {
  className?: string
  docs: CaseStudyCardData[]
}

/**
 * Case Study grid shared by the /case-study listing and the category archives.
 * One column on mobile, two on tablet, three from the large breakpoint.
 */
export const CaseStudyArchive: React.FC<Props> = ({ className, docs }) => {
  return (
    <div className={cn('container', className)}>
      <div className="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-12 lg:gap-8">
        {docs.map((doc, index) => (
          <div className="col-span-4" key={doc.slug ?? index}>
            <CaseStudyCard doc={doc} />
          </div>
        ))}
      </div>
    </div>
  )
}
