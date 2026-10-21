import Link from 'next/link'
import React from 'react'

import type { CaseStudy, Media as MediaType } from '@/payload-types'

import { Media } from '@/components/Media'
import { hasRichTextContent } from '@/utilities/richText/hasContent'

import { CaseStudySection } from './Section'
import { RichTextField } from './RichTextField'

type ShowcaseProject = NonNullable<CaseStudy['projectsShowcase']>[number]
type Props = Pick<CaseStudy, 'projectsShowcase' | 'resultsSummary'>

const usableImage = (image: ShowcaseProject['image']): MediaType | null => {
  if (!image || typeof image !== 'object') return null
  if (!image.url && !image.filename) return null
  return image
}

/** A card is shown when it has a real image or written content. A title over an empty frame is not shown. */
const visibleProjects = (projects: CaseStudy['projectsShowcase']): ShowcaseProject[] =>
  (projects ?? []).filter(
    (project) => Boolean(usableImage(project.image)) || hasRichTextContent(project.description),
  )

export const caseStudyHasResults = ({
  projectsShowcase,
  resultsSummary,
}: Props): boolean =>
  hasRichTextContent(resultsSummary) || visibleProjects(projectsShowcase).length > 0

export const CaseStudyResults: React.FC<Props> = ({ projectsShowcase, resultsSummary }) => {
  const projects = visibleProjects(projectsShowcase)
  if (!hasRichTextContent(resultsSummary) && projects.length === 0) return null

  return (
    <CaseStudySection id="results" title="Results">
      <RichTextField className="max-w-[70ch]" value={resultsSummary} />

      {projects.length > 0 && (
        <div className="mt-7 grid min-w-0 grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
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
  const image = usableImage(project.image)

  const body = (
    <>
      {image ? (
        <div className="relative aspect-[4/3] overflow-hidden bg-accent">
          <Media
            className="h-full w-full"
            fill
            imgClassName="h-full w-full object-cover"
            resource={image}
            showWatermark
            size="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      ) : null}
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
    'flex min-w-0 flex-col overflow-hidden rounded-[2px] border border-border bg-card transition-colors'

  if (project.url) {
    return (
      <Link
        className={`${className} hover:border-cta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring`}
        href={project.url}
      >
        {body}
      </Link>
    )
  }

  return <div className={className}>{body}</div>
}
