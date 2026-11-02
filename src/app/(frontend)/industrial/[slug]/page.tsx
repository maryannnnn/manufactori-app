import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import React, { cache } from 'react'

import type { CaseStudy } from '@/payload-types'
import { IndustryPage, type IndustryChild, type IndustryRecord } from '@/components/IndustryPage'
import { JsonLd } from '@/components/JsonLd'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { generateMeta } from '@/utilities/generateMeta'
import { getIndustryUrl, INDUSTRIES_ARCHIVE_PATH } from '@/utilities/getContentUrls'
import { buildWebPageGraph } from '@/utilities/jsonLd'

export const dynamic = 'force-dynamic'

type Args = {
  params: Promise<{ slug?: string }>
}

const idOf = (value: unknown): number | null => {
  if (typeof value === 'number') return value
  if (value && typeof value === 'object' && 'id' in value) {
    const id = (value as { id?: unknown }).id
    return typeof id === 'number' ? id : null
  }
  return null
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

const hydrateRelatedCaseStudies = async (
  industry: NonNullable<Awaited<ReturnType<typeof queryPrimary>>>,
) => {
  const related = industry.relatedCaseStudies ?? []
  const ids = related
    .map((item) => idOf(item?.caseStudy))
    .filter((id): id is number => id != null)
  if (ids.length === 0) return industry

  const payload = await getPayload({ config: configPromise })
  const found = await payload.find({
    collection: 'case-studies',
    depth: 1,
    draft: false,
    limit: ids.length,
    overrideAccess: false,
    pagination: false,
    where: { id: { in: ids } },
    select: {
      title: true,
      slug: true,
      layout: true,
      meta: true,
      primary_case_study_category: true,
      case_study_categories: true,
    },
  })
  const byId = new Map(found.docs.map((doc) => [Number(doc.id), doc as CaseStudy]))

  return {
    ...industry,
    relatedCaseStudies: related.map((item) => {
      const id = idOf(item?.caseStudy)
      const hydrated = id != null ? byId.get(id) : null
      if (!hydrated) return item
      return { ...item, caseStudy: hydrated }
    }),
  }
}

export default async function PrimaryIndustryPage({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  const decoded = decodeURIComponent(slug)
  const url = `${INDUSTRIES_ARCHIVE_PATH}/${decoded}`
  const industry = await queryPrimary(decoded)
  if (!industry) return <PayloadRedirects url={url} />

  const payload = await getPayload({ config: configPromise })
  const [childrenResult, hydratedIndustry] = await Promise.all([
    payload.find({
      collection: 'industries',
      depth: 1,
      draft: false,
      limit: 100,
      overrideAccess: false,
      pagination: false,
      sort: 'displayOrder',
      where: {
        and: [
          { _status: { equals: 'published' } },
          { industryLevel: { equals: 'secondary' } },
          { parentIndustry: { equals: industry.id } },
        ],
      },
    }),
    hydrateRelatedCaseStudies(industry),
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
        children={childrenResult.docs as IndustryChild[]}
        industry={{ ...(hydratedIndustry as IndustryRecord), industryLevel: 'primary' }}
      />
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const industry = await queryPrimary(decodeURIComponent(slug))
  if (!industry) notFound()
  return generateMeta({
    doc: industry,
    url: getIndustryUrl({ ...industry, industryLevel: 'primary' }) || undefined,
  })
}
