import { sql } from '@payloadcms/db-postgres/drizzle'
import type { Where } from 'payload'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

import type { CardPostData } from '@/components/Card'

import { getPostListPreview } from './getPostListPreview'

/** Matches the Case Studies archive: three cards per row on desktop. */
export const POSTS_PAGE_SIZE = 9

type Args = {
  page?: number
  search?: string
}

export type PostListResult = {
  docs: CardPostData[]
  page: number
  totalDocs: number
  totalPages: number
}

const emptyResult = (page: number): PostListResult => ({
  docs: [],
  page,
  totalDocs: 0,
  totalPages: 0,
})

const toIds = (docs: { id: number | string }[]): (number | string)[] => docs.map((doc) => doc.id)

type DrizzleRow = { id?: number | string }

const readExecuteRows = (result: unknown): DrizzleRow[] => {
  if (Array.isArray(result)) return result as DrizzleRow[]
  if (result && typeof result === 'object' && 'rows' in result) {
    const rows = (result as { rows?: unknown }).rows
    if (Array.isArray(rows)) return rows as DrizzleRow[]
  }
  return []
}

/**
 * Title/meta are plain columns. Preview body and layout content are jsonb, so
 * Payload `like` would emit `jsonb ILIKE` and fail. Cast those columns to text
 * in a separate ID lookup, then load the page by `id`.
 */
const collectMatchingPostIds = async (
  payload: Awaited<ReturnType<typeof getPayload>>,
  search: string,
): Promise<(number | string)[]> => {
  const titleMatches = await payload.find({
    collection: 'posts',
    depth: 0,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: { slug: true },
    where: {
      or: [
        { title: { like: search } },
        { postLongTitle: { like: search } },
        { 'layout.postPreviewTitle': { like: search } },
        { 'meta.title': { like: search } },
        { 'meta.description': { like: search } },
      ],
    },
  })

  const pattern = `%${search.replace(/[%_]/g, ' ')}%`
  const contentMatches = await payload.db.drizzle.execute(sql`
    SELECT DISTINCT p.id
    FROM posts p
    LEFT JOIN posts_blocks_post_preview_block prev ON prev._parent_id = p.id
    LEFT JOIN posts_blocks_post_content_block cont ON cont._parent_id = p.id
    LEFT JOIN posts_blocks_post_content_block_columns col ON col._parent_id = cont.id
    WHERE p._status = 'published'
      AND (
        COALESCE(prev.post_preview_text::text, '') ILIKE ${pattern}
        OR COALESCE(col.rich_text::text, '') ILIKE ${pattern}
      )
  `)

  return [
    ...new Set([
      ...toIds(titleMatches.docs),
      ...readExecuteRows(contentMatches)
        .map((row) => row.id)
        .filter((id): id is number | string => id != null),
    ]),
  ]
}

/**
 * Paginated Posts query for /blog. Only one page of documents is fetched.
 */
export const getPostList = async ({ page = 1, search }: Args): Promise<PostListResult> => {
  const payload = await getPayload({ config: configPromise })
  const trimmed = search?.trim()

  let where: Where | undefined
  if (trimmed) {
    const ids = await collectMatchingPostIds(payload, trimmed)
    if (ids.length === 0) return emptyResult(page)
    where = { id: { in: ids } }
  }

  const result = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: POSTS_PAGE_SIZE,
    overrideAccess: false,
    page,
    sort: '-publishedAt',
    select: {
      title: true,
      slug: true,
      publishedAt: true,
      categories: true,
      primary_category: true,
      meta: true,
      layout: true,
    },
    ...(where ? { where } : {}),
  })

  return {
    docs: result.docs.map((doc) => {
      const preview = getPostListPreview(doc)

      return {
        title: doc.title,
        slug: doc.slug,
        publishedAt: doc.publishedAt,
        categories: doc.categories,
        primary_category: doc.primary_category,
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
