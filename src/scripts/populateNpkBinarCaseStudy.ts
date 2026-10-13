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
 * Creates or updates the NPK BINAR Case Study.
 * Structural reference: Laser Made / Merkan / Ovik / Anhor.
 * Re-runnable: structured fields and layout blocks are replaced, not appended.
 *
 * Duration = 2 years is the stated cooperation period, not a verified
 * SEO-campaign length. No invented metrics, rankings, leads, named sites,
 * warranties, certifications or factory claims. Manufacturing is stated
 * only for metal and copper roofing elements and drainage components.
 * No site_categories. No client logo — none verified.
 */
const SLUG = 'npk-binar-roofing-systems'
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
  432, // Roofing Products
  431, // Metal Building Products
  430, // Insulation Products
  429, // Facade Systems
  428, // Facade Installation
  426, // Construction Products
  425, // Construction Materials Manufacturing
  420, // Architectural Products
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
  filename: 'binar-standing-seam-roof.jpg',
  alt: 'Standing-seam metal roof on a contemporary commercial building, with valleys, ridges and metal flashing.',
  caption:
    'Standing-seam metal roofing on a complex roof. Illustrative architecture, not a documented NPK BINAR project photograph.',
}

const GALLERY_IMAGES: ImageSpec[] = [
  {
    filename: 'binar-copper-roofing.jpg',
    alt: 'Copper standing-seam roofing with a copper chimney flashing and ridge cap.',
    caption:
      'Copper roofing and copper roof details. Illustrative material, not a documented NPK BINAR installation.',
  },
  {
    filename: 'binar-zinc-standing-seam.jpg',
    alt: 'Matte grey zinc standing-seam roof panels on a modern house.',
    caption:
      'Zinc standing-seam roofing. Illustrative system type, not a named project.',
  },
  {
    filename: 'binar-metal-roof-tiles.jpg',
    alt: 'Dark graphite profiled metal roofing tiles on a residential roof.',
    caption:
      'Metal roofing tiles. Illustrative covering, no brand or specification claimed.',
  },
  {
    filename: 'binar-flexible-shingles.jpg',
    alt: 'Charcoal flexible asphalt shingles in overlapping courses on a pitched roof.',
    caption:
      'Flexible shingles. Illustrative roofing material, not a verified NPK BINAR product line photograph.',
  },
  {
    filename: 'binar-roof-flashings.jpg',
    alt: 'Fabricated copper and galvanized steel roof flashings, drip edges and valley pieces on a workbench.',
    caption:
      'Fabricated metal roofing components and flashings. Illustrative workshop still, not a factory record.',
  },
  {
    filename: 'binar-roof-drainage.jpg',
    alt: 'Copper gutter, hopper and downpipe on a masonry eaves.',
    caption:
      'Roof drainage and rainwater goods. Illustrative guttering, not a documented installation.',
  },
  {
    filename: 'binar-roof-installation.jpg',
    alt: 'Roofers installing standing-seam metal panels on a pitched roof with underlayment visible.',
    caption:
      'Metal-roof installation. Illustrative site work, not a documented NPK BINAR crew or project.',
  },
  {
    filename: 'binar-slate-style-roofing.jpg',
    alt: 'Dark corrugated slate-style roof covering on a pitched residential roof.',
    caption:
      'Slate-style roof covering. Illustrative material type. The source names euroslate among roofing products without specifying the exact sheet.',
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
 * Editorial discussion — not customer comments.
 */
const DISCUSSION: DiscussionEntry[] = [
  {
    author: 'Lukas Schneider',
    role: 'Industrial marketing consultant',
    date: '2026-10-18',
    depth: 0,
    body: p(
      'NPK BINAR has copper, zinc, standing-seam, tiles, shingles, drainage, siding and insulation. Why is that a website-architecture problem and not just a long product list?',
    ),
  },
  expert(
    '2026-10-18',
    p(
      'Because buyers do not search only for “roofing.” They search for a material, a roof type, a fabricated flashing, an installation, a gutter system, or a complete roof package. Those intents need destinations.',
      'A single catalogue page can introduce the range. It cannot be the page for copper standing-seam, flexible shingles and rainwater goods at once. The SEO job is to keep those pages related without making them compete.',
    ),
    1,
  ),
  {
    author: 'Martin Novak',
    role: 'In-house manufacturing marketer',
    date: '2026-10-19',
    depth: 2,
    body: p(
      'So copper roofing, zinc roofing, standing-seam systems and drainage each need their own landing page?',
    ),
  },
  expert(
    '2026-10-19',
    p(
      'If people search for them separately, yes — a destination that explains that job. Copper is not zinc. Standing seam is a system, not a tile. Gutters are part of the roof, but they are bought as drainage.',
      'That is not a claim that NPK BINAR manufactured every covering in-house. The source lists those areas. The site should present them. It should not invent a factory line for each one.',
    ),
    3,
  ),
  {
    author: 'Thomas Weber',
    role: 'Technical content lead',
    date: '2026-10-20',
    depth: 0,
    body: p(
      'If the materials are closely related, how do you avoid duplicate content that only swaps “copper” for “zinc”?',
    ),
  },
  expert(
    '2026-10-20',
    p(
      'Write to the job, not to a template. A copper page should talk about copper detailing and fabrication. A zinc page should talk about zinc standing-seam behaviour. A metal-tile page should talk about a tiled profile. A shingle page should talk about a flexible covering.',
      'Shared sentences about “design, manufacture and installation” belong on the solutions page. Repeating them on every URL is how you get thin duplicates. The semantic map is there to stop that.',
    ),
    1,
  ),
  {
    author: 'Elena Petrova',
    role: 'B2B demand generation lead',
    date: '2026-10-21',
    depth: 2,
    body: p(
      'Should installation sit on every material page, or as its own service?',
    ),
  },
  expert(
    '2026-10-21',
    p(
      'Both can exist if the copy is different. A visitor looking for copper installation is not the same visitor looking for a drainage package or for fabricated flashings only.',
      'What this record does not support is a reconstructed sitemap. The principle is intent mapping, not a claim about which URL mix finally shipped.',
    ),
    3,
  ),
  {
    author: 'Henrik Dahl',
    role: 'Technical SEO specialist',
    date: '2026-10-22',
    depth: 0,
    body: p(
      'The source mentions keyword research, competitor analysis and a semantic core. Without volumes, what relationships actually matter for a roofing portfolio?',
    ),
  },
  expert(
    '2026-10-22',
    p(
      'Material to system to component to stage. Copper is not the same query as a copper flashing. Standing seam is not the same query as a metal tile. Drainage is not the same query as a complete roof.',
      'Design, fabrication of metal and copper elements, installation and complementary products such as siding or insulation are stages and add-ons around that roof. Mapping puts those relationships onto Drupal pages. No keyword count or ranking table is in the source.',
    ),
    1,
  ),
  {
    author: 'Anna Kovacs',
    role: 'Construction-sector marketing manager',
    date: '2026-10-23',
    depth: 2,
    body: p(
      'How do manufacturers and installation contractors structure a site around buyer search intent without looking like two different companies?',
    ),
  },
  expert(
    '2026-10-23',
    p(
      'Keep fabrication and installation in the same roofing story. NPK BINAR is described as designing systems, making metal and copper elements and drainage parts, and installing roofs. That is one coordinated offering.',
      'The homepage can say that. Material and component pages should still be findable. Do not invent a separate manufacturing brand or a general-construction firm the source does not describe.',
    ),
    3,
  ),
  {
    author: 'Pavel Orlov',
    role: 'Roofing project engineer',
    date: '2026-10-24',
    depth: 0,
    body: p(
      'The source says metal and copper elements and drainage components are manufactured. Shingles, euroslate, siding and insulation are also listed. How do you put that on a website without overstating the factory?',
    ),
  },
  expert(
    '2026-10-24',
    p(
      'By separating what is confirmed as fabricated from what is listed as a product or system area. Metal and copper roofing elements and drainage components are described as manufactured. Other coverings and envelope products are in the range; this record does not claim they were all made in-house.',
      'The gallery is illustrative. It is not an NPK BINAR catalogue and it does not name grades or models.',
    ),
    1,
  ),
  {
    author: 'Pavel Orlov',
    role: 'Roofing project engineer',
    date: '2026-10-24',
    depth: 2,
    body: p(
      'Would you give every flashing profile its own SEO page?',
    ),
  },
  expert(
    '2026-10-25',
    p(
      'No. Flashings support the roof. They should be findable where buyers search for fabricated details, but they should not explode the taxonomy into a hardware store. The architecture follows how the work is bought: system, material, then component if needed.',
    ),
    3,
  ),
  {
    author: 'Sophie Laurent',
    role: 'PPC specialist',
    date: '2026-10-26',
    depth: 0,
    body: p(
      'Content marketing and digital promotion are mentioned. There are no campaign numbers. What is the actual role of technical content here?',
    ),
  },
  expert(
    '2026-10-26',
    p(
      'To explain a range a construction buyer already recognises: a copper roof, a standing-seam system, a gutter line, an installation, a complete envelope. A page that matches that job can support an enquiry. A generic “we do roofing” paragraph cannot.',
      'No article count, traffic figure or conversion rate is in the source. Content marketing is a documented activity, not a measured funnel.',
    ),
    1,
  ),
  {
    author: 'Sophie Laurent',
    role: 'PPC specialist',
    date: '2026-10-27',
    depth: 2,
    body: p(
      'Is this a paid-media case?',
    ),
  },
  expert(
    '2026-10-27',
    p(
      'No. The documented work is keyword research, competitor analysis, a semantic core, SEO-oriented Drupal architecture, UX/UI and content that presents the roofing range. Paid results are not listed. I will not add them.',
    ),
    3,
  ),
  {
    author: 'James Whitaker',
    role: 'Drupal developer',
    date: '2026-10-28',
    depth: 0,
    body: p(
      'Why does Drupal matter if version and modules are not disclosed?',
    ),
  },
  expert(
    '2026-10-28',
    p(
      'Because the source names Drupal as the website platform. That is a confirmed implementation choice, not a recommendation to every roofing company. What matters is that the site was built as a structured system that could hold materials, fabricated parts, installation and drainage.',
      'Theme, modules and the historic URL are not disclosed. This record describes the engagement, not the current Next.js website.',
    ),
    1,
  ),
  {
    author: 'Clara Jensen',
    role: 'Building-envelope marketing manager',
    date: '2026-10-29',
    depth: 2,
    body: p(
      'The cooperation lasted about two years. Does that make this a two-year SEO campaign?',
    ),
  },
  expert(
    '2026-10-29',
    p(
      'No. The source gives approximately two years as the client relationship. It does not say that a measured SEO campaign ran for those two years. I will report the cooperation duration and leave campaign length as Not disclosed.',
    ),
    3,
  ),
  {
    author: 'Daniel Okonkwo',
    role: 'Export and B2B sales manager',
    date: '2026-10-30',
    depth: 0,
    body: p(
      'Has any of this been measured in AI search — ChatGPT, Perplexity, AI Overviews?',
    ),
  },
  expert(
    '2026-10-30',
    p(
      'Not in this record. No ChatGPT ranking, Perplexity citation or AI Overview result is documented. I will not invent one.',
      'A topical model that connects roofing materials, fabricated components, drainage and installation is useful groundwork for modern search in principle. It is not a measured GEO or AEO programme.',
    ),
    1,
  ),
]

const faqBlock = () => ({
  blockType: 'csFAQ' as const,
  case_study_faq_title: 'Frequently Asked Questions About NPK BINAR',
  items: [
    {
      question: 'What is included in a complete roofing-system project?',
      answer: rt(
        p(
          'In this record, a complete project can include roofing-system design, selection of covering materials, fabrication of metal and copper elements where that applies, installation, and related drainage and building-envelope products such as gutters, siding or thermal insulation.',
          'That is the stated range. It is not a claim that every product was manufactured in-house or installed on every job. Named sites, warranties and specifications are not disclosed.',
        ),
      ),
    },
    {
      question: 'What are the differences between copper, zinc, standing-seam, and metal-tile roofing?',
      answer: rt(
        p(
          'These are different materials and system types, which is why they need distinct pages. Copper and zinc are specialist metals with their own detailing. Standing-seam is a long-panel metal system. Metal tiles are a profiled covering that reads as tiles.',
          'This is general industry distinction, not a laboratory comparison of NPK BINAR products. Grades, thicknesses and warranties are not in the source.',
        ),
      ),
    },
    {
      question: 'Why should roofing and drainage components be considered together?',
      answer: rt(
        p(
          'A roof has to shed water. Gutters, downpipes and other rainwater goods are part of that system, not an unrelated accessory aisle. Design, fabricated metal details and installation all meet at the eaves.',
          'The source lists drainage and roof-water management alongside roofing. Models and capacities are not disclosed.',
        ),
      ),
    },
    {
      question:
        'How can a website organize roofing materials, fabrication, installation, and related building products for SEO?',
      answer: rt(
        p(
          'Give each real search intent a destination, and keep the complete-roof picture at the company or solutions level. Material pages describe the covering. Fabrication pages describe flashings and metal elements. Installation pages describe site work. Drainage, siding and insulation sit as related envelope products, not as copies of the roofing homepage.',
          'Exact historic URLs for NPK BINAR are not reconstructed.',
        ),
      ),
    },
    {
      question: 'Why does keyword mapping matter for a construction company with a broad roofing portfolio?',
      answer: rt(
        p(
          'Because a broad portfolio is easy to flatten into one “roofing” page that ranks for nothing specific. Keyword research, competitor analysis and a semantic core were used so materials, systems, components and services could be mapped onto a Drupal site.',
          'No keyword volume or ranking table is published. The result that can be stated is structural, not a traffic percentage.',
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
    `<h2>${escapeHtml('Discuss a similar roofing SEO and website project')}</h2>` +
      p(
        'If you design, fabricate and install roofing systems and need the website to match how buyers search across materials, components and installation, tell us about the offering.',
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
  case_study_gallery_title: 'Roofing Materials, Fabricated Components, and Complete Systems',
  case_study_gallery_images: imageIds,
})

const buildData = (previewImageId: number, galleryIds: number[]) => ({
  title: 'NPK BINAR: SEO and Website Development for Complete Roofing Systems',
  case_study_long_title:
    'NPK BINAR — Semantic SEO and Drupal Website Architecture for Roofing Design, Metal Fabrication, Installation and Drainage Systems',
  slug: SLUG,
  generateSlug: false,
  _status: 'published' as const,
  featured: true,
  displayOrder: 9,
  duration: '2_years',

  layout: [
    {
      blockType: 'csPreview' as const,
      case_study_preview_title: 'Roofing Design, Manufacturing, and Installation',
      case_study_preview_text: rt(
        p(
          'NPK BINAR provides integrated roofing solutions, combining roofing-system design, specialist materials and components, installation, and related drainage and building-envelope products. The digital work was a Drupal website with keyword research, competitor analysis, a semantic core and an SEO-oriented structure so those related products and services could be found without collapsing into one generic roofing page. The client relationship lasted approximately two years.',
        ),
      ),
      case_study_preview_image: previewImageId,
    },

    titleBlock('About the Client'),
    contentBlock(
      p(
        'NPK BINAR is a roofing and building-envelope business with a broad, interconnected range. The supplied material identifies roofing-system design, roofing installation, copper roofing, zinc roofing, standing-seam roofing, flexible shingles, metal roofing tiles, slate-style products referred to as euroslate, drainage and roof-water management, siding, thermal insulation, and associated roofing materials.',
        'Manufacturing of metal and copper roofing elements and drainage components is part of that picture, together with installation. This record does not claim that every covering in the range was fabricated in-house. It does not call the company an industry leader.',
      ),
    ),

    titleBlock('The SEO Challenge'),
    contentBlock(
      p(
        'The challenge is not only to rank for a general term such as roofing. Potential customers may search for a material, a roof type, a fabricated flashing, an installation crew, a gutter system, siding, insulation, or a complete roofing solution.',
        'Those queries are related. They are not the same page. The site had to represent the range clearly without creating duplicate or competing URLs. No historic domain, previous CMS or ranking gap is described, so none is invented.',
      ),
    ),

    titleBlock('Keyword Research and Semantic Architecture'),
    contentBlock(
      p(
        'The documented SEO work is keyword research, competitor analysis, development of a semantic core, search-intent mapping, and an information architecture that could hold roofing products, materials, fabricated components and installation services as related categories.',
        'A well-mapped structure can connect a complete-roof page to copper, zinc, standing-seam, tiles, shingles, drainage and installation without making those pages copy each other. No keyword volumes, ranking tables or named competitors are published.',
      ),
    ),

    titleBlock('Website Development and UX/UI'),
    contentBlock(
      p(
        'The website was developed on Drupal, with UX/UI design and an SEO-oriented structure. Drupal is the confirmed platform. Version, theme, modules and a reconstructed sitemap are not disclosed.',
        'The practical job of UX/UI here is navigation: help a visitor distinguish roofing materials, roof types, fabricated components and complete installation services. This Case Study describes the historical project, not the current Next.js website.',
      ),
    ),

    titleBlock('Roofing Products and Manufacturing'),
    contentBlock(
      p(
        'The range in the source includes copper and zinc roofing, standing-seam systems, metal roofing tiles, flexible shingles, slate-style products named as euroslate, fabricated metal and copper elements, and installation.',
        'The value of the offering is coordination: material selection, component fabrication and installation can sit in one roofing solution. Confirmed fabrication in this record is metal and copper roofing elements and drainage components. Other coverings and envelope products are listed as part of the range; in-house manufacture of those items is not verified.',
        'No product models, material grades or factory capacities are stated.',
      ),
    ),

    titleBlock('Drainage and Complementary Building Systems'),
    contentBlock(
      p(
        'Gutters, downpipes and other roof-water management products belong with the roof, not beside it. They connect design, fabricated metal details and installation at the eaves.',
        'Siding and thermal insulation are named as complementary building-envelope products. They widen the offering around the roof. They are not reconstructed here as a second facade-contracting business. Models and specifications are not disclosed.',
      ),
    ),

    titleBlock('Content Marketing and Digital Promotion'),
    contentBlock(
      p(
        'Content marketing and digital promotion are named in the source as project activities. Their intended role is to explain the range — materials, fabricated parts, drainage, installation — and to attract relevant construction and roofing prospects.',
        'No article count, campaign, traffic figure or lead volume is in the source. Those results are not disclosed.',
      ),
    ),

    titleBlock('Project Scope and Outcomes'),
    contentBlock(
      p(
        'The documented work is a Drupal website with UX/UI design, a semantic SEO foundation and an information architecture for a broad roofing portfolio. The client relationship lasted approximately two years. That figure is the duration of cooperation. It is not reported as a verified SEO-campaign length.',
        'The intended value is structural: buyers can find a material, a fabricated component, a drainage line or an installation service without losing the complete-roof picture. Verified traffic, rankings, leads, conversions and revenue are not in the source. Not disclosed.',
      ),
    ),

    titleBlock('Lessons for Manufacturing and Construction Businesses'),
    contentBlock(
      p(
        'A broad portfolio fails online when everything is forced onto one roofing homepage. Manufacturers and contractors that combine material supply, fabrication, design, installation and related components need a map: system, material, part, stage.',
        'The transferable lesson is not a Drupal verdict and not a traffic claim. It is the discipline of giving related products their own semantics, then leaving gaps as Not disclosed when the source is silent.',
      ),
    ),

    contentBlock(
      p(
        'An illustrative overview of roofing materials, specialist metal components, drainage elements and installation details relevant to complete roofing solutions. These are not original photographs of documented NPK BINAR projects.',
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
        'NPK BINAR designs roofing systems, fabricates metal and copper roofing elements and drainage components, and installs roofs. The wider range also includes specialist coverings and complementary envelope products.',
        'This is not a claim that every listed covering was manufactured in-house, or that every project included fabrication and installation together.',
      ),
    ),
    products: rt(
      p(
        'Copper roofing, zinc roofing, standing-seam roofing, flexible shingles, metal roofing tiles, slate-style products referred to as euroslate, fabricated flashings and metal details, drainage and rainwater goods, siding, thermal insulation, and associated roofing materials.',
        'No models, grades or part numbers are stated.',
      ),
    ),
    materials: rt(
      p(
        'Copper and zinc are named as specialist roofing metals. Other coverings in the source include metal tiles, flexible shingles and euroslate. Exact alloys, coatings and insulation types are not disclosed and are not guessed from illustrative photographs.',
      ),
    ),
    applications: rt(
      p(
        'Complete roofing solutions and related building-envelope work: design, covering, fabricated details, drainage and installation. Named buildings and project sizes are not disclosed.',
      ),
    ),
  },

  businessChallenge: {
    initialState: rt(
      p(
        'NPK BINAR already had a broad roofing offering across materials, fabricated metal elements, installation and drainage. The digital presentation had to catch up with that breadth without flattening it into one contractor slogan.',
      ),
    ),
    challenge: rt(
      p(
        'Related products and services had to stay findable as distinct search intents — copper, zinc, standing-seam, tiles, shingles, flashings, gutters, installation — without competing as duplicate pages.',
      ),
    ),
    goals: rt(
      ul([
        'Build a Drupal website with UX/UI design and an SEO-oriented structure',
        'Analyse keywords and competitors',
        'Create a semantic core and map it to roofing materials, components and services',
        'Present fabrication and installation as one coordinated offering',
        'Keep drainage and complementary envelope products in the same architecture',
        'Support visibility without inventing ranking targets',
      ]),
    ),
  },

  nicheSegmentation: [
    {
      name: 'Copper and Zinc Roofing',
      description: rt(
        p(
          'Specialist metal roofing in copper and zinc, including detailing that depends on the metal. Fabrication of copper elements is named in the source.',
        ),
      ),
      marketingApproach: rt(
        p(
          'Give each metal a destination. Buyers searching for copper roofing are not the same visitors as those searching only for zinc standing-seam.',
        ),
      ),
    },
    {
      name: 'Standing-Seam and Metal-Tile Systems',
      description: rt(
        p(
          'Standing-seam roofing and profiled metal tiles as distinct system types within metal roofing. Profiles and thicknesses are not disclosed.',
        ),
      ),
      marketingApproach: rt(
        p(
          'Do not fold both into one “metal roofing” paragraph if the search and the detailing are different.',
        ),
      ),
    },
    {
      name: 'Shingles and Slate-Style Coverings',
      description: rt(
        p(
          'Flexible shingles and slate-style products referred to as euroslate. The exact sheet type behind that name is not specified in the source.',
        ),
      ),
      marketingApproach: rt(
        p(
          'Treat them as coverings in the range, not as unverified in-house manufactures.',
        ),
      ),
    },
    {
      name: 'Fabricated Roofing Components',
      description: rt(
        p(
          'Manufacturing of metal and copper roofing elements: flashings and related details that belong with the roof. No profile list is published.',
        ),
      ),
      marketingApproach: rt(
        p(
          'Show fabrication as part of the roofing solution, not as an unrelated metal workshop.',
        ),
      ),
    },
    {
      name: 'Drainage and Rainwater Goods',
      description: rt(
        p(
          'Gutters, downpipes and roof-water management, including fabricated drainage components. Models are not disclosed.',
        ),
      ),
      marketingApproach: rt(
        p(
          'Keep drainage next to the roof in the architecture. It is searched for as its own job.',
        ),
      ),
    },
    {
      name: 'Installation and Building Envelope',
      description: rt(
        p(
          'Roofing installation, plus complementary siding and thermal insulation named in the source. Installation methods and insulation specifications are not disclosed.',
        ),
      ),
      marketingApproach: rt(
        p(
          'Speak to construction buyers who need the roof installed, not only specified. Do not invent named sites.',
        ),
      ),
    },
  ],

  digitalEcosystem: rt(
    p(
      'The confirmed digital ecosystem is the Drupal corporate website, with UX/UI design, SEO structure, keyword and competitor analysis, a semantic core and mapping, and content marketing named as a project activity.',
      'Social programmes, CRM platforms, specific ad accounts and AI-search tools are not listed as delivered work.',
    ),
  ),
  websiteArchitecture: rt(
    p(
      'The site had to hold roofing materials, roof types, fabricated components, drainage, installation and complementary envelope products as related sections rather than one catalogue dump.',
      'Exact historic URLs are not reconstructed. Drupal version and module list are not disclosed.',
    ),
  ),
  semanticArchitecture: rt(
    p(
      'The semantic model connected complete roofing solutions with copper, zinc, standing-seam, metal tiles, shingles, euroslate, fabricated flashings, drainage, siding, insulation and installation.',
      'Keyword volumes are not stated. Competitor brands are not named.',
    ),
  ),

  marketingStrategy: {
    seoAndContentStrategy: rt(
      p(
        'The main digital strategy in the source is search-led: keyword analysis, competitor analysis, a semantic foundation, strategic mapping, and a Drupal site designed for UX/UI and SEO. Content marketing and digital promotion are named as ways to present the range and attract prospects.',
        'No article count or publishing calendar is stated.',
      ),
    ),
    leadGenMechanism: rt(
      p(
        'The site was meant to make specific roofing products and installation services findable, then allow contact. No form mix, conversion rate or lead volume is published.',
      ),
    ),
    paidAdvertising: [],
    socialMedia: [],
  },

  aiSearchOptimization: {
    brandAuthorityAndTrust: rt(
      p(
        'This project is described as website development, semantic SEO and digital presentation of a roofing manufacturer-installer. It is not rewritten as an AI-search engagement.',
        'No ChatGPT ranking, Perplexity citation, Gemini visibility, AI Overview result or AI-generated lead is claimed, and none is documented.',
      ),
    ),
    entityAndGeoStructure: rt(
      p(
        'Roofing materials, fabricated components, drainage and installation are treated as related entities in the information architecture. That topical model is useful for modern search systems in principle. It is not a measured GEO or AEO programme.',
      ),
    ),
  },

  implementationProcess: rt(
    p(
      'Confirmed shape of the work, without inventing dates: understand the roofing portfolio; research keywords and competitors; build the semantic core and map materials, components and services; develop the Drupal site with UX/UI and SEO structure; use content to present the range.',
      'The sequence is the method. It is not a dated Gantt chart. The relationship lasted approximately two years.',
    ),
  ),

  timeline: [
    {
      period: 'Phase 1',
      title: 'Understand the roofing portfolio',
      description: rt(
        p(
          'Map design, specialist coverings, fabricated metal and copper elements, drainage, installation and complementary envelope products.',
        ),
      ),
    },
    {
      period: 'Phase 2',
      title: 'Keyword and competitor research',
      description: rt(
        p(
          'Analyse how construction and roofing buyers search for materials, systems, components and installation. Competitor brands are not named.',
        ),
      ),
    },
    {
      period: 'Phase 3',
      title: 'Semantic core and mapping',
      description: rt(
        p(
          'Build a semantic foundation and map terms to pages so related products do not collapse into one roofing homepage or duplicate each other.',
        ),
      ),
    },
    {
      period: 'Phase 4',
      title: 'Drupal website with UX/UI and SEO structure',
      description: rt(
        p(
          'Develop the site on Drupal so navigation can distinguish materials, fabricated parts, drainage and installation. Version and modules are not disclosed.',
        ),
      ),
    },
  ],

  resultsSummary: rt(
    p(
      'The documented outcome is structural: a Drupal website with an SEO-oriented architecture and a semantic map of a broad roofing portfolio — materials, fabricated components, drainage and installation. The client relationship lasted approximately two years.',
      'Verified traffic, rankings, leads, conversions and revenue are not in the source. Not disclosed. The two-year figure is cooperation duration, not a measured campaign length.',
    ),
  ),

  metrics: [],
  projectsShowcase: [],

  expertInsight: rt(
    p(
      'The useful complexity in this case is a complete roofing offering that is also a cluster of search intents. Copper, zinc, standing-seam, tiles, shingles, flashings, gutters and installation are related. They are not one query.',
      'Semantic research matters only if it is mapped onto pages. Drupal, in this record, is the CMS that held that map. It is not a general verdict on platforms.',
      'Where the source is silent — rankings, leads, named buildings, which coverings were manufactured in-house — the correct public line is Not disclosed.',
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
        'Semantic SEO and Drupal website architecture for NPK BINAR, so a broad roofing portfolio — materials, fabricated metal components, drainage and installation — could be found as distinct jobs and still read as one complete roofing solution.',
      ),
    ),
  },

  primary_case_study_category: PRIMARY_CASE_STUDY_CATEGORY,
  case_study_categories: CASE_STUDY_CATEGORIES,

  meta: {
    title: 'NPK BINAR Case Study | Roofing SEO and Website Development',
    description:
      'Explore an SEO and website development case for NPK BINAR, covering roofing systems, metal roofing, fabricated components, drainage products, and installation services.',
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
          niches: 6,
          timeline: 4,
          duration: '2_years',
          featured: true,
          displayOrder: 9,
          categories: CASE_STUDY_CATEGORIES.length,
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
        { slug: { equals: 'npk-binar' } },
        { title: { like: 'BINAR' } },
        { title: { like: 'Binar' } },
        { slug: { like: 'binar' } },
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

  if (existing && existing.slug !== SLUG && existing.slug !== 'npk-binar') {
    throw new Error(`Related BINAR record exists with different slug: ${existing.id} ${existing.slug}`)
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
