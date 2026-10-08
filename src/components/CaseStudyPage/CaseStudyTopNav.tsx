import React from 'react'

import { Breadcrumbs, type BreadcrumbItem } from '@/components/Breadcrumbs'

type Props = {
  items: BreadcrumbItem[]
  mark?: string | null
}

export const CaseStudyTopNav: React.FC<Props> = ({ items, mark }) => (
  <div className="flex items-center justify-between gap-4 py-5">
    <Breadcrumbs items={items} />
    {mark ? <span className="font-mono text-xs text-muted-foreground">{mark}</span> : null}
  </div>
)
