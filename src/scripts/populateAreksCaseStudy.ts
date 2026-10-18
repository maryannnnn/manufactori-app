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
 * Creates the AREKS case study, or updates an existing AREKS record.
 * Does not touch House of Sofas.
 * Published source: a furniture-factory website, competitor analysis, a semantic
 * core, query mapping, and Drupal best practices. No keyword count and no metrics.
 * Family ownership, the countryside facility, the showroom, and about two years
 * are the supplied recollection, without a calendar.
 * Gallery images are illustrative. The logo adapts the brown sofa from the source mark.
 */
const SLUG = 'areks-upholstered-furniture'
const IMAGE_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'assets')

const EXPERT = 'Maryan Polyak'
const EXPERT_ROLE = 'Manufacturing Digital Marketing & Web Development Expert'

const EXPECTED_CATEGORY_IDS: Array<[number, string]> = [
  [196, 'Manufacturing SEO'],
  [197, 'Application SEO'],
  [218, 'Product SEO'],
  [200, 'Competitor SEO Analysis'],
  [210, 'Manufacturing Keyword Research'],
  [239, 'Manufacturing Website Development'],
  [226, 'Manufacturing Website Design & Development'],
  [237, 'Industrial Website Development'],
  [235, 'Industrial Website Architecture'],
  [238, 'Manufacturing Website Design'],
  [311, 'Technical Content Marketing'],
  [669, 'Manufacturing'],
  [484, 'Design, Manufacturing & Installation'],
]

const EXTRA_CATEGORY_TITLES = [
  'Upholstered Furniture',
  'Furniture Manufacturing',
  'Sofa Manufacturing',
  'Custom Furniture Manufacturing',
  'Content Marketing',
]

const rt = (html: string) => generateJSON(html, getTiptapExtensions({ headingLevels: [2, 3, 4] }))
const rtHero = (html: string) =>
  generateJSON(html, getTiptapExtensions({ headingLevels: [1, 2, 3, 4] }))

const escapeHtml = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const p = (...texts: string[]) => texts.map((text) => `<p>${escapeHtml(text)}</p>`).join('')

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
  filename: 'areks-preview.jpg',
  alt: 'A low curved two-seat sofa in dusty rose velvet with slim brass legs.',
  caption:
    'Illustrative sofa for the archive card. Not a verified AREKS product photograph.',
}

const MAIN_IMAGE: ImageSpec = {
  filename: 'areks-hero.jpg',
  alt: 'A cognac leather three-seat sofa in a warm contemporary living room.',
  caption:
    'Illustrative upholstered sofa. Not a documented AREKS model, showroom, or factory.',
}

const GALLERY_IMAGES: ImageSpec[] = [
  {
    filename: 'areks-corner.jpg',
    alt: 'A sage linen L-shaped corner sectional with a chaise in a bright living room.',
    caption: 'Illustrative corner sofa. Not an AREKS catalog photograph.',
  },
  {
    filename: 'areks-sofa-bed.jpg',
    alt: 'An oatmeal linen sofa bed opened to show the pull-out sleeping surface and wooden frame.',
    caption:
      'Illustrative roll-out sofa. Not a verified AREKS mechanism and not a technical drawing.',
  },
  {
    filename: 'areks-armchairs.jpg',
    alt: 'Two navy velvet armchairs with oak legs beside a round walnut table.',
    caption: 'Illustrative armchairs. Not a documented AREKS seating set.',
  },
  {
    filename: 'areks-upholstery.jpg',
    alt: 'Cream, olive, and rust fabric draped over a partially upholstered sofa arm.',
    caption:
      'Illustrative upholstery detail. Not a photograph of the AREKS workshop, and not a materials specification.',
  },
]

const LOGO_IMAGE: ImageSpec = {
  filename: 'areks-logo-en.png',
  alt: 'AREKS logo: a brown sofa symbol beside the English name AREKS.',
  caption:
    'Horizontal English wordmark. The brown sofa follows the source mark. The Cyrillic lettering was replaced with AREKS. Upholstered furniture is the English line from the original banner.',
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
      file: {
        name: image.filename,
        data,
        mimetype: mimeFromName(image.filename),
        size: data.byteLength,
      },
      overrideAccess: true,
      context: { disableRevalidate: true },
    })
    payload.logger.info(`updated media ${media.id} ${image.filename}`)
    return media.id
  }
  const media = await payload.create({
    collection: 'media',
    data: fields,
    file: {
      name: image.filename,
      data,
      mimetype: mimeFromName(image.filename),
      size: data.byteLength,
    },
    overrideAccess: true,
    context: { disableRevalidate: true },
  })
  payload.logger.info(`created media ${media.id} ${image.filename}`)
  return media.id
}

const DISCUSSION: DiscussionEntry[] = [
  {
    author: 'Elena Vasquez',
    role: 'In-house marketing lead, furniture manufacturing',
    date: '2026-10-06',
    depth: 0,
    body: p('The paragraph sits on a sofa retail page. Should AREKS be written up as a furniture store?'),
  },
  expert(
    '2026-10-06',
    p(
      'No. The source calls it a furniture factory that produces upholstered furniture. The supplied recollection adds a family-owned business, a countryside production facility with a surrounding area, and a showroom where customers compare models. That is manufacturing with direct selection, not a retailer or a marketplace.',
    ),
    1,
  ),
  {
    author: 'Elena Vasquez',
    role: 'In-house marketing lead, furniture manufacturing',
    date: '2026-10-07',
    depth: 2,
    body: p('Is that facility open to the public, and how large is the site?'),
  },
  expert(
    '2026-10-07',
    p(
      'Opening hours are not stated, so the showroom is not described as always open. Floor area, headcount, equipment, materials specifications, certifications, and a map are not in the record.',
    ),
    3,
  ),
  {
    author: 'Hiroshi Nakamura',
    role: 'Product information specialist',
    date: '2026-10-08',
    depth: 0,
    body: p(
      'The source lists corner soft sofas, book sofas, eurobooks, accordions, roll-out sofas, armchairs, and armchair beds. Why not add sofa beds, folding sofas, convertible sofas, and recliners as further categories?',
    ),
  },
  expert(
    '2026-10-08',
    p(
      'Those seven labels are the source list. Sofa bed, folding sofa, and convertible sofa overlap them, so they are not extra categories. Recliners are not in the AREKS paragraph, so they are not added.',
    ),
    1,
  ),
  {
    author: 'Claire Fontaine',
    role: 'Content editor',
    date: '2026-10-08',
    depth: 2,
    body: p('Eurobook and book sofa sound like books.'),
  },
  expert(
    '2026-10-08',
    p(
      'Eurobook is the eurobook fold. The book sofa is the other fold, where the seat lifts. Neither is a book, and neither is a reservation form.',
    ),
    3,
  ),
  {
    author: 'Noah Adler',
    role: 'Search editor',
    date: '2026-10-09',
    depth: 2,
    body: p('And accordion, roll-out, and armchair beds?'),
  },
  expert(
    '2026-10-09',
    p(
      'Accordion is the accordion mechanism. Roll-out is the pull-out. Armchair beds are chair beds. Armchairs stay a separate seating category because the source lists them separately.',
    ),
    3,
  ),
  {
    author: 'Lukas Schneider',
    role: 'Web developer',
    date: '2026-10-10',
    depth: 0,
    body: p('The note says Drupal best practices. Do we have a theme or a module list?'),
  },
  expert(
    '2026-10-10',
    p(
      'Drupal is named. A theme, a module, and a version are not. They are not filled in.',
    ),
    1,
  ),
  {
    author: 'Lukas Schneider',
    role: 'Web developer',
    date: '2026-10-11',
    depth: 2,
    body: p('This paragraph is on the House of Sofas page. Is it the same build?'),
  },
  expert(
    '2026-10-11',
    p(
      'No. House of Sofas keeps its own record and its own slug. This paragraph describes a different furniture factory.',
    ),
    1,
  ),
  {
    author: 'Ingrid Berg',
    role: 'Art director',
    date: '2026-10-12',
    depth: 0,
    body: p('How many keywords were in the semantic core?'),
  },
  expert(
    '2026-10-12',
    p(
      'No count is published. The work was competitor-site analysis, a semantic core around product type and quality, and mapping queries onto each segment so the content could be adjusted per category.',
    ),
    1,
  ),
  {
    author: 'Ingrid Berg',
    role: 'Art director',
    date: '2026-10-13',
    depth: 2,
    body: p('Are the competing sites named?'),
  },
  expert(
    '2026-10-13',
    p(
      'No. The source says the analysis identified distinctive product expressions. It does not list the sites or the phrases.',
    ),
    3,
  ),
  {
    author: 'Markus Holtz',
    role: 'Commercial director',
    date: '2026-10-14',
    depth: 0,
    body: p('Was there paid search, and what did two years of work return?'),
  },
  expert(
    '2026-10-14',
    p(
      'The published line is an integrated approach: design, development, copywriting, and SEO, with Drupal practice. A platform, a budget, clicks, and a return are not stated, so none are added. About two years is the recollection. There is no start date and no end date.',
    ),
    1,
  ),
  {
    author: 'Markus Holtz',
    role: 'Commercial director',
    date: '2026-10-15',
    depth: 2,
    body: p('Should the House of Sofas percentages be used here, or an AI-search result?'),
  },
  expert(
    '2026-10-15',
    p(
      'No. Those figures belong to the other case. Nothing in this record was measured as a ChatGPT, Perplexity, or AI Overview citation.',
    ),
    3,
  ),
  {
    author: 'Priya Nair',
    role: 'Showroom manager',
    date: '2026-10-16',
    depth: 0,
    body: p('The gallery looks like specific models. Are those AREKS products?'),
  },
  expert(
    '2026-10-16',
    p(
      'No. The rooms, the corner sofa, the roll-out, the armchairs, and the upholstery detail are illustrative and captioned that way.',
    ),
    1,
  ),
  expert(
    '2026-10-16',
    p(
      'The logo keeps the brown sofa from the source mark and replaces the Cyrillic lettering with AREKS. Upholstered furniture is the English line from the original banner. This discussion is editorial. It is not a conversation with AREKS.',
    ),
    1,
  ),
]

const faqBlock = () => ({
  blockType: 'csFAQ' as const,
  case_study_faq_title: 'Frequently Asked Questions About AREKS',
  items: [
    {
      question: 'What does AREKS manufacture?',
      answer: rt(
        p(
          'Upholstered furniture, from a family-owned factory. The published range is corner sofas, book-mechanism sofas, eurobook sofas, accordion-mechanism sofas, roll-out sofas, armchairs, and chair beds.',
          'The company also has a showroom on the production site, where customers can compare models. Capacity, equipment, and a founding date are not stated.',
        ),
      ),
    },
    {
      question: 'How did the website represent the factory and the showroom?',
      answer: rt(
        p(
          'The site had to present the manufacturing business and the showroom’s selection experience together: furniture types a visitor could compare, not a generic storefront.',
          'Opening hours, online payment, a product configurator, and delivery terms are not in the source, so they are not described as features.',
        ),
      ),
    },
    {
      question: 'How did competitor analysis shape the structure?',
      answer: rt(
        p(
          'Competing sites were analyzed, and a semantic core was built around product type and quality. Queries were then mapped to segments so each category could carry its own content.',
          'Competitor names and the size of that core are not published.',
        ),
      ),
    },
    {
      question: 'Why are sofa beds, folding sofas, and recliners not separate categories?',
      answer: rt(
        p(
          'The source already names the mechanisms: eurobook, book, accordion, and roll-out, plus corner sofas, armchairs, and chair beds. Sofa bed, folding sofa, and convertible sofa overlap those names.',
          'Recliners are not in the AREKS paragraph. Eurobook is a fold, not a book. The book mechanism is the fold where the seat lifts, not a reservation form.',
        ),
      ),
    },
    {
      question: 'What was built, and on what platform?',
      answer: rt(
        p(
          'Design, development, copywriting, and SEO, using Drupal best practices. A theme, a module list, and a Drupal version are not stated.',
          'The recollection of the collaboration is about two years, without a start date or an end date. No traffic or ranking figure is published for this project.',
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
    `<h2>${escapeHtml('Discuss a similar furniture-factory site')}</h2>` +
      p(
        'If the company makes upholstered furniture and also lets people compare it in a showroom, the catalog has to name those products clearly before search or promotion can be read.',
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
  case_study_gallery_title: 'Upholstered Furniture and the Showroom',
  case_study_gallery_images: imageIds,
})

const buildData = (
  previewImageId: number,
  mainImageId: number,
  galleryIds: number[],
  logoId: number,
  primaryCategoryId: number,
  categoryIds: number[],
  siteCategoryIds: number[],
  displayOrder: number,
) => ({
  title: 'AREKS: Website Development and SEO for a Family-Owned Furniture Manufacturer',
  case_study_long_title: 'Building an Online Presence for an Upholstered Furniture Factory',
  slug: SLUG,
  generateSlug: false,
  _status: 'published' as const,
  featured: true,
  displayOrder,
  duration: '2_years' as const,
  company_logo: logoId,

  layout: [
    {
      blockType: 'csPreview' as const,
      case_study_preview_title: 'A Family-Owned Upholstered Furniture Factory',
      case_study_preview_text: rt(
        p(
          'AREKS manufactures upholstered furniture and has a showroom on its production site. The published work was the website, competitor analysis, a semantic keyword core, content for each furniture segment, and SEO on Drupal.',
        ),
      ),
      case_study_preview_image: previewImageId,
    },

    titleBlock('Client Overview'),
    contentBlock(
      p(
        'AREKS is a family-owned manufacturer of upholstered furniture. The production facility sits in a countryside setting, with a large surrounding area, and the company has its own showroom where customers can view, compare, and select furniture.',
        'The website had to represent that manufacturing business and the showroom’s selection experience. It is not treated here as a general furniture retailer or an online marketplace. The collaboration is remembered as about two years. The source does not give a start date or an end date, so two years is the stated window rather than a verified calendar.',
      ),
    ),

    titleBlock('Project Scope'),
    contentBlock(
      p(
        'The documented work is website design and development, information architecture, analysis of competitor websites, semantic keyword research, SEO copywriting, ongoing content management, and search-oriented promotion. Development followed Drupal best practices.',
        'A Drupal theme, a module list, a version, advertising platforms, budgets, and performance figures are not stated, so they are not filled in.',
      ),
    ),

    titleBlock('Website Design and Development'),
    contentBlock(
      p(
        'The site had to show the furniture collection and still read as a factory with a showroom, not as a catalog with no maker behind it. Visual presentation of upholstery and furniture forms sat next to a structure that let someone move between furniture types.',
        'Interactive configurators, online payment, and delivery services are not in the source, so they are not described as features. The historical implementation used Drupal. No theme or module is named.',
      ),
    ),

    titleBlock('Product Taxonomy and Information Architecture'),
    contentBlock(
      p(
        'The published product list is corner sofas, book-mechanism sofas, eurobook sofas, accordion-mechanism sofas, roll-out sofas, armchairs, and chair beds. Corner sofas are the larger soft configurations. Armchairs and chair beds are listed separately.',
        'Several English labels overlap that list, so they are not added as further categories. Sofa beds, folding sofas, and convertible sofas describe the same mechanisms the source already names. Recliners are not in the AREKS paragraph.',
        'Eurobook is the eurobook fold, not a book. The book mechanism is the other fold, where the seat lifts; it is not a reservation form. Accordion is the accordion fold. Roll-out is the pull-out. No model names were added.',
      ),
    ),

    titleBlock('Competitor Analysis and Semantic SEO'),
    contentBlock(
      p(
        'Competing websites were analyzed, and a semantic core was formed around phrases for product type and quality. The source says that work identified distinctive product expressions. Query mapping was then used to tune the content of each segment, rather than one description for the whole collection.',
        'The number of keywords, competitor names, search volumes, ranking positions, and traffic changes are not published, so none are added.',
      ),
    ),

    titleBlock('Content Creation and Management'),
    contentBlock(
      p(
        'Copy and ongoing content management supported both navigation and organic search. Category content was written for the furniture type on that page.',
        'A publishing schedule and a page count are not in the source, so they are not stated.',
      ),
    ),

    titleBlock('Search Promotion'),
    contentBlock(
      p(
        'The source describes an integrated approach: design, development, copywriting, and SEO, taking Drupal practice into account. That is the documented promotion.',
        'A named advertising platform, a budget, click volume, conversions, a campaign structure, and return on ad spend are not published. House of Sofas figures are not used here.',
      ),
    ),

    titleBlock('Conclusion'),
    contentBlock(
      p(
        'Website development, a product architecture built from the published furniture types, competitor analysis, semantic mapping, content management, and Drupal-based SEO practice supported the digital presence of a family-owned upholstered furniture manufacturer with its own showroom.',
        'No ranking, traffic, or sales figure is attached. Market leadership and a guaranteed result are not claimed.',
      ),
    ),

    contentBlock(
      p(
        'Illustrative views of a sofa, a corner sectional, a roll-out sofa, armchairs, and upholstery. These are not verified photographs of AREKS products, the showroom, or the factory. The logo adapts the brown sofa from the source mark.',
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
        'AREKS is a family-owned upholstered furniture manufacturer with a countryside production facility, a large surrounding area, and its own showroom. Capacity, equipment, and headcount are not disclosed.',
      ),
    ),
    products: rt(
      p(
        'Corner sofas, book-mechanism sofas, eurobook sofas, accordion-mechanism sofas, roll-out sofas, armchairs, and chair beds. Named models are not listed.',
      ),
    ),
    materials: rt(
      p(
        'The work is upholstered furniture. Specific fabrics, fillings, and frame specifications are not disclosed.',
      ),
    ),
    applications: rt(
      p(
        'Direct selection from the company’s own range, in a showroom on the production site. Opening hours and a service area are not stated.',
      ),
    ),
  },

  businessChallenge: {
    initialState: rt(
      p(
        'AREKS already manufactured upholstered furniture and could show it in its own showroom. The range covered more than one sofa type and included armchairs and chair beds.',
      ),
    ),
    challenge: rt(
      p(
        'The site had to make that range understandable, and still read as a factory with a place to compare furniture, without collapsing into one generic furniture page.',
      ),
    ),
    goals: rt(
      p(
        'Give each published furniture type its own destination. Map keyword groups onto those pages. Write and maintain category content. Build the site with Drupal practice, without inventing a theme or a metric.',
      ),
    ),
  },

  nicheSegmentation: [
    {
      name: 'Corner sofas',
      description: rt(
        p('Corner soft sofas, the larger configurations in the source list.'),
      ),
      marketingApproach: rt(p('A corner-sofa query is not sent to a general furniture page.')),
    },
    {
      name: 'Folding mechanisms',
      description: rt(
        p(
          'Eurobook, book-mechanism, accordion, and roll-out sofas. Eurobook is not a book. The book mechanism is not a reservation form. Folding, convertible, and sofa-bed labels overlap these and are not separate categories.',
        ),
      ),
      marketingApproach: rt(p('Each mechanism keeps the name a buyer would search.')),
    },
    {
      name: 'Armchairs and chair beds',
      description: rt(
        p('Armchairs and armchair beds, listed separately. Recliners are not in the source paragraph.'),
      ),
      marketingApproach: rt(p('A chair-bed query is not the same URL as an armchair.')),
    },
    {
      name: 'Showroom selection',
      description: rt(
        p('The showroom on the production site, where customers compare models. Hours are not published.'),
      ),
      marketingApproach: rt(p('The showroom is part of the manufacturing offer, not a retail chain.')),
    },
  ],

  digitalEcosystem: rt(
    p(
      'The confirmed digital work is a Drupal website, information architecture, competitor analysis, a semantic keyword core, query mapping, copywriting, and SEO.',
      'A theme, a module, an advertising platform, and a CRM are not named.',
    ),
  ),
  websiteArchitecture: rt(
    p(
      'The catalog follows the published types: corner sofas, book-mechanism sofas, eurobook sofas, accordion-mechanism sofas, roll-out sofas, armchairs, and chair beds.',
      'Exact historic URLs are not reconstructed. Drupal is the named platform. No theme is assigned.',
    ),
  ),
  semanticArchitecture: rt(
    p(
      'Competitor sites were analyzed and a semantic core was built around product type and quality. Queries were mapped to segments so content could be adjusted per category.',
      'No keyword count, search volume, or ranking table is published.',
    ),
  ),

  marketingStrategy: {
    seoAndContentStrategy: rt(
      p(
        'Category content written for the furniture type on that page, maintained as part of ongoing content management, after competitor analysis and query mapping.',
        'No article count and no ranking table are stated.',
      ),
    ),
    leadGenMechanism: rt(
      p(
        'Category pages were meant to match a furniture type and support a showroom visit or an inquiry. Lead volume is not published.',
      ),
    ),
    paidAdvertising: [],
    socialMedia: [],
  },

  aiSearchOptimization: {
    brandAuthorityAndTrust: rt(
      p(
        'This project is a Drupal website, product architecture, semantic SEO, and content for a family-owned upholstered furniture factory. It is not rewritten as an AI-search engagement.',
        'No ChatGPT, Perplexity, or AI Overview result is claimed.',
      ),
    ),
    entityAndGeoStructure: rt(
      p(
        'Corner sofas, the named folding mechanisms, armchairs, and chair beds are related products and different catalog entities. The countryside facility and showroom are not a measured GEO programme, and no place name is assigned.',
      ),
    ),
  },

  implementationProcess: rt(
    p(
      'Confirmed shape of the work: understand the upholstered range and the showroom; analyze competitor sites; build a semantic core and map queries to segments; design and develop the site on Drupal; write and maintain category content; apply SEO practice.',
      'The recollection is about two years. Dates inside that window are not listed.',
    ),
  ),

  timeline: [
    {
      period: 'Phase 1',
      title: 'Separate the factory’s range',
      description: rt(
        p(
          'Upholstered furniture the company makes, with a showroom on the production site, and the published types kept distinct.',
        ),
      ),
    },
    {
      period: 'Phase 2',
      title: 'Competitors, keywords, and mapping',
      description: rt(
        p(
          'Competitor-site analysis, a semantic core around product type and quality, and query mapping onto each segment. No keyword count is published.',
        ),
      ),
    },
    {
      period: 'Phase 3',
      title: 'Drupal site and category content',
      description: rt(
        p(
          'Design, development, copywriting, and SEO using Drupal best practices. Theme and modules are not named.',
        ),
      ),
    },
    {
      period: 'Phase 4',
      title: 'Ongoing content',
      description: rt(
        p(
          'Content management continued so each furniture type kept its own page. A publishing calendar is not stated.',
        ),
      ),
    },
  ],

  resultsSummary: rt(
    p(
      'The documented outcome is a website and category structure for a family-owned upholstered furniture manufacturer with its own showroom: competitor analysis, semantic mapping, Drupal-based design and development, and content managed by furniture type, over the stated window of about two years.',
      'No traffic, ranking, or sales figure is published. None is borrowed from another case.',
    ),
  ),

  metrics: [],
  projectsShowcase: [],

  expertInsight: rt(
    p(
      'The useful distinction is a family factory that also lets people compare upholstered furniture in its own showroom. The catalog has to name the mechanisms in English a buyer can trust: eurobook, book-mechanism, accordion, and roll-out, without turning those words into books, a reservation form, or extra categories.',
      'Drupal is named. A theme is not. A semantic core is named. Its size is not. Where the source is silent, the public line stays silent. This discussion is editorial. It is not a conversation with AREKS.',
    ),
  ),

  clientTestimonial: { quote: null, author: null, position: null, company: null },

  hero: {
    type: 'mediumImpact' as const,
    richText: rtHero(
      p(
        'Website development and SEO for AREKS — a family-owned upholstered furniture manufacturer with its own showroom, not a general furniture store.',
      ),
    ),
    media: mainImageId,
  },

  primary_case_study_category: primaryCategoryId,
  case_study_categories: categoryIds,
  site_categories: siteCategoryIds,

  meta: {
    title: 'AREKS Case Study: Website Development and SEO for a Furniture Manufacturer',
    description:
      'Explore how website design, semantic SEO, content development, and digital promotion supported AREKS, a family-owned upholstered furniture manufacturer with its own showroom.',
    image: previewImageId,
  },
})

const normalizeTitle = (value: unknown) => String(value ?? '').replace(/&amp;/g, '&').trim()

const resolveCategories = async (payload: Awaited<ReturnType<typeof getPayload>>) => {
  const ids: number[] = []
  const seen = new Set<number>()
  const add = (id: number) => {
    if (seen.has(id)) return
    seen.add(id)
    ids.push(id)
  }

  for (const [id, title] of EXPECTED_CATEGORY_IDS) {
    try {
      const doc = await payload.findByID({
        collection: 'case-study-categories',
        id,
        depth: 0,
        overrideAccess: true,
      })
      const actual = normalizeTitle(doc?.title)
      if (actual === title) add(Number(id))
      else payload.logger.warn(`category ${id} is "${actual}", expected "${title}" — skipped`)
    } catch {
      payload.logger.warn(`category ${id} missing — skipped`)
    }
  }

  const foundTitles = new Map<string, number>()
  for (const title of EXTRA_CATEGORY_TITLES) {
    const found = await payload.find({
      collection: 'case-study-categories',
      where: { title: { equals: title } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    const doc = found.docs[0]
    if (!doc) {
      payload.logger.warn(`category title not found: ${title}`)
      continue
    }
    add(Number(doc.id))
    foundTitles.set(title, Number(doc.id))
  }

  const primary =
    foundTitles.get('Upholstered Furniture') ?? foundTitles.get('Furniture Manufacturing')
  if (!primary) throw new Error('Upholstered Furniture and Furniture Manufacturing were not found')
  return { primary, ids }
}

const mapSiteCategories = async (
  payload: Awaited<ReturnType<typeof getPayload>>,
  caseCategoryIds: number[],
) => {
  const siteIds: number[] = []
  for (const id of caseCategoryIds) {
    const doc = await payload.findByID({
      collection: 'case-study-categories',
      id,
      depth: 0,
      overrideAccess: true,
    })
    const slug = doc?.slug
    if (!slug) continue
    const site = await payload.find({
      collection: 'site-categories',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    const match = site.docs[0]
    if (!match) {
      payload.logger.warn(`no site category for slug ${slug}`)
      continue
    }
    siteIds.push(Number(match.id))
  }
  return siteIds
}

const main = async () => {
  const dry = process.argv.includes('--dry')
  const payload = await getPayload({ config })
  const tree = measureCommentTree(buildCommentTree(DISCUSSION))
  const categories = await resolveCategories(payload)
  const siteCategoryIds = await mapSiteCategories(payload, categories.ids)
  const newest = await payload.find({
    collection: 'case-studies',
    sort: '-displayOrder',
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  const nextOrder = Number(newest.docs[0]?.displayOrder ?? 20) + 1

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
          displayOrder: nextOrder,
          galleryImages: GALLERY_IMAGES.length,
          metrics: 0,
          projectsShowcase: 0,
          primaryCategory: categories.primary,
          categories: categories.ids,
          siteCategories: siteCategoryIds.length,
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
      or: [{ slug: { equals: SLUG } }, { slug: { like: 'areks' } }, { title: { like: 'AREKS' } }],
    },
    limit: 5,
    depth: 0,
    overrideAccess: true,
  })

  if (duplicates.docs.some((doc) => doc.slug === 'house-of-sofas-sofa-manufacturer')) {
    throw new Error('Refusing to update the House of Sofas record')
  }

  if (duplicates.docs.length > 1) {
    throw new Error(
      `More than one AREKS case study found: ${duplicates.docs.map((doc) => `${doc.id} ${doc.slug}`).join(', ')}`,
    )
  }

  const previewImageId = await upsertMedia(payload, PREVIEW_IMAGE)
  const mainImageId = await upsertMedia(payload, MAIN_IMAGE)
  const galleryIds: number[] = []
  for (const image of GALLERY_IMAGES) galleryIds.push(await upsertMedia(payload, image))
  const logoId = await upsertMedia(payload, LOGO_IMAGE)

  const existing = duplicates.docs[0]
  const data = buildData(
    previewImageId,
    mainImageId,
    galleryIds,
    logoId,
    categories.primary,
    categories.ids,
    siteCategoryIds,
    existing?.displayOrder ?? nextOrder,
  )

  if (existing) {
    const preserved = {
      ...data,
      slug: existing.slug,
      displayOrder: existing.displayOrder ?? data.displayOrder,
      featured: existing.featured ?? data.featured,
      duration: existing.duration ?? data.duration,
    }
    const updated = await payload.update({
      collection: 'case-studies',
      id: existing.id,
      data: preserved as never,
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
