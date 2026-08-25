import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath } from 'next/cache'

import type { Category } from '../payload-types'
import { getCategoryUrl } from '../utilities/getContentUrls'

const safeRevalidatePath = (path: string) => {
  try {
    revalidatePath(path)
  } catch {
    // Payload scripts and nested-docs resave run outside a Next.js request.
  }
}

export const revalidateCategory: CollectionAfterChangeHook<Category> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    const path = getCategoryUrl(doc)
    if (path) {
      payload.logger.info(`Revalidating category at path: ${path}`)
      safeRevalidatePath(path)
    }
    safeRevalidatePath('/')

    if (previousDoc?.slug && previousDoc.slug !== doc.slug) {
      const oldPath = getCategoryUrl(previousDoc)
      if (oldPath) {
        payload.logger.info(`Revalidating old category at path: ${oldPath}`)
        safeRevalidatePath(oldPath)
      }
    }
  }

  return doc
}

export const revalidateCategoryDelete: CollectionAfterDeleteHook<Category> = ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate) {
    const path = getCategoryUrl(doc)
    if (path) safeRevalidatePath(path)
    safeRevalidatePath('/')
  }

  return doc
}
