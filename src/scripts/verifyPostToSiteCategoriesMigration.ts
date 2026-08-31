import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'

import {
  buildCategoryIndex,
  getCategoryLevel,
  parentIdOf,
  type CategoryTreeDoc,
} from '../utilities/categoryHierarchy'

type CategoryDoc = CategoryTreeDoc & {
  id: number
  slug: string
  title: string
}

const sampleTitles = (docs: CategoryDoc[], index: ReturnType<typeof buildCategoryIndex>, level: number, limit = 5) =>
  docs
    .filter((doc) => getCategoryLevel(doc, index) === level)
    .slice(0, limit)
    .map((doc) => doc.title)

const verifyParentPairs = (
  postDocs: CategoryDoc[],
  siteDocs: CategoryDoc[],
  postIndex: ReturnType<typeof buildCategoryIndex>,
  siteIndex: ReturnType<typeof buildCategoryIndex>,
) => {
  const siteBySlugParent = new Map<string, CategoryDoc>()
  for (const doc of siteDocs) {
    siteBySlugParent.set(`${String(parentIdOf(doc) ?? 'root')}::${doc.slug}`, doc)
  }

  let mismatches = 0
  const samples: string[] = []

  for (const postDoc of postDocs) {
    const postParent = parentIdOf(postDoc)
    const postParentDoc = postParent == null ? null : postIndex.byId.get(String(postParent))
    const expectedSiteParentSlug =
      postParentDoc == null ? 'root' : String(postParentDoc.slug)

    const siteDoc = siteDocs.find((doc) => doc.slug === postDoc.slug)
    if (!siteDoc) {
      mismatches += 1
      samples.push(`missing site doc for post slug ${postDoc.slug}`)
      continue
    }

    const siteParent = parentIdOf(siteDoc)
    const siteParentDoc = siteParent == null ? null : siteIndex.byId.get(String(siteParent))
    const actualSiteParentSlug =
      siteParentDoc == null ? 'root' : String(siteParentDoc.slug)

    if (expectedSiteParentSlug !== actualSiteParentSlug) {
      mismatches += 1
      if (samples.length < 10) {
        samples.push(
          `${postDoc.title}: expected parent slug ${expectedSiteParentSlug}, got ${actualSiteParentSlug}`,
        )
      }
    }
  }

  return { mismatches, samples }
}

const main = async () => {
  const payload = await getPayload({ config })

  const [postResult, siteResult] = await Promise.all([
    payload.find({
      collection: 'categories',
      depth: 0,
      limit: 5000,
      pagination: false,
    }),
    payload.find({
      collection: 'site-categories',
      depth: 0,
      limit: 5000,
      pagination: false,
    }),
  ])

  const postDocs = postResult.docs as CategoryDoc[]
  const siteDocs = siteResult.docs as CategoryDoc[]
  const postIndex = buildCategoryIndex(postDocs)
  const siteIndex = buildCategoryIndex(siteDocs)

  const postSlugs = new Set(postDocs.map((doc) => doc.slug))
  const siteSlugs = new Set(siteDocs.map((doc) => doc.slug))
  const missingSlugs = [...postSlugs].filter((slug) => !siteSlugs.has(slug))

  const { mismatches, samples } = verifyParentPairs(postDocs, siteDocs, postIndex, siteIndex)

  const levelCounts = (docs: CategoryDoc[], index: ReturnType<typeof buildCategoryIndex>) => ({
    l1: docs.filter((doc) => getCategoryLevel(doc, index) === 1).length,
    l2: docs.filter((doc) => getCategoryLevel(doc, index) === 2).length,
    l3: docs.filter((doc) => getCategoryLevel(doc, index) === 3).length,
  })

  console.log(
    JSON.stringify(
      {
        postTotal: postDocs.length,
        siteTotal: siteDocs.length,
        postLevels: levelCounts(postDocs, postIndex),
        siteLevels: levelCounts(siteDocs, siteIndex),
        missingSlugsCount: missingSlugs.length,
        missingSlugsSample: missingSlugs.slice(0, 10),
        parentMismatches: mismatches,
        parentMismatchSamples: samples,
        sampleRoots: {
          post: sampleTitles(postDocs, postIndex, 1),
          site: sampleTitles(siteDocs, siteIndex, 1),
        },
        ok:
          postDocs.length === siteDocs.length &&
          missingSlugs.length === 0 &&
          mismatches === 0,
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
