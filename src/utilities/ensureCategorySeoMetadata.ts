import { generateJSON } from '@tiptap/html'
import type { Payload, PayloadRequest } from 'payload'

import { hasRichTextContent } from '@/utilities/richText/hasContent'
import { getTiptapExtensions } from '@/utilities/richText/extensions'
import { richTextToPlainText } from '@/utilities/richText/toPlainText'

export type CategorySeoKind = 'post' | 'case-study'

export type CategorySeoSnapshot = {
  id: number | string
  kind: CategorySeoKind
  title: string
  slug: string
  longTitle: string
  description: string
  seoTitle: string
  seoDescription: string
  publishedCount: number
  active: boolean
  changedFields: string[]
  peerId: number | string | null
}

export type CategoryRecord = {
  id: number | string
  title?: string | null
  slug?: string | null
  parent?: number | string | { title?: string | null } | null
  category_long_title?: string | null
  case_study_long_title?: string | null
  category_description?: unknown
  case_study_description?: unknown
  meta?: {
    title?: string | null
    description?: string | null
  } | null
}

const POST_COLLECTION = 'categories' as const
const CASE_STUDY_COLLECTION = 'case-study-categories' as const

const compactKey = (value: string): string =>
  value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/and/g, '')
    .replace(/[^a-z0-9]+/g, '')

const normalizeSpace = (value: string): string => value.replace(/\s+/g, ' ').trim()

const escapeHtml = (value: string): string =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const plainTextToRichText = (text: string) => {
  const paragraph = `<p>${escapeHtml(text)}</p>`
  return generateJSON(paragraph, getTiptapExtensions({ headingLevels: [2, 3, 4] }))
}

const isPlaceholderLongTitle = (title: string, longTitle: string): boolean => {
  const a = compactKey(title)
  const b = compactKey(longTitle)
  return !longTitle.trim() || a === b
}

export const isNearDuplicateText = (left: string, right: string): boolean => {
  const a = normalizeSpace(left).toLowerCase()
  const b = normalizeSpace(right).toLowerCase()
  if (!a || !b) return false
  if (a === b) return true

  const stripIntent = (value: string) =>
    compactKey(
      value.replace(
        /\b(insights?|articles?|guides?|expert content|case studies|case study|projects?|implementations?)\b/gi,
        '',
      ),
    )

  const sa = stripIntent(a)
  const sb = stripIntent(b)
  if (sa && sa === sb) return true

  const shorter = a.length <= b.length ? a : b
  const longer = a.length <= b.length ? b : a
  return shorter.length > 24 && longer.includes(shorter) && longer.length - shorter.length < 28
}

const clipDescription = (value: string, max = 500): string => {
  const trimmed = normalizeSpace(value)
  if (trimmed.length <= max) return trimmed
  const slice = trimmed.slice(0, max)
  const sentence = slice.lastIndexOf('.')
  if (sentence >= 320) return slice.slice(0, sentence + 1)
  return `${slice.slice(0, slice.lastIndexOf(' '))}`.trim()
}

const clipSeoDescription = (value: string): string => {
  const trimmed = normalizeSpace(value)
  if (trimmed.length <= 160) return trimmed
  const slice = trimmed.slice(0, 157)
  return `${slice.slice(0, slice.lastIndexOf(' '))}…`
}

const parentTitleOf = (doc: CategoryRecord): string | null => {
  if (doc.parent && typeof doc.parent === 'object' && doc.parent.title) return doc.parent.title
  return null
}

const readFields = (kind: CategorySeoKind, doc: CategoryRecord) => {
  const longTitle =
    kind === 'post' ? doc.category_long_title || '' : doc.case_study_long_title || ''
  const description =
    kind === 'post'
      ? richTextToPlainText(doc.category_description)
      : richTextToPlainText(doc.case_study_description)
  return {
    longTitle: longTitle.trim(),
    description: description.trim(),
    seoTitle: doc.meta?.title?.trim() || '',
    seoDescription: doc.meta?.description?.trim() || '',
  }
}

const collectionFor = (kind: CategorySeoKind) =>
  kind === 'post' ? POST_COLLECTION : CASE_STUDY_COLLECTION

const contentCollectionFor = (kind: CategorySeoKind) =>
  kind === 'post' ? ('posts' as const) : ('case-studies' as const)

const relationshipFieldFor = (kind: CategorySeoKind) =>
  kind === 'post' ? 'categories' : 'case_study_categories'

export const countPublishedInCategory = async (
  payload: Payload,
  kind: CategorySeoKind,
  categoryId: number | string,
): Promise<number> => {
  const result = await payload.find({
    collection: contentCollectionFor(kind),
    depth: 0,
    limit: 0,
    overrideAccess: true,
    pagination: true,
    where: {
      and: [
        { [relationshipFieldFor(kind)]: { in: [categoryId] } },
        { _status: { equals: 'published' } },
      ],
    },
  })

  return result.totalDocs
}

export const publishedCountsByCategory = async (
  payload: Payload,
  kind: CategorySeoKind,
): Promise<Map<string, number>> => {
  const result = await payload.find({
    collection: contentCollectionFor(kind),
    depth: 0,
    limit: 1000,
    overrideAccess: true,
    pagination: false,
    where: {
      _status: {
        equals: 'published',
      },
    },
    select:
      kind === 'post'
        ? { categories: true, primary_category: true }
        : { case_study_categories: true, primary_case_study_category: true },
  })

  const counts = new Map<string, number>()
  for (const doc of result.docs as unknown as Array<Record<string, unknown>>) {
    const unique = new Set(collectAssignedCategoryIds(kind, doc).map(String))
    for (const id of unique) {
      counts.set(id, (counts.get(id) || 0) + 1)
    }
  }
  return counts
}

const loadCategory = async (
  payload: Payload,
  kind: CategorySeoKind,
  categoryId: number | string,
): Promise<CategoryRecord | null> => {
  const doc = await payload.findByID({
    collection: collectionFor(kind),
    id: categoryId,
    depth: 1,
    disableErrors: true,
    overrideAccess: true,
  })
  return (doc as CategoryRecord | null) || null
}

export const categoriesAreEquivalent = (
  left: { title?: string | null; slug?: string | null },
  right: { title?: string | null; slug?: string | null },
): boolean => {
  const leftTitle = left.title?.trim()
  const rightTitle = right.title?.trim()
  const leftSlug = left.slug?.trim()
  const rightSlug = right.slug?.trim()

  if (leftSlug && rightSlug && compactKey(leftSlug) === compactKey(rightSlug)) return true
  if (leftTitle && rightTitle && compactKey(leftTitle) === compactKey(rightTitle)) return true
  return false
}

const peerCache = new WeakMap<Payload, Partial<Record<CategorySeoKind, CategoryRecord[]>>>()

const loadPublicCategories = async (
  payload: Payload,
  kind: CategorySeoKind,
): Promise<CategoryRecord[]> => {
  const cached = peerCache.get(payload)
  if (cached?.[kind]) return cached[kind]

  const select =
    kind === 'post'
      ? {
          title: true,
          slug: true,
          category_long_title: true,
          category_description: true,
          meta: true,
        }
      : {
          title: true,
          slug: true,
          case_study_long_title: true,
          case_study_description: true,
          meta: true,
        }

  const docs: CategoryRecord[] = []
  let page = 1
  let hasNextPage = true
  while (hasNextPage) {
    const result = await payload.find({
      collection: collectionFor(kind),
      depth: 0,
      limit: 100,
      page,
      overrideAccess: true,
      pagination: true,
      select: select as never,
    })
    docs.push(...(result.docs as CategoryRecord[]))
    hasNextPage = Boolean(result.hasNextPage)
    page += 1
  }

  peerCache.set(payload, { ...cached, [kind]: docs })
  return docs
}

const findPeerCategory = async (
  payload: Payload,
  kind: CategorySeoKind,
  doc: CategoryRecord,
): Promise<CategoryRecord | null> => {
  const otherKind: CategorySeoKind = kind === 'post' ? 'case-study' : 'post'
  const peers = await loadPublicCategories(payload, otherKind)
  return peers.find((peer) => categoriesAreEquivalent(doc, peer)) || null
}

const buildLongTitle = (
  kind: CategorySeoKind,
  title: string,
  parentTitle: string | null,
  peerLongTitle: string,
): string => {
  const parentHint = parentTitle && compactKey(parentTitle) !== compactKey(title) ? parentTitle : null

  const candidates =
    kind === 'post'
      ? [
          parentHint
            ? `${title} Insights for ${parentHint}`
            : `${title} Insights for Manufacturing and B2B Marketing`,
          `Articles and Expert Notes on ${title}`,
          `${title}: Guides for Industrial Marketing Teams`,
        ]
      : [
          parentHint
            ? `${title} Case Studies in ${parentHint}`
            : `${title} Case Studies for Manufacturing and B2B Companies`,
          `Real Projects in ${title}`,
          `${title}: Manufacturing Project Work`,
        ]

  return candidates.find((value) => !isNearDuplicateText(value, peerLongTitle)) || candidates[0]!
}

const buildDescription = (
  kind: CategorySeoKind,
  title: string,
  parentTitle: string | null,
  peerDescription: string,
): string => {
  const parentClause = parentTitle ? ` It sits under ${parentTitle} in the taxonomy.` : ''

  const post =
    `Practical articles on ${title} for manufacturing and industrial companies. This Insights category covers how marketing teams approach the topic, what to publish, and how that work supports visibility with engineers and buyers. It is a reading list of methods and explanations, not a gallery of client implementations.${parentClause}`

  const caseStudy =
    `Documented project work on ${title} for manufacturers and industrial companies. These case studies describe the starting situation, the work delivered, and how the digital presence was structured. They are project records for operators comparing similar work, not a library of how-to articles.${parentClause}`

  const candidates = kind === 'post' ? [clipDescription(post), clipDescription(`${post} Each article stays tied to technical products and B2B buying journeys.`)] : [clipDescription(caseStudy), clipDescription(`${caseStudy} Each record stays tied to an actual implementation.`)]

  return candidates.find((value) => !isNearDuplicateText(value, peerDescription)) || candidates[0]!
}

const buildSeoTitle = (
  kind: CategorySeoKind,
  title: string,
  longTitle: string,
  peerSeoTitle: string,
): string => {
  const candidates =
    kind === 'post'
      ? [`${title} Insights for B2B Marketing`, `${title} Articles for Manufacturers`, longTitle]
      : [`${title} Case Studies for Manufacturers`, `${title} Project Work`, longTitle]

  const chosen =
    candidates.find((value) => value && !isNearDuplicateText(value, peerSeoTitle)) || candidates[0]!
  return chosen.length <= 70 ? chosen : `${title} ${kind === 'post' ? 'Insights' : 'Case Studies'}`
}

const buildSeoDescription = (
  kind: CategorySeoKind,
  title: string,
  description: string,
  peerSeoDescription: string,
): string => {
  const post = clipSeoDescription(
    `Articles and expert notes on ${title} for manufacturers, including practical marketing, search and content context.`,
  )
  const caseStudy = clipSeoDescription(
    `Manufacturing case studies on ${title}, covering website, search and content work from real industrial projects.`,
  )
  const fromVisible = clipSeoDescription(description)
  const candidates = kind === 'post' ? [post, fromVisible] : [caseStudy, fromVisible]
  return candidates.find((value) => value && !isNearDuplicateText(value, peerSeoDescription)) || candidates[0]!
}

const relationIds = (value: unknown): Array<number | string> => {
  if (value == null) return []
  const list = Array.isArray(value) ? value : [value]
  return list.flatMap((item) => {
    if (typeof item === 'number' || typeof item === 'string') return [item]
    if (item && typeof item === 'object' && 'id' in item) {
      const id = (item as { id?: number | string }).id
      return id != null ? [id] : []
    }
    return []
  })
}

export const collectAssignedCategoryIds = (
  kind: CategorySeoKind,
  ...docs: Array<Record<string, unknown> | null | undefined>
): Array<number | string> => {
  const ids = new Set<string>()
  const primary = kind === 'post' ? 'primary_category' : 'primary_case_study_category'
  const many = relationshipFieldFor(kind)

  for (const doc of docs) {
    if (!doc) continue
    for (const id of [...relationIds(doc[primary]), ...relationIds(doc[many])]) {
      ids.add(String(id))
    }
  }

  return [...ids]
}

export const ensureCategorySeoMetadata = async (args: {
  payload: Payload
  kind: CategorySeoKind
  categoryId: number | string
  req?: PayloadRequest
  publishedCount?: number
  doc?: CategoryRecord | null
}): Promise<CategorySeoSnapshot | null> => {
  const { payload, kind, categoryId, req } = args
  if (req?.context?.disableCategorySeo) return null

  const doc = args.doc || (await loadCategory(payload, kind, categoryId))
  if (!doc?.title || !doc.slug) return null

  const publishedCount =
    args.publishedCount ?? (await countPublishedInCategory(payload, kind, categoryId))
  const active = publishedCount > 0
  const current = readFields(kind, doc)
  const changedFields: string[] = []

  if (!active) {
    return {
      id: doc.id,
      kind,
      title: doc.title,
      slug: doc.slug,
      ...current,
      publishedCount,
      active,
      changedFields,
      peerId: null,
    }
  }

  const peer = await findPeerCategory(payload, kind, doc)
  const peerFields = peer ? readFields(kind === 'post' ? 'case-study' : 'post', peer) : {
    longTitle: '',
    description: '',
    seoTitle: '',
    seoDescription: '',
  }
  const parentTitle = parentTitleOf(doc)

  const next = { ...current }
  const data: Record<string, unknown> = {}

  const longTitleMissing = isPlaceholderLongTitle(doc.title, current.longTitle)
  if (longTitleMissing) {
    next.longTitle = buildLongTitle(kind, doc.title, parentTitle, peerFields.longTitle)
    data[kind === 'post' ? 'category_long_title' : 'case_study_long_title'] = next.longTitle
    changedFields.push('longTitle')
  }

  const descriptionMissing = !current.description || !hasRichTextContent(
    kind === 'post' ? doc.category_description : doc.case_study_description,
  )
  if (descriptionMissing) {
    next.description = buildDescription(kind, doc.title, parentTitle, peerFields.description)
    data[kind === 'post' ? 'category_description' : 'case_study_description'] = plainTextToRichText(
      next.description,
    )
    changedFields.push('description')
  }

  if (!current.seoTitle) {
    next.seoTitle = buildSeoTitle(kind, doc.title, next.longTitle, peerFields.seoTitle)
    changedFields.push('seoTitle')
  }
  if (!current.seoDescription) {
    next.seoDescription = buildSeoDescription(kind, doc.title, next.description, peerFields.seoDescription)
    changedFields.push('seoDescription')
  }

  if (changedFields.includes('seoTitle') || changedFields.includes('seoDescription')) {
    data.meta = {
      ...(typeof doc.meta === 'object' && doc.meta ? doc.meta : {}),
      title: next.seoTitle,
      description: next.seoDescription,
    }
  }

  if (changedFields.length > 0) {
    // Direct DB write: title/slug/parent are unchanged, so nested-docs
    // should not rebuild the tree. Local API update was triggering it.
    await payload.db.updateOne({
      collection: collectionFor(kind),
      id: doc.id,
      data,
      req,
    })
    const cached = peerCache.get(payload)
    if (cached) delete cached[kind]
  }

  return {
    id: doc.id,
    kind,
    title: doc.title,
    slug: doc.slug,
    longTitle: next.longTitle,
    description: next.description,
    seoTitle: next.seoTitle,
    seoDescription: next.seoDescription,
    publishedCount,
    active,
    changedFields,
    peerId: peer?.id ?? null,
  }
}

export const ensureAssignedCategoriesSeo = async (args: {
  payload: Payload
  kind: CategorySeoKind
  docs: Array<Record<string, unknown> | null | undefined>
  req?: PayloadRequest
}): Promise<CategorySeoSnapshot[]> => {
  const ids = collectAssignedCategoryIds(args.kind, ...args.docs)
  const snapshots: CategorySeoSnapshot[] = []
  for (const id of ids) {
    const snapshot = await ensureCategorySeoMetadata({
      payload: args.payload,
      kind: args.kind,
      categoryId: id,
      req: args.req,
    })
    if (snapshot) snapshots.push(snapshot)
  }
  return snapshots
}

export const listPublicCategories = async (
  payload: Payload,
  kind: CategorySeoKind,
): Promise<CategoryRecord[]> => loadPublicCategories(payload, kind)
