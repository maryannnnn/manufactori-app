import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath } from 'next/cache'

import type { Category } from '../payload-types'
import { getCategoryUrl } from '../utilities/getContentUrls'

export const revalidateCategory: CollectionAfterChangeHook<Category> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    const path = getCategoryUrl(doc)
    if (path) {
      payload.logger.info(`Revalidating category at path: ${path}`)
      revalidatePath(path)
    }

    if (previousDoc?.slug && previousDoc.slug !== doc.slug) {
      const oldPath = getCategoryUrl(previousDoc)
      if (oldPath) {
        payload.logger.info(`Revalidating old category at path: ${oldPath}`)
        revalidatePath(oldPath)
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
    if (path) revalidatePath(path)
  }

  return doc
}
