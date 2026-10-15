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
 * Creates the House of Sofas case study, or updates the existing record.
 * A sofa manufacturer with its own showroom and direct sales, not a reseller.
 * Duration is the published two-year window, without a verified calendar.
 * 950 is a count of additional keywords in Google rankings, not a top-five total.
 * Top-five keyword performance +30% is left unqualified.
 * Seven ad groups and about 45 ads. PPC platform is unnamed.
 * Gallery images are illustrative. No site_categories.
 */
const SLUG = 'house-of-sofas-sofa-manufacturer'
const IMAGE_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'assets')

const EXPERT = 'Maryan Polyak'
const EXPERT_ROLE = 'Manufacturing Digital Marketing & Web Development Expert'

const SOURCE_NOTE =
  'Published on the source case study. Not independently re-audited. No baseline date or attribution model is stated.'

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
  [274, 'Paid Search & Paid Media'],
  [669, 'Manufacturing'],
  [484, 'Design, Manufacturing & Installation'],
]

const EXTRA_CATEGORY_TITLES = [
  'Sofa Manufacturing',
  'Furniture Manufacturing',
  'Upholstered Furniture',
  'Custom Furniture Manufacturing',
  'Commercial Furniture',
  'Content Marketing',
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

const sourceMetric = (value: string, label: string, detail: string) => ({
  value,
  label,
  description: rt(p(`${detail} ${SOURCE_NOTE}`)),
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
  filename: 'house-of-sofas-preview.jpg',
  alt: 'A compact two-seat sofa in sand boucle with rounded arms and thin black legs.',
  caption:
    'Illustrative sofa for the archive card. Not a verified House of Sofas product photograph.',
}

const MAIN_IMAGE: ImageSpec = {
  filename: 'house-of-sofas-hero.jpg',
  alt: 'A three-seat sofa in rust-orange fabric with walnut legs, in a sunlit living room.',
  caption:
    'Illustrative contemporary sofa. Not a documented House of Sofas model or showroom.',
}

const GALLERY_IMAGES: ImageSpec[] = [
  {
    filename: 'house-of-sofas-sectional.jpg',
    alt: 'A forest-green L-shaped sectional sofa with a chaise in a bright apartment.',
    caption: 'Illustrative sectional configuration. Not a House of Sofas catalog photograph.',
  },
  {
    filename: 'house-of-sofas-sofa-bed.jpg',
    alt: 'A blue sofa bed opened to show the pull-out sleeping surface and the frame.',
    caption:
      'Illustrative sofa bed. Not a verified House of Sofas mechanism and not a technical drawing.',
  },
  {
    filename: 'house-of-sofas-showroom.jpg',
    alt: 'A furniture showroom with several sofas in cream, rust, and charcoal.',
    caption: 'Illustrative showroom. Not a documented House of Sofas location.',
  },
  {
    filename: 'house-of-sofas-upholstery.jpg',
    alt: 'Fabric swatches in rust, green, and sand beside a partially upholstered sofa arm.',
    caption:
      'Illustrative upholstery detail. Not a photograph of the House of Sofas workshop, and not a materials specification.',
  },
]

const LOGO_IMAGE: ImageSpec = {
  filename: 'house-of-sofas-logo-en.png',
  alt: 'House of Sofas logo: the original white house symbol on red, beside the English name House of Sofas.',
  caption:
    'Horizontal English wordmark. The house symbol and red field come from the authentic logo. The Cyrillic lettering was replaced with the English name House of Sofas. The symbol was not redrawn.',
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
    author: 'Henrik Dahl',
    role: 'Technical SEO specialist',
    date: '2027-01-06',
    depth: 0,
    body: p(
      'The source page calls House of Sofas a furniture retailer. Should the case keep that wording?',
    ),
  },
  expert(
    '2027-01-06',
    p(
      'No. The company manufactures sofas, runs its own showroom, and sells its own products. A retailer or reseller frame hides the manufacturing business the site had to explain.',
      'Showroom access, the product range, and promotions stay. Production volume, headcount, equipment, and certifications are not in the source, so they are not added.',
    ),
    1,
  ),
  {
    author: 'Elena Petrova',
    role: 'In-house manufacturing marketer',
    date: '2027-01-07',
    depth: 2,
    body: p('Does a showroom make the company a store rather than a factory?'),
  },
  expert(
    '2027-01-07',
    p(
      'The showroom is how customers see the sofas the company makes. It is part of the sales operation, not a reason to describe the business as a general furniture shop.',
    ),
    3,
  ),
  {
    author: 'Thomas Weber',
    role: 'Web information architect',
    date: '2027-01-07',
    depth: 0,
    body: p(
      'The catalog list includes Euro-Books, Book Sofas, Dolphins, and both Couches and Sofas. Which of those are real categories?',
    ),
  },
  expert(
    '2027-01-07',
    p(
      'Eurobook sofas are the eurobook mechanism: the seat moves forward and the back drops. That is not a book category. Book-mechanism sofas are the other fold, where the seat lifts. That is not a reservation page, even though the word book can be misread as booking.',
      'Dolphin-mechanism sofas are the dolphin pull-out bed mechanism, not a themed product. Couches and sofas are listed separately in the source and are one general sofa category here, not two lines.',
    ),
    1,
  ),
  {
    author: 'Clara Jensen',
    role: 'Content strategist',
    date: '2027-01-08',
    depth: 2,
    body: p('Should modular sofas be a category of their own, next to sectionals?'),
  },
  expert(
    '2027-01-08',
    p(
      'No. The published catalog label is sectional sofas, and the keyword examples include corner sofas. A second modular category would split one intent. Click-clack, pull-out, accordion, sofa beds, ottomans, and recliner chairs stay separate because the source lists them separately.',
    ),
    3,
  ),
  {
    author: 'James Whitaker',
    role: 'Performance analyst',
    date: '2027-01-08',
    depth: 2,
    body: p('And we do not invent model names to fill the gaps?'),
  },
  expert(
    '2027-01-08',
    p(
      'Correct. The categories are the taxonomy. Named models, fabrics, and dimensions are not in the source extract, so they are not created.',
    ),
    3,
  ),
  {
    author: 'Sophie Laurent',
    role: 'Search analyst',
    date: '2027-01-09',
    depth: 0,
    body: p(
      'Can we say 950 keywords reached the first page, and that top-five performance means 30 percent more keywords?',
    ),
  },
  expert(
    '2027-01-09',
    p(
      'No. The source reports an increase of 950 keywords in Google rankings. That is a count of additional keywords with improved positions. It does not say that all 950 reached the first page or the top five.',
      'The separate +30 percent is labeled top-five keyword performance. The source does not say whether that change is position, clicks, or another measure. It is not a count of keywords.',
    ),
    1,
  ),
  {
    author: 'Anna Kovacs',
    role: 'Analytics lead',
    date: '2027-01-10',
    depth: 2,
    body: p(
      'Organic traffic is +35 percent and organic visits are +12 percent. Same result twice?',
    ),
  },
  expert(
    '2027-01-10',
    p(
      'No. The source prints organic traffic and organic sessions as separate rows. Visits here means that sessions row. Total sessions are a third row, at +16 percent. None of them is revenue.',
    ),
    3,
  ),
  {
    author: 'Priya Shah',
    role: 'Paid media specialist',
    date: '2027-01-11',
    depth: 0,
    body: p(
      'Seven ad groups and about 45 ads. Is that seven campaigns, and do the conversions mean sofas sold?',
    ),
  },
  expert(
    '2027-01-11',
    p(
      'Seven ad groups, not seven campaigns, and around 45 advertisements, not an exact count. The platform, the budget, and return on ad spend are not named.',
      'PPC conversions grew +95 percent and the conversion rate grew +65 percent. Those are different rows. The source does not define a conversion as a completed sofa sale, so I will not call it one.',
    ),
    1,
  ),
  {
    author: 'David Okonkwo',
    role: 'B2B demand generation',
    date: '2027-01-12',
    depth: 0,
    body: p(
      'The source says two years, showrooms in several cities, and sales growth. How tight can that be?',
    ),
  },
  expert(
    '2027-01-12',
    p(
      'The published source says the collaboration lasted two years. It does not give a start or an end, so two years is the stated window, not a verified calendar, and it is not extended past that.',
      'Showrooms in more than one city, and support for sales growth, stay in that measured form. City names and a revenue figure are not published.',
    ),
    1,
  ),
  {
    author: 'Ingrid Berg',
    role: 'Art director',
    date: '2027-01-13',
    depth: 0,
    body: p('Are the sofas and the showroom in the gallery their products?'),
  },
  expert(
    '2027-01-13',
    p(
      'No. The logo uses the authentic house symbol and the red field, with the English name House of Sofas in place of the Cyrillic lettering. The room, the sectional, the sofa bed, the showroom, and the upholstery detail are illustrative and captioned that way.',
    ),
    1,
  ),
  {
    author: 'Lukas Schneider',
    role: 'Web developer',
    date: '2027-01-14',
    depth: 0,
    body: p(
      'A later note on the source page mentions Drupal and another furniture factory. Is that this build?',
    ),
  },
  expert(
    '2027-01-14',
    p(
      'No. That paragraph describes a different project. House of Sofas is not assigned a CMS or a programming stack from it. Page speed, structured data, and mobile presentation are named for this site, without scores or a schema type.',
    ),
    1,
  ),
  {
    author: 'Noah Adler',
    role: 'Search editor',
    date: '2027-01-15',
    depth: 2,
    body: p('Has any of this been measured in AI search?'),
  },
  expert(
    '2027-01-15',
    p(
      'Not in this record. Category pages and care content are useful groundwork. They are not a ChatGPT, Perplexity, or AI Overview result. This discussion is editorial. It is not a conversation with House of Sofas.',
    ),
    3,
  ),
]

const faqBlock = () => ({
  blockType: 'csFAQ' as const,
  case_study_faq_title: 'Frequently Asked Questions About House of Sofas',
  items: [
    {
      question: 'What kind of company is House of Sofas?',
      answer: rt(
        p(
          'A sofa manufacturer with its own showroom and direct sales. The site had to present the sofas the company makes, help people find the showroom, and surface promotions. It is not described here as a general furniture retailer, a marketplace, or a reseller.',
          'Production volume, factory capacity, headcount, equipment, and certifications are not published.',
        ),
      ),
    },
    {
      question: 'How did the website structure help customers explore sofa categories?',
      answer: rt(
        p(
          'Navigation covered home, about, promotions, the product catalog, a blog, and contact. Inside the catalog, sectional sofas, sofa beds, ottomans, sofas, eurobook sofas, book-mechanism sofas, dolphin-mechanism sofas, click-clack sofas, pull-out sofas, accordion-mechanism sofas, and recliner chairs were separate destinations.',
          'Eurobook and book-mechanism are two folding mechanisms, not books and not a reservation form. Dolphin-mechanism is a pull-out bed mechanism. Couches and sofas in the source list are one general category.',
        ),
      ),
    },
    {
      question: 'What role did keyword research play in the SEO strategy?',
      answer: rt(
        p(
          'Keyword and competitor research supplied the terms that the category pages had to answer, including sectional sofa, sofa bed, eurobook sofa, and recliner chairs, plus longer queries such as a modern sofa bed or a corner sofa.',
          'Those examples are the ones named in the source. They were mapped onto the catalog rather than left on a single homepage.',
        ),
      ),
    },
    {
      question: 'What types of content supported organic search visibility?',
      answer: rt(
        p(
          'Each product category received a description aimed at that product’s search intent. The blog covered professional advice, product information, and sofa care, including materials, comfort-related features, and maintenance.',
          'Article titles, studies, and unverified technical claims are not added. The same content program does not promise another manufacturer the same result.',
        ),
      ),
    },
    {
      question: 'How was the PPC campaign structured?',
      answer: rt(
        p(
          'The source describes seven ad groups and around 45 targeted advertisements. Those are groups and ads, not seven campaigns. Messages covered different stages of the buying journey and the verified points of showroom access, product variety, and promotions.',
          'Bids and audience targeting were adjusted. The platform, the budget, and return on ad spend are not named.',
        ),
      ),
    },
    {
      question: 'Which SEO and PPC performance indicators improved?',
      answer: rt(
        p(
          'The source reports organic traffic +35%, organic visits +12%, total sessions +16%, an increase of 950 keywords in Google rankings, top-five keyword performance +30%, impressions +8%, clicks +7%, new users +40%, and returning visits +20%.',
          'On paid search it reports clicks +25%, conversions +95%, average CPC -3%, cost per conversion -28%, click-through rate +85%, and conversion rate +65%. The 950 figure is a count of additional keywords with improved positions, not a top-five total. Conversion growth is not defined as completed sofa sales.',
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
    `<h2>${escapeHtml('Discuss a similar sofa catalog and showroom site')}</h2>` +
      p(
        'If the company manufactures sofas and also sells them from its own showroom, the catalog, the mechanisms, and the showroom have to stay understandable before SEO or paid search can be read clearly.',
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
  case_study_gallery_title: 'Sofas, Mechanisms, and the Showroom',
  case_study_gallery_images: imageIds,
})

const buildData = (
  previewImageId: number,
  mainImageId: number,
  galleryIds: number[],
  logoId: number,
  primaryCategoryId: number,
  categoryIds: number[],
  displayOrder: number,
) => ({
  title: 'House of Sofas: SEO, PPC and Website Development for a Sofa Manufacturer',
  case_study_long_title: 'Growing Online Visibility for a Sofa Manufacturing Business',
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
      case_study_preview_title: 'A Sofa Manufacturer with Its Own Showroom',
      case_study_preview_text: rt(
        p(
          'House of Sofas manufactures sofas and sells them from its own showroom. The published work covered the website, a catalog of sofa types and folding mechanisms, technical and on-page SEO, category and blog content, and paid search with seven ad groups and around 45 ads.',
        ),
      ),
      case_study_preview_image: previewImageId,
    },

    titleBlock('Client Overview'),
    contentBlock(
      p(
        'House of Sofas is a sofa manufacturer with its own showroom and sales operation. The collection covers more than one sofa type and more than one folding mechanism, and customers could see products in person as well as on the site.',
        'The website had to represent that manufacturing business and still help someone find the showroom, see a promotion, and compare models. It is not treated here as a general furniture retailer, a marketplace, or a reseller. The published source describes a two-year collaboration. It does not give a start date or an end date, so two years is the stated window rather than a verified calendar.',
      ),
    ),

    titleBlock('Project Scope'),
    contentBlock(
      p(
        'The documented work is website development, SEO strategy and keyword research, the information architecture, technical and on-page SEO, product-category content, informational blog content, ongoing content support, and PPC management.',
        'Project dates inside that two-year window, campaign budgets, a named advertising platform, and a programming stack are not stated, so they are not filled in.',
      ),
    ),

    titleBlock('Website Structure and Navigation'),
    contentBlock(
      p(
        'The navigation was kept short: home, about, promotions, the product catalog, a blog, and contact. That put the catalog, the showroom details, current promotions, and a way to inquire within one structure instead of a long product menu at the top.',
        'Inside the catalog, the published categories are sectional sofas, sofa beds, ottomans, sofas, eurobook sofas, book-mechanism sofas, dolphin-mechanism sofas, click-clack sofas, pull-out sofas, accordion-mechanism sofas, and recliner chairs. Sectional sofas are the larger configurations, including the corner-sofa queries named in the research. Couches and sofas appear as two labels in the source and are one general sofa category here.',
        'A few source labels are mechanisms, not themes. Eurobook is the eurobook fold, not a book. The book mechanism is the other fold, where the seat lifts; it is not a reservation form. Dolphin is the dolphin pull-out bed mechanism, not a themed product. Click-clack, pull-out, and accordion stay as their own categories because the source lists them separately. No model names were added.',
      ),
    ),

    titleBlock('Technical and On-Page SEO'),
    contentBlock(
      p(
        'Technical work named in the source covered page-load performance, structured data, and mobile presentation, alongside a structure search engines could crawl by category. Category pages were optimized around the product each page actually sold.',
        'No performance score, schema type, Core Web Vitals figure, or mobile ranking change is published, so none is added.',
      ),
    ),

    titleBlock('Keyword Research and Content Development'),
    contentBlock(
      p(
        'Keyword and competitor research set the map for the catalog. Named examples include sectional sofa, sofa bed, eurobook sofa, and recliner chairs, and longer queries such as modern sofa bed, reclining sectional sofa, and affordable corner sofa. Category copy used the terms that matched that page, including higher-intent product queries, rather than one description repeated across the range.',
        'The blog carried professional advice, product information, and sofa care. The source also describes explanations of materials, comfort-related features, and maintenance. Those subjects are the content strategy. Article titles, studies, and technical claims that are not in the source are not invented. Product pages and informational pages together covered someone choosing a mechanism and someone learning how to look after a sofa.',
      ),
    ),

    titleBlock('PPC Campaign Strategy'),
    contentBlock(
      p(
        'Paid search sat beside the organic catalog. The source describes seven ad groups and around 45 targeted advertisements. That is a group structure, not seven separate campaigns, and 45 is approximate.',
        'Ad messages addressed different stages of the buying journey and the points the source actually names: showroom access, product variety, and promotions. Campaigns were monitored, with adjustments to bids and audience targeting. The platform, the budget, return on ad spend, and a lead count are not published.',
      ),
    ),

    titleBlock('Results'),
    contentBlock(
      p(
        'The figures below are the published source results. They are not a new analytics audit. Organic traffic and organic visits are separate rows. The visit row is the source’s organic-sessions figure. The keyword figure is an increase of 950 keywords in Google rankings: a count of additional keywords with improved positions, not a claim that all 950 reached the first page or the top five. Top-five keyword performance is a separate +30 percent, and the source does not define that measure. PPC conversion growth and conversion-rate growth are also separate, and a conversion is not defined as a completed sofa sale.',
      ) +
        ul([
          'Organic traffic: +35%',
          'Organic visits: +12%',
          'Total sessions: +16%',
          'Keyword visibility: 950 additional keywords with improved Google search positions',
          'Top-five keyword performance: +30%',
          'Impressions: +8%',
          'Clicks: +7%',
          'New users: +40%',
          'Returning visits: +20%',
          'PPC clicks: +25%',
          'PPC conversions: +95%',
          'PPC average cost per click: -3%',
          'PPC cost per conversion: -28%',
          'PPC click-through rate: +85%',
          'PPC conversion rate: +65%',
        ]) +
        p(
          'None of these percentages is converted into an absolute total. A measurement period inside the two-year window, a baseline, an attribution model, and an advertising budget are not stated.',
        ),
    ),

    titleBlock('Conclusion'),
    contentBlock(
      p(
        'Website structure, technical and on-page SEO, product-focused content, and PPC optimization strengthened House of Sofas’ search visibility and the reported conversion performance.',
        'The source says this supported the company’s presence in more than one city and supported sales growth. Cities are not named, and no revenue figure is attached to the campaigns. Market leadership and a guaranteed result are not claimed.',
      ),
    ),

    contentBlock(
      p(
        'Illustrative views of a sofa, a sectional, a sofa bed, a showroom, and upholstery. These are not verified photographs of House of Sofas products, showrooms, or a factory. The logo uses the authentic house symbol.',
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
        'House of Sofas is documented as a sofa manufacturer that also operates its own showroom and sells its products directly. Capacity, equipment, and headcount are not disclosed.',
      ),
    ),
    products: rt(
      p(
        'Sectional sofas, sofa beds, ottomans, sofas, eurobook sofas, book-mechanism sofas, dolphin-mechanism sofas, click-clack sofas, pull-out sofas, accordion-mechanism sofas, and recliner chairs. Named models are not listed.',
      ),
    ),
    materials: rt(
      p(
        'Content discussed materials, comfort-related features, and care. Specific fabrics, fillings, and frame specifications are not disclosed.',
      ),
    ),
    applications: rt(
      p(
        'Direct sales of the company’s own sofa range, with showroom visits in more than one city. City names are not published.',
      ),
    ),
  },

  businessChallenge: {
    initialState: rt(
      p(
        'House of Sofas already manufactured sofas and sold them from its own showroom. The range included several types and folding mechanisms.',
      ),
    ),
    challenge: rt(
      p(
        'The site had to make that range understandable, and still lead someone to the showroom, a promotion, or an inquiry, without reading as a general furniture store.',
      ),
    ),
    goals: rt(
      ul([
        'Give each sofa type and mechanism its own catalog destination',
        'Keep promotions, showroom information, and contact next to the catalog',
        'Write category and care content from the keyword research',
        'Run paid search in seven ad groups without inventing a platform or a budget',
      ]),
    ),
  },

  nicheSegmentation: [
    {
      name: 'Sectional sofas and sofa beds',
      description: rt(
        p(
          'Sectional and corner configurations, plus sofa beds. The sectional label is the published category. A separate modular category is not added.',
        ),
      ),
      marketingApproach: rt(p('A sectional query and a sofa-bed query do not share one URL.')),
    },
    {
      name: 'Folding mechanisms',
      description: rt(
        p(
          'Eurobook, book-mechanism, dolphin-mechanism, click-clack, pull-out, and accordion sofas. Eurobook is not books. The book mechanism is not a reservation form. Dolphin is not a theme.',
        ),
      ),
      marketingApproach: rt(
        p('Each mechanism keeps the name a buyer would search, in plain English.'),
      ),
    },
    {
      name: 'Sofas, ottomans, and recliner chairs',
      description: rt(
        p(
          'The general sofa category, ottomans, and recliner chairs. Couches and sofas in the source are one category.',
        ),
      ),
      marketingApproach: rt(p('A recliner query is not sent to a sofa-bed page.')),
    },
    {
      name: 'Showroom, promotions, and contact',
      description: rt(
        p('Showroom information, promotions, and contact, beside the catalog rather than inside a product type.'),
      ),
      marketingApproach: rt(
        p('A promotion or a showroom visit is a destination of its own.'),
      ),
    },
  ],

  digitalEcosystem: rt(
    p(
      'The confirmed digital work is the website and catalog, SEO content, technical and on-page work, a blog, and PPC with seven ad groups and around 45 ads.',
      'The advertising platform, CRM, and implementation stack are not named.',
    ),
  ),
  websiteArchitecture: rt(
    p(
      'Published navigation: home, about, promotions, product catalog, blog, and contact. Catalog categories: sectional sofas, sofa beds, ottomans, sofas, eurobook sofas, book-mechanism sofas, dolphin-mechanism sofas, click-clack sofas, pull-out sofas, accordion-mechanism sofas, and recliner chairs.',
      'Exact historic URLs are not reconstructed.',
    ),
  ),
  semanticArchitecture: rt(
    p(
      'Keyword research was mapped onto those categories. Named examples include sectional sofa, sofa bed, eurobook sofa, recliner chairs, modern sofa bed, reclining sectional sofa, and affordable corner sofa.',
      'The visibility result is an increase of 950 keywords in Google rankings. That is a count. It is not 950 first-page or top-five rankings. Top-five keyword performance of +30 percent is a separate, undefined measure.',
    ),
  ),

  marketingStrategy: {
    seoAndContentStrategy: rt(
      p(
        'Category descriptions aligned to product-specific and high-intent queries, plus blog content on advice, products, care, materials, comfort-related features, and maintenance.',
        'No article count and no ranking table beyond the source figures are stated.',
      ),
    ),
    leadGenMechanism: rt(
      p(
        'Organic pages and paid search were meant to match a sofa type or a showroom visit, then allow contact. Lead volume is not published, and a conversion is not defined as a completed sale.',
      ),
    ),
    paidAdvertising: [
      {
        channel: 'other' as const,
        strategy: rt(
          p(
            'Paid search for a sofa manufacturer’s own range, with messages on showroom access, variety, and promotions.',
            'The platform is not named on the House of Sofas source.',
          ),
        ),
        campaignStructure: rt(
          p(
            'Seven ad groups and around 45 targeted advertisements, across stages of the buying journey. These are ad groups, not seven campaigns.',
          ),
        ),
        results: rt(
          p(
            'Source-reported PPC changes, kept separate from the organic rows: clicks +25%, conversions +95%, average CPC -3%, cost per conversion -28%, click-through rate +85%, conversion rate +65%.',
            'Conversion growth is not a count of sofas sold. Budget and return on ad spend are not stated.',
          ),
        ),
      },
    ],
    socialMedia: [],
  },

  aiSearchOptimization: {
    brandAuthorityAndTrust: rt(
      p(
        'This project is website structure, technical and on-page SEO, category and care content, and PPC for a sofa manufacturer with a showroom. It is not rewritten as an AI-search engagement.',
        'No ChatGPT, Perplexity, or AI Overview result is claimed.',
      ),
    ),
    entityAndGeoStructure: rt(
      p(
        'Sofa types and folding mechanisms are related products and different catalog entities. Showrooms in more than one city are noted without naming the cities. That is not a measured GEO programme.',
      ),
    ),
  },

  implementationProcess: rt(
    p(
      'Confirmed shape of the work: research keywords and competitors; map a catalog of sofa types and mechanisms; build navigation for promotions, the showroom, and contact; write category and care content; improve page speed, structured data, and mobile presentation without published scores; run and adjust paid search.',
      'The published collaboration window is two years. Dates inside it are not listed.',
    ),
  ),

  timeline: [
    {
      period: 'Phase 1',
      title: 'Separate the manufacturer’s range',
      description: rt(
        p(
          'Sofas the company makes, sold from its own showroom, with types and folding mechanisms kept distinct.',
        ),
      ),
    },
    {
      period: 'Phase 2',
      title: 'Catalog, keywords, and content',
      description: rt(
        p(
          'Category architecture, keyword mapping, category descriptions, and blog material on advice, care, materials, and maintenance.',
        ),
      ),
    },
    {
      period: 'Phase 3',
      title: 'Technical and on-page SEO',
      description: rt(
        p(
          'Page-load work, structured data, and mobile presentation. Scores and schema types are not published.',
        ),
      ),
    },
    {
      period: 'Phase 4',
      title: 'PPC beside ongoing SEO',
      description: rt(
        p(
          'Seven ad groups and around 45 ads, with bid and audience adjustments. Platform and budget are not named.',
        ),
      ),
    },
  ],

  resultsSummary: rt(
    p(
      'The documented outcome is a catalog and content structure for a sofa manufacturer with its own showroom, plus technical and on-page SEO and paid search of seven ad groups and around 45 ads, over the stated two-year window.',
      'The 950-keyword result is a count of improved Google positions, not a first-page or top-five total. Top-five keyword performance of +30% is not read as more keywords. PPC conversions are not read as completed sales. Cities and revenue are not specified.',
    ),
  ),

  metrics: [
    sourceMetric('+35%', 'Organic traffic', 'Organic-traffic growth. Listed separately from organic visits.'),
    sourceMetric(
      '+12%',
      'Organic visits',
      'The source lists this row as organic sessions. It is kept separate from organic traffic.',
    ),
    sourceMetric('+16%', 'Total sessions', 'Growth in total sessions.'),
    sourceMetric(
      '950',
      'Additional keywords in Google rankings',
      'An increase of 950 keywords in Google rankings. This is a count of additional keywords with improved positions, not a percentage, and not a claim that all 950 reached the first page or the top five.',
    ),
    sourceMetric(
      '+30%',
      'Top-five keyword performance',
      'The source labels this top-five keyword performance. It does not say whether the change is position, clicks, impressions, or another measure. It is not a count of keywords.',
    ),
    sourceMetric('+8%', 'Impressions', 'Search-impression growth.'),
    sourceMetric('+7%', 'SEO clicks', 'Organic click growth, kept separate from PPC clicks.'),
    sourceMetric('+40%', 'New users', 'Growth in new users.'),
    sourceMetric('+20%', 'Returning visits', 'Growth in returning visits.'),
    sourceMetric('+25%', 'PPC clicks', 'Paid-search click growth. Not the organic click row.'),
    sourceMetric(
      '+95%',
      'PPC conversions',
      'Paid-search conversion growth. Not defined as completed sofa sales, and not the conversion-rate row.',
    ),
    sourceMetric('-3%', 'PPC average CPC', 'Reduction in average cost per click.'),
    sourceMetric('-28%', 'PPC cost per conversion', 'Reduction in cost per conversion.'),
    sourceMetric('+85%', 'PPC click-through rate', 'Paid-search CTR growth.'),
    sourceMetric('+65%', 'PPC conversion rate', 'Paid-search conversion-rate growth, separate from conversion count.'),
  ],

  projectsShowcase: [
    {
      projectName: 'Sofa catalog and mechanisms',
      description: rt(
        p(
          'Sectional sofas, sofa beds, and the named folding mechanisms, with eurobook, book-mechanism, and dolphin-mechanism labeled as mechanisms. Gallery images are illustrative.',
        ),
      ),
    },
    {
      projectName: 'Showroom, promotions, and contact',
      description: rt(
        p(
          'Showroom information and promotions kept beside the catalog. Cities are not named.',
        ),
      ),
    },
    {
      projectName: 'Category content and paid search',
      description: rt(
        p(
          'Category descriptions, care content, and seven ad groups with around 45 ads. The platform is unnamed.',
        ),
      ),
    },
  ],

  expertInsight: rt(
    p(
      'The useful distinction is a manufacturer that also sells from its own showroom. The catalog has to name mechanisms in English a buyer can trust: eurobook, book-mechanism, and dolphin-mechanism, without turning those words into books, a reservation form, or a theme.',
      'Nine hundred and fifty additional keywords is a count of improved Google positions, not a top-five list. The +30 percent on top-five keyword performance stays unqualified. Seven ad groups are not seven campaigns. PPC conversions are not documented as sofas sold.',
      'Where the source is silent — a platform, a budget, city names, revenue, a schema score — the correct public line is Not disclosed. This discussion is editorial. It is not a conversation with House of Sofas.',
    ),
  ),

  clientTestimonial: { quote: null, author: null, position: null, company: null },

  hero: {
    type: 'mediumImpact' as const,
    richText: rtHero(
      p(
        'Website development, SEO, and PPC for House of Sofas — a sofa manufacturer with its own showroom and sales operation, not a general furniture store.',
      ),
    ),
    media: mainImageId,
  },

  primary_case_study_category: primaryCategoryId,
  case_study_categories: categoryIds,

  meta: {
    title: 'House of Sofas Case Study: SEO and PPC for a Sofa Manufacturer',
    description:
      'See how website development, technical SEO, product-focused content, and PPC optimization helped House of Sofas, a sofa manufacturer with its own showroom, improve online visibility and conversion performance.',
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

  const primary = foundTitles.get('Sofa Manufacturing') ?? foundTitles.get('Furniture Manufacturing')
  if (!primary) throw new Error('Sofa Manufacturing and Furniture Manufacturing categories were not found')
  return { primary, ids }
}

const main = async () => {
  const dry = process.argv.includes('--dry')
  const payload = await getPayload({ config })
  const tree = measureCommentTree(buildCommentTree(DISCUSSION))
  const categories = await resolveCategories(payload)
  const newest = await payload.find({
    collection: 'case-studies',
    sort: '-displayOrder',
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  const nextOrder = Number(newest.docs[0]?.displayOrder ?? 19) + 1

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
          metrics: 15,
          paidAds: 1,
          primaryCategory: categories.primary,
          categories: categories.ids,
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
        { slug: { like: 'house-of-sofas' } },
        { title: { like: 'House of Sofas' } },
      ],
    },
    limit: 5,
    depth: 0,
    overrideAccess: true,
  })

  if (duplicates.docs.length > 1) {
    throw new Error(
      `More than one House of Sofas case study found: ${duplicates.docs.map((doc) => `${doc.id} ${doc.slug}`).join(', ')}`,
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
