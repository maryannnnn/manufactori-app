import 'dotenv/config'
import { generateJSON } from '@tiptap/html'
import config from '@payload-config'
import { getPayload } from 'payload'

import { getTiptapExtensions } from '../utilities/richText/extensions'

/**
 * Ensures the four missing Industrial Case Study Categories, then appends
 * agreed categories onto existing cases. Does not change titles, slugs,
 * primary category, SEO, content, or Site Categories.
 */
const NEW_CATEGORIES = [
  {
    slug: 'construction',
    title: 'Construction',
    longTitle: 'Construction and Reconstruction Case Studies',
    description:
      'Case studies of construction companies that design, build, and reconstruct buildings and structures. Suppliers that only sell building materials are not included.',
    metaTitle: 'Construction Case Studies: Building and Reconstruction Projects',
    metaDescription:
      'Case studies of construction companies working on building, installation, and reconstruction projects.',
  },
  {
    slug: 'engineering-systems',
    title: 'Engineering Systems',
    longTitle: 'Building Engineering Systems Case Studies',
    description:
      'Case studies of companies that design and deliver building engineering systems beyond a single heating or ventilation trade.',
    metaTitle: 'Engineering Systems Case Studies for Building Projects',
    metaDescription:
      'Case studies of companies that design and deliver integrated engineering systems for buildings.',
  },
  {
    slug: 'sauna-and-bath-construction',
    title: 'Sauna and Bath Construction',
    longTitle: 'Sauna and Bath Construction Case Studies',
    description:
      'Case studies of companies that build and fit out saunas and baths, including turnkey construction, finishing, and equipment of the facility.',
    metaTitle: 'Sauna and Bath Construction Case Studies',
    metaDescription:
      'Case studies of turnkey sauna and bath construction, finishing, and facility fit-out.',
  },
  {
    slug: 'advertising-products-manufacturing',
    title: 'Advertising Products Manufacturing',
    longTitle: 'Advertising Products Manufacturing Case Studies',
    description:
      'Case studies of manufacturers that produce physical advertising products such as stands, structures, and displays. Digital advertising and promotion services are not included.',
    metaTitle: 'Advertising Products Manufacturing Case Studies',
    metaDescription:
      'Case studies of manufacturers producing physical advertising stands, structures, and displays.',
  },
] as const

const ASSIGNMENTS: Record<string, string[]> = {
  'laser-made-two-manufacturing-websites': ['furniture-manufacturing'],
  'aleks-sf-jewelry-retail-equipment': ['retail-equipment-manufacturing'],
  'miks-industrial-manufacturing': ['structural-steel-fabrication', 'custom-metal-products'],
  'ivikom-metal-products': ['custom-metal-products'],
  'montagspecstroy-construction-engineering': ['construction', 'structural-steel-fabrication'],
  'siblux-timber-houses-wooden-windows': [
    'wooden-house-manufacturing',
    'construction-materials-manufacturing',
  ],
  'house-of-sofas-sofa-manufacturer': ['furniture-manufacturing', 'upholstered-furniture'],
  'areks-upholstered-furniture': ['furniture-manufacturing', 'upholstered-furniture'],
  'alumatrix-facade-systems': [
    'ventilated-facade-manufacturing',
    'construction-materials-manufacturing',
  ],
  'ventfasad-ventilated-facade-installation': ['ventilated-facade-manufacturing'],
  'gptm-group-facade-systems': [
    'ventilated-facade-manufacturing',
    'construction-materials-manufacturing',
  ],
  'promtehmontg-facade-engineering-installation': ['ventilated-facade-manufacturing'],
  'grosstek-aluminum-composite-panels': [
    'ventilated-facade-manufacturing',
    'construction-materials-manufacturing',
  ],
  'npk-binar-roofing-systems': ['construction-materials-manufacturing'],
  'sauna-shop-turnkey-sauna-bath': ['sauna-and-bath-construction'],
  'stove-shop-heating-sauna-solutions': ['hvac--climate-equipment'],
  'geothermal-heating-system-solutions': ['hvac--climate-equipment'],
  'ovik-montag-hvac-engineering-seo': ['hvac--climate-equipment'],
  'merkan-invest-stroy-ventilation-systems': [
    'hvac--climate-equipment',
    'engineering-systems',
  ],
}

const MANUAL = [
  'pnevmomachta-long-term-digital-presence: pneumatic masts, none of the 14 production categories',
  'paktrademash-packaging-equipment: packaging machinery, not packaging goods',
  'nesko-energy-efficiency: energy auditing, not HVAC equipment or building engineering systems',
  'security-systems-anhor: security, fire, and access control; Engineering Systems left for review',
  'vimpel-engineering-anechoic-chambers: anechoic chambers and electromagnetic testing; Engineering Systems left for review',
  'laser-made-two-manufacturing-websites: advertising products not assigned; furniture and retail equipment are',
  'stove-shop-heating-sauna-solutions: heating equipment, not sauna construction',
  'ventfasad, promtehmontg: facade installation stays under ventilated facades, not general Construction',
]

const rt = (text: string) =>
  generateJSON(`<p>${text}</p>`, getTiptapExtensions({ headingLevels: [2, 3, 4] }))

const idsOf = (value: unknown): number[] => {
  if (!Array.isArray(value)) return []
  return value.flatMap((item) => {
    if (typeof item === 'number') return [item]
    if (item && typeof item === 'object' && 'id' in item && typeof item.id === 'number') return [item.id]
    return []
  })
}

const payload = await getPayload({ config })

const industrial = await payload.find({
  collection: 'case-study-categories',
  depth: 0,
  limit: 5,
  overrideAccess: true,
  where: { slug: { equals: 'industrial' } },
})
const industrialDoc = industrial.docs.find((doc) => doc.parent == null)
if (!industrialDoc) throw new Error('Industrial root not found')

for (const category of NEW_CATEGORIES) {
  const existing = await payload.find({
    collection: 'case-study-categories',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: { slug: { equals: category.slug } },
  })
  if (existing.docs[0]) {
    payload.logger.info(`exists ${category.slug} id=${existing.docs[0].id}`)
    continue
  }
  const created = await payload.create({
    collection: 'case-study-categories',
    data: {
      title: category.title,
      case_study_long_title: category.longTitle,
      case_study_description: rt(category.description),
      slug: category.slug,
      generateSlug: false,
      parent: industrialDoc.id,
      meta: {
        title: category.metaTitle,
        description: category.metaDescription,
      },
    },
    overrideAccess: true,
    context: { disableRevalidate: true },
  })
  payload.logger.info(`created ${category.slug} id=${created.id} parent=${created.parent}`)
}

const neededSlugs = [...new Set(Object.values(ASSIGNMENTS).flat())]
const categoryDocs = await payload.find({
  collection: 'case-study-categories',
  depth: 0,
  limit: neededSlugs.length,
  pagination: false,
  overrideAccess: true,
  where: { slug: { in: neededSlugs } },
  select: { slug: true, title: true },
})
const categoryIdBySlug = new Map(categoryDocs.docs.map((doc) => [doc.slug, doc.id]))
const missing = neededSlugs.filter((slug) => !categoryIdBySlug.has(slug))
if (missing.length) throw new Error(`missing categories: ${missing.join(', ')}`)

for (const [slug, categorySlugs] of Object.entries(ASSIGNMENTS)) {
  const found = await payload.find({
    collection: 'case-studies',
    depth: 0,
    draft: false,
    limit: 1,
    overrideAccess: true,
    where: { slug: { equals: slug } },
    select: {
      title: true,
      slug: true,
      primary_case_study_category: true,
      case_study_categories: true,
      meta: true,
      site_categories: true,
    },
  })
  const doc = found.docs[0]
  if (!doc) throw new Error(`case not found: ${slug}`)

  const current = idsOf(doc.case_study_categories)
  const add = categorySlugs.map((categorySlug) => categoryIdBySlug.get(categorySlug)!)
  const next = [...current]
  for (const id of add) {
    if (!next.includes(id)) next.push(id)
  }

  const primaryBefore = doc.primary_case_study_category
  const metaBefore = doc.meta?.title
  const siteBefore = idsOf(doc.site_categories).length

  if (next.length === current.length) {
    payload.logger.info(`unchanged ${slug}`)
    continue
  }

  const updated = await payload.update({
    collection: 'case-studies',
    id: doc.id,
    data: {
      case_study_categories: next,
      _status: 'published',
    },
    draft: false,
    overrideAccess: true,
    context: { disableRevalidate: true, disableCategorySeo: true },
  })

  payload.logger.info(
    JSON.stringify({
      slug,
      added: categorySlugs,
      primarySame: updated.primary_case_study_category === primaryBefore,
      metaSame: updated.meta?.title === metaBefore,
      siteCount: siteBefore,
      status: updated._status,
    }),
  )
}

console.log('MANUAL')
for (const line of MANUAL) console.log(line)
process.exit(0)
