import Link from 'next/link'
import React from 'react'

import type { CardPostData } from '@/components/Card'
import { CollectionArchive } from '@/components/CollectionArchive'
import { BLOG_ARCHIVE_PATH } from '@/utilities/getContentUrls'

type Props = {
  posts: CardPostData[]
}

export const HomeInsights: React.FC<Props> = ({ posts }) => {
  if (posts.length === 0) return null

  return (
    <section className="border-b border-border py-16 md:py-20">
      <div className="container mb-10">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          Blog
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
          Practical thinking on manufacturing marketing, SEO, AI search and B2B growth.
        </p>
      </div>
      <CollectionArchive posts={posts} />
      <div className="container">
        <Link
          className="mt-8 inline-flex font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          href={BLOG_ARCHIVE_PATH}
        >
          View all articles
        </Link>
      </div>
    </section>
  )
}
