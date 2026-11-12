import 'dotenv/config'
import config from '@payload-config'
import { getPayload } from 'payload'

/**
 * 1) Sets the shared CMS author profile for Maryan Polyak.
 * 2) Updates expert discussion roles on the 25 prior Industrial articles
 *    (and any Chemical posts already present) to "Manufacturing Expert".
 */

const AUTHOR_ID = 1
const AUTHOR_NAME = 'Maryan Polyak'
const JOB_TITLE = 'Manufacturing Marketing Specialist | SEO & AI Search'
const PROFESSIONAL_FOCUS = 'Manufacturing & Industrial Digital Marketing'
const DISCUSSION_ROLE = 'Manufacturing Expert'
const OLD_DISCUSSION_ROLES = new Set([
  'Manufacturing Digital Marketing & Web Development Expert',
  'Manufacturing Digital Marketing Expert',
  'Manufacturing Expert',
])

const INDUSTRIAL_SLUGS = [
  // metalworking
  'metal-fabrication-processes-capabilities-applications',
  'metal-structures-manufacturing-engineering-to-finished',
  'cnc-machining-precision-metalworking-requirements',
  'welding-metal-fabrication-quality-standards-inspection',
  'choose-metal-manufacturing-supplier-requirements-costs',
  // machinery
  'industrial-machinery-manufacturing-types-selection',
  'industrial-automation-smart-manufacturing-equipment',
  'industrial-equipment-maintenance-predictive-maintenance',
  'industrial-equipment-efficiency-energy-modernisation',
  'buying-industrial-machinery-equipment-specifications-tco',
  // building
  'building-materials-manufacturing-processes-applications',
  'automated-building-materials-production-equipment-lines',
  'quality-control-building-materials-manufacturing-testing',
  'energy-efficiency-building-materials-manufacturing',
  'choosing-building-materials-manufacturer-supplier-evaluation',
  // electrical
  'electrical-equipment-manufacturing-processes-applications',
  'electronic-manufacturing-pcb-assembly-processes',
  'industrial-control-systems-power-electronics-manufacturing',
  'electrical-electronic-equipment-testing-quality-control',
  'choosing-electrical-electronics-manufacturer-supplier-evaluation',
  // automotive
  'automotive-manufacturing-processes-assembly-lines',
  'electric-vehicle-manufacturing-battery-production',
  'aerospace-manufacturing-structures-precision-components',
  'railway-transportation-equipment-manufacturing',
  'choose-automotive-aerospace-transportation-manufacturing-supplier',
  // chemical
  'chemical-manufacturing-processes-batch-continuous',
  'petrochemical-manufacturing-feedstocks-intermediates',
  'plastics-polymer-manufacturing-processes',
  'pharmaceutical-biotechnology-process-manufacturing',
  'choose-chemical-process-manufacturing-supplier',
]

const context = { disableRevalidate: true, disableCategorySeo: true }

const payload = await getPayload({ config })

await payload.update({
  collection: 'users',
  id: AUTHOR_ID,
  data: {
    name: AUTHOR_NAME,
    jobTitle: JOB_TITLE,
    professionalFocus: PROFESSIONAL_FOCUS,
  },
  overrideAccess: true,
  context,
})
console.log('AUTHOR_UPDATED', AUTHOR_ID, AUTHOR_NAME, JOB_TITLE, PROFESSIONAL_FOCUS)

const found = await payload.find({
  collection: 'posts',
  where: { slug: { in: INDUSTRIAL_SLUGS } },
  limit: 100,
  depth: 0,
  overrideAccess: true,
  pagination: false,
})

const bySlug = new Map(found.docs.map((doc) => [String(doc.slug), doc]))
const missing = INDUSTRIAL_SLUGS.filter((slug) => !bySlug.has(slug))
console.log('FOUND_POSTS', found.docs.length, 'MISSING', missing.length)
if (missing.length) console.log('MISSING_SLUGS', missing)

let updatedPosts = 0
let updatedExpertRoles = 0

for (const slug of INDUSTRIAL_SLUGS) {
  const doc = bySlug.get(slug)
  if (!doc) continue

  let changed = false
  const layout = (doc.layout ?? []).map((block) => {
    if (block.blockType !== 'postCommentsBlock') return block
    const comments = (block.comments ?? []).map((comment) => {
      if (!comment?.isExpert) return comment
      const authorOk = comment.author === AUTHOR_NAME
      const roleOk = comment.role === DISCUSSION_ROLE
      if (authorOk && roleOk) return comment
      if (
        comment.author === AUTHOR_NAME ||
        comment.author === 'Marian' ||
        comment.author === 'marian' ||
        OLD_DISCUSSION_ROLES.has(String(comment.role || ''))
      ) {
        updatedExpertRoles += 1
        changed = true
        return {
          ...comment,
          author: AUTHOR_NAME,
          role: DISCUSSION_ROLE,
        }
      }
      return comment
    })
    return { ...block, comments }
  })

  const authors = Array.isArray(doc.authors) ? doc.authors : []
  const hasAuthor = authors.some((author) => {
    const id = typeof author === 'object' ? author?.id : author
    return Number(id) === AUTHOR_ID
  })
  if (!hasAuthor) {
    changed = true
  }

  if (!changed && hasAuthor) {
    console.log('SKIP', doc.id, slug)
    continue
  }

  await payload.update({
    collection: 'posts',
    id: doc.id,
    data: {
      authors: [AUTHOR_ID],
      layout,
    },
    draft: false,
    overrideAccess: true,
    context,
  })
  updatedPosts += 1
  console.log('UPDATED', doc.id, slug)
}

console.log(
  JSON.stringify(
    {
      ok: true,
      authorId: AUTHOR_ID,
      updatedPosts,
      updatedExpertRoles,
      foundPosts: found.docs.length,
      missingSlugs: missing,
    },
    null,
    2,
  ),
)
process.exit(0)
