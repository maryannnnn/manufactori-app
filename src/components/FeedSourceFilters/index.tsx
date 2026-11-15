import Link from 'next/link'
import React from 'react'

import { buildCaseStudyArchiveUrl } from '@/utilities/caseStudyArchiveUrl'
import { cn } from '@/utilities/ui'

type FilterOption = {
  value: string
  label: string
}

type Props = {
  archivePath: string
  className?: string
  label?: string
  limit?: number
  options: readonly FilterOption[]
  search?: string
  source?: string
}

export const FeedSourceFilters: React.FC<Props> = ({
  archivePath,
  className,
  label = 'Filter by source',
  limit,
  options,
  search,
  source = 'all',
}) => {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </p>
      <div className="flex flex-wrap gap-2" role="group" aria-label={label}>
        {options.map((option) => {
          const active = option.value === source
          const href = buildCaseStudyArchiveUrl(archivePath, {
            search,
            source: option.value,
            limit,
            page: 1,
          })
          return (
            <Link
              aria-current={active ? 'true' : undefined}
              className={cn(
                'inline-flex h-9 items-center rounded-[2px] border px-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring',
                active
                  ? 'border-cta bg-cta/10 text-foreground'
                  : 'border-border text-muted-foreground hover:border-cta hover:text-link',
              )}
              href={href}
              key={option.value}
            >
              {option.label}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
