import React from 'react'

import type { CaseStudyFAQBlock as CaseStudyFAQBlockProps } from '@/payload-types'

import { Accordion, type AccordionItem } from '@/components/Accordion'
import RichText from '@/components/RichText'
import { hasRichTextContent } from '@/utilities/richText/hasContent'

type Props = CaseStudyFAQBlockProps

/** Used when an editor leaves the heading empty. */
const FALLBACK_TITLE = 'Frequently Asked Questions'

export const CaseStudyFAQBlock: React.FC<Props> = ({
  case_study_faq_text,
  case_study_faq_title,
  items,
}) => {
  const questions: AccordionItem[] = (items ?? []).flatMap((item, index) => {
    if (!item?.question || !hasRichTextContent(item.answer)) return []

    return [
      {
        key: item.id || `faq-${index}`,
        title: item.question,
        // Rendered here so the answers reach the client accordion as markup
        // rather than as a Tiptap document.
        content: <RichText data={item.answer} enableGutter={false} enableProse={false} />,
      },
    ]
  })

  const hasIntro = hasRichTextContent(case_study_faq_text)
  if (questions.length === 0 && !hasIntro) return null

  return (
    <section aria-labelledby="case-study-faq" className="container">
      {/* Matches CaseStudyContentTitleBlock, its sibling in the same block flow. */}
      <h2 className="mb-6 text-2xl font-semibold tracking-tight" id="case-study-faq">
        {case_study_faq_title || FALLBACK_TITLE}
      </h2>

      {hasIntro ? (
        <div className="mb-6 max-w-[68ch] [&_p]:text-sm [&_p]:text-muted-foreground">
          <RichText
            data={case_study_faq_text as Record<string, unknown>}
            enableGutter={false}
            enableProse={false}
          />
        </div>
      ) : null}

      {/* Collapsed by default: a FAQ is scanned by question, not read top to bottom. */}
      <Accordion defaultOpenKey={null} items={questions} />
    </section>
  )
}
