import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import { ServicePage } from '@/components/ServicePage'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { JsonLd } from '@/components/JsonLd'
import { generateMeta } from '@/utilities/generateMeta'
import { getServiceUrl } from '@/utilities/getContentUrls'
import { buildServiceGraph } from '@/utilities/jsonLd'
import { getServiceCategorySlug, isServiceOverview } from '@/utilities/serviceCatalog'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import { notFound, permanentRedirect } from 'next/navigation'
import React, { cache } from 'react'

import PageClient from '../../page.client'

type Args = {
  params: Promise<{
    slug?: string
    serviceSlug?: string
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

  return services.docs.flatMap(({ slug: serviceSlug }) => {
    const category = getServiceCategorySlug(serviceSlug)
    if (!serviceSlug || !category || isServiceOverview(serviceSlug)) return []
    return [{ slug: category, serviceSlug }]
  })
}

export default async function NestedServicePage({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '', serviceSlug = '' } = await paramsPromise
  const decodedCategory = decodeURIComponent(slug)
  const decodedSlug = decodeURIComponent(serviceSlug)
  const expectedCategory = getServiceCategorySlug(decodedSlug)
  const canonicalPath = getServiceUrl({ slug: decodedSlug })

  if (!expectedCategory || isServiceOverview(decodedSlug) || !canonicalPath) notFound()
  if (decodedCategory !== expectedCategory) permanentRedirect(canonicalPath)

  const service = await queryServiceBySlug({ slug: decodedSlug })
  if (!service) return <PayloadRedirects url={canonicalPath} />

  return (
    <div className="pt-16 pb-24">
      <PageClient />
      <PayloadRedirects disableNotFound url={canonicalPath} />
      {draft ? <LivePreviewListener /> : null}
      <JsonLd data={buildServiceGraph(service)} />
      <ServicePage service={service} />
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { serviceSlug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(serviceSlug)
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
