import Link from 'next/link'
import React from 'react'

import type { AggregatedDiscussionItem } from '@/utilities/queryAggregatedDiscussions'
import { excerptPlainText } from '@/utilities/excerptPlainText'
import { cn } from '@/utilities/ui'

type Props = {
  className?: string
  heading?: string
  headingId?: string
  items: AggregatedDiscussionItem[]
  viewAllHref?: string
  viewAllLabel?: string
}

export const AggregatedDiscussionSection: React.FC<Props> = ({
  className,
  heading = 'Recent discussions',
  headingId = 'aggregated-discussions',
  items,
  viewAllHref,
  viewAllLabel = 'View all Discussions',
}) => {
  if (!items.length) return null

  return (
    <section aria-labelledby={headingId} className={cn('scroll-mt-24 border-t border-border py-16', className)}>
      <div className="container">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground" id={headingId}>
            {heading}
          </h2>
          {viewAllHref ? (
            <Link
              className="font-mono text-xs uppercase tracking-[0.12em] text-link underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
              href={viewAllHref}
            >
              {viewAllLabel}
            </Link>
          ) : null}
        </div>
        <ul className="space-y-6">
          {items.map((item) => (
            <li
              className="rounded-[2px] border border-border bg-card px-4 py-4 sm:px-5"
              key={item.key}
            >
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <p className="text-sm font-semibold text-foreground">{item.author}</p>
                {item.role ? (
                  <p className="text-xs text-muted-foreground">{item.role}</p>
                ) : null}
              </div>
              <p className="mt-2 text-sm leading-6 text-foreground">
                {excerptPlainText(item.questionPlain, 180)}
              </p>
              {item.answerPlain ? (
                <div className="mt-3 border-t border-border pt-3">
                  {item.answerAuthor ? (
                    <p className="text-xs font-medium text-muted-foreground">
                      {item.answerAuthor}
                      {item.answerRole ? ` · ${item.answerRole}` : ''}
                    </p>
                  ) : null}
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {excerptPlainText(item.answerPlain, 180)}
                  </p>
                </div>
              ) : null}
              <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                <span>{item.sourceKindLabel}</span>
                {' | '}
                <Link
                  className="text-link underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                  href={item.sourceHref}
                >
                  {item.sourceTitle}
                </Link>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
