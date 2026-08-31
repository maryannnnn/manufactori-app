import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'
import { INDUSTRIAL_TAXONOMY } from './industrialTaxonomyData'

async function main() {
  const payload = await getPayload({ config })
  const root = await payload.find({
    collection: 'categories',
    where: { slug: { equals: 'industrial' } },
    depth: 0,
    limit: 1,
  })
  const industrial = root.docs[0]
  if (!industrial) {
    console.log('Industrial root missing')
    return
  }

  const all = await payload.find({
    collection: 'categories',
    limit: 10000,
    depth: 0,
    pagination: false,
    select: { title: true, parent: true },
  })

  const parentId = (d: { parent?: unknown }) =>
    d.parent == null ? null : typeof d.parent === 'object' ? (d.parent as { id: number }).id : d.parent

  const level2 = all.docs.filter((d) => parentId(d) === industrial.id)
  const level2Ids = new Set(level2.map((d) => d.id))
  const level3 = all.docs.filter((d) => level2Ids.has(parentId(d) as number))

  console.log(
    JSON.stringify(
      {
        root: { id: industrial.id, title: industrial.title, slug: industrial.slug },
        level2Count: level2.length,
        level3Count: level3.length,
        expectedLevel2: Object.keys(INDUSTRIAL_TAXONOMY).length,
        expectedLevel3: Object.values(INDUSTRIAL_TAXONOMY).flat().length,
        totalCategories: all.totalDocs,
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
