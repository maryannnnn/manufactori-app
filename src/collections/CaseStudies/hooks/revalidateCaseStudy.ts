import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, Payload } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import { getCaseStudyUrl } from '../../../utilities/getContentUrls'

type CaseStudyDoc = {
  id: number
  slug?: string | null
  _status?: string | null
  primary_case_study_category?: number | string | { slug?: string | null } | null
}

const safeRevalidatePath = (path: string) => {
  try {
    revalidatePath(path)
  } catch {
    // Scripts / nested ops outside Next request.
  }
}

const resolveCaseStudyPath = async (
  payload: Payload,
  doc: CaseStudyDoc,
): Promise<string | null> => {
  const fromDoc = getCaseStudyUrl(doc)
  if (fromDoc) return fromDoc

  if (
    !doc.slug ||
    doc.primary_case_study_category == null ||
    typeof doc.primary_case_study_category === 'object'
  ) {
    return null
  }

  const category = await payload.findByID({
    collection: 'case-study-categories',
    id: doc.primary_case_study_category,
    depth: 0,
    disableErrors: true,
    select: { slug: true },
  })

  return getCaseStudyUrl({
    slug: doc.slug,
    primary_case_study_category_slug: category?.slug,
  })
}

export const revalidateCaseStudy: CollectionAfterChangeHook<CaseStudyDoc> = async ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = await resolveCaseStudyPath(payload, doc)
      if (path) {
        payload.logger.info(`Revalidating case study at path: ${path}`)
        safeRevalidatePath(path)
      }
      revalidateTag('case-studies-sitemap', 'max')
    }

    if (previousDoc._status === 'published' && doc._status !== 'published') {
      const oldPath = await resolveCaseStudyPath(payload, previousDoc)
      if (oldPath) {
        payload.logger.info(`Revalidating old case study at path: ${oldPath}`)
        safeRevalidatePath(oldPath)
      }
      revalidateTag('case-studies-sitemap', 'max')
    }
  }
  return doc
}

export const revalidateCaseStudyDelete: CollectionAfterDeleteHook<CaseStudyDoc> = async ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    const path = await resolveCaseStudyPath(payload, doc)
    if (path) safeRevalidatePath(path)
    revalidateTag('case-studies-sitemap', 'max')
  }
  return doc
}
