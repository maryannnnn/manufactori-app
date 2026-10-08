import 'dotenv/config'
import config from '@payload-config'
import { getPayload } from 'payload'

import {
  categoriesAreEquivalent,
  ensureCategorySeoMetadata,
  isNearDuplicateText,
  listPublicCategories,
  publishedCountsByCategory,
  type CategorySeoSnapshot,
} from '@/utilities/ensureCategorySeoMetadata'
import { richTextToPlainText } from '@/utilities/richText/toPlainText'

const clip = (value: string, max = 90): string => {
  const trimmed = value.replace(/\s+/g, ' ').trim()
  if (trimmed.length <= max) return trimmed
  return `${trimmed.slice(0, max - 1)}…`
}

const flag = (value: boolean): string => (value ? 'yes' : 'no')

const duplicateFieldsOf = (post: CategorySeoSnapshot, caseStudy: CategorySeoSnapshot): string[] => {
  const fields: string[] = []
  if (isNearDuplicateText(post.longTitle, caseStudy.longTitle)) fields.push('longTitle')
  if (isNearDuplicateText(post.description, caseStudy.description)) fields.push('description')
  if (isNearDuplicateText(post.seoTitle, caseStudy.seoTitle)) fields.push('seoTitle')
  if (isNearDuplicateText(post.seoDescription, caseStudy.seoDescription)) fields.push('seoDescription')
  return fields
}

const snapshotFromList = (
  kind: 'post' | 'case-study',
  doc: {
    id: number | string
    title?: string | null
    slug?: string | null
    category_long_title?: string | null
    case_study_long_title?: string | null
    category_description?: unknown
    case_study_description?: unknown
    meta?: { title?: string | null; description?: string | null } | null
  },
  publishedCount: number,
  generated?: CategorySeoSnapshot | null,
): CategorySeoSnapshot => {
  if (generated) return generated
  const longTitle =
    (kind === 'post' ? doc.category_long_title : doc.case_study_long_title)?.trim() || ''
  const description = richTextToPlainText(
    kind === 'post' ? doc.category_description : doc.case_study_description,
  )
  return {
    id: doc.id,
    kind,
    title: doc.title || '',
    slug: doc.slug || '',
    longTitle,
    description,
    seoTitle: doc.meta?.title?.trim() || '',
    seoDescription: doc.meta?.description?.trim() || '',
    publishedCount,
    active: publishedCount > 0,
    changedFields: [],
    peerId: null,
  }
}

const run = async () => {
  const payload = await getPayload({ config })
  console.error('Payload ready')

  const postCounts = await publishedCountsByCategory(payload, 'post')
  console.error(`Published post category hits: ${postCounts.size}`)
  const caseStudyCounts = await publishedCountsByCategory(payload, 'case-study')
  console.error(`Published case study category hits: ${caseStudyCounts.size}`)

  const generatedPosts = new Map<string, CategorySeoSnapshot>()
  for (const id of postCounts.keys()) {
    console.error(`Ensuring post category ${id}`)
    const snapshot = await ensureCategorySeoMetadata({
      payload,
      kind: 'post',
      categoryId: id,
      publishedCount: postCounts.get(id) || 0,
    })
    if (snapshot) generatedPosts.set(String(snapshot.id), snapshot)
  }

  const generatedCaseStudies = new Map<string, CategorySeoSnapshot>()
  for (const id of caseStudyCounts.keys()) {
    console.error(`Ensuring case study category ${id}`)
    const snapshot = await ensureCategorySeoMetadata({
      payload,
      kind: 'case-study',
      categoryId: id,
      publishedCount: caseStudyCounts.get(id) || 0,
    })
    if (snapshot) generatedCaseStudies.set(String(snapshot.id), snapshot)
  }

  console.error('Listing all Post Categories')
  const postDocs = await listPublicCategories(payload, 'post')
  console.error(`Post categories: ${postDocs.length}`)
  console.error('Listing all Case Study Categories')
  const caseStudyDocs = await listPublicCategories(payload, 'case-study')
  console.error(`Case study categories: ${caseStudyDocs.length}`)

  const posts = postDocs.map((doc) =>
    snapshotFromList(
      'post',
      doc,
      postCounts.get(String(doc.id)) || 0,
      generatedPosts.get(String(doc.id)),
    ),
  )
  const caseStudies = caseStudyDocs.map((doc) =>
    snapshotFromList(
      'case-study',
      doc,
      caseStudyCounts.get(String(doc.id)) || 0,
      generatedCaseStudies.get(String(doc.id)),
    ),
  )

  const generated = [...generatedPosts.values(), ...generatedCaseStudies.values()].flatMap((item) =>
    item.changedFields.map((field) => ({
      kind: item.kind,
      title: item.title,
      field,
      value:
        field === 'longTitle'
          ? item.longTitle
          : field === 'description'
            ? item.description
            : field === 'seoTitle'
              ? item.seoTitle
              : item.seoDescription,
    })),
  )

  const collisions = posts.flatMap((post) => {
    const peer = caseStudies.find((item) => categoriesAreEquivalent(post, item))
    if (!peer) return []
    const duplicates = duplicateFieldsOf(post, peer)
    const generatedDistinct = post.changedFields.length > 0 || peer.changedFields.length > 0
    return [
      {
        title: post.title,
        post,
        caseStudy: peer,
        duplicates,
        action: duplicates.length
          ? 'editorial collision — existing approved fields not overwritten'
          : generatedDistinct
            ? 'generated or confirmed distinct collection-specific metadata'
            : 'already distinct',
      },
    ]
  })

  const activePosts = posts.filter((item) => item.active)
  const activeCaseStudies = caseStudies.filter((item) => item.active)
  const activeCollisions = collisions.filter((item) => item.post.active || item.caseStudy.active)

  const report = {
    postCategories: activePosts.map((item) => ({
      category: item.title,
      publishedPosts: item.publishedCount,
      active: item.active,
      longTitle: item.longTitle,
      description: clip(item.description, 120),
      seoTitle: item.seoTitle,
      seoDescription: clip(item.seoDescription, 120),
      changed: item.changedFields.join(', ') || (item.active ? 'preserved' : 'inactive'),
    })),
    caseStudyCategories: activeCaseStudies.map((item) => ({
      category: item.title,
      publishedCaseStudies: item.publishedCount,
      active: item.active,
      longTitle: item.longTitle,
      description: clip(item.description, 120),
      seoTitle: item.seoTitle,
      seoDescription: clip(item.seoDescription, 120),
      changed: item.changedFields.join(', ') || (item.active ? 'preserved' : 'inactive'),
    })),
    collisions: activeCollisions.map((item) => ({
      sharedCategory: item.title,
      postLongTitle: item.post.longTitle,
      caseStudyLongTitle: item.caseStudy.longTitle,
      postSeoTitle: item.post.seoTitle,
      caseStudySeoTitle: item.caseStudy.seoTitle,
      postDescription: clip(item.post.description, 140),
      caseStudyDescription: clip(item.caseStudy.description, 140),
      unique: flag(item.duplicates.length === 0),
      duplicateFields: item.duplicates.join(', ') || 'none',
      action: item.action,
    })),
    emptyPostCategoryCount: posts.filter((item) => !item.active).length,
    emptyPostCategoriesSample: posts
      .filter((item) => !item.active)
      .slice(0, 25)
      .map((item) => item.title),
    emptyCaseStudyCategoryCount: caseStudies.filter((item) => !item.active).length,
    emptyCaseStudyCategoriesSample: caseStudies
      .filter((item) => !item.active)
      .slice(0, 25)
      .map((item) => item.title),
    inactiveSharedNameCount: collisions.filter(
      (item) => !item.post.active && !item.caseStudy.active,
    ).length,
    generated,
    preservedActive: [...posts, ...caseStudies].filter(
      (item) => item.active && item.changedFields.length === 0,
    ).length,
    counts: {
      postTotal: posts.length,
      postActive: activePosts.length,
      caseStudyTotal: caseStudies.length,
      caseStudyActive: activeCaseStudies.length,
      activeCollisions: activeCollisions.length,
      activeDuplicateCollisions: activeCollisions.filter((item) => item.duplicates.length > 0)
        .length,
      inactiveSharedNames: collisions.filter((item) => !item.post.active && !item.caseStudy.active)
        .length,
      generatedFields: generated.length,
    },
  }

  console.log(JSON.stringify(report, null, 2))
  process.exit(0)
}

void run().catch((error) => {
  console.error(error)
  process.exit(1)
})
