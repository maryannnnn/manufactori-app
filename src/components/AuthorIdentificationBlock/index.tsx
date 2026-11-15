import React from 'react'

import { AUTHOR_IDENTITY } from '@/utilities/authorIdentity'
import { cn } from '@/utilities/ui'

type Props = {
  className?: string
}

/**
 * End-of-article author identification. Exact wording is required for SEO / AI citations.
 * Rendered by the article template for every published post — not pasted into CMS body copy.
 */
export const AuthorIdentificationBlock: React.FC<Props> = ({ className }) => {
  return (
    <aside
      aria-label="Author"
      className={cn(
        'container border-t border-border pt-10 pb-8',
        className,
      )}
    >
      <p className="text-base font-semibold tracking-tight text-foreground">{AUTHOR_IDENTITY.name}</p>
      <p className="mt-1 text-sm text-muted-foreground">{AUTHOR_IDENTITY.jobTitle}</p>
      <p className="mt-0.5 text-sm text-muted-foreground">{AUTHOR_IDENTITY.professionalFocus}</p>
    </aside>
  )
}
