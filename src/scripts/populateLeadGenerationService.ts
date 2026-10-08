import 'dotenv/config'
import { generateJSON } from '@tiptap/html'
import config from '@payload-config'
import { getPayload } from 'payload'

import { getServiceUrl } from '../utilities/getContentUrls'
import { getTiptapExtensions } from '../utilities/richText/extensions'

/**
 * Fills the existing Lead Generation Service in place.
 * Does not create a Service, change the collection schema, or publish
 * placeholder metrics, prices, logos, testimonials, or invented results.
 *
 * Re-runnable: structured arrays are replaced, not appended.
 */
const SLUG = 'lead-generation'
const CONTENT_SERVICE_SLUG = 'technical-content-thought-leadership'

const RELATED_SERVICE_SLUGS = [
  'marketing-strategy-roadmap',
  'technical-content-thought-leadership',
  'sales-enablement-crm',
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

  const contentService = relatedBySlug.get(CONTENT_SERVICE_SLUG)
  const contentServiceUrl = contentService ? getServiceUrl(contentService) : null
  const contentAnswer = contentServiceUrl
    ? paragraphs(
        'We create campaign assets like landing pages and ad copy. Deeper technical content, like application notes or guides, is covered under our content service and can be paired with this one.',
      ) +
      `<p><a href="${escapeHtml(contentServiceUrl)}">${escapeHtml('See Technical Content & Thought Leadership')}</a></p>`
    : paragraphs(
        'We create campaign assets like landing pages and ad copy. Deeper technical content, like application notes or guides, is a separate technical content engagement and can be paired with this one.',
      )

  const updated = await payload.update({
    collection: 'services',
    id: service.id,
    depth: 0,
    draft: false,
    data: {
      title: 'Lead Generation',
      service_long_title: 'Lead Generation for Manufacturers',
      slug: SLUG,
      generateSlug: false,
      _status: 'published',
      service_preview_title: 'Lead Generation',
      service_preview_description:
        'Paid search, LinkedIn and email campaigns built to generate qualified RFQs for manufacturers, with reporting your sales team can actually use.',
      service_content_title: null,
      meta: {
        title: `Lead Generation for Manufacturers | ${AGENCY_NAME}`,
        description:
          'Paid search, LinkedIn and email campaigns built to generate qualified RFQs for manufacturers, with reporting your sales team can actually use.',
      },
      introduction: {
        text: rt(
          paragraphs(
            'Paid and outbound demand generation built around long, committee-based sales cycles, not a generic ad template built for consumer products.',
            'We run paid search, LinkedIn, email and account-based campaigns for manufacturers and industrial companies that need qualified RFQs now, not just brand awareness. Every campaign is built around how your buying committee actually evaluates vendors, and reported in a way your sales team can act on.',
          ) +
            `<p><a href="/contact">${escapeHtml('Get a Free Lead Gen Audit')}</a></p>` +
            `<p><a href="#process">${escapeHtml('See how we work')}</a></p>`,
        ),
        supportingText: rt(
          `<h2>${escapeHtml('Why Lead Generation Is Different for Manufacturers')}</h2>` +
            paragraphs(
              'A typical B2B ad campaign is built to convert a single decision-maker quickly. An industrial purchase involves an engineer who specs it, a procurement lead who negotiates it, and an executive who approves it, often over several months. Campaigns that only target one of those roles, or that expect a fast conversion, waste budget on the wrong part of the funnel.',
              'We build campaigns around the full buying committee: different messages for different roles, offers that match where a buyer actually is in a long cycle, and tracking that follows a lead all the way to a closed RFQ, not just a form fill.',
            ),
        ),
      },
      clientSituations: [
        {
          title: 'Our ad spend generates clicks, but sales says the leads are junk.',
          description: rt(
            paragraphs(
              'Generic targeting and vague offers attract browsers, not buyers. Without industry and role-level targeting, you pay for volume that goes nowhere.',
            ),
          ),
        },
        {
          title: 'We don’t know which channel is actually producing pipeline.',
          description: rt(
            paragraphs(
              'Without tracking tied to your CRM, every channel looks equally good or equally bad, and budget gets allocated by opinion instead of evidence.',
            ),
          ),
        },
        {
          title: 'Our sales cycle is six months, and our ad platform wants weekly wins.',
          description: rt(
            paragraphs(
              'Standard ad-platform optimization chases fast conversions. Industrial buying cycles need campaigns built to nurture a slow decision, not force a quick one.',
            ),
          ),
        },
        {
          title: 'A good fit if you',
          description: rt(
            bullets([
              'Have a defined target market or set of accounts you want more RFQs from',
              'Can connect campaign data to your CRM, or are willing to set that up',
              'Understand that an industrial sales cycle takes months, not days',
            ]),
          ),
        },
        {
          title: 'Probably not a fit if you',
          description: rt(
            bullets([
              'Want leads this week with no ramp-up or testing period',
              'Have no CRM or way to track what happens to a lead after the form fill',
              'Expect cost per lead alone to tell the whole story, without looking at pipeline',
            ]),
          ),
        },
      ],
      serviceScope: [
        {
          title: 'Paid Search for High-Intent Technical Queries',
          description: rt(
            paragraphs(
              'Google Ads campaigns built around the specific, technical terms engineers and procurement actually search, not broad industry keywords that waste spend.',
            ),
          ),
        },
        {
          title: 'LinkedIn and Account-Based Campaigns',
          description: rt(
            paragraphs(
              'Targeted campaigns by job title, industry and company, built to reach engineers, procurement and executives separately with messages suited to each.',
            ),
          ),
        },
        {
          title: 'Email Nurture for Long Sales Cycles',
          description: rt(
            paragraphs(
              'Sequences built to keep a six-to-twelve-month buyer engaged with useful content, not a generic drip of promotional emails.',
            ),
          ),
        },
        {
          title: 'Landing Pages Built to Convert',
          description: rt(
            paragraphs(
              'Offer-specific landing pages matched to each campaign, tested and optimized instead of pointing every ad at your homepage.',
            ),
          ),
        },
        {
          title: 'CRM-Connected Lead Tracking',
          description: rt(
            paragraphs(
              'Every lead tracked from first click to closed RFQ in your CRM, so you know which campaigns actually produce pipeline, not just form fills.',
            ),
          ),
        },
        {
          title: 'Reporting Tied to Pipeline, Not Vanity Metrics',
          description: rt(
            paragraphs(
              'Monthly reporting on cost per qualified lead, pipeline influence and campaign-level ROI, in language your sales team and leadership can use.',
            ),
          ),
        },
      ],
      processSteps: [
        {
          stepNumber: 1,
          title: 'Lead Gen Audit',
          description: rt(
            paragraphs(
              'We review your current campaigns, targeting, tracking and CRM data to find what is wasting spend and what is already working.',
            ),
          ),
        },
        {
          stepNumber: 2,
          title: 'Audience and Offer Strategy',
          description: rt(
            paragraphs(
              'We define target roles, industries and accounts, and build offers matched to where each buyer is in the decision process.',
            ),
          ),
        },
        {
          stepNumber: 3,
          title: 'Campaign Build',
          description: rt(
            paragraphs(
              'We build out paid search, LinkedIn, email and landing page assets, with tracking connected to your CRM from day one.',
            ),
          ),
        },
        {
          stepNumber: 4,
          title: 'Launch and Early Optimization',
          description: rt(
            paragraphs(
              'We launch with a tight feedback loop in the first 30 to 60 days, cutting what underperforms and scaling what works.',
            ),
          ),
        },
        {
          stepNumber: 5,
          title: 'Ongoing Management',
          description: rt(
            paragraphs(
              'We manage bids, creative, audiences and offers on an ongoing basis as campaign data accumulates.',
            ),
          ),
        },
        {
          stepNumber: 6,
          title: 'Monthly Reporting and Sales Feedback Loop',
          description: rt(
            paragraphs(
              'We report on cost per qualified lead and pipeline influence, and adjust based on direct feedback from your sales team.',
            ),
          ),
        },
      ],
      entryOffer: {
        title: 'Start with a Lead Gen Audit',
        description: rt(
          paragraphs(
            'The lowest-risk way to begin. You receive a documented assessment, whether or not you continue with us.',
          ),
        ),
        includes: rt(
          bullets([
            'A review of your current paid and outbound campaigns against your sales data',
            'An analysis of where budget is likely being wasted on poor-fit targeting',
            'A check of whether your lead tracking actually connects to closed RFQs',
            'A prioritized recommendation on channel mix and budget allocation',
          ]),
        ),
        duration: null,
        price: null,
        deliverables: null,
        ctaLabel: 'Request Your Lead Gen Audit',
        ctaUrl: '/contact',
        nextStep: rt(
          paragraphs(
            'Exact scope and pricing depend on target market size, number of channels and ad spend level. The audit gives you a firm number.',
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
                'Monthly management program. Ongoing campaign management across paid search, LinkedIn and email, including a dedicated strategist.',
              ),
            ),
          },
          {
            format: 'campaign',
            duration: 'one_time_project',
            description: rt(
              paragraphs(
                'Lead gen audit. A focused assessment of current campaigns and tracking.',
              ),
            ),
          },
          {
            format: 'initial_project',
            duration: 'one_time_project',
            description: rt(
              paragraphs(
                'Campaign launch project. Initial strategy, build and launch of a new campaign set, before moving to ongoing management.',
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
            question: 'How long before we see qualified leads?',
            answer: rt(
              paragraphs(
                'Paid search can produce early signal within the first few weeks. LinkedIn and account-based campaigns, and campaigns aimed at longer sales cycles, typically need 2 to 3 months to show reliable qualified lead volume.',
              ),
            ),
          },
          {
            question: 'Do you manage the ad spend, or just the strategy?',
            answer: rt(
              paragraphs(
                'We manage campaigns directly, including bids, creative, audiences and budget pacing, and report transparently on how spend is allocated.',
              ),
            ),
          },
          {
            question: 'How do you define a “qualified” lead?',
            answer: rt(
              paragraphs(
                'We define it together with your sales team during onboarding, based on your actual buying committee and ICP, not a generic industry definition.',
              ),
            ),
          },
          {
            question: 'What is our minimum ad spend commitment?',
            answer: rt(
              paragraphs(
                'Spend depends on your target market size and goals. We recommend a minimum during the audit based on what is realistic to generate meaningful data.',
              ),
            ),
          },
          {
            question: 'Can you work with our existing CRM?',
            answer: rt(
              paragraphs(
                'In most cases, yes. We integrate with common CRMs so leads and pipeline stages sync automatically rather than being tracked manually.',
              ),
            ),
          },
          {
            question: 'Do you also create the content used in campaigns?',
            answer: rt(contentAnswer),
          },
          {
            question: 'What do you need from us to start?',
            answer: rt(
              paragraphs(
                'Access to your current ad accounts and CRM, a defined target market or account list, and a 60-minute kickoff with sales to align on lead definitions.',
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
            `<h2>${escapeHtml('Ready for Leads Your Sales Team Actually Wants?')}</h2>` +
              paragraphs(
                'Tell us about your target market and current campaigns. We’ll show you where budget is working and where it isn’t.',
              ),
          ),
          links: [
            {
              link: {
                type: 'custom' as const,
                newTab: false,
                url: '/contact',
                label: 'Get Your Free Lead Gen Audit',
                appearance: 'default' as const,
              },
            },
            {
              link: {
                type: 'custom' as const,
                newTab: false,
                url: '#process',
                label: 'See how we work',
                appearance: 'outline' as const,
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
