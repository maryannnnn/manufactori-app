import type { Metadata } from 'next'

import { draftMode } from 'next/headers'
import { notFound, permanentRedirect } from 'next/navigation'
import React from 'react'

import { IndustryPage, type IndustryRecord } from '@/components/IndustryPage'
import { JsonLd } from '@/components/JsonLd'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { generateMeta } from '@/utilities/generateMeta'
import { getIndustryUrl, INDUSTRIES_ARCHIVE_PATH } from '@/utilities/getContentUrls'
import { buildWebPageGraph } from '@/utilities/jsonLd'

import { hydrateRelatedCaseStudies, querySecondaryBySlug } from '../../loadIndustry'

export const dynamic = 'force-dynamic'

type Args = {
  params: Promise<{ slug?: string; child?: string }>
}

const nestedPath = (parentSlug: string, childSlug: string) =>
  getIndustryUrl({
    slug: childSlug,
    industryLevel: 'secondary',
    parentSlug,
  })

export default async function SecondaryIndustryPage({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '', child = '' } = await paramsPromise
  const parentSlug = decodeURIComponent(slug)
  const childSlug = decodeURIComponent(child)
  const requested = `${INDUSTRIES_ARCHIVE_PATH}/${parentSlug}/${childSlug}`

  const secondary = await querySecondaryBySlug(childSlug)
  if (!secondary?.parent?.slug || !secondary.industry.slug) return <PayloadRedirects url={requested} />

  const canonical = nestedPath(secondary.parent.slug, secondary.industry.slug)
  if (canonical && canonical !== requested) permanentRedirect(canonical)

  const hydratedIndustry = await hydrateRelatedCaseStudies(secondary.industry)
  const heading = hydratedIndustry.industryLongTitle || hydratedIndustry.title
  const parentTitle = secondary.parent.title || secondary.parent.slug

  return (
    <div className="pt-16 pb-24">
      <PayloadRedirects disableNotFound url={requested} />
      {draft ? <LivePreviewListener /> : null}
      <JsonLd
        data={buildWebPageGraph({
          path: requested,
          name: heading || 'Industry',
          description: hydratedIndustry.meta?.description || hydratedIndustry.industryPreviewDescription,
          breadcrumbs: [
            { name: 'Home', path: '/' },
            { name: 'Industrial', path: INDUSTRIES_ARCHIVE_PATH },
            { name: parentTitle || 'Industry', path: `${INDUSTRIES_ARCHIVE_PATH}/${secondary.parent.slug}` },
            { name: heading || hydratedIndustry.title || 'Industry', path: requested },
          ],
        })}
      />
      <IndustryPage
        industry={{
          ...(hydratedIndustry as IndustryRecord),
          industryLevel: 'secondary',
          parentIndustry: { slug: secondary.parent.slug, title: secondary.parent.title },
        }}
      />
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { child = '' } = await paramsPromise
  const childSlug = decodeURIComponent(child)
  const secondary = await querySecondaryBySlug(childSlug)
  if (!secondary?.parent?.slug || !secondary.industry.slug) notFound()

  return generateMeta({
    doc: {
      ...secondary.industry,
      industryLevel: 'secondary' as const,
      parentIndustry: { slug: secondary.parent.slug },
    },
    url: nestedPath(secondary.parent.slug, secondary.industry.slug || childSlug) || undefined,
  })
}
