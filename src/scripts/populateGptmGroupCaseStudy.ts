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
 * Creates or updates the GPTM GROUP Case Study.
 * Flagship facade manufacturer-contractor: engineering, component
 * production, material preparation, supply and turnkey installation.
 * Three-year collaboration, two Drupal redevelopments, contextual ads.
 * No invented metrics. Alubond/Crossbond named only as unverified
 * brief brands, not exclusive partnerships. Gallery is illustrative.
 * No site_categories. No client logo.
 */
const SLUG = 'gptm-group-facade-systems'
const IMAGE_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'assets')

const EXPERT = 'Maryan Polyak'
const EXPERT_ROLE = 'Manufacturing Digital Marketing & Web Development Expert'

const PRIMARY_CASE_STUDY_CATEGORY = 196
const CASE_STUDY_CATEGORIES = [
  196, 204, 197, 218, 200, 210, 239, 226, 237, 235, 311, 323, 326,
  274, 278, 290, 291,
  428, 429, 434, 419, 421, 417, 426, 425, 420, 712, 484, 751,
  526, 530, 528, 669, 670,
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
  filename: 'gptm-main-facade.jpg',
  alt: 'Large office tower with limestone ventilated stone on the lower floors and dark aluminum cassette panels above.',
  caption:
    'Illustrative mixed stone and aluminum ventilated facade on a substantial commercial building. Not a documented GPTM GROUP project photograph.',
}

const GALLERY_IMAGES: ImageSpec[] = [
  {
    filename: 'gptm-stone-facade.jpg',
    alt: 'Campus building fully clad in light limestone ventilated stone facade panels with a glass entrance.',
    caption:
      'Illustrative stone ventilated-facade application. Not a verified GPTM GROUP contract.',
  },
  {
    filename: 'gptm-workshop-components.jpg',
    alt: 'Facade workshop with stacked aluminum brackets, rails and cut mounting profiles on pallets and a workbench.',
    caption:
      'Illustrative workshop production of facade mounting components. Not a photograph of a GPTM GROUP factory.',
  },
  {
    filename: 'gptm-acp-subframe.jpg',
    alt: 'Corner detail of champagne aluminum composite cassettes with the aluminum subframe and insulation visible at an unfinished edge.',
    caption:
      'Illustrative relationship between aluminum composite cladding and its supporting structure. Not a GPTM GROUP shop drawing.',
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
    file: { name: image.filename, data, mimetype: 'image/jpeg', size: data.byteLength },
    overrideAccess: true,
    context: { disableRevalidate: true },
  })
  payload.logger.info(`created media ${media.id} ${image.filename}`)
  return media.id
}

const DISCUSSION: DiscussionEntry[] = [
  {
    author: 'Henrik Dahl',
    role: 'Technical SEO specialist',
    date: '2026-10-18',
    depth: 0,
    body: p(
      'Why does a facade manufacturer-contractor need a broader semantic core than a company that only installs cladding?',
    ),
  },
  expert(
    '2026-10-18',
    p(
      'Because buyers search across the whole cycle: engineering, mounting components, material cutting, ACP or stone cladding, supply, installation and a turnkey envelope. Those are related jobs. They are not one contractor homepage.',
      'The published source describes an extensive semantic core, competitor benchmarking and three years of content mapping onto services, technical specifications and a portfolio. A keyword count is not published for GPTM GROUP, so none is copied from AluMatrix.',
    ),
    1,
  ),
  {
    author: 'Elena Petrova',
    role: 'In-house manufacturing marketer',
    date: '2026-10-19',
    depth: 2,
    body: p(
      'How do you keep engineering, workshop and installation pages from competing?',
    ),
  },
  expert(
    '2026-10-19',
    p(
      'Map each cluster to the job. Engineering explains system design. Workshop pages explain brackets, rails and cutting. Material pages explain stone or ACP as cladding. Installation explains site work. The turnkey page holds the complete delivery.',
      'That is the SEO. It is also how you stop a large industrial site from becoming ten paraphrases of “we do facades.”',
    ),
    3,
  ),
  {
    author: 'Thomas Weber',
    role: 'Facade project engineer',
    date: '2026-10-20',
    depth: 0,
    body: p(
      'Why should workshop production and mounting components have their own place on the website?',
    ),
  },
  expert(
    '2026-10-20',
    p(
      'Because GPTM GROUP is not only a site crew. The project background is engineering, production of fastening components, workshop preparation, material cutting, supply and installation. A specifier buying a rainscreen is buying that cycle.',
      'If the site only shows finished buildings, the component query and the cutting query have nowhere to land. The workshop image in this gallery is illustrative. It is not a GPTM factory record.',
    ),
    1,
  ),
  {
    author: 'Anna Kovacs',
    role: 'Specification writer',
    date: '2026-10-21',
    depth: 2,
    body: p(
      'The brief names Alubond and Crossbond. Should those be product-line URLs?',
    ),
  },
  expert(
    '2026-10-21',
    p(
      'Not as exclusive brands. Those names come from the project background. They are not on the published GPTM source paragraph, and they are not treated here as authorised-dealer claims. Grosbond appears on a related Grosstek case, which is a different company.',
      'ACP and stone can still have destinations as material types. Named brands need a source, not a recollection alone.',
    ),
    3,
  ),
  {
    author: 'James Whitaker',
    role: 'Drupal developer',
    date: '2026-10-22',
    depth: 0,
    body: p(
      'Two Drupal redevelopments in three years. Why connect those rebuilds to SEO instead of treating them as visual redesigns?',
    ),
  },
  expert(
    '2026-10-22',
    p(
      'Because a facade company’s information architecture has to hold engineering, components, materials, installation and a portfolio. A visual skin on the wrong structure just makes the confusion prettier.',
      'The project background is two Drupal redevelopments during the collaboration. Dates, versions, modules and the reason for each rebuild are not disclosed. I will not invent a migration story.',
    ),
    1,
  ),
  {
    author: 'Clara Jensen',
    role: 'UX researcher',
    date: '2026-10-23',
    depth: 2,
    body: p(
      'Did both Drupal sites keep the same URL map?',
    ),
  },
  expert(
    '2026-10-23',
    p(
      'Not disclosed. What transfers is the principle: rebuild around the operating model, not around a new colour palette. Historic URLs are not reconstructed.',
    ),
    3,
  ),
  {
    author: 'Sophie Laurent',
    role: 'PPC specialist',
    date: '2026-10-24',
    depth: 0,
    body: p(
      'How should contextual advertising sit next to a three-year SEO programme?',
    ),
  },
  expert(
    '2026-10-24',
    p(
      'Organic search is the durable map of the cycle. Paid search can promote a component, a material, an installation or a turnkey job while that map is still accumulating.',
      'The project background includes contextual advertising. The published GPTM paragraph does not name the platform, budget or paid results. I will not borrow AluMatrix PPC percentages.',
    ),
    1,
  ),
  {
    author: 'Sophie Laurent',
    role: 'PPC specialist',
    date: '2026-10-25',
    depth: 2,
    body: p(
      'Would you send paid traffic to the homepage?',
    ),
  },
  expert(
    '2026-10-25',
    p(
      'To the page that matches the query. A bracket query belongs on components. A stone-cladding query belongs on materials. A turnkey query belongs on complete delivery. Historic ads are not reconstructed.',
    ),
    3,
  ),
  {
    author: 'Pavel Orlov',
    role: 'Construction-sector marketing manager',
    date: '2026-10-26',
    depth: 0,
    body: p(
      'The source mentions a portfolio. Why does that matter more here than on a small installation site?',
    ),
  },
  expert(
    '2026-10-26',
    p(
      'A company that engineers, fabricates and installs at different building scales needs proof of that range. Portfolio pages let a professional buyer see envelope type, material and scale without a sales call.',
      'No project names, cities or a job count are published. The gallery is illustrative architecture, not a GPTM album. I will not invent a roster.',
    ),
    1,
  ),
  {
    author: 'Daniel Okonkwo',
    role: 'B2B demand generation lead',
    date: '2026-10-27',
    depth: 0,
    body: p(
      'The collaboration spanned about three years. Did SEO, Drupal and ads run every month of those years?',
    ),
  },
  expert(
    '2026-10-27',
    p(
      'The source says an end-to-end SEO strategy over three years. The project background adds two Drupal redevelopments and contextual advertising at different stages. That is a long-term collaboration, not a verified uninterrupted campaign log.',
    ),
    1,
  ),
  {
    author: 'Lukas Schneider',
    role: 'Technical SEO specialist',
    date: '2026-10-28',
    depth: 0,
    body: p(
      'Has any of this been measured in AI search?',
    ),
  },
  expert(
    '2026-10-28',
    p(
      'Not in this record. No ChatGPT, Perplexity or AI Overview result is documented.',
      'A topical model that connects engineering, components, stone, ACP, supply and installation is useful groundwork. It is not a measured GEO programme.',
    ),
    1,
  ),
  {
    author: 'Martin Novak',
    role: 'In-house manufacturing marketer',
    date: '2026-10-29',
    depth: 2,
    body: p(
      'The source talks about ranking across search engines. Should this case publish that as a result?',
    ),
  },
  expert(
    '2026-10-29',
    p(
      'No. There is no ranking table or traffic percentage for GPTM GROUP. The success that can be stated is the scope: three years of semantic SEO, two Drupal rebuilds, content for a complex operating model, and paid search beside that work. This discussion is editorial. It is not a testimonial from GPTM GROUP.',
    ),
    3,
  ),
]

const faqBlock = () => ({
  blockType: 'csFAQ' as const,
  case_study_faq_title: 'Frequently Asked Questions About GPTM GROUP',
  items: [
    {
      question: 'What does an integrated ventilated facade system include?',
      answer: rt(
        p(
          'In this record, an integrated system can include facade engineering and design, production of mounting and fastening components, workshop cutting and preparation, supply of system elements, and installation of the cladding — including stone and aluminum composite panels as material types.',
          'That is the operating model. It is not a claim that every job included every stage, or that GPTM manufactures every cladding brand in-house. Named buildings and specifications are not disclosed.',
        ),
      ),
    },
    {
      question: 'What is the role of mounting and fastening components in facade construction?',
      answer: rt(
        p(
          'The visible panel only performs if the subframe is right. Rails, brackets and fasteners create the ventilation gap, carry load and absorb movement. GPTM’s documented manufacturing side includes those components, not only site installation.',
          'Load tables and part numbers are not published.',
        ),
      ),
    },
    {
      question: 'What is the difference between facade material supply and turnkey facade contracting?',
      answer: rt(
        p(
          'Supply delivers panels or components. Turnkey contracting connects engineering, workshop preparation, supply and installation into one envelope. GPTM GROUP is described as the second kind of business: design, manufacturing and installation of ventilated facades, with a portfolio of completed work.',
          'A project count is not published. Alubond and Crossbond are background brand names from the brief, not confirmed exclusive lines.',
        ),
      ),
    },
    {
      question: 'How can SEO help a manufacturer and installer of facade systems reach B2B buyers?',
      answer: rt(
        p(
          'Architects, contractors and developers search by stage: a stone facade, ACP, a mounting profile, engineering, or a turnkey envelope. Keyword research, competitor analysis and an extensive semantic core, mapped onto services, technical pages and a portfolio, give those intents destinations.',
          'No ranking table is published for GPTM GROUP.',
        ),
      ),
    },
    {
      question: 'Why does a large industrial website need detailed keyword mapping and structured content?',
      answer: rt(
        p(
          'A broad cycle is easy to flatten into one “facades” page that ranks for nothing specific. Mapping assigns clusters to engineering, components, materials, installation and portfolio so Drupal can hold the operating model through two redevelopments.',
          'Historic sitemaps and Drupal versions are not disclosed.',
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
    `<h2>${escapeHtml('Discuss a similar facade-systems SEO and Drupal project')}</h2>` +
      p(
        'If you engineer, fabricate and install ventilated facades and need the website, search architecture and paid search to match that full cycle, tell us about the production.',
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
  case_study_gallery_title: 'Facade Systems, Components, and Building Projects',
  case_study_gallery_images: imageIds,
})

const buildData = (previewImageId: number, galleryIds: number[]) => ({
  title: 'GPTM GROUP: SEO and Digital Marketing for Facade Systems',
  case_study_long_title:
    'GPTM GROUP — Three-Year SEO, Two Drupal Redevelopments and Contextual Advertising for Facade Engineering, Component Production and Turnkey Installation',
  slug: SLUG,
  generateSlug: false,
  _status: 'published' as const,
  featured: true,
  displayOrder: 13,
  duration: '3_years',

  layout: [
    {
      blockType: 'csPreview' as const,
      case_study_preview_title: 'Facade Engineering, Component Production, and Turnkey Installation',
      case_study_preview_text: rt(
        p(
          'GPTM GROUP designs, manufactures and installs ventilated facade systems as an integrated cycle: engineering, production of mounting components, workshop cutting and preparation, supply, and turnkey cladding — including stone and aluminum composite panels. Over approximately three years Neolines combined an extensive semantic SEO programme, two Drupal website redevelopments, technical content and contextual advertising so that operating model could be found and understood by professional buyers.',
        ),
      ),
      case_study_preview_image: previewImageId,
    },

    titleBlock('Project Overview'),
    contentBlock(
      p(
        'GPTM GROUP is a substantial facade-systems business, not only a site-installation crew. The published source describes design, manufacturing and installation of ventilated facades, with a user-centric site structure for services, technical specifications and a portfolio.',
        'The project background widens that cycle: facade engineering, production of fastening components, workshop preparation, material cutting, project-specific supply, and turnkey contracting on buildings of different scales. Stone cladding and aluminum composite panels are named as material types. Alubond and Crossbond appear in that background as ACP brand names; they are not confirmed on the published source paragraph and are not treated as exclusive partnerships.',
      ),
    ),

    titleBlock('Business Scope'),
    contentBlock(
      p(
        'The marketing story has to follow the shop floor and the site, not only the finished elevation:'
      ) +
        ul([
          'Engineering and design of facade systems',
          'Production of mounting and fastening components',
          'Workshop cutting, preparation and project-specific kitting',
          'Supply of system elements and cladding materials, including stone and ACP',
          'Installation and turnkey building-envelope contracting',
        ]) +
        p(
          'Neolines did not fabricate brackets or install facades. GPTM GROUP did. Named buildings, factory capacity and certifications are not disclosed.',
        ),
    ),

    titleBlock('Marketing Challenge'),
    contentBlock(
      p(
        'A buyer may need a stone rainscreen, an ACP cassette, a mounting profile, an engineering package, a kitted delivery or a turnkey crew. Those intents are connected. They are not the same page.',
        'The website had to make the cycle understandable without flattening it into one cladding slogan, and it had to hold a substantial portfolio so professional buyers could see scale. No historic domain or previous CMS besides Drupal is named.',
      ),
    ),

    titleBlock('SEO Strategy'),
    contentBlock(
      p(
        'The published work is an end-to-end SEO strategy over three years: detailed keyword analysis, competitor benchmarking, an extensive semantic core, precise content mapping, and on-page optimisation. The site structure guided visitors through services, technical specifications and portfolio sections. Custom technical content addressed industry terms and user queries.',
        'Semantic research here is a planning framework for a large industrial site: materials, systems, components, engineering, installation and completed work. A keyword count is not published for GPTM GROUP. Rankings are mentioned qualitatively on the source page and are not converted into a table.',
      ),
    ),

    titleBlock('Website Redevelopment'),
    contentBlock(
      p(
        'The project background includes two Drupal website redevelopment projects during the collaboration. Drupal is the confirmed platform for those rebuilds. Versions, themes, modules, dates and the specific reason for each redesign are not disclosed.',
        'The point of rebuilding twice is not a new skin. A facade manufacturer-contractor needs information architecture that can hold engineering, workshop production, materials, installation and a portfolio as the offering grows. Each Drupal stage had to serve that operating model, not only a visual update.',
      ),
    ),

    titleBlock('Contextual Advertising'),
    contentBlock(
      p(
        'Contextual advertising sat beside the longer organic programme. Paid search can put a component, a cladding material, an installation or a turnkey envelope in front of a buyer who is searching now, while SEO accumulates the durable map.',
        'The ad platform, campaign structure, budgets and paid results are not in the published GPTM paragraph. Those figures are not disclosed and are not borrowed from related facade cases.',
      ),
    ),

    titleBlock('Portfolio and Technical Credibility'),
    contentBlock(
      p(
        'A company that delivers facade projects at different scales needs a portfolio that professional buyers can actually use: envelope type, material, and the kind of building — not a slideshow of unnamed glass towers.',
        'The published source names portfolio sections as part of the site architecture. Project names, cities and a job count are not listed. The photographs in this Case Study are illustrative. They are not a GPTM album.',
      ),
    ),

    titleBlock('Key Takeaways'),
    contentBlock(
      p(
        'Industrial marketing works when the website matches the real operating model: engineering, component production, material preparation, supply and installation. Keyword mapping, Drupal architecture, content and paid search only pay off if they follow that cycle.',
        'A three-year collaboration can include more than one website generation. Rebuilds should extend the semantic map, not reset it. Where the source is silent — traffic, rankings, brand-dealer status, named sites — the correct public line is Not disclosed.',
      ),
    ),

    contentBlock(
      p(
        'An illustrative overview of facade materials, mounting components and architectural applications associated with integrated facade delivery. These are not original photographs of documented GPTM GROUP products, workshops or contracts.',
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
        'GPTM GROUP designs facade systems, manufactures mounting and fastening components, prepares and cuts materials in a workshop, supplies project-specific kits, and installs ventilated facades as turnkey contracting.',
        'This is not a claim that every cladding sheet was produced in-house. Factory size is not disclosed.',
      ),
    ),
    products: rt(
      p(
        'Ventilated facade systems; mounting rails, brackets and fasteners; stone cladding and aluminum composite panels as material types used in envelope projects. Alubond and Crossbond are brief-named ACP brands, not confirmed exclusive lines.',
      ),
    ),
    materials: rt(
      p(
        'Stone and aluminum composite panels are named in the project background. Exact stone types, ACP cores and coatings are not disclosed and are not guessed from illustrative photographs.',
      ),
    ),
    applications: rt(
      p(
        'Ventilated facades on buildings of different types and scales. Named sites and a portfolio quantity are not published.',
      ),
    ),
  },

  businessChallenge: {
    initialState: rt(
      p(
        'GPTM GROUP already combined engineering, component production and installation. The digital presence had to catch up with that full cycle and remain usable across approximately three years and two Drupal generations.',
      ),
    ),
    challenge: rt(
      p(
        'Materials, systems, components, engineering, supply, installation and portfolio had to stay findable as distinct intents without collapsing into one cladding homepage.',
      ),
    ),
    goals: rt(
      ul([
        'Build an extensive semantic core and map it onto services, technical pages and a portfolio',
        'Represent the full cycle: engineering, workshop, materials, supply and installation',
        'Redevelop the Drupal site twice around that operating model',
        'Support the organic programme with contextual advertising',
        'Report only source-backed outcomes',
      ]),
    ),
  },

  nicheSegmentation: [
    {
      name: 'Facade Engineering and System Design',
      description: rt(
        p('Engineering and design of ventilated facade systems. Calculations and software are not named.'),
      ),
      marketingApproach: rt(
        p('Give specifiers a destination for the system, not only for the finished wall.'),
      ),
    },
    {
      name: 'Mounting Components and Workshop Production',
      description: rt(
        p('Production of fastening components, cutting and project-specific preparation. Catalogues are not published.'),
      ),
      marketingApproach: rt(
        p('Show the workshop. Do not hide fabrication behind installation photography.'),
      ),
    },
    {
      name: 'Stone and Aluminum Composite Cladding',
      description: rt(
        p(
          'Stone cladding and ACP as envelope materials. Brand names from the brief are not treated as exclusive partnerships.',
        ),
      ),
      marketingApproach: rt(
        p('Separate material intents. A stone query is not an ACP query.'),
      ),
    },
    {
      name: 'Turnkey Installation and Portfolio',
      description: rt(
        p('Installation and complete envelope contracting, presented with portfolio sections. Named jobs are not listed.'),
      ),
      marketingApproach: rt(
        p('Keep turnkey at the company level, with service and material pages underneath.'),
      ),
    },
  ],

  digitalEcosystem: rt(
    p(
      'The confirmed digital ecosystem is the Drupal corporate website — two redevelopment generations — with SEO architecture, technical content, a portfolio, and contextual advertising.',
      'Drupal versions, named ad platforms, social programmes and CRM are not disclosed.',
    ),
  ),
  websiteArchitecture: rt(
    p(
      'The published architecture guided visitors through services, technical specifications and portfolio sections, so engineering, components, materials and installation could sit as related destinations.',
      'Exact historic URLs and both Drupal sitemaps are not reconstructed.',
    ),
  ),
  semanticArchitecture: rt(
    p(
      'An extensive semantic core, built from keyword and competitor analysis, mapped commercial and technical queries onto those destinations. Keyword volumes and a term count are not published for GPTM GROUP.',
    ),
  ),

  marketingStrategy: {
    seoAndContentStrategy: rt(
      p(
        'The documented strategy is a three-year search-led programme: keyword research, competitor benchmarking, an extensive semantic core, content mapping, on-page optimisation, and custom technical content, carried across two Drupal redevelopments.',
        'No article count is stated.',
      ),
    ),
    leadGenMechanism: rt(
      p(
        'The site and paid search were meant to make specific stages of the cycle findable, then allow contact. No form mix or lead volume is published.',
      ),
    ),
    paidAdvertising: [
      {
        channel: 'other' as const,
        strategy: rt(
          p(
            'Contextual advertising / paid search promoting relevant facade products and services alongside the organic programme.',
            'The platform is not named.',
          ),
        ),
        campaignStructure: rt(
          p('Not disclosed. Historic campaign structure is not in the published GPTM source.'),
        ),
        results: rt(
          p('Paid-search results, budgets and conversion rates are not published for GPTM GROUP. Not disclosed.'),
        ),
      },
    ],
    socialMedia: [],
  },

  aiSearchOptimization: {
    brandAuthorityAndTrust: rt(
      p(
        'This project is described as long-term SEO, Drupal redevelopment and contextual advertising for a facade manufacturer-contractor. It is not rewritten as an AI-search engagement.',
        'No ChatGPT, Perplexity or AI Overview result is claimed.',
      ),
    ),
    entityAndGeoStructure: rt(
      p(
        'Engineering, components, stone, ACP, supply and installation are treated as related entities. That topical model is useful for modern search in principle. It is not a measured GEO programme.',
      ),
    ),
  },

  implementationProcess: rt(
    p(
      'Confirmed shape of the work, without inventing dates: understand the full facade cycle; research keywords and competitors; build the semantic core and map it; develop and later redevelop the Drupal site around that map; prepare technical content; run contextual advertising alongside organic search over approximately three years.',
      'The sequence is the method. The two Drupal rebuilds are stages, not dated releases.',
    ),
  ),

  timeline: [
    {
      period: 'Phase 1',
      title: 'Map the operating model',
      description: rt(
        p('Engineering, component production, cutting and kitting, materials, supply, installation and portfolio.'),
      ),
    },
    {
      period: 'Phase 2',
      title: 'Keyword, competitor and semantic research',
      description: rt(
        p('Build an extensive core and map commercial and technical queries to pages. Competitor brands are not named.'),
      ),
    },
    {
      period: 'Phase 3',
      title: 'Drupal architecture, content and first redevelopment',
      description: rt(
        p('Structure services, technical specifications and portfolio on Drupal. Version and theme are not disclosed.'),
      ),
    },
    {
      period: 'Phase 4',
      title: 'Second Drupal redevelopment, ongoing SEO and paid search',
      description: rt(
        p(
          'A second Drupal generation during the three-year collaboration, with continued organic work and contextual advertising. Uninterrupted monthly activity is not separately verified.',
        ),
      ),
    },
  ],

  resultsSummary: rt(
    p(
      'The documented outcome is a three-year industrial marketing programme for a facade manufacturer-contractor: an extensive semantic core, content mapped to a complex operating model, two Drupal redevelopments, a portfolio architecture, and contextual advertising.',
      'No traffic percentage, ranking table, lead count or paid-search result is published for GPTM GROUP. Not disclosed. Success is stated as the scope and coherence of that work, not as invented statistics.',
    ),
  ),

  metrics: [
    {
      value: '3 years',
      label: 'Published collaboration span',
      description: rt(
        p(
          'The source describes an SEO strategy over three years. Two Drupal redevelopments and contextual advertising are part of the project background. This is relationship duration, not a verified uninterrupted campaign log.',
        ),
      ),
    },
    {
      value: '2',
      label: 'Drupal website redevelopments',
      description: rt(
        p(
          'Two Drupal rebuilds during the collaboration, according to the project background. Versions, dates and the reason for each redesign are not disclosed.',
        ),
      ),
    },
    {
      value: 'Full cycle',
      label: 'Engineering through turnkey installation',
      description: rt(
        p(
          'The offering that had to be represented: design, component production, workshop preparation, materials, supply and installation. Not a traffic figure.',
        ),
      ),
    },
  ],

  projectsShowcase: [
    {
      projectName: 'Engineering and system design',
      description: rt(
        p('Facade-system engineering as the start of the cycle. Drawings are not reproduced.'),
      ),
    },
    {
      projectName: 'Component production and material preparation',
      description: rt(
        p('Workshop fabrication of mounting components, cutting and kitting. The workshop image is illustrative.'),
      ),
    },
    {
      projectName: 'Turnkey ventilated facades',
      description: rt(
        p('Installation and complete envelope contracting in stone and ACP as material types. Named sites are not listed.'),
      ),
    },
  ],

  expertInsight: rt(
    p(
      'The useful complexity is not “ventilated facades” as a slogan. It is a manufacturer-contractor whose buyers search for engineering, a bracket, a stone wall, an ACP cassette, a kit and a crew.',
      'Three years of SEO only work if Drupal holds that map. Two rebuilds should refine it. Paid search can fill the gaps without replacing it.',
      'Where the source is silent — rankings, brand-dealer status, named buildings — the correct public line is Not disclosed. This discussion is editorial. It is not a conversation with GPTM GROUP.',
    ),
  ),

  clientTestimonial: { quote: null, author: null, position: null, company: null },

  hero: {
    type: 'lowImpact' as const,
    richText: rtHero(
      p(
        'Three-year SEO, two Drupal redevelopments and contextual advertising for GPTM GROUP — a facade business that engineers systems, produces mounting components, prepares materials and installs envelopes under one contract.',
      ),
    ),
  },

  primary_case_study_category: PRIMARY_CASE_STUDY_CATEGORY,
  case_study_categories: CASE_STUDY_CATEGORIES,

  meta: {
    title: 'GPTM GROUP Case Study | Facade Systems SEO and Drupal',
    description:
      'Explore how Neolines supported GPTM GROUP through long-term SEO, Drupal website redevelopment, and contextual advertising for facade systems manufacturing and installation.',
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
          duration: '3_years',
          featured: true,
          displayOrder: 13,
          galleryImages: GALLERY_IMAGES.length,
          metrics: 3,
          paidAds: 1,
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
        { slug: { like: 'gptm' } },
        { title: { like: 'GPTM' } },
      ],
    },
    limit: 5,
    depth: 0,
    overrideAccess: true,
    select: { id: true, slug: true, title: true },
  })

  const previewImageId = await upsertMedia(payload, PREVIEW_IMAGE)
  const galleryIds: number[] = []
  for (const image of GALLERY_IMAGES) galleryIds.push(await upsertMedia(payload, image))

  const data = buildData(previewImageId, galleryIds)
  const existing = duplicates.docs.find((doc) => doc.slug === SLUG) ?? duplicates.docs[0]

  if (existing && existing.slug !== SLUG && existing.slug !== 'gptm-group') {
    throw new Error(`Related GPTM record exists with different slug: ${existing.id} ${existing.slug}`)
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
