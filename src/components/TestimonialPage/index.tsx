import React from 'react'

import type { CaseStudy, Media, Testimonial } from '@/payload-types'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { ClientCard } from '@/components/ClientCard'
import RichText from '@/components/RichText'
import { getCaseStudyUrl, TESTIMONIALS_ARCHIVE_PATH } from '@/utilities/getContentUrls'

type Props = {
  testimonial: Testimonial
}

const asMedia = (value: unknown): Media | null => {
  if (!value || typeof value !== 'object') return null
  if (!('url' in value) || typeof value.url !== 'string' || !value.url) return null
  return value as Media
}

export const TestimonialPage: React.FC<Props> = ({ testimonial }) => {
  const heading = testimonial.testimonialLongTitle || testimonial.title
  const company = testimonial.clientCompany?.trim()
  const caseStudy =
    testimonial.caseStudy && typeof testimonial.caseStudy === 'object'
      ? (testimonial.caseStudy as CaseStudy)
      : null
  const caseHref = caseStudy ? getCaseStudyUrl(caseStudy) : null
  const caseTitle = caseStudy?.title?.trim() || null
  const logo = asMedia(caseStudy?.company_logo)

  return (
    <article className="container">
      <Breadcrumbs
        items={[
          { name: 'Home', href: '/' },
          { name: 'Testimonials', href: TESTIMONIALS_ARCHIVE_PATH },
          { name: heading },
        ]}
      />
      <h1 className="mt-6 max-w-[28ch] text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
        {heading}
      </h1>
      <blockquote className="mt-8 max-w-[68ch] border-l-2 border-border pl-5">
        <RichText className="max-w-none text-base leading-7 text-foreground" data={testimonial.testimonial} enableGutter={false} />
        {company ? (
          <footer className="mt-4 text-sm font-medium text-foreground">{company}</footer>
        ) : null}
      </blockquote>
      {caseStudy && caseHref && caseTitle ? (
        <section aria-labelledby="related-case-study" className="mt-14">
          <h2 className="text-xl font-semibold tracking-tight text-foreground" id="related-case-study">
            Related Case Study
          </h2>
          <ul className="mt-4 grid max-w-xs grid-cols-1">
            <li>
              <ClientCard
                client={{
                  name: caseTitle,
                  description: caseStudy.case_study_long_title?.trim() || null,
                  href: caseHref,
                  logo,
                  fallbackImage: null,
                }}
              />
            </li>
          </ul>
        </section>
      ) : null}
    </article>
  )
}
