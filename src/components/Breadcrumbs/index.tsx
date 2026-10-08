import Link from 'next/link'
import React from 'react'

import { cn } from '@/utilities/ui'

export type BreadcrumbItem = {
  name: string
  href?: string | null
}

type Props = {
  className?: string
  items: BreadcrumbItem[]
}

export const Breadcrumbs: React.FC<Props> = ({ className, items }) => {
  const visible = items.filter((item) => item.name)
  if (visible.length === 0) return null

  return (
    <nav aria-label="Breadcrumb" className={cn('text-muted-foreground', className)}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs">
        {visible.map((item, index) => {
          const isLast = index === visible.length - 1

          return (
            <li className="flex items-center gap-2" key={`${item.name}-${index}`}>
              {index > 0 ? <span aria-hidden>/</span> : null}
              {isLast || !item.href ? (
                <span aria-current={isLast ? 'page' : undefined} className="text-current">
                  {item.name}
                </span>
              ) : (
                <Link
                  className="opacity-80 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  href={item.href}
                >
                  {item.name}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
