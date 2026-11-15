import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import { cache } from 'react'

import configPromise from '@payload-config'
import { buildCommentTree } from '@/blocks/CaseStudyCommentsBlock/buildCommentTree'
import type { DiscussionSourceFilter } from '@/utilities/feedArchive'
import {
  getCaseStudyUrl,
  getPostUrl,
} from '@/utilities/getContentUrls'
import { hasRichTextContent } from '@/utilities/richText/hasContent'
import { richTextToPlainText } from '@/utilities/richText/toPlainText'

export type AggregatedDiscussionSource = 'posts' | 'case-studies'

export type AggregatedDiscussionMessage = {
  author: string
  role?: string | null
  bodyPlain: string
  isExpert?: boolean | null
  date?: string | null
  depth: number
}

export type AggregatedDiscussionItem = {
  key: string
  author: string
  role?: string | null
  questionPlain: string
  answerPlain?: string | null
  answerAuthor?: string | null
  answerRole?: string | null
  /** Full thread including the root question, depth-ordered. */
  messages: AggregatedDiscussionMessage[]
  sourceCollection: AggregatedDiscussionSource
  sourceKindLabel: string
  sourceTitle: string
  sourceHref: string
  publishedAt?: string | null
}

export type ListedDiscussionsResult = {
  items: AggregatedDiscussionItem[]
  totalDocs: number
  totalPages: number
  page: number
  limit: number
}

type CommentLike = {
  id?: string | null
  author: string
  role?: string | null
  date?: string | null
  depth?: number | null
  isExpert?: boolean | null
  body?: unknown
}

const rotateByDay = <T,>(items: T[]): T[] => {
  if (items.length <= 1) return items.slice()
  const day = Math.floor(Date.now() / (1000 * 60 * 60 * 24))
  const offset = day % items.length
  return [...items.slice(offset), ...items.slice(0, offset)]
}

const flattenThread = (
  node: CommentLike & { children: Array<CommentLike & { children: unknown[] }> },
  depth = 0,
): AggregatedDiscussionMessage[] => {
  const bodyPlain = richTextToPlainText(node.body)
  if (!bodyPlain) {
    return node.children.flatMap((child) =>
      flattenThread(child as typeof node, depth + 1),
    )
  }
  return [
    {
      author: node.author,
      role: node.role,
      bodyPlain,
      isExpert: node.isExpert,
      date: node.date,
      depth,
    },
    ...node.children.flatMap((child) => flattenThread(child as typeof node, depth + 1)),
  ]
}

const exchangesFromComments = (
  comments: CommentLike[] | null | undefined,
  meta: {
    sourceCollection: AggregatedDiscussionSource
    sourceKindLabel: string
    sourceTitle: string
    sourceHref: string
    publishedAt?: string | null
    keyPrefix: string
  },
): AggregatedDiscussionItem[] => {
  const entries = (comments ?? []).filter(
    (comment) => comment?.author && hasRichTextContent(comment.body),
  )
  if (!entries.length) return []

  const roots = buildCommentTree(entries)
  return roots.flatMap((root, index) => {
    const messages = flattenThread(root)
    if (!messages.length) return []
    const question = messages[0]
    const reply =
      messages.slice(1).find((message) => message.isExpert) ||
      messages[1] ||
      null
    return [
      {
        key: `${meta.keyPrefix}-${root.id || index}`,
        author: question.author,
        role: question.role,
        questionPlain: question.bodyPlain,
        answerPlain: reply?.bodyPlain || null,
        answerAuthor: reply?.author || null,
        answerRole: reply?.role || null,
        messages,
        sourceCollection: meta.sourceCollection,
        sourceKindLabel: meta.sourceKindLabel,
        sourceTitle: meta.sourceTitle,
        sourceHref: meta.sourceHref,
        publishedAt: question.date || meta.publishedAt || null,
      },
    ]
  })
}

export const AGGREGATED_DISCUSSIONS_CACHE_TAG = 'aggregated-discussions'

const loadAllDiscussions = async (): Promise<AggregatedDiscussionItem[]> => {
  const payload = await getPayload({ config: configPromise })
  const items: AggregatedDiscussionItem[] = []

  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    draft: false,
    limit: 200,
    overrideAccess: false,
    pagination: false,
    sort: '-publishedAt',
    where: { _status: { equals: 'published' } },
    select: {
      title: true,
      slug: true,
      publishedAt: true,
      primary_category: true,
      layout: true,
    },
  })
  const caseStudies = await payload.find({
    collection: 'case-studies',
    depth: 1,
    draft: false,
    limit: 100,
    overrideAccess: false,
    pagination: false,
    sort: '-publishedAt',
    where: { _status: { equals: 'published' } },
    select: {
      title: true,
      slug: true,
      publishedAt: true,
      primary_case_study_category: true,
      layout: true,
    },
  })

  for (const post of posts.docs) {
    const href = getPostUrl(post)
    if (!href) continue
    for (const block of post.layout ?? []) {
      if (block.blockType !== 'postCommentsBlock') continue
      items.push(
        ...exchangesFromComments(block.comments as CommentLike[] | null | undefined, {
          sourceCollection: 'posts',
          sourceKindLabel: 'Blog',
          sourceTitle: post.title,
          sourceHref: href,
          publishedAt: post.publishedAt,
          keyPrefix: `post-${post.id}`,
        }),
      )
    }
  }

  for (const study of caseStudies.docs) {
    const href = getCaseStudyUrl(study)
    if (!href) continue
    for (const block of study.layout ?? []) {
      if (block.blockType !== 'csComments') continue
      items.push(
        ...exchangesFromComments(block.comments as CommentLike[] | null | undefined, {
          sourceCollection: 'case-studies',
          sourceKindLabel: 'Case Study',
          sourceTitle: study.title,
          sourceHref: href,
          publishedAt: study.publishedAt,
          keyPrefix: `case-${study.id}`,
        }),
      )
    }
  }

  return items
}

const collectAllDiscussionsCached = unstable_cache(
  loadAllDiscussions,
  ['aggregated-discussions-all'],
  {
    tags: [AGGREGATED_DISCUSSIONS_CACHE_TAG],
    revalidate: 3600,
  },
)

const collectAllDiscussions = cache(async (): Promise<AggregatedDiscussionItem[]> =>
  collectAllDiscussionsCached(),
)

/**
 * Selects discussion previews with source variety, then fills from remaining
 * published exchanges so the section can still reach `limit`.
 */
export const queryAggregatedDiscussions = cache(
  async ({
    limit = 5,
    allow,
    industrialOnly = false,
  }: {
    limit?: number
    allow?: AggregatedDiscussionSource[]
    /** Prefer posts whose primary category matches a published industry slug. */
    industrialOnly?: boolean
  } = {}): Promise<AggregatedDiscussionItem[]> => {
    const payload = await getPayload({ config: configPromise })
    let pool = await collectAllDiscussions()
    const allowed = new Set(allow ?? (['posts', 'case-studies'] as AggregatedDiscussionSource[]))
    pool = pool.filter((item) => allowed.has(item.sourceCollection))

    if (industrialOnly) {
      const industries = await payload.find({
        collection: 'industries',
        depth: 0,
        draft: false,
        limit: 500,
        overrideAccess: false,
        pagination: false,
        where: { _status: { equals: 'published' } },
        select: { slug: true },
      })
      const slugs = new Set(industries.docs.map((doc) => doc.slug).filter(Boolean))
      const industrialPosts = await payload.find({
        collection: 'posts',
        depth: 1,
        draft: false,
        limit: 300,
        overrideAccess: false,
        pagination: false,
        where: { _status: { equals: 'published' } },
        select: { slug: true, primary_category: true },
      })
      const industrialPostHrefs = new Set(
        industrialPosts.docs.flatMap((post) => {
          const primarySlug =
            post.primary_category && typeof post.primary_category === 'object'
              ? post.primary_category.slug
              : null
          if (!primarySlug || !slugs.has(primarySlug)) return []
          const href = getPostUrl(post)
          return href ? [href] : []
        }),
      )
      const filtered = pool.filter(
        (item) => item.sourceCollection === 'posts' && industrialPostHrefs.has(item.sourceHref),
      )
      pool =
        filtered.length >= Math.min(limit, 2)
          ? filtered
          : pool.filter((item) => item.sourceCollection === 'posts')
    }

    const byRecency = [...pool].sort((a, b) => {
      const aTime = a.publishedAt ? Date.parse(a.publishedAt) : 0
      const bTime = b.publishedAt ? Date.parse(b.publishedAt) : 0
      return bTime - aTime
    })

    const selected: AggregatedDiscussionItem[] = []
    const usedSources = new Set<string>()
    const usedKeys = new Set<string>()

    const take = (item: AggregatedDiscussionItem) => {
      if (usedKeys.has(item.key)) return false
      usedKeys.add(item.key)
      usedSources.add(item.sourceHref)
      selected.push(item)
      return true
    }

    for (const item of byRecency) {
      if (selected.length >= limit) break
      if (usedSources.has(item.sourceHref)) continue
      take(item)
    }

    if (selected.length < limit) {
      for (const item of rotateByDay(byRecency)) {
        if (selected.length >= limit) break
        take(item)
      }
    }

    return selected.slice(0, limit)
  },
)

/** Full searchable / filterable discussion archive for /discussions. */
export const queryListedDiscussions = cache(
  async ({
    page = 1,
    limit = 20,
    search,
    source = 'all',
  }: {
    page?: number
    limit?: number
    search?: string
    source?: DiscussionSourceFilter
  } = {}): Promise<ListedDiscussionsResult> => {
    const all = await collectAllDiscussions()
    const needle = search?.trim().toLowerCase()
    const filtered = all.filter((item) => {
      if (source !== 'all' && item.sourceCollection !== source) return false
      if (!needle) return true
      const haystack = [
        item.questionPlain,
        item.answerPlain || '',
        item.author,
        item.role || '',
        item.answerAuthor || '',
        item.answerRole || '',
        item.sourceTitle,
        ...item.messages.flatMap((message) => [
          message.bodyPlain,
          message.author,
          message.role || '',
        ]),
      ]
        .join(' ')
        .toLowerCase()
      return haystack.includes(needle)
    })

    const byRecency = [...filtered].sort((a, b) => {
      const aTime = a.publishedAt ? Date.parse(a.publishedAt) : 0
      const bTime = b.publishedAt ? Date.parse(b.publishedAt) : 0
      return bTime - aTime
    })

    const totalDocs = byRecency.length
    const totalPages = Math.max(1, Math.ceil(totalDocs / limit) || 1)
    const safePage = Math.min(Math.max(1, page), totalPages)
    const start = (safePage - 1) * limit

    return {
      items: byRecency.slice(start, start + limit),
      totalDocs,
      totalPages: totalDocs === 0 ? 0 : totalPages,
      page: safePage,
      limit,
    }
  },
)
