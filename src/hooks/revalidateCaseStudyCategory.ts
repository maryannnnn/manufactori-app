import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath } from 'next/cache'

import type { CaseStudyCategory } from '../payload-types'
import { getCaseStudyCategoryUrl } from '../utilities/getContentUrls'

const safeRevalidatePath = (path: string) => {
  try {
    revalidatePath(path)
  } catch {
    // Payload scripts and nested-docs resave run outside a Next.js request.
  }
}

export const revalidateCaseStudyCategory: CollectionAfterChangeHook<CaseStudyCategory> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    const path = getCaseStudyCategoryUrl(doc)
    if (path) {
      payload.logger.info(`Revalidating case study category at path: ${path}`)
      safeRevalidatePath(path)
    }

    if (previousDoc?.slug && previousDoc.slug !== doc.slug) {
      const oldPath = getCaseStudyCategoryUrl(previousDoc)
      if (oldPath) {
        payload.logger.info(`Revalidating old case study category at path: ${oldPath}`)
        safeRevalidatePath(oldPath)
      }
    }
  }

  return doc
}

export const revalidateCaseStudyCategoryDelete: CollectionAfterDeleteHook<CaseStudyCategory> = ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate) {
    const path = getCaseStudyCategoryUrl(doc)
    if (path) safeRevalidatePath(path)
  }

  return doc
}
