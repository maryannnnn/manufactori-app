import type { CollectionSlug, Endpoint, PayloadRequest, Where } from 'payload'

import {
  CATEGORY_TYPE_TO_COLLECTION,
  type CategoryType,
} from '@/utilities/categoryTypes'

type BulkCreateBody = {
  categoryType?: CategoryType
  parentId?: number | string | null
  titles?: string[]
}

type CreateResult =
  | { title: string; status: 'created'; id: number | string; slug: string }
  | { title: string; status: 'skipped'; reason: string; existingId?: number | string }
  | { title: string; status: 'error'; reason: string }

const isCategoryType = (value: unknown): value is CategoryType =>
  value === 'site' || value === 'post' || value === 'case-study'

const toParentId = (value: unknown): number | string | null => {
  if (value == null || value === '') return null

  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }

  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (!trimmed) return null
    // HTML <select> always sends strings; Postgres relationship IDs are numbers.
    if (/^\d+$/.test(trimmed)) {
      return Number(trimmed)
    }
    return trimmed
  }

  return null
}

const buildCreateData = (
  categoryType: CategoryType,
  title: string,
  parentId: number | string | null,
): Record<string, unknown> => {
  const data: Record<string, unknown> = {
    title,
    generateSlug: true,
  }

  if (parentId != null) {
    data.parent = parentId
  }

  // Actual field names from Collections (not inventing post_category_long_title).
  if (categoryType === 'post') {
    data.category_long_title = title
  }

  if (categoryType === 'case-study') {
    data.case_study_long_title = title
  }

  return data
}

export const bulkCreateCategoriesHandler = async (req: PayloadRequest): Promise<Response> => {
  if (!req.user) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 })
  }

  let body: BulkCreateBody
  try {
    body = (await req.json?.()) as BulkCreateBody
  } catch {
    return Response.json({ message: 'Invalid JSON body' }, { status: 400 })
  }

  const { categoryType, titles } = body
  const parentId = toParentId(body.parentId)

  if (!isCategoryType(categoryType)) {
    return Response.json(
      { message: 'categoryType must be one of: site, post, case-study' },
      { status: 400 },
    )
  }

  if (!Array.isArray(titles) || titles.length === 0) {
    return Response.json({ message: 'Provide at least one category title' }, { status: 400 })
  }

  const collection = CATEGORY_TYPE_TO_COLLECTION[categoryType] as CollectionSlug
  const { formatCategorySlug } = await import('@/utilities/formatCategorySlug')

  const normalizedTitles = titles
    .map((title) => (typeof title === 'string' ? title.trim() : ''))
    .filter(Boolean)

  if (normalizedTitles.length === 0) {
    return Response.json({ message: 'Provide at least one non-empty title' }, { status: 400 })
  }

  const results: CreateResult[] = []
  const seenSlugs = new Set<string>()
  const seenTitles = new Set<string>()

  const parentWhere: Where =
    parentId == null
      ? {
          or: [{ parent: { equals: null } }, { parent: { exists: false } }],
        }
      : { parent: { equals: parentId } }

  for (const title of normalizedTitles) {
    const slug = formatCategorySlug(title)
    const titleKey = title.toLowerCase()

    if (!slug) {
      results.push({
        title,
        status: 'error',
        reason: 'Could not generate a valid slug from this title',
      })
      continue
    }

    if (seenSlugs.has(slug) || seenTitles.has(titleKey)) {
      results.push({
        title,
        status: 'skipped',
        reason: `Duplicate title/slug in this batch ("${slug}")`,
      })
      continue
    }
    seenSlugs.add(slug)
    seenTitles.add(titleKey)

    // Same parent: skip if title or slug already exists there.
    const underParent = await req.payload.find({
      collection,
      depth: 0,
      limit: 1,
      pagination: false,
      overrideAccess: false,
      user: req.user,
      where: {
        and: [
          parentWhere,
          {
            or: [{ slug: { equals: slug } }, { title: { equals: title } }],
          },
        ],
      },
      select: {
        id: true,
        title: true,
        slug: true,
        parent: true,
      },
    })

    if (underParent.docs.length > 0) {
      const doc = underParent.docs[0] as { id: number | string; slug?: string | null }
      results.push({
        title,
        status: 'skipped',
        existingId: doc.id,
        reason: `Already exists under the selected parent (slug: ${doc.slug || slug})`,
      })
      continue
    }

    // Slugs are unique collection-wide — skip if taken under another parent.
    const slugElsewhere = await req.payload.find({
      collection,
      depth: 0,
      limit: 1,
      pagination: false,
      overrideAccess: false,
      user: req.user,
      where: {
        slug: { equals: slug },
      },
      select: {
        id: true,
        slug: true,
      },
    })

    if (slugElsewhere.docs.length > 0) {
      results.push({
        title,
        status: 'skipped',
        existingId: slugElsewhere.docs[0].id,
        reason: `Slug "${slug}" already exists in this collection`,
      })
      continue
    }

    try {
      const created = await req.payload.create({
        collection,
        data: buildCreateData(categoryType, title, parentId) as never,
        overrideAccess: false,
        user: req.user,
        req,
      })

      results.push({
        title,
        status: 'created',
        id: created.id,
        slug: (created as { slug?: string }).slug || slug,
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Create failed'
      results.push({
        title,
        status: 'error',
        reason: message,
      })
    }
  }

  const created = results.filter((r) => r.status === 'created').length
  const skipped = results.filter((r) => r.status === 'skipped').length
  const failed = results.filter((r) => r.status === 'error').length

  return Response.json({
    collection,
    categoryType,
    parentId,
    summary: { created, skipped, failed, total: results.length },
    results,
  })
}

export const bulkCreateCategoriesEndpoint: Endpoint = {
  path: '/bulk-create-categories',
  method: 'post',
  handler: bulkCreateCategoriesHandler,
}
