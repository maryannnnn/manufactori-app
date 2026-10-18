import 'dotenv/config'
import config from '@payload-config'
import { getPayload, type Payload } from 'payload'

type Ref = number | string | { id?: number | string; slug?: string | null } | null

const idOf = (value: Ref): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && /^\d+$/.test(value)) return Number(value)
  if (value && typeof value === 'object' && value.id != null) return idOf(value.id)
  return null
}

const allDocs = async (payload: Payload, collection: 'case-study-categories' | 'categories' | 'site-categories' | 'case-studies' | 'posts') => {
  const docs: Array<{ id: number; slug?: string | null }> = []
  let page = 1

  while (true) {
    const result = await payload.find({
      collection,
      depth: 0,
      limit: 500,
      page,
      pagination: true,
    })
    docs.push(...(result.docs as Array<{ id: number; slug?: string | null }>))
    if (!result.hasNextPage) break
    page += 1
  }

  return docs
}

const slugById = (docs: Array<{ id: number; slug?: string | null }>) => {
  const map = new Map<number, string>()
  for (const doc of docs) {
    if (doc.slug) map.set(doc.id, doc.slug)
  }
  return map
}

const idBySlug = (docs: Array<{ id: number; slug?: string | null }>) => {
  const map = new Map<string, number>()
  for (const doc of docs) {
    if (doc.slug) map.set(doc.slug, doc.id)
  }
  return map
}

const main = async () => {
  const payload = await getPayload({ config })
  const [caseCategories, postCategories, siteCategories, caseStudies, posts] = await Promise.all([
    allDocs(payload, 'case-study-categories'),
    allDocs(payload, 'categories'),
    allDocs(payload, 'site-categories'),
    allDocs(payload, 'case-studies'),
    allDocs(payload, 'posts'),
  ])

  const caseSlugById = slugById(caseCategories)
  const postSlugById = slugById(postCategories)
  const siteIdBySlug = idBySlug(siteCategories)

  const relate = (refs: Ref[] | null | undefined, slugs: Map<number, string>, label: string) => {
    const ids: number[] = []
    const missing: string[] = []
    for (const ref of refs || []) {
      const id = idOf(ref)
      if (id == null) continue
      const slug = slugs.get(id)
      if (!slug) {
        missing.push(`id ${id}`)
        continue
      }
      const siteId = siteIdBySlug.get(slug)
      if (siteId == null) {
        missing.push(slug)
        continue
      }
      ids.push(siteId)
    }
    if (missing.length) payload.logger.warn(`${label} unmatched: ${missing.join(', ')}`)
    return [...new Set(ids)]
  }

  let caseUpdates = 0
  for (const doc of caseStudies) {
    const full = await payload.findByID({ collection: 'case-studies', id: doc.id, depth: 0 })
    const current = (full.site_categories || []) as Ref[]
    if (current.length) {
      payload.logger.info(`case ${full.slug} already has ${current.length} site categories`)
      continue
    }
    const siteIds = relate(full.case_study_categories as Ref[], caseSlugById, `case ${full.slug}`)
    if (!siteIds.length) continue
    await payload.update({
      collection: 'case-studies',
      id: full.id,
      data: { site_categories: siteIds },
      overrideAccess: true,
      context: { disableRevalidate: true },
    })
    caseUpdates += 1
    payload.logger.info(`case ${full.slug}: ${siteIds.length} site categories`)
  }

  let postUpdates = 0
  for (const doc of posts) {
    const full = await payload.findByID({ collection: 'posts', id: doc.id, depth: 0 })
    const current = (full.site_categories || []) as Ref[]
    if (current.length) {
      payload.logger.info(`post ${full.slug} already has ${current.length} site categories`)
      continue
    }
    const refs = [
      ...((full.categories || []) as Ref[]),
      full.primary_category as Ref,
    ]
    const siteIds = relate(refs, postSlugById, `post ${full.slug}`)
    if (!siteIds.length) continue
    await payload.update({
      collection: 'posts',
      id: full.id,
      data: { site_categories: siteIds },
      overrideAccess: true,
      context: { disableRevalidate: true },
    })
    postUpdates += 1
    payload.logger.info(`post ${full.slug}: ${siteIds.length} site categories`)
  }

  payload.logger.info(`Updated ${caseUpdates} case studies and ${postUpdates} posts`)
  process.exit(0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
