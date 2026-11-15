import type { Media } from '@/payload-types'
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import { cache } from 'react'

import configPromise from '@payload-config'
import { extractFaqPairsFromRichText } from '@/utilities/extractFaqPairsFromRichText'
import type { FaqSourceFilter } from '@/utilities/feedArchive'
import {
  getCaseStudyUrl,
  getIndustryUrl,
  getPostUrl,
  getServiceUrl,
} from '@/utilities/getContentUrls'
import { getCaseStudyListPreview } from '@/utilities/getCaseStudyListPreview'
import { resolveMediaSource, toNextImageSrc } from '@/utilities/getMediaUrl'
import { getPostListPreview } from '@/utilities/getPostListPreview'
import { richTextToPlainText } from '@/utilities/richText/toPlainText'

export type AggregatedFaqSource = 'services' | 'case-studies' | 'industries' | 'posts'

export type AggregatedFaqPreviewImage = {
  src: string
  alt: string
  width?: number
  height?: number
}

export type AggregatedFaqItem = {
  key: string
  question: string
  answerPlain: string
  sourceCollection: AggregatedFaqSource
  sourceKindLabel: string
  sourceTitle: string
  sourceHref: string
  previewImage?: AggregatedFaqPreviewImage | null
}

export type FaqQuota = Partial<Record<AggregatedFaqSource, number>>

export type ListedFaqsResult = {
  items: AggregatedFaqItem[]
  totalDocs: number
  totalPages: number
  page: number
  limit: number
}

/** Stable rotation so landing feeds vary by day without Math.random during SSR. */
const rotateByDay = <T,>(items: T[]): T[] => {
  if (items.length <= 1) return items.slice()
  const day = Math.floor(Date.now() / (1000 * 60 * 60 * 24))
  const offset = day % items.length
  return [...items.slice(offset), ...items.slice(0, offset)]
}

const mediaToPreview = (
  media: Media | number | null | undefined,
  fallbackAlt: string,
): AggregatedFaqPreviewImage | null => {
  if (!media || typeof media !== 'object') return null
  const resolved = resolveMediaSource(media, ['thumbnail', 'square', 'small', 'medium'])
  if (!resolved.src) return null
  return {
    src: toNextImageSrc(resolved.src),
    alt: media.alt || fallbackAlt,
    width: resolved.width,
    height: resolved.height,
  }
}

const dedupeFaqs = (items: AggregatedFaqItem[]): AggregatedFaqItem[] => {
  const usedKeys = new Set<string>()
  const usedQuestions = new Set<string>()
  const out: AggregatedFaqItem[] = []
  for (const item of items) {
    const q = item.question.toLowerCase()
    if (usedKeys.has(item.key) || usedQuestions.has(q)) continue
    usedKeys.add(item.key)
    usedQuestions.add(q)
    out.push(item)
  }
  return out
}

export const AGGREGATED_FAQS_CACHE_TAG = 'aggregated-faqs'

const loadAllFaqs = async (): Promise<AggregatedFaqItem[]> => {
  const payload = await getPayload({ config: configPromise })
  const items: AggregatedFaqItem[] = []

  // Sequential finds avoid exhausting the local Postgres pool under Turbopack.
  const services = await payload.find({
    collection: 'services',
    depth: 1,
    draft: false,
    limit: 200,
    overrideAccess: false,
    pagination: false,
    where: { _status: { equals: 'published' } },
    select: {
      title: true,
      slug: true,
      faq: true,
      service_preview_image: true,
      service_card_image: true,
      meta: true,
    },
  })
  const industries = await payload.find({
    collection: 'industries',
    depth: 1,
    draft: false,
    limit: 200,
    overrideAccess: false,
    pagination: false,
    where: { _status: { equals: 'published' } },
    select: {
      title: true,
      slug: true,
      industryLevel: true,
      parentIndustry: true,
      faq: true,
      industryPreviewImage: true,
      meta: true,
    },
  })
  const caseStudies = await payload.find({
    collection: 'case-studies',
    depth: 1,
    draft: false,
    limit: 100,
    overrideAccess: false,
    pagination: false,
    where: { _status: { equals: 'published' } },
    select: {
      title: true,
      slug: true,
      primary_case_study_category: true,
      layout: true,
      meta: true,
    },
  })
  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    draft: false,
    limit: 200,
    overrideAccess: false,
    pagination: false,
    sort: '-publishedAt',
    where: { _status: { equals: 'published' } },
    select: {
      title: true,
      slug: true,
      primary_category: true,
      layout: true,
      meta: true,
    },
  })

  for (const service of services.docs) {
    const href = getServiceUrl(service)
    if (!href) continue
    const previewImage =
      mediaToPreview(
        typeof service.service_preview_image === 'object' ? service.service_preview_image : null,
        service.title,
      ) ||
      mediaToPreview(
        typeof service.service_card_image === 'object' ? service.service_card_image : null,
        service.title,
      ) ||
      mediaToPreview(
        typeof service.meta?.image === 'object' ? service.meta.image : null,
        service.title,
      )
    for (const [index, row] of (service.faq?.items ?? []).entries()) {
      const question = row?.question?.trim()
      const answerPlain = richTextToPlainText(row?.answer)
      if (!question || !answerPlain) continue
      items.push({
        key: `service-${service.id}-${row.id || index}`,
        question,
        answerPlain,
        sourceCollection: 'services',
        sourceKindLabel: 'Services',
        sourceTitle: service.title,
        sourceHref: href,
        previewImage,
      })
    }
  }

  for (const industry of industries.docs) {
    const href = getIndustryUrl({
      slug: industry.slug,
      industryLevel: industry.industryLevel,
      parentIndustry:
        industry.parentIndustry && typeof industry.parentIndustry === 'object'
          ? industry.parentIndustry
          : null,
      parentSlug:
        industry.parentIndustry && typeof industry.parentIndustry === 'object'
          ? industry.parentIndustry.slug
          : null,
    })
    if (!href) continue
    const previewImage =
      mediaToPreview(
        typeof industry.industryPreviewImage === 'object' ? industry.industryPreviewImage : null,
        industry.title,
      ) ||
      mediaToPreview(
        typeof industry.meta?.image === 'object' ? industry.meta.image : null,
        industry.title,
      )
    for (const [index, row] of (industry.faq ?? []).entries()) {
      const question = row?.question?.trim()
      const answerPlain = richTextToPlainText(row?.answer)
      if (!question || !answerPlain) continue
      items.push({
        key: `industry-${industry.id}-${row.id || index}`,
        question,
        answerPlain,
        sourceCollection: 'industries',
        sourceKindLabel: 'Industrial',
        sourceTitle: industry.title,
        sourceHref: href,
        previewImage,
      })
    }
  }

  for (const study of caseStudies.docs) {
    const href = getCaseStudyUrl(study)
    if (!href) continue
    const previewImage = mediaToPreview(
      getCaseStudyListPreview(study).previewImage,
      study.title,
    )
    for (const block of study.layout ?? []) {
      if (block.blockType !== 'csFAQ') continue
      for (const [index, row] of (block.items ?? []).entries()) {
        const question = row?.question?.trim()
        const answerPlain = richTextToPlainText(row?.answer)
        if (!question || !answerPlain) continue
        items.push({
          key: `case-${study.id}-${row.id || index}`,
          question,
          answerPlain,
          sourceCollection: 'case-studies',
          sourceKindLabel: 'Case Study',
          sourceTitle: study.title,
          sourceHref: href,
          previewImage,
        })
      }
    }
  }

  for (const post of posts.docs) {
    const href = getPostUrl(post)
    if (!href) continue
    const previewImage = mediaToPreview(getPostListPreview(post).previewImage, post.title)
    for (const block of post.layout ?? []) {
      if (block.blockType !== 'postFAQBlock') continue
      const pairs = extractFaqPairsFromRichText(block.postFAQText)
      for (const [index, pair] of pairs.entries()) {
        items.push({
          key: `post-${post.id}-${index}-${pair.question.slice(0, 24)}`,
          question: pair.question,
          answerPlain: pair.answer,
          sourceCollection: 'posts',
          sourceKindLabel: 'Blog',
          sourceTitle: post.title,
          sourceHref: href,
          previewImage,
        })
      }
    }
  }

  return dedupeFaqs(items)
}

const collectAllFaqsCached = unstable_cache(loadAllFaqs, ['aggregated-faqs-all'], {
  tags: [AGGREGATED_FAQS_CACHE_TAG],
  revalidate: 3600,
})

const collectAllFaqs = cache(async (): Promise<AggregatedFaqItem[]> => collectAllFaqsCached())

/**
 * Selects FAQ items with preferred per-collection quotas, then fills from any
 * remaining published sources so the section still reaches `limit` when possible.
 */
export const queryAggregatedFaqs = cache(
  async ({
    limit = 5,
    quota,
    allow,
  }: {
    limit?: number
    quota?: FaqQuota
    allow?: AggregatedFaqSource[]
  } = {}): Promise<AggregatedFaqItem[]> => {
    const all = await collectAllFaqs()
    const allowed = new Set(
      allow ?? (['services', 'case-studies', 'industries', 'posts'] as AggregatedFaqSource[]),
    )
    const pool = all.filter((item) => allowed.has(item.sourceCollection))
    const selected: AggregatedFaqItem[] = []
    const usedQuestions = new Set<string>()
    const usedKeys = new Set<string>()

    const take = (item: AggregatedFaqItem) => {
      const q = item.question.toLowerCase()
      if (usedKeys.has(item.key) || usedQuestions.has(q)) return false
      usedKeys.add(item.key)
      usedQuestions.add(q)
      selected.push(item)
      return true
    }

    const bySource = (source: AggregatedFaqSource) =>
      rotateByDay(pool.filter((item) => item.sourceCollection === source))

    if (quota) {
      for (const [source, count] of Object.entries(quota) as [AggregatedFaqSource, number][]) {
        if (!count || !allowed.has(source)) continue
        let taken = 0
        for (const item of bySource(source)) {
          if (selected.length >= limit || taken >= count) break
          if (take(item)) taken += 1
        }
      }
    }

    if (selected.length < limit) {
      const usedSources = new Set(selected.map((item) => item.sourceCollection))
      const preferred = rotateByDay(pool.filter((item) => !usedSources.has(item.sourceCollection)))
      const rest = rotateByDay(pool)
      for (const item of [...preferred, ...rest]) {
        if (selected.length >= limit) break
        take(item)
      }
    }

    return selected.slice(0, limit)
  },
)

/** Full searchable / filterable FAQ archive for /questions-answers. */
export const queryListedFaqs = cache(
  async ({
    page = 1,
    limit = 20,
    search,
    source = 'all',
  }: {
    page?: number
    limit?: number
    search?: string
    source?: FaqSourceFilter
  } = {}): Promise<ListedFaqsResult> => {
    const all = await collectAllFaqs()
    const needle = search?.trim().toLowerCase()
    const filtered = all.filter((item) => {
      if (source !== 'all' && item.sourceCollection !== source) return false
      if (!needle) return true
      return (
        item.question.toLowerCase().includes(needle) ||
        item.answerPlain.toLowerCase().includes(needle) ||
        item.sourceTitle.toLowerCase().includes(needle)
      )
    })

    const totalDocs = filtered.length
    const totalPages = Math.max(1, Math.ceil(totalDocs / limit) || 1)
    const safePage = Math.min(Math.max(1, page), totalPages)
    const start = (safePage - 1) * limit

    return {
      items: filtered.slice(start, start + limit),
      totalDocs,
      totalPages: totalDocs === 0 ? 0 : totalPages,
      page: safePage,
      limit,
    }
  },
)
