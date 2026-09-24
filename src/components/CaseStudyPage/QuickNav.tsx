import React from 'react'

import type { CaseStudySectionId } from './sections'

import { CASE_STUDY_SECTIONS } from './sections'

type Props = {
  sections: CaseStudySectionId[]
}

/**
 * Fixed section rail. Desktop-only by design: it uses the wide-viewport gutter
 * that would otherwise be empty, and on small screens the page is read linearly.
 */
export const CaseStudyQuickNav: React.FC<Props> = ({ sections }) => {
  if (sections.length < 2) return null

  return (
    <nav
      aria-label="Case study sections"
      className="pointer-events-none fixed top-1/2 right-6 z-30 hidden -translate-y-1/2 flex-col gap-3.5 xl:flex"
    >
      {sections.map((id) => (
        <a
          className="pointer-events-auto group flex items-center justify-end gap-2 font-mono text-[11px] text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:text-primary"
          href={`#${id}`}
          key={id}
        >
          {CASE_STUDY_SECTIONS[id]}
          <span
            aria-hidden
            className="h-[7px] w-[7px] shrink-0 rounded-full border-[1.5px] border-current transition-colors group-hover:bg-current"
          />
        </a>
      ))}
    </nav>
  )
}
