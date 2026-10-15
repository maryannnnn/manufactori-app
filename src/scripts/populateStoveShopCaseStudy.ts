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
 * Creates or updates the Stove Shop Case Study.
 * Seven-year SEO, Google Ads, Google Merchant Center, and e-commerce
 * architecture for heating, sauna, fireplace, chimney, and installation.
 * Metrics are source-reported from the published Neolines Stove Shop page.
 * Not independently re-audited. Gallery/hero images are illustrative.
 * English logo is an adaptation of the authentic source mark.
 * Google Ads and Google Merchant Center only. No site_categories.
 */
const SLUG = 'stove-shop-heating-sauna-solutions'
const IMAGE_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'assets')

const EXPERT = 'Maryan Polyak'
const EXPERT_ROLE = 'Manufacturing Digital Marketing & Web Development Expert'

const PRIMARY_CASE_STUDY_CATEGORY = 196
const CASE_STUDY_CATEGORIES = [
  196, 204, 197, 218, 200, 210,
  239, 226, 237, 235, 236, 227,
  311, 323, 326, 330, 328, 320,
  274, 278, 280, 289, 275, 282,
  573, 575, 576, 577, 578, 579, 592,
  421, 417, 426, 425,
  484, 751, 669, 670, 969,
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
  filename: 'stove-shop-sauna-stove-preview.jpg',
  alt: 'Wood-fired sauna stove with a stone cage installed in a timber bath interior beside cedar benches.',
  caption:
    'Illustrative sauna stove in a timber bath interior. Not a documented Stove Shop project photograph.',
}

const MAIN_IMAGE: ImageSpec = {
  filename: 'stove-shop-fireplace-interior.jpg',
  alt: 'Cast-iron wood-burning stove on a stone hearth in a sunlit living room with stacked firewood.',
  caption:
    'Illustrative residential stove installation. Not a verified photograph of a Stove Shop showroom or client home.',
}

const GALLERY_IMAGES: ImageSpec[] = [
  {
    filename: 'stove-shop-sauna-interior.jpg',
    alt: 'Two-level cedar sauna with a wood-fired heater, stone surround, and under-bench lighting.',
    caption:
      'Illustrative sauna and Russian-bath interior. Not a named Stove Shop construction project.',
  },
  {
    filename: 'stove-shop-chimney-installation.jpg',
    alt: 'Stainless-steel insulated chimney kit rising from a wood stove through a ceiling connector.',
    caption:
      'Illustrative indoor chimney kit and stove connection. Not a documented Stove Shop installation.',
  },
  {
    filename: 'stove-shop-sauna-finishing.jpg',
    alt: 'Completed light-timber sauna with a ceiling vent grille, glass door, and heater behind a guard rail.',
    caption:
      'Illustrative sauna finishing and ventilation detail. Not a verified Stove Shop build.',
  },
]

const LOGO_IMAGE: ImageSpec = {
  filename: 'stove-shop-logo-en.png',
  alt: 'Stove Shop logo: red roof line, chimney with a flame, and the English wordmark Stove Shop.',
  caption:
    'English-language adaptation of the authentic source Stove Shop mark (originally lettered Магазин Печей). Graphic identity preserved; lettering translated. Not a new brand.',
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
      `${detail} Published on the source Stove Shop case study for the seven-year collaboration window. Not independently re-audited in this project. No baseline dates or attribution model are disclosed.`,
    ),
  ),
})

const DISCUSSION: DiscussionEntry[] = [
  {
    author: 'Henrik Dahl',
    role: 'Technical SEO specialist',
    date: '2026-10-14',
    depth: 0,
    body: p(
      'Why does a heating retailer with more than 3,000 models need category, brand, and service destinations instead of one catalog homepage?',
    ),
  },
  expert(
    '2026-10-14',
    p(
      'Because Stove Shop is documented as more than a stove storefront. The published architecture had to hold stoves, boilers, chimneys, installation, delivery, price lists, and a Russian-bath section covering ventilation, stove selection, and bath design.',
      'Buyers search by product type, by brand, by chimney kit, and by installation. A single homepage cannot map a semantic core of roughly 3,000 keywords onto that.',
    ),
    1,
  ),
  {
    author: 'Elena Petrova',
    role: 'In-house e-commerce marketer',
    date: '2026-10-15',
    depth: 2,
    body: p(
      'The source names Harvia, Jotul, Teplodar and others. Should those brands be treated as Stove Shop’s own manufacturing lines?',
    ),
  },
  expert(
    '2026-10-15',
    p(
      'No. They are third-party manufacturers represented in the store. Brand pages existed so a Harvia or Jotul query could land on relevant products, comparisons, and installation notes — not so Stove Shop could claim those factories.',
    ),
    3,
  ),
  {
    author: 'Thomas Weber',
    role: 'Heating installation engineer',
    date: '2026-10-16',
    depth: 0,
    body: p(
      'The company produced metal chimneys and installed stoves and boilers. How should that sit next to a 40-brand catalog?',
    ),
  },
  expert(
    '2026-10-16',
    p(
      'As a separate job from resale. Chimney kits — indoor systems, outdoor systems, and components — needed their own structure. Installation services needed a destination that was not a product SKU.',
      'The gallery chimneys in this case are illustrative. They are not a Stove Shop plant tour.',
    ),
    1,
  ),
  {
    author: 'Anna Kovacs',
    role: 'Specification writer',
    date: '2026-10-17',
    depth: 2,
    body: p(
      'What is actually documented about internal versus external chimney systems?',
    ),
  },
  expert(
    '2026-10-17',
    p(
      'The source names indoor systems, outdoor systems, and chimney components as site sections. That is information architecture. It is not a licence to invent diameters, clearances, or fire-safety ratings.',
    ),
    3,
  ),
  {
    author: 'Sophie Laurent',
    role: 'PPC specialist',
    date: '2026-10-18',
    depth: 0,
    body: p(
      'How should seven Google Ads campaigns sit next to Google Merchant Center feeds?',
    ),
  },
  expert(
    '2026-10-18',
    p(
      'The source describes seven PPC campaigns with around 60 ad groups, aimed at product lines and seasonality, including bath stoves and chimney kits. Paid search is the campaign layer.',
      'Google Merchant Center is the product-feed layer: catalog data that can appear in Google shopping surfaces. It is not itself a campaign, and it is not a marketplace. Budgets and ROAS are not disclosed.',
    ),
    1,
  ),
  {
    author: 'Pavel Orlov',
    role: 'Construction-sector marketing manager',
    date: '2026-10-19',
    depth: 0,
    body: p(
      'The source page also describes Roof Master and Sauna Shop. Are those Stove Shop categories?',
    ),
  },
  expert(
    '2026-10-19',
    p(
      'No. They are other e-commerce projects from the same collaboration period. Roof Master is roofing materials and scaffolding hire. Sauna Shop is sauna-building materials. They are not Stove Shop SKUs, and they have no Case Study records or public URLs in this CMS, so none are invented here.',
    ),
    1,
  ),
  {
    author: 'Clara Jensen',
    role: 'Content strategist',
    date: '2026-10-20',
    depth: 0,
    body: p(
      'The site had a Russian-bath section. Does that mean the project targeted a specific country?',
    ),
  },
  expert(
    '2026-10-20',
    p(
      'No. Russian bath here is a type of bathing facility — a steam bath with a stove — not a geographic market. The documented pages cover ventilation in those baths, choosing a bath stove, and bath-design aspects.',
      'A country, a showroom map, and a market claim are not assigned.',
    ),
    1,
  ),
  {
    author: 'James Whitaker',
    role: 'E-commerce developer',
    date: '2026-10-21',
    depth: 2,
    body: p(
      'Is the CMS named for Stove Shop the way Drupal is named for some related projects?',
    ),
  },
  expert(
    '2026-10-21',
    p(
      'Not on the Stove Shop source page. Related write-ups name Drupal for other shops. That is not copied onto this record. The documented fact is the information architecture, not a reconstructed stack.',
    ),
    3,
  ),
  {
    author: 'Daniel Okonkwo',
    role: 'B2B demand generation lead',
    date: '2026-10-22',
    depth: 0,
    body: p(
      'The seven-year report lists +30% organic traffic and +900 keywords. Are those independently verified here?',
    ),
  },
  expert(
    '2026-10-22',
    p(
      'No. They are reproduced from the published Stove Shop source case study for the seven-year window. They are not a new Search Console export.',
      'Organic traffic growth and organic-session growth are listed as separate rows because the source lists them separately. The 900 figure is an increase in keyword count, not a percentage. I will not add an attribution model.',
    ),
    1,
  ),
  {
    author: 'Lukas Schneider',
    role: 'Technical SEO specialist',
    date: '2026-10-23',
    depth: 0,
    body: p(
      'Has any of this been measured in AI search?',
    ),
  },
  expert(
    '2026-10-23',
    p(
      'Not in this record. Brand pages, category mapping, and product-feed structure are documented groundwork. That is not a ChatGPT, Perplexity, or AI Overview result. This discussion is editorial. It is not a conversation with Stove Shop.',
    ),
    1,
  ),
]

const faqBlock = () => ({
  blockType: 'csFAQ' as const,
  case_study_faq_title: 'Frequently Asked Questions About Stove Shop',
  items: [
    {
      question: 'How can a catalog of thousands of models and dozens of brands be structured for search engines?',
      answer: rt(
        p(
          'The documented approach mapped a semantic core of roughly 3,000 keywords onto categories, stove types, chimney kits, brand pages, and service pages rather than one catalog homepage. Brand destinations covered names such as Feringer, META, Breneran, Vulcan, Harvia, Teplodar, Jotul, Invicta, and Kratki as third-party manufacturers in the store — not as Stove Shop factories.',
          'Exact historic URLs are not reconstructed.',
        ),
      ),
    },
    {
      question: 'What is the difference between internal and external chimney systems in this project?',
      answer: rt(
        p(
          'The published site structure separated indoor chimney systems, outdoor chimney systems, and individual chimney components, alongside complete kits. That split matches how people search and how installation is planned.',
          'Diameters, clearances, and certification numbers are not published in the source and are not invented here. Stove Shop’s documented manufacturing work is metal chimneys, not the third-party stove brands in the catalog.',
        ),
      ),
    },
    {
      question: 'Why does stove installation require attention to ventilation and flue compatibility?',
      answer: rt(
        p(
          'A stove only performs if the flue matches the appliance and the room can exchange air. The documented business combined equipment sales with stove and boiler installation and metal-chimney production. The Russian-bath section treated ventilation, stove selection, and bath design as related pages.',
          'Russian bath here names a type of bathing facility, not a geographic market. Installation standards and safety guarantees are not restated beyond that architecture.',
        ),
      ),
    },
    {
      question: 'How did SEO and Google Ads support the different product categories over seven years?',
      answer: rt(
        p(
          'SEO was an ongoing process: keyword and competitor research, a semantic core, mapping onto evolving categories, brand content, educational pages, and seasonal terms for sauna stoves, heating equipment, fireplaces, and chimney systems.',
          'Google Ads sat beside that as seven campaigns with around 60 ad groups, including high-demand lines such as bath stoves and chimney kits. The seven-year percentages on this page are source-reported. They are not an independent audit.',
        ),
      ),
    },
    {
      question: 'What role did Google Merchant Center product feeds play?',
      answer: rt(
        p(
          'Google Merchant Center carried catalog data — titles, categories, and product details — into Google shopping surfaces, complementary to organic pages and paid-search ads. It is a product-feed tool, not an advertising campaign and not a marketplace.',
          'Feed size, shopping-revenue, and ROAS are not disclosed.',
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
    `<h2>${escapeHtml('Discuss a similar heating and e-commerce SEO project')}</h2>` +
      p(
        'If you sell heating equipment, chimneys, or sauna solutions and need the catalog, search architecture, Google Ads, and product feeds to match the business, tell us about the range.',
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
  case_study_gallery_title: 'Sauna Interiors, Chimney Systems, and Bath Finishing',
  case_study_gallery_images: imageIds,
})

const buildData = (
  previewImageId: number,
  mainImageId: number,
  galleryIds: number[],
  logoId: number,
) => ({
  title: 'Stove Shop: Seven Years of SEO, PPC, and E-Commerce for Heating and Sauna',
  case_study_long_title:
    'Stove Shop — Seven-Year SEO, Google Ads, Google Merchant Center and E-Commerce Architecture for Heating, Sauna, Fireplace and Chimney Solutions',
  slug: SLUG,
  generateSlug: false,
  _status: 'published' as const,
  featured: true,
  displayOrder: 16,
  duration: '7_years',
  company_logo: logoId,

  layout: [
    {
      blockType: 'csPreview' as const,
      case_study_preview_title: 'Heating, Sauna, Fireplace, and Chimney Solutions',
      case_study_preview_text: rt(
        p(
          'Stove Shop is a heating, sauna, fireplace, and building-solutions business: an e-commerce catalog of more than 3,000 models and 40-plus brands, plus metal-chimney production and stove and boiler installation — not merely a storefront selling stoves. Over approximately seven years Neolines combined ongoing SEO, Google Ads, Google Merchant Center product feeds, website architecture, and content as product ranges and service pages evolved.',
        ),
      ),
      case_study_preview_image: previewImageId,
    },

    titleBlock('Project Overview'),
    contentBlock(
      p(
        'The published source describes Stove Shop as a comprehensive online store for heating stoves, sauna stoves, fireplaces, boilers, chimney systems, and accessories, with more than 3,000 listed models and more than 40 brands. The same record names production and installation of metal chimneys, and stove and boiler installations.',
        'Those figures are historical project information from the source. They are not a live stock count. Third-party brand names in the catalog are manufacturers represented in the store, not Stove Shop factories.',
      ),
    ),

    titleBlock('Collaboration'),
    contentBlock(
      p(
        'Neolines collaborated with Stove Shop for seven years. That figure is the published relationship and the window for the SEO and PPC report. It is not a verified month-by-month campaign log, and no start or end date is assigned.',
        'The work is described as continuous refinement of SEO and PPC around high-demand keywords and a diverse brand portfolio, together with website structure, content, and design updates as the range evolved. Not every service listed on the later site is claimed for every year of the seven.',
      ),
    ),

    titleBlock('Website Architecture and Product Categories'),
    contentBlock(
      p(
        'The documented information architecture aligned a large catalog with the semantic core. Main categories were Stoves, Boilers, and Chimneys. Stove types included Russian bath stoves, sauna stoves, fireplace stoves, heating stoves, fireboxes, and accessories. Chimney sets split indoor systems, outdoor systems, and components.',
        'Company and service pages covered the shopping cart, contacts, reviews, delivery, a price list, and installation services. A Russian-bath section covered ventilation, choosing a bath stove, and bath-design aspects — a bathing-facility type, not a geographic market. An FAQ captured recurring product and kit questions. Exact historic URLs and the CMS are not reconstructed.',
      ),
    ),

    titleBlock('Brands and Brand-Specific SEO'),
    contentBlock(
      p(
        'More than 40 brands were represented. Names published on the source page include Feringer, META, Breneran, Vulcan, Harvia, Teplodar, Jotul, Invicta, Kratki, Nordica, Romotop, Tim Sistem, and Eurokom.',
        'Dedicated brand content covered product features, comparisons, and installation instructions so searchers who used a manufacturer name could land on a relevant page. Those manufacturers remain third-party brands. Additional names are not added.',
      ),
    ),

    titleBlock('SEO Strategy'),
    contentBlock(
      p(
        'The documented SEO work started with keyword and competitor research spanning heating stoves, sauna stoves, fireplace inserts, and chimney kits, producing a semantic core of roughly 3,000 keywords. That core was mapped onto categories, subcategories, brand pages, and service pages.',
        'Over seven years the keyword base and site structure were revised as ranges changed. On-page work, category optimisation, educational content, FAQ, internal navigation, and seasonal targeting for sauna stoves, heating equipment, fireplaces, and chimney systems are named as part of that process. Rankings by query are not reconstructed.',
      ),
    ),

    titleBlock('Google Ads and Product Feeds'),
    contentBlock(
      p(
        'Paid search ran as seven Google Ads campaigns with around 60 ad groups, split by product groups and seasonality. Ad groups concentrated on high-demand lines such as bath stoves and chimney kits, with copy and landing pages aligned to the relevant category or product page.',
        'Google Merchant Center product feeds sat beside organic search and paid ads, supplying catalog data to Google shopping surfaces. Merchant Center is not treated here as a campaign or as a marketplace. Budgets, ROAS, and revenue are not disclosed.',
      ),
    ),

    titleBlock('Related Collaboration Projects'),
    contentBlock(
      p(
        'The source Stove Shop page also describes other e-commerce work from the same collaboration period, including Roof Master (roofing materials and construction-scaffolding sale and rental) and Sauna Shop (sauna-building materials, stoves, and accessories).',
        'Those are separate projects. They are not Stove Shop product categories. No matching Case Study records exist in this CMS, so no internal URLs are invented. Roofing and scaffolding are not merged into the Stove Shop catalog in this record.',
      ),
    ),

    titleBlock('Reported Seven-Year Results'),
    contentBlock(
      p(
        'The published Stove Shop source case study reports the following figures for the seven-year collaboration. They are reproduced as source-reported results, not as a new analytics audit. Organic traffic growth and organic-session growth are separate source rows. Keyword visibility is an increase of more than 900 keywords, not a percentage.',
      ) +
        ul([
          'Organic traffic growth: +30%',
          'Organic sessions: +12%',
          'Total sessions: +15%',
          'Keyword visibility: more than 900 additional keywords',
          'Performance across five key keywords: +28%',
          'Search impressions: +7%',
          'Search clicks: +6%',
          'New users: +38%',
          'Returning users: +20%',
          'PPC clicks: +25%',
          'PPC conversions: +90%',
          'Average CPC: −3%',
          'Cost per conversion: −25%',
          'PPC CTR: +80%',
          'PPC conversion rate: +60%',
        ]) +
        p(
          'No baseline dates, Analytics or Search Console screenshots, or attribution model are in this repository. A country or advertising-platform label is not added to the reporting period.',
        ),
    ),

    titleBlock('Key Takeaways'),
    contentBlock(
      p(
        'A heating and sauna catalog only works in search if categories, brands, chimney kits, and installation have destinations that match how people buy — and if paid search and product feeds follow the same split.',
        'Seven years of SEO and Google Ads only make sense if that architecture can evolve. Where the source is silent — CMS, live stock, certificate numbers, named buildings — the correct public line is Not disclosed.',
      ),
    ),

    contentBlock(
      p(
        'Illustrative views of stove interiors, chimney kits, and sauna finishing. These are not original photographs of documented Stove Shop projects or showrooms.',
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
        'Stove Shop produced and installed metal chimneys and installed stoves and boilers, alongside a large third-party heating and sauna catalog.',
        'Factory size, locations, and output are not disclosed.',
      ),
    ),
    products: rt(
      p(
        'Heating stoves, sauna stoves, fireplace stoves, fireboxes, boilers, chimney kits and components, and accessories from more than 40 third-party brands, plus metal chimneys manufactured in-house as named in the source.',
      ),
    ),
    materials: rt(
      p(
        'Metal chimneys as the documented manufactured product. Stove bodies, firebox alloys, and brand materials belong to the third-party manufacturers in the catalog and are not restated here.',
      ),
    ),
    applications: rt(
      p(
        'Residential heating, sauna and Russian-bath facilities, fireplaces, and chimney installations. Named buildings and a geographic market are not listed.',
      ),
    ),
  },

  businessChallenge: {
    initialState: rt(
      p(
        'Stove Shop already sold a wide heating and sauna range and offered chimney production and installation. The digital presence had to present that catalog, those brands, and those services without collapsing into a single stove homepage.',
      ),
    ),
    challenge: rt(
      p(
        'Thousands of models, dozens of brands, chimney kits, installation, and a Russian-bath information section needed destinations that could support seven years of SEO, Google Ads, and product-feed work.',
      ),
    ),
    goals: rt(
      ul([
        'Map a roughly 3,000-keyword semantic core onto categories, brands, and services',
        'Keep third-party brands findable without claiming them as in-house lines',
        'Structure chimney kits and installation beside the catalog',
        'Run segmented Google Ads and Google Merchant Center feeds',
        'Report only source-backed seven-year figures',
      ]),
    ),
  },

  nicheSegmentation: [
    {
      name: 'Stove, boiler, and fireplace catalog',
      description: rt(
        p('Russian bath stoves, sauna stoves, fireplace stoves, heating stoves, fireboxes, boilers, and accessories. Russian bath names a facility type.'),
      ),
      marketingApproach: rt(
        p('Give each type a destination. A sauna-stove query is not a generic heating homepage.'),
      ),
    },
    {
      name: 'Chimney systems and in-house metal chimneys',
      description: rt(
        p('Indoor systems, outdoor systems, kits, components, and documented metal-chimney production and installation.'),
      ),
      marketingApproach: rt(
        p('Keep flue architecture findable without hiding that Stove Shop both sells kits and manufactures metal chimneys.'),
      ),
    },
    {
      name: 'Brand-specific search',
      description: rt(
        p('More than 40 third-party manufacturers, including Harvia, Jotul, Teplodar, Feringer, and others named in the source.'),
      ),
      marketingApproach: rt(
        p('Brand pages for features, comparisons, and installation notes. Do not rewrite those factories as Stove Shop brands.'),
      ),
    },
    {
      name: 'Installation, baths, and service pages',
      description: rt(
        p('Stove and boiler installation, delivery, price lists, contacts, and a Russian-bath section on ventilation, stove choice, and bath design.'),
      ),
      marketingApproach: rt(
        p('Service and educational pages catch intent that a product SKU cannot. Roofing and scaffolding stay on related projects, not in this catalog.'),
      ),
    },
  ],

  digitalEcosystem: rt(
    p(
      'The confirmed digital ecosystem is a large e-commerce website with category, brand, chimney, service, and educational pages, Google Ads, and Google Merchant Center product feeds.',
      'The CMS, CRM, and social programmes are not named for Stove Shop.',
    ),
  ),
  websiteArchitecture: rt(
    p(
      'Published architecture: Stoves, Boilers, Chimneys; stove types including Russian bath, sauna, fireplace, heating, fireboxes, and accessories; chimney indoor, outdoor, and component sets; cart, contacts, reviews, delivery, price list, installation; Russian-bath ventilation, stove choice, and design; FAQ; brand pages.',
      'Exact historic URLs are not reconstructed. The CMS is not named on the Stove Shop source page.',
    ),
  ),
  semanticArchitecture: rt(
    p(
      'A semantic core of roughly 3,000 keywords, including heating stoves, sauna stoves, fireplace inserts, and chimney kits, mapped onto categories, brand pages, and services.',
      'The 900 figure in results is later ranking visibility, not the size of the core.',
    ),
  ),

  marketingStrategy: {
    seoAndContentStrategy: rt(
      p(
        'Seven-year search-led work: keyword and competitor research, a semantic core, hierarchical mapping, brand and product content, educational and FAQ pages, seasonal targeting, and ongoing structure updates.',
        'No article count is stated.',
      ),
    ),
    leadGenMechanism: rt(
      p(
        'Organic category and brand pages, Google Ads landing pages, and Merchant Center feeds were meant to match product and installation intent, then allow contact or purchase through the existing cart and inquiry paths. Lead volume is not published beyond the source PPC conversion percentages.',
      ),
    ),
    paidAdvertising: [
      {
        channel: 'google_ads' as const,
        strategy: rt(
          p(
            'Google Ads / paid search for heating, sauna, fireplace, and chimney product groups, including seasonal and year-round demand, alongside the organic programme.',
          ),
        ),
        campaignStructure: rt(
          p(
            'Seven campaigns and around 60 ad groups, with groups aimed at high-demand lines such as bath stoves and chimney kits. Historic ads are not reconstructed.',
          ),
        ),
        results: rt(
          p(
            'Source-reported for the seven-year window: clicks +25%, conversions +90%, average CPC −3%, cost per conversion −25%, CTR +80%, conversion rate +60%. Not independently re-audited. Budgets are not disclosed.',
          ),
        ),
      },
    ],
    socialMedia: [],
  },

  aiSearchOptimization: {
    brandAuthorityAndTrust: rt(
      p(
        'This project is described as e-commerce SEO, Google Ads, content, and product feeds for a heating and sauna retailer-installer. It is not rewritten as an AI-search engagement.',
        'No ChatGPT, Perplexity, or AI Overview result is claimed.',
      ),
    ),
    entityAndGeoStructure: rt(
      p(
        'Product types, third-party brands, chimney kits, and installation are treated as related entities. That is not a measured GEO programme, and no country is assigned.',
      ),
    ),
  },

  implementationProcess: rt(
    p(
      'Confirmed shape of the work: understand the catalog, chimney production, and installation services; research keywords and competitors; build and revise the semantic core; map categories, brands, and services; write product, brand, and educational content; run segmented Google Ads; maintain Merchant Center feeds; report the published seven-year figures as source-reported results.',
      'The sequence is the method. Exact dates are not assigned.',
    ),
  ),

  timeline: [
    {
      period: 'Phase 1',
      title: 'Map the catalog and services',
      description: rt(
        p('Stoves, boilers, chimneys, installation, Russian-bath information, and brand portfolio as documented on the source architecture.'),
      ),
    },
    {
      period: 'Phase 2',
      title: 'Keyword, competitor, and semantic research',
      description: rt(
        p('Build a roughly 3,000-keyword core covering heating stoves, sauna stoves, fireplace inserts, and chimney kits.'),
      ),
    },
    {
      period: 'Phase 3',
      title: 'Category, brand, and service architecture',
      description: rt(
        p('Implement stove types, chimney indoor/outdoor/component sets, brand pages, and service/FAQ destinations. CMS is not named.'),
      ),
    },
    {
      period: 'Phase 4',
      title: 'Google Ads, product feeds, and seven-year optimisation',
      description: rt(
        p('Seven campaigns and about 60 ad groups, Merchant Center feeds, and ongoing SEO as the range evolved. The seven-year figures are the published measurement window.'),
      ),
    },
  ],

  resultsSummary: rt(
    p(
      'The documented outcome is a seven-year SEO, Google Ads, Merchant Center, and e-commerce-architecture programme for a heating and sauna retailer that also manufactures metal chimneys and installs stoves and boilers: category and brand mapping, a roughly 3,000-keyword core, seven paid-search campaigns, and the source-reported visibility and conversion figures listed on this page.',
      'Those percentages are not independently re-audited here. A geographic market and market leadership are not claimed.',
    ),
  ),

  metrics: [
    sourceMetric('+30%', 'Organic traffic', 'Organic traffic growth.'),
    sourceMetric('+900+', 'Additional keywords ranked', 'Increase in keywords — a count, not a percentage.'),
    sourceMetric('+90%', 'PPC conversions', 'Paid-search conversion growth.'),
    sourceMetric('−3%', 'Average CPC', 'Average cost per click reduction on paid search.'),
    sourceMetric('+80%', 'PPC click-through rate', 'Paid-search CTR.'),
    sourceMetric('+12%', 'Organic sessions', 'Organic-session growth, listed separately from organic traffic in the source.'),
    {
      value: '7 years',
      label: 'Published collaboration window',
      description: rt(
        p(
          'The source reports seven years of collaboration and a seven-year SEO/PPC summary. That is relationship duration for the published figures, not a verified uninterrupted campaign log.',
        ),
      ),
    },
  ],

  projectsShowcase: [
    {
      projectName: 'Category and stove-type architecture',
      description: rt(
        p('Stoves, boilers, chimneys, and stove types including Russian bath, sauna, fireplace, heating, and fireboxes. Historic URLs are not reconstructed.'),
      ),
    },
    {
      projectName: 'Chimney kits and metal-chimney production',
      description: rt(
        p('Indoor systems, outdoor systems, components, and documented metal-chimney manufacturing and installation. Gallery images are illustrative.'),
      ),
    },
    {
      projectName: 'Brand pages and product feeds',
      description: rt(
        p('Dedicated content for 40-plus third-party brands, plus Google Merchant Center feeds alongside seven Google Ads campaigns.'),
      ),
    },
  ],

  expertInsight: rt(
    p(
      'The useful complexity is a retailer that also makes metal chimneys and installs appliances, then talks about 40-plus third-party brands without pretending to manufacture Harvia or Jotul.',
      'Seven years of SEO and Google Ads only make sense if categories, chimney kits, and installation stay real destinations, and if Merchant Center stays a feed rather than a fake marketplace. The published figures stay labelled as source-reported.',
      'Where the source is silent — CMS, plant capacity, named sites, a country — the correct public line is Not disclosed. This discussion is editorial. It is not a conversation with Stove Shop.',
    ),
  ),

  clientTestimonial: { quote: null, author: null, position: null, company: null },

  hero: {
    type: 'mediumImpact' as const,
    richText: rtHero(
      p(
        'Seven-year SEO, Google Ads, Google Merchant Center, and e-commerce architecture for Stove Shop — heating, sauna, fireplace, and chimney solutions with in-house metal-chimney production and appliance installation.',
      ),
    ),
    media: mainImageId,
  },

  primary_case_study_category: PRIMARY_CASE_STUDY_CATEGORY,
  case_study_categories: CASE_STUDY_CATEGORIES,

  meta: {
    title: 'Stove Shop Case Study | Heating and Sauna SEO, Google Ads',
    description:
      'Explore how Neolines supported Stove Shop through seven-year SEO, Google Ads, Google Merchant Center product feeds, and e-commerce architecture for heating, sauna, fireplace, and chimney solutions.',
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
          duration: '7_years',
          featured: true,
          displayOrder: 16,
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
        { slug: { like: 'stove-shop' } },
        { slug: { like: 'stoveshop' } },
        { title: { like: 'Stove Shop' } },
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

  const data = buildData(previewImageId, mainImageId, galleryIds, logoId)
  const existing = duplicates.docs.find((doc) => doc.slug === SLUG) ?? duplicates.docs[0]

  if (existing && existing.slug !== SLUG && existing.slug !== 'stove-shop') {
    throw new Error(`Related Stove Shop record exists with different slug: ${existing.id} ${existing.slug}`)
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
