import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import { ServicePage } from '@/components/ServicePage'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { generateMeta } from '@/utilities/generateMeta'
import { getServiceUrl } from '@/utilities/getContentUrls'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'

import PageClient from '../page.client'

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const services = await payload.find({
    collection: 'services',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: { slug: true },
  })

  return services.docs.flatMap(({ slug }) => (slug ? [{ slug }] : []))
}

export default async function ServiceDocumentPage({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const url = getServiceUrl({ slug: decodedSlug }) || `/services/${decodedSlug}`
  const service = await queryServiceBySlug({ slug: decodedSlug })

  if (!service) {
    return <PayloadRedirects url={url} />
  }

  return (
    <div className="pt-16 pb-24">
      <PageClient />
      <PayloadRedirects disableNotFound url={url} />
      {draft ? <LivePreviewListener /> : null}
      <ServicePage service={service} />
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const service = await queryServiceBySlug({ slug: decodedSlug })
  const url = getServiceUrl(service)

  return generateMeta({ doc: service, url: url || undefined })
}

const queryServiceBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'services',
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
