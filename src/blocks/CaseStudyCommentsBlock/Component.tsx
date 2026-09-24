import React from 'react'

import type { CaseStudyCommentsBlock as CaseStudyCommentsBlockProps } from '@/payload-types'

import RichText from '@/components/RichText'
import { hasRichTextContent } from '@/utilities/richText/hasContent'

import { buildCommentTree, type CommentTreeNode } from './buildCommentTree'
import { DiscussionThread, type ThreadNode } from './Thread'

type Comment = NonNullable<CaseStudyCommentsBlockProps['comments']>[number]

type Props = CaseStudyCommentsBlockProps

/** Used when an editor leaves the heading empty. */
const FALLBACK_TITLE = 'Discussion'

export const CaseStudyCommentsBlock: React.FC<Props> = ({
  case_study_comment_text,
  case_study_comment_title,
  comments,
}) => {
  const entries = (comments ?? []).filter(
    (comment) => comment?.author && hasRichTextContent(comment.body),
  )

  const hasIntro = hasRichTextContent(case_study_comment_text)
  if (entries.length === 0 && !hasIntro) return null

  const tree = buildCommentTree(entries).map(toThreadNode)

  return (
    <section aria-labelledby="case-study-discussion" className="container">
      <h2 className="mb-6 text-2xl font-semibold tracking-tight" id="case-study-discussion">
        {case_study_comment_title || FALLBACK_TITLE}
      </h2>

      {hasIntro ? (
        <div className="mb-8 max-w-[68ch] [&_p]:text-sm [&_p]:text-muted-foreground">
          <RichText
            data={case_study_comment_text as Record<string, unknown>}
            enableGutter={false}
            enableProse={false}
          />
        </div>
      ) : null}

      <DiscussionThread nodes={tree} />
    </section>
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
