import type { Where } from 'payload'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

import type { CaseStudyCardData } from '@/components/CaseStudyCard'

import { getCaseStudyListPreview } from './getCaseStudyListPreview'

/** Single source of truth for the Case Studies archive page size. */
export const CASE_STUDIES_PAGE_SIZE = 9

type Args = {
  page?: number
  search?: string
}

export type CaseStudyListResult = {
  docs: CaseStudyCardData[]
  page: number
  totalDocs: number
  totalPages: number
}

/**
 * Builds the `where` clause for archive search.
 *
 * Preview titles live in the `csPreview` layout block, so they are matched via
 * the block field path alongside the plain columns.
 */
export const buildCaseStudySearchWhere = (search: string): Where => ({
  or: [
    { title: { like: search } },
    { case_study_long_title: { like: search } },
    { 'layout.case_study_preview_title': { like: search } },
    { 'meta.title': { like: search } },
    { 'meta.description': { like: search } },
  ],
})

/**
 * Server-side, paginated Case Study query for the /case-study archive. Only a
 * single page of documents is ever fetched.
 */
export const getCaseStudyList = async ({ page = 1, search }: Args): Promise<CaseStudyListResult> => {
  const payload = await getPayload({ config: configPromise })
  const trimmed = search?.trim()

  const result = await payload.find({
    collection: 'case-studies',
    depth: 1,
    limit: CASE_STUDIES_PAGE_SIZE,
    overrideAccess: false,
    page,
    // Editorially curated first, then the manual order, then newest.
    sort: ['-featured', 'displayOrder', '-publishedAt'],
    select: {
      title: true,
      slug: true,
      case_study_long_title: true,
      case_study_categories: true,
      primary_case_study_category: true,
      featured: true,
      displayOrder: true,
      meta: true,
      layout: true,
    },
    ...(trimmed ? { where: buildCaseStudySearchWhere(trimmed) } : {}),
  })

  return {
    docs: result.docs.map((doc) => {
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
    }),
    page: result.page ?? 1,
    totalDocs: result.totalDocs,
    totalPages: result.totalPages,
  }
}
