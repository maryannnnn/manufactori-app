import React from 'react'

import type { CaseStudy } from '@/payload-types'

import { RichTextField } from './RichTextField'

type Props = {
  metrics: NonNullable<CaseStudy['metrics']>
}

/**
 * Hairline-separated metric strip. The 1px grid gap over a border-coloured
 * background produces the dividers, which keeps it to one element per metric.
 */
export const CaseStudyMetrics: React.FC<Props> = ({ metrics }) => {
  return (
    <section aria-label="Key results" className="mb-16">
      <div className="grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
        {metrics.map((metric, index) => (
          <div className="bg-card p-5" key={metric.id ?? index}>
            <div className="font-mono text-[clamp(1.6rem,3vw,2.25rem)] leading-tight font-semibold tabular-nums text-primary">
              {metric.value}
            </div>
            <div className="mt-1 text-sm font-semibold text-foreground">{metric.label}</div>
            <RichTextField
              className="mt-1 text-xs [&_p]:mb-0 [&_p]:text-xs [&_p]:text-muted-foreground"
              value={metric.description}
            />
          </div>
        ))}
      </div>
    </section>
  )
}
