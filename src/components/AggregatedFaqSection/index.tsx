'use client'

import Link from 'next/link'
import React, { useId, useState } from 'react'

import type { AggregatedFaqItem } from '@/utilities/queryAggregatedFaqs'
import { cn } from '@/utilities/ui'

type Props = {
  className?: string
  /** Wrap heading/accordion in the site container. Turn off when a parent already provides one. */
  contained?: boolean
  heading?: string
  headingId?: string
  items: AggregatedFaqItem[]
  viewAllHref?: string
  viewAllLabel?: string
}

/**
 * Expandable FAQ feed with source attribution.
 * Client component so question/answer/link props stay serializable.
 */
export const AggregatedFaqSection: React.FC<Props> = ({
  className,
  contained = true,
  heading = 'Questions and answers',
  headingId = 'aggregated-faq',
  items,
  viewAllHref,
  viewAllLabel = 'View all Questions & Answers',
}) => {
  const [openKey, setOpenKey] = useState<string | null>(null)
  const baseId = useId()

  if (!items.length) return null

  const body = (
    <>
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
      <div className="border-t border-border">
        {items.map((item) => {
          const isOpen = item.key === openKey
          const panelId = `${baseId}-${item.key}`
          return (
            <div className="border-b border-border" key={item.key}>
              <h3>
                <button
                  aria-controls={panelId}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-3 py-4 text-left text-[15px] font-semibold text-foreground transition-colors hover:text-link focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                  id={`${panelId}-trigger`}
                  onClick={() => setOpenKey(isOpen ? null : item.key)}
                  type="button"
                >
                  <span>{item.question}</span>
                  <span
                    aria-hidden
                    className={cn(
                      'shrink-0 font-mono text-base text-muted-foreground transition-transform duration-200',
                      isOpen && 'rotate-45',
                    )}
                  >
                    +
                  </span>
                </button>
              </h3>
              <div
                aria-labelledby={`${panelId}-trigger`}
                className={cn(
                  'grid transition-[grid-template-rows] duration-200 ease-out',
                  isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                )}
                id={panelId}
                inert={!isOpen}
                role="region"
              >
                <div className="overflow-hidden">
                  <div className="max-w-[68ch] space-y-3 pb-5">
                    <p className="text-sm leading-6 text-muted-foreground">{item.answerPlain}</p>
                    <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                      <span>{item.sourceKindLabel}</span>
                      {' | '}
                      <Link
                        className="text-link underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                        href={item.sourceHref}
                      >
                        {item.sourceTitle}
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )

  return (
    <section aria-labelledby={headingId} className={cn('scroll-mt-24 py-16', className)}>
      {contained ? <div className="container">{body}</div> : body}
    </section>
  )
}
