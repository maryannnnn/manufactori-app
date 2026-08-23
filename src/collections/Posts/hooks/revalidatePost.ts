import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, Payload } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Post } from '../../../payload-types'
import { getPostUrl } from '../../../utilities/getContentUrls'

const resolvePostPath = async (payload: Payload, doc: Post): Promise<string | null> => {
  const fromDoc = getPostUrl(doc)
  if (fromDoc) return fromDoc

  if (!doc.slug || doc.primary_category == null || typeof doc.primary_category === 'object') {
    return null
  }

  const category = await payload.findByID({
    collection: 'categories',
    id: doc.primary_category,
    depth: 0,
    disableErrors: true,
    select: { slug: true },
  })

  return getPostUrl({
    slug: doc.slug,
    primary_category_slug: category?.slug,
  })
}

export const revalidatePost: CollectionAfterChangeHook<Post> = async ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = await resolvePostPath(payload, doc)

      if (path) {
        payload.logger.info(`Revalidating post at path: ${path}`)
        revalidatePath(path)
      }
      revalidateTag('posts-sitemap', 'max')
    }

    if (previousDoc._status === 'published' && doc._status !== 'published') {
      const oldPath = await resolvePostPath(payload, previousDoc)

      if (oldPath) {
        payload.logger.info(`Revalidating old post at path: ${oldPath}`)
        revalidatePath(oldPath)
      }
      revalidateTag('posts-sitemap', 'max')
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Post> = async ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    const path = await resolvePostPath(payload, doc)

    if (path) {
      revalidatePath(path)
    }
    revalidateTag('posts-sitemap', 'max')
  }

  return doc
}
