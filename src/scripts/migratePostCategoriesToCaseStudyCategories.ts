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

type PostCategoryDoc = CategoryTreeDoc & {
  id: number
  slug: string
  title: string
  category_long_title?: string | null
}

type CaseStudyCategoryDoc = CategoryTreeDoc & {
  id: number
  slug: string
  title: string
  case_study_long_title?: string | null
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

  const caseStudyResult = await payload.find({
    collection: 'case-study-categories',
    depth: 0,
    limit: 5000,
    pagination: false,
    sort: 'title',
  })

  const postDocs = postResult.docs as PostCategoryDoc[]
  const caseStudyDocs = caseStudyResult.docs as CaseStudyCategoryDoc[]
  const postIndex = buildCategoryIndex(postDocs)

  const caseStudyByKey = new Map<string, CaseStudyCategoryDoc>()
  for (const doc of caseStudyDocs) {
    const key = `${parentKey(parentIdOf(doc))}::${doc.slug}`
    caseStudyByKey.set(key, doc)
  }

  const idMap = new Map<number, number>()
  let created = 0
  let skipped = 0
  let errors = 0
  const errorRows: string[] = []

  const ordered = buildTreeOrder(postDocs)

  for (const rawDoc of ordered) {
    const doc = rawDoc as PostCategoryDoc
    const postId = doc.id
    if (postId == null) continue

    const postParentId = parentIdOf(doc)
    const caseStudyParentId =
      postParentId == null ? null : (idMap.get(Number(postParentId)) ?? null)

    if (postParentId != null && caseStudyParentId == null) {
      errors += 1
      errorRows.push(`Missing mapped parent for post category ${doc.title} (#${postId})`)
      continue
    }

    const key = `${parentKey(caseStudyParentId)}::${doc.slug}`
    const existing = caseStudyByKey.get(key)

    if (existing) {
      idMap.set(Number(postId), existing.id)
      skipped += 1
      continue
    }

    const longTitle = String(doc.category_long_title ?? doc.title ?? '').trim() || String(doc.title ?? '')

    try {
      const createdDoc = (await payload.create({
        collection: 'case-study-categories',
        data: {
          title: String(doc.title ?? ''),
          case_study_long_title: longTitle,
          slug: String(doc.slug ?? ''),
          generateSlug: false,
          ...(caseStudyParentId != null ? { parent: caseStudyParentId } : {}),
        },
        context: { disableRevalidate: true },
      })) as CaseStudyCategoryDoc

      idMap.set(Number(postId), createdDoc.id)
      caseStudyByKey.set(key, createdDoc)
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

  const afterCaseStudy = await payload.find({
    collection: 'case-study-categories',
    depth: 0,
    limit: 5000,
    pagination: false,
  })

  const afterDocs = afterCaseStudy.docs as CaseStudyCategoryDoc[]
  const afterIndex = buildCategoryIndex(afterDocs)

  const levelCounts = (docs: CaseStudyCategoryDoc[], index: ReturnType<typeof buildCategoryIndex>) => {
    const counts = { l1: 0, l2: 0, l3: 0, other: 0 }
    for (const item of docs) {
      const level = getCategoryLevel(item, index)
      if (level === 1) counts.l1 += 1
      else if (level === 2) counts.l2 += 1
      else if (level === 3) counts.l3 += 1
      else counts.other += 1
    }
    return counts
  }

  const postLevels = levelCounts(postDocs, postIndex)
  const caseStudyLevels = levelCounts(afterDocs, afterIndex)

  console.log(
    JSON.stringify(
      {
        postCategories: {
          total: postDocs.length,
          levels: postLevels,
        },
        caseStudyCategories: {
          before: caseStudyDocs.length,
          after: afterDocs.length,
          levels: caseStudyLevels,
        },
        created,
        skipped,
        errors,
        errorRows: errorRows.slice(0, 20),
        hierarchyMatch:
          postLevels.l1 === caseStudyLevels.l1 &&
          postLevels.l2 === caseStudyLevels.l2 &&
          postLevels.l3 === caseStudyLevels.l3 &&
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
