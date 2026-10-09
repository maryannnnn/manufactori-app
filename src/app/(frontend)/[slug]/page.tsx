import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import { homeStatic } from '@/endpoints/seed/home-static'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { HtmlSitemap } from '@/components/HtmlSitemap'
import { JsonLd } from '@/components/JsonLd'
import { generateMeta } from '@/utilities/generateMeta'
import { buildCmsPageGraph } from '@/utilities/jsonLd'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const pages = await payload.find({
    collection: 'pages',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const params = pages.docs
    ?.filter((doc) => {
      return doc.slug !== 'home'
    })
    .map(({ slug }) => {
      return { slug }
    })

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = 'home' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const url = '/' + decodedSlug
  let page: RequiredDataFromCollectionSlug<'pages'> | null

  page = await queryPageBySlug({
    slug: decodedSlug,
  })

  // Remove this code once your website is seeded
  if (!page && slug === 'home') {
    page = homeStatic
  }

  if (!page) {
    return <PayloadRedirects url={url} />
  }

  const { hero, layout, pageLongTitle, title } = page
  const heading = pageLongTitle || title
  const compactHero = !hero?.type || hero.type === 'none' || hero.type === 'lowImpact'
  const showStandaloneH1 = Boolean(heading) && (!hero?.type || hero.type === 'none')

  return (
    <article className="pt-16 pb-24">
      <PageClient />
      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />
      <JsonLd data={buildCmsPageGraph(page)} />

      {draft && <LivePreviewListener />}

      {compactHero ? (
        <div className="container mb-8">
          <Breadcrumbs items={[{ name: 'Home', href: '/' }, { name: heading }]} />
          {showStandaloneH1 ? (
            <h1 className="mt-5 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              {heading}
            </h1>
          ) : null}
        </div>
      ) : null}

      <RenderHero {...hero} />
      <RenderBlocks blocks={layout} />
      {decodedSlug === 'sitemap' ? <HtmlSitemap /> : null}
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = 'home' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const page = await queryPageBySlug({
    slug: decodedSlug,
  })

  return generateMeta({ doc: page })
}

const queryPageBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
