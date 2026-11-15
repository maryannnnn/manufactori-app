import Link from 'next/link'
import React from 'react'

import type { CardPostData } from '@/components/Card'
import { Card } from '@/components/Card'
import { cn } from '@/utilities/ui'

type Props = {
  articles: CardPostData[]
  className?: string
  heading?: string
  headingId?: string
  viewAllHref?: string | null
  viewAllLabel?: string
}

/**
 * Three visual article preview cards with a View all link.
 * Omits the section when there are no articles.
 */
export const RelatedArticleCards: React.FC<Props> = ({
  articles,
  className,
  heading = 'Related Manufacturing Articles',
  headingId = 'related-articles',
  viewAllHref,
  viewAllLabel = 'View all articles',
}) => {
  if (!articles.length) return null

  return (
    <section
      aria-labelledby={headingId}
      className={cn('scroll-mt-24 border-t border-border pt-16 pb-16', className)}
    >
      <h2 className="mb-6 text-2xl font-semibold tracking-tight text-foreground" id={headingId}>
        {heading}
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {articles.map((doc) => (
          <Card
            className="h-full"
            doc={doc}
            key={doc.slug}
            relationTo="posts"
            showCategories={false}
          />
        ))}
      </div>
      {viewAllHref ? (
        <p className="mt-8">
          <Link
            className="text-sm font-medium text-link underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
            href={viewAllHref}
          >
            {viewAllLabel}
          </Link>
        </p>
      ) : null}
    </section>
  )
}
