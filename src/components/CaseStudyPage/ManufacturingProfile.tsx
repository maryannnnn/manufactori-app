import React from 'react'

import type { CaseStudy } from '@/payload-types'

import { CaseStudySection } from './Section'
import { RichTextField } from './RichTextField'

type Props = {
  profile: NonNullable<CaseStudy['manufacturingProfile']>
}

export const CaseStudyProfile: React.FC<Props> = ({ profile }) => {
  const columns = [
    { label: 'Production Capabilities', value: profile.productionCapabilities },
    { label: 'Products', value: profile.products },
    { label: 'Materials', value: profile.materials },
    { label: 'Applications', value: profile.applications },
  ]

  return (
    <CaseStudySection id="profile" title="Manufacturing Profile">
      <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
        {columns.map(({ label, value }) => (
          <RichTextField key={label} label={label} value={value} />
        ))}
      </div>
    </CaseStudySection>
  )
}
