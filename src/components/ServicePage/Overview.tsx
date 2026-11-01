import Link from 'next/link'
import React from 'react'

import type { Service } from '@/payload-types'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { RichTextField } from '@/components/CaseStudyPage/RichTextField'
import { ContactStrip } from '@/components/ContactStrip'
import { Media } from '@/components/Media'
import { SERVICES_ARCHIVE_PATH } from '@/utilities/getContentUrls'
import { hasRichTextContent } from '@/utilities/richText/hasContent'
import { isServiceOverview } from '@/utilities/serviceCatalog'

export { isServiceOverview }

const buttonClass =
  'inline-flex min-h-11 items-center rounded-[2px] bg-cta px-4 py-2 text-sm font-medium text-on-cta transition-colors hover:bg-cta-hover active:bg-cta-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring'

const togetherRichText = (service: Service) => {
  const block = (service.layout ?? []).find((item) => item.blockType === 'content')
  if (!block || block.blockType !== 'content') return null
  return block.columns?.[0]?.richText ?? null
}

export const ServiceOverview: React.FC<{ service: Service }> = ({ service }) => {
  const heading = service.service_long_title || service.title
  const previewImage = service.service_preview_image
  const services = service.serviceScope ?? []
  const together = togetherRichText(service)
  const offer = service.entryOffer
  const ctaHref = offer?.ctaUrl || '/contact'
  const ctaLabel = offer?.ctaLabel || 'Discuss a project'

  return (
    <article className="pb-16">
      <div className="container">
        <div className="py-5">
          <Breadcrumbs
            items={[
              { name: 'Home', href: '/' },
              { name: 'Services', href: SERVICES_ARCHIVE_PATH },
              { name: heading },
            ]}
          />
        </div>

        <section className="pt-2 pb-10">
          <h1 className="max-w-[34ch] text-[clamp(1.75rem,4.2vw,3rem)] leading-[1.08] font-semibold tracking-tight text-foreground">
            {heading}
          </h1>
          <RichTextField
            className="mt-5 max-w-[65ch] text-lg text-muted-foreground [&_p]:text-muted-foreground"
            value={service.introduction?.text}
          />
          <Link className={`${buttonClass} mt-6`} href={ctaHref}>
            {ctaLabel}
          </Link>
          {previewImage && typeof previewImage === 'object' ? (
            <div className="mt-10 overflow-hidden rounded-[2px] border border-border">
              <Media resource={previewImage} size="100vw" />
            </div>
          ) : null}
        </section>

        {hasRichTextContent(service.introduction?.supportingText) ? (
          <section className="scroll-mt-24 pb-16">
            <div className="max-w-[68ch]">
              <RichTextField value={service.introduction?.supportingText} />
            </div>
          </section>
        ) : null}

        {services.length > 0 ? (
          <section aria-labelledby="included-services" className="scroll-mt-24 pb-16">
            <h2
              className="mb-6 border-b border-border pb-3 text-2xl font-semibold tracking-tight"
              id="included-services"
            >
              Services in this area
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {services.map((item, index) => (
                <div className="border border-border p-5" key={item.id ?? index}>
                  <h3 className="mb-3 text-base font-semibold tracking-tight">{item.title}</h3>
                  <RichTextField
                    className="[&_p]:text-sm [&_p]:leading-6 [&_p:last-child]:mb-0"
                    value={item.description}
                  />
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {hasRichTextContent(together) ? (
          <section className="scroll-mt-24 pb-16">
            <div className="max-w-[68ch]">
              <RichTextField value={together} />
            </div>
          </section>
        ) : null}

        <section aria-labelledby="overview-cta" className="scroll-mt-24 border-t border-border pt-10 pb-6">
          <h2 className="mb-3 text-2xl font-semibold tracking-tight" id="overview-cta">
            {offer?.title || 'Discuss a manufacturing marketing project'}
          </h2>
          <RichTextField className="max-w-[62ch]" value={offer?.description} />
          <Link className={`${buttonClass} mt-6`} href={ctaHref}>
            {ctaLabel}
          </Link>
        </section>

        <ContactStrip className="mt-8" contained={false} variant="serviceLower" />
      </div>
    </article>
  )
}
