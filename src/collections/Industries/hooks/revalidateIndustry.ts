import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import { getIndustryUrl, INDUSTRIES_ARCHIVE_PATH } from '../../../utilities/getContentUrls'
import { revalidateHtmlSitemap } from '../../../utilities/revalidateHtmlSitemap'

type IndustryDoc = {
  id: number
  slug?: string | null
  industryLevel?: 'primary' | 'secondary' | null
  parentIndustry?: { slug?: string | null } | number | null
  _status?: string | null
}

const safeRevalidatePath = (path: string) => {
  try {
    revalidatePath(path)
  } catch {
    // Scripts outside a Next request have no static generation store.
  }
}

const safeRevalidateTag = (tag: string) => {
  try {
    revalidateTag(tag, 'max')
  } catch {
    // Scripts outside a Next request.
  }
}

const revalidateIndustryPaths = (doc: IndustryDoc) => {
  const path = getIndustryUrl(doc)
  if (path) safeRevalidatePath(path)
  if (doc.industryLevel === 'secondary' && doc.parentIndustry && typeof doc.parentIndustry === 'object' && doc.parentIndustry.slug) {
    safeRevalidatePath(`${INDUSTRIES_ARCHIVE_PATH}/${doc.parentIndustry.slug}`)
  }
  safeRevalidatePath(INDUSTRIES_ARCHIVE_PATH)
  safeRevalidatePath('/')
  safeRevalidateTag('industries-sitemap')
  revalidateHtmlSitemap()
}

export const revalidateIndustry: CollectionAfterChangeHook<IndustryDoc> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (context.disableRevalidate) return doc
  if (doc._status === 'published') {
    payload.logger.info(`Revalidating industry at ${getIndustryUrl(doc) || doc.slug}`)
    revalidateIndustryPaths(doc)
  }
  if (previousDoc?._status === 'published' && doc._status !== 'published') {
    revalidateIndustryPaths(previousDoc)
  }
  return doc
}

export const revalidateIndustryDelete: CollectionAfterDeleteHook<IndustryDoc> = ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate) revalidateIndustryPaths(doc)
  return doc
}
