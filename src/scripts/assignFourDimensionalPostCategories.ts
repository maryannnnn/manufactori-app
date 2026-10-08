import 'dotenv/config'
import config from '@payload-config'
import { getPayload } from 'payload'

import { getPostUrl } from '../utilities/getContentUrls'

/**
 * Adds Industrial and Solutions Post Categories to the three published expert
 * articles. Keeps existing Services categories and primary_category / URL.
 * Does not touch Site Categories.
 */
const ASSIGNMENTS: Array<{
  slug: string
  extraTitles: string[]
}> = [
  {
    slug: 'ai-search-optimization-b2b-geo',
    extraTitles: [
      'Manufacturing',
      'Customer & Market Education',
      'Engineer & Specifier Reach',
    ],
  },
  {
    slug: 'google-ads-for-manufacturers',
    extraTitles: [
      'Manufacturing',
      'Lead Generation & New Business',
      'Digital Sales & Customer Acquisition Growth',
    ],
  },
  {
    slug: 'linkedin-b2b-manufacturing',
    extraTitles: [
      'Manufacturing',
      'Engineer & Specifier Reach',
      'Complex B2B Sales',
      'Brand, Market Position & Competitive Growth',
    ],
  },
]

type CategoryDoc = {
  id: number
  title?: string | null
  slug?: string | null
  parent?: number | { id?: number } | null
}

const toId = (value: unknown): number | null => {
  if (typeof value === 'number') return value
  if (value && typeof value === 'object' && 'id' in value) {
    const id = (value as { id?: unknown }).id
    return typeof id === 'number' ? id : null
  }
  return null
}

const parentIdOf = (doc: CategoryDoc): number | null => {
  if (doc.parent == null) return null
  return typeof doc.parent === 'object' ? (doc.parent.id ?? null) : doc.parent
}

const run = async () => {
  const payload = await getPayload({ config })

  const all = await payload.find({
    collection: 'categories',
    depth: 0,
    limit: 15000,
    overrideAccess: true,
    pagination: false,
    select: { id: true, title: true, slug: true, parent: true },
  })
  const docs = all.docs as CategoryDoc[]
  const byId = new Map(docs.map((doc) => [doc.id, doc]))

  const rootTitle = (doc: CategoryDoc): string => {
    let current: CategoryDoc | undefined = doc
    const seen = new Set<number>()
    while (current) {
      if (seen.has(current.id)) break
      seen.add(current.id)
      const parentId = parentIdOf(current)
      if (parentId == null) return current.title || ''
      current = byId.get(parentId)
    }
    return doc.title || ''
  }

  const findByTitle = (title: string): CategoryDoc | undefined => {
    const matches = docs.filter((doc) => doc.title === title)
    if (matches.length === 0) return undefined
    if (matches.length === 1) return matches[0]
    const preferred = matches.find((doc) => {
      const root = rootTitle(doc)
      return root === 'Industrial' || root === 'Solutions' || root === 'Services' || root === 'Technology'
    })
    return preferred ?? matches[0]
  }

  const footer = await payload.findGlobal({
    slug: 'footer',
    depth: 0,
    overrideAccess: true,
  })
  console.log(
    'Footer nav labels:',
    (footer.navItems ?? []).map((item) => item?.link?.label).filter(Boolean).join(' | ') || '(fallback to mainNavigation)',
  )

  for (const assignment of ASSIGNMENTS) {
    const found = await payload.find({
      collection: 'posts',
      depth: 1,
      limit: 1,
      overrideAccess: true,
      where: { slug: { equals: assignment.slug } },
      select: { id: true, slug: true, categories: true, primary_category: true },
    })
    const post = found.docs[0]
    if (!post) {
      console.error(`Missing post ${assignment.slug}`)
      continue
    }

    const extraIds: number[] = []
    for (const title of assignment.extraTitles) {
      const category = findByTitle(title)
      if (!category) {
        console.error(`Missing Post Category "${title}"`)
        continue
      }
      extraIds.push(category.id)
      console.log(`  ${title} → ${category.id} (${category.slug}) root=${rootTitle(category)}`)
    }

    const current = (Array.isArray(post.categories) ? post.categories : [])
      .map(toId)
      .filter((id): id is number => id != null)
    const merged = [...new Set([...current, ...extraIds])]

    await payload.update({
      collection: 'posts',
      id: post.id,
      data: { categories: merged },
      overrideAccess: true,
      context: { disableRevalidate: true },
    })

    const url = getPostUrl(post)
    console.log(
      `Updated ${assignment.slug}: primary=${toId(post.primary_category)} url=${url} categories=${merged.join(',')}`,
    )
  }

  process.exit(0)
}

void run().catch((error) => {
  console.error(error)
  process.exit(1)
})
