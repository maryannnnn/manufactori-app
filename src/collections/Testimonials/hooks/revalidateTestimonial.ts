import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import { getTestimonialUrl } from '../../../utilities/getContentUrls'

type TestimonialDoc = {
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

export const revalidateTestimonial: CollectionAfterChangeHook<TestimonialDoc> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = getTestimonialUrl(doc)
      if (path) {
        payload.logger.info(`Revalidating testimonial at path: ${path}`)
        safeRevalidatePath(path)
      }
      safeRevalidatePath('/')
      safeRevalidateTag('testimonials-sitemap')
    }

    if (previousDoc._status === 'published' && doc._status !== 'published') {
      const oldPath = getTestimonialUrl(previousDoc)
      if (oldPath) {
        payload.logger.info(`Revalidating old testimonial at path: ${oldPath}`)
        safeRevalidatePath(oldPath)
      }
      safeRevalidatePath('/')
      safeRevalidateTag('testimonials-sitemap')
    }
  }
  return doc
}

export const revalidateTestimonialDelete: CollectionAfterDeleteHook<TestimonialDoc> = ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate) {
    const path = getTestimonialUrl(doc)
    if (path) safeRevalidatePath(path)
    safeRevalidatePath('/')
    safeRevalidateTag('testimonials-sitemap')
  }
  return doc
}
