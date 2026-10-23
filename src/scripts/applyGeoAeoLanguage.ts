import 'dotenv/config'

import config from '@payload-config'
import { getPayload, type Payload } from 'payload'

const context = { disableRevalidate: true, disableCategorySeo: true }
const DISCLAIMER =
  'The semantic and entity structure built for this project creates a clearer foundation for both classic search engines and current AI systems. No measured results in ChatGPT, Perplexity, or similar tools are claimed for this engagement.'

const clausePairs: Array<[string, string]> = [
  [' It is not an AI-search program.', ''],
  [' It is not an AI-search programme.', ''],
  [' It is not rewritten as an AI-search engagement.', ''],
  [' No answer-engine result is claimed.', ''],
  [
    ' No ChatGPT, Perplexity, or AI Overview result is claimed.',
    '',
  ],
  [
    ' No ChatGPT ranking, Perplexity citation or AI Overview result is claimed, and none is documented.',
    '',
  ],
  [
    ' No ChatGPT ranking, Perplexity citation, Gemini visibility, AI Overview result or AI-generated lead is claimed, and none is documented.',
    '',
  ],
  [
    ' No ChatGPT ranking, Perplexity citation, Gemini visibility or AI Overview result is claimed.',
    '',
  ],
  ['Not in this record. No ChatGPT ranking, Perplexity citation or AI Overview result is documented.', DISCLAIMER],
  [
    ' It is not a measured local-search or AI-search programme, and none is claimed.',
    ` ${DISCLAIMER}`,
  ],
  [
    ' The source data does not describe a dedicated local-search or AI-search program, so none is claimed here.',
    ` ${DISCLAIMER}`,
  ],
  [
    ' That topical model is useful for modern search systems in principle. It is not a measured local-search or AI-search programme.',
    ` That topical model is useful for modern search systems in principle. ${DISCLAIMER}`,
  ],
  [
    ' That topical model is useful for modern search in principle. It is not a measured local-search or AI-search programme.',
    ` That topical model is useful for modern search in principle. ${DISCLAIMER}`,
  ],
  [
    ' That topical model is useful for modern search in principle. It is not a measured local-search programme.',
    ` That topical model is useful for modern search in principle. ${DISCLAIMER}`,
  ],
  [' It is not a measured local-search or AI-search programme.', ` ${DISCLAIMER}`],
  [' It is not a measured local-search programme.', ` ${DISCLAIMER}`],
  [' That is not a measured local-search programme.', ` ${DISCLAIMER}`],
  [
    ' That is information architecture, not a measured local-search programme, and no country is assigned.',
    ` That is information architecture. No country is assigned. ${DISCLAIMER}`,
  ],
  [
    ' That is not a measured local-search programme, and no country is assigned.',
    ` No country is assigned. ${DISCLAIMER}`,
  ],
  [
    'are not a measured local-search programme, and no place name is assigned.',
    `are not assigned a place name. ${DISCLAIMER}`,
  ],
  [
    ' No city ranking or measured local-search result is published.',
    ` No city ranking is published. ${DISCLAIMER}`,
  ],
  [
    ' No city, region, or measured local-search result is published.',
    ` No city or region ranking is published. ${DISCLAIMER}`,
  ],
]

const applyClauses = (value: string): string => {
  let next = value
  for (const [from, to] of clausePairs) {
    if (next.includes(from)) next = next.split(from).join(to)
  }
  return next.replace(/[ ]{2,}/g, ' ').trim()
}

const walk = (value: unknown): unknown => {
  if (typeof value === 'string') return applyClauses(value)
  if (Array.isArray(value)) return value.map((item) => walk(item))
  if (!value || typeof value !== 'object') return value
  const next: Record<string, unknown> = {}
  for (const [key, item] of Object.entries(value as Record<string, unknown>)) next[key] = walk(item)
  return next
}

const paragraph = (text: string) => ({ type: 'paragraph', content: [{ type: 'text', text }] })
const heading = (text: string) => ({
  type: 'heading',
  attrs: { level: 2 },
  content: [{ type: 'text', text }],
})

const appendParagraph = (field: unknown, text: string) => {
  if (!field || typeof field !== 'object') return false
  const doc = field as { type?: string; content?: unknown[] }
  if (doc.type !== 'doc' || !Array.isArray(doc.content)) return false
  if (JSON.stringify(doc).includes(text)) return false
  doc.content.push(paragraph(text))
  return true
}

const words = (text: string) => text.split(/\s+/).filter(Boolean).length

const aboutBlocks = [
  heading('Who this practice is for'),
  paragraph(
    'Maryan Polyak works with manufacturing and industrial companies that need their products, capabilities, and applications to be found by commercial buyers. The public name of the practice is Manufacturing Marketing Agency. The focus is firms that make or engineer physical products, including metal structures, facade systems, industrial equipment, engineering systems, and heating equipment.',
  ),
  paragraph(
    'A manufacturer often has several product lines, several markets, and a sales cycle in which an engineer, a buyer, and a manager all read the same website. If that range is collapsed into one general page, the right inquiry is harder to earn. The same gap appears when a buyer uses a conventional search engine and when an AI assistant retrieves pages and summarizes them.',
  ),
  heading('Long-term work with technical products'),
  paragraph(
    'The practice rests on about twenty years of SEO, website structure, technical content, and digital marketing for complex B2B products. The usual materials are large catalogs, specifications, differences in application, and documentation that has to stay accurate. The work starts from what the company actually makes and sells, then covers the structure of the website or store, the technical pages, and the promotion around them.',
  ),
  paragraph(
    'Promotion can include classic SEO, content, paid search, link acquisition, and relevant external references. These are parts of one system. A link and an unlinked mention are different signals. Neither is treated as a guaranteed placement in an AI answer.',
  ),
  heading('SEO as the foundation for AI search'),
  paragraph(
    'Classic technical SEO remains the foundation. Pages still have to be crawlable and tied to a real product, capability, or application. Semantic architecture, internal links, and the vocabulary of the industry are what make a manufacturing site understandable in ordinary search.',
  ),
  paragraph(
    'AI search extends that foundation. The same facts are organized so AI systems can read them and accurately cite them when they use a source. This is the work sometimes called Generative Engine Optimization (GEO) and answer-engine optimization (AEO). It is structure that is readable by both search engines and AI systems, including assistants such as ChatGPT, Perplexity, Gemini, and Google AI Overviews.',
  ),
  paragraph(
    'Those products do not retrieve information in one shared way. A citation or recommendation is not guaranteed. Older projects on this site record the work done at the time. They are evidence of technical marketing practice, not claims of a measured GEO or AEO programme.',
  ),
  heading('How an engagement is organized'),
  paragraph(
    'An engagement starts from the products, the markets, and the commercial task. Website structure, specifications, applications, and promotion are decided from that. Complex catalogs and long sales cycles are normal in this work, not an edge case. Not every company needs every service at once, and many projects continue for years because the range changes.',
  ),
  paragraph(
    'The aim is a foundation for visibility in ordinary search and in AI answers: clear catalog structure, verifiable technical content, and a semantic architecture that supports both classic SEO and generative search.',
  ),
]

const aboutPlain = aboutBlocks
  .flatMap((block) => {
    const content = (block as { content?: Array<{ text?: string }> }).content
    return content?.map((node) => node.text ?? '') ?? []
  })
  .join(' ')

const insightBySlug: Record<string, string> = {
  'montagspecstroy-construction-engineering':
    'As buyers use AI assistants to shortlist construction and engineering firms, separate pages for design, fabrication, installation, and reconstruction remain easier to retrieve than one general metal-products page.',
  'ivikom-metal-products':
    'As buyers use AI assistants to shortlist metal fabricators, distinct pages for racks, stands, cabinets, containers, and powder coating still describe the offer more accurately than a single metal-goods page.',
  'miks-industrial-manufacturing':
    'As buyers use AI assistants to shortlist industrial manufacturers, separate pages for beams, medical furniture, shelving, and staircases remain the useful part of this architecture. The published search figures stay ordinary SEO results.',
  'areks-upholstered-furniture':
    'As buyers use AI assistants to shortlist furniture makers, a catalog that names sofa types and folding mechanisms is still clearer than a generic furniture page.',
  'house-of-sofas-sofa-manufacturer':
    'As buyers use AI assistants to shortlist sofa manufacturers, product and mechanism pages remain the part of this project that transfers. The PPC figures stay paid-search results.',
  'siblux-timber-houses-wooden-windows':
    'As buyers use AI assistants to shortlist building-product companies, keeping timber houses and wooden windows on separate paths is still the relevant structure.',
  'geothermal-heating-system-solutions':
    'As buyers use AI assistants to compare heating equipment, category and system pages are the transferable part of this catalog. The project is a heating catalog and installation offer, not a factory AI programme.',
  'sauna-shop-turnkey-sauna-bath':
    'As buyers use AI assistants to plan a sauna or bath, separate destinations for heaters, chimneys, timber, insulation, and finishing remain more useful than one room slogan.',
  'stove-shop-heating-sauna-solutions':
    'As buyers use AI assistants to compare heating and sauna products, the maintained catalog, brand pages, and installation paths are what still transfer. This record is a retailer-installer, and its SEO and ads figures stay in those channels.',
  'grosstek-aluminum-composite-panels':
    'As buyers use AI assistants to shortlist facade-material manufacturers, pages for the panel brands, production, and ventilated-facade applications are the structure that still matters.',
  'promtehmontg-facade-engineering-installation':
    'As buyers use AI assistants to shortlist facade contractors, separate paths for cladding materials, mounting systems, engineering, and installation remain the useful map. The firm is an engineer-installer, not a panel manufacturer.',
  'gptm-group-facade-systems':
    'As buyers use AI assistants to shortlist facade companies, the distinction between engineering, components, materials, supply, and installation is the part of this long SEO programme that still transfers.',
  'ventfasad-ventilated-facade-installation':
    'As buyers use AI assistants to shortlist facade installers, system, mounting, engineering, and installation pages remain more accurate than one contractor slogan.',
  'alumatrix-facade-systems':
    'As buyers use AI assistants to shortlist facade manufacturers, the panel, facade, mounting, and installation structure is what still transfers. The link building in this project remains link building, not an unlinked-mentions programme.',
  'aleks-sf-jewelry-retail-equipment':
    'As buyers use AI assistants to shortlist retail-equipment makers, pages for showcases, fixtures, production, and installation still describe a manufacturer of store equipment, not a jeweler.',
  'npk-binar-roofing-systems':
    'As buyers use AI assistants to shortlist roofing suppliers, separate pages for materials, fabricated parts, drainage, and installation remain the relevant structure.',
  'ovik-montag-hvac-engineering-seo':
    'As buyers use AI assistants to shortlist building-engineering contractors, heating, ventilation, air conditioning, design, and installation still need their own paths. This is a contractor record, not a product-factory case.',
  'security-systems-anhor':
    'As buyers use AI assistants to shortlist security contractors, a hierarchy that keeps the integrated offer visible and each system findable is the part that still transfers. The company is not described here as a manufacturer.',
  'merkan-invest-stroy-ventilation-systems':
    'As buyers use AI assistants to shortlist ventilation contractors, the path from calculation and design through fabrication, installation, and maintenance is the structure that still matters.',
  'vimpel-engineering-anechoic-chambers':
    'As buyers use AI assistants to shortlist specialist engineering firms, pages that separate chambers, absorbers, test types, and applications remain easier to interpret than a thin company profile. No new specifications are added here.',
  'nesko-energy-efficiency':
    'As buyers use AI assistants to compare energy-efficiency services, separate paths for audit, efficiency, and implementation are clearer than one generic page. This case is a service practice, not a product-manufacturing example.',
  'paktrademash-packaging-equipment':
    'As buyers use AI assistants to shortlist equipment suppliers, pages organized by equipment type and application remain the useful part of this website expansion.',
  'pnevmomachta-long-term-digital-presence':
    'As buyers use AI assistants to shortlist mast manufacturers, years of application pages for firefighting, lighting, antennas, communications, and vehicle mounts are the corpus that still transfers.',
  'laser-made-two-manufacturing-websites':
    'As buyers use AI assistants to shortlist fabrication shops, the links between material, process, and finished product are the structure that still transfers. Social channels in this record are not treated as an AI-ranking method.',
}

const SKIP = new Set(['id', 'createdAt', 'updatedAt', 'populatedAuthors'])

const changedData = (before: Record<string, unknown>, after: Record<string, unknown>) => {
  const data: Record<string, unknown> = {}
  for (const key of Object.keys(after)) {
    if (SKIP.has(key)) continue
    if (JSON.stringify(before[key]) !== JSON.stringify(after[key])) data[key] = after[key]
  }
  return data
}

const save = async (
  payload: Payload,
  collection: 'services' | 'case-studies' | 'pages',
  id: number | string,
  data: Record<string, unknown>,
) => {
  if (Object.keys(data).length === 0) return
  await payload.update({
    collection,
    id,
    draft: false,
    overrideAccess: true,
    context,
    data: { ...data, _status: 'published' },
  })
}

const run = async () => {
  const aboutCount = words(aboutPlain)
  if (aboutCount < 400 || aboutCount > 600) {
    throw new Error(`About word count ${aboutCount} is outside 400-600`)
  }
  console.log('About words', aboutCount)

  const payload = await getPayload({ config })

  const aboutResult = await payload.find({
    collection: 'pages',
    depth: 0,
    draft: false,
    limit: 1,
    pagination: false,
    overrideAccess: true,
    where: { slug: { equals: 'about' } },
  })
  const about = aboutResult.docs[0]
  if (!about) throw new Error('About page missing')
  const aboutBefore = JSON.parse(JSON.stringify(about)) as Record<string, unknown>
  const aboutAfter = JSON.parse(JSON.stringify(about)) as {
    layout?: Array<{ columns?: Array<{ richText?: { type?: string; content?: unknown[] } }> }>
    meta?: { description?: string | null }
  }
  const richText = aboutAfter.layout?.[0]?.columns?.[0]?.richText
  if (!richText || richText.type !== 'doc') throw new Error('About rich text missing')
  richText.content = aboutBlocks
  if (aboutAfter.meta) {
    aboutAfter.meta.description =
      'Manufacturing marketing for industrial companies: technical SEO as the foundation, with content and structure that AI systems can read and cite.'
  }
  await save(payload, 'pages', about.id, changedData(aboutBefore, aboutAfter as unknown as Record<string, unknown>))
  payload.logger.info('Rewrote about page')

  const services = await payload.find({
    collection: 'services',
    depth: 0,
    draft: false,
    limit: 20,
    pagination: false,
    overrideAccess: true,
    where: { _status: { equals: 'published' } },
  })

  for (const service of services.docs) {
    const before = JSON.parse(JSON.stringify(service)) as Record<string, unknown>
    const after = JSON.parse(JSON.stringify(service)) as {
      slug?: string
      introduction?: { supportingText?: unknown }
      serviceScope?: Array<{ title?: string; description?: unknown }>
    }
    if (after.slug === 'marketing-strategy-roadmap') {
      appendParagraph(
        after.introduction?.supportingText,
        'A current manufacturing strategy also has to account for buyers who discover vendors through AI assistants such as ChatGPT, Perplexity, and Google AI Overviews, not only through classic search and ads.',
      )
      const exists = after.serviceScope?.some((item) => item.title === 'AI-answer visibility in the audit')
      if (!exists) {
        after.serviceScope = after.serviceScope ?? []
        after.serviceScope.push({
          title: 'AI-answer visibility in the audit',
          description: {
            type: 'doc',
            content: [
              paragraph(
                'The audit notes whether the company is already visible in AI assistants such as ChatGPT, Perplexity, and Google AI Overviews, next to ordinary search. It records what can be observed. It does not promise a ranking or a citation.',
              ),
            ],
          },
        })
      }
    }
    if (after.slug === 'website-design-development-for-manufacturers') {
      appendParagraph(
        after.introduction?.text,
        'Architecture, structured data, and content structure are built so both Google and AI systems can understand the products, applications, and capabilities.',
      )
      const foundation = after.serviceScope?.find((item) => item.title === 'A foundation for SEO and AI-powered search')
      appendParagraph(
        foundation?.description,
        'Pages are structured for human buyers and so that AI systems can accurately cite the product, application, and capability facts on the page. A citation is not guaranteed.',
      )
    }
    if (after.slug === 'lead-generation') {
      appendParagraph(
        after.introduction?.supportingText,
        'Paid and outbound campaigns also work better when the website and content already support organic search and AI visibility, so the brand is not unknown when the ad is seen.',
      )
    }
    if (after.slug === 'sales-enablement-crm') {
      appendParagraph(
        after.introduction?.supportingText,
        'Clean pipeline records and clear product or application labels also give marketing a reliable source for content that AI systems can use.',
      )
    }
    if (after.slug === 'seo-ai-search-optimization') {
      const scope = after.serviceScope?.find((item) => item.title === 'AI Search Optimization')
      appendParagraph(
        scope?.description,
        'This layer is also called Generative Engine Optimization (GEO) and answer-engine optimization (AEO). It prepares pages so systems such as ChatGPT, Perplexity, Gemini, and Google AI Overviews can read them and accurately cite them when they use a source. Those products do not share one method, and a mention is not guaranteed.',
      )
    }
    if (after.slug === 'technical-content-thought-leadership') {
      const scope = after.serviceScope?.find((item) => item.title === 'Retrieval-oriented structure')
      appendParagraph(
        scope?.description,
        'The practical aim is content that ChatGPT, Perplexity, Gemini, and Google AI Overviews can accurately cite when they rely on a retrieved passage. GEO and AEO are names for that readiness, not a promise that a given answer will name the company.',
      )
    }
    const data = changedData(before, after as unknown as Record<string, unknown>)
    if (Object.keys(data).length > 0) {
      await save(payload, 'services', service.id, data)
      payload.logger.info(`Updated service ${service.slug}`)
    }
  }

  const cases = await payload.find({
    collection: 'case-studies',
    depth: 0,
    draft: false,
    limit: 50,
    pagination: false,
    overrideAccess: true,
    where: { _status: { equals: 'published' } },
  })

  for (const item of cases.docs) {
    const before = JSON.parse(JSON.stringify(item)) as Record<string, unknown>
    const after = walk(JSON.parse(JSON.stringify(item))) as {
      slug?: string
      aiSearchOptimization?: { entityAndGeoStructure?: unknown }
      expertInsight?: unknown
    }
    appendParagraph(after.aiSearchOptimization?.entityAndGeoStructure, DISCLAIMER)
    const insight = after.slug ? insightBySlug[after.slug] : undefined
    if (!insight) throw new Error(`No insight line for ${after.slug}`)
    appendParagraph(after.expertInsight, insight)
    const data = changedData(before, after as unknown as Record<string, unknown>)
    await save(payload, 'case-studies', item.id, data)
    payload.logger.info(`Updated case ${item.slug}`)
  }

  process.exit(0)
}

void run().catch((error) => {
  console.error(error)
  process.exit(1)
})
