import 'dotenv/config'
import { generateJSON } from '@tiptap/html'
import config from '@payload-config'
import { getPayload } from 'payload'

import { getCaseStudyUrl, getServiceUrl } from '../utilities/getContentUrls'
import { getTiptapExtensions } from '../utilities/richText/extensions'

/**
 * Fills the existing Website Design & Development Service in place.
 * Does not create a Service, change the collection schema, or publish
 * placeholder metrics, prices, logos, or testimonials.
 *
 * Re-runnable: structured arrays are replaced, not appended.
 *
 * Existing slug is website-design-development-for-manufacturers (nav, related
 * services and seed all use it). This script does not rename it.
 */
const SLUG = 'website-design-development-for-manufacturers'
const CASE_STUDY_SLUG = 'laser-made-two-manufacturing-websites'

const RELATED_SERVICE_SLUGS = [
  'seo-ai-search-optimization',
  'marketing-strategy-roadmap',
  'technical-content-thought-leadership',
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

  const caseStudies = await payload.find({
    collection: 'case-studies',
    depth: 0,
    limit: 1,
    pagination: false,
    where: { slug: { equals: CASE_STUDY_SLUG } },
    select: { slug: true, title: true, _status: true },
  })

  const caseStudy = caseStudies.docs[0]
  const relatedCaseStudyIds = caseStudy ? [caseStudy.id] : []
  if (caseStudy) {
    payload.logger.info(
      `Related Case Study: ${caseStudy.title} [${caseStudy._status}] → ${getCaseStudyUrl(caseStudy)}`,
    )
  } else {
    payload.logger.warn(`Case Study not found, skipping: ${CASE_STUDY_SLUG}`)
  }

  const updated = await payload.update({
    collection: 'services',
    id: service.id,
    depth: 0,
    draft: false,
    data: {
      title: 'Website Design & Development for Manufacturers',
      service_long_title: 'Website Design & Development for Manufacturers',
      slug: SLUG,
      generateSlug: false,
      _status: 'published',
      service_preview_title: 'Website Design & Development for Manufacturers',
      service_preview_description:
        'Industrial websites built for engineers and procurement: fast, searchable catalogs, clear RFQ paths and a site your sales team actually uses.',
      service_content_title: null,
      meta: {
        title: `Website Design & Development for Manufacturers | ${AGENCY_NAME}`,
        description:
          'Industrial websites built for engineers and procurement: fast, searchable catalogs, clear RFQ paths and a site your sales team actually uses.',
      },
      introduction: {
        text: rt(
          paragraphs(
            'A website built for how engineers, procurement teams and distributors actually evaluate a manufacturer, not a template with your logo on it.',
            'We design and build websites for manufacturers and industrial companies with large catalogs, technical products and buyers who need specs, not slogans. The goal is a site that is fast, easy for Google and AI systems to read, and built to turn a visit into an RFQ.',
          ),
        ),
        supportingText: rt(
          `<h2>${escapeHtml('What Makes an Industrial Website Different')}</h2>` +
            paragraphs(
              'A manufacturer’s site has to serve an engineer comparing tolerances, a procurement lead comparing terms, and an executive comparing vendors, often in the same session. That means deep catalog structure, fast search and filtering, clear certifications and capabilities, and an RFQ process that does not ask for more than a first-touch buyer is willing to give.',
              'Generic web design templates are not built for this. We design around your catalog, your CAD and spec files, and your actual sales process, not a stock set of pages.',
            ),
        ),
      },
      clientSituations: [
        {
          title: 'Our website looks dated next to competitors with half our capabilities.',
          description: rt(
            paragraphs(
              'A slow, cluttered or outdated site undercuts trust before a buyer reads a single spec sheet, no matter how strong your actual production is.',
            ),
          ),
        },
        {
          title: 'People can’t find the right product in our catalog.',
          description: rt(
            paragraphs(
              'Thousands of SKUs, inconsistent categorization and PDF-only datasheets make buyers give up and call a competitor whose site just works.',
            ),
          ),
        },
        {
          title: 'We get traffic, but almost nobody fills out the RFQ form.',
          description: rt(
            paragraphs(
              'If the path from a product page to a quote request is unclear or intimidating, you are paying for visits that never become pipeline.',
            ),
          ),
        },
        {
          title: 'A good fit if you',
          description: rt(
            bullets([
              'Have a catalog, capability list or spec sheets complex enough that buyers struggle to navigate them today',
              'Need an RFQ or quote process that actually feeds your CRM and sales team',
              'Are investing in SEO or AI search visibility and need a site that can support that work',
            ]),
          ),
        },
        {
          title: 'Probably not a fit if you',
          description: rt(
            bullets([
              'Need a basic brochure site with no catalog, quoting or lead-capture requirements',
              'Want a redesign purely for aesthetics with no change to structure or performance',
              'Are not able to provide product data, photography or CMS access during the build',
            ]),
          ),
        },
      ],
      serviceScope: [
        {
          title: 'Site Architecture for Large Catalogs',
          description: rt(
            paragraphs(
              'A structure organized by product family, material, application, industry and certification, built so both buyers and search engines can navigate thousands of SKUs without getting lost.',
            ),
          ),
        },
        {
          title: 'Design Built for Technical Trust',
          description: rt(
            paragraphs(
              'A clean, modern design that signals engineering credibility: real production photography, clear certifications, no stock-photo filler.',
            ),
          ),
        },
        {
          title: 'RFQ and Quote Request Flow',
          description: rt(
            paragraphs(
              'A quote and RFQ process scoped to what a first-time visitor will actually provide, connected directly to your CRM so no request sits unseen in an inbox.',
            ),
          ),
        },
        {
          title: 'Performance, Speed and Core Web Vitals',
          description: rt(
            paragraphs(
              'A site built to load fast even with large product databases, high-resolution images and CAD or spec downloads.',
            ),
          ),
        },
        {
          title: 'CMS You Can Actually Update',
          description: rt(
            paragraphs(
              'A content management system your team can use to add products, update pricing notes or publish content without calling a developer for every change.',
            ),
          ),
        },
        {
          title: 'SEO and AI-Search Foundation Built In',
          description: rt(
            paragraphs(
              'Clean URLs, structured data and page architecture that give SEO and AI search visibility work a real foundation to build on, no retrofitting required later.',
            ),
          ),
        },
      ],
      processSteps: [
        {
          stepNumber: 1,
          title: 'Discovery and Site Audit',
          description: rt(
            paragraphs(
              'We review your current site, catalog structure, CRM and sales process to understand what is working and what is costing you leads.',
            ),
          ),
        },
        {
          stepNumber: 2,
          title: 'Information Architecture',
          description: rt(
            paragraphs(
              'We map your full catalog and content into a structure built around how buyers actually search, not your internal org chart.',
            ),
          ),
        },
        {
          stepNumber: 3,
          title: 'Design',
          description: rt(
            paragraphs(
              'We design key templates, homepage, product family, product detail, RFQ flow, around your brand and your buyers’ priorities.',
            ),
          ),
        },
        {
          stepNumber: 4,
          title: 'Development and CMS Build',
          description: rt(
            paragraphs(
              'We build the site on a CMS matched to your catalog size and team’s technical comfort, and migrate your existing content and products.',
            ),
          ),
        },
        {
          stepNumber: 5,
          title: 'QA, Speed and SEO Checks',
          description: rt(
            paragraphs(
              'We test across devices, check load speed, fix broken links and redirects, and confirm the SEO foundation is in place before launch.',
            ),
          ),
        },
        {
          stepNumber: 6,
          title: 'Launch and Handoff Training',
          description: rt(
            paragraphs(
              'We launch with a monitored rollout, then train your team to manage content so the site stays current after we step back.',
            ),
          ),
        },
      ],
      entryOffer: {
        title: 'Start with a Website Assessment',
        description: rt(
          paragraphs(
            'The lowest-risk way to begin. You receive a documented assessment, whether or not you continue with us.',
          ),
        ),
        includes: rt(
          bullets([
            'A usability and navigation review of your current site',
            'A technical health check: speed, mobile experience, broken links, indexation',
            'A review of your RFQ and quote-request flow against buyer expectations',
            'A scoped recommendation: redesign, rebuild, or targeted fixes',
          ]),
        ),
        duration: null,
        price: null,
        deliverables: null,
        ctaLabel: 'Request Your Website Assessment',
        ctaUrl: '/contact',
        nextStep: rt(
          paragraphs(
            'Exact scope and pricing depend on catalog size, number of templates and integrations with your CRM or ERP. The assessment gives you a firm number.',
          ),
        ),
      },
      workingFormat: {
        minimumEngagement: null,
        frequency: null,
        formats: [
          {
            format: 'initial_project',
            duration: 'one_time_project',
            description: rt(
              paragraphs(
                'Full website build. Discovery, architecture, design, development and launch for a new or rebuilt site.',
              ),
            ),
          },
          {
            format: 'campaign',
            duration: 'one_time_project',
            description: rt(
              paragraphs(
                'Website assessment. A focused audit to tell you whether a rebuild, redesign or targeted fix is the right call.',
              ),
            ),
          },
          {
            format: 'ongoing_monthly',
            duration: 'ongoing',
            description: rt(
              paragraphs(
                'Ongoing website support. Monthly updates, maintenance and incremental improvements after launch.',
              ),
            ),
          },
        ],
      },
      expectedOutcomes: [],
      relatedCaseStudies: relatedCaseStudyIds,
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
            question: 'How long does a manufacturing website project take?',
            answer: rt(
              paragraphs(
                'A full rebuild typically takes 8 to 16 weeks depending on catalog size, number of integrations, and how much content needs to be migrated or rewritten.',
              ),
            ),
          },
          {
            question: 'Can you migrate our existing product catalog and CAD files?',
            answer: rt(
              paragraphs(
                'Yes. We plan data migration during discovery so your product information, datasheets and CAD downloads carry over without manual re-entry.',
              ),
            ),
          },
          {
            question: 'What platform or CMS do you build on?',
            answer: rt(
              paragraphs(
                'It depends on your catalog size, team’s technical comfort and existing systems. We recommend a platform during discovery rather than defaulting to one tool for every client.',
              ),
            ),
          },
          {
            question: 'Will the site integrate with our CRM or ERP?',
            answer: rt(
              paragraphs(
                'In most cases, yes. We scope CRM and, where feasible, ERP integration during discovery so RFQs and quote requests reach the right system automatically.',
              ),
            ),
          },
          {
            question: 'Can our team update the site ourselves after launch?',
            answer: rt(
              paragraphs(
                'Yes. We build on a CMS your team can use, and we include training as part of the handoff so you are not dependent on a developer for routine updates.',
              ),
            ),
          },
          {
            question: 'Do you also handle SEO after the site launches?',
            answer: rt(
              paragraphs(
                'The site is built with an SEO foundation from day one. Ongoing SEO and AI search visibility work is a separate service we can pair with the build.',
              ),
            ),
          },
          {
            question: 'What do you need from us to start?',
            answer: rt(
              paragraphs(
                'Access to your current site and hosting, your product and catalog data, brand assets, and a 60-minute kickoff with someone from sales and someone from leadership.',
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
            `<h2>${escapeHtml('Ready to See What’s Holding Your Site Back?')}</h2>` +
              paragraphs(
                'Tell us about your catalog and your current site. We’ll show you what’s working, what isn’t, and what to fix first.',
              ),
          ),
          links: [
            {
              link: {
                type: 'custom' as const,
                newTab: false,
                url: '/contact',
                label: 'Get Your Free Website Assessment',
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
