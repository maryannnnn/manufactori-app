import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import { notFound, permanentRedirect } from 'next/navigation'
import React, { cache } from 'react'

import { IndustryPage, type IndustryChild, type IndustryRecord } from '@/components/IndustryPage'
import { JsonLd } from '@/components/JsonLd'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { generateMeta } from '@/utilities/generateMeta'
import { getIndustryUrl, INDUSTRIES_ARCHIVE_PATH } from '@/utilities/getContentUrls'
import { buildWebPageGraph } from '@/utilities/jsonLd'

import { hydrateRelatedCaseStudies, querySecondaryBySlug } from '../loadIndustry'

export const dynamic = 'force-dynamic'

type Args = {
  params: Promise<{ slug?: string }>
}

const queryPrimary = cache(async (slug: string) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'industries',
    depth: 2,
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      and: [{ slug: { equals: slug } }, { industryLevel: { equals: 'primary' } }],
    },
  })
  return result.docs[0] || null
})

export default async function IndustryRoutePage({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  const decoded = decodeURIComponent(slug)
  const url = `${INDUSTRIES_ARCHIVE_PATH}/${decoded}`

  const primary = await queryPrimary(decoded)
  if (primary) {
    const payload = await getPayload({ config: configPromise })
    const [childrenResult, hydratedIndustry] = await Promise.all([
      payload.find({
        collection: 'industries',
        depth: 1,
        draft: false,
        limit: 1000,
        overrideAccess: false,
        pagination: false,
        sort: 'displayOrder',
        where: {
          and: [
            { _status: { equals: 'published' } },
            { industryLevel: { equals: 'secondary' } },
            { parentIndustry: { equals: primary.id } },
          ],
        },
      }),
      hydrateRelatedCaseStudies(primary),
    ])

    const heading = hydratedIndustry.industryLongTitle || hydratedIndustry.title
    return (
      <div className="pt-16 pb-24">
        <PayloadRedirects disableNotFound url={url} />
        {draft ? <LivePreviewListener /> : null}
        <JsonLd
          data={buildWebPageGraph({
            path: url,
            name: heading || 'Industry',
            description: hydratedIndustry.meta?.description || hydratedIndustry.industryPreviewDescription,
            breadcrumbs: [
              { name: 'Home', path: '/' },
              { name: 'Industrial', path: INDUSTRIES_ARCHIVE_PATH },
              { name: heading || hydratedIndustry.title || 'Industry', path: url },
            ],
          })}
        />
        <IndustryPage
          children={(childrenResult.docs as IndustryChild[]).map((child) => ({
            ...child,
            industryLevel: 'secondary' as const,
            parentSlug: primary.slug,
          }))}
          industry={{ ...(hydratedIndustry as IndustryRecord), industryLevel: 'primary' }}
        />
      </div>
    )
  }

  const secondary = await querySecondaryBySlug(decoded)
  const nested = secondary
    ? getIndustryUrl({
        slug: secondary.industry.slug,
        industryLevel: 'secondary',
        parentSlug: secondary.parent?.slug,
      })
    : null
  if (nested && nested !== url) permanentRedirect(nested)

  return <PayloadRedirects url={url} />
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const decoded = decodeURIComponent(slug)
  const primary = await queryPrimary(decoded)
  if (primary) {
    return generateMeta({
      doc: primary,
      url: getIndustryUrl({ ...primary, industryLevel: 'primary' }) || undefined,
    })
  }
  const secondary = await querySecondaryBySlug(decoded)
  if (!secondary) notFound()
  return generateMeta({
    doc: {
      ...secondary.industry,
      industryLevel: 'secondary' as const,
      parentIndustry: secondary.parent ? { slug: secondary.parent.slug } : null,
    },
    url:
      getIndustryUrl({
        slug: secondary.industry.slug,
        industryLevel: 'secondary',
        parentSlug: secondary.parent?.slug,
      }) || undefined,
  })
}
