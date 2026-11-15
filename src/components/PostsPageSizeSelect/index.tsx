'use client'

import { useRouter } from 'next/navigation'
import React from 'react'

import { Label } from '@/components/ui/label'
import { buildCaseStudyArchiveUrl } from '@/utilities/caseStudyArchiveUrl'
import { POSTS_PAGE_SIZE_OPTIONS, type PostsPageSize } from '@/utilities/postsPageSize'
import { cn } from '@/utilities/ui'

type Props = {
  archivePath: string
  className?: string
  pageSize: PostsPageSize
  search?: string
}

/**
 * Blog archive control: changes `?limit=` and resets to page 1.
 */
export const PostsPageSizeSelect: React.FC<Props> = ({
  archivePath,
  className,
  pageSize,
  search,
}) => {
  const router = useRouter()

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <Label className="text-sm text-muted-foreground" htmlFor="posts-page-size">
        Articles per page
      </Label>
      <select
        className="h-11 min-w-[5.5rem] rounded-[2px] border border-border bg-background px-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring sm:h-9"
        id="posts-page-size"
        onChange={(event) => {
          const next = Number.parseInt(event.target.value, 10)
          router.push(
            buildCaseStudyArchiveUrl(archivePath, {
              search,
              limit: next,
              page: 1,
            }),
          )
        }}
        value={pageSize}
      >
        {POSTS_PAGE_SIZE_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  )
}
