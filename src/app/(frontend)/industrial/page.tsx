import type { Metadata } from 'next'

import React from 'react'

import configPromise from '@payload-config'
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { ContactStrip } from '@/components/ContactStrip'
import { IndustryCard, type IndustryChild } from '@/components/IndustryPage'
import { JsonLd } from '@/components/JsonLd'
import { generateMeta } from '@/utilities/generateMeta'
import { INDUSTRIES_ARCHIVE_PATH } from '@/utilities/getContentUrls'
import { buildWebPageGraph } from '@/utilities/jsonLd'

export const dynamic = 'force-dynamic'

const FALLBACK_TITLE = 'Industrial marketing for manufacturing companies'
const FALLBACK_DESCRIPTION =
  'Marketing, websites, search, and technical content for manufacturing industries, written around their products, buyers, and longer B2B sales cycles.'

const queryOverview = async () => {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'pages',
    depth: 2,
    draft: false,
    limit: 1,
    overrideAccess: false,
    pagination: false,
    where: { slug: { equals: 'industrial' } },
  })
  return (result.docs[0] as RequiredDataFromCollectionSlug<'pages'> | undefined) || null
}

const queryPrimaries = async () => {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'industries',
    depth: 1,
    draft: false,
    limit: 12,
    overrideAccess: false,
    pagination: false,
    sort: 'displayOrder',
    where: {
      and: [{ _status: { equals: 'published' } }, { industryLevel: { equals: 'primary' } }],
    },
  })
  return [...result.docs].sort(
    (a, b) => (a.displayOrder ?? 9999) - (b.displayOrder ?? 9999),
  ) as IndustryChild[]
}

export default async function IndustrialOverviewPage() {
  const [page, industries] = await Promise.all([queryOverview(), queryPrimaries()])
  const heading = page?.pageLongTitle || page?.title || FALLBACK_TITLE
  const description = page?.meta?.description || FALLBACK_DESCRIPTION
  const intro = page?.layout?.slice(0, 1) ?? []
  const rest = page?.layout?.slice(1) ?? []

  return (
    <div className="pt-16 pb-24">
      <JsonLd
        data={buildWebPageGraph({
          path: INDUSTRIES_ARCHIVE_PATH,
          name: heading,
          description,
          breadcrumbs: [
            { name: 'Home', path: '/' },
            { name: 'Industrial', path: INDUSTRIES_ARCHIVE_PATH },
          ],
          type: 'CollectionPage',
        })}
      />
      <div className="container">
        <div className="mb-8">
          <Breadcrumbs items={[{ name: 'Home', href: '/' }, { name: 'Industrial' }]} />
        </div>
        <h1 className="max-w-[22ch] text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
          {heading}
        </h1>
      </div>
      {intro.length > 0 ? <RenderBlocks blocks={intro} /> : null}
      <section aria-labelledby="industrial-industries" className="container py-12">
        <h2 className="mb-6 text-2xl font-semibold tracking-tight" id="industrial-industries">
          Nine manufacturing industries
        </h2>
        {industries.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {industries.map((doc) => (
              <IndustryCard doc={{ ...doc, industryLevel: 'primary' }} key={doc.id ?? doc.slug} />
            ))}
          </div>
        ) : (
          <p className="max-w-[65ch] text-base leading-7 text-muted-foreground">
            Industry pages are added as each manufacturing sector is written.
          </p>
        )}
      </section>
      {rest.length > 0 ? <RenderBlocks blocks={rest} /> : null}
      <div className="container">
        <ContactStrip className="mt-8" />
      </div>
    </div>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await queryOverview()
  if (!page) {
    return generateMeta({
      doc: {
        slug: 'industrial',
        title: FALLBACK_TITLE,
        meta: { title: 'Industrial Marketing for Manufacturing Companies', description: FALLBACK_DESCRIPTION },
      },
      url: INDUSTRIES_ARCHIVE_PATH,
    })
  }
  return generateMeta({ doc: page, url: INDUSTRIES_ARCHIVE_PATH })
}
