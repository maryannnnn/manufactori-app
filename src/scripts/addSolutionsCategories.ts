import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'
import { formatCategorySlug } from '../utilities/formatCategorySlug'
import {
  expandSolutionsLongTitle,
  SOLUTIONS_ROOT_TITLE,
  SOLUTIONS_TAXONOMY,
} from './solutionsTaxonomyData'

type CategoryDoc = {
  id: number
  title: string
  slug: string
  parent?: number | { id: number } | null
}

const parentIdOf = (doc: CategoryDoc): number | null => {
  if (doc.parent == null) return null
  return typeof doc.parent === 'object' ? doc.parent.id : doc.parent
}

async function main() {
  const payload = await getPayload({ config })

  const all = await payload.find({
    collection: 'categories',
    limit: 15000,
    depth: 0,
    pagination: false,
  })

  const beforeTotal = all.totalDocs
  const docs = all.docs as CategoryDoc[]
  const bySlug = new Set(docs.map((d) => d.slug))
  const titleUnderParent = new Set(
    docs.map((d) => `${parentIdOf(d)}::${d.title.toLowerCase()}`),
  )

  let created = 0
  let skipped = 0
  let errors = 0
  const errorRows: string[] = []

  const reserveSlug = (base: string, parentSlug: string): string => {
    let slug = base || 'category'
    if (!bySlug.has(slug)) {
      bySlug.add(slug)
      return slug
    }
    slug = `${base}-${parentSlug}`.replace(/-{2,}/g, '-').slice(0, 120)
    if (!bySlug.has(slug)) {
      bySlug.add(slug)
      return slug
    }
    let i = 2
    while (i < 100) {
      const candidate = `${slug}-${i}`
      if (!bySlug.has(candidate)) {
        bySlug.add(candidate)
        return candidate
      }
      i += 1
    }
    const fallback = `${slug}-${Date.now()}`
    bySlug.add(fallback)
    return fallback
  }

  const ensureCategory = async (
    title: string,
    parentId: number | null,
    parentSlug: string,
    longTitle?: string,
  ): Promise<CategoryDoc | null> => {
    const key = `${parentId}::${title.toLowerCase()}`
    if (titleUnderParent.has(key)) {
      const existing = docs.find(
        (d) => parentIdOf(d) === parentId && d.title.toLowerCase() === title.toLowerCase(),
      )
      if (existing) {
        skipped += 1
        return existing
      }
    }

    try {
      const slug = reserveSlug(formatCategorySlug(title), parentSlug || 'root')
      const doc = await payload.create({
        collection: 'categories',
        data: {
          title,
          category_long_title: longTitle ?? title,
          slug,
          generateSlug: false,
          ...(parentId != null ? { parent: parentId } : {}),
        },
        context: { disableRevalidate: true },
      })

      const row = doc as CategoryDoc
      docs.push(row)
      titleUnderParent.add(key)
      created += 1
      if (created % 25 === 0) console.log(`created ${created}`)
      return row
    } catch (error) {
      errors += 1
      const message = error instanceof Error ? error.message : String(error)
      errorRows.push(`${parentSlug} → ${title}: ${message}`)
      console.error('ERR', parentSlug, title, message)
      return null
    }
  }

  let root =
    docs.find((d) => d.slug === 'solutions' && parentIdOf(d) === null) ??
    docs.find((d) => d.title === SOLUTIONS_ROOT_TITLE && parentIdOf(d) === null)

  if (!root) {
    const createdRoot = await ensureCategory(
      SOLUTIONS_ROOT_TITLE,
      null,
      'root',
      'Manufacturing and Industrial Business Outcomes',
    )
    if (!createdRoot) throw new Error('Failed to create Solutions root')
    root = createdRoot
  } else {
    try {
      root = (await payload.update({
        collection: 'categories',
        id: root.id,
        data: {
          title: SOLUTIONS_ROOT_TITLE,
          category_long_title: 'Manufacturing and Industrial Business Outcomes',
          generateSlug: false,
        },
        context: { disableRevalidate: true },
      })) as CategoryDoc
      console.log(`Updated root ${root.id} → ${SOLUTIONS_ROOT_TITLE}`)
    } catch {
      // keep existing root
    }
  }

  const rootId = root.id
  const rootSlug = root.slug

  const level2ByTitle = new Map<string, CategoryDoc>()
  for (const doc of docs) {
    if (parentIdOf(doc) === rootId) {
      level2ByTitle.set(doc.title, doc)
    }
  }

  for (const groupTitle of Object.keys(SOLUTIONS_TAXONOMY)) {
    let group = level2ByTitle.get(groupTitle)
    if (!group) {
      const createdGroup = await ensureCategory(
        groupTitle,
        rootId,
        rootSlug,
        expandSolutionsLongTitle(groupTitle, SOLUTIONS_ROOT_TITLE),
      )
      if (createdGroup) {
        group = createdGroup
        level2ByTitle.set(groupTitle, group)
      }
    }

    if (!group) continue

    for (const childTitle of SOLUTIONS_TAXONOMY[groupTitle]) {
      if (childTitle.toLowerCase() === groupTitle.toLowerCase()) {
        skipped += 1
        continue
      }
      await ensureCategory(
        childTitle,
        group.id,
        group.slug,
        expandSolutionsLongTitle(childTitle, groupTitle),
      )
    }
  }

  const after = await payload.find({ collection: 'categories', limit: 1, depth: 0 })

  console.log(
    JSON.stringify(
      {
        beforeTotal,
        afterTotal: after.totalDocs,
        root: { id: rootId, title: root.title, slug: root.slug },
        level2Groups: Object.keys(SOLUTIONS_TAXONOMY).length,
        level3Expected: Object.values(SOLUTIONS_TAXONOMY).flat().length,
        created,
        skipped,
        errors,
        errorRows: errorRows.slice(0, 20),
      },
      null,
      2,
    ),
  )
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
