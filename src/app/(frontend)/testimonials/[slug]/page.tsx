import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'

import { TestimonialPage } from '@/components/TestimonialPage'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { JsonLd } from '@/components/JsonLd'
import { generateMeta } from '@/utilities/generateMeta'
import { getTestimonialUrl, TESTIMONIALS_ARCHIVE_PATH } from '@/utilities/getContentUrls'
import { buildWebPageGraph } from '@/utilities/jsonLd'

import PageClient from '../../services/page.client'

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const testimonials = await payload.find({
    collection: 'testimonials',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: { slug: true },
  })

  return testimonials.docs.flatMap(({ slug }) => (slug ? [{ slug }] : []))
}

export default async function TestimonialDocumentPage({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const url = getTestimonialUrl({ slug: decodedSlug }) || `/testimonials/${decodedSlug}`
  const testimonial = await queryTestimonialBySlug({ slug: decodedSlug })

  if (!testimonial) {
    return <PayloadRedirects url={url} />
  }

  return (
    <div className="pt-16 pb-24">
      <PageClient />
      <PayloadRedirects disableNotFound url={url} />
      {draft ? <LivePreviewListener /> : null}
      <JsonLd
        data={buildWebPageGraph({
          path: url,
          name: testimonial.testimonialLongTitle || testimonial.title,
          description: testimonial.meta?.description,
          breadcrumbs: [
            { name: 'Home', path: '/' },
            { name: 'Testimonials', path: TESTIMONIALS_ARCHIVE_PATH },
            { name: testimonial.testimonialLongTitle || testimonial.title, path: url },
          ],
        })}
      />
      <TestimonialPage testimonial={testimonial} />
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const testimonial = await queryTestimonialBySlug({ slug: decodeURIComponent(slug) })
  const url = getTestimonialUrl(testimonial)

  return generateMeta({ doc: testimonial, url: url || undefined })
}

const queryTestimonialBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'testimonials',
    depth: 2,
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
