import React from 'react'

import type { CaseStudyCommentsBlock as CaseStudyCommentsBlockProps } from '@/payload-types'

import RichText from '@/components/RichText'
import { hasRichTextContent } from '@/utilities/richText/hasContent'

import { buildCommentTree, type CommentTreeNode } from './buildCommentTree'
import { CommentsSection } from './CommentsSection'
import { type ThreadNode } from './Thread'

type Comment = NonNullable<CaseStudyCommentsBlockProps['comments']>[number]

type Props = CaseStudyCommentsBlockProps

export const CaseStudyCommentsBlock: React.FC<Props> = ({
  case_study_comment_text,
  comments,
}) => {
  const entries = (comments ?? []).filter(
    (comment) => comment?.author && hasRichTextContent(comment.body),
  )

  const tree = buildCommentTree(entries).map(toThreadNode)

  return (
    <CommentsSection
      headingId="comments"
      intro={case_study_comment_text}
      nodes={tree}
    />
  )
}

/** Rich text is rendered here so the client thread never loads Tiptap. */
const toThreadNode = (node: CommentTreeNode<Comment>): ThreadNode => ({
  key: node.key,
  author: node.author,
  role: node.role,
  date: node.date,
  isExpert: node.isExpert,
  body: <RichText data={node.body} enableGutter={false} enableProse={false} />,
  children: node.children.map(toThreadNode),
})
