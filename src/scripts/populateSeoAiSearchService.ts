import 'dotenv/config'
import { generateJSON } from '@tiptap/html'
import config from '@payload-config'
import { getPayload } from 'payload'

import { getServiceUrl } from '../utilities/getContentUrls'
import { getTiptapExtensions } from '../utilities/richText/extensions'

/**
 * Fills the existing SEO & AI Search Optimization Service in place.
 * Does not create a Service, change the collection schema, or publish
 * placeholder metrics, prices, logos, or testimonials.
 *
 * Re-runnable: structured arrays are replaced, not appended.
 */
const SLUG = 'seo-ai-search-optimization'

const RELATED_SERVICE_SLUGS = [
  'website-design-development-for-manufacturers',
  'technical-content-thought-leadership',
  'lead-generation',
] as const

const AGENCY_NAME = 'Maryan Polyak'

const rt = (html: string) => generateJSON(html, getTiptapExtensions({ headingLevels: [2, 3, 4] }))
const rtCta = (html: string) =>
  generateJSON(html, getTiptapExtensions({ headingLevels: [1, 2, 3, 4] }))

const escapeHtml = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const paragraphs = (...texts: string[]) => texts.map((text) => `<p>${escapeHtml(text)}</p>`).join('')

const bullets = (items: string[]) =>
  `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`

const populate = async () => {
  const payload = await getPayload({ config })

  const existing = await payload.find({
    collection: 'services',
    depth: 0,
    limit: 1,
    pagination: false,
    where: { slug: { equals: SLUG } },
  })

  const service = existing.docs[0]
  if (!service) {
    throw new Error(`Existing Service not found for slug ${SLUG}. Refusing to create one.`)
  }

  const related = await payload.find({
    collection: 'services',
    depth: 0,
    limit: RELATED_SERVICE_SLUGS.length,
    pagination: false,
    where: { slug: { in: [...RELATED_SERVICE_SLUGS] } },
    select: { slug: true, title: true },
  })

  const relatedBySlug = new Map(related.docs.map((doc) => [doc.slug, doc]))
  const relatedServiceIds = RELATED_SERVICE_SLUGS.flatMap((slug) => {
    const doc = relatedBySlug.get(slug)
    if (!doc) {
      payload.logger.warn(`Related Service not found, skipping: ${slug}`)
      return []
    }
    payload.logger.info(`Related Service: ${doc.title} → ${getServiceUrl(doc)}`)
    return [doc.id]
  })

  const updated = await payload.update({
    collection: 'services',
    id: service.id,
    depth: 0,
    draft: false,
    data: {
      title: 'SEO & AI Search Optimization',
      service_long_title: 'SEO & AI Search Optimization for Manufacturers',
      slug: SLUG,
      generateSlug: false,
      _status: 'published',
      service_preview_title: 'SEO & AI Search Optimization',
      service_preview_description:
        'Get found by engineers and buyers in Google, ChatGPT and Perplexity. Technical SEO and AI search optimization built for manufacturers and industrial companies.',
      service_content_title: null,
      meta: {
        title: `SEO & AI Search for Manufacturers | ${AGENCY_NAME}`,
        description:
          'Get found by engineers and buyers in Google, ChatGPT and Perplexity. Technical SEO and AI search optimization built for manufacturers and industrial companies.',
      },
      introduction: {
        text: rt(
          paragraphs(
            'Get found by engineers, plant managers and procurement teams at the moment they search: in Google, in ChatGPT, in Perplexity and in AI Overviews.',
            'We build search visibility for manufacturers and industrial companies that sell complex, spec-driven products through long, committee-based sales cycles. The goal is not traffic. The goal is qualified RFQs and sales conversations.',
          ),
        ),
        supportingText: rt(
          `<h2>${escapeHtml('How Industrial Buyers Actually Search')}</h2>` +
            paragraphs(
              'Technical buyers search with part numbers, tolerances, materials, certifications and application terms, not with marketing slogans.',
              'That means your website and your presence in AI answers are your first sales rep. Our approach is built around this behavior: every page answers a specific technical question, and every question maps to a stage of the buying committee’s decision.',
            ),
        ),
      },
      clientSituations: [
        {
          title: 'We make a better product, but competitors rank above us.',
          description: rt(
            paragraphs(
              'Your engineering is stronger, yet buyers shortlist the vendor whose pages Google and AI assistants can actually read and cite.',
            ),
          ),
        },
        {
          title: 'Our catalog has thousands of SKUs and most of them are invisible.',
          description: rt(
            paragraphs(
              'Large product databases, PDF datasheets and faceted navigation often hide your best pages from search engines entirely.',
            ),
          ),
        },
        {
          title: 'Buyers now ask AI, and we don’t know if it mentions us.',
          description: rt(
            paragraphs(
              'Engineers increasingly get vendor shortlists from AI answers. If your company is not named there, you are missing the first stage of the buying process.',
            ),
          ),
        },
        {
          title: 'A good fit if you',
          description: rt(
            bullets([
              'Sell engineered, custom or technical products with a sales cycle of months rather than days',
              'Have a website with a real catalog or many capabilities to make visible',
              'Want measurable pipeline, and can share access to sales feedback and subject matter experts',
            ]),
          ),
        },
        {
          title: 'Probably not a fit if you',
          description: rt(
            bullets([
              'Need results in a few weeks with no content or site changes',
              'Sell simple consumer products or run a purely local service business',
              'Want ranking guarantees (nobody honest offers them)',
            ]),
          ),
        },
      ],
      serviceScope: [
        {
          title: 'Technical SEO for Complex Manufacturing Sites',
          description: rt(
            paragraphs(
              'Crawl and index audit, site architecture, faceted navigation and filter control, page speed and Core Web Vitals, structured data, and clean handling of PDF datasheets and CAD downloads.',
            ),
          ),
        },
        {
          title: 'Product, Capability and Application Page Architecture',
          description: rt(
            paragraphs(
              'A page structure that mirrors how engineers search: by product family, material, industry, application and certification (for example ISO 9001 or AS9100). Each page targets one intent and links to the next step.',
            ),
          ),
        },
        {
          title: 'AI Search Visibility (GEO / AEO)',
          description: rt(
            paragraphs(
              'We measure whether ChatGPT, Perplexity, Gemini and Google AI Overviews mention your brand for your key queries, then fix what is missing: answer-first content, entity and schema markup, authoritative third-party mentions, and clear product definitions AI systems can quote.',
            ),
          ),
        },
        {
          title: 'Technical Content for Engineers and Procurement',
          description: rt(
            paragraphs(
              'Application notes, comparison guides, spec explainers and FAQs written with your subject matter experts, so the content is accurate enough for an engineer and clear enough for a buyer who signs the PO.',
            ),
          ),
        },
        {
          title: 'RFQ and Lead Tracking',
          description: rt(
            paragraphs(
              'Form, call and quote-request tracking connected to your CRM, so you see which pages and queries produce real opportunities, not just sessions.',
            ),
          ),
        },
        {
          title: 'Reporting You Can Show Your CEO',
          description: rt(
            paragraphs(
              'Monthly reporting on rankings, AI mentions, qualified leads and pipeline influence, with a plain-language summary of what changed and what we do next.',
            ),
          ),
        },
      ],
      processSteps: [
        {
          stepNumber: 1,
          title: 'Search Visibility Audit',
          description: rt(
            paragraphs(
              'We analyze your rankings, technical health, competitor coverage and AI mentions for your priority product lines.',
            ),
          ),
        },
        {
          stepNumber: 2,
          title: 'Keyword and Query Architecture',
          description: rt(
            paragraphs(
              'We map the real queries of engineers, buyers and executives to specific pages, and decide what to fix, merge, create or retire.',
            ),
          ),
        },
        {
          stepNumber: 3,
          title: 'Technical Foundation',
          description: rt(
            paragraphs(
              'We resolve crawl, indexation, speed and structured data issues that block growth.',
            ),
          ),
        },
        {
          stepNumber: 4,
          title: 'Content and Page Build',
          description: rt(
            paragraphs(
              'We create or rebuild priority pages and technical content with input from your experts.',
            ),
          ),
        },
        {
          stepNumber: 5,
          title: 'AI Visibility Optimization',
          description: rt(
            paragraphs(
              'We strengthen entity signals, citations and answer-ready content, then re-test AI mentions.',
            ),
          ),
        },
        {
          stepNumber: 6,
          title: 'Measure, Report, Improve',
          description: rt(
            paragraphs(
              'We track RFQs and pipeline influence monthly and adjust priorities every quarter.',
            ),
          ),
        },
      ],
      entryOffer: {
        title: 'Start with a Search Visibility Audit',
        description: rt(
          paragraphs(
            'The lowest-risk way to begin. You receive a documented plan, whether or not you continue with us.',
          ),
        ),
        includes: rt(
          bullets([
            'Technical SEO health check of your site',
            'Ranking and competitor gap analysis for your top product lines',
            'AI search test: does ChatGPT, Perplexity, Gemini and Google mention you?',
            'Prioritized 90-day action plan with expected effort and impact',
          ]),
        ),
        duration: null,
        price: null,
        deliverables: null,
        ctaLabel: 'Get Your Free Search Visibility Audit',
        ctaUrl: '/contact',
        nextStep: rt(
          paragraphs(
            'Exact scope and pricing depend on catalog size, competition and internal resources. The audit gives you a firm number.',
          ),
        ),
      },
      workingFormat: {
        minimumEngagement: null,
        frequency: null,
        formats: [
          {
            format: 'ongoing_monthly',
            duration: 'ongoing',
            description: rt(
              paragraphs(
                'Monthly program. Ongoing SEO and AI visibility work with a dedicated strategist.',
              ),
            ),
          },
          {
            format: 'campaign',
            duration: 'one_time_project',
            description: rt(
              paragraphs(
                'Project-based. Technical cleanup, site restructure or content build with a fixed scope.',
              ),
            ),
          },
          {
            format: 'ongoing_monthly',
            duration: 'ongoing',
            description: rt(
              paragraphs('Coaching for in-house teams. We guide your marketers and review their work.'),
            ),
          },
        ],
      },
      expectedOutcomes: [],
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
            question: 'How long does SEO take for a manufacturing company?',
            answer: rt(
              paragraphs(
                'Most manufacturers see early technical and ranking improvements within 3 to 4 months, and meaningful lead growth within 6 to 12 months. Long sales cycles mean revenue impact follows later, so we agree on leading indicators for months 3, 6 and 12 up front.',
              ),
            ),
          },
          {
            question: 'What is AI search optimization (GEO/AEO)?',
            answer: rt(
              paragraphs(
                'It is the practice of making your company and products easy for AI systems such as ChatGPT, Perplexity and Google AI Overviews to find, understand and cite. It combines clear answer-first content, structured data and trusted third-party mentions.',
              ),
            ),
          },
          {
            question: 'Is SEO different for manufacturers than for other B2B companies?',
            answer: rt(
              paragraphs(
                'Yes. Buyers search with specifications, part numbers and standards. Catalogs are large, and pages are often PDFs. The decision involves engineers, procurement and management, so content must serve each of them.',
              ),
            ),
          },
          {
            question: 'Do you guarantee rankings?',
            answer: rt(
              paragraphs(
                'No. Anyone who guarantees a ranking position is not being honest. We commit to a clear plan, transparent reporting and measurable leading indicators.',
              ),
            ),
          },
          {
            question: 'Can you work with our engineers and subject matter experts?',
            answer: rt(
              paragraphs(
                'Yes, and we prefer it. We use short structured interviews so your experts spend minutes, not hours, and the content stays technically accurate.',
              ),
            ),
          },
          {
            question: 'How do you measure success?',
            answer: rt(
              paragraphs(
                'By qualified RFQs and contact requests, not raw traffic. We track form fills, calls and quote requests to your CRM and report pipeline influence where your data allows.',
              ),
            ),
          },
          {
            question: 'What do you need from us to start?',
            answer: rt(
              paragraphs(
                'Access to your website, analytics and Search Console, a list of your priority product lines, and a 60-minute kickoff with someone from sales.',
              ),
            ),
          },
        ],
      },
      relatedServices: relatedServiceIds,
      layout: [
        {
          blockType: 'cta' as const,
          richText: rtCta(
            `<h2>${escapeHtml('Ready to See Where You Stand?')}</h2>` +
              paragraphs(
                'Tell us about your products and buyers. We’ll show you where you are visible today, and where you are not.',
              ),
          ),
          links: [
            {
              link: {
                type: 'custom' as const,
                newTab: false,
                url: '/contact',
                label: 'Get Your Free Search Visibility Audit',
                appearance: 'default' as const,
              },
            },
          ],
        },
      ],
    },
  })

  payload.logger.info(`Updated existing Service ${updated.id}: ${getServiceUrl(updated)}`)
  process.exit(0)
}

void populate().catch((error) => {
  console.error(error)
  process.exit(1)
})
