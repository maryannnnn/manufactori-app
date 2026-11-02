import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import React, { cache } from 'react'

import { IndustryPage, type IndustryRecord } from '@/components/IndustryPage'
import { JsonLd } from '@/components/JsonLd'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { generateMeta } from '@/utilities/generateMeta'
import { getIndustryUrl, INDUSTRIES_ARCHIVE_PATH } from '@/utilities/getContentUrls'
import { buildWebPageGraph } from '@/utilities/jsonLd'

export const dynamic = 'force-dynamic'

type Args = {
  params: Promise<{ slug?: string; child?: string }>
}

const querySecondary = cache(async (parentSlug: string, childSlug: string) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })
  const parents = await payload.find({
    collection: 'industries',
    depth: 0,
    draft: false,
    limit: 1,
    overrideAccess: false,
    pagination: false,
    where: {
      and: [{ slug: { equals: parentSlug } }, { industryLevel: { equals: 'primary' } }],
    },
  })
  const parent = parents.docs[0]
  if (!parent) return null
  const result = await payload.find({
    collection: 'industries',
    depth: 2,
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      and: [
        { slug: { equals: childSlug } },
        { industryLevel: { equals: 'secondary' } },
        { parentIndustry: { equals: parent.id } },
      ],
    },
  })
  const industry = result.docs[0]
  if (!industry) return null
  return { industry, parent }
})

export default async function SecondaryIndustryPage({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '', child = '' } = await paramsPromise
  const parentSlug = decodeURIComponent(slug)
  const childSlug = decodeURIComponent(child)
  const url = `${INDUSTRIES_ARCHIVE_PATH}/${parentSlug}/${childSlug}`
  const found = await querySecondary(parentSlug, childSlug)
  if (!found) return <PayloadRedirects url={url} />

  const heading = found.industry.industryLongTitle || found.industry.title
  const parentTitle = found.parent.title || found.parent.slug
  return (
    <div className="pt-16 pb-24">
      <PayloadRedirects disableNotFound url={url} />
      {draft ? <LivePreviewListener /> : null}
      <JsonLd
        data={buildWebPageGraph({
          path: url,
          name: heading || 'Industry',
          description: found.industry.meta?.description || found.industry.industryPreviewDescription,
          breadcrumbs: [
            { name: 'Home', path: '/' },
            { name: 'Industrial', path: INDUSTRIES_ARCHIVE_PATH },
            { name: parentTitle || 'Industry', path: `${INDUSTRIES_ARCHIVE_PATH}/${parentSlug}` },
            { name: heading || found.industry.title || 'Industry', path: url },
          ],
        })}
      />
      <IndustryPage
        industry={{
          ...(found.industry as IndustryRecord),
          industryLevel: 'secondary',
          parentIndustry: { slug: found.parent.slug, title: found.parent.title },
        }}
      />
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '', child = '' } = await paramsPromise
  const found = await querySecondary(decodeURIComponent(slug), decodeURIComponent(child))
  if (!found) notFound()
  return generateMeta({
    doc: {
      ...found.industry,
      industryLevel: 'secondary' as const,
      parentIndustry: { slug: found.parent.slug },
    },
    url:
      getIndustryUrl({
        slug: found.industry.slug,
        industryLevel: 'secondary',
        parentSlug: found.parent.slug,
      }) || undefined,
  })
}
