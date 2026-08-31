import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'
import { formatCategorySlug } from '../utilities/formatCategorySlug'
import { TAXONOMY, expandLongTitle, cleanTitle } from './servicesLevel3Data'

async function main() {
  const payload = await getPayload({ config })

  const all = await payload.find({
    collection: 'categories',
    limit: 5000,
    depth: 0,
    pagination: false,
  })

  const beforeTotal = all.totalDocs
  const byId = new Map(all.docs.map((d) => [d.id, d]))
  const bySlug = new Set(all.docs.map((d) => d.slug))
  const titleUnderParent = new Set(
    all.docs.map((d) => {
      const parentId =
        d.parent == null ? null : typeof d.parent === 'object' ? (d.parent as { id: number }).id : d.parent
      return `${parentId}::${d.title.toLowerCase()}`
    }),
  )

  const services = all.docs.find((d) => d.slug === 'services')
  if (!services) throw new Error('Services not found')

  const level2 = all.docs.filter((d) => {
    const parentId =
      d.parent == null ? null : typeof d.parent === 'object' ? (d.parent as { id: number }).id : d.parent
    return parentId === services.id
  })
  const level2ByTitle = new Map(level2.map((d) => [d.title, d]))

  let created = 0
  let skipped = 0
  let errors = 0
  const missingParents: string[] = []
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

  for (const [parentTitle, children] of Object.entries(TAXONOMY)) {
    const parent = level2ByTitle.get(parentTitle)
    if (!parent) {
      missingParents.push(parentTitle)
      continue
    }

    const parentId = parent.id as number
    const parentSlug = parent.slug

    for (const raw of children) {
      const title = cleanTitle(raw)
      if (!title) continue
      if (title.toLowerCase() === parentTitle.toLowerCase()) {
        skipped += 1
        continue
      }

      const key = `${parentId}::${title.toLowerCase()}`
      if (titleUnderParent.has(key)) {
        skipped += 1
        continue
      }

      try {
        const slug = reserveSlug(formatCategorySlug(title), parentSlug)
        const longTitle = expandLongTitle(title, parentTitle)

        const doc = await payload.create({
          collection: 'categories',
          data: {
            title,
            category_long_title: longTitle,
            slug,
            generateSlug: false,
            parent: parentId,
          },
          context: { disableRevalidate: true },
        })

        titleUnderParent.add(key)
        byId.set(doc.id, doc as never)
        created += 1
        if (created % 20 === 0) console.log(`created ${created}`)
      } catch (error) {
        errors += 1
        const message = error instanceof Error ? error.message : String(error)
        errorRows.push(`${parentTitle} → ${title}: ${message}`)
        console.error('ERR', parentTitle, title, message)
      }
    }
  }

  const after = await payload.find({ collection: 'categories', limit: 1, depth: 0 })

  console.log(
    JSON.stringify(
      {
        beforeTotal,
        afterTotal: after.totalDocs,
        created,
        skipped,
        errors,
        missingParents,
        errorRows: errorRows.slice(0, 40),
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
