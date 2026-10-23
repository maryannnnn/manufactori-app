import 'dotenv/config'

import config from '@payload-config'
import { getPayload, type Payload } from 'payload'

const context = { disableRevalidate: true, disableCategorySeo: true }

const phrasePairs: Array<[string, string]> = [
  [
    'Get found by engineers, plant managers and procurement teams at the moment they search: in Google, in ChatGPT, in Perplexity and in AI Overviews.',
    'Help engineers, plant managers, and procurement teams find the company when they search. The work covers ordinary search and prepares the same product information for AI-powered search.',
  ],
  [
    'That means your website and your presence in AI answers are your first sales rep. Our approach is built around this behavior: every page answers a specific technical question, and every question maps to a stage of the buying committee’s decision.',
    'The website has to answer those searches in ordinary results and be clear enough for AI-powered search to retrieve. Every page should answer a specific technical question and connect it to the buying committee’s decision. Presence in a named AI product is not guaranteed.',
  ],
  ['AI Search Visibility (GEO / AEO)', 'AI Search Optimization'],
  [
    'We measure whether ChatGPT, Perplexity, Gemini and Google AI Overviews mention your brand for your key queries, then fix what is missing: answer-first content, entity and schema markup, authoritative third-party mentions, and clear product definitions AI systems can quote.',
    'Where a mention in an AI-powered search product can actually be observed, we record it. The work itself is answer-first content, consistent product facts, structured data that matches the page, and relevant third-party references. Different products do not retrieve information in the same way, and a citation is not guaranteed.',
  ],
  [
    'Your engineering is stronger, yet buyers shortlist the vendor whose pages Google and AI assistants can actually read and cite.',
    'Your engineering is stronger, yet buyers more easily shortlist the vendor whose pages are clear enough to find and understand.',
  ],
  ['What is AI search optimization (GEO/AEO)?', 'What is AI search optimization?'],
  [
    'It is the practice of making your company and products easy for AI systems such as ChatGPT, Perplexity and Google AI Overviews to find, understand and cite. It combines clear answer-first content, structured data and trusted third-party mentions.',
    'It extends technical SEO. The same pages, product facts, and structured data that help ordinary search also make a manufacturer easier to retrieve in AI-powered search. Generative Engine Optimization is one name for that work. Products do not share one mechanism, and a mention or citation is not guaranteed.',
  ],
  [
    'AI search test: does ChatGPT, Perplexity, Gemini and Google mention you?',
    'A check of whether identifiable AI-powered search mentions already exist. Absence of a mention is recorded, not filled in.',
  ],
  [
    'Technical optimization, keyword research, site structure, and content so buyers can find the company by its products, technical capabilities, and applications. The work covers conventional search engines and AI tools, including ChatGPT and Perplexity.\n\nUseful when the range is hard to discover in search.\n\nPractical result: clearer visibility for real products and applications. It is not a ranking or traffic guarantee.',
    'Technical optimization, keyword research, site structure, and content so buyers can find the company by its products, technical capabilities, and applications. The same work supports ordinary search and AI-powered discovery.\n\nUseful when the range is hard to discover in search.\n\nPractical result: clearer visibility for real products and applications. It is not a ranking, citation, or traffic guarantee.',
  ],
  [
    'Get found by engineers and buyers in Google, ChatGPT and Perplexity. Technical SEO and AI search optimization built for manufacturers and industrial companies.',
    'Technical SEO and AI search optimization for manufacturers. Make products, specifications, and applications easier to find in ordinary search and in AI-powered discovery.',
  ],
  [
    "Content written from your engineers' real expertise, accurate enough for a technical buyer, clear enough for an AI system to quote.",
    "Content written from your engineers' real expertise, accurate enough for a technical buyer and specific enough to be useful if an AI-powered search system retrieves it.",
  ],
  [
    'The same qualities that earn an engineer’s trust are what AI systems look for when deciding what to cite: clear definitions, specific numbers, and content written by someone who demonstrably knows the subject. Technical accuracy is not a constraint on good content here. It is the strategy.',
    'Clear definitions, specific numbers, and writing from someone who knows the subject are useful to engineers. They also give AI-powered search more reliable material to retrieve. That does not mean a system will cite the page. Technical accuracy is still the strategy.',
  ],
  [
    'Citation by ChatGPT, Perplexity or Google AI Overviews is an objective of this work, not a promise that every piece will be named. Where mentions can be observed, they can be tracked. Where they cannot, we do not invent a number.',
    'Where a mention in an AI-powered search product can be observed, it can be tracked. Where it cannot, we do not invent a number. A citation is not an obligation of those systems.',
  ],
  [
    'Generic posts with no technical depth do not earn trust from engineers and do not get cited by AI systems looking for authoritative sources.',
    'Generic posts with no technical depth do not earn trust from engineers, and they give search systems little specific material to retrieve.',
  ],
  [
    'AI systems cite content that is specific, well-structured and clearly authoritative. If your expertise is not published that way, a competitor’s is.',
    'Specific, well-structured technical pages are easier for buyers and for AI-powered search to use. If that material is not published, a competitor’s pages may be what gets retrieved. A citation is still not guaranteed.',
  ],
  ['AI-Citation-Ready Structure', 'Retrieval-oriented structure'],
  [
    'Content formatted with clear answers, definitions and structured data so ChatGPT, Perplexity and Google AI Overviews can read it accurately and, where they choose to, cite it. Citation is the intended outcome of that structure, not a guarantee that every article will be named.',
    'Content with clear answers, definitions, and structured data that matches the page, so people and AI-powered search can interpret it. A citation may follow. It is not guaranteed.',
  ],
  [
    'It is whether tools like ChatGPT, Perplexity and Google AI Overviews reference your content when answering a buyer’s question. Content built with clear structure and real expertise has a stronger basis for being understood and potentially cited than generic marketing copy. That is the aim of the structure. It is not a ranking we can promise.',
    'It is when an AI-powered search product names a source in an answer. Clear, specific, expert content is better material to retrieve than generic copy. Whether a product cites it is not guaranteed, and it is not a ranking we can promise.',
  ],
  [
    'General content marketing optimizes for volume and broad topics. Technical content for manufacturers optimizes for accuracy and specificity, because that is what earns trust from engineers and can contribute to citations from AI systems.',
    'General content marketing optimizes for volume and broad topics. Technical content for manufacturers optimizes for accuracy and specificity, because that is what earns trust from engineers and gives AI-powered search something concrete to retrieve.',
  ],
  [
    'Technical content for manufacturers that engineers trust and AI systems cite: application notes, guides and expert articles built from your own know-how.',
    'Technical content for manufacturers that engineers can trust: application notes, guides, and expert articles built from your own know-how, and useful to AI-powered search.',
  ],
  [
    'We design and build websites for manufacturers and industrial companies with large catalogs, technical products and buyers who need specs, not slogans. The goal is a site that is fast, easy for Google and AI systems to read, and built to turn a visit into an RFQ.',
    'We design and build websites for manufacturers and industrial companies with large catalogs, technical products and buyers who need specs, not slogans. The goal is a site that is fast, organized so buyers and AI-powered search can find the right product, and built to turn a visit into an RFQ.',
  ],
  ['SEO and AI-Search Foundation Built In', 'A foundation for SEO and AI-powered search'],
  [
    'Clean URLs, structured data and page architecture that give SEO and AI search visibility work a real foundation to build on, no retrofitting required later.',
    'Clean URLs, structured data that matches the visible page, and an architecture that later SEO and AI-search work can build on.',
  ],
  ['not a measured GEO or AEO programme', 'not a measured local-search or AI-search programme'],
  ['not a measured GEO programme', 'not a measured local-search programme'],
  ['dedicated GEO or AEO program', 'dedicated local-search or AI-search program'],
  [
    'Would you now rewrite this as an AI-search or GEO case?',
    'Would you now rewrite this as an AI-search case?',
  ],
]

const applyPhrases = (value: string): string => {
  let next = value
  for (const [from, to] of phrasePairs) {
    if (next.includes(from)) next = next.split(from).join(to)
  }
  return next
}

const walk = (value: unknown): unknown => {
  if (typeof value === 'string') return applyPhrases(value)
  if (Array.isArray(value)) return value.map((item) => walk(item))
  if (!value || typeof value !== 'object') return value
  const next: Record<string, unknown> = {}
  for (const [key, item] of Object.entries(value as Record<string, unknown>)) next[key] = walk(item)
  return next
}

const paragraph = (text: string) => ({
  type: 'paragraph',
  content: [{ type: 'text', text }],
})

const appendParagraph = (field: unknown, text: string) => {
  if (!field || typeof field !== 'object') return false
  const doc = field as { type?: string; content?: Array<unknown> }
  if (doc.type !== 'doc' || !Array.isArray(doc.content)) return false
  if (JSON.stringify(doc).includes(text)) return false
  doc.content.push(paragraph(text))
  return true
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
  if (Object.keys(data).length === 0) return false
  await payload.update({
    collection,
    id,
    draft: false,
    overrideAccess: true,
    context,
    data: { ...data, _status: 'published' },
  })
  return true
}

const run = async () => {
  const payload = await getPayload({ config })

  const services = await payload.find({
    collection: 'services',
    depth: 0,
    draft: false,
    limit: 20,
    overrideAccess: true,
    pagination: false,
    where: { _status: { equals: 'published' } },
  })

  for (const service of services.docs) {
    const before = JSON.parse(JSON.stringify(service)) as Record<string, unknown>
    const after = walk(before) as Record<string, unknown> & {
      slug?: string
      introduction?: { supportingText?: unknown; text?: { content?: unknown[] } }
      serviceScope?: Array<{ title?: string; description?: unknown }>
    }

    if (after.slug === 'marketing-strategy-roadmap') {
      appendParagraph(
        after.introduction?.supportingText,
        'The roadmap also says which product lines need ordinary SEO first, and where clearer technical content would help AI-powered discovery. That is part of the sequence, not a separate shortcut.',
      )
    }
    if (after.slug === 'lead-generation') {
      appendParagraph(
        after.introduction?.supportingText,
        'Landing pages should use the same verified product facts as the organic site, so paid traffic and search do not describe two different companies. Advertising is not treated as a way to influence AI answers.',
      )
    }
    if (after.slug === 'sales-enablement-crm') {
      const reporting = after.serviceScope?.find((item) => item.title === 'Pipeline and Revenue Reporting')
      appendParagraph(
        reporting?.description,
        'Where analytics can identify it, organic inquiries and AI referral traffic are reported separately. If the referrer is not visible, the source is not invented.',
      )
    }
    if (after.slug === 'ai-search-optimization-manufacturers') {
      const text = after.introduction?.text
      const marker = 'SEO and AI search programme'
      if (text && !JSON.stringify(text).includes(marker)) {
        text.content = text.content ?? []
        text.content.push({
          type: 'paragraph',
          content: [
            { type: 'text', text: 'The foundation is the ' },
            {
              type: 'text',
              text: 'SEO and AI search programme',
              marks: [
                {
                  type: 'link',
                  attrs: {
                    href: '/services/seo-ai-search-optimization',
                    rel: null,
                    class: null,
                    target: null,
                  },
                },
              ],
            },
            {
              type: 'text',
              text: '. This page is the content-engineering work that follows it. A citation or recommendation is not guaranteed.',
            },
          ],
        })
      }
    }

    const data = changedData(before, after)
    const saved = await save(payload, 'services', service.id, data)
    payload.logger.info(`${saved ? 'Updated' : 'Unchanged'} service ${service.slug}`)
  }

  const cases = await payload.find({
    collection: 'case-studies',
    depth: 0,
    draft: false,
    limit: 50,
    overrideAccess: true,
    pagination: false,
    where: { _status: { equals: 'published' } },
  })

  for (const item of cases.docs) {
    const before = JSON.parse(JSON.stringify(item)) as Record<string, unknown>
    const after = walk(before) as Record<string, unknown>
    const raw = JSON.stringify(after)
    if (raw.includes('GEO')) payload.logger.warn(`GEO remains in case ${item.slug}`)
    const data = changedData(before, after)
    const saved = await save(payload, 'case-studies', item.id, data)
    if (saved) payload.logger.info(`Updated case ${item.slug}`)
  }

  const about = await payload.find({
    collection: 'pages',
    depth: 0,
    draft: false,
    limit: 1,
    overrideAccess: true,
    pagination: false,
    where: { slug: { equals: 'about' } },
  })
  const aboutDoc = about.docs[0]
  if (!aboutDoc) throw new Error('About page not found')
  const aboutBefore = JSON.parse(JSON.stringify(aboutDoc)) as Record<string, unknown>
  const aboutAfter = JSON.parse(JSON.stringify(aboutDoc)) as {
    layout?: Array<{ columns?: Array<{ richText?: { type?: string; content?: unknown[] } }> }>
    meta?: { title?: string | null; description?: string | null; image?: unknown }
  }
  const richText = aboutAfter.layout?.[0]?.columns?.[0]?.richText
  const heading = 'SEO experience, and what has changed in search'
  if (richText?.type === 'doc' && Array.isArray(richText.content) && !JSON.stringify(richText).includes(heading)) {
    richText.content.push(
      { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: heading }] },
      paragraph(
        'Maryan Polyak has worked in SEO, website structure, and digital marketing for about 20 years. That experience is the foundation, not a discarded method.',
      ),
      paragraph(
        'Technical optimization, site architecture, expert content, relevant links, and a clear account of what a company makes still determine whether buyers can find it. AI-powered search is another way that same information is retrieved, interpreted, and sometimes summarized. Different products do not work the same way, and none of them is obliged to cite or recommend a company.',
      ),
      paragraph(
        'Older projects on this site are records of the work that was done at the time. They are not rewritten as AI-search campaigns.',
      ),
    )
  }
  if (aboutAfter.meta) {
    aboutAfter.meta.description =
      'About this manufacturing marketing agency, and how long-running SEO experience supports AI-powered search.'
  }
  const aboutData = changedData(aboutBefore, aboutAfter as unknown as Record<string, unknown>)
  await save(payload, 'pages', aboutDoc.id, aboutData)
  payload.logger.info('Updated about page')
  process.exit(0)
}

void run().catch((error) => {
  console.error(error)
  process.exit(1)
})
