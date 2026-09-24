import Link from 'next/link'
import React from 'react'

type Props = {
  backHref: string
  backLabel: string
  mark?: string | null
}

export const CaseStudyTopNav: React.FC<Props> = ({ backHref, backLabel, mark }) => (
  <div className="flex items-center justify-between gap-4 py-5 font-mono text-xs">
    <Link
      className="text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      href={backHref}
    >
      ← {backLabel}
    </Link>
    {mark ? <span className="text-muted-foreground">{mark}</span> : null}
  </div>
)
