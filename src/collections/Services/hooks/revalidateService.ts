import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import { getServiceUrl } from '../../../utilities/getContentUrls'

type ServiceDoc = {
  id: number
  slug?: string | null
  _status?: string | null
}

const safeRevalidatePath = (path: string) => {
  try {
    revalidatePath(path)
  } catch {
    // Scripts / nested ops outside Next request.
  }
}

const safeRevalidateTag = (tag: string) => {
  try {
    revalidateTag(tag, 'max')
  } catch {
    // Scripts / nested ops outside Next request.
  }
}

const resolveServicePath = (doc: ServiceDoc): string | null => getServiceUrl(doc)

export const revalidateService: CollectionAfterChangeHook<ServiceDoc> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = resolveServicePath(doc)
      if (path) {
        payload.logger.info(`Revalidating service at path: ${path}`)
        safeRevalidatePath(path)
      }
      safeRevalidatePath('/services')
      safeRevalidateTag('services-sitemap')
    }

    if (previousDoc._status === 'published' && doc._status !== 'published') {
      const oldPath = resolveServicePath(previousDoc)
      if (oldPath) {
        payload.logger.info(`Revalidating old service at path: ${oldPath}`)
        safeRevalidatePath(oldPath)
      }
      safeRevalidatePath('/services')
      safeRevalidateTag('services-sitemap')
    }
  }
  return doc
}

export const revalidateServiceDelete: CollectionAfterDeleteHook<ServiceDoc> = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    const path = resolveServicePath(doc)
    if (path) safeRevalidatePath(path)
    safeRevalidatePath('/services')
    safeRevalidateTag('services-sitemap')
  }
  return doc
}
