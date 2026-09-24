'use client'
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'

import type { CaseStudyCommentsBlock } from '@/payload-types'

type Comment = NonNullable<CaseStudyCommentsBlock['comments']>[number]

/**
 * Without this, a 25-entry discussion collapses into identical rows. Showing the
 * author and the indent level makes the thread editable.
 */
export const CommentRowLabel: React.FC<RowLabelProps> = () => {
  const { data, rowNumber } = useRowLabel<Comment>()

  const number = String((rowNumber ?? 0) + 1).padStart(2, '0')
  const indent = '— '.repeat(data?.depth ?? 0)
  const author = data?.author || 'Comment'

  return (
    <div>
      {number}. {indent}
      {author}
      {data?.isExpert ? ' (expert)' : ''}
    </div>
  )
}
