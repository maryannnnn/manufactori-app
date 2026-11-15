import Link from 'next/link'
import React from 'react'

import { buildCaseStudyArchiveUrl } from '@/utilities/caseStudyArchiveUrl'
import { cn } from '@/utilities/ui'

type Props = {
  basePath: string
  className?: string
  limit?: number
  page: number
  search?: string
  source?: string
  totalPages: number
}

const pageClass = (active?: boolean) =>
  cn(
    'inline-flex h-9 min-w-9 items-center justify-center rounded-[2px] border px-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring',
    active
      ? 'border-cta bg-cta/10 text-foreground'
      : 'border-border text-muted-foreground hover:border-cta hover:text-link',
  )

/** Crawlable archive pagination with real hrefs. */
export const FeedPagination: React.FC<Props> = ({
  basePath,
  className,
  limit,
  page,
  search,
  source,
  totalPages,
}) => {
  if (totalPages <= 1) return null

  const pageUrl = (pageNumber: number) =>
    buildCaseStudyArchiveUrl(basePath, { page: pageNumber, search, source, limit })

  const hasPrev = page > 1
  const hasNext = page < totalPages

  return (
    <nav aria-label="Pagination" className={cn('my-12 flex justify-center', className)}>
      <ul className="flex flex-wrap items-center gap-2">
        <li>
          {hasPrev ? (
            <Link className={pageClass()} href={pageUrl(page - 1)} rel="prev">
              Previous
            </Link>
          ) : (
            <span className={cn(pageClass(), 'pointer-events-none opacity-40')}>Previous</span>
          )}
        </li>
        {hasPrev ? (
          <li>
            <Link className={pageClass()} href={pageUrl(page - 1)}>
              {page - 1}
            </Link>
          </li>
        ) : null}
        <li>
          <Link aria-current="page" className={pageClass(true)} href={pageUrl(page)}>
            {page}
          </Link>
        </li>
        {hasNext ? (
          <li>
            <Link className={pageClass()} href={pageUrl(page + 1)}>
              {page + 1}
            </Link>
          </li>
        ) : null}
        <li>
          {hasNext ? (
            <Link className={pageClass()} href={pageUrl(page + 1)} rel="next">
              Next
            </Link>
          ) : (
            <span className={cn(pageClass(), 'pointer-events-none opacity-40')}>Next</span>
          )}
        </li>
      </ul>
    </nav>
  )
}
