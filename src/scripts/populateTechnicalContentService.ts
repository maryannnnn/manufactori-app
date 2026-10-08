import 'dotenv/config'
import { generateJSON } from '@tiptap/html'
import config from '@payload-config'
import { getPayload } from 'payload'

import { getCaseStudyUrl, getServiceUrl } from '../utilities/getContentUrls'
import { getTiptapExtensions } from '../utilities/richText/extensions'

/**
 * Fills the existing Technical Content & Thought Leadership Service in place.
 * Does not create a Service, change the collection schema, or publish
 * placeholder metrics, prices, logos, testimonials, or AI-citation counts.
 *
 * Re-runnable: structured arrays are replaced, not appended.
 */
const SLUG = 'technical-content-thought-leadership'
const CASE_STUDY_SLUG = 'pnevmomachta-long-term-digital-presence'
const LEAD_GENERATION_SLUG = 'lead-generation'

const RELATED_SERVICE_SLUGS = [
  'seo-ai-search-optimization',
  'website-design-development-for-manufacturers',
  'marketing-strategy-roadmap',
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

  const leadGeneration = await payload.find({
    collection: 'services',
    depth: 0,
    limit: 1,
    pagination: false,
    where: { slug: { equals: LEAD_GENERATION_SLUG } },
    select: { slug: true, title: true },
  })
  const leadGenerationDoc = leadGeneration.docs[0]
  const leadGenerationUrl = leadGenerationDoc ? getServiceUrl(leadGenerationDoc) : null
  if (leadGenerationDoc) {
    payload.logger.info(
      `Lead Generation Service for FAQ: ${leadGenerationDoc.title} → ${leadGenerationUrl}`,
    )
  } else {
    payload.logger.warn(`Lead Generation Service not found, FAQ will not link it: ${LEAD_GENERATION_SLUG}`)
  }

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

  const distributionAnswer = leadGenerationUrl
    ? paragraphs(
        'We handle on-site publishing, internal linking and basic SEO structure. Broader distribution through email, social or paid promotion is covered under our lead generation service.',
      ) + `<p><a href="${escapeHtml(leadGenerationUrl)}">${escapeHtml('See Lead Generation')}</a></p>`
    : paragraphs(
        'We handle on-site publishing, internal linking and basic SEO structure. Broader distribution through email, social or paid promotion is a separate lead generation engagement.',
      )

  const updated = await payload.update({
    collection: 'services',
    id: service.id,
    depth: 0,
    draft: false,
    data: {
      title: 'Technical Content & Thought Leadership',
      service_long_title: 'Technical Content & Thought Leadership for Manufacturers',
      slug: SLUG,
      generateSlug: false,
      _status: 'published',
      service_preview_title: 'Technical Content & Thought Leadership',
      service_preview_description:
        'Technical content for manufacturers that engineers trust and AI systems can cite: application notes, guides and expert articles built from your own know-how.',
      service_content_title: null,
      meta: {
        title: `Technical Content & Thought Leadership | ${AGENCY_NAME}`,
        description:
          'Technical content for manufacturers that engineers trust and AI systems cite: application notes, guides and expert articles built from your own know-how.',
      },
      introduction: {
        text: rt(
          paragraphs(
            "Content written from your engineers' real expertise, accurate enough for a technical buyer, clear enough for an AI system to quote.",
            'We create application notes, comparison guides, spec explainers and expert articles for manufacturers and industrial companies that have deep technical knowledge inside the company but no reliable way to turn it into content. The goal is content that earns trust with engineers, ranks in search, and can be cited in AI answers where that visibility is actually observable.',
          ) +
            `<p><a href="/contact">${escapeHtml('Get a Free Content Gap Analysis')}</a></p>` +
            `<p><a href="#process">${escapeHtml('See how we work')}</a></p>`,
        ),
        supportingText: rt(
          `<h2>${escapeHtml('Why Technical Content Works Differently for Manufacturers')}</h2>` +
            paragraphs(
              'An engineer evaluating a vendor does not want a marketing pitch. They want a real answer: how a material performs under load, how two processes compare, what tolerance is achievable, what a spec actually means in practice. Content that gives a direct, specific, technically sound answer earns trust that a generic article cannot.',
              'The same qualities that earn an engineer’s trust are what AI systems look for when deciding what to cite: clear definitions, specific numbers, and content written by someone who demonstrably knows the subject. Technical accuracy is not a constraint on good content here. It is the strategy.',
              'Citation by ChatGPT, Perplexity or Google AI Overviews is an objective of this work, not a promise that every piece will be named. Where mentions can be observed, they can be tracked. Where they cannot, we do not invent a number.',
            ),
        ),
      },
      clientSituations: [
        {
          title: 'Our engineers know everything, but none of it is written down anywhere public.',
          description: rt(
            paragraphs(
              'The expertise that wins deals in a sales call never makes it to your website, so buyers researching online never see it and never find you.',
            ),
          ),
        },
        {
          title: 'We tried blogging, but it never led anywhere.',
          description: rt(
            paragraphs(
              'Generic posts with no technical depth do not earn trust from engineers and do not get cited by AI systems looking for authoritative sources.',
            ),
          ),
        },
        {
          title: 'Competitors show up as the expert in AI answers, and we don’t.',
          description: rt(
            paragraphs(
              'AI systems cite content that is specific, well-structured and clearly authoritative. If your expertise is not published that way, a competitor’s is.',
            ),
          ),
        },
        {
          title: 'A good fit if you',
          description: rt(
            bullets([
              'Have real technical expertise in-house that is not currently published anywhere',
              'Are willing to make engineers or technical staff available for short interviews',
              'Want content that supports both search rankings and AI citation, not just blog traffic',
            ]),
          ),
        },
        {
          title: 'Probably not a fit if you',
          description: rt(
            bullets([
              'Want generic, high-volume blog content with no technical review',
              'Cannot make any subject matter experts available, even briefly',
              'Need content published within days rather than weeks',
            ]),
          ),
        },
      ],
      serviceScope: [
        {
          title: 'Subject Matter Expert Interviews',
          description: rt(
            paragraphs(
              'Short, structured interviews with your engineers and technical staff that extract real expertise without taking hours out of their week.',
            ),
          ),
        },
        {
          title: 'Application Notes and How-To Guides',
          description: rt(
            paragraphs(
              'Practical content that answers the specific questions engineers ask when evaluating how to use your products or solve a process problem.',
            ),
          ),
        },
        {
          title: 'Comparison and Spec Explainer Content',
          description: rt(
            paragraphs(
              'Clear, honest comparisons (material versus material, process versus process, standard versus standard) that build credibility because they do not oversell.',
            ),
          ),
        },
        {
          title: 'Case Studies and Technical Proof',
          description: rt(
            paragraphs(
              'Documented projects with the technical detail engineers actually want: what was specified, what was built, what the results were.',
            ),
          ),
        },
        {
          title: 'AI-Citation-Ready Structure',
          description: rt(
            paragraphs(
              'Content formatted with clear answers, definitions and structured data so ChatGPT, Perplexity and Google AI Overviews can read it accurately and, where they choose to, cite it. Citation is the intended outcome of that structure, not a guarantee that every article will be named.',
            ),
          ),
        },
        {
          title: 'Editorial Calendar Tied to Buyer Questions',
          description: rt(
            paragraphs(
              'A content plan built from the real questions your sales team hears, not generic industry trends, so every piece supports an actual stage of the buying process.',
            ),
          ),
        },
      ],
      processSteps: [
        {
          stepNumber: 1,
          title: 'Content and Competitive Gap Analysis',
          description: rt(
            paragraphs(
              'We review what you have published, what competitors publish, and what your buyers actually search for, to find the highest-value gaps.',
            ),
          ),
        },
        {
          stepNumber: 2,
          title: 'Topic and Editorial Planning',
          description: rt(
            paragraphs(
              'We build a prioritized content calendar tied to buyer questions and sales team feedback, not generic topic lists.',
            ),
          ),
        },
        {
          stepNumber: 3,
          title: 'Subject Matter Expert Interviews',
          description: rt(
            paragraphs(
              'We interview your engineers and technical staff using a short, structured process designed to respect their time.',
            ),
          ),
        },
        {
          stepNumber: 4,
          title: 'Writing and Technical Review',
          description: rt(
            paragraphs(
              'We draft each piece, then route it back through your experts for technical accuracy before anything publishes.',
            ),
          ),
        },
        {
          stepNumber: 5,
          title: 'Publish and Optimize',
          description: rt(
            paragraphs(
              'We publish with proper structure, schema and internal linking, so each piece supports both search visibility and the chance of accurate AI citation.',
            ),
          ),
        },
        {
          stepNumber: 6,
          title: 'Measure and Refine',
          description: rt(
            paragraphs(
              'We track rankings and, where they can actually be observed, AI mentions and influence on RFQs, then adjust the calendar based on what performs. Those signals are not available in every engagement, and we do not treat them as a guaranteed dashboard.',
            ),
          ),
        },
      ],
      entryOffer: {
        title: 'Start with a Content Gap Analysis',
        description: rt(
          paragraphs(
            'The lowest-risk way to begin. You receive a documented plan, whether or not you continue with us.',
          ),
        ),
        includes: rt(
          bullets([
            'An audit of your existing content against what buyers actually search for',
            'A competitive view of what your top competitors publish, and where they fall short',
            'A check of whether AI systems currently cite you, your competitors, or neither',
            'A prioritized list of the highest-impact content to create first',
          ]),
        ),
        duration: null,
        price: null,
        deliverables: null,
        ctaLabel: 'Request Your Content Gap Analysis',
        ctaUrl: '/contact',
        nextStep: rt(
          paragraphs(
            'Exact scope and pricing depend on the number of product lines, how many experts are involved, and publishing cadence. The gap analysis gives you a firm number.',
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
                'Monthly content program. Ongoing content production with expert interviews, writing and publishing on a set cadence.',
              ),
            ),
          },
          {
            format: 'campaign',
            duration: 'one_time_project',
            description: rt(
              paragraphs(
                'Content gap analysis. A focused audit to identify your highest-priority content opportunities.',
              ),
            ),
          },
          {
            format: 'initial_project',
            duration: 'one_time_project',
            description: rt(
              paragraphs(
                'Project-based content packages. A fixed set of pieces, for example a pillar guide plus supporting articles, delivered on a defined timeline.',
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
            question: 'How much time will this take from our engineers?',
            answer: rt(
              paragraphs(
                'We use short, structured interviews so your experts spend minutes, not hours. We come prepared with specific questions, then handle the writing and structuring afterward.',
              ),
            ),
          },
          {
            question: 'How is this different from general content marketing?',
            answer: rt(
              paragraphs(
                'General content marketing optimizes for volume and broad topics. Technical content for manufacturers optimizes for accuracy and specificity, because that is what earns trust from engineers and can contribute to citations from AI systems.',
              ),
            ),
          },
          {
            question: 'How do you make sure the content is technically accurate?',
            answer: rt(
              paragraphs(
                'Every piece goes through a technical review with your subject matter experts before publishing. We write to be understood, not to simplify away the accuracy that matters.',
              ),
            ),
          },
          {
            question: 'What is AI citation, and why does it matter?',
            answer: rt(
              paragraphs(
                'It is whether tools like ChatGPT, Perplexity and Google AI Overviews reference your content when answering a buyer’s question. Content built with clear structure and real expertise has a stronger basis for being understood and potentially cited than generic marketing copy. That is the aim of the structure. It is not a ranking we can promise.',
              ),
            ),
          },
          {
            question: 'How often will you publish?',
            answer: rt(
              paragraphs(
                'Cadence depends on your plan and how much expert time is available. We prioritize depth and accuracy over volume rather than a fixed publishing count.',
              ),
            ),
          },
          {
            question: 'Do you handle distribution, not just writing?',
            answer: rt(distributionAnswer),
          },
          {
            question: 'What do you need from us to start?',
            answer: rt(
              paragraphs(
                'Access to your website and CMS, a list of priority product lines or topics, and time with subject matter experts for initial interviews.',
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
            `<h2>${escapeHtml('Ready to Put Your Expertise to Work?')}</h2>` +
              paragraphs(
                'Tell us about your products and your team’s expertise. We’ll show you what’s missing and what to publish first.',
              ),
          ),
          links: [
            {
              link: {
                type: 'custom' as const,
                newTab: false,
                url: '/contact',
                label: 'Get a Free Content Gap Analysis',
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
