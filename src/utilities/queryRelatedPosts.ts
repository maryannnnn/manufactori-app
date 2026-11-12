import type { Payload } from 'payload'

import type { Post } from '@/payload-types'
import { getPostListPreview } from '@/utilities/getPostListPreview'

type RelatedPostCard = Pick<
  Post,
  'id' | 'title' | 'slug' | 'publishedAt' | 'categories' | 'primary_category' | 'meta'
> & {
  previewTitle?: string | null
  previewText?: string | null
  previewImage?: Post['meta'] extends { image?: infer I } | null | undefined ? I : never
}

/**
 * Related posts nested under a parent at depth 1 keep relationship IDs only,
 * so getPostUrl() would fall back to /blog/{slug} and 404. Re-query with
 * depth 1 so primary_category (and categories) include slugs.
 */
export const queryRelatedPostsForCards = async (
  payload: Payload,
  related: Post['relatedPosts'] | null | undefined,
): Promise<RelatedPostCard[]> => {
  const ids = (related ?? [])
    .map((item) => {
      if (typeof item === 'number' && Number.isFinite(item)) return item
      if (typeof item === 'string' && /^\d+$/.test(item)) return Number(item)
      if (item && typeof item === 'object' && 'id' in item) return Number(item.id)
      return null
    })
    .filter((id): id is number => typeof id === 'number' && Number.isFinite(id))

  if (!ids.length) return []

  const result = await payload.find({
    collection: 'posts',
    depth: 1,
    draft: false,
    limit: ids.length,
    overrideAccess: false,
    pagination: false,
    where: {
      and: [{ id: { in: ids } }, { _status: { equals: 'published' } }],
    },
    select: {
      title: true,
      slug: true,
      publishedAt: true,
      categories: true,
      primary_category: true,
      meta: true,
      layout: true,
    },
  })

  const byId = new Map(result.docs.map((doc) => [doc.id, doc]))

  return ids.flatMap((id) => {
    const doc = byId.get(id)
    if (!doc?.slug) return []
    const preview = getPostListPreview(doc)
    return [
      {
        id: doc.id,
        title: doc.title,
        slug: doc.slug,
        publishedAt: doc.publishedAt,
        categories: doc.categories,
        primary_category: doc.primary_category,
        meta: doc.meta,
        previewTitle: preview.previewTitle,
        previewText: preview.previewText,
        previewImage: preview.previewImage,
      },
    ]
  })
}
