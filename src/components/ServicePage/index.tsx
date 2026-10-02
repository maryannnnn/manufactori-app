import Link from 'next/link'
import React from 'react'

import type { CaseStudy, Service, SiteCategory } from '@/payload-types'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { Accordion, type AccordionItem } from '@/components/Accordion'
import { CaseStudyCard } from '@/components/CaseStudyCard'
import { CaseStudyTestimonial } from '@/components/CaseStudyPage/ClientTestimonial'
import { FieldLabel } from '@/components/CaseStudyPage/Section'
import { RichTextField } from '@/components/CaseStudyPage/RichTextField'
import { Media } from '@/components/Media'
import { ServiceCard } from '@/components/ServiceCard'
import { getCaseStudyListPreview } from '@/utilities/getCaseStudyListPreview'
import { SERVICES_ARCHIVE_PATH } from '@/utilities/getContentUrls'
import { hasRichTextContent } from '@/utilities/richText/hasContent'
import { cn } from '@/utilities/ui'

import {
  SERVICE_DURATION_OPTIONS,
  SERVICE_FORMAT_OPTIONS,
} from '@/collections/Services/fields/structuredServiceFields'

type Props = {
  service: Service
}

const labelFromOptions = (
  value: string | null | undefined,
  options: ReadonlyArray<{ label: string; value: string }>,
): string | null => {
  if (!value) return null
  return options.find((option) => option.value === value)?.label || value
}

const Section: React.FC<{
  children: React.ReactNode
  className?: string
  id: string
  title: string
}> = ({ children, className, id, title }) => (
  <section aria-labelledby={`${id}-heading`} className={cn('scroll-mt-24 pb-16', className)} id={id}>
    <h2
      className="mb-6 border-b border-border pb-3 font-mono text-[13px] font-medium text-muted-foreground"
      id={`${id}-heading`}
    >
      {title}
    </h2>
    {children}
  </section>
)

export const ServicePage: React.FC<Props> = ({ service }) => {
  const heading = service.service_long_title || service.title
  const contentTitle = service.service_content_title
  const previewImage = service.service_preview_image
  const situations = service.clientSituations ?? []
  const scope = service.serviceScope ?? []
  const steps = service.processSteps ?? []
  const formats = service.workingFormat?.formats ?? []
  const outcomes = service.expectedOutcomes ?? []
  const faqItems = service.faq?.items ?? []
  const relatedCaseStudies = (service.relatedCaseStudies ?? []).filter(
    (item): item is CaseStudy => Boolean(item) && typeof item === 'object' && 'id' in item,
  )
  const relatedServices = (service.relatedServices ?? []).filter(
    (item): item is Service =>
      Boolean(item) && typeof item === 'object' && 'id' in item && item.id !== service.id,
  )
  const siteCategories = (service.site_categories ?? []).filter(
    (item): item is SiteCategory => Boolean(item) && typeof item === 'object' && 'id' in item,
  )
  const layout = service.layout ?? []
  const offer = service.entryOffer
  const hasOffer = Boolean(
    offer?.title ||
      offer?.duration ||
      offer?.price ||
      offer?.ctaLabel ||
      hasRichTextContent(offer?.description) ||
      hasRichTextContent(offer?.includes) ||
      hasRichTextContent(offer?.deliverables) ||
      hasRichTextContent(offer?.nextStep),
  )
  const hasWorkingFormat = Boolean(
    formats.length || service.workingFormat?.minimumEngagement || service.workingFormat?.frequency,
  )
  const faqQuestions: AccordionItem[] = faqItems.flatMap((item, index) => {
    if (!item?.question || !hasRichTextContent(item.answer)) return []
    return [
      {
        key: item.id || `faq-${index}`,
        title: item.question,
        content: (
          <RichTextField className="[&_p]:text-sm [&_p:last-child]:mb-0" value={item.answer} />
        ),
      },
    ]
  })
  const hasFaq = faqQuestions.length > 0 || hasRichTextContent(service.faq?.intro)

  return (
    <article className="pb-16">
      <div className="container">
        <div className="flex items-center justify-between gap-4 py-5 font-mono text-xs">
          <Link
            className="text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            href={SERVICES_ARCHIVE_PATH}
          >
            ← All services
          </Link>
        </div>

        <section className="pt-2 pb-10">
          <h1 className="max-w-[26ch] text-[clamp(1.75rem,4.2vw,3rem)] leading-[1.08] font-semibold tracking-tight text-foreground">
            {heading}
          </h1>
          {contentTitle && contentTitle !== heading ? (
            <p className="mt-4 max-w-[46ch] text-lg text-muted-foreground">{contentTitle}</p>
          ) : null}
          <RichTextField
            className="mt-5 max-w-[62ch] text-lg text-muted-foreground [&_p]:text-muted-foreground"
            value={service.introduction?.text}
          />
          <RichTextField
            className="mt-4 max-w-[62ch] [&_p]:text-muted-foreground"
            value={service.introduction?.supportingText}
          />
          {previewImage && typeof previewImage === 'object' ? (
            <div className="mt-10 overflow-hidden rounded-[2px] border border-border">
              <Media resource={previewImage} size="100vw" />
            </div>
          ) : null}
        </section>

        {situations.length > 0 ? (
          <Section id="situations" title="When this service is relevant">
            <div className="grid gap-8 md:grid-cols-2">
              {situations.map((item, index) => (
                <div key={item.id ?? index}>
                  <h3 className="mb-3 text-base font-semibold tracking-tight">{item.title}</h3>
                  <RichTextField value={item.description} />
                  <RichTextField label="Consequence" value={item.consequence} />
                  <RichTextField label="Approach" value={item.recommendedApproach} />
                </div>
              ))}
            </div>
          </Section>
        ) : null}

        {scope.length > 0 ? (
          <Section id="scope" title="What the service includes">
            <div className="grid gap-8 md:grid-cols-2">
              {scope.map((item, index) => (
                <div key={item.id ?? index}>
                  <h3 className="mb-3 text-base font-semibold tracking-tight">{item.title}</h3>
                  <RichTextField value={item.description} />
                  <RichTextField label="Deliverables" value={item.deliverables} />
                  <RichTextField label="Approach" value={item.approach} />
                </div>
              ))}
            </div>
          </Section>
        ) : null}

        {steps.length > 0 ? (
          <Section id="process" title="How the service works">
            <ol className="space-y-8">
              {steps.map((step, index) => (
                <li key={step.id ?? index}>
                  <div className="mb-2 font-mono text-[11px] text-muted-foreground">
                    Step {step.stepNumber || index + 1}
                    {step.duration ? ` · ${step.duration}` : ''}
                  </div>
                  <h3 className="mb-3 text-base font-semibold tracking-tight">{step.title}</h3>
                  <RichTextField value={step.description} />
                  <RichTextField label="Deliverable" value={step.deliverable} />
                  <RichTextField label="Client involvement" value={step.clientInvolvement} />
                </li>
              ))}
            </ol>
          </Section>
        ) : null}

        {hasOffer ? (
          <Section id="start" title="How to start">
            {offer?.title ? <h3 className="mb-3 text-xl font-semibold tracking-tight">{offer.title}</h3> : null}
            <div className="mb-4 flex flex-wrap gap-2 font-mono text-[11.5px] text-muted-foreground">
              {offer?.duration ? <span className="rounded-[2px] border border-border px-2.5 py-1">{offer.duration}</span> : null}
              {offer?.price ? <span className="rounded-[2px] border border-border px-2.5 py-1">{offer.price}</span> : null}
            </div>
            <RichTextField value={offer?.description} />
            <RichTextField label="Included" value={offer?.includes} />
            <RichTextField label="Deliverables" value={offer?.deliverables} />
            <RichTextField label="Next step" value={offer?.nextStep} />
            {offer?.ctaLabel && offer?.ctaUrl ? (
              <Link
                className="mt-6 inline-flex rounded-[2px] border border-foreground bg-foreground px-4 py-2 text-sm text-background transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                href={offer.ctaUrl}
              >
                {offer.ctaLabel}
              </Link>
            ) : null}
          </Section>
        ) : null}

        {hasWorkingFormat ? (
          <Section id="format" title="Working format">
            {formats.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2">
                {formats.map((item, index) => (
                  <div key={item.id ?? index}>
                    <h3 className="mb-2 text-base font-semibold tracking-tight">
                      {labelFromOptions(item.format, SERVICE_FORMAT_OPTIONS) || 'Format'}
                    </h3>
                    {item.duration ? (
                      <div className="mb-3 font-mono text-[11.5px] text-muted-foreground">
                        {labelFromOptions(item.duration, SERVICE_DURATION_OPTIONS)}
                      </div>
                    ) : null}
                    <RichTextField value={item.description} />
                  </div>
                ))}
              </div>
            ) : null}
            {service.workingFormat?.minimumEngagement ? (
              <p className="mt-6 font-mono text-sm text-muted-foreground">
                Minimum engagement:{' '}
                {labelFromOptions(service.workingFormat.minimumEngagement, SERVICE_DURATION_OPTIONS)}
              </p>
            ) : null}
            {service.workingFormat?.frequency ? (
              <p className="mt-2 font-mono text-sm text-muted-foreground">
                Frequency: {service.workingFormat.frequency}
              </p>
            ) : null}
          </Section>
        ) : null}

        {outcomes.length > 0 ? (
          <Section id="outcomes" title="Expected outcomes">
            <div className="grid gap-6 md:grid-cols-2">
              {outcomes.map((item, index) => (
                <div key={item.id ?? index}>
                  <h3 className="mb-3 text-base font-semibold tracking-tight">{item.title}</h3>
                  <RichTextField value={item.description} />
                </div>
              ))}
            </div>
          </Section>
        ) : null}

        {relatedCaseStudies.length > 0 ? (
          <Section id="proof" title="Case studies">
            <div className="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-12 lg:gap-8">
              {relatedCaseStudies.map((doc, index) => (
                <div className="col-span-4" key={doc.slug ?? index}>
                  <CaseStudyCard doc={{ ...doc, ...getCaseStudyListPreview(doc) }} />
                </div>
              ))}
            </div>
          </Section>
        ) : null}

        <CaseStudyTestimonial testimonial={service.clientTestimonial} />

        {hasFaq ? (
          <Section id="faq" title={service.faq?.title || 'Questions & answers'}>
            <RichTextField className="mb-6 max-w-[68ch]" value={service.faq?.intro} />
            {faqQuestions.length > 0 ? <Accordion defaultOpenKey={null} items={faqQuestions} /> : null}
          </Section>
        ) : null}

        {relatedServices.length > 0 ? (
          <Section id="related" title="Related services">
            <div className="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-12 lg:gap-8">
              {relatedServices.map((doc, index) => (
                <div className="col-span-4" key={doc.slug ?? index}>
                  <ServiceCard doc={doc} />
                </div>
              ))}
            </div>
          </Section>
        ) : null}

        {siteCategories.length > 0 ? (
          <section aria-label="Taxonomy" className="border-t border-border pt-8 pb-4">
            <FieldLabel>Site taxonomy</FieldLabel>
            <ul className="flex flex-wrap gap-2">
              {siteCategories.map((item, index) => {
                const title = item.title || item.slug
                if (!title) return null
                return (
                  <li key={`${title}-${index}`}>
                    <span className="inline-flex rounded-[2px] border border-border px-2.5 py-1 font-mono text-[11.5px] text-muted-foreground">
                      {title}
                    </span>
                  </li>
                )
              })}
            </ul>
          </section>
        ) : null}
      </div>

      {layout.length > 0 ? <RenderBlocks blocks={layout} /> : null}
    </article>
  )
}
