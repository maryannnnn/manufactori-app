import React from 'react'

import type { CaseStudy } from '@/payload-types'

import { hasRichTextContent } from '@/utilities/richText/hasContent'

import { CaseStudySection } from './Section'
import { RichTextField } from './RichTextField'

type Props = Pick<CaseStudy, 'digitalEcosystem' | 'semanticArchitecture' | 'websiteArchitecture'>

export const CaseStudyArchitecture: React.FC<Props> = ({
  digitalEcosystem,
  semanticArchitecture,
  websiteArchitecture,
}) => {
  const columns = [
    { label: 'Website Architecture', value: websiteArchitecture },
    { label: 'Semantic Architecture', value: semanticArchitecture },
  ].filter((column) => hasRichTextContent(column.value))

  return (
    <CaseStudySection id="architecture" title="Digital Architecture">
      <RichTextField
        className="mb-8 max-w-[70ch]"
        label="Digital Ecosystem"
        value={digitalEcosystem}
      />

      {columns.length > 0 && (
        <div className="grid gap-8 md:grid-cols-2 md:gap-10">
          {columns.map(({ label, value }) => (
            <RichTextField key={label} label={label} value={value} />
          ))}
        </div>
      )}
    </CaseStudySection>
  )
}
