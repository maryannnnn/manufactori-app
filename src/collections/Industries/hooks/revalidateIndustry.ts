import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, Payload } from 'payload'

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

const parentSlugOf = async (payload: Payload, parent: IndustryDoc['parentIndustry']) => {
  if (!parent) return null
  if (typeof parent === 'object') return parent.slug || null
  const parentDoc = await payload.findByID({
    collection: 'industries',
    id: parent,
    depth: 0,
    overrideAccess: true,
    disableErrors: true,
  })
  return parentDoc?.slug || null
}

const revalidateIndustryPaths = (doc: IndustryDoc, parentSlug?: string | null) => {
  const path = getIndustryUrl({ ...doc, parentSlug })
  if (path) safeRevalidatePath(path)
  if (doc.slug) safeRevalidatePath(`${INDUSTRIES_ARCHIVE_PATH}/${doc.slug}`)
  if (parentSlug) safeRevalidatePath(`${INDUSTRIES_ARCHIVE_PATH}/${parentSlug}`)
  safeRevalidatePath(INDUSTRIES_ARCHIVE_PATH)
  safeRevalidatePath('/')
  safeRevalidateTag('industries-sitemap')
  revalidateHtmlSitemap()
}

export const revalidateIndustry: CollectionAfterChangeHook<IndustryDoc> = async ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (context.disableRevalidate) return doc
  if (doc._status === 'published') {
    const parentSlug = await parentSlugOf(payload, doc.parentIndustry)
    payload.logger.info(`Revalidating industry at ${getIndustryUrl({ ...doc, parentSlug }) || doc.slug}`)
    revalidateIndustryPaths(doc, parentSlug)
  }
  if (previousDoc?._status === 'published' && doc._status !== 'published') {
    const parentSlug = await parentSlugOf(payload, previousDoc.parentIndustry)
    revalidateIndustryPaths(previousDoc, parentSlug)
  }
  return doc
}

export const revalidateIndustryDelete: CollectionAfterDeleteHook<IndustryDoc> = async ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    const parentSlug = await parentSlugOf(payload, doc.parentIndustry)
    revalidateIndustryPaths(doc, parentSlug)
  }
  return doc
}
