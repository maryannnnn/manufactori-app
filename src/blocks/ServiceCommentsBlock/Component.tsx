import React from 'react'

import type { ServiceCommentsBlock as ServiceCommentsBlockProps } from '@/payload-types'

import { buildCommentTree, type CommentTreeNode } from '@/blocks/CaseStudyCommentsBlock/buildCommentTree'
import { CommentsSection } from '@/blocks/CaseStudyCommentsBlock/CommentsSection'
import { type ThreadNode } from '@/blocks/CaseStudyCommentsBlock/Thread'
import RichText from '@/components/RichText'
import { hasRichTextContent } from '@/utilities/richText/hasContent'

type Comment = NonNullable<ServiceCommentsBlockProps['comments']>[number]

type Props = ServiceCommentsBlockProps

export const ServiceCommentsBlock: React.FC<Props> = ({ comments, service_comment_text }) => {
  const entries = (comments ?? []).filter(
    (comment) => comment?.author && hasRichTextContent(comment.body),
  )

  return (
    <CommentsSection
      headingId="comments"
      intro={service_comment_text}
      nodes={buildCommentTree(entries).map(toThreadNode)}
    />
  )
}

const toThreadNode = (node: CommentTreeNode<Comment>): ThreadNode => ({
  key: node.key,
  author: node.author,
  role: node.role,
  date: node.date,
  isExpert: node.isExpert,
  body: <RichText data={node.body} enableGutter={false} enableProse={false} />,
  children: node.children.map(toThreadNode),
})
