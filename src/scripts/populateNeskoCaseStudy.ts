import 'dotenv/config'
import { generateJSON } from '@tiptap/html'
import config from '@payload-config'
import { getPayload } from 'payload'

import { buildCommentTree, measureCommentTree } from '../blocks/CaseStudyCommentsBlock/buildCommentTree'
import { getCaseStudyUrl } from '../utilities/getContentUrls'
import { getTiptapExtensions } from '../utilities/richText/extensions'

/**
 * Creates or updates the Nesko Case Study in the existing architecture.
 * Structural reference: Laser Made (fields, layout blocks, FAQ, comments).
 * Re-runnable: structured fields and layout blocks are replaced, not appended.
 *
 * No invented metrics, testimonials, photographs, competitor names, Drupal
 * versioning, paid ads, social campaigns or AI-search rankings.
 * No site_categories. No new collections or fields.
 */
const SLUG = 'nesko-energy-efficiency'

const EXPERT = 'Maryan Polyak'
const EXPERT_ROLE = 'Manufacturing Digital Marketing & Web Development Expert'

/** Existing Case Study Category IDs. Primary drives the public URL. */
const PRIMARY_CASE_STUDY_CATEGORY = 239 // manufacturing-website-development
const CASE_STUDY_CATEGORIES = [
  239, // Manufacturing Website Development
  226, // Manufacturing Website Design & Development
  238, // Manufacturing Website Design
  196, // Manufacturing SEO
  204, // Industrial SEO
  197, // Application SEO
  218, // Product SEO
  311, // Technical Content Marketing
  669, // Manufacturing
  676, // Industrial Manufacturing
  515, // Energy & Power Generation
  517, // Energy Equipment
  526, // Engineering & Technical Services
  530, // Engineering Services
  529, // Electrical Engineering
  531, // Industrial Engineering
  645, // Industrial Lighting Equipment
  636, // Industrial Equipment
  484, // Design, Manufacturing & Installation
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

/**
 * 8 top-level branches, mixed shapes, 24 entries, depth capped at 3.
 * Editorial discussion participants - not clients or customers.
 */
const DISCUSSION: DiscussionEntry[] = [
  {
    author: 'Lukas Berger',
    role: 'Industrial energy consultant',
    date: '2026-10-01',
    depth: 0,
    body: p(
      'Most energy firms put audit, equipment and installation on one Services page. Why was that not enough for Nesko?',
    ),
  },
  expert(
    '2026-10-01',
    p(
      'Because those are different jobs and different searches. An energy audit is an assessment. Energy passports are documentation. Cost optimization is a commercial outcome. Equipment, dismantling and installation are delivery. One page can name all of that. It cannot rank for it, and it cannot help a plant engineer find the step they actually need.',
      'The work was to treat those directions as related layers in the architecture, not as a paragraph on a corporate brochure.',
    ),
    1,
  ),
  {
    author: 'Anna Kowalska',
    role: 'In-house marketer, engineering services',
    date: '2026-10-02',
    depth: 2,
    body: p(
      'Did you publish a dedicated page for every service name in the research, including thin clusters?',
    ),
  },
  expert(
    '2026-10-02',
    p(
      'No. Research is a map, not a publishing quota. Directions that matched real Nesko work became structure and content. Clusters that did not match the offering were left alone. I will not claim that every service had its own landing page, because that is not in the project record.',
    ),
    3,
  ),
  {
    author: 'Tomas Novak',
    role: 'Technical SEO, B2B accounts',
    date: '2026-10-03',
    depth: 0,
    body: p(
      'How did SEO actually change the website, rather than arriving after the design was finished?',
    ),
  },
  expert(
    '2026-10-03',
    p(
      'Keyword research, competitor structure and search intent were used to segment the offering before the information architecture was locked. Semantic maps sat between the core and the page list. UX then had to make that structure usable. Development implemented the architecture. SEO was not a metadata pass on a finished brochure.',
    ),
    1,
  ),
  {
    author: 'Henrik Larsen',
    role: 'Plant energy manager',
    date: '2026-10-04',
    depth: 0,
    body: p(
      'Industrial buyers do not shop for energy the way they shop for machines. How did the site explain that an audit is not the same as buying a fixture?',
    ),
  },
  expert(
    '2026-10-04',
    p(
      'By making the sequence visible: analysis of consumption, identification of losses and savings, design of a solution, equipment where it is required, removal and installation when a project needs it, then implementation. The commercial object is that chain, not a catalogue SKU.',
      'Copy had to say that in language a technical buyer can recognise, without pretending every enquiry is a full turnkey rebuild.',
    ),
    1,
  ),
  {
    author: 'Elena Popescu',
    role: 'Content strategist, industrial sites',
    date: '2026-10-05',
    depth: 2,
    body: p(
      'Where did the blog sit in that chain? Informational articles often drift away from the commercial structure.',
    ),
  },
  expert(
    '2026-10-05',
    p(
      'The blog was opened as a long-term search and explanation layer, not as a news feed. It had to cover informational demand around energy topics, give a second entry from search, and support expert positioning, while still linking back to audit, efficiency, equipment and implementation pages.',
      'Article titles from the original engagement are not stored here, so none are listed.',
    ),
    3,
  ),
  {
    author: 'Marco Ricci',
    role: 'UX designer, technical B2B',
    date: '2026-10-06',
    depth: 0,
    body: p(
      'If the offering is that wide, how did UX stop the first screen from becoming a wall of service names?',
    ),
  },
  expert(
    '2026-10-06',
    p(
      'The job was orientation: what Nesko does, which problems it takes on, which directions exist, how audit, analysis, equipment and delivery connect, and where to go next. UX and SEO had to agree on that map. A design system, component library or visual identity kit is not documented in this project, so I will not invent one.',
    ),
    1,
  ),
  {
    author: 'Petra Svoboda',
    role: 'Procurement, industrial facilities',
    date: '2026-10-07',
    depth: 2,
    body: p(
      'Would you put dismantling and installation on the equipment page, or keep them as their own direction?',
    ),
  },
  expert(
    '2026-10-07',
    p(
      'They needed a place that can be found. Equipment pages should still say that removal and installation exist when a project requires them. Hiding delivery inside an equipment paragraph is how industrial sites lose that intent. The architecture treated them as related, not identical.',
    ),
    3,
  ),
  {
    author: 'Johan De Vries',
    role: 'Head of digital, engineering group',
    date: '2026-10-08',
    depth: 0,
    body: p(
      'The write-up has no traffic table. Was the project measured, or is this only a structure story?',
    ),
  },
  expert(
    '2026-10-08',
    p(
      'The work was practical: research, segmentation, architecture, UX, development, content, SEO and a blog. Verified traffic, ranking and lead figures are not stored in the current project data, so they are not published.',
      'What can be stated is the output: a clearer service structure, semantic maps, an SEO-oriented architecture, and a content layer that can keep growing.',
    ),
    1,
  ),
  {
    author: 'Marta Nowak',
    role: 'SEO specialist, professional services',
    date: '2026-10-09',
    depth: 2,
    body: p(
      'Would you now rewrite this as an AI-search or GEO case?',
    ),
  },
  expert(
    '2026-10-09',
    p(
      'No. This engagement is described as research, architecture, website work, SEO and content. There is no documented ChatGPT, Perplexity, Gemini or AI Overview measurement for Nesko.',
      'A clearer model of audit, efficiency, equipment and implementation is useful to any system that has to understand the company. That is a structural observation, not a ranking claim.',
    ),
    3,
  ),
  {
    author: 'Andrei Ionescu',
    role: 'Electrical engineer, industrial projects',
    date: '2026-10-10',
    depth: 0,
    body: p(
      'Energy passports and financing instruments are easy to oversell online. How far did the site go?',
    ),
  },
  expert(
    '2026-10-10',
    p(
      'Passports were treated as a documented service direction because they were part of the offering. Financing instruments related to supporting and delivering efficiency projects were also part of the source description, so they belong in the structure as a support path, not as a bank product we did not specify.',
      'No scheme names, subsidy programmes or certificate numbers are stated here, because they are not in the project record.',
    ),
    1,
  ),
  {
    author: 'Sofia Lindqvist',
    role: 'Industrial content editor',
    date: '2026-10-11',
    depth: 0,
    body: p(
      'How technical did the new pages need to be for plant staff versus general management?',
    ),
  },
  expert(
    '2026-10-11',
    p(
      'Technical enough to be useful, not a substitute for an on-site audit report. Pages had to explain directions, the sequence of work and the industrial context so a searching buyer could recognise the offering and continue toward an enquiry.',
      'The audience is industrial and other large facilities. The copy is for that reader, not for a generic energy blog.',
    ),
    1,
  ),
]

const faqBlock = () => ({
  blockType: 'csFAQ' as const,
  case_study_faq_title: 'Frequently Asked Questions About Nesko',
  items: [
    {
      question: 'How did SEO influence the structure of the Nesko website?',
      answer: rt(
        p(
          'SEO started before the page list was finished. Market and competitor research, keyword work and semantic maps were used to segment the offering. The information architecture followed that map. UX made the map usable. Development implemented it. Metadata on a single corporate page would not have carried audit, passports, efficiency, equipment, dismantling, installation and implementation as separate search jobs.',
        ),
      ),
    },
    {
      question: 'Why was the service structure expanded?',
      answer: rt(
        p(
          'Nesko already covered a wide range of energy work. The digital structure had to show those directions as findable, related parts of one offering rather than a short list on an about page. Expansion here means clearer representation of real work, not inventing services the company did not provide.',
        ),
      ),
    },
    {
      question: 'How was the energy audit positioned online?',
      answer: rt(
        p(
          'As the start of a solution chain, not as a product swap. An industrial client is looking at existing consumption, losses and options, then at a designed response that may include equipment and installation. The site had to make that sequence visible so audit demand did not collapse into a generic energy-company description.',
        ),
      ),
    },
    {
      question: 'Why was a company blog important for the project?',
      answer: rt(
        p(
          'The blog was part of the SEO and content plan. It extended semantic coverage, answered informational queries, explained energy topics, created additional search entry points and supported expert positioning. It was not a separate publishing hobby. Individual article titles from the engagement are not stored in this project.',
        ),
      ),
    },
    {
      question: 'How can an energy-efficiency company present complex services clearly?',
      answer: rt(
        p(
          'By structuring the offering the way the work actually runs: audit and assessment, efficiency and cost optimization, passports, equipment, removal and installation, project implementation, and any confirmed support such as financing instruments. Then write to the buyer task, connect the pages, and keep UX aligned with that map.',
        ),
      ),
    },
    {
      question: 'What role did competitor and keyword research play in the project?',
      answer: rt(
        p(
          'They showed how the market named directions, how competing sites grouped services, and which queries were commercial versus informational. That evidence fed the semantic core and the maps that sat behind architecture and content. Competitor brands are not listed, because they are not verified in the current project data.',
        ),
      ),
    },
  ],
})

const discussionBlock = () => ({
  blockType: 'csComments' as const,
  case_study_comment_title: 'Expert Discussion: Nesko',
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
    `<h2>${escapeHtml('Discuss a similar energy-services website and SEO architecture')}</h2>` +
      p(
        'If you deliver audits, efficiency projects and equipment implementation, and the website still reads like a generic company page, tell us how the offering is structured.',
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

const buildData = () => ({
  title: 'Nesko - Energy Efficiency and Digital Strategy for Industrial Companies',
  case_study_long_title:
    'Nesko - Website, SEO and Digital Strategy for Energy Auditing and Industrial Energy Efficiency',
  slug: SLUG,
  generateSlug: false,
  _status: 'published' as const,
  featured: true,
  displayOrder: 4,
  duration: null,

  layout: [
    {
      blockType: 'csPreview' as const,
      case_study_preview_title:
        'Nesko: Website, SEO and Service Architecture for Energy Auditing and Industrial Efficiency',
      case_study_preview_text: rt(
        p(
          'Nesko provided energy auditing, efficiency work, equipment selection, dismantling and installation, and project implementation for industrial and other large facilities. The engagement was to present that chain online: research, semantic maps, an expanded service structure, UX, website development, SEO and a company blog, so buyers could find a specific direction instead of a generic energy-company page.',
        ),
      ),
    },
    titleBlock('About the Client'),
    contentBlock(
      p(
        'Nesko was a national energy company offering combined work in energy auditing, energy efficiency and the reduction of energy costs. It is not useful to describe it only as an energy company. The commercial object was a solution path: understand consumption, find savings, design a response, select equipment where needed, remove and install hardware when a project required it, and deliver the efficiency project.',
        'The same offering included energy passports and financial instruments used to support and implement efficiency projects. This case does not name subsidy programmes, certificate numbers or specific plants. The working description is a technical energy-services provider for industrial and other large sites.',
        'Maryan Polyak\'s work sat on the digital side of that offering: market and competitor research, keyword analysis, semantic architecture, service structure, UX, website development, content and SEO. The company did not exist because of marketing. A wide professional offering needed a website that industrial buyers could navigate and search engines could interpret.',
      ),
    ),
    titleBlock('At a Glance'),
    contentBlock(
      ul([
        'Company: Nesko',
        'Industry: Energy and energy efficiency for industrial and other large facilities',
        'Core areas: Energy auditing, energy efficiency, energy-cost optimization, energy and lighting equipment, dismantling and installation, project implementation',
        'Project focus: Website strategy, UX/UI, SEO, content architecture, digital marketing',
        'Platform: Not recorded as a verified CMS or version in the current project data, so none is named here',
      ]),
    ),
    titleBlock('Why This Was Not a Simple Corporate Site'),
    contentBlock(
      p(
        'The difficulty was the width of the professional offering, not the lack of a homepage. Nesko had to explain technical services in language a buyer could use, cover a large spread of search intents, separate directions of work, and keep UX and SEO on the same map.',
        'The architecture also had to leave room for later content, including a company blog as part of a long-term search plan. A short corporate site can announce that a company works in energy. It cannot carry audit, passports, optimization, equipment, replacement and implementation as distinct jobs.',
        'Exact counts of services or URLs are not stated. They are not in the project record.',
      ),
    ),
    titleBlock('Research, Semantic Maps and Service Structure'),
    contentBlock(
      p(
        'Work started with market and competitor research, including how competing sites grouped energy services, and with search-demand analysis across commercial and informational queries. That produced a semantic core and semantic maps. Those maps were used to expand and organise the public service structure so separate directions could exist as clear search and commercial paths.',
        'The sequence was keyword research, semantic core, search intent, service segmentation, semantic maps, website architecture, content structure, internal linking, then blog and further content. SEO participated in forming the structure. It did not wait for a finished visual design.',
      ) +
        ul([
          'Energy audit',
          'Energy efficiency',
          'Energy passports',
          'Energy-cost optimization',
          'Energy equipment',
          'Equipment installation',
          'Equipment removal and replacement',
          'Energy-efficiency project implementation',
          'Financial instruments that support delivery of efficiency projects',
        ]) +
        p(
          'These names follow the supplied project material. They are not an invented catalogue. Specific URLs are not reconstructed. The case does not claim that every direction had its own landing page.',
        ),
    ),
    titleBlock('Website Architecture, UX and Development'),
    contentBlock(
      p(
        'The website was the implementation of that research, not a separate visual project. The structure had to hold the main energy-service directions, audit, efficiency, passports, optimization, equipment and its introduction on site, dismantling and installation, informational content and the blog.',
        'UX had a business job: a prospective client should quickly see what Nesko does, which problems it takes on, which services exist, how audit, analysis, equipment and delivery connect, and where to go next. No component library or design-token set is documented, so none is described.',
        'Development implemented the prepared UX and SEO architecture. A CMS name and version are not recorded in the current project data, so the platform is not named.',
      ),
    ),
    titleBlock('SEO and Content Marketing'),
    contentBlock(
      p(
        'The SEO programme covered keyword research, competitor research, the semantic core, semantic maps, service expansion, SEO-oriented information architecture, internal linking, content development and a base for longer-term organic visibility. SEO changed how the business was represented online. It was not limited to titles on a few existing pages.',
        'Content marketing was required, and the company blog was part of that plan. The blog extended semantic coverage, answered informational queries, explained energy topics, created additional search entry points, supported expert positioning and fed long-term visibility. Article titles from the original engagement are not stored here.',
        'Paid search, social campaigns, email, LinkedIn, PR, CRM and analytics stacks are not listed as completed work. They are not confirmed in the source material used here. Exact keyword volumes, rankings and traffic figures are not published.',
      ),
    ),
    titleBlock('What the Work Produced'),
    contentBlock(
      p(
        'The result that can be stated without inventing figures is qualitative: a broader and clearer service structure, an SEO-oriented architecture, a structured semantic core, a blog as a content layer, a stronger base for long-term organic work, and more understandable communication of complex energy services.',
        'Nesko could be found and understood as a provider of auditing, efficiency, equipment and implementation, not only as a generic energy company. No percentage, lead count, ranking table or ROI is attached, because none is verified in this project.',
      ),
    ),
    faqBlock(),
    discussionBlock(),
    ctaBlock(),
  ],

  manufacturingProfile: {
    productionCapabilities: rt(
      p(
        'Nesko worked across energy auditing, analysis of energy performance, preparation of energy passports, design and selection of efficiency solutions, energy and lighting equipment, dismantling and installation when a project required it, and delivery of solutions that reduce energy cost.',
        'This is a services-and-implementation profile, not a claim that Nesko manufactured every device it specified. The capability that matters for this case is the ability to assess a site, design a response and carry the work through equipment and installation where needed.',
      ),
    ),
    products: rt(
      p(
        'The primary offer to the client was a combined solution rather than a single product: energy analysis, identification of losses and optimization opportunities, design of a response, equipment, installation, project delivery and improved efficiency.',
        'Documented directions also include energy passports and financial instruments used to support implementation. No equipment brands, model numbers or lighting-fixture specifications are stated.',
      ),
    ),
    materials: null,
    applications: rt(
      p(
        'The primary application is industrial sites and production facilities, where energy cost, equipment and retrofit work sit inside an operating plant. The source also supports work for other large facilities that need the same audit-to-implementation path.',
        'Named factories, sectors and client projects are not listed. They are not in the material used for this case.',
      ),
    ),
  },

  businessChallenge: {
    initialState: rt(
      p(
        'Nesko needed to present itself as a provider of combined energy-efficiency solutions, not only as an energy company. The public digital structure had to explain services, show directions of work, and help a prospective client see which path fitted an existing site.',
      ),
    ),
    challenge: rt(
      p(
        'Energy efficiency for an industrial client is not the purchase of a device. It is analysis of current consumption, the search for optimization, and delivery of a combined response. The site had to cover different query types, support commercial and informational paths, create a base for long-term SEO, and strengthen professional positioning without collapsing that chain into one generic page.',
      ),
    ),
    goals: rt(
      ul([
        'Explain the service chain from audit through implementation',
        'Make distinct directions of work findable',
        'Map search intent onto a usable website structure',
        'Keep UX and SEO on the same architecture',
        'Build a content and blog layer for longer-term organic visibility',
        'Avoid inventing traffic, ranking or lead targets',
      ]),
    ),
  },

  nicheSegmentation: [
    {
      name: 'Energy Auditing and Assessment',
      description: rt(
        p(
          'Assessment of how a facility uses energy, including analysis that can lead to passports and to a defined set of efficiency options.',
        ),
      ),
      marketingApproach: rt(
        p(
          'Give audit and assessment their own place in the architecture and in search, then link forward to efficiency, equipment and implementation so the audit is the start of a path rather than a dead-end brochure page.',
        ),
      ),
    },
    {
      name: 'Energy Efficiency and Cost Optimization',
      description: rt(
        p(
          'Work aimed at reducing energy cost through designed measures, not only through a product list. Financial instruments that support delivery sit here as a support path, without naming specific funds.',
        ),
      ),
      marketingApproach: rt(
        p(
          'Write to the outcome industrial buyers search for - lower cost, better performance of existing systems - and connect those pages to audit evidence and to delivery, rather than to a generic green-energy message.',
        ),
      ),
    },
    {
      name: 'Energy Equipment and Implementation',
      description: rt(
        p(
          'Selection of energy and lighting equipment, dismantling of existing kit when a project requires it, installation of new equipment, and implementation of the efficiency project on site.',
        ),
      ),
      marketingApproach: rt(
        p(
          'Treat equipment and site work as findable directions linked to audit and efficiency, so a buyer looking for implementation does not have to infer it from a company profile. No claim is made that every equipment query had a separate URL.',
        ),
      ),
    },
  ],

  digitalEcosystem: rt(
    p(
      'The digital ecosystem in this case was the corporate website, service and direction pages, SEO architecture, technical and commercial content, internal linking, and a company blog used as a long-term content and search layer.',
      'CRM, advertising platforms, social programmes and analytics products are not listed as delivered work. They are not confirmed in the source material used here. A CMS platform is not named, because it is not verified in the current project data.',
    ),
  ),
  websiteArchitecture: rt(
    p(
      'The architecture was designed to hold the main energy-service directions: audit, efficiency, passports, optimization, equipment and its introduction, dismantling and installation, informational content and the blog.',
      'Exact historic URLs are not reconstructed. The point is that structure followed research. The website was not a visual wrapper placed around an unchanged service list.',
    ),
  ),
  semanticArchitecture: rt(
    p(
      'The semantic model connected energy auditing, energy efficiency, energy passports, cost optimization, energy equipment, lighting equipment, dismantling, installation, project implementation, industrial facilities and informational energy topics.',
      'Intent was mapped to appropriate content rather than forcing every query onto a general company page. Keyword volumes are not stated. Semantic maps sat between the core and the architecture so service expansion had a documented basis.',
    ),
  ),

  marketingStrategy: {
    seoAndContentStrategy: rt(
      p(
        'Search-driven industrial marketing supported by a stronger service architecture: keyword research, competitor and SERP analysis, semantic core, semantic maps, service segmentation, website structure, UX alignment, content, internal linking and a blog.',
        'The blog extended informational coverage and expert positioning while remaining part of the same map as the commercial directions. No article inventory is published. Paid media is not included as a completed channel.',
      ),
    ),
    leadGenMechanism: rt(
      p(
        'The site was meant to support enquiries from industrial and facility buyers who found a relevant direction - audit, efficiency, equipment or implementation - and could see how Nesko worked. No form mix, conversion rate or lead volume is published.',
      ),
    ),
    paidAdvertising: [],
    socialMedia: [],
  },

  aiSearchOptimization: {
    brandAuthorityAndTrust: rt(
      p(
        'This project is described in the language of the work as it was done: research, architecture, UX, website development, SEO and content. It is not rewritten as an AI-search engagement.',
        'A structured model of audit, efficiency, equipment and implementation gives search systems more accurate material than a thin corporate page. No ChatGPT ranking, Perplexity citation, Gemini visibility, AI Overview result or AI-generated lead is claimed.',
      ),
    ),
    entityAndGeoStructure: rt(
      p(
        'Service directions, industrial applications and the company are treated as related entities in the information architecture. That topical model is useful for modern search systems in principle. It is not a measured GEO or AEO programme.',
      ),
    ),
  },

  implementationProcess: rt(
    p(
      'Confirmed shape of the work, without inventing dates: research the market and competitors; analyse search demand; build the semantic core and maps; segment services; design information architecture and UX; develop the website; implement on-page SEO and content; open the blog as a continuing content layer.',
      'The sequence is the method. It is not a dated Gantt chart.',
    ),
  ),

  timeline: [
    {
      period: 'Phase 1',
      title: 'Market and competitor research',
      description: rt(
        p(
          'Review of the market, competing service structures and how energy companies presented audit, efficiency and delivery online. Individual competitor brands are not named.',
        ),
      ),
    },
    {
      period: 'Phase 2',
      title: 'Keyword research and semantic core',
      description: rt(
        p(
          'Analysis of commercial and informational demand around energy auditing, efficiency, equipment and implementation, organised into a semantic core.',
        ),
      ),
    },
    {
      period: 'Phase 3',
      title: 'Semantic maps and service segmentation',
      description: rt(
        p(
          'Translation of the core into maps and into a clearer public structure of directions, without treating every cluster as a required URL.',
        ),
      ),
    },
    {
      period: 'Phase 4',
      title: 'Information architecture and UX',
      description: rt(
        p(
          'Structure and orientation so a buyer can see the offering, the sequence of work and the next step, with SEO and UX sharing the same map.',
        ),
      ),
    },
    {
      period: 'Phase 5',
      title: 'Website development',
      description: rt(
        p(
          'Implementation of the prepared architecture. Platform name and version are omitted because they are not verified in the current project data.',
        ),
      ),
    },
    {
      period: 'Phase 6',
      title: 'SEO and content',
      description: rt(
        p(
          'On-page work, internal linking and content that matched the segmented directions rather than a single corporate narrative.',
        ),
      ),
    },
    {
      period: 'Phase 7',
      title: 'Blog and ongoing content expansion',
      description: rt(
        p(
          'A company blog as part of the SEO and content plan, intended to keep informational coverage growing. No article calendar is reconstructed here.',
        ),
      ),
    },
  ],

  resultsSummary: rt(
    p(
      'The public service structure became broader and easier to read as a chain from audit to implementation. Semantic coverage was organised rather than dumped onto a general page. The architecture was SEO-oriented, a blog existed as a content layer, and communication of complex energy services was clearer.',
      'That is a stronger foundation for long-term organic work. Verified historical traffic, rankings, leads, conversions, revenue and percentage improvements are not stored in this project, so none are published.',
    ),
  ),

  metrics: [],
  projectsShowcase: [],

  expertInsight: rt(
    p(
      'For an energy company, the website should not sell a fixture in isolation. It should make visible the ability to understand a facility\'s energy problem and to propose a combined response.',
      'The more complex the B2B service, the earlier it has to be structured in the language of search demand, client tasks and separate directions of the offering. If that work waits until after launch, the site will keep collapsing into a generic company page, regardless of how finished the design looks.',
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
        'Website strategy, UX, SEO and a service architecture for Nesko, so industrial buyers could find energy auditing, efficiency, equipment and implementation as a connected solution rather than a generic energy-company page.',
      ),
    ),
  },

  primary_case_study_category: PRIMARY_CASE_STUDY_CATEGORY,
  case_study_categories: CASE_STUDY_CATEGORIES,

  meta: {
    title: 'Nesko - Energy Efficiency and Energy Auditing',
    description:
      'Digital strategy, SEO and website development for Nesko, focused on energy auditing, efficiency, cost optimization and energy solutions.',
  },
})

const main = async () => {
  const dry = process.argv.includes('--dry')
  const payload = await getPayload({ config })
  const data = buildData()
  const tree = measureCommentTree(buildCommentTree(DISCUSSION))

  if (dry) {
    payload.logger.info(
      JSON.stringify(
        {
          slug: data.slug,
          layoutBlocks: data.layout.length,
          faqQuestions: faqBlock().items.length,
          discussionEntries: DISCUSSION.length,
          expertReplies: DISCUSSION.filter((entry) => entry.isExpert).length,
          discussionTree: tree,
          niches: data.nicheSegmentation.length,
          timeline: data.timeline.length,
          metrics: data.metrics.length,
          showcase: data.projectsShowcase.length,
          categories: data.case_study_categories.length,
          paidAds: data.marketingStrategy.paidAdvertising.length,
          social: data.marketingStrategy.socialMedia.length,
          duration: data.duration,
        },
        null,
        2,
      ),
    )
    process.exit(0)
  }

  const existing = await payload.find({
    collection: 'case-studies',
    where: { slug: { equals: SLUG } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })

  const payload_data = data as never

  if (existing.docs[0]) {
    const updated = await payload.update({
      collection: 'case-studies',
      id: existing.docs[0].id,
      data: payload_data,
      overrideAccess: true,
      context: { disableRevalidate: true },
    })
    payload.logger.info(`Updated existing Case Study ${updated.id}: ${getCaseStudyUrl(updated)}`)
  } else {
    const created = await payload.create({
      collection: 'case-studies',
      data: payload_data,
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
