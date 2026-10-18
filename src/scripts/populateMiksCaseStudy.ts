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
 * Creates the MIKS case study, or updates an existing MIKS record.
 * Source: the published Neolines case page for MIKS Plant.
 * Metrics are the SEO rows on that page. PPC is named only in the closing
 * sentence and has no figures. The page image is a website mockup, so the
 * gallery is illustrative and labeled as such. Duration is "two years or more"
 * from the engagement brief, without a calendar, so the duration field is left unset.
 */
const SLUG = 'miks-industrial-manufacturing'
const IMAGE_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'assets')

const EXPERT = 'Maryan Polyak'
const EXPERT_ROLE = 'Manufacturing Digital Marketing & Web Development Expert'

const CATEGORY_TITLES = [
  'Manufacturing',
  'Manufacturing SEO',
  'Competitor SEO Analysis',
  'Manufacturing Keyword Research',
  'Industrial Website Architecture',
  'Technical Content Marketing',
  'Product SEO',
  'Industrial Website Development',
  'Manufacturing Website Development',
  'Application SEO',
  'Metal Fabrication',
  'Structural Steelwork',
  'Structural Steel',
  'Steel Structures',
  'Metal Manufacturing',
  'Industrial Manufacturing',
  'Industrial SEO',
  'Manufacturing Marketing',
]

const PRIMARY_PREFERENCE = [
  'Metal Fabrication',
  'Structural Steelwork',
  'Structural Steel',
  'Steel Structures',
  'Metal Manufacturing',
  'Industrial Manufacturing',
  'Manufacturing',
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
  filename: 'miks-preview.jpg',
  alt: 'A fabricated steel roof truss standing in a fabrication shop.',
  caption:
    'Illustrative steel truss for the archive card. Not a verified photograph of a MIKS product, the plant, or a completed project.',
}

const MAIN_IMAGE: ImageSpec = {
  filename: 'miks-hero.jpg',
  alt: 'Structural steel beams and columns on the floor of a fabrication bay.',
  caption:
    'Illustrative structural steel. Not a documented MIKS beam, column, or factory photograph.',
}

const GALLERY_IMAGES: ImageSpec[] = [
  {
    filename: 'miks-cabinets.jpg',
    alt: 'Grey metal cabinets and a steel workbench in a workshop.',
    caption:
      'Illustrative metal cabinets and a workbench. Not a MIKS catalog photograph.',
  },
  {
    filename: 'miks-shelving.jpg',
    alt: 'Tall warehouse pallet racking in an empty storage aisle.',
    caption: 'Illustrative warehouse racking. Not a verified MIKS storage system.',
  },
  {
    filename: 'miks-retail.jpg',
    alt: 'Metal shop shelving and mobile display stands in a bright showroom.',
    caption:
      'Illustrative retail shelving and display stands. Not a MIKS installation.',
  },
  {
    filename: 'miks-fabrication.jpg',
    alt: 'A fabrication floor with plate steel, tube, welding booths, and assembled frames.',
    caption:
      'Illustrative fabrication floor. Not a photograph of the MIKS plant or its employees.',
  },
]

const LOGO_IMAGE: ImageSpec = {
  filename: 'miks-logo-en.png',
  alt: 'MIKS logo: a yellow diamond with a black structural mark beside the name MIKS.',
  caption:
    'English adaptation of the source mark. The yellow diamond and structural symbol follow the original. The Cyrillic name was replaced with MIKS. The yellow and black rules sit under the word, as on the source logo.',
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

const sourceMetric = (value: string, label: string, note: string) => ({
  value,
  label,
  description: rt(p(note)),
})

const DISCUSSION: DiscussionEntry[] = [
  {
    author: 'Helen Cho',
    role: 'Industrial Marketing Director',
    depth: 0,
    date: '2026-09-02',
    body: 'The page treats MIKS as a plant with several product families. Is the record a metal supplier, or a manufacturer with its own structural and equipment lines?',
  },
  expert(
    '2026-09-02',
    'A manufacturer. The published range is construction metal structures, metal furniture and equipment, retail and storage equipment, and construction and installation work, plus mini equipment for municipal and construction use. It is not written up as a reseller of someone else’s catalog.',
    1,
  ),
  {
    author: 'Helen Cho',
    role: 'Industrial Marketing Director',
    depth: 2,
    date: '2026-09-03',
    body: 'Beams and trusses get used in buildings and bridges. Does this case say MIKS built those structures?',
  },
  expert(
    '2026-09-03',
    'No. The structural list is beams, columns, trusses, insert elements, gates and doors, and display stands. Components of that kind go into buildings, bridges, and other construction. The source does not say MIKS constructed the buildings or the bridges.',
    3,
  ),
  {
    author: 'Andrej Kovacs',
    role: 'Information Architect',
    depth: 0,
    date: '2026-09-04',
    body: 'How was a catalog this wide kept from becoming one metal-products page?',
  },
  expert(
    '2026-09-04',
    'The site map splits the portfolio. About holds history, partners, and certifications. Construction metal structures hold beams, columns, trusses, insert elements, gates and doors, and display stands. Metal furniture and equipment hold cabinets and workbenches, storage equipment, and medical metal furniture. Retail and storage hold store shelving and display and dividing stands. Construction and installation hold staircases, small architectural elements, prefabricated buildings, and waste disposal systems.',
    1,
  ),
  {
    author: 'Andrej Kovacs',
    role: 'Information Architect',
    depth: 2,
    date: '2026-09-05',
    body: 'I would have added electrical enclosures next to the cabinets. Are they on the source map?',
  },
  expert(
    '2026-09-05',
    'They are not. Cabinets and workbenches are. Electrical enclosures are not a named line on this case, so they are not added as a category.',
    3,
  ),
  {
    author: 'Sofia Berg',
    role: 'Semantic SEO Lead',
    depth: 0,
    date: '2026-09-07',
    body: 'The semantic core is described as high-frequency and niche queries. Which phrases does the source actually name?',
  },
  expert(
    '2026-09-08',
    'Three examples: custom construction beams, medical metal furniture, and industrial shelving. Competitor research was done inside each production area, including structural metalwork, storage systems, medical-grade furniture, and custom metal fixtures. No keyword count for the core, no volumes, and no competitor names are published. The later figure of more than 1,000 additional keywords is an indexing result, not the size of that core.',
    1,
  ),
  {
    author: 'Sofia Berg',
    role: 'Semantic SEO Lead',
    depth: 2,
    date: '2026-09-08',
    body: 'So mapping meant a beam query and a medical-furniture query did not share one URL.',
  },
  expert(
    '2026-09-09',
    'That is the stated purpose. Dedicated pages followed the semantic core, and descriptions were written for the product line on that page. Exact historic URLs are not reconstructed.',
    3,
  ),
  {
    author: 'James Okonkwo',
    role: 'Industrial Content Strategist',
    depth: 0,
    date: '2026-09-10',
    body: 'The About section includes certifications. Which standards are named?',
  },
  expert(
    '2026-09-10',
    'None. The information architecture includes a certifications page. The case does not name a certificate, a standard, or a test method. The product descriptions were written per line, and a page count is not given.',
    1,
  ),
  {
    author: 'Marcus Hale',
    role: 'Technical SEO Consultant',
    depth: 0,
    date: '2026-09-13',
    body: 'Technical SEO lists speed, mobile, structured data, and links. Which schema types, and was the build Drupal?',
  },
  expert(
    '2026-09-14',
    'Structured data is named. A schema type is not, so none is claimed. Page-load work, mobile responsiveness, and link structure are the other technical items. Scores are not published. Drupal appears on neighboring case studies on the same source page. It is not the platform named for MIKS.',
    1,
  ),
  {
    author: 'Marcus Hale',
    role: 'Technical SEO Consultant',
    depth: 2,
    date: '2026-09-14',
    body: 'Five microsites are easy to over-read as five new builds with their own rankings.',
  },
  expert(
    '2026-09-15',
    'The source says five additional microsites were designed for specific product lines, and it names construction structures, retail equipment, shelving systems, and furniture. That is four named lines for five sites. The fifth line, the domains, and any per-site traffic or rankings are not given. I do not treat them as five sites proven to have been built from scratch.',
    3,
  ),
  {
    author: 'Priya Shah',
    role: 'Analytics Lead',
    depth: 0,
    date: '2026-09-16',
    body: 'The results mix percentages and a keyword count. Which rows are growth rates, and over what period?',
  },
  expert(
    '2026-09-17',
    'Growth rates: organic traffic +35%, organic sessions +20%, total sessions +22%, impressions +12%, search clicks +10%, new users +40%, returning users +30%. The keyword row is a count: more than 1,000 additional keywords indexed. The source does not name the measurement window, the baseline, conversions, leads, or revenue.',
    1,
  ),
  {
    author: 'Priya Shah',
    role: 'Analytics Lead',
    depth: 2,
    date: '2026-09-17',
    body: 'Is the thousand a first-page or top-five total?',
  },
  expert(
    '2026-09-18',
    'No. The label is keywords indexed. It is not a ranking-position claim, and it is not a percentage.',
    3,
  ),
  {
    author: 'Laura Bennett',
    role: 'Paid Search Strategist',
    depth: 0,
    date: '2026-09-19',
    body: 'The closing line says SEO and PPC. Where are the paid-search figures?',
  },
  expert(
    '2026-09-20',
    'There are none. PPC is named in that closing sentence and nowhere else with a platform, a budget, clicks, or a result. The click row in the results is the SEO click row, +10%, not a PPC click row.',
    1,
  ),
  {
    author: 'Laura Bennett',
    role: 'Paid Search Strategist',
    depth: 2,
    date: '2026-09-21',
    body: 'And the engagement length. Two years exactly?',
  },
  expert(
    '2026-09-22',
    'A collaboration spanning two years or more. The published page does not give a start date or an end date, so the duration is not shown as a closed two-year term.',
    3,
  ),
]

const faqBlock = () => ({
  blockType: 'csFAQ' as const,
  case_study_faq_title: 'Frequently Asked Questions About MIKS',
  items: [
    {
      question: 'What does MIKS manufacture?',
      answer: rt(
        p(
          'The published range covers construction metal structures, metal furniture and equipment, retail and storage equipment, and construction and installation products. Named items include beams, columns, trusses, insert elements, gates and doors, display stands, metal cabinets and workbenches, storage equipment, medical metal furniture, store shelving, staircases, small architectural elements, prefabricated buildings, and waste disposal systems. Mini equipment for municipal and construction use is also listed. Electrical enclosures are not.',
        ),
      ),
    },
    {
      question: 'How was the website organized around those product lines?',
      answer: rt(
        p(
          'The site separated the families. Construction metal structures, metal furniture and equipment, retail and storage solutions, and construction and installation each had their own section and child pages. About covered history, partners, and certifications. A beam query and a medical-furniture query were not meant to land on one generic metal page.',
        ),
      ),
    },
    {
      question: 'What did the semantic research change?',
      answer: rt(
        p(
          'Competitor research was done inside each production area, and a semantic core mixed broader queries with niche ones. The source names custom construction beams, medical metal furniture, and industrial shelving as examples. Those groups were mapped onto the relevant pages. The size of the core and the competitor names are not published.',
        ),
      ),
    },
    {
      question: 'How did the content differ from a single plant description?',
      answer: rt(
        p(
          'Each product line was written in the terminology of that line, with phrases aimed at the queries for that line. The source does not give a page count or a publishing schedule.',
        ),
      ),
    },
    {
      question: 'Why were additional microsites used?',
      answer: rt(
        p(
          'Five additional microsites were designed so selected product lines could be found on their own. The source names construction structures, retail equipment, shelving systems, and furniture. Domains, a fifth product line, and results for each site are not given, and the five sites are not described as proven new builds from an empty start.',
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
    date: entry.date,
    depth: entry.depth ?? 0,
    isExpert: Boolean(entry.isExpert),
    body: rt(p(entry.body)),
  })),
})

const ctaBlock = () => ({
  blockType: 'cta' as const,
  richText: rtHero(
    `<h2>${escapeHtml('Discuss a similar multi-line plant site')}</h2>` +
      p(
        'If the plant makes structural steel and also cabinets, storage, and installation products, the site has to keep those lines apart before search can be read.',
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
  case_study_gallery_title: 'Structural Steel, Furniture, and Storage',
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
  title: 'MIKS: SEO and Digital Marketing for a Multidisciplinary Industrial Manufacturer',
  case_study_long_title: 'A Website Structure for a Multidisciplinary Metal Manufacturer',
  slug: SLUG,
  generateSlug: false,
  _status: 'published' as const,
  featured: true,
  displayOrder,
  company_logo: logoId,

  layout: [
    {
      blockType: 'csPreview' as const,
      case_study_preview_title: 'Structural Steel and a Wider Metal Portfolio',
      case_study_preview_text: rt(
        p(
          'MIKS manufactures construction metal structures, metal furniture, storage and retail equipment, and installation-related products. The published work organized that range for search and reported the SEO movement below.',
        ),
      ),
      case_study_preview_image: previewImageId,
    },

    titleBlock('Client Overview'),
    contentBlock(
      p(
        'MIKS is an industrial manufacturer, not a reseller of finished metal goods. The published range runs from structural metalwork used in substantial construction to metal furniture, storage equipment, retail systems, and products tied to installation.',
        'Structural components of this kind are used in buildings, bridges, and other construction work. The source does not say MIKS constructed those buildings or bridges. Capacity, equipment lists, headcount, and a plant address are not given.',
        'The collaboration is described as spanning two years or more. The published page does not give a start date or an end date, so that length is not shown as a closed term.',
      ),
    ),

    titleBlock('The Portfolio Problem'),
    contentBlock(
      p(
        'The difficulty was the width of the offer. A buyer looking for a beam, a medical metal cabinet, store shelving, or a staircase is not making the same inquiry. One generic metal-products page would hide the line they came for and give search engines a single, vague subject.',
        'The work was to separate those families, write for each one, and keep the plant readable as one manufacturer.',
      ),
    ),

    titleBlock('Manufacturing Portfolio'),
    contentBlock(
      p(
        'Construction metal structures on the source site: beams, columns, trusses, insert elements, gates and doors, and display stands. Insert elements are kept under that name. They are not expanded into a separate connection-hardware catalog.',
        'Metal furniture and equipment: metal cabinets and workbenches, storage equipment, and medical metal furniture. Electrical enclosures are not named, so they are not added.',
        'Retail and storage: store shelving, and display and dividing stands. The intro also lists retail and storage equipment, industrial cabinets and workbenches, and warehouse and medical furniture.',
        'Construction and installation: staircases, small architectural elements, prefabricated buildings, and waste disposal systems. The intro also lists construction services and mini equipment for municipal and construction applications. The source does not itemize that mini equipment, so no models are added. Prefabricated buildings are a listed product area, not a claim that MIKS delivered complete buildings as a general contractor.',
      ),
    ),

    titleBlock('Website Architecture'),
    contentBlock(
      p(
        'The structure followed the semantic core. Home and About sat above the catalog. About included company history, partners, and certifications. The four catalog families each had dedicated pages for the items above.',
        'That split is what let a navigation label, a category page, and a product description point at the same line. Exact historic URLs are not reconstructed. A platform, a theme, and a module list are not named for this project.',
      ),
    ),

    titleBlock('Semantic Research'),
    contentBlock(
      p(
        'Competitor research was done inside each production area: structural metalwork, storage systems, medical-grade furniture, and custom metal fixtures. The semantic core mixed broader queries with niche ones. The source gives three examples: custom construction beams, medical metal furniture, and industrial shelving.',
        'Those groups were mapped to the pages for the matching line. The size of the core, search volumes, and competitor names are not published.',
      ),
    ),

    titleBlock('Technical SEO'),
    contentBlock(
      p(
        'The technical work covered page-load performance, mobile responsiveness, structured data, and the link structure used for crawling and navigation. A schema type is not named, so none is claimed. No speed score is published.',
      ),
    ),

    titleBlock('Industrial Content'),
    contentBlock(
      p(
        'Each product line was described in the terminology of that line, with phrases aimed at the queries for that line. The catalog was not one plant paragraph repeated under every heading.',
        'A page count and a publishing calendar are not in the source. The certifications page is part of the architecture. The certificates themselves are not named.',
      ),
    ),

    titleBlock('Microsites'),
    contentBlock(
      p(
        'Five additional microsites were designed for specific product lines, so those lines could be found on their own rather than only inside the main catalog. The source names construction structures, retail equipment, shelving systems, and furniture.',
        'That is four named lines for five sites. The fifth line is not named. Domains, individual traffic, and rankings for each site are not given. The source does not establish that all five were built from an empty start.',
      ),
    ),

    titleBlock('What the Figures Are'),
    contentBlock(
      p(
        'The SEO rows are growth rates, except the keyword row, which is a count. Organic traffic grew 35 percent. Organic sessions grew 20 percent. Total sessions grew 22 percent. Impressions grew 12 percent. Search clicks grew 10 percent. New users grew 40 percent. Returning users grew 30 percent. More than 1,000 additional keywords were indexed.',
        'The keyword count is not a first-page total and not a top-five total. The source does not name the measurement window, the baseline, conversions, leads, or revenue. The closing sentence mentions PPC beside SEO. No platform, budget, or PPC result is given, so none is reported. The click row above is the search-click row, not a paid-click row.',
      ),
    ),

    titleBlock('Conclusion'),
    contentBlock(
      p(
        'The documented work gave a multidisciplinary metal manufacturer a site that separated structural steelwork, furniture and equipment, retail and storage, and installation-related products, with content and technical SEO written to those lines, plus microsites for selected lines.',
        'The published movement is the SEO rows above. Market leadership, a named certificate, and a completed bridge or building are not claimed.',
      ),
    ),

    contentBlock(
      p(
        'The photographs are illustrative views of structural steel, a truss, cabinets and a workbench, warehouse racking, retail shelving, and a fabrication floor. They are not verified photographs of the MIKS plant, its employees, or a completed project. The image published with the source case is a website mockup and is not used here.',
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
        'MIKS is presented as a manufacturing plant with several metal lines, from structural components to furniture, storage, retail fixtures, and installation-related products. Capacity, equipment, and headcount are not disclosed. Structural components are used in buildings, bridges, and other construction. The source does not say the company built those structures.',
      ),
    ),
    products: rt(
      p(
        'Beams, columns, trusses, insert elements, gates and doors, display stands, metal cabinets and workbenches, storage equipment, medical metal furniture, store shelving, display and dividing stands, staircases, small architectural elements, prefabricated buildings, waste disposal systems, and mini equipment for municipal and construction use. Electrical enclosures are not listed.',
      ),
    ),
    materials: rt(
      p('The source identifies the products as metal. Grades, coatings, and standards are not named.'),
    ),
    applications: rt(
      p(
        'Construction, storage, retail, medical furniture, and municipal or construction equipment. Industries are implied by those product lines. Named end clients are not published.',
      ),
    ),
  },

  businessChallenge: {
    initialState: rt(
      p(
        'MIKS already made a wide range of metal products, from structural members to furniture, storage, retail fixtures, and installation-related goods. The lines answer different buyers.',
      ),
    ),
    challenge: rt(
      p(
        'A single metal-products page would blur those lines. Search needed a page for the product family, and a visitor needed a path that matched the thing they came to find.',
      ),
    ),
    goals: rt(
      p(
        'Separate the families, map the semantic core onto those pages, write line-specific descriptions, and improve the technical base. Five microsites extended selected lines. A budget and a headcount for the engagement are not stated.',
      ),
    ),
  },

  nicheSegmentation: [
    {
      name: 'Construction metal structures',
      description: rt(
        p(
          'Beams, columns, trusses, insert elements, gates and doors, and display stands. Components for substantial construction, not a claim that MIKS built the buildings or bridges.',
        ),
      ),
      marketingApproach: rt(
        p('A beam or truss query has its own pages, including the example “custom construction beams.”'),
      ),
    },
    {
      name: 'Metal furniture and equipment',
      description: rt(
        p(
          'Metal cabinets and workbenches, storage equipment, and medical metal furniture. Electrical enclosures are not in the source list.',
        ),
      ),
      marketingApproach: rt(p('Medical metal furniture is called out as its own query, not folded into cabinets.')),
    },
    {
      name: 'Retail and storage',
      description: rt(p('Store shelving, and display and dividing stands, plus warehouse storage equipment.')),
      marketingApproach: rt(p('Industrial shelving is one of the niche examples in the semantic core.')),
    },
    {
      name: 'Construction and installation',
      description: rt(
        p(
          'Staircases, small architectural elements, prefabricated buildings, waste disposal systems, construction services, and mini equipment for municipal and construction use. The mini equipment is not itemized.',
        ),
      ),
      marketingApproach: rt(
        p('These pages sit apart from the structural-member pages so a staircase is not filed as a beam.'),
      ),
    },
  ],

  digitalEcosystem: rt(
    p(
      'The confirmed digital work is the main website’s information architecture, semantic mapping, technical SEO, line-specific content, and five microsites for selected product lines.',
      'A CMS platform is not named for MIKS. PPC is mentioned only in the closing sentence, without a platform or a result.',
    ),
  ),
  websiteArchitecture: rt(
    p(
      'Home, About (history, partners, certifications), and four catalog families with the child pages listed in the portfolio section.',
      'Historic URLs are not reconstructed. The relationship that matters is navigation, category, and description pointing at the same product line.',
    ),
  ),
  semanticArchitecture: rt(
    p(
      'A semantic core of broader and niche queries, with competitor research inside each production area. Named examples: custom construction beams, medical metal furniture, industrial shelving.',
      'Queries were mapped to the matching pages. The core’s size is not published. The later count of more than 1,000 additional indexed keywords is a result, not this core.',
    ),
  ),

  marketingStrategy: {
    seoAndContentStrategy: rt(
      p(
        'Line-specific descriptions, written with the terminology and queries of that line, on a structure taken from the semantic core. Technical work covered speed, mobile presentation, structured data without a named schema type, and internal links.',
        'Five microsites gave selected lines their own sites. Domains are not published.',
      ),
    ),
    leadGenMechanism: rt(
      p(
        'The pages were meant to match a buyer to a product family. Lead volume, a form design, and a CRM are not described.',
      ),
    ),
    paidAdvertising: [],
    socialMedia: [],
  },

  aiSearchOptimization: {
    brandAuthorityAndTrust: rt(
      p(
        'This record is a website architecture, content, and SEO engagement for a metal manufacturer. It is not an AI-search programme.',
        'No AI Overview, ChatGPT, or other answer-engine result is claimed. The certifications page exists. The certificates are not named.',
      ),
    ),
    entityAndGeoStructure: rt(
      p(
        'Beams, medical furniture, shelving, and staircases are different entities in the catalog, which is why they have different pages. No city, region, or measured local-search result is published.',
      ),
    ),
  },

  implementationProcess: rt(
    p(
      'Confirmed shape of the work: research competitors inside each production area; build a semantic core and map it to pages; separate the four catalog families; write line-specific descriptions; improve speed, mobile presentation, structured data, and links; support five microsites for selected lines.',
      'The collaboration spans two years or more. Dates inside that window are not listed.',
    ),
  ),

  timeline: [
    {
      period: 'Phase 1',
      title: 'Separate the manufacturing lines',
      description: rt(
        p(
          'Structural metalwork, furniture and equipment, retail and storage, and construction and installation, kept as different offers.',
        ),
      ),
    },
    {
      period: 'Phase 2',
      title: 'Research and map the core',
      description: rt(
        p(
          'Competitor research by production area, a semantic core, and pages aligned to queries such as custom construction beams, medical metal furniture, and industrial shelving.',
        ),
      ),
    },
    {
      period: 'Phase 3',
      title: 'Content and technical SEO',
      description: rt(
        p(
          'Line-specific descriptions, page-load work, mobile responsiveness, structured data without a named type, and the link structure. Scores are not published.',
        ),
      ),
    },
    {
      period: 'Phase 4',
      title: 'Microsites for selected lines',
      description: rt(
        p(
          'Five additional microsites. Named lines: construction structures, retail equipment, shelving systems, and furniture. The fifth line and the domains are not named.',
        ),
      ),
    },
  ],

  resultsSummary: rt(
    p(
      'The documented outcome is a catalog split by manufacturing line, content and technical SEO on that structure, and five microsites for selected lines, over a collaboration of two years or more without published dates.',
      'Organic traffic +35%, organic sessions +20%, and total sessions +22% are three different growth rates. Impressions +12% and search clicks +10% are separate from those. New users +40% and returning users +30% are growth rates, not headcounts. More than 1,000 additional keywords indexed is a count, not a first-page or top-five claim. No measurement window, baseline, conversions, leads, or revenue is published. PPC is named in the source conclusion and has no figures.',
    ),
  ),

  metrics: [
    sourceMetric(
      '+35%',
      'Organic traffic',
      'Organic-traffic growth. Listed separately from organic sessions. The measurement window is not named.',
    ),
    sourceMetric(
      '+20%',
      'Organic sessions',
      'Growth in organic sessions. Not the organic-traffic row and not the total-sessions row.',
    ),
    sourceMetric('+22%', 'Total sessions', 'Growth in total sessions, separate from the organic-session row.'),
    sourceMetric(
      '1,000+',
      'Additional keywords indexed',
      'More than 1,000 additional keywords indexed. A count, not a percentage, and not a claim that those keywords reached the first page or the top five.',
    ),
    sourceMetric('+12%', 'Search impressions', 'Impression growth. The source does not define the property or the date range.'),
    sourceMetric(
      '+10%',
      'Search clicks',
      'Search-click growth. This is the SEO click row. It is not a PPC click figure.',
    ),
    sourceMetric('+40%', 'New users', 'Growth in new users. Not a count of people and not the returning-user row.'),
    sourceMetric(
      '+30%',
      'Returning visits',
      'The source labels this row returning users, +30%. It is a growth rate, not a count of return visits.',
    ),
  ],

  projectsShowcase: [],

  expertInsight: rt(
    p(
      'The useful complexity is a plant that makes structural members and also cabinets, medical furniture, shelving, and installation products. Those lines need different pages. Treating the keyword result as a ranking trophy, or the closing mention of PPC as a campaign report, would invent a result the source does not contain.',
    ),
  ),

  clientTestimonial: { quote: null, author: null, position: null, company: null },

  hero: {
    type: 'mediumImpact' as const,
    richText: rtHero(
      p(
        'SEO and website architecture for MIKS, a metal manufacturer whose range runs from structural components to furniture, storage, and installation products.',
      ),
    ),
    media: mainImageId,
  },

  primary_case_study_category: primaryCategoryId,
  case_study_categories: categoryIds,
  site_categories: siteCategoryIds,

  meta: {
    title: 'MIKS Case Study: SEO for a Multidisciplinary Metal Manufacturer',
    description:
      'Explore how website architecture, industrial content, technical SEO, and product-category optimization supported MIKS, a multidisciplinary metal manufacturer.',
    image: previewImageId,
  },
})

const normalizeTitle = (value: unknown) => String(value ?? '').replace(/&amp;/g, '&').trim()

const resolveCategories = async (payload: Awaited<ReturnType<typeof getPayload>>) => {
  const ids: number[] = []
  const foundTitles = new Map<string, number>()
  const add = (id: number) => {
    if (!ids.includes(id)) ids.push(id)
  }

  for (const title of CATEGORY_TITLES) {
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
    foundTitles.set(normalizeTitle(doc.title), Number(doc.id))
  }

  const primaryTitle = PRIMARY_PREFERENCE.find((title) => foundTitles.has(title))
  const primary = primaryTitle ? foundTitles.get(primaryTitle) : undefined
  if (!primary) throw new Error('No primary manufacturing category was found')
  return { primary, ids, primaryTitle }
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
  const nextOrder = Number(newest.docs[0]?.displayOrder ?? 21) + 1

  if (dry) {
    payload.logger.info(
      JSON.stringify(
        {
          slug: SLUG,
          faqQuestions: faqBlock().items.length,
          discussionEntries: DISCUSSION.length,
          expertReplies: DISCUSSION.filter((entry) => entry.isExpert).length,
          discussionTree: tree,
          duration: null,
          featured: true,
          displayOrder: nextOrder,
          galleryImages: GALLERY_IMAGES.length,
          metrics: 8,
          projectsShowcase: 0,
          primaryCategory: categories.primaryTitle,
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
      or: [{ slug: { equals: SLUG } }, { slug: { like: 'miks' } }, { title: { like: 'MIKS' } }],
    },
    limit: 5,
    depth: 0,
    overrideAccess: true,
  })

  if (duplicates.docs.length > 1) {
    throw new Error(
      `More than one MIKS case study found: ${duplicates.docs.map((doc) => `${doc.id} ${doc.slug}`).join(', ')}`,
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
