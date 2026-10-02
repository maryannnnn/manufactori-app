import React from 'react'

import type { ServiceCommentsBlock as ServiceCommentsBlockProps } from '@/payload-types'

import { buildCommentTree, type CommentTreeNode } from '@/blocks/CaseStudyCommentsBlock/buildCommentTree'
import { DiscussionThread, type ThreadNode } from '@/blocks/CaseStudyCommentsBlock/Thread'
import RichText from '@/components/RichText'
import { hasRichTextContent } from '@/utilities/richText/hasContent'

type Comment = NonNullable<ServiceCommentsBlockProps['comments']>[number]

type Props = ServiceCommentsBlockProps

const FALLBACK_TITLE = 'Discussion'

export const ServiceCommentsBlock: React.FC<Props> = ({
  comments,
  service_comment_text,
  service_comment_title,
}) => {
  const entries = (comments ?? []).filter(
    (comment) => comment?.author && hasRichTextContent(comment.body),
  )

  const hasIntro = hasRichTextContent(service_comment_text)
  if (entries.length === 0 && !hasIntro) return null

  const tree = buildCommentTree(entries).map(toThreadNode)

  return (
    <section aria-labelledby="service-discussion" className="container">
      <h2 className="mb-6 text-2xl font-semibold tracking-tight" id="service-discussion">
        {service_comment_title || FALLBACK_TITLE}
      </h2>

      {hasIntro ? (
        <div className="mb-8 max-w-[68ch] [&_p]:text-sm [&_p]:text-muted-foreground">
          <RichText
            data={service_comment_text as Record<string, unknown>}
            enableGutter={false}
            enableProse={false}
          />
        </div>
      ) : null}

      <DiscussionThread nodes={tree} />
    </section>
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
