import Link from 'next/link'
import React from 'react'

import type { ActiveBlogCategory } from '@/utilities/queryActiveBlogCategories'
import { cn } from '@/utilities/ui'

type Props = {
  categories: ActiveBlogCategory[]
  className?: string
}

/**
 * Compact Industrial category chips under the Blog search field.
 */
export const BlogCategoryActivity: React.FC<Props> = ({ categories, className }) => {
  if (!categories.length) return null

  return (
    <nav
      aria-label="Active industrial topics"
      className={cn('mt-5', className)}
    >
      <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
        Active industrial topics
      </p>
      <ul className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <li key={category.slug}>
            <Link
              className="inline-flex max-w-full items-center rounded-[2px] border border-border bg-background px-2.5 py-1.5 text-sm text-foreground transition-colors hover:border-cta hover:text-link focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
              href={category.href}
            >
              <span className="truncate">{category.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
