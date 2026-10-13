import 'dotenv/config'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { generateJSON } from '@tiptap/html'
import config from '@payload-config'
import { getPayload } from 'payload'

import { buildCommentTree, measureCommentTree } from '../blocks/CaseStudyCommentsBlock/buildCommentTree'
import { getCaseStudyUrl } from '../utilities/getContentUrls'
import { getTiptapExtensions } from '../utilities/richText/extensions'

/**
 * Creates or updates the AluMatrix Case Study.
 * Structural reference: Laser Made / Aleks SF / NPK BINAR.
 * Re-runnable: structured fields and layout blocks are replaced, not appended.
 *
 * Source spelling is Alumatrix. Public name here is AluMatrix.
 * Duration = 2 years is the source results window, not a verified
 * uninterrupted campaign length. Metrics and PPC structure are
 * source-reported. Stone and glass facades are not claimed.
 * Related facade projects named on the source page are not AluMatrix brands.
 * Gallery images are illustrative. No site_categories. No client logo.
 */
const SLUG = 'alumatrix-facade-systems'
const IMAGE_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'assets')

const EXPERT = 'Maryan Polyak'
const EXPERT_ROLE = 'Manufacturing Digital Marketing & Web Development Expert'

const PRIMARY_CASE_STUDY_CATEGORY = 196 // manufacturing-seo
const CASE_STUDY_CATEGORIES = [
  196, // Manufacturing SEO
  204, // Industrial SEO
  197, // Application SEO
  218, // Product SEO
  200, // Competitor SEO Analysis
  210, // Manufacturing Keyword Research
  239, // Manufacturing Website Development
  226, // Manufacturing Website Design & Development
  237, // Industrial Website Development
  235, // Industrial Website Architecture
  311, // Technical Content Marketing
  274, // Paid Search / Paid Media
  278, // Google Ads for Manufacturers
  290, // Manufacturing Search Advertising
  291, // Product Search Advertising
  293, // Specification Search Advertising
  418, // Aluminum Composite Panel Manufacturing
  419, // Aluminum Composite Panels
  434, // Ventilated Facade Manufacturing
  429, // Facade Systems
  428, // Facade Installation
  711, // Aluminum Fabrication
  1086, // Composite Materials
  421, // Building Materials
  417, // Building Products & Materials
  425, // Construction Materials Manufacturing
  426, // Construction Products
  420, // Architectural Products
  712, // Architectural Metal Fabrication
  484, // Design, Manufacturing & Installation
  751, // Industrial Installation
  669, // Manufacturing
  670, // B2B Manufacturing
]

const rt = (html: string) => generateJSON(html, getTiptapExtensions({ headingLevels: [2, 3, 4] }))
const rtHero = (html: string) =>
  generateJSON(html, getTiptapExtensions({ headingLevels: [1, 2, 3, 4] }))

const escapeHtml = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const p = (...texts: string[]) => texts.map((text) => `<p>${escapeHtml(text)}</p>`).join('')
const ul = (items: string[]) =>
  `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`

const contentBlock = (html: string) => ({
  blockType: 'csContent' as const,
  columns: [{ size: 'full' as const, richText: rt(html), enableLink: false }],
})

const titleBlock = (title: string) => ({
  blockType: 'csContentTitle' as const,
  case_study_content_title: title,
})

type DiscussionEntry = {
  author: string
  role?: string
  depth?: number
  isExpert?: boolean
  date: string
  body: string
}

const expert = (date: string, body: string, depth: number): DiscussionEntry => ({
  author: EXPERT,
  role: EXPERT_ROLE,
  depth,
  isExpert: true,
  date,
  body,
})

type ImageSpec = {
  filename: string
  alt: string
  caption: string
}

const PREVIEW_IMAGE: ImageSpec = {
  filename: 'alumatrix-ventilated-facade.jpg',
  alt: 'Modern commercial building clad in silver-grey aluminum composite panels with visible ventilated-facade joints.',
  caption:
    'Illustrative ventilated facade with aluminum composite panels. Not a documented AluMatrix project photograph.',
}

const STRUCTURE_IMAGE: ImageSpec = {
  filename: 'alumatrix-website-structure.jpg',
  alt: 'AluMatrix website information architecture diagram with Company, Ventilated Facades, Alumatrix, Production, Services and Press Center hubs feeding section interfaces and the main page.',
  caption:
    'Documented AluMatrix website structure from the project: six content hubs assembled through section interfaces into the main page.',
}

const GALLERY_IMAGES: ImageSpec[] = [
  {
    filename: 'alumatrix-acp-panels.jpg',
    alt: 'Close-up of champagne and graphite aluminum composite cassette panels on a ventilated facade.',
    caption:
      'Illustrative aluminum composite panels and cassette joints. Not a documented AluMatrix product photograph.',
  },
  {
    filename: 'alumatrix-mounting-system.jpg',
    alt: 'Aluminum facade rails, brackets and fasteners on a concrete wall with some panels already hung.',
    caption:
      'Illustrative facade mounting subsystem — rails, brackets and fasteners. Not a documented AluMatrix installation.',
  },
  {
    filename: 'alumatrix-panel-production.jpg',
    alt: 'Coil-coating line processing an aluminum composite sheet, with stacks of finished facade panels.',
    caption:
      'Illustrative panel coating and processing. Not a photograph of an AluMatrix factory.',
  },
]

const upsertMedia = async (
  payload: Awaited<ReturnType<typeof getPayload>>,
  image: ImageSpec,
) => {
  const filePath = path.join(IMAGE_DIR, image.filename)
  const data = readFileSync(filePath)
  const existing = await payload.find({
    collection: 'media',
    where: { filename: { equals: image.filename } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })

  const fields = {
    alt: image.alt,
    caption: rt(`<p>${escapeHtml(image.caption)}</p>`),
  }

  if (existing.docs[0]) {
    const media = await payload.update({
      collection: 'media',
      id: existing.docs[0].id,
      data: fields,
      overrideAccess: true,
      context: { disableRevalidate: true },
    })
    payload.logger.info(`reused media ${media.id} ${image.filename}`)
    return media.id
  }

  const media = await payload.create({
    collection: 'media',
    data: fields,
    file: {
      name: image.filename,
      data,
      mimetype: 'image/jpeg',
      size: data.byteLength,
    },
    overrideAccess: true,
    context: { disableRevalidate: true },
  })
  payload.logger.info(`created media ${media.id} ${image.filename}`)
  return media.id
}

/**
 * 7 top-level branches, mixed shapes, ~25 entries, depth capped at 3.
 * Editorial discussion — not customer comments or AluMatrix testimonials.
 */
const DISCUSSION: DiscussionEntry[] = [
  {
    author: 'Henrik Dahl',
    role: 'Technical SEO specialist',
    date: '2026-10-18',
    depth: 0,
    body: p(
      'Why does a facade manufacturer need a semantic core of more than 2,000 keywords instead of a handful of product pages?',
    ),
  },
  expert(
    '2026-10-18',
    p(
      'Because buyers do not search only for “aluminum composite panels.” They search for a ventilated facade, a mounting subsystem, coating, installation, a colour, a fire-resistant panel, or a construction application.',
      'The source work built a semantic core of over 2,000 terms across that journey and mapped it onto ventilated facades, panels, manufacturing and a technical blog. A handful of pages cannot hold that without competing with themselves.',
    ),
    1,
  ),
  {
    author: 'Elena Petrova',
    role: 'In-house manufacturing marketer',
    date: '2026-10-19',
    depth: 2,
    body: p(
      'So the 2,000 terms are not a publishing target. They are a map?',
    ),
  },
  expert(
    '2026-10-19',
    p(
      'Yes. The number is the size of the research set in the source. It is not a claim that 2,000 articles were written. Mapping decides which terms belong on a facade page, a panel page, a manufacturing page or a long-tail article.',
    ),
    3,
  ),
  {
    author: 'Thomas Weber',
    role: 'Facade project engineer',
    date: '2026-10-20',
    depth: 0,
    body: p(
      'Why should a manufacturer explain mounting systems and applications instead of only listing panel colours?',
    ),
  },
  expert(
    '2026-10-20',
    p(
      'A panel is not a facade. The source describes design, manufacturing and sale of aluminum composite panels and mounting subsystems, plus installation with fastening systems. An architect or contractor is buying a rainscreen, not a colour chip.',
      'If the site only lists colours, the mounting query, the ventilated-facade query and the installation query have nowhere to land.',
    ),
    1,
  ),
  {
    author: 'Anna Kovacs',
    role: 'Specification writer',
    date: '2026-10-21',
    depth: 2,
    body: p(
      'Should stone or glass curtain-wall systems sit in the same architecture?',
    ),
  },
  expert(
    '2026-10-21',
    p(
      'Not in this record. The source does not document stone or glass facade systems as AluMatrix offerings. I will not add them. Interior finishes and signage appear in the source FAQ as ACP applications, not as a second contracting business.',
    ),
    3,
  ),
  {
    author: 'Sophie Laurent',
    role: 'PPC specialist',
    date: '2026-10-22',
    depth: 0,
    body: p(
      'The source describes three PPC campaigns with ten ad groups each. How should that sit next to the organic map?',
    ),
  },
  expert(
    '2026-10-22',
    p(
      'Organic search is the durable structure: facades, panels, manufacturing, installation, long-tail articles. Paid search can put the same jobs in front of a buyer who is searching now.',
      'The published source gives campaign shape — three campaigns, ten ad groups, two to ten ads per group, A/B tests and bid adjustments — and reports PPC figures over the two-year window. It does not name the ad platform. I will not invent Google versus Yandex.',
    ),
    1,
  ),
  {
    author: 'Sophie Laurent',
    role: 'PPC specialist',
    date: '2026-10-23',
    depth: 2,
    body: p(
      'Would you send paid traffic to the homepage or to product and facade pages?',
    ),
  },
  expert(
    '2026-10-23',
    p(
      'To the page that matches the query. A panel query belongs on a panel destination. A ventilated-facade query belongs on the facade section. Historic landing URLs are not reconstructed.',
    ),
    3,
  ),
  {
    author: 'James Whitaker',
    role: 'Technical content lead',
    date: '2026-10-24',
    depth: 0,
    body: p(
      'The source mentions scientifically complex language, schema markup and a blog for installation guidelines. What actually belongs on those pages?',
    ),
  },
  expert(
    '2026-10-24',
    p(
      'Technical copy that matches how construction buyers read: panel construction, coating, thermal bonding, painting, quality control, ventilated-facade types and applications, installation and fastening.',
      'Schema is named as a way to make results more informative. Article titles and a reconstructed blog calendar are not in the source. I will not invent them.',
    ),
    1,
  ),
  {
    author: 'Clara Jensen',
    role: 'Industrial marketing consultant',
    date: '2026-10-25',
    depth: 2,
    body: p(
      'The same source page also names VentFasad, GPTM GROUP, PromTehMontg, Facade Installation and Grosstek. Are those AluMatrix brands?',
    ),
  },
  expert(
    '2026-10-25',
    p(
      'No. They are related ventilated-facade and ACP engagements documented on the same source page. The useful point is that a facade semantic foundation can be adapted. It is not a claim that those companies belong to AluMatrix, and this Case Study is not their record.',
    ),
    3,
  ),
  {
    author: 'Pavel Orlov',
    role: 'Construction-sector marketing manager',
    date: '2026-10-26',
    depth: 0,
    body: p(
      'The results are labelled “after two years of collaboration.” Is that the length of one SEO campaign?',
    ),
  },
  expert(
    '2026-10-26',
    p(
      'The source reports SEO, PPC and social figures for a two-year collaboration window. That is the duration I will publish. It is not independently re-audited here, and it is not a claim that every channel ran without interruption for twenty-four months.',
    ),
    1,
  ),
  {
    author: 'Lukas Schneider',
    role: 'Technical SEO specialist',
    date: '2026-10-27',
    depth: 0,
    body: p(
      'Schema markup and industry link building are named. There is no domain-authority number. What can actually be stated?',
    ),
  },
  expert(
    '2026-10-27',
    p(
      'That those activities were part of the SEO programme: schema to make results more informative, and links from industry sites and forums. The source does not publish a domain-authority score or a link list. I will not invent either.',
    ),
    1,
  ),
  {
    author: 'Lukas Schneider',
    role: 'Technical SEO specialist',
    date: '2026-10-27',
    depth: 2,
    body: p(
      'Would you reconstruct the schema types — Product, FAQ, LocalBusiness?',
    ),
  },
  expert(
    '2026-10-28',
    p(
      'No. Schema is confirmed as used. The types are not listed. Guessing FAQPage or Product markup would be invention.',
    ),
    3,
  ),
  {
    author: 'Daniel Okonkwo',
    role: 'Export and B2B sales manager',
    date: '2026-10-29',
    depth: 0,
    body: p(
      'Has any of this been measured in AI search — ChatGPT, Perplexity or AI Overviews?',
    ),
  },
  expert(
    '2026-10-29',
    p(
      'Not in this record. No ChatGPT ranking, Perplexity citation or AI Overview result is documented. I will not invent one.',
      'A topical model that connects ACP, ventilated facades, mounting, coating and installation is useful groundwork for modern search in principle. It is not a measured GEO or AEO programme.',
    ),
    1,
  ),
  {
    author: 'Martin Novak',
    role: 'In-house manufacturing marketer',
    date: '2026-10-30',
    depth: 2,
    body: p(
      'The source closing calls AluMatrix a market leader. Should this case repeat that?',
    ),
  },
  expert(
    '2026-10-30',
    p(
      'No. The verified story is a manufacturer of aluminum composite panels and mounting subsystems, with a two-year SEO, content and PPC programme beside that work. Leadership language and an unverified revenue claim are not needed. This discussion is editorial. It is not a testimonial from AluMatrix.',
    ),
    3,
  ),
]

const faqBlock = () => ({
  blockType: 'csFAQ' as const,
  case_study_faq_title: 'Frequently Asked Questions About AluMatrix',
  items: [
    {
      question: 'What are aluminum composite panels used for in facade construction?',
      answer: rt(
        p(
          'The source describes aluminum composite panels as multilayer sheets — two aluminum faces with a polyethylene or mineral core — used in facade systems, and also in interior finishes and signage.',
          'AluMatrix designs, manufactures and sells those panels in a range of colours and configurations for commercial and industrial ventilated facades. Exact thicknesses, fire classes and warranties are not republished here as a catalogue.',
        ),
      ),
    },
    {
      question: 'How do ventilated facade systems differ from other facade solutions?',
      answer: rt(
        p(
          'A ventilated facade is a rainscreen: panels sit on a mounting subsystem with an air gap, rather than being bonded as a solid skin. That is why the source treats ventilated facades as their own section — benefits, types, applications and structural details — instead of folding them into a generic cladding page.',
          'Stone and glass curtain-wall systems are not documented as AluMatrix offerings in this record.',
        ),
      ),
    },
    {
      question: 'Why are mounting and fastening systems important in facade installation?',
      answer: rt(
        p(
          'The panel only performs if it is fixed correctly. AluMatrix supplies mounting subsystems as well as panels, and the source FAQ describes installation with fastening systems, geometry control and attention to environmental and architectural conditions.',
          'Bracket models, span tables and load calculations are not in the source.',
        ),
      ),
    },
    {
      question: 'How can SEO help a manufacturer of specialized facade systems reach B2B buyers?',
      answer: rt(
        p(
          'Architects, contractors and developers search by material, facade type, mounting system, coating or installation. The documented work built a semantic core of over 2,000 keywords, mapped it onto ventilated facades, panels and manufacturing, and supported it with technical content, schema markup and link building.',
          'The two-year organic figures on the source page are reported below. Individual keyword rankings are not republished as a table.',
        ),
      ),
    },
    {
      question:
        'How can contextual advertising complement SEO for a construction-materials manufacturer?',
      answer: rt(
        p(
          'Organic search builds the map of products and services. Contextual advertising, or paid search, can promote panels, ventilated facades and installation while that map is still accumulating.',
          'The source describes three PPC campaigns with ten ad groups each and reports paid-search movement over two years. The ad platform and budgets are not named.',
        ),
      ),
    },
  ],
})

const discussionBlock = () => ({
  blockType: 'csComments' as const,
  case_study_comment_title: 'Comments',
  comments: DISCUSSION.map((entry) => ({
    author: entry.author,
    role: entry.role,
    depth: entry.depth ?? 0,
    isExpert: entry.isExpert ?? false,
    date: new Date(`${entry.date}T09:00:00.000Z`).toISOString(),
    body: rt(entry.body),
  })),
})

const ctaBlock = () => ({
  blockType: 'cta' as const,
  richText: rtHero(
    `<h2>${escapeHtml('Discuss a similar facade-systems SEO and paid-search project')}</h2>` +
      p(
        'If you manufacture aluminum composite panels, mounting subsystems or ventilated facades and need search visibility to match that technical offering, tell us about the production.',
      ),
  ),
  links: [
    {
      link: {
        type: 'custom' as const,
        newTab: false,
        url: '/contact',
        label: 'Contact',
        appearance: 'default' as const,
      },
    },
  ],
})

const galleryBlock = (imageIds: number[]) => ({
  blockType: 'csGallery' as const,
  case_study_gallery_title: 'Facade Systems and Mounting Solutions',
  case_study_gallery_images: imageIds,
})

const sourceMetric = (value: string, label: string, detail: string) => ({
  value,
  label,
  description: rt(
    p(
      `${detail} Reported on the published source case study for the two-year collaboration window. Not independently re-audited in this project.`,
    ),
  ),
})

const buildData = (previewImageId: number, galleryIds: number[], structureImageId: number) => ({
  title: 'AluMatrix: SEO and Paid Search for Facade Systems Manufacturing',
  case_study_long_title:
    'AluMatrix — Aluminum Composite Panels, Ventilated Facades and Mounting Systems, with a Two-Year SEO Foundation and Contextual Advertising',
  slug: SLUG,
  generateSlug: false,
  _status: 'published' as const,
  featured: true,
  displayOrder: 11,
  duration: '2_years',

  layout: [
    {
      blockType: 'csPreview' as const,
      case_study_preview_title: 'Aluminum Composite Panels and Ventilated Facade Systems',
      case_study_preview_text: rt(
        p(
          'AluMatrix designs, manufactures and sells aluminum composite panels and mounting subsystems for commercial and industrial ventilated facades. Neolines supported that manufacturing business with a semantic core of more than 2,000 keywords, technical content and schema, a blog for long-tail facade queries, and contextual advertising structured as three PPC campaigns. The published source reports SEO, paid-search and social figures after two years of collaboration.',
        ),
      ),
      case_study_preview_image: previewImageId,
    },

    titleBlock('Project Overview'),
    contentBlock(
      p(
        'AluMatrix — published on the source page as Alumatrix — operates in facade systems and building materials. The confirmed offering is the design, manufacturing and sale of aluminum composite panels and mounting subsystems, with customised ventilated facades in a range of colours and configurations, plus installation using fastening systems.',
        'Production and processing cover coating, thermal bonding, painting and quality control. That is a manufacturing and construction-materials business, not a generic cladding reseller. Stone facades and glass curtain-wall systems are not documented in the source and are not added here.',
      ),
    ),

    titleBlock('Business Context'),
    contentBlock(
      p(
        'A technically broad facade offering is easy to flatten online. Professional buyers may search by material (aluminum composite panels), by system (ventilated facades), by component (mounting and fastening), by process (coating, painting) or by service (installation).',
        'Those intents are related. They are not the same page. The marketing job was to present the manufacturing, engineering and installation capability so construction companies, architects and specifiers could find the right destination. No historic domain, previous CMS or customer complaint is recorded, so none is invented.',
      ),
    ),

    titleBlock('SEO Strategy and Semantic Foundation'),
    contentBlock(
      p(
        'The documented SEO work started with competitor analysis in industrial and construction search, then a semantic core of over 2,000 keywords covering aluminum composite panels, ventilated facades and installation systems across stages of the buyer journey.',
        'That core was mapped onto site sections for ventilated facades (benefits, types, applications, structural details), AluMatrix panels (descriptions, colours, processing options) and manufacturing (technologies, coating, thermal bonding, painting, quality control). Unique technical copy, optimised titles, meta descriptions and image alt text supported those pages. A blog captured long-tail queries around technical insights, installation guidelines and facade-industry trends. Schema markup and a link-building campaign aimed at industry sites and forums are also named.',
        'The same source page documents related ventilated-facade SEO work for VentFasad, GPTM GROUP, PromTehMontg, Facade Installation and Grosstek. Those are separate engagements. They are not AluMatrix brands. They illustrate that a facade semantic foundation can be adapted; they are not additional AluMatrix factories.',
      ),
    ),

    titleBlock('Website Structure'),
    contentBlock(
      p(
        'The documented information architecture organised the AluMatrix website around six hubs that assembled a shared main page: Company, Ventilated Facades, AluMatrix product pages, Production, Services, and a Press Center.',
        'Company pages covered about, history, news, reviews, partners, certificates and contacts. Ventilated facades covered purpose, types, design, advantages, systems, technical specifications, engineering and installation. The AluMatrix product branch covered composite panels, applications, colour, characteristics, production, processing, certificates and prices. Production listed factory stages including technology, chemical synthesis, coating, thermal bonding, painting, processing and quality control, plus a scientific department as labelled on the diagram. Services covered design, processing, installation, manufacturing, installation supervision and logistics.',
        'Each product and production hub had a section interface of related pages. Editorial and promotional content — news, articles, questions, reviews, blog, experts, photos, videos, promotions and special offers — sat under the relevant hubs and the Press Center. Exact historic URLs and the CMS are not reconstructed. The diagram below is the project website structure.',
      ),
    ),
    {
      blockType: 'mediaBlock' as const,
      media: structureImageId,
    },

    titleBlock('Contextual Advertising'),
    contentBlock(
      p(
        'Contextual advertising sat beside the organic programme. The source describes three main PPC campaigns, each with ten ad groups and two to ten ads per group, covering different product lines. A/B tests on ad formats and keyword bid adjustments are named as the optimisation method.',
        'Paid search can give targeted visibility while SEO builds the broader structure. The ad platform, budgets and account IDs are not disclosed. The PPC percentages below are source-reported for the two-year window and are not mixed into the organic totals.',
      ),
    ),

    titleBlock('Long-Term Collaboration'),
    contentBlock(
      p(
        'The published source reports results after two years of collaboration. That figure is the measurement window for SEO, PPC and social figures. It is not treated here as proof that every channel ran without interruption for twenty-four months, and no start or end date is assigned.',
      ),
    ),

    titleBlock('Reported Results'),
    contentBlock(
      p(
        'The source case study publishes the following figures for the two-year collaboration. They are reproduced as source-reported results, not as a new audit.',
      ) +
        ul([
          'Organic traffic: +40%',
          'Organic sessions: +15%',
          'Overall sessions: +18%',
          'More than 1,200 additional keywords in Google rankings',
          'Top-5 keyword performance: +35%',
          'Impressions: +9%',
          'Organic clicks: +8%',
          'New users: +45%',
          'Returning users: +25%',
          'PPC clicks: +30%',
          'PPC conversions: +110%',
          'Average CPC: −5%',
          'Cost per conversion: −30%',
          'PPC CTR: +100%',
          'PPC conversion rate: +75%',
          'Social engagement: +40%',
          'Traffic from social channels: +20%',
        ]) +
        p(
          'Revenue, lead counts and an “industry-leading” position are not restated. Social platforms are not named. This record does not call AluMatrix a market leader.',
        ),
    ),

    titleBlock('Key Takeaways'),
    contentBlock(
      p(
        'Marketing a facade manufacturer is not the same as promoting a consumer product. Buyers search by material, system, mounting, process and installation. Those jobs need destinations.',
        'A large semantic core is useful only if it is mapped. Paid search can complement that map without replacing it. Where the source is silent — platform, CMS, named buildings, stone or glass systems — the correct public line is Not disclosed.',
      ),
    ),

    contentBlock(
      p(
        'Illustrative photographs of aluminum composite facades, mounting subsystems and panel processing relevant to AluMatrix’s documented offering. They are not original photographs of AluMatrix projects, products or factories.',
      ),
    ),
    galleryBlock(galleryIds),
    faqBlock(),
    discussionBlock(),
    ctaBlock(),
  ],

  manufacturingProfile: {
    productionCapabilities: rt(
      p(
        'AluMatrix designs, manufactures and sells aluminum composite panels and mounting subsystems, and installs ventilated facades using fastening systems. Production and processing include coating, thermal bonding, painting and quality control.',
        'Factory size, line capacities and certifications are not disclosed.',
      ),
    ),
    products: rt(
      p(
        'Aluminum composite panels in a range of colours and configurations; mounting subsystems; customised ventilated facade systems. The source FAQ also names interior finishes and signage as ACP applications, and fire-resistant or frost-resistant coatings where a project requires them.',
        'No panel models or part numbers are stated. Stone and glass facade systems are not listed.',
      ),
    ),
    materials: rt(
      p(
        'Aluminum composite panels with two aluminum faces and a polyethylene or mineral-based core, as described in the source FAQ. Exact alloys, core grades and coating systems are not disclosed and are not guessed from illustrative photographs.',
      ),
    ),
    applications: rt(
      p(
        'Commercial and industrial ventilated facades and related architectural projects. Interior finishes and signage are named as further ACP uses. Named buildings and project sizes are not listed.',
      ),
    ),
  },

  businessChallenge: {
    initialState: rt(
      p(
        'AluMatrix already designed, manufactured and sold facade panels and mounting subsystems. The digital presentation had to match that technical breadth for construction and industrial buyers.',
      ),
    ),
    challenge: rt(
      p(
        'Related search intents — ACP, ventilated facades, mounting, coating, installation — needed destinations without collapsing into one cladding homepage or competing duplicate pages.',
      ),
    ),
    goals: rt(
      ul([
        'Build a semantic core of more than 2,000 keywords for facade and ACP search',
        'Map terms onto ventilated facades, panels, manufacturing and installation content',
        'Write technical copy, metadata and a long-tail blog',
        'Apply schema markup and industry link building',
        'Run structured PPC alongside organic search',
        'Report only source-backed results',
      ]),
    ),
  },

  nicheSegmentation: [
    {
      name: 'Aluminum Composite Panels',
      description: rt(
        p(
          'Manufactured ACP in multiple colours and configurations, including processing options. Fire-resistant or frost-resistant coatings are named where a project requires them.',
        ),
      ),
      marketingApproach: rt(
        p(
          'Give panels a destination. A buyer searching for ACP supply is not the same visitor as one searching only for ventilated-facade theory.',
        ),
      ),
    },
    {
      name: 'Ventilated Facade Systems',
      description: rt(
        p(
          'Customised ventilated facades: benefits, types, applications and structural details as listed in the source architecture.',
        ),
      ),
      marketingApproach: rt(
        p(
          'Treat the rainscreen as a system page, not as a colour list. Do not add stone or glass systems the source does not document.',
        ),
      ),
    },
    {
      name: 'Mounting Subsystems and Installation',
      description: rt(
        p(
          'Mounting and fastening systems, plus installation of aluminum composite panels. Bracket catalogues are not published.',
        ),
      ),
      marketingApproach: rt(
        p(
          'Speak to contractors who need the subsystem and the install, not only the sheet.',
        ),
      ),
    },
    {
      name: 'Manufacturing and Processing',
      description: rt(
        p(
          'Coating, thermal bonding, painting and quality control named as production stages.',
        ),
      ),
      marketingApproach: rt(
        p(
          'Show the factory as part of the offering. Do not invent line speeds or ISO numbers.',
        ),
      ),
    },
  ],

  digitalEcosystem: rt(
    p(
      'The confirmed digital ecosystem is the corporate website (sections for ventilated facades, panels and manufacturing), technical content and a blog, schema markup, link building, contextual advertising / PPC, and social activity reported as engagement and referral traffic.',
      'The CMS, historic domain, named ad platform and named social networks are not disclosed.',
    ),
  ),
  websiteArchitecture: rt(
    p(
      'The documented website structure organised six hubs — Company, Ventilated Facades, AluMatrix panels, Production, Services and Press Center — into section interfaces that assembled the main page.',
      'Facade pages covered purpose, types, design, advantages, systems, specifications, engineering and installation. Panel pages covered applications, colour, characteristics, production, processing, certificates and prices. Production pages covered technology, coating, thermal bonding, painting, processing and quality control. Service pages covered design, processing, installation, manufacturing, supervision and logistics. Editorial and promotional content sat under the hubs and the Press Center.',
      'Exact historic URLs and the CMS are not reconstructed. The diagram in the layout is the project information architecture, not a live sitemap audit.',
    ),
  ),
  semanticArchitecture: rt(
    p(
      'A semantic core of over 2,000 keywords connected aluminum composite panels, ventilated facades, installation systems, manufacturing processes and long-tail construction queries.',
      'Keyword volumes for individual terms are not stated. Competitor brands from the analysis are not named.',
    ),
  ),

  marketingStrategy: {
    seoAndContentStrategy: rt(
      p(
        'The main digital strategy in the source is search-led: competitor analysis, a semantic core of over 2,000 terms, keyword mapping onto facade / panel / manufacturing pages, technical on-page copy, a blog for long-tail capture, schema markup and industry link building.',
        'No article count or publishing calendar is stated.',
      ),
    ),
    leadGenMechanism: rt(
      p(
        'The site and paid campaigns were meant to make specific facade products and installation services findable, then allow contact. No form mix or lead volume is published beyond the source PPC conversion percentages.',
      ),
    ),
    paidAdvertising: [
      {
        channel: 'other' as const,
        strategy: rt(
          p(
            'Contextual advertising / paid search promoting aluminum composite panels, ventilated facades and related installation services alongside the organic programme.',
            'The platform is not named in the source.',
          ),
        ),
        campaignStructure: rt(
          p(
            'Three main PPC campaigns, each with ten ad groups and two to ten ads per group, covering different product lines and customer groups. A/B testing of ad formats and keyword bid adjustments are named. Historic ad copy is not reconstructed.',
          ),
        ),
        results: rt(
          p(
            'Source-reported for the two-year window: clicks +30%, conversions +110%, average CPC −5%, cost per conversion −30%, CTR +100%, conversion rate +75%. Not independently re-audited. Budgets are not disclosed.',
          ),
        ),
      },
    ],
    socialMedia: [
      {
        channel: 'other' as const,
        strategy: rt(
          p(
            'Social and content marketing are named on the source page as part of the balanced programme. Platforms are not listed.',
          ),
        ),
        content: rt(
          p(
            'Not disclosed. Post formats and a content calendar are not in the source.',
          ),
        ),
        results: rt(
          p(
            'Source-reported for the two-year window: social engagement +40%, traffic from social channels +20%. Platforms are not named.',
          ),
        ),
      },
    ],
  },

  aiSearchOptimization: {
    brandAuthorityAndTrust: rt(
      p(
        'This project is described as SEO, technical content, schema, link building and PPC for a facade-panel manufacturer. It is not rewritten as an AI-search engagement.',
        'No ChatGPT ranking, Perplexity citation, Gemini visibility, AI Overview result or AI-generated lead is claimed, and none is documented.',
      ),
    ),
    entityAndGeoStructure: rt(
      p(
        'Aluminum composite panels, ventilated facades, mounting subsystems, coating processes and installation are treated as related entities in the information architecture. That topical model is useful for modern search systems in principle. It is not a measured GEO or AEO programme.',
      ),
    ),
  },

  implementationProcess: rt(
    p(
      'Confirmed shape of the work, without inventing dates: analyse industrial and construction competitors; build the semantic core; map terms onto facade, panel and manufacturing pages; write technical content and a long-tail blog; apply schema and link building; run structured PPC with A/B tests and bid adjustments.',
      'The sequence is the method. It is not a dated Gantt chart. Results are reported after two years of collaboration.',
    ),
  ),

  timeline: [
    {
      period: 'Phase 1',
      title: 'Keyword and competitor research',
      description: rt(
        p(
          'Analyse industrial and construction search. Build a semantic core of over 2,000 terms for ACP, ventilated facades and installation systems. Competitor brands are not named.',
        ),
      ),
    },
    {
      period: 'Phase 2',
      title: 'Site structure and keyword mapping',
      description: rt(
        p(
          'Map the core onto ventilated facades, panels, manufacturing and related long-tail topics so related products do not collapse into one cladding homepage.',
        ),
      ),
    },
    {
      period: 'Phase 3',
      title: 'Technical content, schema and link building',
      description: rt(
        p(
          'Write category copy, metadata and a blog for installation and industry topics. Apply schema markup. Build links from industry sites and forums. Article titles are not reconstructed.',
        ),
      ),
    },
    {
      period: 'Phase 4',
      title: 'PPC campaigns and two-year optimisation',
      description: rt(
        p(
          'Run three product-line campaigns with ten ad groups each, A/B tests and bid adjustments, alongside ongoing SEO. The two-year figures are the published measurement window.',
        ),
      ),
    },
  ],

  resultsSummary: rt(
    p(
      'The documented outcome is a two-year SEO, content and PPC programme for a manufacturer of aluminum composite panels and mounting subsystems: a semantic core of over 2,000 keywords, mapped facade architecture, schema, link building and three structured paid-search campaigns.',
      'Organic, PPC and social percentages from the source are reproduced as source-reported results. Revenue and leadership claims are not restated. The two-year figure is the collaboration window, not a separately verified campaign-continuity log.',
    ),
  ),

  metrics: [
    sourceMetric('+40%', 'Organic traffic', 'Organic traffic growth.'),
    sourceMetric('+1,200+', 'Additional keywords ranked', 'Additional keywords in Google rankings.'),
    sourceMetric('+110%', 'PPC conversions', 'Paid-search conversion growth.'),
    sourceMetric('−5%', 'Average CPC', 'Average cost per click reduction on paid search.'),
    sourceMetric('+100%', 'PPC click-through rate', 'Paid-search CTR.'),
    sourceMetric('~2,000', 'SEO keyword foundation', 'Keywords in the semantic core, before the later ranking totals.'),
    {
      value: '2 years',
      label: 'Published collaboration window',
      description: rt(
        p(
          'The source reports results after two years of collaboration. That is relationship duration for the published figures, not a verified uninterrupted campaign log.',
        ),
      ),
    },
  ],

  projectsShowcase: [
    {
      projectName: 'Aluminum composite panels',
      description: rt(
        p(
          'Design, manufacturing and sale of ACP in multiple colours and configurations, including coating and processing. Illustrative gallery images are not AluMatrix catalogue shots.',
        ),
      ),
    },
    {
      projectName: 'Ventilated facades and mounting subsystems',
      description: rt(
        p(
          'Customised ventilated facade systems and the mounting / fastening components required to install them. Named buildings are not listed.',
        ),
      ),
    },
    {
      projectName: 'Related facade SEO engagements',
      description: rt(
        p(
          'The source page also documents ventilated-facade SEO work for VentFasad, GPTM GROUP, PromTehMontg, Facade Installation and Grosstek. Those are related methodology examples, not AluMatrix brands or this Case Study’s subject.',
        ),
      ),
    },
  ],

  expertInsight: rt(
    p(
      'The useful complexity here is a facade manufacturer whose buyers search by material, system, mounting, process and installation. That is not one query and not one landing page.',
      'A 2,000-keyword core matters only if it is mapped. PPC matters because some of those buyers are ready now. Neither replaces the manufacturing story.',
      'Where the source is silent — ad platform, CMS, stone or glass systems, named buildings — the correct public line is Not disclosed. This discussion is editorial. It is not a conversation with AluMatrix.',
    ),
  ),

  clientTestimonial: {
    quote: null,
    author: null,
    position: null,
    company: null,
  },

  hero: {
    type: 'lowImpact' as const,
    richText: rtHero(
      p(
        'SEO, technical content and contextual advertising for AluMatrix — a manufacturer of aluminum composite panels, mounting subsystems and ventilated facade systems.',
      ),
    ),
  },

  primary_case_study_category: PRIMARY_CASE_STUDY_CATEGORY,
  case_study_categories: CASE_STUDY_CATEGORIES,

  meta: {
    title: 'AluMatrix Case Study | Facade Systems SEO and Paid Search',
    description:
      'Explore how Neolines supported AluMatrix with a broad SEO foundation and contextual advertising for aluminum composite panels, ventilated facades, and mounting systems.',
    image: previewImageId,
  },
})

const main = async () => {
  const dry = process.argv.includes('--dry')
  const payload = await getPayload({ config })
  const tree = measureCommentTree(buildCommentTree(DISCUSSION))

  if (dry) {
    payload.logger.info(
      JSON.stringify(
        {
          slug: SLUG,
          faqQuestions: faqBlock().items.length,
          discussionEntries: DISCUSSION.length,
          expertReplies: DISCUSSION.filter((entry) => entry.isExpert).length,
          discussionTree: tree,
          niches: 4,
          timeline: 4,
          metrics: 7,
          paidAds: 1,
          duration: '2_years',
          featured: true,
          displayOrder: 11,
          categories: CASE_STUDY_CATEGORIES.length,
          galleryImages: GALLERY_IMAGES.length,
        },
        null,
        2,
      ),
    )
    process.exit(0)
  }

  const duplicates = await payload.find({
    collection: 'case-studies',
    where: {
      or: [
        { slug: { equals: SLUG } },
        { slug: { like: 'alumatrix' } },
        { slug: { like: 'alu-matrix' } },
        { title: { like: 'AluMatrix' } },
        { title: { like: 'Alumatrix' } },
      ],
    },
    limit: 5,
    depth: 0,
    overrideAccess: true,
    select: { id: true, slug: true, title: true },
  })

  const previewImageId = await upsertMedia(payload, PREVIEW_IMAGE)
  const galleryIds: number[] = []
  for (const image of GALLERY_IMAGES) {
    galleryIds.push(await upsertMedia(payload, image))
  }
  const structureImageId = await upsertMedia(payload, STRUCTURE_IMAGE)

  const data = buildData(previewImageId, galleryIds, structureImageId)
  const existing = duplicates.docs.find((doc) => doc.slug === SLUG) ?? duplicates.docs[0]

  if (existing && existing.slug !== SLUG && existing.slug !== 'alumatrix') {
    throw new Error(`Related AluMatrix record exists with different slug: ${existing.id} ${existing.slug}`)
  }

  if (existing) {
    const updated = await payload.update({
      collection: 'case-studies',
      id: existing.id,
      data: data as never,
      overrideAccess: true,
      context: { disableRevalidate: true },
    })
    payload.logger.info(`Updated existing Case Study ${updated.id}: ${getCaseStudyUrl(updated)}`)
  } else {
    const created = await payload.create({
      collection: 'case-studies',
      data: data as never,
      overrideAccess: true,
      context: { disableRevalidate: true },
    })
    payload.logger.info(`Created Case Study ${created.id}: ${getCaseStudyUrl(created)}`)
  }

  process.exit(0)
}

void main().catch((error) => {
  console.error(error)
  process.exit(1)
})
