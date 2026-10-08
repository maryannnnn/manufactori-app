import Link from 'next/link'
import React from 'react'

import { CaseStudyCard, type CaseStudyCardData } from '@/components/CaseStudyCard'
import { CASE_STUDIES_ARCHIVE_PATH } from '@/utilities/getContentUrls'

type Props = {
  docs: CaseStudyCardData[]
}

export const HomeCaseStudies: React.FC<Props> = ({ docs }) => {
  if (docs.length === 0) return null

  return (
    <section className="border-b border-border py-16 md:py-20">
      <div className="container mb-10">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          Selected Case Studies
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
          Real projects across manufacturing, engineering and industrial markets.
        </p>
      </div>
      <div className="container">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {docs.map((doc, index) => (
            <CaseStudyCard
              ctaLabel="Read Case Study"
              doc={doc}
              key={doc.slug ?? index}
            />
          ))}
        </div>
        <Link
          className="mt-8 inline-flex font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          href={CASE_STUDIES_ARCHIVE_PATH}
        >
          View all case studies
        </Link>
      </div>
    </section>
  )
}
