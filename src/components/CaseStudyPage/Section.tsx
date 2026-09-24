import React from 'react'

import type { CaseStudySectionId } from './sections'

import { cn } from '@/utilities/ui'

type Props = {
  children: React.ReactNode
  className?: string
  id: CaseStudySectionId
  title: string
}

/**
 * Shared shell for every structured Case Study section: anchor target, the
 * mono rule-underlined heading, and consistent vertical rhythm.
 */
export const CaseStudySection: React.FC<Props> = ({ children, className, id, title }) => {
  return (
    <section aria-labelledby={`${id}-heading`} className={cn('scroll-mt-24 pb-16', className)} id={id}>
      <h2
        className="mb-6 border-b border-border pb-3 font-mono text-[13px] font-medium text-muted-foreground"
        id={`${id}-heading`}
      >
        {title}
      </h2>
      {children}
    </section>
  )
}

/** Small mono label used above individual rich-text fields inside a section. */
export const FieldLabel: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <div className={cn('mb-2 font-mono text-[11px] tracking-wide text-muted-foreground', className)}>
    {children}
  </div>
)
