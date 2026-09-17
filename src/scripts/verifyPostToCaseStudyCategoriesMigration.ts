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
  caseStudyDocs: CategoryDoc[],
  postIndex: ReturnType<typeof buildCategoryIndex>,
  caseStudyIndex: ReturnType<typeof buildCategoryIndex>,
) => {
  let mismatches = 0
  const samples: string[] = []

  for (const postDoc of postDocs) {
    const postParent = parentIdOf(postDoc)
    const postParentDoc = postParent == null ? null : postIndex.byId.get(String(postParent))
    const expectedParentSlug = postParentDoc == null ? 'root' : String(postParentDoc.slug)

    const caseStudyDoc = caseStudyDocs.find((doc) => doc.slug === postDoc.slug)
    if (!caseStudyDoc) {
      mismatches += 1
      if (samples.length < 10) samples.push(`missing case study doc for post slug ${postDoc.slug}`)
      continue
    }

    const caseStudyParent = parentIdOf(caseStudyDoc)
    const caseStudyParentDoc =
      caseStudyParent == null ? null : caseStudyIndex.byId.get(String(caseStudyParent))
    const actualParentSlug =
      caseStudyParentDoc == null ? 'root' : String(caseStudyParentDoc.slug)

    if (expectedParentSlug !== actualParentSlug) {
      mismatches += 1
      if (samples.length < 10) {
        samples.push(
          `${postDoc.title}: expected parent slug ${expectedParentSlug}, got ${actualParentSlug}`,
        )
      }
    }
  }

  return { mismatches, samples }
}

const main = async () => {
  const payload = await getPayload({ config })

  const [postResult, caseStudyResult] = await Promise.all([
    payload.find({
      collection: 'categories',
      depth: 0,
      limit: 5000,
      pagination: false,
    }),
    payload.find({
      collection: 'case-study-categories',
      depth: 0,
      limit: 5000,
      pagination: false,
    }),
  ])

  const postDocs = postResult.docs as CategoryDoc[]
  const caseStudyDocs = caseStudyResult.docs as CategoryDoc[]
  const postIndex = buildCategoryIndex(postDocs)
  const caseStudyIndex = buildCategoryIndex(caseStudyDocs)

  const postSlugs = new Set(postDocs.map((doc) => doc.slug))
  const caseStudySlugs = new Set(caseStudyDocs.map((doc) => doc.slug))
  const missingSlugs = [...postSlugs].filter((slug) => !caseStudySlugs.has(slug))

  const { mismatches, samples } = verifyParentPairs(
    postDocs,
    caseStudyDocs,
    postIndex,
    caseStudyIndex,
  )

  const levelCounts = (docs: CategoryDoc[], index: ReturnType<typeof buildCategoryIndex>) => ({
    l1: docs.filter((doc) => getCategoryLevel(doc, index) === 1).length,
    l2: docs.filter((doc) => getCategoryLevel(doc, index) === 2).length,
    l3: docs.filter((doc) => getCategoryLevel(doc, index) === 3).length,
  })

  console.log(
    JSON.stringify(
      {
        postTotal: postDocs.length,
        caseStudyTotal: caseStudyDocs.length,
        postLevels: levelCounts(postDocs, postIndex),
        caseStudyLevels: levelCounts(caseStudyDocs, caseStudyIndex),
        missingSlugsCount: missingSlugs.length,
        missingSlugsSample: missingSlugs.slice(0, 10),
        parentMismatches: mismatches,
        parentMismatchSamples: samples,
        sampleRoots: {
          post: sampleTitles(postDocs, postIndex, 1),
          caseStudy: sampleTitles(caseStudyDocs, caseStudyIndex, 1),
        },
        ok:
          postDocs.length === caseStudyDocs.length &&
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
