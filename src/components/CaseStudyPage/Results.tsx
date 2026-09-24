import Link from 'next/link'
import React from 'react'

import type { CaseStudy } from '@/payload-types'

import { Media } from '@/components/Media'

import { CaseStudySection } from './Section'
import { RichTextField } from './RichTextField'

type Props = Pick<CaseStudy, 'projectsShowcase' | 'resultsSummary'>

export const CaseStudyResults: React.FC<Props> = ({ projectsShowcase, resultsSummary }) => {
  const projects = projectsShowcase ?? []

  return (
    <CaseStudySection id="results" title="Results">
      <RichTextField className="mb-7 max-w-[70ch]" value={resultsSummary} />

      {projects.length > 0 && (
        <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-3">
          {projects.map((project, index) => (
            <ShowcaseItem key={project.id ?? index} project={project} />
          ))}
        </div>
      )}
    </CaseStudySection>
  )
}

const ShowcaseItem: React.FC<{
  project: NonNullable<CaseStudy['projectsShowcase']>[number]
}> = ({ project }) => {
  const image = project.image
  const hasImage = image && typeof image === 'object'

  const body = (
    <>
      <div className="relative aspect-[4/3] overflow-hidden bg-accent">
        {hasImage ? (
          <Media
            className="h-full w-full"
            imgClassName="h-full w-full object-cover"
            resource={image}
            size="(max-width: 1024px) 50vw, 33vw"
          />
        ) : null}
      </div>
      <div className="p-3">
        <div className="font-mono text-[11px] text-muted-foreground">{project.projectName}</div>
        <RichTextField
          className="mt-1 [&_p]:mb-0 [&_p]:text-xs [&_p]:text-muted-foreground"
          value={project.description}
        />
      </div>
    </>
  )

  const className =
    'flex flex-col overflow-hidden rounded-[2px] border border-border bg-card transition-colors'

  if (project.url) {
    return (
      <Link
        className={`${className} hover:border-foreground/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`}
        href={project.url}
      >
        {body}
      </Link>
    )
  }

  return <div className={className}>{body}</div>
}
