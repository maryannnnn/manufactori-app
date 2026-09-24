import React from 'react'

import type { CaseStudy } from '@/payload-types'

import { hasRichTextContent } from '@/utilities/richText/hasContent'

import { CaseStudySection, FieldLabel } from './Section'
import { RichTextField } from './RichTextField'

type Props = {
  challenge: NonNullable<CaseStudy['businessChallenge']>
}

/**
 * Initial state -> challenge -> goals as a connected track. The connector is a
 * pseudo-element on each step, so it disappears automatically when the steps
 * stack on mobile.
 */
export const CaseStudyChallenge: React.FC<Props> = ({ challenge }) => {
  const steps = [
    { label: 'Initial State', value: challenge.initialState },
    { label: 'Challenge', value: challenge.challenge },
    { label: 'Goals', value: challenge.goals },
  ].filter((step) => hasRichTextContent(step.value))

  if (steps.length === 0) return null

  return (
    <CaseStudySection id="challenge" title="Business Challenge">
      <div className="grid gap-6 md:grid-cols-3 md:gap-0">
        {steps.map(({ label, value }, index) => (
          <div
            className="relative md:pr-6 md:after:absolute md:after:top-[9px] md:after:right-0 md:after:h-px md:after:w-6 md:after:bg-border md:last:after:hidden"
            key={label}
          >
            <div aria-hidden className="mb-3.5 h-2 w-2 rounded-full bg-primary" />
            <FieldLabel>{`0${index + 1} — ${label}`}</FieldLabel>
            <RichTextField className="[&_p]:text-sm [&_p]:text-foreground" value={value} />
          </div>
        ))}
      </div>
    </CaseStudySection>
  )
}
