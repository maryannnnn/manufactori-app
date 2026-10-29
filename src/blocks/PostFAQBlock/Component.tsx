import React from 'react'

import type { PostFAQBlock as PostFAQBlockProps } from '@/payload-types'

import RichText from '@/components/RichText'
import { hasRichTextContent } from '@/utilities/richText/hasContent'

type Props = PostFAQBlockProps

const FALLBACK_TITLE = 'Questions from manufacturing teams'

export const PostFAQBlock: React.FC<Props> = ({ postFAQTitle, postFAQText }) => {
  if (!postFAQTitle && !hasRichTextContent(postFAQText)) return null

  return (
    <section aria-labelledby="post-faq" className="container">
      <h2 className="mb-6 text-2xl font-semibold tracking-tight" id="post-faq">
        {postFAQTitle || FALLBACK_TITLE}
      </h2>
      {hasRichTextContent(postFAQText) ? (
        <RichText
          data={postFAQText as Record<string, unknown>}
          enableGutter={false}
        />
      ) : null}
    </section>
  )
}
