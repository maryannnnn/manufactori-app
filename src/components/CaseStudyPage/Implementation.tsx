import React from 'react'

import type { CaseStudy } from '@/payload-types'

import { CaseStudySection, FieldLabel } from './Section'
import { RichTextField } from './RichTextField'

type Props = Pick<CaseStudy, 'implementationProcess' | 'timeline'>

export const CaseStudyImplementation: React.FC<Props> = ({ implementationProcess, timeline }) => {
  const steps = timeline?.filter((step) => step.period || step.title || step.description) ?? []

  return (
    <CaseStudySection id="implementation" title="Implementation">
      <RichTextField className="mb-8 max-w-[70ch]" value={implementationProcess} />

      {steps.length > 0 && (
        <ol className="border-t border-border">
          {steps.map((step, index) => (
            <li
              className="grid gap-2 border-b border-border py-5 md:grid-cols-[160px_1fr] md:gap-6"
              key={step.id ?? index}
            >
              {step.period ? <FieldLabel className="mb-0 md:pt-0.5">{step.period}</FieldLabel> : <span />}
              <div>
                {step.title ? (
                  <h3 className="text-[15px] font-semibold text-foreground">{step.title}</h3>
                ) : null}
                <RichTextField
                  className="mt-1 [&_p]:text-sm [&_p]:text-muted-foreground"
                  value={step.description}
                />
              </div>
            </li>
          ))}
        </ol>
      )}
    </CaseStudySection>
  )
}
