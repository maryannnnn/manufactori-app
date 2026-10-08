import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import {
  ensureAssignedCategoriesSeo,
  type CategorySeoKind,
} from '@/utilities/ensureCategorySeoMetadata'
import { getCaseStudyCategoryUrl, getCategoryUrl } from '@/utilities/getContentUrls'

type DocLike = {
  primary_category?: unknown
  categories?: unknown
  primary_case_study_category?: unknown
  case_study_categories?: unknown
} | null

const categoryPaths = (kind: CategorySeoKind, ...docs: DocLike[]): string[] => {
  const paths = new Set<string>()

  for (const doc of docs) {
    if (!doc) continue
    const refs =
      kind === 'post'
        ? [doc.primary_category, ...(Array.isArray(doc.categories) ? doc.categories : [])]
        : [
            doc.primary_case_study_category,
            ...(Array.isArray(doc.case_study_categories) ? doc.case_study_categories : []),
          ]

    for (const ref of refs) {
      const path =
        kind === 'post' ? getCategoryUrl(ref as never) : getCaseStudyCategoryUrl(ref as never)
      if (path) paths.add(path)
    }
  }

  return [...paths]
}

const safeRevalidate = async (
  paths: string[],
  tag: 'posts-sitemap' | 'case-studies-sitemap',
) => {
  try {
    const { revalidatePath, revalidateTag } = await import('next/cache')
    for (const path of paths) {
      try {
        revalidatePath(path)
      } catch {
        // Scripts / nested ops outside Next request.
      }
    }
    try {
      revalidateTag(tag, 'max')
    } catch {
      // Scripts / nested ops outside Next request.
    }
  } catch {
    // next/cache unavailable outside Next.
  }
}

const syncKind = (kind: CategorySeoKind): CollectionAfterChangeHook => {
  return async ({ doc, previousDoc, req }) => {
    if (req.context.disableCategorySeo) return doc

    await ensureAssignedCategoriesSeo({
      payload: req.payload,
      kind,
      docs: [doc as Record<string, unknown>, previousDoc as Record<string, unknown>],
      req,
    })

    if (!req.context.disableRevalidate) {
      await safeRevalidate(
        categoryPaths(kind, doc as DocLike, previousDoc as DocLike),
        kind === 'post' ? 'posts-sitemap' : 'case-studies-sitemap',
      )
    }

    return doc
  }
}

const syncDeleteKind = (kind: CategorySeoKind): CollectionAfterDeleteHook => {
  return async ({ doc, req }) => {
    if (req.context.disableCategorySeo) return doc

    await ensureAssignedCategoriesSeo({
      payload: req.payload,
      kind,
      docs: [doc as Record<string, unknown>],
      req,
    })

    if (!req.context.disableRevalidate) {
      await safeRevalidate(
        categoryPaths(kind, doc as DocLike),
        kind === 'post' ? 'posts-sitemap' : 'case-studies-sitemap',
      )
    }

    return doc
  }
}

export const syncPostAssignedCategorySeo = syncKind('post')
export const syncPostAssignedCategorySeoDelete = syncDeleteKind('post')
export const syncCaseStudyAssignedCategorySeo = syncKind('case-study')
export const syncCaseStudyAssignedCategorySeoDelete = syncDeleteKind('case-study')
