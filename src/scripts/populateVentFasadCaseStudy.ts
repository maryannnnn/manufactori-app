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
 * Creates or updates the VentFasad Case Study.
 * Structural reference: AluMatrix / Aleks SF / NPK BINAR.
 * Re-runnable: structured fields and layout blocks are replaced, not appended.
 *
 * Duration = 1 year is the stated cooperation period, not a verified
 * campaign-continuity log. No invented traffic, rankings, leads or
 * conversion rates. Gallery images are illustrative. VentFasad is an
 * installation contractor, not an ACP factory. No site_categories.
 * No client logo. No paid-search block — PPC is not in the VentFasad source.
 */
const SLUG = 'ventfasad-ventilated-facade-installation'
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
  323, // Industrial Content Marketing
  326, // Manufacturing Content Marketing
  428, // Facade Installation
  429, // Facade Systems
  421, // Building Materials
  417, // Building Products & Materials
  426, // Construction Products
  425, // Construction Materials Manufacturing
  712, // Architectural Metal Fabrication
  484, // Design, Manufacturing & Installation
  751, // Industrial Installation
  526, // Engineering & Technical Services
  530, // Engineering Services
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
  filename: 'ventfasad-main-facade.jpg',
  alt: 'Large civic office building with a terracotta and sand ventilated cassette facade and visible panel joints.',
  caption:
    'Illustrative ventilated-facade envelope on a commercial building. Not a documented VentFasad project photograph.',
}

const GALLERY_IMAGES: ImageSpec[] = [
  {
    filename: 'ventfasad-commercial-envelope.jpg',
    alt: 'Curved metallic louver facade with vertical fins, photographed in daylight.',
    caption:
      'Licensed photograph of a metal louver facade (Santiago Franco, Unsplash License). Illustrative, not a documented VentFasad contract.',
  },
  {
    filename: 'ventfasad-mounting-detail.jpg',
    alt: 'Close-up of aluminum facade rails, brackets, insulation and fasteners behind a rainscreen panel.',
    caption:
      'Illustrative mounting subsystem behind a ventilated facade. Not a VentFasad shop drawing or site record.',
  },
  {
    filename: 'ventfasad-completed-civic.jpg',
    alt: 'Perforated metal facade panels on a curved building corner, photographed in daylight.',
    caption:
      'Licensed photograph of perforated metal cladding (Diana, Pexels License). Illustrative, not a verified VentFasad installation.',
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
 * Editorial discussion — not customer comments or VentFasad testimonials.
 */
const DISCUSSION: DiscussionEntry[] = [
  {
    author: 'Henrik Dahl',
    role: 'Technical SEO specialist',
    date: '2026-10-18',
    depth: 0,
    body: p(
      'Why does a facade installer need service-and-system mapping instead of one “we install facades” page?',
    ),
  },
  expert(
    '2026-10-18',
    p(
      'Because buyers search for different jobs: a ventilated facade, engineering, a mounting subsystem, cladding of a commercial building, or installation as a contractor. Those are related. They are not one URL.',
      'The VentFasad work started with keyword research, competitor analysis and a targeted semantic core, then mapped that core onto pages. A single contractor homepage cannot hold high-, mid- and low-frequency facade queries without competing with itself.',
    ),
    1,
  ),
  {
    author: 'Elena Petrova',
    role: 'In-house construction marketer',
    date: '2026-10-19',
    depth: 2,
    body: p(
      'How do you keep those pages from becoming thin copies of each other?',
    ),
  },
  expert(
    '2026-10-19',
    p(
      'Write to the job. An installation page describes site work. A mounting page describes rails and fasteners. An engineering page describes planning. A ventilated-facade page describes the rainscreen as a system.',
      'Content management is what keeps that map honest after launch. The source does not publish an article count, so I will not invent one.',
    ),
    3,
  ),
  {
    author: 'Thomas Weber',
    role: 'Facade project engineer',
    date: '2026-10-20',
    depth: 0,
    body: p(
      'Why should an installation company explain the mounting system if the client only sees the finished cladding?',
    ),
  },
  expert(
    '2026-10-20',
    p(
      'Because the visible panel is only half the offering. VentFasad’s documented scope includes planning and engineering, installation, and fabrication of mounting and fastening components. A contractor or architect buying a rainscreen is buying the subframe as well as the skin.',
      'If the site only shows finished buildings, the mounting query has nowhere to land. The gallery here is illustrative. It is not a VentFasad project file.',
    ),
    1,
  ),
  {
    author: 'Anna Kovacs',
    role: 'Specification writer',
    date: '2026-10-21',
    depth: 2,
    body: p(
      'Should panel manufacturing sit on the same site as installation?',
    ),
  },
  expert(
    '2026-10-21',
    p(
      'Not as a factory claim. This record treats VentFasad as an installation contractor that also fabricates mounting components. Aluminum composite panel production belongs to other engagements on the same source page, such as AluMatrix. Mixing those stories is how you overstate the workshop.',
    ),
    3,
  ),
  {
    author: 'James Whitaker',
    role: 'Industrial web designer',
    date: '2026-10-22',
    depth: 0,
    body: p(
      'The source names a custom website design for the facade industry. Why plan design together with SEO architecture?',
    ),
  },
  expert(
    '2026-10-22',
    p(
      'Because navigation is the public form of the semantic map. If design treats the site as a brochure and SEO treats it as a cluster of intents, the visitor gets a pretty homepage that cannot be found for installation, engineering or mounting.',
      'The documented design work is industry-specific presentation, intuitive navigation and a structure built for both SEO and usability. Theme names, CMS and a reconstructed sitemap are not disclosed.',
    ),
    1,
  ),
  {
    author: 'Clara Jensen',
    role: 'UX researcher',
    date: '2026-10-23',
    depth: 2,
    body: p(
      'The Russian source mentions bounce rate and conversion growth. Why are those numbers not on this page?',
    ),
  },
  expert(
    '2026-10-23',
    p(
      'Because they are not published as figures for VentFasad. The English source is qualitative. The Russian text also pastes an AluMatrix brand line into the VentFasad result. I will not turn that into a metrics table.',
      'The positive assessment stands on the breadth of the work: research, semantic core, content mapping, architecture, custom design and a year of content management. That is enough.',
    ),
    3,
  ),
  {
    author: 'Sophie Laurent',
    role: 'Content strategist',
    date: '2026-10-24',
    depth: 0,
    body: p(
      'What does content management actually do after the semantic core is mapped?',
    ),
  },
  expert(
    '2026-10-24',
    p(
      'It keeps each page attached to a real service or intent — installation, engineering, mounting, a facade type — and stops the copy from drifting into generic construction language the company does not deliver.',
      'The source describes unique technical texts, process descriptions and expert installation notes, with keywords placed in headings, lists and image alt text. A publishing calendar is not in the source.',
    ),
    1,
  ),
  {
    author: 'Pavel Orlov',
    role: 'Construction-sector marketing manager',
    date: '2026-10-25',
    depth: 2,
    body: p(
      'The collaboration lasted about one year. Does that make this a one-year SEO campaign?',
    ),
  },
  expert(
    '2026-10-25',
    p(
      'It makes it a one-year relationship in which SEO preparation, content management and website design were combined. I will not convert that into a ranking curve or a monthly activity log. Dates are not disclosed.',
    ),
    3,
  ),
  {
    author: 'Daniel Okonkwo',
    role: 'B2B demand generation lead',
    date: '2026-10-26',
    depth: 0,
    body: p(
      'Is this a paid-search case as well?',
    ),
  },
  expert(
    '2026-10-26',
    p(
      'No. The documented VentFasad work is keyword research, competitor analysis, a semantic core, content mapping, SEO architecture, custom design and content management. PPC is not listed for this engagement. I will not add it from the AluMatrix page.',
    ),
    1,
  ),
  {
    author: 'Henrik Dahl',
    role: 'Technical SEO specialist',
    date: '2026-10-27',
    depth: 2,
    body: p(
      'The AluMatrix case used a 2,000-keyword core and PPC. Can those numbers be copied here because the source pages sit together?',
    ),
  },
  expert(
    '2026-10-27',
    p(
      'No. Sharing a source page is not sharing a dataset. VentFasad gets the semantic-core method and the one-year website-and-content engagement. It does not inherit AluMatrix keyword counts or paid-search results.',
    ),
    3,
  ),
  {
    author: 'Lukas Schneider',
    role: 'Technical SEO specialist',
    date: '2026-10-27',
    depth: 0,
    body: p(
      'Has any of this been measured in AI search — ChatGPT, Perplexity or AI Overviews?',
    ),
  },
  expert(
    '2026-10-27',
    p(
      'Not in this record. No ChatGPT ranking, Perplexity citation or AI Overview result is documented.',
      'A topical model that connects ventilated facades, mounting, engineering and installation is useful groundwork for modern search in principle. It is not a measured GEO or AEO programme.',
    ),
    1,
  ),
  {
    author: 'Martin Novak',
    role: 'In-house manufacturing marketer',
    date: '2026-10-28',
    depth: 2,
    body: p(
      'The source talks about leading positions in the niche. Should this case repeat that?',
    ),
  },
  expert(
    '2026-10-28',
    p(
      'No. Leadership language is not a substitute for a ranking table, and no ranking table was published for VentFasad. The credible story is a focused year of SEO, content and website design for an installation contractor. This discussion is editorial. It is not a testimonial from VentFasad.',
    ),
    3,
  ),
]

const faqBlock = () => ({
  blockType: 'csFAQ' as const,
  case_study_faq_title: 'Frequently Asked Questions About VentFasad',
  items: [
    {
      question: 'What is a ventilated facade system?',
      answer: rt(
        p(
          'A ventilated facade, or rainscreen, is a cladding system in which panels sit on a mounting subframe with an air gap behind them. The visible skin, the subframe and the insulation work together. That is general construction practice, not a VentFasad product specification.',
          'VentFasad’s documented work is planning, engineering, mounting-component fabrication and installation of such systems. Panel brands, spans and U-values are not disclosed.',
        ),
      ),
    },
    {
      question: 'What role do mounting and fastening components play in facade installation?',
      answer: rt(
        p(
          'The panel only performs if it is fixed correctly. Rails, brackets and fasteners carry load, create the ventilation gap and absorb movement. VentFasad’s scope includes fabrication of mounting and fastening components as well as installation.',
          'Bracket catalogues, load tables and coatings are not in the source.',
        ),
      ),
    },
    {
      question:
        'What should a building owner or contractor consider when selecting a facade installation company?',
      answer: rt(
        p(
          'Whether the contractor can connect engineering, the mounting subsystem and on-site installation, and whether the website describes those jobs separately enough to be found. Typical audiences in this sector include construction companies, developers, architects and engineers. That is a market observation, not a VentFasad client list.',
          'Certifications, warranties and named contracts are not published for this record.',
        ),
      ),
    },
    {
      question: 'How can SEO help a specialized facade contractor reach relevant B2B audiences?',
      answer: rt(
        p(
          'Professional buyers search by system, service, mounting and building type. Keyword research, competitor analysis and a targeted semantic core — including high-, mid- and low-frequency queries — give those intents destinations instead of one contractor slogan.',
          'No ranking table or traffic percentage is published for VentFasad.',
        ),
      ),
    },
    {
      question: 'Why should keyword research, content planning, and website architecture be developed together?',
      answer: rt(
        p(
          'A keyword list is not a website. Content mapping assigns each cluster to a page. Architecture and navigation make that map usable. Custom design for the facade industry then presents installation, engineering and mounting as one contractor without hiding the separate search jobs.',
          'The one-year collaboration combined those pieces. A reconstructed sitemap is not disclosed.',
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
    `<h2>${escapeHtml('Discuss a similar facade-installation SEO and website project')}</h2>` +
      p(
        'If you engineer and install ventilated facades and need the website, content and search architecture to match that offering, tell us about the contracting work.',
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
  case_study_gallery_title: 'Ventilated Facade Systems and Installation',
  case_study_gallery_images: imageIds,
})

const buildData = (previewImageId: number, galleryIds: number[]) => ({
  title: 'VentFasad: SEO and Website Strategy for Facade Installation',
  case_study_long_title:
    'VentFasad — Keyword Research, Semantic Architecture, Content Management and Custom Website Design for Ventilated Facade Installation',
  slug: SLUG,
  generateSlug: false,
  _status: 'published' as const,
  featured: true,
  displayOrder: 12,
  duration: '1_years',

  layout: [
    {
      blockType: 'csPreview' as const,
      case_study_preview_title: 'Ventilated Facade Installation and Building-Envelope Contracting',
      case_study_preview_text: rt(
        p(
          'VentFasad is a facade-installation contractor working with ventilated facade systems, engineering, mounting components and building-envelope projects. Over approximately one year, Neolines combined keyword research, competitor analysis, a targeted semantic core, content mapping, SEO-oriented information architecture, custom facade-industry website design, and content management so those connected services could be found and understood by professional buyers.',
        ),
      ),
      case_study_preview_image: previewImageId,
    },

    titleBlock('Project Overview'),
    contentBlock(
      p(
        'VentFasad installs ventilated facade systems and delivers related building-envelope work: facade project planning and engineering, fabrication of mounting and fastening components, and cladding installation as an integrated contractor service on commercial and other buildings.',
        'This case is about the digital work beside that contracting business — not a primer on rainscreens, and not a claim that Neolines installed the facades. Named sites, employee counts and certifications are not disclosed.',
      ),
    ),

    titleBlock('Business Context'),
    contentBlock(
      p(
        'A specialized facade contractor has to show several connected capabilities at once: the visible cladding, the mounting subsystem, the engineering, and the installation. Construction companies, developers, architects, engineers and commercial-property stakeholders typically search those jobs separately. That is a sector observation, not a verified VentFasad customer list.',
        'The website had to distinguish those services without inventing a complaint the source does not record. No historic domain or previous CMS is named.',
      ),
    ),

    titleBlock('SEO Strategy'),
    contentBlock(
      p(
        'The documented SEO work is in-depth keyword research, competitor analysis, and a targeted semantic core covering high-, mid- and low-frequency queries around ventilated-facade installation. Search terms were grouped so content mapping could assign clusters to pages rather than dumping every query onto a contractor homepage.',
        'That map informed the information architecture, on-page headings, meta descriptions, internal linking and image alt text. The source does not publish a keyword count for VentFasad. The 2,000-term core belongs to the related AluMatrix engagement, not this record.',
      ),
    ),

    titleBlock('Content Management'),
    contentBlock(
      p(
        'Content planning kept each page attached to a real service or intent: installation, engineering, mounting, facade type. Unique technical copy described processes and installation practice, with keywords placed in headings, lists and alt attributes.',
        'Content management, in this engagement, is the discipline of keeping that map consistent after the site is designed — so the copy still matches what the contractor actually does. No article count or editorial calendar is published.',
      ),
    ),

    titleBlock('Website Design and Information Architecture'),
    contentBlock(
      p(
        'A custom website was designed for the facade industry, with intuitive navigation and a structure built for both SEO and usability. Design, content structure and search architecture were treated as one system: the navigation had to express the semantic map, not fight it.',
        'Theme, CMS, responsive-framework names and a reconstructed sitemap are not disclosed. No conversion-rate improvement is published for the design itself.',
      ),
    ),

    titleBlock('One-Year Collaboration'),
    contentBlock(
      p(
        'The working relationship lasted approximately one year. In that window the project combined SEO preparation, content management and website design. That duration is the cooperation period. It is not a dated campaign log, and it is not converted here into rankings, leads or revenue.',
        'The work is described as successful through that coherence — a contractor site that could present engineering, mounting and installation as related jobs — not through invented statistics. A Russian source passage that attributes “leading positions” and conversion growth without figures, and that even names AluMatrix in the VentFasad result, is not used as a metrics table.',
      ),
    ),

    titleBlock('Key Takeaways'),
    contentBlock(
      p(
        'Facade installation marketing fails when the site only shows finished buildings. Professional buyers also search for the subframe, the engineering and the contracting service. Keyword research, content mapping and website architecture have to be planned together so those jobs have destinations.',
        'Where the source is silent — traffic, rankings, CMS, named buildings — the correct public line is Not disclosed.',
      ),
    ),

    contentBlock(
      p(
        'Illustrative examples of ventilated facade applications, supporting structures, and completed building envelopes. These are not original photographs of documented VentFasad contracts.',
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
        'VentFasad plans and engineers facade projects, fabricates mounting and fastening components, and installs ventilated facade systems as building-envelope contracting.',
        'This is not a claim that the company manufactures aluminum composite panels. Factory size and fabrication volumes are not disclosed.',
      ),
    ),
    products: rt(
      p(
        'Ventilated facade installation, mounting and fastening components, and related cladding as an integrated contractor service. Panel brands and system names are not listed.',
      ),
    ),
    materials: rt(
      p(
        'Ventilated facade cladding and aluminum mounting subsystems are implied by the work. Exact panel cores, coatings and insulation types are not disclosed and are not guessed from illustrative photographs.',
      ),
    ),
    applications: rt(
      p(
        'Commercial and other building envelopes. Named buildings and project sizes are not listed.',
      ),
    ),
  },

  businessChallenge: {
    initialState: rt(
      p(
        'VentFasad already installed ventilated facades and related envelope work. The digital presentation had to catch up with that mix of engineering, mounting and installation so professional buyers could find the right job.',
      ),
    ),
    challenge: rt(
      p(
        'Connected search intents — system, mounting, engineering, installation — needed destinations without collapsing into one contractor slogan or overlapping thin pages.',
      ),
    ),
    goals: rt(
      ul([
        'Research keywords and competitors for ventilated-facade installation',
        'Build a targeted semantic core across high-, mid- and low-frequency queries',
        'Map content to services and intents',
        'Design an SEO-oriented information architecture and custom facade-industry website',
        'Manage content so pages stay aligned with actual contracting capabilities',
        'Report only source-backed outcomes',
      ]),
    ),
  },

  nicheSegmentation: [
    {
      name: 'Ventilated Facade Installation',
      description: rt(
        p(
          'On-site installation of rainscreen cladding as a contractor service. Methods and crew size are not disclosed.',
        ),
      ),
      marketingApproach: rt(
        p(
          'Give installation its own destination. A buyer searching for a crew is not the same visitor as one searching only for a mounting profile.',
        ),
      ),
    },
    {
      name: 'Facade Engineering and Project Planning',
      description: rt(
        p(
          'Planning and engineering of facade projects as part of the integrated offering. Calculations and software are not named.',
        ),
      ),
      marketingApproach: rt(
        p(
          'Speak to specifiers who need the system designed, not only installed.',
        ),
      ),
    },
    {
      name: 'Mounting and Fastening Components',
      description: rt(
        p(
          'Fabrication of mounting and fastening components that sit behind the visible panels. Catalogues are not published.',
        ),
      ),
      marketingApproach: rt(
        p(
          'Show the subframe. Do not pretend it is a panel factory.',
        ),
      ),
    },
    {
      name: 'Building-Envelope Contracting',
      description: rt(
        p(
          'Cladding and facade installation as an integrated service on commercial and other buildings. Named contracts are not listed.',
        ),
      ),
      marketingApproach: rt(
        p(
          'Keep the complete-envelope story at the company level, with service pages underneath.',
        ),
      ),
    },
  ],

  digitalEcosystem: rt(
    p(
      'The confirmed digital ecosystem is the custom corporate website, with SEO architecture, technical content, content management, and industry-specific design and navigation.',
      'Paid search, social programmes, CRM and the CMS name are not listed for this engagement.',
    ),
  ),
  websiteArchitecture: rt(
    p(
      'Pages were structured so navigation could distinguish installation, engineering, mounting and facade-system information, with internal linking and metadata supporting that map.',
      'Exact historic URLs and the CMS are not reconstructed.',
    ),
  ),
  semanticArchitecture: rt(
    p(
      'A targeted semantic core grouped high-, mid- and low-frequency queries around ventilated-facade installation, then mapped those clusters onto pages. Keyword volumes and a term count are not published for VentFasad.',
    ),
  ),

  marketingStrategy: {
    seoAndContentStrategy: rt(
      p(
        'The documented strategy is search- and content-led: keyword and competitor research, a semantic core, content mapping, SEO architecture, unique technical copy, and ongoing content management so pages stay attached to real contractor services.',
        'No article count is stated. Paid search is not part of this record.',
      ),
    ),
    leadGenMechanism: rt(
      p(
        'The site was meant to make installation, engineering and mounting findable, then allow contact. No form mix, conversion rate or lead volume is published.',
      ),
    ),
    paidAdvertising: [],
    socialMedia: [],
  },

  aiSearchOptimization: {
    brandAuthorityAndTrust: rt(
      p(
        'This project is described as SEO, content management and website design for a facade-installation contractor. It is not rewritten as an AI-search engagement.',
        'No ChatGPT ranking, Perplexity citation or AI Overview result is claimed, and none is documented.',
      ),
    ),
    entityAndGeoStructure: rt(
      p(
        'Ventilated facades, mounting subsystems, engineering and installation are treated as related entities in the information architecture. That topical model is useful for modern search in principle. It is not a measured GEO or AEO programme.',
      ),
    ),
  },

  implementationProcess: rt(
    p(
      'Confirmed shape of the work, without inventing dates: research keywords and competitors; build the semantic core; map content to pages; design the facade-industry site and navigation; prepare and manage technical content through the one-year collaboration.',
      'The sequence is the method. It is not a Gantt chart.',
    ),
  ),

  timeline: [
    {
      period: 'Phase 1',
      title: 'Keyword and competitor research',
      description: rt(
        p(
          'Analyse search demand for ventilated-facade installation and related contracting services. Competitor brands are not named.',
        ),
      ),
    },
    {
      period: 'Phase 2',
      title: 'Semantic core and content mapping',
      description: rt(
        p(
          'Build a targeted core across high-, mid- and low-frequency queries and assign clusters to installation, engineering, mounting and system pages.',
        ),
      ),
    },
    {
      period: 'Phase 3',
      title: 'Website architecture and custom design',
      description: rt(
        p(
          'Design an industry-specific site with intuitive navigation so the semantic map is usable. CMS and theme are not disclosed.',
        ),
      ),
    },
    {
      period: 'Phase 4',
      title: 'Content management through the year',
      description: rt(
        p(
          'Prepare technical copy and keep pages aligned with actual contractor services for approximately one year. No article count is published.',
        ),
      ),
    },
  ],

  resultsSummary: rt(
    p(
      'The documented outcome is structural: a one-year engagement that combined keyword research, a targeted semantic core, content mapping, SEO architecture, custom facade-industry design and content management for a ventilated-facade installation contractor.',
      'No traffic percentage, ranking table, lead count or conversion rate is published for VentFasad. Not disclosed. The work is presented as successful through that coherence, not through invented statistics.',
    ),
  ),

  metrics: [],
  projectsShowcase: [
    {
      projectName: 'Ventilated facade installation',
      description: rt(
        p(
          'Contractor installation of rainscreen cladding on commercial and other buildings. The gallery is illustrative and does not name contracts.',
        ),
      ),
    },
    {
      projectName: 'Mounting and fastening fabrication',
      description: rt(
        p(
          'Fabrication of the subframe components that sit behind the visible panels. Models are not listed.',
        ),
      ),
    },
    {
      projectName: 'Facade engineering and planning',
      description: rt(
        p(
          'Project planning and engineering as part of the integrated envelope service. Drawings are not reproduced here.',
        ),
      ),
    },
  ],

  expertInsight: rt(
    p(
      'The useful complexity here is a contractor whose buyers search for a system, a subframe, an engineering job and an installation crew. Those are related. They are not one query.',
      'SEO, content management and website design only work if they share that map. A custom facade-industry look does not replace architecture.',
      'Where the source is silent — rankings, CMS, named buildings — the correct public line is Not disclosed. This discussion is editorial. It is not a conversation with VentFasad.',
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
        'SEO research, semantic architecture, content management and custom website design for VentFasad — a contractor that plans, engineers and installs ventilated facade systems.',
      ),
    ),
  },

  primary_case_study_category: PRIMARY_CASE_STUDY_CATEGORY,
  case_study_categories: CASE_STUDY_CATEGORIES,

  meta: {
    title: 'VentFasad Case Study | Facade Installation SEO and Website Strategy',
    description:
      'Discover how Neolines supported VentFasad with keyword research, competitor analysis, SEO architecture, content management, and website design for ventilated facade installation.',
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
          metrics: 0,
          paidAds: 0,
          duration: '1_years',
          featured: true,
          displayOrder: 12,
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
        { slug: { like: 'ventfasad' } },
        { slug: { like: 'vent-fasad' } },
        { title: { like: 'VentFasad' } },
        { title: { like: 'Ventfasad' } },
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

  const data = buildData(previewImageId, galleryIds)
  const existing = duplicates.docs.find((doc) => doc.slug === SLUG) ?? duplicates.docs[0]

  if (existing && existing.slug !== SLUG && existing.slug !== 'ventfasad') {
    throw new Error(`Related VentFasad record exists with different slug: ${existing.id} ${existing.slug}`)
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
