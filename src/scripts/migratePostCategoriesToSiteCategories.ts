import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'

import {
  buildCategoryIndex,
  buildTreeOrder,
  getCategoryLevel,
  parentIdOf,
  type CategoryTreeDoc,
} from '../utilities/categoryHierarchy'

type CategoryDoc = CategoryTreeDoc & {
  id: number
  slug: string
  title: string
}

const parentKey = (parentId: number | string | null): string => String(parentId ?? 'root')

const main = async () => {
  const payload = await getPayload({ config })

  const postResult = await payload.find({
    collection: 'categories',
    depth: 0,
    limit: 5000,
    pagination: false,
    sort: 'title',
  })

  const siteResult = await payload.find({
    collection: 'site-categories',
    depth: 0,
    limit: 5000,
    pagination: false,
    sort: 'title',
  })

  const postDocs = postResult.docs as CategoryDoc[]
  const siteDocs = siteResult.docs as CategoryDoc[]
  const postIndex = buildCategoryIndex(postDocs)

  const siteByKey = new Map<string, CategoryDoc>()
  for (const doc of siteDocs) {
    const key = `${parentKey(parentIdOf(doc))}::${doc.slug}`
    siteByKey.set(key, doc)
  }

  const idMap = new Map<number, number>()
  let created = 0
  let skipped = 0
  let errors = 0
  const errorRows: string[] = []

  const ordered = buildTreeOrder(postDocs)

  for (const doc of ordered) {
    const postId = doc.id
    if (postId == null) continue

    const postParentId = parentIdOf(doc)
    const siteParentId =
      postParentId == null ? null : (idMap.get(Number(postParentId)) ?? null)

    if (postParentId != null && siteParentId == null) {
      errors += 1
      errorRows.push(`Missing mapped parent for post category ${doc.title} (#${postId})`)
      continue
    }

    const key = `${parentKey(siteParentId)}::${doc.slug}`
    const existing = siteByKey.get(key)

    if (existing) {
      idMap.set(Number(postId), existing.id)
      skipped += 1
      continue
    }

    try {
      const createdDoc = (await payload.create({
        collection: 'site-categories',
        data: {
          title: String(doc.title ?? ''),
          slug: String(doc.slug ?? ''),
          generateSlug: false,
          ...(siteParentId != null ? { parent: siteParentId } : {}),
        },
        context: { disableRevalidate: true },
      })) as CategoryDoc

      idMap.set(Number(postId), createdDoc.id)
      siteByKey.set(key, createdDoc)
      created += 1

      if (created % 100 === 0) {
        console.log(`created ${created}`)
      }
    } catch (error) {
      errors += 1
      const message = error instanceof Error ? error.message : String(error)
      errorRows.push(`${doc.title} (#${postId}): ${message}`)
    }
  }

  const afterSite = await payload.find({
    collection: 'site-categories',
    depth: 0,
    limit: 5000,
    pagination: false,
  })

  const afterDocs = afterSite.docs as CategoryDoc[]
  const afterIndex = buildCategoryIndex(afterDocs)

  const levelCounts = (docs: CategoryDoc[], index: ReturnType<typeof buildCategoryIndex>) => {
    const counts = { l1: 0, l2: 0, l3: 0, other: 0 }
    for (const doc of docs) {
      const level = getCategoryLevel(doc, index)
      if (level === 1) counts.l1 += 1
      else if (level === 2) counts.l2 += 1
      else if (level === 3) counts.l3 += 1
      else counts.other += 1
    }
    return counts
  }

  const postLevels = levelCounts(postDocs, postIndex)
  const siteLevels = levelCounts(afterDocs, afterIndex)

  console.log(
    JSON.stringify(
      {
        postCategories: {
          total: postDocs.length,
          levels: postLevels,
        },
        siteCategories: {
          before: siteDocs.length,
          after: afterDocs.length,
          levels: siteLevels,
        },
        created,
        skipped,
        errors,
        errorRows: errorRows.slice(0, 20),
        hierarchyMatch:
          postLevels.l1 === siteLevels.l1 &&
          postLevels.l2 === siteLevels.l2 &&
          postLevels.l3 === siteLevels.l3 &&
          afterDocs.length >= postDocs.length,
      },
      null,
      2,
    ),
  )
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
