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
 * Creates or updates the Grosstek Case Study.
 * Large-scale ACP manufacturer with in-house lines and product brands
 * Grosbond and Konstruktor — not a distributor that only cuts or installs.
 * ~2 years: Drupal site, IA, visual design, SEO, PPC.
 * Metrics are source-reported from the published Neolines Grosstek page.
 * Not independently re-audited. Gallery/hero images are illustrative.
 * Authentic Grosstek logo from the source case page. No generated mark.
 * No site_categories.
 */
const SLUG = 'grosstek-aluminum-composite-panels'
const IMAGE_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'assets')

const EXPERT = 'Maryan Polyak'
const EXPERT_ROLE = 'Manufacturing Digital Marketing & Web Development Expert'

const PRIMARY_CASE_STUDY_CATEGORY = 196
const CASE_STUDY_CATEGORIES = [
  196, 204, 197, 218, 200, 210,
  239, 226, 237, 235,
  311, 323, 326,
  274, 278, 290, 291, 293,
  418, 419, 434, 429, 428,
  711, 1086,
  421, 417, 425, 426, 420, 712,
  484, 751, 669, 670,
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
  filename: 'grosstek-commercial-tower.jpg',
  alt: 'Large contemporary commercial tower with a champagne and graphite aluminum composite cassette facade.',
  caption:
    'Illustrative commercial building with an aluminum composite ventilated facade. Not a documented Grosstek project photograph.',
}

const MAIN_IMAGE: ImageSpec = {
  filename: 'grosstek-panel-production.jpg',
  alt: 'Aluminum composite panel production hall with a coil-coating line and stacks of finished facade panels.',
  caption:
    'Illustrative ACP manufacturing environment. Not a verified photograph of a Grosstek factory.',
}

const GALLERY_IMAGES: ImageSpec[] = [
  {
    filename: 'grosstek-coating-line.jpg',
    alt: 'Coil-coating and finishing equipment processing aluminum composite sheet on an industrial production line.',
    caption:
      'Illustrative panel coating and finishing. Not a photograph of Grosstek production equipment.',
  },
  {
    filename: 'grosstek-acp-substructure.jpg',
    alt: 'Champagne aluminum composite cassettes with aluminum rails, brackets and insulation visible at an unfinished bay.',
    caption:
      'Illustrative relationship between ACP cladding and its supporting substructure. Not a Grosstek shop drawing.',
  },
  {
    filename: 'grosstek-retail-facade.jpg',
    alt: 'Large modern retail building combining glass curtain wall and silver-grey aluminum composite cassette cladding.',
    caption:
      'Illustrative commercial and retail facade using glass and aluminum composite panels. Not a named Grosstek contract.',
  },
]

const LOGO_IMAGE: ImageSpec = {
  filename: 'grosstek-logo-original.jpg',
  alt: 'Grosstek logo: GROSSTEK, Qualität und Zuverlässigkeit.',
  caption:
    'Authentic Grosstek mark from the published source case study. Not a generated or redrawn logo.',
}

const STRUCTURE_IMAGE: ImageSpec = {
  filename: 'grosstek-website-structure.jpg',
  alt: 'Grosstek website information architecture diagram with Company, Ventilated Facades, Grosbond, Konstruktor, Facade systems, Production, Products, Objects and Press Center hubs feeding section interfaces and the main page.',
  caption:
    'Documented Grosstek website structure from the project: eight content hubs and a Press Center assembled through section interfaces into the main page.',
}

const mimeFromName = (filename: string) => {
  if (filename.endsWith('.png')) return 'image/png'
  if (filename.endsWith('.webp')) return 'image/webp'
  return 'image/jpeg'
}

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
    file: { name: image.filename, data, mimetype: mimeFromName(image.filename), size: data.byteLength },
    overrideAccess: true,
    context: { disableRevalidate: true },
  })
  payload.logger.info(`created media ${media.id} ${image.filename}`)
  return media.id
}

const sourceMetric = (value: string, label: string, detail: string) => ({
  value,
  label,
  description: rt(
    p(
      `${detail} Published on the source Grosstek case study for the two-year collaboration window. Not independently re-audited in this project. No baseline dates or attribution model are disclosed.`,
    ),
  ),
})

const DISCUSSION: DiscussionEntry[] = [
  {
    author: 'Henrik Dahl',
    role: 'Technical SEO specialist',
    date: '2026-10-13',
    depth: 0,
    body: p(
      'Why does an ACP manufacturer need a different site architecture from a company that only installs cladding?',
    ),
  },
  expert(
    '2026-10-13',
    p(
      'Because Grosstek is documented as a large-scale manufacturer and installer, with in-house production and named product lines — Grosbond and Konstruktor — not as a trader that buys finished sheets and cuts them to size.',
      'Buyers search for a panel brand, a production process, a ventilated facade, a turnkey envelope or wholesale supply. The source mapped a semantic core onto those jobs, including clusters such as Grosbond panel technology and industrial facade systems. A contractor homepage cannot hold that.',
    ),
    1,
  ),
  {
    author: 'Elena Petrova',
    role: 'In-house manufacturing marketer',
    date: '2026-10-14',
    depth: 2,
    body: p(
      'Should stone and glass sit on the same product pages as Grosbond?',
    ),
  },
  expert(
    '2026-10-14',
    p(
      'No. Grosstek manufactures aluminum composite panels. Stone and glass appear in this case as associated architectural applications in a wider facade portfolio, not as additional in-house panel brands. Mixing them into Grosbond copy is how you overstate the factory.',
    ),
    3,
  ),
  {
    author: 'Thomas Weber',
    role: 'Facade project engineer',
    date: '2026-10-15',
    depth: 0,
    body: p(
      'The source lists thermosetting, chemical synthesis, painting and quality checks. How much of that factory sequence can we publish as fact?',
    ),
  },
  expert(
    '2026-10-15',
    p(
      'Those named stages are the documented production-process outline on the Drupal site: from thermosetting and chemical synthesis through painting and final quality checks. They are a content-structure fact. They are not a licence to invent line speeds, chemistry or ISO numbers.',
      'The manufacturing photographs in this case are illustrative. They are not a Grosstek plant tour.',
    ),
    1,
  ),
  {
    author: 'Anna Kovacs',
    role: 'Specification writer',
    date: '2026-10-16',
    depth: 2,
    body: p(
      'Grosbond and Konstruktor had pages for application, processing, storage and certifications. Can we quote those certificates?',
    ),
  },
  expert(
    '2026-10-16',
    p(
      'We can say those sections existed. We cannot invent the certificate names, fire ratings or test reports. The source names the information architecture, not the documents inside it.',
    ),
    3,
  ),
  {
    author: 'James Whitaker',
    role: 'Drupal developer',
    date: '2026-10-17',
    depth: 0,
    body: p(
      'The site was built on Drupal. Why does that matter for a manufacturing case?',
    ),
  },
  expert(
    '2026-10-17',
    p(
      'Because a complex manufacturer needs a CMS that can hold product lines, production, ventilated-facade applications, a project portfolio, a press center and inquiry paths without collapsing into a brochure. Drupal is the confirmed platform. Theme names and module lists are not reconstructed.',
      'The published design work is a new site with a warm palette, professional imagery and an interface meant to convey quality. The authentic Grosstek mark from the source case page is used here. No mark was generated, and a separate board-approval file is not claimed.',
    ),
    1,
  ),
  {
    author: 'Clara Jensen',
    role: 'UX researcher',
    date: '2026-10-18',
    depth: 2,
    body: p(
      'The brief mentions detailed work with company management. How far can that go on the page?',
    ),
  },
  expert(
    '2026-10-18',
    p(
      'As a qualitative description of the collaboration: website structure and design were discussed in depth with management and managers responsible for different areas — product lines, manufacturing, applications, documentation, portfolio and inquiries.',
      'Names, meeting dates, attendee counts and a board-approval ritual are not supplied, so they are not invented.',
    ),
    3,
  ),
  {
    author: 'Sophie Laurent',
    role: 'PPC specialist',
    date: '2026-10-19',
    depth: 0,
    body: p(
      'How should the PPC structure sit next to the two-year SEO programme?',
    ),
  },
  expert(
    '2026-10-19',
    p(
      'The source describes about ten targeted ad groups — industrial facade systems, composite-panel wholesale, turnkey facade installations — with more than fifty ads and landing pages aligned to the copy.',
      'The platform, budgets and conversion definitions are not named. The PPC percentages below are the published two-year report, kept separate from the organic totals.',
    ),
    1,
  ),
  {
    author: 'Pavel Orlov',
    role: 'Construction-sector marketing manager',
    date: '2026-10-20',
    depth: 0,
    body: p(
      'The two-year report lists +55% organic traffic and +1,500 keywords. Are those independently verified here?',
    ),
  },
  expert(
    '2026-10-20',
    p(
      'No. They are reproduced from the published Grosstek source case study for the two-year window. They are not a new Search Console export, and they are not copied from the AluMatrix table, which used different figures.',
      'Organic traffic growth and organic-session growth are listed as separate rows because the source lists them separately. The 1,500 figure is an increase in keyword count, not a percentage.',
    ),
    1,
  ),
  {
    author: 'Daniel Okonkwo',
    role: 'B2B demand generation lead',
    date: '2026-10-21',
    depth: 2,
    body: p(
      'Can we say SEO caused every one of those lifts?',
    ),
  },
  expert(
    '2026-10-21',
    p(
      'The source presents them as SEO and PPC campaign results for the two-year summary. It does not publish an attribution model. I will not add one.',
    ),
    3,
  ),
  {
    author: 'Lukas Schneider',
    role: 'Technical SEO specialist',
    date: '2026-10-22',
    depth: 0,
    body: p(
      'Has any of this been measured in AI search?',
    ),
  },
  expert(
    '2026-10-22',
    p(
      'Not in this record. Schema markup for Product and Service pages is documented. That is useful groundwork. It is not a ChatGPT, Perplexity or AI Overview result. This discussion is editorial. It is not a conversation with Grosstek.',
    ),
    1,
  ),
]

const faqBlock = () => ({
  blockType: 'csFAQ' as const,
  case_study_faq_title: 'Frequently Asked Questions About Grosstek',
  items: [
    {
      question: 'What distinguishes a manufacturer of aluminum composite panels from a distributor?',
      answer: rt(
        p(
          'A manufacturer runs production — coating, finishing and quality inspection — and owns product lines. A distributor buys finished sheets and may cut or install them. Grosstek is documented as a large-scale manufacturer and installer of aluminum composite facade panels, with in-house production and the Grosbond and Konstruktor lines.',
          'Factory capacity, plant locations and market share are not disclosed.',
        ),
      ),
    },
    {
      question: 'What are Grosbond and Konstruktor?',
      answer: rt(
        p(
          'They are Grosstek product-line brands. The published website architecture gave each dedicated sections on application, processing, storage and certifications.',
          'Exact specifications, certificate numbers and the difference between the two lines are not published in the source paragraph, so they are not invented here.',
        ),
      ),
    },
    {
      question: 'How are aluminum composite panels used in contemporary architectural facades?',
      answer: rt(
        p(
          'ACP is used as rainscreen cladding on commercial, retail and other large buildings, typically as cassettes on a ventilated subframe. Grosstek’s documented scope includes manufacturing those panels and related facade engineering, mounting systems and installation where applicable.',
          'Natural stone and glass appear in this case as associated architectural applications, not as Grosstek-manufactured panel brands. Named projects are not listed.',
        ),
      ),
    },
    {
      question: 'Why do facade projects require suitable substructures and fastening systems?',
      answer: rt(
        p(
          'The visible panel only performs if the subframe carries load, creates the ventilation gap and matches the cassette format. Grosstek’s documented offering includes mounting systems, fastening components and system compatibility alongside panel production.',
          'Load tables and part numbers are not published.',
        ),
      ),
    },
    {
      question: 'What did the approximately two-year collaboration involve, including SEO and contextual advertising?',
      answer: rt(
        p(
          'The published work is SEO (keyword and competitor research, a semantic core, Drupal information architecture, technical content, meta tags and schema), a new website design, and PPC structured as about ten ad groups with more than fifty ads and aligned landing pages. Structure and design were discussed in depth with company management. The authentic Grosstek mark from the source case page is shown in this record. A duration log is not separately documented.',
          'The two-year SEO and PPC percentages on this page are source-reported. They are not an independent audit.',
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
    `<h2>${escapeHtml('Discuss a similar manufacturing SEO and Drupal project')}</h2>` +
      p(
        'If you manufacture aluminum composite panels or a similarly complex industrial product line and need the website, search architecture and paid search to match the factory, tell us about the production.',
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
  case_study_gallery_title: 'Manufacturing, Facade Systems, and Architectural Applications',
  case_study_gallery_images: imageIds,
})

const buildData = (
  previewImageId: number,
  mainImageId: number,
  galleryIds: number[],
  logoId: number,
  structureImageId: number,
) => ({
  title: 'Grosstek: Digital Marketing and SEO for an ACP Manufacturer',
  case_study_long_title:
    'Grosstek — Two-Year SEO, Drupal Website Architecture and Contextual Advertising for In-House Aluminum Composite Panel Manufacturing',
  slug: SLUG,
  generateSlug: false,
  _status: 'published' as const,
  featured: true,
  displayOrder: 15,
  duration: '2_years',
  company_logo: logoId,

  layout: [
    {
      blockType: 'csPreview' as const,
      case_study_preview_title: 'In-House Aluminum Composite Panel Manufacturing',
      case_study_preview_text: rt(
        p(
          'Grosstek is a large-scale manufacturer and installer of aluminum composite facade panels, with its own production lines and product brands Grosbond and Konstruktor — not a distributor that only buys finished sheets and cuts them to size. Over approximately two years Neolines combined Drupal website architecture, visual design, SEO and contextual advertising, working through the product lines, manufacturing information, applications, documentation, portfolio and inquiry paths with company management.',
        ),
      ),
      case_study_preview_image: previewImageId,
    },

    titleBlock('Project Overview'),
    contentBlock(
      p(
        'The published source describes Grosstek as a large-scale manufacturer and installer specialising in aluminum composite panels for building facades. The digital project was to give that factory a usable online presence: SEO, a highly targeted PPC programme, website development and content optimisation.',
        'The distinction that had to survive on the website is manufacturing. Grosstek runs production. Grosbond and Konstruktor are its product lines. Associated engineering, mounting systems, fastening components and installation sit beside that factory, as do architectural applications that may include glass or natural stone. Those applications are not treated here as extra in-house panel brands.',
      ),
    ),

    titleBlock('Collaboration'),
    contentBlock(
      p(
        'Neolines collaborated with Grosstek for over two years. That figure is the published relationship and the window for the SEO and PPC report. It is not a verified month-by-month campaign log, and no start or end date is assigned.',
        'Website structure and design were discussed in depth with company management and managers responsible for different areas of the business: how to organise product lines, manufacturing information, applications, technical documentation, the project portfolio and commercial inquiries. Names, attendee counts and meeting dates are not disclosed.',
      ),
    ),

    titleBlock('Website Architecture and Design'),
    contentBlock(
      p(
        'The site was developed on Drupal. The published information architecture included a homepage; About Us (history, news, partners, certifications); Ventilated Facades (advantages, installation and construction); product lines Grosbond and Konstruktor, each with application, processing, storage and certification sections; a production-process overview; completed-project case studies; a Press Center for news and industry insights; and contact / inquiry paths for professional buyers.',
        'A new website design balanced a functional interface with a warm colour palette and professional imagery. That is documented visual-identity work for a manufacturing brand. The authentic Grosstek mark from the published source case page is used in this record. No Grosstek, Grosbond or Konstruktor mark was generated.',
      ),
    ),

    titleBlock('Website Structure'),
    contentBlock(
      p(
        'The documented information architecture organised the Drupal site around eight hubs that assembled a shared main page through section interfaces: Company, Ventilated Facades, Grosbond, Konstruktor, Facade systems, Production, Products and Objects, with a Press Center feeding the same homepage.',
        'Company covered about, history, news, reviews, partners, certificates and contacts. Ventilated Facades covered application, purpose, advantages, composite panels, substructures, design, installation and supervised installation. Grosbond and Konstruktor each held composite-panel pages for application, advantages, colour, characteristics, production, processing, storage, certificates, prices and request.',
        'Facade systems listed application, purpose, features, production, certificates, prices and request, and named associated applications as labelled on the project diagram, including keramogranite — not additional in-house panel brands. Production listed technology, chemical synthesis, coating, thermo-adhesive, painting, processing and control. Products grouped Grosbond, Konstruktor and subsystem pages. Objects held the project portfolio. The Press Center held promotions, special offers, news, articles, questions, reviews, blog, experts, photo and video.',
        'Editorial and promotional content sat under the relevant hubs. Exact historic URLs are not reconstructed. The diagram below is the authentic project website structure.',
      ),
    ),
    {
      blockType: 'mediaBlock' as const,
      media: structureImageId,
    },

    titleBlock('Product Lines and Manufacturing'),
    contentBlock(
      p(
        'Grosbond and Konstruktor needed destinations that could hold application, processing, storage and certification information without flattening them into one “composite panels” page. Exact certificate names and datasheets are not reconstructed.',
        'Production was treated as a differentiator. The documented process outline runs from thermosetting and chemical synthesis through painting and final quality checks. That outline structures the manufacturing content. It is not expanded here into an invented factory recipe. Line speeds, plant locations and capacity are not disclosed.',
      ),
    ),

    titleBlock('Facade Systems, Portfolio, and Inquiries'),
    contentBlock(
      p(
        'Aluminum composite panels sit on substructures with fastening systems; design and installation have to match that cassette. The source names turnkey facade services as part of how Grosstek differentiated itself in competitor research, and it names a projects section covering scope, materials and outcomes.',
        'No project names, dimensions or cities are listed in the extract used here, so none are invented. Glass and natural stone, where they appear, are architectural applications in a wider facade portfolio — not Grosstek-manufactured equivalents of Grosbond. Inquiry paths for construction companies, architects, developers and project managers used the existing contact and form pattern. No new form was added for this Case Study.',
      ),
    ),

    titleBlock('SEO Strategy'),
    contentBlock(
      p(
        'The documented SEO work is in-depth keyword research and competitor benchmarking in aluminum composite panels and facade systems, including terms such as ventilated facades, composite panels and facade construction solutions, grouped by intent and volume.',
        'A semantic core clustered themes such as Grosbond panel technology, industrial facade systems and aluminum panel installation. Content mapping assigned each cluster to a page so product, production and installation copy would not overlap. On-page work included unique technical content, meta titles and descriptions, and schema markup for Product and Service pages. Competitor brands from the analysis are not named.',
      ),
    ),

    titleBlock('Contextual Advertising'),
    contentBlock(
      p(
        'PPC sat beside the organic programme. The source describes about ten targeted ad groups — including industrial facade systems, composite-panel wholesale and turnkey facade installations — with more than fifty ads and landing pages aligned to the ad copy.',
        'The ad platform, budgets, audience sizes and conversion definitions are not disclosed. The PPC percentages below are source-reported for the two-year window and are not mixed into the organic totals.',
      ),
    ),

    titleBlock('Reported Two-Year Results'),
    contentBlock(
      p(
        'The published Grosstek source case study reports the following figures for the two-year collaboration. They are reproduced as source-reported results, not as a new analytics audit. Organic traffic growth and organic-session growth are separate source rows. Keyword visibility is an increase of more than 1,500 keywords, not a percentage.',
      ) +
        ul([
          'Organic traffic growth: +55%',
          'Organic sessions: +25%',
          'Total sessions: +28%',
          'Keyword visibility: more than 1,500 additional keywords in Google search results',
          'Performance across five key keywords: +40%',
          'Search impressions: +15%',
          'Search clicks: +12%',
          'New users: +60%',
          'Returning users: +30%',
          'PPC clicks: +35%',
          'PPC conversions: +120%',
          'Average CPC: −10%',
          'Cost per conversion: −35%',
          'PPC CTR: +110%',
          'PPC conversion rate: +80%',
        ]) +
        p(
          'No baseline dates, Analytics or Search Console screenshots, or attribution model are in this repository. Revenue, lead counts and market-leadership claims are not restated.',
        ),
    ),

    titleBlock('Key Takeaways'),
    contentBlock(
      p(
        'Industrial marketing for an ACP manufacturer only works if the website shows the factory, the product lines and the systems around them — not a distributor catalogue with a nicer skin.',
        'Drupal architecture, technical content, schema, design and paid search have to follow that operating model. Where the source is silent — plant capacity, certificate numbers, named buildings — the correct public line is Not disclosed.',
      ),
    ),

    contentBlock(
      p(
        'Illustrative views of ACP manufacturing, facade engineering and architectural applications. These are not original photographs of documented Grosstek factories, products or contracts.',
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
        'Grosstek manufactures aluminum composite facade panels on its own production lines, including coating, painting, finishing and quality inspection as named in the published process outline, and installs ventilated facades where applicable.',
        'Factory size, locations and output are not disclosed.',
      ),
    ),
    products: rt(
      p(
        'Aluminum composite facade panels under the Grosbond and Konstruktor product lines, with related mounting systems, fastening components and facade engineering. Stone and glass are associated architectural applications, not additional manufactured panel brands in this record.',
      ),
    ),
    materials: rt(
      p(
        'Aluminum composite panels as the manufactured product. Exact cores, coatings and alloys are not disclosed and are not guessed from illustrative photographs.',
      ),
    ),
    applications: rt(
      p(
        'Ventilated facades on commercial, retail and other large architectural projects. Named buildings and dimensions are not listed in the source extract used here.',
      ),
    ),
  },

  businessChallenge: {
    initialState: rt(
      p(
        'Grosstek already manufactured ACP and delivered related facade work. The digital presence had to present in-house production, named product lines and engineering/installation without looking like a reseller site.',
      ),
    ),
    challenge: rt(
      p(
        'Product brands, manufacturing process, ventilated-facade applications, portfolio and inquiries needed destinations that matched a two-year SEO and PPC programme.',
      ),
    ),
    goals: rt(
      ul([
        'Structure Drupal around Grosbond, Konstruktor, production, applications and a press center',
        'Build a semantic core and map it onto those pages',
        'Design a manufacturing-appropriate visual presentation',
        'Run structured PPC alongside organic search',
        'Report only source-backed two-year figures',
      ]),
    ),
  },

  nicheSegmentation: [
    {
      name: 'Grosbond and Konstruktor product lines',
      description: rt(
        p('Named ACP brands with application, processing, storage and certification sections. Datasheets are not reproduced.'),
      ),
      marketingApproach: rt(
        p('Give each brand a destination. A Grosbond query is not a generic cladding homepage.'),
      ),
    },
    {
      name: 'In-house panel manufacturing',
      description: rt(
        p('Production outlined from thermosetting and chemical synthesis through painting and quality checks. Chemistry is not invented.'),
      ),
      marketingApproach: rt(
        p('Show the factory as the differentiator against distributors that only cut or install.'),
      ),
    },
    {
      name: 'Ventilated facades and mounting systems',
      description: rt(
        p('Applications, installation, substructures and fastening compatibility beside the manufactured panel.'),
      ),
      marketingApproach: rt(
        p('Keep system and subframe findable without hiding the fact that Grosstek makes the sheet.'),
      ),
    },
    {
      name: 'Architectural projects and inquiries',
      description: rt(
        p('Portfolio and press-center content, with contact paths for professional buyers. Named jobs are not listed.'),
      ),
      marketingApproach: rt(
        p('Use completed work and a press center to support trust. Do not fabricate a project roster.'),
      ),
    },
  ],

  digitalEcosystem: rt(
    p(
      'The confirmed digital ecosystem is a Drupal corporate website with product, production, application, portfolio and press-center sections, schema markup, SEO content and contextual advertising.',
      'The ad platform, CRM and social programmes are not named.',
    ),
  ),
  websiteArchitecture: rt(
    p(
      'Published architecture, as documented on the project diagram: eight hubs — Company, Ventilated Facades, Grosbond, Konstruktor, Facade systems, Production, Products and Objects — plus a Press Center, assembled through section interfaces into the main page.',
      'Exact historic URLs are not reconstructed. Drupal is the confirmed CMS.',
    ),
  ),
  semanticArchitecture: rt(
    p(
      'A semantic core grouped keywords into thematic clusters, including Grosbond panel technology, industrial facade systems and aluminum panel installation, then mapped each cluster to a page.',
      'A total keyword count for the core is not published. The 1,500 figure in results is later ranking visibility, not the size of the core.',
    ),
  ),

  marketingStrategy: {
    seoAndContentStrategy: rt(
      p(
        'Search-led work: keyword and competitor research, a semantic core, hierarchical content mapping, unique technical copy for Grosbond, ventilated facades and related pages, meta tags, and Product/Service schema.',
        'No article count is stated.',
      ),
    ),
    leadGenMechanism: rt(
      p(
        'Organic pages and PPC landing pages were meant to match product and service intent, then allow contact through the existing inquiry paths. Lead volume is not published beyond the source PPC conversion percentages.',
      ),
    ),
    paidAdvertising: [
      {
        channel: 'other' as const,
        strategy: rt(
          p(
            'Contextual advertising / paid search for industrial facade systems, composite-panel wholesale and turnkey facade installations, alongside the organic programme.',
            'The platform is not named.',
          ),
        ),
        campaignStructure: rt(
          p(
            'About ten targeted ad groups and more than fifty ads, with landing pages aligned to ad copy. Historic ads are not reconstructed.',
          ),
        ),
        results: rt(
          p(
            'Source-reported for the two-year window: clicks +35%, conversions +120%, average CPC −10%, cost per conversion −35%, CTR +110%, conversion rate +80%. Not independently re-audited. Budgets are not disclosed.',
          ),
        ),
      },
    ],
    socialMedia: [],
  },

  aiSearchOptimization: {
    brandAuthorityAndTrust: rt(
      p(
        'This project is described as Drupal development, SEO, content and PPC for an ACP manufacturer. It is not rewritten as an AI-search engagement.',
        'No ChatGPT, Perplexity or AI Overview result is claimed.',
      ),
    ),
    entityAndGeoStructure: rt(
      p(
        'Grosbond, Konstruktor, production, ventilated facades and installation are treated as related entities. Product/Service schema is documented. That is not a measured GEO programme.',
      ),
    ),
  },

  implementationProcess: rt(
    p(
      'Confirmed shape of the work: understand in-house manufacturing and product lines; research keywords and competitors; build the semantic core and map Drupal IA; write technical content and schema; design the visual presentation with management; run structured PPC; report the published two-year figures as source-reported results.',
      'The sequence is the method. Exact dates are not assigned.',
    ),
  ),

  timeline: [
    {
      period: 'Phase 1',
      title: 'Map the manufacturing business',
      description: rt(
        p('Product lines, production process, applications, portfolio, press center and inquiries, discussed with management.'),
      ),
    },
    {
      period: 'Phase 2',
      title: 'Keyword, competitor and semantic research',
      description: rt(
        p('Build the core and cluster Grosbond, industrial facade systems, installation and related terms. Competitor brands are not named.'),
      ),
    },
    {
      period: 'Phase 3',
      title: 'Drupal architecture, content, schema and design',
      description: rt(
        p('Implement the published IA, technical copy, Product/Service schema and a new visual design. The authentic Grosstek mark from the source case page is used in this record.'),
      ),
    },
    {
      period: 'Phase 4',
      title: 'PPC and two-year optimisation',
      description: rt(
        p('About ten ad groups and fifty-plus ads with aligned landing pages, beside ongoing SEO. The two-year figures are the published measurement window.'),
      ),
    },
  ],

  resultsSummary: rt(
    p(
      'The documented outcome is a two-year SEO, Drupal, design and PPC programme for an in-house ACP manufacturer: product-line architecture, a mapped semantic core, schema, about ten paid-search ad groups, and the source-reported visibility and conversion figures listed on this page.',
      'Those percentages are not independently re-audited here. Capacity, named buildings and market leadership are not claimed.',
    ),
  ),

  metrics: [
    sourceMetric('+55%', 'Organic traffic', 'Organic traffic growth.'),
    sourceMetric('+1,500+', 'Additional keywords ranked', 'Increase in keywords appearing in Google search results — a count, not a percentage.'),
    sourceMetric('+120%', 'PPC conversions', 'Paid-search conversion growth.'),
    sourceMetric('−10%', 'Average CPC', 'Average cost per click reduction on paid search.'),
    sourceMetric('+110%', 'PPC click-through rate', 'Paid-search CTR.'),
    sourceMetric('+25%', 'Organic sessions', 'Organic-session growth, listed separately from organic traffic in the source.'),
    {
      value: '2 years',
      label: 'Published collaboration window',
      description: rt(
        p(
          'The source reports collaboration of over two years and a two-year SEO/PPC summary. That is relationship duration for the published figures, not a verified uninterrupted campaign log.',
        ),
      ),
    },
  ],

  projectsShowcase: [
    {
      projectName: 'Grosbond and Konstruktor product architecture',
      description: rt(
        p('Dedicated Drupal sections for application, processing, storage and certifications. Certificate files are not reproduced.'),
      ),
    },
    {
      projectName: 'ACP manufacturing process content',
      description: rt(
        p('Production outlined from thermosetting and chemical synthesis through painting and quality checks. The factory images in this case are illustrative.'),
      ),
    },
    {
      projectName: 'Ventilated facades and project portfolio',
      description: rt(
        p('Applications, installation and a projects section. Named buildings are not listed in the source extract used here.'),
      ),
    },
  ],

  expertInsight: rt(
    p(
      'The useful complexity is a factory that makes aluminum composite panels under named brands, then talks about systems, subframes and installation without pretending to be a reseller.',
      'Two years of SEO and PPC only make sense if Drupal holds Grosbond, Konstruktor, production and applications as real destinations. The published figures stay labelled as source-reported.',
      'Where the source is silent — plant capacity, certificate numbers, named sites — the correct public line is Not disclosed. This discussion is editorial. It is not a conversation with Grosstek.',
    ),
  ),

  clientTestimonial: { quote: null, author: null, position: null, company: null },

  hero: {
    type: 'mediumImpact' as const,
    richText: rtHero(
      p(
        'Two-year SEO, Drupal architecture, visual design and contextual advertising for Grosstek — a manufacturer of aluminum composite facade panels with in-house production lines and the Grosbond and Konstruktor product brands.',
      ),
    ),
    media: mainImageId,
  },

  primary_case_study_category: PRIMARY_CASE_STUDY_CATEGORY,
  case_study_categories: CASE_STUDY_CATEGORIES,

  meta: {
    title: 'Grosstek Case Study | ACP Manufacturing SEO and Drupal',
    description:
      'Explore how Neolines supported Grosstek, an aluminum composite panel manufacturer, through two-year SEO, Drupal website architecture, visual design, and contextual advertising.',
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
          duration: '2_years',
          featured: true,
          displayOrder: 15,
          galleryImages: GALLERY_IMAGES.length,
          metrics: 7,
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
        { slug: { like: 'grosstek' } },
        { slug: { like: 'grosbond' } },
        { title: { like: 'Grosstek' } },
      ],
    },
    limit: 5,
    depth: 0,
    overrideAccess: true,
    select: { id: true, slug: true, title: true },
  })

  const previewImageId = await upsertMedia(payload, PREVIEW_IMAGE)
  const mainImageId = await upsertMedia(payload, MAIN_IMAGE)
  const galleryIds: number[] = []
  for (const image of GALLERY_IMAGES) galleryIds.push(await upsertMedia(payload, image))
  const logoId = await upsertMedia(payload, LOGO_IMAGE)
  const structureImageId = await upsertMedia(payload, STRUCTURE_IMAGE)

  const data = buildData(previewImageId, mainImageId, galleryIds, logoId, structureImageId)
  const existing = duplicates.docs.find((doc) => doc.slug === SLUG) ?? duplicates.docs[0]

  if (existing && existing.slug !== SLUG && existing.slug !== 'grosstek') {
    throw new Error(`Related Grosstek record exists with different slug: ${existing.id} ${existing.slug}`)
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
