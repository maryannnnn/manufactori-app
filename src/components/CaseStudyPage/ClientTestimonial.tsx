import React from 'react'

import type { CaseStudy } from '@/payload-types'

import { hasRichTextContent } from '@/utilities/richText/hasContent'

import { RichTextField } from './RichTextField'

type Props = {
  testimonial?: CaseStudy['clientTestimonial']
}

/**
 * Closing proof quote. The page CTA is not rendered here — it comes from a `cta`
 * block in the case study layout, so it stays editable in the CMS.
 */
export const CaseStudyTestimonial: React.FC<Props> = ({ testimonial }) => {
  if (!hasRichTextContent(testimonial?.quote)) return null

  const attribution = [testimonial?.author, testimonial?.position, testimonial?.company]
    .filter(Boolean)
    .join(', ')

  return (
    <section className="border-t border-border pt-8 pb-4">
      <blockquote className="max-w-[52ch]">
        <RichTextField
          className="[&_p]:text-base [&_p]:text-foreground [&_p:last-child]:mb-0"
          value={testimonial?.quote}
        />
        {attribution ? (
          <cite className="mt-3 block font-mono text-xs text-muted-foreground not-italic">
            {attribution}
          </cite>
        ) : null}
      </blockquote>
    </section>
  )
}
