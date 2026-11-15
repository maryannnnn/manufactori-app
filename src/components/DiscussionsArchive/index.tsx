import Link from 'next/link'
import React from 'react'

import type { AggregatedDiscussionItem } from '@/utilities/queryAggregatedDiscussions'
import { cn } from '@/utilities/ui'

type Props = {
  items: AggregatedDiscussionItem[]
}

export const DiscussionsArchive: React.FC<Props> = ({ items }) => {
  if (!items.length) {
    return <p className="text-base text-muted-foreground">No matching discussions found.</p>
  }

  return (
    <div className="border-t border-border">
      {items.map((item) => (
        <article className="border-b border-border py-8" key={item.key}>
          <div className="space-y-4">
            {item.messages.map((message, index) => {
              const isQuestion = index === 0
              return (
                <div
                  className={cn(
                    'max-w-[72ch]',
                    !isQuestion && 'ml-0 border-l-2 border-border bg-muted/30 py-3 pl-4 sm:ml-4',
                  )}
                  key={`${item.key}-${index}`}
                  style={
                    message.depth > 1
                      ? { marginLeft: `${Math.min(message.depth, 3) * 0.75}rem` }
                      : undefined
                  }
                >
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <h3
                      className={cn(
                        'text-sm font-semibold text-foreground',
                        isQuestion && 'text-base',
                      )}
                    >
                      {message.author}
                    </h3>
                    {message.role ? (
                      <p className="text-xs text-muted-foreground">{message.role}</p>
                    ) : null}
                  </div>
                  <p
                    className={cn(
                      'mt-2 text-sm leading-6',
                      isQuestion ? 'text-foreground' : 'text-muted-foreground',
                    )}
                  >
                    {message.bodyPlain}
                  </p>
                </div>
              )
            })}
          </div>

          <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
            <span>{item.sourceKindLabel}</span>
            {' · '}
            <span>{item.sourceTitle}</span>
          </p>
          <Link
            className="mt-2 inline-flex text-sm text-link underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
            href={item.sourceHref}
          >
            View original discussion
          </Link>
        </article>
      ))}
    </div>
  )
}
