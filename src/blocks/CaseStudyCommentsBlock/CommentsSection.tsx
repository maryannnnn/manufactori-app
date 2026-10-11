import React from 'react'

import RichText from '@/components/RichText'
import { hasRichTextContent } from '@/utilities/richText/hasContent'

import { AskQuestionPlaceholder } from './AskQuestionPlaceholder'
import { DiscussionThread, type ThreadNode } from './Thread'

export const COMMENTS_HEADING = 'Comments'

type Props = {
  headingId: string
  intro?: { [k: string]: unknown } | null
  nodes: ThreadNode[]
}

/**
 * Shared public Comments section for Case Studies, Posts, and Services.
 * The heading is always "Comments" so CMS titles cannot leak "Expert Discussion".
 */
export const CommentsSection: React.FC<Props> = ({ headingId, intro, nodes }) => {
  const hasIntro = hasRichTextContent(intro)

  return (
    <section aria-labelledby={headingId} className="container">
      <h2 className="mb-6 text-2xl font-semibold tracking-tight" id={headingId}>
        {COMMENTS_HEADING}
      </h2>

      {hasIntro ? (
        <div className="mb-8 max-w-[68ch] [&_p]:text-sm [&_p]:text-muted-foreground">
          <RichText data={intro as Record<string, unknown>} enableGutter={false} enableProse={false} />
        </div>
      ) : null}

      <DiscussionThread nodes={nodes} />
      <AskQuestionPlaceholder />
    </section>
  )
}
