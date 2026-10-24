import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import type { CaseStudy, Media } from '@/payload-types'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { JsonLd } from '@/components/JsonLd'
import { TestimonialCard, testimonialExcerpt } from '@/components/TestimonialCard'
import { generateMeta } from '@/utilities/generateMeta'
import { getTestimonialUrl, TESTIMONIALS_ARCHIVE_PATH } from '@/utilities/getContentUrls'
import { buildWebPageGraph, testimonialArchiveBreadcrumbs } from '@/utilities/jsonLd'
import { getRichTextPlainText } from '@/utilities/richText/getPlainText'

import PageClient from '../services/page.client'

const PAGE_TITLE = 'Testimonials'
const PAGE_DESCRIPTION =
  'Statements from client companies about working with Maryan Polyak. Each card opens the full testimonial.'

const asLogo = (value: CaseStudy['company_logo']): Media | null => {
  if (!value || typeof value !== 'object') return null
  if (!value.url) return null
  return value
}

export default async function TestimonialsPage() {
  const payload = await getPayload({ config: configPromise })
  const testimonials = await payload.find({
    collection: 'testimonials',
    depth: 2,
    draft: false,
    limit: 100,
    overrideAccess: false,
    pagination: false,
    sort: ['-featured', 'publishedAt'],
    where: {
      _status: { equals: 'published' },
    },
    select: {
      slug: true,
      testimonial: true,
      clientCompany: true,
      clientName: true,
      clientPosition: true,
      caseStudy: true,
    },
  })

  return (
    <div className="pt-16 pb-24">
      <PageClient />
      <JsonLd
        data={buildWebPageGraph({
          path: TESTIMONIALS_ARCHIVE_PATH,
          name: PAGE_TITLE,
          description: PAGE_DESCRIPTION,
          breadcrumbs: testimonialArchiveBreadcrumbs(),
          type: 'CollectionPage',
        })}
      />
      <div className="container mb-10">
        <div className="mb-5">
          <Breadcrumbs items={[{ name: 'Home', href: '/' }, { name: PAGE_TITLE }]} />
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          {PAGE_TITLE}
        </h1>
        <p className="mt-4 max-w-[62ch] text-base leading-7 text-muted-foreground">
          Statements from client companies. Open a card to read the full testimonial.
        </p>
      </div>
      <div className="container">
        {testimonials.docs.length > 0 ? (
          <ul className="grid grid-cols-1 items-start gap-4 md:grid-cols-2 xl:grid-cols-3">
            {testimonials.docs.flatMap((doc) => {
              const href = getTestimonialUrl(doc)
              if (!href) return []
              const caseStudy =
                doc.caseStudy && typeof doc.caseStudy === 'object'
                  ? (doc.caseStudy as CaseStudy)
                  : null
              return [
                <li key={doc.slug || href}>
                  <TestimonialCard
                    company={doc.clientCompany?.trim() || ''}
                    excerpt={testimonialExcerpt(getRichTextPlainText(doc.testimonial))}
                    name={doc.clientName?.trim() || ''}
                    position={doc.clientPosition?.trim() || ''}
                    href={href}
                    logo={asLogo(caseStudy?.company_logo)}
                  />
                </li>,
              ]
            })}
          </ul>
        ) : (
          <p className="text-base text-muted-foreground">No testimonials published.</p>
        )}
      </div>
    </div>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const meta = await generateMeta({
    doc: {
      meta: {
        title: PAGE_TITLE,
        description: PAGE_DESCRIPTION,
      },
    },
    url: TESTIMONIALS_ARCHIVE_PATH,
  })

  return { ...meta, alternates: { ...meta.alternates, canonical: TESTIMONIALS_ARCHIVE_PATH } }
}
