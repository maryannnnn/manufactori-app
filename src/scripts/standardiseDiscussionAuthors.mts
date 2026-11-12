import 'dotenv/config'
import config from '@payload-config'
import { getPayload } from 'payload'

/**
 * Updates discussion authors on the 25 prior Industrial articles:
 * - Question authors: international first+last name + professional role subtitle
 * - Expert answers: Maryan Polyak / Manufacturing Expert
 * Preserves existing question/answer body text.
 */

const EXPERT = 'Maryan Polyak'
const EXPERT_ROLE = 'Manufacturing Expert'
const context = { disableRevalidate: true, disableCategorySeo: true }

const NAME_POOL = [
  'Daniel Weber',
  'Thomas Schneider',
  'Oliver Martin',
  'Sophie Laurent',
  'Lukas Novak',
  'Anna Fischer',
  'Marco Rossi',
  'Elena Petrova',
  'Martin Horvat',
  'David Bennett',
  'James Wilson',
  'Peter Muller',
  'Andrea Conti',
  'Nicolas Dubois',
  'Stefan Bauer',
  'Claire Dubois',
  'Henrik Larsen',
  'Isabel Costa',
  'Johan Berg',
  'Katja Nieminen',
  'Felix Wagner',
  'Maria Santos',
  'Robert Klein',
  'Nina Volkov',
  'Paul Richter',
]

const ROLE_BY_GROUP: Record<string, string[]> = {
  metalworking: ['Production Engineer', 'Manufacturing Manager', 'Procurement Manager', 'Quality Engineer'],
  machinery: ['Plant Operations Manager', 'Equipment Specialist', 'Industrial Buyer', 'Maintenance Manager'],
  building: ['Procurement Manager', 'Technical Director', 'Project Buyer', 'Operations Director'],
  electrical: ['Electrical Engineering Manager', 'Electronics Buyer', 'Quality Manager', 'Production Engineer'],
  automotive: ['Automotive Production Manager', 'Supplier Quality Engineer', 'Procurement Manager', 'Engineering Manager'],
}

const GROUPS: Array<{ key: keyof typeof ROLE_BY_GROUP; slugs: string[] }> = [
  {
    key: 'metalworking',
    slugs: [
      'metal-fabrication-processes-capabilities-applications',
      'metal-structures-manufacturing-engineering-to-finished',
      'cnc-machining-precision-metalworking-requirements',
      'welding-metal-fabrication-quality-standards-inspection',
      'choose-metal-manufacturing-supplier-requirements-costs',
    ],
  },
  {
    key: 'machinery',
    slugs: [
      'industrial-machinery-manufacturing-types-selection',
      'industrial-automation-smart-manufacturing-equipment',
      'industrial-equipment-maintenance-predictive-maintenance',
      'industrial-equipment-efficiency-energy-modernisation',
      'buying-industrial-machinery-equipment-specifications-tco',
    ],
  },
  {
    key: 'building',
    slugs: [
      'building-materials-manufacturing-processes-applications',
      'automated-building-materials-production-equipment-lines',
      'quality-control-building-materials-manufacturing-testing',
      'energy-efficiency-building-materials-manufacturing',
      'choosing-building-materials-manufacturer-supplier-evaluation',
    ],
  },
  {
    key: 'electrical',
    slugs: [
      'electrical-equipment-manufacturing-processes-applications',
      'electronic-manufacturing-pcb-assembly-processes',
      'industrial-control-systems-power-electronics-manufacturing',
      'electrical-electronic-equipment-testing-quality-control',
      'choosing-electrical-electronics-manufacturer-supplier-evaluation',
    ],
  },
  {
    key: 'automotive',
    slugs: [
      'automotive-manufacturing-processes-assembly-lines',
      'electric-vehicle-manufacturing-battery-production',
      'aerospace-manufacturing-structures-precision-components',
      'railway-transportation-equipment-manufacturing',
      'choose-automotive-aerospace-transportation-manufacturing-supplier',
    ],
  },
]

const looksLikePersonName = (value: string) => {
  const parts = value.trim().split(/\s+/)
  if (parts.length < 2) return false
  // Role-like labels often contain Manager/Engineer/Buyer/etc without needing change if already Name Surname
  const roleWords = /(manager|engineer|buyer|specialist|director|professional|industrial|manufacturing|procurement|operations|quality|equipment|production)/i
  return !roleWords.test(value)
}

const main = async () => {
  const payload = await getPayload({ config })
  const allSlugs = GROUPS.flatMap((group) => group.slugs)
  const found = await payload.find({
    collection: 'posts',
    where: { slug: { in: allSlugs } },
    limit: 100,
    depth: 0,
    overrideAccess: true,
    pagination: false,
  })
  const bySlug = new Map(found.docs.map((doc) => [String(doc.slug), doc]))
  const missing = allSlugs.filter((slug) => !bySlug.has(slug))

  let nameIndex = 0
  let updatedPosts = 0
  let updatedQuestions = 0
  let updatedExperts = 0
  const report: Array<Record<string, unknown>> = []

  for (const group of GROUPS) {
    const roles = ROLE_BY_GROUP[group.key]
    for (const slug of group.slugs) {
      const doc = bySlug.get(slug)
      if (!doc) continue

      let changed = false
      let questionIndex = 0
      const layout = (doc.layout ?? []).map((block) => {
        if (block.blockType !== 'postCommentsBlock') return block
        const comments = (block.comments ?? []).map((comment) => {
          if (!comment) return comment
          if (comment.isExpert) {
            const needsAuthor = comment.author !== EXPERT
            const needsRole = comment.role !== EXPERT_ROLE
            if (!needsAuthor && !needsRole) return comment
            updatedExperts += 1
            changed = true
            return { ...comment, author: EXPERT, role: EXPERT_ROLE }
          }

          const currentAuthor = String(comment.author || '').trim()
          const currentRole = String(comment.role || '').trim()
          let author = currentAuthor
          let role = currentRole

          if (!looksLikePersonName(currentAuthor)) {
            // Old pattern: author was a role label. Move it to role if role empty/generic.
            if (!role || role === currentAuthor) role = currentAuthor || roles[questionIndex % roles.length]
            author = NAME_POOL[nameIndex % NAME_POOL.length]
            nameIndex += 1
            updatedQuestions += 1
            changed = true
          } else if (!role) {
            role = roles[questionIndex % roles.length]
            changed = true
            updatedQuestions += 1
          }

          questionIndex += 1
          if (author === currentAuthor && role === currentRole) return comment
          return { ...comment, author, role }
        })
        return { ...block, comments }
      })

      if (!changed) {
        report.push({ slug, id: doc.id, status: 'unchanged' })
        continue
      }

      await payload.update({
        collection: 'posts',
        id: doc.id,
        data: { layout, authors: [1] },
        draft: false,
        overrideAccess: true,
        context,
      })
      updatedPosts += 1
      report.push({ slug, id: doc.id, status: 'updated' })
      payload.logger.info(`Updated discussion authors on ${doc.id} ${slug}`)
    }
  }

  console.log(
    JSON.stringify(
      {
        ok: true,
        found: found.docs.length,
        missing,
        updatedPosts,
        updatedQuestions,
        updatedExperts,
        report,
      },
      null,
      2,
    ),
  )
  process.exit(0)
}

void main().catch((error) => {
  console.error(error)
  process.exit(1)
})
