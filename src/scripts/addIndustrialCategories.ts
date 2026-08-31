import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'
import { formatCategorySlug } from '../utilities/formatCategorySlug'
import {
  expandIndustrialLongTitle,
  INDUSTRIAL_ROOT_TITLE,
  INDUSTRIAL_TAXONOMY,
} from './industrialTaxonomyData'

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
    limit: 10000,
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

  // Root: prefer slug industrial, else reuse empty industries root
  let root =
    docs.find((d) => d.slug === 'industrial' && parentIdOf(d) === null) ??
    docs.find((d) => d.slug === 'industries' && parentIdOf(d) === null)

  if (!root) {
    const createdRoot = await ensureCategory(
      INDUSTRIAL_ROOT_TITLE,
      null,
      'root',
      'Industrial Manufacturing Categories and Production Taxonomy',
    )
    if (!createdRoot) throw new Error('Failed to create Industrial root')
    root = createdRoot
  } else if (root.title !== INDUSTRIAL_ROOT_TITLE || root.slug !== 'industrial') {
    const targetSlug = bySlug.has('industrial') ? root.slug : 'industrial'
    try {
      if (targetSlug === 'industrial') bySlug.delete(root.slug)
      root = (await payload.update({
        collection: 'categories',
        id: root.id,
        data: {
          title: INDUSTRIAL_ROOT_TITLE,
          category_long_title: 'Industrial Manufacturing Categories and Production Taxonomy',
          slug: targetSlug,
          generateSlug: false,
        },
        context: { disableRevalidate: true },
      })) as CategoryDoc
      bySlug.add(root.slug)
      console.log(`Updated root ${root.id} → ${INDUSTRIAL_ROOT_TITLE} (${root.slug})`)
    } catch (error) {
      console.warn('Could not rename existing industries root, using as-is:', error)
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

  for (const groupTitle of Object.keys(INDUSTRIAL_TAXONOMY)) {
    let group = level2ByTitle.get(groupTitle)
    if (!group) {
      const createdGroup = await ensureCategory(
        groupTitle,
        rootId,
        rootSlug,
        expandIndustrialLongTitle(groupTitle, INDUSTRIAL_ROOT_TITLE),
      )
      if (createdGroup) {
        group = createdGroup
        level2ByTitle.set(groupTitle, group)
      }
    }

    if (!group) continue

    for (const childTitle of INDUSTRIAL_TAXONOMY[groupTitle]) {
      if (childTitle.toLowerCase() === groupTitle.toLowerCase()) {
        skipped += 1
        continue
      }
      await ensureCategory(
        childTitle,
        group.id,
        group.slug,
        expandIndustrialLongTitle(childTitle, groupTitle),
      )
    }
  }

  const after = await payload.find({ collection: 'categories', limit: 1, depth: 0 })
  const industrialBranch = await payload.find({
    collection: 'categories',
    limit: 10000,
    depth: 0,
    pagination: false,
    where: {
      or: [{ id: { equals: rootId } }, { 'breadcrumbs.doc': { equals: rootId } }],
    },
  })

  console.log(
    JSON.stringify(
      {
        beforeTotal,
        afterTotal: after.totalDocs,
        industrialBranchTotal: industrialBranch.totalDocs,
        root: { id: rootId, title: root.title, slug: root.slug },
        level2Groups: Object.keys(INDUSTRIAL_TAXONOMY).length,
        level3Expected: Object.values(INDUSTRIAL_TAXONOMY).flat().length,
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
