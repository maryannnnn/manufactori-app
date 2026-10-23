import 'dotenv/config'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { generateJSON } from '@tiptap/html'
import config from '@payload-config'
import { getPayload } from 'payload'
import sharp from 'sharp'

import { getServiceUrl } from '../utilities/getContentUrls'
import { getTiptapExtensions } from '../utilities/richText/extensions'

/**
 * Creates or updates the AI Search Optimization & Content Engineering service.
 * Does not change other services, invent testimonials, or promise AI citations.
 */
const SLUG = 'ai-search-optimization-manufacturers'
const RELATED_SERVICE_SLUGS = [
  'seo-ai-search-optimization',
  'technical-content-thought-leadership',
  'website-design-development-for-manufacturers',
] as const

const IMAGE_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'assets')
const SOURCE = path.join(IMAGE_DIR, 'svc-source-ai-search-engineering.jpg')

const rt = (html: string) => generateJSON(html, getTiptapExtensions({ headingLevels: [2, 3, 4] }))
const rtCta = (html: string) =>
  generateJSON(html, getTiptapExtensions({ headingLevels: [1, 2, 3, 4] }))

const escapeHtml = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const paragraphs = (...texts: string[]) => texts.map((text) => `<p>${escapeHtml(text)}</p>`).join('')

const bullets = (items: string[]) =>
  `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`

const h2 = (text: string) => `<h2>${escapeHtml(text)}</h2>`

const prepareImage = async (filename: string, width: number, height?: number) => {
  const pipeline = sharp(SOURCE).rotate()
  const buffer = height
    ? await pipeline.resize(width, height, { fit: 'cover', position: 'attention' }).jpeg({ quality: 86 }).toBuffer()
    : await pipeline.resize({ width, withoutEnlargement: true }).jpeg({ quality: 86 }).toBuffer()
  return {
    name: filename,
    data: buffer,
    mimetype: 'image/jpeg' as const,
    size: buffer.byteLength,
  }
}

const uploadImage = async (
  payload: Awaited<ReturnType<typeof getPayload>>,
  filename: string,
  alt: string,
  width: number,
  height?: number,
) => {
  const existing = await payload.find({
    collection: 'media',
    where: { filename: { equals: filename } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  const file = await prepareImage(filename, width, height)
  const caption = rt(
    `<p>${escapeHtml('Licensed photograph of an engineer working at an industrial assembly station (Unsplash License). Not a client facility.')}</p>`,
  )
  if (existing.docs[0]) {
    const updated = await payload.update({
      collection: 'media',
      id: existing.docs[0].id,
      data: { alt, caption },
      file,
      overwriteExistingFiles: true,
      overrideAccess: true,
      context: { disableRevalidate: true },
    })
    return updated.id
  }
  const created = await payload.create({
    collection: 'media',
    data: { alt, caption },
    file,
    overrideAccess: true,
    context: { disableRevalidate: true },
  })
  return created.id
}

const populate = async () => {
  if (!readFileSync(SOURCE)) throw new Error('source image missing')
  const payload = await getPayload({ config })

  const pageImageId = await uploadImage(
    payload,
    'svc-page-ai-search-engineering.jpg',
    'Engineer reviewing technical work on a laptop beside an industrial assembly station.',
    1800,
  )
  const cardImageId = await uploadImage(
    payload,
    'svc-card-ai-search-engineering.jpg',
    'Engineer at a laptop beside industrial assembly equipment and wiring.',
    1600,
    1200,
  )

  const related = await payload.find({
    collection: 'services',
    depth: 0,
    limit: RELATED_SERVICE_SLUGS.length,
    pagination: false,
    overrideAccess: true,
    where: { slug: { in: [...RELATED_SERVICE_SLUGS] } },
    select: { slug: true, title: true },
  })
  const relatedBySlug = new Map(related.docs.map((doc) => [doc.slug, doc.id]))
  const relatedServiceIds = RELATED_SERVICE_SLUGS.flatMap((slug) => {
    const id = relatedBySlug.get(slug)
    if (!id) {
      payload.logger.warn(`Related service not found: ${slug}`)
      return []
    }
    return [id]
  })

  const data = {
    title: 'AI Search Optimization & Content Engineering for Manufacturers',
    service_long_title: 'AI Search Optimization for Manufacturing Companies',
    slug: SLUG,
    generateSlug: false,
    _status: 'published' as const,
    displayOrder: 7,
    featured: false,
    service_preview_title: 'AI Search Optimization & Content Engineering',
    service_preview_description:
      'Traditional SEO as the foundation, with technical content structured so people and search systems can understand your products, specifications, and applications.\n\nFor manufacturers, component suppliers, and technical B2B companies. Outcomes depend on the site, the data you can verify, and how search platforms change.',
    service_content_title:
      'Make your manufacturing expertise easier to find, understand, and evaluate across traditional search engines and AI-powered search experiences.',
    service_preview_image: pageImageId,
    service_card_image: cardImageId,
    meta: {
      title: 'AI Search Optimization for Manufacturers',
      description:
        'Improve manufacturing website SEO and technical content for AI-powered search. Make product specifications, applications, and capabilities easier to discover.',
      image: pageImageId,
    },
    introduction: {
      text: rt(
        paragraphs(
          'Combine proven SEO fundamentals with structured technical content that helps search systems understand your products, specifications, applications, and capabilities.',
        ),
      ),
      supportingText: rt(
        h2('Why traditional SEO still matters') +
          paragraphs(
            'AI-powered search experiences do not remove the need for a site that can be crawled, indexed, and understood. If a product page is thin, duplicated, or buried, neither a conventional search engine nor an AI product has much reliable material to work with.',
            'Manufacturing searches are specific. People look for product names, model numbers, part numbers, specifications, tolerances, and operating conditions. They also look for compatibility with equipment, production lines, and industrial systems, and they use the terms and standards of their industry.',
            'The site architecture should follow that behavior: product ranges, applications, industries, and technical characteristics, with internal links between those pages. Technical SEO still covers duplicate content, indexability, page performance, and whether specifications and drawings can actually be reached.',
            'The aim is to help search engines discover and interpret the manufacturer’s own content. Different AI products do not retrieve information in one shared way, and a traditional ranking position does not by itself decide whether an AI answer mentions a company.',
          ),
      ),
    },
    clientSituations: [
      {
        title: 'The catalog is real, but the pages do not say enough.',
        description: rt(
          paragraphs(
            'Product pages list a name and a few benefits, while buyers are searching for dimensions, materials, operating limits, and where the product is used.',
          ),
        ),
      },
      {
        title: 'Technical documents exist, but the site does not use them.',
        description: rt(
          paragraphs(
            'Specifications, drawings, and manuals sit in files that are hard to find, while the HTML pages around them stay vague.',
          ),
        ),
      },
      {
        title: 'Several product lines compete for the same general pages.',
        description: rt(
          paragraphs(
            'A manufacturer that serves more than one market needs pages organized around those lines, not one overview that tries to cover everything.',
          ),
        ),
      },
      {
        title: 'A good fit if you',
        description: rt(
          bullets([
            'Sell engineered products, components, equipment, or technical services',
            'Can share real specifications, applications, and limitations with the people writing the pages',
            'Want the website to support evaluation by engineers and procurement teams',
          ]),
        ),
      },
      {
        title: 'Not a fit if you',
        description: rt(
          bullets([
            'Want a guarantee that ChatGPT, Gemini, Perplexity, Copilot, or Google will recommend or cite the company',
            'Need invented specifications, certifications, or performance claims',
            'Are looking for a consumer campaign rather than technical B2B content',
          ]),
        ),
      },
    ],
    serviceScope: [
      {
        title: 'Semantic Chunking',
        description: rt(
          paragraphs(
            'Information is organized into clear, self-contained sections. A useful product or service page often answers what it is, which specifications matter, where it is used, what it must be compatible with, which operating conditions and limits apply, and which documents or next steps follow.',
            'Related facts stay together under descriptive headings. The structure is for people who need to read and check the page, not a device for cutting text into fragments for an AI product.',
          ),
        ),
      },
      {
        title: 'Technical Product Profiles',
        description: rt(
          paragraphs(
            'Vague descriptions are rewritten only where the manufacturer can support the facts. Depending on the product, a profile may cover dimensions and tolerances, materials and finishes, performance, temperature and pressure ranges, configurations, certifications and standards, installation and maintenance, and links to drawings or specifications.',
            'Specifications, certifications, and performance claims are published only when they come from the manufacturer’s data. Missing values stay missing.',
          ),
        ),
      },
      {
        title: 'Application and Compatibility Matrices',
        description: rt(
          paragraphs(
            'Where the data exists, pages can show compatible equipment or production lines, suitable operating environments, materials and conditions, industry applications, and required interfaces or installation options.',
            'Unknown or unverified compatibility is marked as unknown. The matrix is not filled in to look complete.',
          ),
        ),
      },
      {
        title: 'Technical Limitations and Conditions of Use',
        description: rt(
          paragraphs(
            'Pages can state where a product is unsuitable, which conditions it requires, and which limits a customer should weigh. Restrictions come from verified engineering information.',
            'This improves transparency and helps the wrong inquiries drop out earlier. It is not a trust score, and it is not a promise of a ranking change.',
          ),
        ),
      },
      {
        title: 'Technical Resources and Evaluation Tools',
        description: rt(
          paragraphs(
            'Where they fit the business and the site can support them, useful resources include product selectors, calculators, downloadable specifications, CAD or 3D models, configuration guides, comparison tables, installation manuals, and request-for-quotation forms.',
            'The point is to help a prospect move from research to technical evaluation and a direct inquiry. A tool is recommended only when the product data and the website can sustain it.',
          ),
        ),
      },
      {
        title: 'Optional extensions, scoped separately',
        description: rt(
          paragraphs(
            'Content engineering is one layer. Further work, when the business needs it, can include schema markup, consistent naming across the site and reputable external sources, technical SEO, relevant third-party references, visibility monitoring, and cleaner product data or site architecture.',
            'Those items are not automatically part of every engagement.',
          ),
        ),
      },
    ],
    processSteps: [
      {
        stepNumber: 1,
        title: 'Review the existing website',
        description: rt(
          paragraphs(
            'Assess technical SEO, indexing, content structure, product pages, and the documentation that is already available.',
          ),
        ),
      },
      {
        stepNumber: 2,
        title: 'Map search intent',
        description: rt(
          paragraphs(
            'Identify technical queries, product attributes, applications, and the questions engineers and buyers actually ask.',
          ),
        ),
      },
      {
        stepNumber: 3,
        title: 'Prioritize important pages',
        description: rt(
          paragraphs(
            'Focus on product categories, high-value products, applications, and landing pages tied to commercial demand.',
          ),
        ),
      },
      {
        stepNumber: 4,
        title: 'Restructure the content',
        description: rt(
          paragraphs(
            'Improve headings, technical information, tables, internal links, and the path to supporting documents.',
          ),
        ),
      },
      {
        stepNumber: 5,
        title: 'Implement technical improvements',
        description: rt(
          paragraphs(
            'Address the SEO and content-accessibility issues that fall inside the agreed scope.',
          ),
        ),
      },
      {
        stepNumber: 6,
        title: 'Measure and refine',
        description: rt(
          paragraphs(
            'Watch organic search performance, qualified inquiries, relevant referral traffic, and any AI-search visibility indicators that can actually be observed. Scope depends on the audit, the technical data on hand, and the condition of the site.',
          ),
        ),
      },
    ],
    entryOffer: {
      title: 'Start with the current website',
      description: rt(
        paragraphs(
          'A practical first step is a review of the current website: the most important content gaps, the technical issues that block discovery, and a roadmap for traditional SEO and AI-search optimization.',
        ),
      ),
      includes: rt(
        bullets([
          'A look at indexability, product-page structure, and available documentation',
          'Priority pages and queries worth addressing first',
          'A scoped recommendation, not a promise of citations or rankings',
        ]),
      ),
      duration: null,
      price: null,
      deliverables: null,
      ctaLabel: 'Discuss Your AI Search Strategy',
      ctaUrl: '/contact',
      nextStep: rt(
        paragraphs(
          'The audit uses the contact path already on this site. What happens next depends on the site, the data you can verify, and the scope you want to fund.',
        ),
      ),
    },
    workingFormat: {
      minimumEngagement: null,
      frequency: null,
      formats: [
        {
          format: 'initial_project' as const,
          duration: 'one_time_project' as const,
          description: rt(
            paragraphs(
              'An initial audit and a defined content-and-SEO project for priority pages.',
            ),
          ),
        },
        {
          format: 'ongoing_monthly' as const,
          duration: 'ongoing' as const,
          description: rt(
            paragraphs(
              'Ongoing work as the product range, markets, and search platforms change.',
            ),
          ),
        },
      ],
    },
    expectedOutcomes: [
      {
        title: 'Clearer technical and product information',
        description: rt(
          paragraphs(
            'Pages say what the product is, what it can do, and what it requires, using the manufacturer’s own data.',
          ),
        ),
      },
      {
        title: 'Better discovery for specific queries',
        description: rt(
          paragraphs(
            'High-intent searches for products, specifications, and applications have a page that matches them. Visibility still depends on competition and implementation.',
          ),
        ),
      },
      {
        title: 'Easier evaluation for engineers and procurement',
        description: rt(
          paragraphs(
            'Buyers can compare specifications, applications, and limits without hunting through unstructured copy.',
          ),
        ),
      },
      {
        title: 'A stronger base for search and AI discovery',
        description: rt(
          paragraphs(
            'Structured, accurate pages give both conventional search and AI-powered search more reliable material. No AI product is promised to recommend or cite the company.',
          ),
        ),
      },
    ],
    relatedCaseStudies: [],
    clientTestimonial: {
      quote: null,
      author: null,
      position: null,
      company: null,
    },
    faq: {
      title: 'Questions & answers',
      intro: null,
      items: [
        {
          question: 'Will ChatGPT, Gemini, or another AI product recommend us?',
          answer: rt(
            paragraphs(
              'No. This service does not promise that any AI system will recommend, rank, or cite a company. Those products change, and they do not all retrieve information the same way. The work makes your own technical information easier to find and interpret.',
            ),
          ),
        },
        {
          question: 'Does this replace traditional SEO?',
          answer: rt(
            paragraphs(
              'No. Crawlability, indexing, site structure, internal links, and useful pages remain the foundation. Content engineering builds on that foundation.',
            ),
          ),
        },
        {
          question: 'Will you write specifications we do not have?',
          answer: rt(
            paragraphs(
              'No. Dimensions, tolerances, certifications, compatibility, and limitations are published only when you can verify them. Unknown points stay unknown.',
            ),
          ),
        },
        {
          question: 'How is success judged?',
          answer: rt(
            paragraphs(
              'By whether priority pages are clearer and more discoverable, and by qualified inquiries where that can be observed. There is no guaranteed traffic, ranking, or lead count.',
            ),
          ),
        },
      ],
    },
    layout: [
      {
        blockType: 'cta' as const,
        richText: rtCta(
          h2('Make Your Manufacturing Expertise Easier to Find') +
            paragraphs(
              'Let’s review your website, identify the most important content and technical gaps, and define a practical roadmap for traditional SEO and AI-search optimization.',
            ),
        ),
        links: [
          {
            link: {
              type: 'custom' as const,
              newTab: false,
              url: '/contact',
              label: 'Request an AI Search Audit',
              appearance: 'default' as const,
            },
          },
        ],
      },
    ],
  }

  const existing = await payload.find({
    collection: 'services',
    depth: 0,
    limit: 1,
    pagination: false,
    overrideAccess: true,
    where: { slug: { equals: SLUG } },
  })

  const saved = existing.docs[0]
    ? await payload.update({
        collection: 'services',
        id: existing.docs[0].id,
        depth: 0,
        draft: false,
        overrideAccess: true,
        context: { disableRevalidate: true },
        data: { ...data, relatedServices: relatedServiceIds },
      })
    : await payload.create({
        collection: 'services',
        depth: 0,
        draft: false,
        overrideAccess: true,
        context: { disableRevalidate: true },
        data,
      })

  if (!existing.docs[0] && relatedServiceIds.length > 0) {
    await payload.update({
      collection: 'services',
      id: saved.id,
      depth: 0,
      draft: false,
      overrideAccess: true,
      context: { disableRevalidate: true },
      data: { relatedServices: relatedServiceIds },
    })
  }

  payload.logger.info(`Service ${saved.id} ${saved._status} ${getServiceUrl(saved)}`)
  process.exit(0)
}

void populate().catch((error) => {
  console.error(error)
  process.exit(1)
})
