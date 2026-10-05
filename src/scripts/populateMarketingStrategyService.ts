import 'dotenv/config'
import { generateJSON } from '@tiptap/html'
import config from '@payload-config'
import { getPayload } from 'payload'

import { getServiceUrl } from '../utilities/getContentUrls'
import { getTiptapExtensions } from '../utilities/richText/extensions'

/**
 * Fills the existing Marketing Strategy & Roadmap Service in place.
 * Does not create a Service, change the collection schema, or publish
 * placeholder metrics, prices, logos, or testimonials.
 *
 * Re-runnable: structured arrays are replaced, not appended.
 */
const SLUG = 'marketing-strategy-roadmap'

const RELATED_SERVICE_SLUGS = [
  'seo-ai-search-optimization',
  'website-design-development-for-manufacturers',
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

  const updated = await payload.update({
    collection: 'services',
    id: service.id,
    depth: 0,
    draft: false,
    data: {
      title: 'Marketing Strategy & Roadmap',
      service_long_title: 'Marketing Strategy & Roadmap for Manufacturers',
      slug: SLUG,
      generateSlug: false,
      _status: 'published',
      service_preview_title: 'Marketing Strategy & Roadmap',
      service_preview_description:
        'A documented marketing roadmap built for manufacturers and industrial companies: clear priorities, budget and a plan sales will actually use.',
      service_content_title: null,
      meta: {
        title: `Marketing Strategy & Roadmap for Manufacturers | ${AGENCY_NAME}`,
        description:
          'A documented marketing roadmap built for manufacturers and industrial companies: clear priorities, budget and a plan sales will actually use.',
      },
      introduction: {
        text: rt(
          paragraphs(
            'A documented plan that tells you exactly where to spend, what to build first, and how marketing connects to RFQs, not a slide deck that sits in a folder.',
            'We build marketing strategy for manufacturers and industrial companies that need a clear plan before they commit budget to a website, content or ads. The deliverable is a prioritized roadmap your team, your agency, or we ourselves can execute, with the reasoning behind every decision made visible.',
          ),
        ),
        supportingText: rt(
          `<h2>${escapeHtml('Why Manufacturers Need a Different Kind of Strategy')}</h2>` +
            paragraphs(
              'Industrial buying committees are larger and slower than typical B2B purchases: engineers evaluate specs, procurement negotiates terms, and management signs off, often across a cycle measured in months. A generic growth-marketing playbook built for SaaS does not map onto that process.',
              'A strategy for a manufacturer has to account for a technical buyer, a large and often messy product catalog, long consideration windows, and a sales team that still closes most deals in person or on a call. The roadmap is built around how your specific buyers actually decide, not a template.',
            ),
        ),
      },
      clientSituations: [
        {
          title: 'We keep adding marketing tactics, but nothing connects to a bigger plan.',
          description: rt(
            paragraphs(
              'A new website, a few ads, a content push, each decided on its own. Without a roadmap, spend goes to whatever is loudest this quarter, not what moves revenue.',
            ),
          ),
        },
        {
          title: 'Our last agency gave us a 60-page deck, then went quiet.',
          description: rt(
            paragraphs(
              'Strategy work that ends at the presentation is not strategy. It is a report. A real roadmap survives contact with budget season and a sales team asking what changed.',
            ),
          ),
        },
        {
          title: 'Sales and marketing don’t agree on what a qualified lead even is.',
          description: rt(
            paragraphs(
              'Without a shared plan, marketing optimizes for form fills and sales ignores them. The roadmap exists to put both functions on the same page, literally.',
            ),
          ),
        },
        {
          title: 'A good fit if you',
          description: rt(
            bullets([
              'Are about to invest in a new website, rebrand or marketing hire and want the spend to follow a plan',
              'Have sales and marketing teams that disagree on priorities or lead quality',
              'Need a documented plan to justify budget internally, to leadership or ownership',
            ]),
          ),
        },
        {
          title: 'Probably not a fit if you',
          description: rt(
            bullets([
              'Already have a clear, working strategy and just need execution help',
              'Want a long slide deck for its own sake rather than a plan you will act on',
              'Are not willing to involve sales in the process',
            ]),
          ),
        },
      ],
      serviceScope: [
        {
          title: 'Market and Competitive Position Audit',
          description: rt(
            paragraphs(
              'Where you currently win and lose RFQs, how competitors position themselves online, and which markets or verticals are underserved.',
            ),
          ),
        },
        {
          title: 'Buyer and Buying-Committee Mapping',
          description: rt(
            paragraphs(
              'Who actually influences the purchase, in what order, and what each role (engineer, procurement, plant manager, executive) needs to see before moving forward.',
            ),
          ),
        },
        {
          title: 'Channel and Budget Prioritization',
          description: rt(
            paragraphs(
              'Which channels earn investment first, website, SEO, paid, content, trade shows, email, based on where your buyers actually are, not industry averages.',
            ),
          ),
        },
        {
          title: '12-Month Roadmap with Phases and Owners',
          description: rt(
            paragraphs(
              'A sequenced plan broken into quarters, with what gets built, who is responsible, and what depends on what else being finished first.',
            ),
          ),
        },
        {
          title: 'KPI and Reporting Framework',
          description: rt(
            paragraphs(
              'The specific numbers that tell you the plan is working, tied to pipeline and RFQs, not vanity metrics like impressions or sessions.',
            ),
          ),
        },
        {
          title: 'Sales and Marketing Alignment Workshop',
          description: rt(
            paragraphs(
              'A working session with your sales team to agree on lead definitions, handoff process and feedback loops, so the roadmap survives the first quarter.',
            ),
          ),
        },
      ],
      processSteps: [
        {
          stepNumber: 1,
          title: 'Discovery and Stakeholder Interviews',
          description: rt(
            paragraphs(
              'We talk to your sales team, leadership and, where useful, your customers to understand how deals actually get won and lost today.',
            ),
          ),
        },
        {
          stepNumber: 2,
          title: 'Market and Competitive Analysis',
          description: rt(
            paragraphs(
              'We assess your current digital presence, competitor positioning and the gaps between them.',
            ),
          ),
        },
        {
          stepNumber: 3,
          title: 'Strategy and Prioritization',
          description: rt(
            paragraphs(
              'We draft the core strategic decisions: target markets, positioning, channel mix and budget allocation.',
            ),
          ),
        },
        {
          stepNumber: 4,
          title: 'Roadmap Build',
          description: rt(
            paragraphs(
              'We sequence the work into a 12-month plan with phases, dependencies and owners.',
            ),
          ),
        },
        {
          stepNumber: 5,
          title: 'Present and Stress-Test',
          description: rt(
            paragraphs(
              'We walk the roadmap through with your team and sales leadership, and adjust based on what you push back on.',
            ),
          ),
        },
        {
          stepNumber: 6,
          title: 'Handoff and Quarterly Check-Ins',
          description: rt(
            paragraphs(
              'You receive the finished roadmap and, if you continue with us, a quarterly review to keep it honest as the market and your business change.',
            ),
          ),
        },
      ],
      entryOffer: {
        title: 'Start with a Strategy Consultation',
        description: rt(
          paragraphs(
            'The lowest-risk way to begin. You receive a documented strategic assessment, whether or not you continue with us.',
          ),
        ),
        includes: rt(
          bullets([
            'A review of your current marketing versus your sales process',
            'A competitive snapshot of how three to five competitors position themselves',
            'A first-pass view of where your budget is likely misallocated',
            'A recommendation on whether a full roadmap is the right next step',
          ]),
        ),
        duration: null,
        price: null,
        deliverables: null,
        ctaLabel: 'Book Your Strategy Consultation',
        ctaUrl: '/contact',
        nextStep: rt(
          paragraphs(
            'Exact scope and pricing depend on company size, number of product lines and how many stakeholders are involved. The consultation gives you a firm number.',
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
                'Full roadmap engagement. Discovery, competitive analysis, strategy and a complete 12-month roadmap.',
              ),
            ),
          },
          {
            format: 'campaign',
            duration: 'one_time_project',
            description: rt(
              paragraphs(
                'Strategy consultation. A focused assessment to tell you whether, and where, a full roadmap is worth the investment.',
              ),
            ),
          },
          {
            format: 'ongoing_monthly',
            duration: '3_months',
            description: rt(
              paragraphs(
                'Quarterly strategy retainer. Ongoing review and adjustment of an existing roadmap as your market, budget or team changes.',
              ),
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
            question: 'How long does it take to build a marketing roadmap?',
            answer: rt(
              paragraphs(
                'A full roadmap typically takes 4 to 6 weeks from kickoff to delivery, depending on how many stakeholders we need to interview and how complex your product lines are.',
              ),
            ),
          },
          {
            question: 'Will you also execute the roadmap, or just hand it to us?',
            answer: rt(
              paragraphs(
                'Both are options. Some clients execute with their internal team, some bring in a different agency per channel, and some have us execute the plan we built. The roadmap works either way.',
              ),
            ),
          },
          {
            question: 'Do you need access to our sales team?',
            answer: rt(
              paragraphs(
                'Yes, at least for a handful of interviews and one alignment workshop. A strategy built without sales input tends to optimize for the wrong things.',
              ),
            ),
          },
          {
            question: 'How is this different from a brand or positioning project?',
            answer: rt(
              paragraphs(
                'Positioning is one input into the roadmap, not the whole deliverable. The roadmap also covers channel priority, budget sequencing and the KPIs that connect marketing activity to RFQs.',
              ),
            ),
          },
          {
            question: 'What if our budget changes halfway through the year?',
            answer: rt(
              paragraphs(
                'The roadmap is built in phases for this reason. We design it so a budget change shifts the timeline, not the underlying priorities, and a quarterly retainer keeps it current.',
              ),
            ),
          },
          {
            question: 'Do you guarantee specific results from the roadmap?',
            answer: rt(
              paragraphs(
                'No. The roadmap is a plan, not a guarantee. What we commit to is a documented, defensible set of priorities and the reasoning behind each one, reviewed with your team before it is final.',
              ),
            ),
          },
          {
            question: 'What do you need from us to start?',
            answer: rt(
              paragraphs(
                'Access to current marketing performance data, a list of your product lines and target markets, and a 60-minute kickoff with someone from sales and someone from leadership.',
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
            `<h2>${escapeHtml('Ready for a Plan Marketing and Sales Both Believe In?')}</h2>` +
              paragraphs(
                'Tell us about your business and your current marketing. We’ll tell you honestly whether a full roadmap is the right next step.',
              ),
          ),
          links: [
            {
              link: {
                type: 'custom' as const,
                newTab: false,
                url: '/contact',
                label: 'Book Your Free Strategy Consultation',
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
