import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import { CaseStudyArchive } from '@/components/CaseStudyArchive'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { hasRichTextContent } from '@/utilities/richText/hasContent'
import { generateMeta } from '@/utilities/generateMeta'
import { getCaseStudyListPreview } from '@/utilities/getCaseStudyListPreview'
import {
  CASE_STUDY_CATEGORY_PATH_SEGMENT,
  getCategorySlug,
  isReservedCaseStudyCategorySlug,
} from '@/utilities/getContentUrls'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import React, { cache } from 'react'

import PageClient from './page.client'

type Args = {
  params: Promise<{
    segments?: string[]
  }>
}

const parseSegments = (segments: string[] | undefined) => {
  if (!segments?.length) return null

  const decoded = segments.map((segment) => decodeURIComponent(segment)).filter(Boolean)

  if (decoded.length === 1) {
    const caseStudySlug = decoded[0]
    if (!caseStudySlug || isReservedCaseStudyCategorySlug(caseStudySlug)) return null
    return { type: 'caseStudy' as const, categorySlug: null, caseStudySlug }
  }

  if (decoded.length === 2 && isReservedCaseStudyCategorySlug(decoded[0])) {
    const categorySlug = decoded[1]
    if (!categorySlug) return null
    return { type: 'category' as const, categorySlug }
  }

  if (decoded.length === 2) {
    const categorySlug = decoded[0]
    const caseStudySlug = decoded[1]
    if (!categorySlug || !caseStudySlug) return null
    return { type: 'caseStudy' as const, categorySlug, caseStudySlug }
  }

  return null
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })

  const [categories, caseStudies] = await Promise.all([
    payload.find({
      collection: 'case-study-categories',
      draft: false,
      limit: 1000,
      overrideAccess: false,
      pagination: false,
      select: { slug: true },
    }),
    payload.find({
      collection: 'case-studies',
      draft: false,
      limit: 1000,
      overrideAccess: false,
      pagination: false,
      depth: 1,
      select: {
        slug: true,
        primary_case_study_category: true,
      },
    }),
  ])

  const categoryParams = categories.docs.flatMap(({ slug }) =>
    slug ? [{ segments: [CASE_STUDY_CATEGORY_PATH_SEGMENT, slug] }] : [],
  )

  const caseStudyParams = caseStudies.docs.flatMap((doc) => {
    if (!doc.slug) return []
    const category = getCategorySlug(doc.primary_case_study_category)
    if (!category || isReservedCaseStudyCategorySlug(category)) {
      return [{ segments: [doc.slug] }]
    }
    return [{ segments: [category, doc.slug] }]
  })

  return [...categoryParams, ...caseStudyParams]
}

export default async function CaseStudyCatchAllPage({ params: paramsPromise }: Args) {
  const parsed = parseSegments((await paramsPromise).segments)
  if (!parsed) notFound()

  if (parsed.type === 'category') {
    return renderCategoryPage(parsed.categorySlug)
  }

  return renderCaseStudyPage(parsed.categorySlug, parsed.caseStudySlug)
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const parsed = parseSegments((await paramsPromise).segments)
  if (!parsed) return generateMeta({ doc: null })

  if (parsed.type === 'category') {
    const category = await queryCategoryBySlug({ slug: parsed.categorySlug })
    const title = category?.case_study_long_title || category?.title
    return {
      title: title ? `${title} | Payload Website Template` : 'Payload Website Template',
    }
  }

  const caseStudy = await queryCaseStudyBySlug({ slug: parsed.caseStudySlug })
  const primarySlug = getCategorySlug(caseStudy?.primary_case_study_category)

  if (parsed.categorySlug) {
    if (caseStudy && primarySlug !== parsed.categorySlug) {
      return generateMeta({ doc: null })
    }
  } else if (caseStudy && primarySlug) {
    return generateMeta({ doc: null })
  }

  return generateMeta({ doc: caseStudy as never })
}

async function renderCategoryPage(slug: string) {
  const { isEnabled: draft } = await draftMode()
  const url = `/case-study/${CASE_STUDY_CATEGORY_PATH_SEGMENT}/${slug}`
  const category = await queryCategoryBySlug({ slug })

  if (!category) return <PayloadRedirects url={url} />

  const payload = await getPayload({ config: configPromise })
  const caseStudies = await payload.find({
    collection: 'case-studies',
    depth: 1,
    limit: 100,
    overrideAccess: false,
    where: {
      case_study_categories: {
        in: [category.id],
      },
    },
    select: {
      title: true,
      slug: true,
      case_study_categories: true,
      primary_case_study_category: true,
      meta: true,
      layout: true,
    },
  })

  const cards = caseStudies.docs.map((doc) => {
    const preview = getCaseStudyListPreview(doc)
    return {
      title: doc.title,
      slug: doc.slug,
      case_study_categories: doc.case_study_categories,
      primary_case_study_category: doc.primary_case_study_category,
      meta: doc.meta,
      previewTitle: preview.previewTitle,
      previewText: preview.previewText,
      previewImage: preview.previewImage,
    }
  })

  const heading = category.case_study_long_title || category.title

  return (
    <article className="pt-16 pb-24">
      <PageClient theme="light" />
      <PayloadRedirects disableNotFound url={url} />
      {draft && <LivePreviewListener />}

      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>{heading}</h1>
        </div>

        {hasRichTextContent(category.case_study_description) && (
          <div className="mt-8">
            <RichText
              data={category.case_study_description as Record<string, unknown>}
              enableGutter={false}
            />
          </div>
        )}

        {category.case_study_image && typeof category.case_study_image === 'object' && (
          <div className="mt-8 max-w-[48rem]">
            <Media resource={category.case_study_image} size="100vw" />
          </div>
        )}
      </div>

      <div className="mb-16">
        {cards.length > 0 ? (
          <CaseStudyArchive docs={cards} />
        ) : (
          <div className="container">
            <p>No case studies in this category yet.</p>
          </div>
        )}
      </div>

      {category.layout && category.layout.length > 0 && (
        <RenderBlocks blocks={category.layout as Parameters<typeof RenderBlocks>[0]['blocks']} />
      )}
    </article>
  )
}

async function renderCaseStudyPage(categorySlug: string | null, caseStudySlug: string) {
  const { isEnabled: draft } = await draftMode()
  const url = categorySlug
    ? `/case-study/${categorySlug}/${caseStudySlug}`
    : `/case-study/${caseStudySlug}`
  const caseStudy = await queryCaseStudyBySlug({ slug: caseStudySlug })

  if (!caseStudy) return <PayloadRedirects url={url} />

  const primaryCategorySlug = getCategorySlug(caseStudy.primary_case_study_category)
  if (categorySlug) {
    if (primaryCategorySlug !== categorySlug) notFound()
  } else if (primaryCategorySlug) {
    notFound()
  }

  const { hero, layout, case_study_long_title, title } = caseStudy
  const heading = case_study_long_title || title

  return (
    <article className="pt-16 pb-16">
      <PageClient theme="dark" />
      <PayloadRedirects disableNotFound url={url} />
      {draft && <LivePreviewListener />}

      <div className="container mb-8">
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">{heading}</h1>
      </div>

      <RenderHero {...hero} />
      {layout && layout.length > 0 && (
        <RenderBlocks blocks={layout as Parameters<typeof RenderBlocks>[0]['blocks']} />
      )}
    </article>
  )
}

const queryCaseStudyBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'case-studies',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    depth: 1,
    where: {
      slug: { equals: slug },
    },
  })

  return result.docs?.[0] || null
})

const queryCategoryBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'case-study-categories',
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    where: {
      slug: { equals: slug },
    },
  })

  return result.docs?.[0] || null
})
