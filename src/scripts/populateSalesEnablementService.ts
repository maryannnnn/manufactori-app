import 'dotenv/config'
import { generateJSON } from '@tiptap/html'
import config from '@payload-config'
import { getPayload } from 'payload'

import { getServiceUrl } from '../utilities/getContentUrls'
import { getTiptapExtensions } from '../utilities/richText/extensions'

/**
 * Fills the existing Sales Enablement & CRM Service in place.
 * Does not create a Service, change the collection schema, or publish
 * placeholder metrics, prices, logos, testimonials, or invented results.
 *
 * Re-runnable: structured arrays are replaced, not appended.
 */
const SLUG = 'sales-enablement-crm'

const RELATED_SERVICE_SLUGS = [
  'lead-generation',
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

  const leadGeneration = relatedBySlug.get('lead-generation')
  const leadGenerationUrl = leadGeneration ? getServiceUrl(leadGeneration) : null

  const updated = await payload.update({
    collection: 'services',
    id: service.id,
    depth: 0,
    draft: false,
    data: {
      title: 'Sales Enablement & CRM',
      service_long_title: 'Sales Enablement & CRM for Manufacturers',
      slug: SLUG,
      generateSlug: false,
      _status: 'published',
      service_preview_title: 'Sales Enablement & CRM',
      service_preview_description:
        'CRM setup and sales enablement built for manufacturers: clean pipelines, clear lead handoff, and marketing-to-sales alignment that actually closes RFQs.',
      service_content_title: null,
      meta: {
        title: `Sales Enablement & CRM for Manufacturers | ${AGENCY_NAME}`,
        description:
          'CRM setup and sales enablement built for manufacturers: clean pipelines, clear lead handoff, and marketing-to-sales alignment that actually closes RFQs.',
      },
      introduction: {
        text: rt(
          paragraphs(
            'A CRM your sales team will actually use, and a clean handoff from marketing lead to closed RFQ, built around how industrial deals really get won.',
            "We set up and optimize CRM systems and sales enablement processes for manufacturers and industrial companies where marketing and sales run on different assumptions about what a lead is worth. The goal is one shared pipeline, clear ownership at every stage, and reporting that shows marketing's real influence on revenue.",
          ) +
            `<p><a href="/contact">${escapeHtml('Get a Free CRM & Pipeline Audit')}</a></p>` +
            `<p><a href="#process">${escapeHtml('See how we work')}</a></p>`,
        ),
        supportingText: rt(
          `<h2>${escapeHtml('Why This Looks Different for Manufacturers')}</h2>` +
            paragraphs(
              'Industrial sales reps often come from an engineering or technical background, not a software sales background, and many have run their pipeline from memory and a notebook for years. A CRM rollout that ignores that reality gets adopted for a month and then abandoned.',
              'A long, committee-based sales cycle also means a single lead can stay in play for months, touched by multiple people on both sides. The CRM and process have to reflect that reality: multiple contacts per account, long stage durations, and a handoff that works whether the deal closes in six weeks or sixteen months.',
            ),
        ),
      },
      clientSituations: [
        {
          title: 'Our CRM is basically a glorified spreadsheet nobody trusts.',
          description: rt(
            paragraphs(
              'If reps keep their own tracking on the side, the CRM stops reflecting reality, and every forecast and report built on it is guesswork.',
            ),
          ),
        },
        {
          title: 'Marketing sends leads, and sales says they never follow up properly.',
          description: rt(
            paragraphs(
              'Without a defined handoff process and shared lead definitions, good leads sit untouched while reps chase whatever feels most promising that day.',
            ),
          ),
        },
        {
          title: 'We can’t prove marketing’s impact on revenue, so budget conversations are all opinion.',
          description: rt(
            paragraphs(
              "If a lead's path from first touch to closed deal isn't tracked end to end, marketing can't show what's working, and every budget decision is a guess.",
            ),
          ),
        },
        {
          title: 'A good fit if you',
          description: rt(
            bullets([
              "Have a sales team that doesn't fully trust or consistently use your current CRM",
              'Are investing in marketing and want to prove its effect on pipeline and revenue',
              "Have leadership willing to enforce a shared process once it's built",
            ]),
          ),
        },
        {
          title: 'Probably not a fit if you',
          description: rt(
            bullets([
              'Want a CRM swap with no change to process, data or team habits',
              'Have a sales leader unwilling to require the team to use a shared system',
              'Expect full adoption within days of rollout with no training period',
            ]),
          ),
        },
      ],
      serviceScope: [
        {
          title: 'CRM Setup and Configuration',
          description: rt(
            paragraphs(
              'A pipeline, stages and fields built around your actual sales process, not a generic default template your team will fight against.',
            ),
          ),
        },
        {
          title: 'Lead Scoring and Handoff Rules',
          description: rt(
            paragraphs(
              'A clear, shared definition of what makes a lead sales-ready, and an automated handoff process so qualified leads reach a rep without delay.',
            ),
          ),
        },
        {
          title: 'Marketing and Sales Alignment (SLA)',
          description: rt(
            paragraphs(
              'A documented service-level agreement between marketing and sales: what marketing commits to deliver, what sales commits to follow up on, and by when.',
            ),
          ),
        },
        {
          title: 'Sales Playbooks and Talk Tracks',
          description: rt(
            paragraphs(
              'Practical, role-specific materials that help reps handle common objections and technical questions consistently across the team.',
            ),
          ),
        },
        {
          title: 'Pipeline and Revenue Reporting',
          description: rt(
            paragraphs(
              'Dashboards that connect marketing activity to pipeline and closed revenue, so leadership sees real numbers instead of channel-by-channel guesses.',
            ),
          ),
        },
        {
          title: 'Team Training and Adoption Support',
          description: rt(
            paragraphs(
              'Hands-on training and follow-up check-ins to make sure the CRM and process are actually used, not just set up and abandoned.',
            ),
          ),
        },
      ],
      processSteps: [
        {
          stepNumber: 1,
          title: 'Pipeline and CRM Audit',
          description: rt(
            paragraphs(
              'We review your current CRM, pipeline stages, data quality and the real sales process reps actually follow day to day.',
            ),
          ),
        },
        {
          stepNumber: 2,
          title: 'Process and Stage Definition',
          description: rt(
            paragraphs(
              'We define a pipeline that matches your actual sales process, with clear criteria for moving a deal from one stage to the next.',
            ),
          ),
        },
        {
          stepNumber: 3,
          title: 'CRM Build and Automation',
          description: rt(
            paragraphs(
              'We configure the CRM, lead scoring and automated handoff rules, and connect it to your marketing channels and forms.',
            ),
          ),
        },
        {
          stepNumber: 4,
          title: 'Playbooks and SLA Documentation',
          description: rt(
            paragraphs(
              'We document the marketing-to-sales SLA and build playbooks for common sales scenarios and objections.',
            ),
          ),
        },
        {
          stepNumber: 5,
          title: 'Training and Rollout',
          description: rt(
            paragraphs(
              'We train your sales and marketing teams directly, with real deals and real data, not a generic software demo.',
            ),
          ),
        },
        {
          stepNumber: 6,
          title: 'Adoption Check-Ins and Reporting',
          description: rt(
            paragraphs(
              'We check in after rollout to fix friction points early, and set up the ongoing reporting leadership will actually use.',
            ),
          ),
        },
      ],
      entryOffer: {
        title: 'Start with a CRM & Pipeline Audit',
        description: rt(
          paragraphs(
            'The lowest-risk way to begin. You receive a documented assessment, whether or not you continue with us.',
          ),
        ),
        includes: rt(
          bullets([
            'A review of your current CRM setup, data quality and pipeline stages',
            'An assessment of how leads move (or stall) between marketing and sales today',
            'A gap analysis against a pipeline structure built for your actual sales cycle',
            'A prioritized recommendation on what to fix first',
          ]),
        ),
        duration: null,
        price: null,
        deliverables: null,
        ctaLabel: 'Request Your CRM & Pipeline Audit',
        ctaUrl: '/contact',
        nextStep: rt(
          paragraphs(
            'Exact scope and pricing depend on sales team size, current CRM platform and how much custom automation is needed. The audit gives you a firm number.',
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
                'Full CRM and enablement build. Audit, process design, CRM configuration, playbooks and training.',
              ),
            ),
          },
          {
            format: 'campaign',
            duration: 'one_time_project',
            description: rt(
              paragraphs(
                'CRM and pipeline audit. A focused assessment to scope what needs to change before a full build.',
              ),
            ),
          },
          {
            format: 'ongoing_monthly',
            duration: '3_months',
            description: rt(
              paragraphs(
                'Ongoing optimization retainer. Quarterly reviews, playbook updates and reporting refinement as your sales process evolves.',
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
            question: 'Which CRM platforms do you work with?',
            answer: rt(
              paragraphs(
                'We work with the major platforms used by industrial companies, including HubSpot and Salesforce, and recommend a fit based on your team size, budget and existing systems rather than defaulting to one tool.',
              ),
            ),
          },
          {
            question: 'Will this replace our current CRM, or improve what we have?',
            answer: rt(
              paragraphs(
                "Often it's improving configuration and process within your existing CRM. A full platform switch is sometimes the right call, but only when the audit shows the current system can't support what you need.",
              ),
            ),
          },
          {
            question: 'How do you get sales reps to actually adopt a new process?',
            answer: rt(
              paragraphs(
                'Training built around real deals, not generic software demos, plus leadership backing to make the process the expected way of working, not an optional add-on.',
              ),
            ),
          },
          {
            question: 'What is a marketing-to-sales SLA, and why do we need one?',
            answer: rt(
              paragraphs(
                "It's a documented agreement on what marketing delivers (lead volume, quality criteria) and what sales commits to (response time, follow-up steps). Without it, both sides default to blaming the other when pipeline is thin.",
              ),
            ),
          },
          {
            question: 'Can you integrate the CRM with our ERP or quoting system?',
            answer: rt(
              paragraphs(
                "In many cases, yes, depending on your systems. We scope integration feasibility during the audit rather than assuming it's possible for every platform.",
              ),
            ),
          },
          {
            question: 'How do you measure whether this is working?',
            answer: rt(
              paragraphs(
                "Lead response time, CRM data completeness, pipeline velocity by stage, and marketing's traceable influence on closed revenue, reviewed against baseline numbers from the audit.",
              ),
            ),
          },
          {
            question: 'What do you need from us to start?',
            answer: rt(
              paragraphs(
                'Admin access to your current CRM, a sales leader willing to participate in process design, and a 60-minute kickoff with both sales and marketing present.',
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
            `<h2>${escapeHtml('Ready for a Pipeline Your Whole Team Trusts?')}</h2>` +
              paragraphs(
                'Tell us about your current CRM and sales process. We’ll show you where leads are getting lost and what to fix first.',
              ),
          ),
          links: [
            {
              link: {
                type: 'custom' as const,
                newTab: false,
                url: '/contact',
                label: 'Get Your Free CRM & Pipeline Audit',
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

  if (leadGenerationUrl) {
    payload.logger.info(`Lead Generation related URL available: ${leadGenerationUrl}`)
  }

  payload.logger.info(`Updated existing Service ${updated.id}: ${getServiceUrl(updated)}`)
  process.exit(0)
}

void populate().catch((error) => {
  console.error(error)
  process.exit(1)
})
