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
 * Creates or updates the Sauna Shop Case Study.
 * Separate from Stove Shop. E-commerce plus materials, heating,
 * chimneys, and interior finishing for complete sauna and bath projects.
 * ~2 years is the stated collaboration window. ~1,500 keywords is the
 * published semantic-core size, not a ranking increase.
 * No traffic, revenue, or conversion metrics. Platform for paid search
 * is not named. Authentic Russian logo is used as-is.
 * Gallery images are illustrative. No site_categories.
 */
const SLUG = 'sauna-shop-turnkey-sauna-bath'
const IMAGE_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'assets')

const EXPERT = 'Maryan Polyak'
const EXPERT_ROLE = 'Manufacturing Digital Marketing & Web Development Expert'

const PRIMARY_CASE_STUDY_CATEGORY = 969
const CASE_STUDY_CATEGORIES = [
  969, // E-commerce Growth
  196, // Manufacturing SEO
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
  575, // Heating Equipment
  576, // Heating Solutions
  577, // Heating Systems
  592, // Ventilation Equipment
  421, // Building Materials
  417, // Building Products & Materials
  426, // Construction Products
  425, // Construction Materials Manufacturing
  911, // Timber Construction
  484, // Design, Manufacturing & Installation
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
  filename: 'sauna-shop-preview-interior.jpg',
  alt: 'Dark wood sauna with lit tiered benches, a glass door, and a compact heater topped with stones.',
  caption:
    'Illustrative finished sauna interior for the archive card. Not a documented Sauna Shop project photograph.',
}

const MAIN_IMAGE: ImageSpec = {
  filename: 'sauna-shop-main-interior.jpg',
  alt: 'Completed honey-wood sauna with tiered benches, a wood stove, and a stone-filled heater beside a masonry wall.',
  caption:
    'Illustrative completed sauna interior. Not a verified photograph of a Sauna Shop build.',
}

const GALLERY_IMAGES: ImageSpec[] = [
  {
    filename: 'sauna-shop-turnkey-room.jpg',
    alt: 'Pale aspen sauna with L-shaped benches, a stone stove surround, and a wooden bucket.',
    caption:
      'Illustrative finished bath interior. Not a named Sauna Shop construction contract.',
  },
  {
    filename: 'sauna-shop-materials.jpg',
    alt: 'Tongue-and-groove timber boards, foil-faced insulation, battens, and a lining sample on a workshop bench.',
    caption:
      'Illustrative sauna construction materials and insulation. Not a Sauna Shop inventory photograph.',
  },
  {
    filename: 'sauna-shop-chimney.jpg',
    alt: 'Wood-fired sauna stove with stones and a stainless flue passing through a ceiling support plate.',
    caption:
      'Illustrative stove and flue relationship. Not a Sauna Shop installation drawing or a safety specification.',
  },
  {
    filename: 'sauna-shop-finishing.jpg',
    alt: 'Curved sauna benches with ventilated gaps, warm under-bench lighting, and precise wood joinery.',
    caption:
      'Illustrative interior wood finishing. Not a verified Sauna Shop workshop photograph.',
  },
]

const LOGO_IMAGE: ImageSpec = {
  filename: 'sauna-shop-logo-en.png',
  alt: 'Sauna Shop logo: flame-textured lettering reading BATH and SAUNA, with the line EQUIPMENT, MATERIALS.',
  caption:
    'English adaptation of the source mark. The flame-filled letters, black outline, and two-line layout are kept. «Баня и сауна» is rendered as BATH and SAUNA. «Оборудование, материалы» is rendered as EQUIPMENT, MATERIALS.',
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
    date: '2026-10-24',
    depth: 0,
    body: p(
      'Why is Sauna Shop not just a stove catalog with a nicer homepage?',
    ),
  },
  expert(
    '2026-10-24',
    p(
      'Because the documented scope is materials, heating equipment, and accessories for building a sauna or steam room, plus consultation on interior finishing of the steam room. A stove query and a timber or finishing query are different journeys.',
      'The published architecture mapped a semantic core of about 1,500 keywords onto categories and subcategories. That figure is the size of the core, not a later ranking total.',
    ),
    1,
  ),
  {
    author: 'Elena Petrova',
    role: 'In-house e-commerce marketer',
    date: '2026-10-25',
    depth: 2,
    body: p(
      'The historic storefront lists Harvia, Feringer, Kastor, and others. Are those Sauna Shop factories?',
    ),
  },
  expert(
    '2026-10-25',
    p(
      'No. They are third-party manufacturers in the catalog. Brand names on the storefront are not a claim that Sauna Shop made the stoves.',
    ),
    3,
  ),
  {
    author: 'Thomas Weber',
    role: 'Sauna project planner',
    date: '2026-10-26',
    depth: 0,
    body: p(
      'How far can we take “complete construction” without inventing a turnkey package?',
    ),
  },
  expert(
    '2026-10-26',
    p(
      'As far as the sources go: stoves and heaters, chimneys, timber, insulation, accessories, doors, stones, and interior finishing of the steam room. A customer could plan the room from those parts instead of buying only a heater.',
      'Wall assemblies, clearances, and a priced construction package are not published, so they are not invented.',
    ),
    1,
  ),
  {
    author: 'Anna Kovacs',
    role: 'Specification writer',
    date: '2026-10-27',
    depth: 2,
    body: p(
      'The flue photo in the gallery looks specific. Can we treat it as their installation standard?',
    ),
  },
  expert(
    '2026-10-27',
    p(
      'No. Gallery images in this case are illustrative. The documented fact is that stainless chimney systems had their own catalog branch and had to be chosen with the stove, not after the room was finished.',
    ),
    3,
  ),
  {
    author: 'Sophie Laurent',
    role: 'PPC specialist',
    date: '2026-10-28',
    depth: 0,
    body: p(
      'The source says digital promotion sat beside SEO. Which ad platform do we name?',
    ),
  },
  expert(
    '2026-10-28',
    p(
      'None. The Sauna Shop paragraph names organic SEO and digital promotions. It does not name a network, a budget, or a campaign count. I will not borrow the Stove Shop campaign table, and I will not add a marketplace.',
    ),
    1,
  ),
  {
    author: 'Clara Jensen',
    role: 'Content strategist',
    date: '2026-10-29',
    depth: 0,
    body: p(
      'Russian bath appears throughout the copy. Is that a country claim?',
    ),
  },
  expert(
    '2026-10-29',
    p(
      'No. It names the type of bathing room — a stove-heated bath — the same way the catalog split wood-fired and electric heaters. A city, a market, and a showroom map are not assigned on this page.',
    ),
    1,
  ),
  {
    author: 'James Whitaker',
    role: 'Web developer',
    date: '2026-10-30',
    depth: 2,
    body: p(
      'Drupal is named. Does that mean this Next.js site is the original shop?',
    ),
  },
  expert(
    '2026-10-30',
    p(
      'No. Drupal with custom HTML, CSS, and PHP is the published note about the historic Sauna Shop site. This Case Study page is a record of that project. It is not a claim that the current site is that store.',
    ),
    3,
  ),
  {
    author: 'Daniel Okonkwo',
    role: 'B2B demand generation lead',
    date: '2026-10-31',
    depth: 0,
    body: p(
      'There is a two-year window and about 1,500 keywords, but no traffic percentage. Was that omitted on purpose?',
    ),
  },
  expert(
    '2026-10-31',
    p(
      'Yes. The published paragraph says the work produced sustained growth in organic traffic, keyword visibility, and conversions. It does not print the percentages. The 1,500 figure is the semantic core. Two years is the stated collaboration window, without start and end dates.',
    ),
    1,
  ),
  {
    author: 'Lukas Schneider',
    role: 'Technical SEO specialist',
    date: '2026-11-01',
    depth: 0,
    body: p(
      'Has any of this been measured in AI search?',
    ),
  },
  expert(
    '2026-11-01',
    p(
      'Not in this record. Category mapping and educational product copy are useful groundwork. They are not a ChatGPT, Perplexity, or AI Overview result. This discussion is editorial. It is not a conversation with Sauna Shop.',
    ),
    1,
  ),
]

const faqBlock = () => ({
  blockType: 'csFAQ' as const,
  case_study_faq_title: 'Frequently Asked Questions About Sauna Shop',
  items: [
    {
      question: 'Can Sauna Shop support the construction of a complete sauna or Russian bath?',
      answer: rt(
        p(
          'The documented business combined a product catalog with the materials and equipment used to build a sauna or steam room, and the historic storefront described consultation on interior finishing of the steam room. A customer could select a stove, chimney components, timber, insulation, and finishing materials rather than only a heater.',
          'Russian bath here names a type of bathing room, not a geographic market. A priced construction package, structural specification, and safety guarantee are not published.',
        ),
      ),
    },
    {
      question: 'What materials and equipment are documented for building a sauna?',
      answer: rt(
        p(
          'The published range covers sauna and bath stoves, including wood-fired and electric heaters, stove accessories, stainless chimney systems, timber, insulation, interior finishing, doors, sauna stones, and related accessories.',
          'Exact thicknesses, species grades, and insulation ratings are not reconstructed.',
        ),
      ),
    },
    {
      question: 'Why must the chimney and heater be considered while the room is still being planned?',
      answer: rt(
        p(
          'The flue has to match the appliance, and the room needs a path for air. The catalog gave chimneys their own branch so that choice sat beside stove selection and interior finishing, not after the benches were already built.',
          'Clearances and installation standards are not restated as a specification.',
        ),
      ),
    },
    {
      question: 'How were the website categories organized for search?',
      answer: rt(
        p(
          'Keyword and competitor research produced a semantic core of about 1,500 keywords, mapped onto categories and subcategories for stoves, heaters, construction materials, insulation, wood finishing, chimneys, and accessories. Product descriptions and educational copy served both a single-product purchase and someone planning a whole room.',
          'That 1,500 figure is the size of the core. It is not a count of new rankings, and historic URLs are not reconstructed.',
        ),
      ),
    },
    {
      question: 'How did contextual advertising complement organic search?',
      answer: rt(
        p(
          'The published work paired ongoing SEO with digital promotion aimed at product and construction intent, so paid visits could land on the relevant stove, material, chimney, or accessory destination.',
          'The advertising platform, budgets, click counts, and conversion totals are not named. No performance percentage is added.',
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
    `<h2>${escapeHtml('Discuss a similar sauna catalog and construction-content project')}</h2>` +
      p(
        'If you sell sauna and bath materials, heaters, and finishing and need the catalog and search architecture to serve both a single product and a complete room, tell us about the range.',
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
  case_study_gallery_title: 'Construction, Materials, Flues, and Interior Finishing',
  case_study_gallery_images: imageIds,
})

const buildData = (
  previewImageId: number,
  mainImageId: number,
  galleryIds: number[],
  logoId: number,
) => ({
  title: 'Sauna Shop: SEO and E-Commerce for Turnkey Sauna and Bath Construction',
  case_study_long_title:
    'Sauna Shop — Two-Year SEO, Drupal E-Commerce, and Contextual Advertising for Sauna and Bath Construction',
  slug: SLUG,
  generateSlug: false,
  _status: 'published' as const,
  featured: true,
  displayOrder: 17,
  duration: '2_years',
  company_logo: logoId,

  layout: [
    {
      blockType: 'csPreview' as const,
      case_study_preview_title: 'Materials, Heating, and a Complete Sauna or Bath',
      case_study_preview_text: rt(
        p(
          'Sauna Shop is a specialized e-commerce and construction-solutions business for designing and building saunas and Russian baths — materials, heaters, chimneys, and interior finishing — not only a storefront for stoves and accessories. Over approximately two years Neolines built the semantic architecture, Drupal site, content, and contextual advertising around both a single product purchase and a complete room.',
        ),
      ),
      case_study_preview_image: previewImageId,
    },

    titleBlock('Project Overview'),
    contentBlock(
      p(
        'The published source describes Sauna Shop as a niche e-commerce platform for construction materials, stoves, and accessories used to build bespoke saunas and steam rooms. The historic storefront also offered wood-fired and electric heaters, stainless chimney systems, timber, doors, stones, and interior finishing of the steam room.',
        'The point of the site was that those pieces belonged together. A buyer could take one accessory or plan the room. Third-party stove brands in the catalog are manufacturers represented in the store, not Sauna Shop factories. Russian bath names the type of room, not a geographic market.',
      ),
    ),

    titleBlock('Collaboration'),
    contentBlock(
      p(
        'The collaboration is recorded as approximately two years, covering keyword research, website architecture, content, Drupal design and development, and contextual advertising. The published Sauna Shop paragraph does not print a start date or an end date, and the window is not a verified month-by-month campaign log.',
        'Not every catalog branch is claimed for every month of those two years. The source describes an evolving site: categories and the keyword base were revised as the range developed.',
      ),
    ),

    titleBlock('Website Architecture'),
    contentBlock(
      p(
        'The documented structure served two intents at once: buying one product, and assembling a sauna or bath. Main catalog branches included stoves for baths and saunas — wood-fired, electric, accessories, and controls — stainless chimney systems, timber, doors, interior finishing, sauna stones, and related accessories such as facing materials.',
        'Service paths covered payment, delivery, the cart, and contacts. Insulation is named in the published project description alongside timber and accessories. Exact historic URLs are not reconstructed.',
      ),
    ),

    titleBlock('From a Single Product to a Finished Room'),
    contentBlock(
      p(
        'A complete room, as far as the sources support it, meant planning the space, choosing timber and insulation, selecting a wood-fired or electric heater, matching a chimney, allowing for ventilation, and finishing the interior. The historic storefront described specialist consultation on the stove, on construction materials, and on interior finishing of the steam room.',
        'That is a construction solution built from a catalog and finishing work. It is not a published engineering standard, a structural package, or a safety guarantee.',
      ),
    ),

    titleBlock('SEO and the Semantic Core'),
    contentBlock(
      p(
        'The documented SEO work began with keyword and competitor research in sauna and bath construction. A semantic core of approximately 1,500 optimized keywords was mapped onto categories and subcategories, from heaters to timber, insulation, and accessories, with internal linking between those destinations.',
        'Product descriptions and educational copy covered both purchase intent and planning intent. The 1,500 figure is the size of that core. The source describes sustained growth in organic traffic, visibility, and conversions, and it does not publish the percentages. Rankings by query are not reconstructed.',
      ),
    ),

    titleBlock('Design and Drupal Development'),
    contentBlock(
      p(
        'The original site was developed on Drupal with custom HTML, CSS, and PHP. That is historical context for the Sauna Shop store. It is not a claim that the current Next.js and Payload site is that implementation.',
        'The published design goal was a catalog people could actually use: clear category navigation, product information, and educational content. Interface details that are not in the source are not invented.',
      ),
    ),

    titleBlock('Contextual Advertising'),
    contentBlock(
      p(
        'Digital promotion sat beside the organic programme so product and construction queries could reach a relevant landing page: a stove, a material category, a chimney, or an accessory. The split followed search intent rather than one generic offer.',
        'The Sauna Shop source does not name the advertising platform, the number of campaigns, budgets, or paid results. Those figures are not borrowed from any other case.',
      ),
    ),

    titleBlock('Brand Portfolio'),
    contentBlock(
      p(
        'The historic storefront showed third-party brands including Harvia, Feringer, Kastor, Termofor, Vesuvius, Varvara, Teplov i Sukhov, Talc, and Doorwood. They are manufacturers and suppliers in the catalog.',
        'Sauna Shop is not described as the maker of those products. Additional brand names are not added.',
      ),
    ),

    titleBlock('Key Takeaways'),
    contentBlock(
      p(
        'A sauna catalog only works when the stove, the flue, the timber, and the finishing can be found as separate destinations and still read as one room.',
        'About 1,500 keywords and two years of SEO and promotion only make sense on that structure. Where the source is silent — traffic percentages, ad platform, construction specifications — the correct public line is Not disclosed.',
      ),
    ),

    contentBlock(
      p(
        'Illustrative views of a finished sauna, construction materials, a stove and flue, and interior woodwork. These are not original photographs of documented Sauna Shop projects.',
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
        'Sauna Shop sold the materials and equipment for sauna and bath construction and described interior finishing of the steam room. It is not documented as the manufacturer of the third-party stove brands in the catalog.',
      ),
    ),
    products: rt(
      p(
        'Wood-fired and electric sauna and bath stoves, heater accessories, stainless chimney systems, timber, insulation, interior finishing, doors, sauna stones, and related accessories.',
      ),
    ),
    materials: rt(
      p(
        'Timber and interior wood lining, insulation, and finishing materials as named in the project. Grades and thicknesses are not disclosed.',
      ),
    ),
    applications: rt(
      p(
        'Saunas, steam rooms, and Russian baths as a room type. Named buildings and a geographic market are not listed.',
      ),
    ),
  },

  businessChallenge: {
    initialState: rt(
      p(
        'Sauna Shop already brought together heaters, construction materials, and finishing. A storefront that only ranked for “sauna stove” would hide the rest of the room.',
      ),
    ),
    challenge: rt(
      p(
        'Categories had to serve someone buying one product and someone planning timber, insulation, a heater, a chimney, and interior finishing together.',
      ),
    ),
    goals: rt(
      ul([
        'Map about 1,500 keywords onto categories and subcategories',
        'Keep heaters, chimneys, timber, and finishing as separate destinations',
        'Support both a single purchase and a complete room',
        'Build the historic site on Drupal without inventing later integrations',
        'Run contextual advertising without inventing a platform or a results table',
      ]),
    ),
  },

  nicheSegmentation: [
    {
      name: 'Sauna and bath heaters',
      description: rt(
        p('Wood-fired and electric stoves, accessories, and controls. Third-party brands stay third-party.'),
      ),
      marketingApproach: rt(
        p('A heater query lands on a stove category, not on a generic construction homepage.'),
      ),
    },
    {
      name: 'Construction materials and finishing',
      description: rt(
        p('Timber, insulation, interior lining, and doors for a sauna or bath interior.'),
      ),
      marketingApproach: rt(
        p('Material pages catch planning intent that a product SKU cannot.'),
      ),
    },
    {
      name: 'Chimneys and the finished room',
      description: rt(
        p('Stainless flue systems chosen with the heater, plus interior finishing of the steam room.'),
      ),
      marketingApproach: rt(
        p('Keep the flue findable while the room is still being planned.'),
      ),
    },
    {
      name: 'Single-product versus complete-room intent',
      description: rt(
        p('The same catalog has to sell an accessory and explain how the parts become a room.'),
      ),
      marketingApproach: rt(
        p('Educational copy and category mapping, not one brochure page.'),
      ),
    },
  ],

  digitalEcosystem: rt(
    p(
      'The confirmed digital ecosystem is a Drupal e-commerce site with category, product, and educational pages, plus contextual advertising beside organic search.',
      'The ad platform, CRM, and social programmes are not named.',
    ),
  ),
  websiteArchitecture: rt(
    p(
      'Published architecture: stoves for baths and saunas, including wood-fired and electric heaters and accessories; stainless chimney systems; timber; insulation; interior finishing; doors; sauna stones; payment, delivery, cart, and contacts.',
      'Exact historic URLs are not reconstructed. Drupal is the confirmed CMS of the original shop.',
    ),
  ),
  semanticArchitecture: rt(
    p(
      'A semantic core of approximately 1,500 keywords, clustered by product category, subcategory, and search intent, then mapped onto stove, material, chimney, and accessory pages.',
      'The 1,500 figure is the size of the core. It is not an increase in ranked keywords.',
    ),
  ),

  marketingStrategy: {
    seoAndContentStrategy: rt(
      p(
        'Keyword and competitor research, a semantic core, category and subcategory pages, product descriptions, educational content, and internal linking for both purchase intent and construction intent.',
        'No article count and no ranking table are stated.',
      ),
    ),
    leadGenMechanism: rt(
      p(
        'Organic pages and paid landing pages were meant to match a product or a room-planning query, then allow contact or purchase through the existing cart and inquiry paths. Lead volume is not published.',
      ),
    ),
    paidAdvertising: [
      {
        channel: 'other' as const,
        strategy: rt(
          p(
            'Contextual advertising alongside SEO for stove, construction-material, chimney, and accessory intent.',
            'The platform is not named on the Sauna Shop source.',
          ),
        ),
        campaignStructure: rt(
          p(
            'Campaigns were segmented by category and intent so paid traffic could reach the relevant landing page. Historic ads and campaign counts are not reconstructed.',
          ),
        ),
        results: rt(
          p(
            'The source describes sustained growth from the combined SEO and promotion work and does not publish click, conversion, or cost figures. None are added here.',
          ),
        ),
      },
    ],
    socialMedia: [],
  },

  aiSearchOptimization: {
    brandAuthorityAndTrust: rt(
      p(
        'This project is described as Drupal e-commerce, SEO, content, and contextual advertising for a sauna and bath catalog. It is not rewritten as an AI-search engagement.',
        'No ChatGPT, Perplexity, or AI Overview result is claimed.',
      ),
    ),
    entityAndGeoStructure: rt(
      p(
        'Heaters, chimneys, timber, insulation, and interior finishing are treated as related parts of one room. That is not a measured GEO programme, and no country is assigned.',
      ),
    ),
  },

  implementationProcess: rt(
    p(
      'Confirmed shape of the work: understand heaters, materials, chimneys, and interior finishing; research keywords and competitors; build a semantic core of about 1,500 keywords; map Drupal categories; write product and educational content; run contextual advertising beside SEO.',
      'The sequence is the method. Exact dates are not assigned.',
    ),
  ),

  timeline: [
    {
      period: 'Phase 1',
      title: 'Map products and the finished room',
      description: rt(
        p('Heaters, chimneys, timber, insulation, finishing, and the difference between one product and a complete room.'),
      ),
    },
    {
      period: 'Phase 2',
      title: 'Keyword and semantic research',
      description: rt(
        p('Competitor research and a core of about 1,500 keywords clustered by category and intent.'),
      ),
    },
    {
      period: 'Phase 3',
      title: 'Drupal architecture, content, and design',
      description: rt(
        p('Category navigation, product descriptions, and educational pages on Drupal with HTML, CSS, and PHP.'),
      ),
    },
    {
      period: 'Phase 4',
      title: 'Promotion beside ongoing SEO',
      description: rt(
        p('Contextual advertising aligned to category landing pages. Platform and performance figures are not published.'),
      ),
    },
  ],

  resultsSummary: rt(
    p(
      'The documented outcome is a two-year SEO, Drupal, content, and contextual-advertising programme for a sauna and bath catalog that also supports a complete room: category architecture, a semantic core of about 1,500 keywords, and product and educational content.',
      'The source describes sustained growth and does not publish traffic or conversion percentages. Those figures are not invented.',
    ),
  ),

  metrics: [
    {
      value: '~1,500',
      label: 'Keywords in the semantic core',
      description: rt(
        p(
          'The published size of the keyword foundation mapped onto categories and subcategories. This is a count of keywords in the core, not an increase in rankings and not a traffic figure.',
        ),
      ),
    },
    {
      value: '2 years',
      label: 'Stated collaboration window',
      description: rt(
        p(
          'The collaboration is recorded as approximately two years. The published Sauna Shop paragraph does not assign start and end dates.',
        ),
      ),
    },
  ],

  projectsShowcase: [
    {
      projectName: 'Heater and accessory categories',
      description: rt(
        p('Wood-fired and electric sauna and bath stoves, accessories, and controls. Third-party brands are not treated as in-house lines.'),
      ),
    },
    {
      projectName: 'Materials, chimneys, and finishing',
      description: rt(
        p('Timber, insulation, stainless chimney systems, doors, and interior finishing of the steam room. Gallery images are illustrative.'),
      ),
    },
    {
      projectName: 'Semantic core and Drupal catalog',
      description: rt(
        p('About 1,500 keywords mapped onto the category tree, with educational copy for both a single purchase and a complete room.'),
      ),
    },
  ],

  expertInsight: rt(
    p(
      'The useful complexity is a shop that sells the heater and the room around it — timber, insulation, a flue, and interior finishing — without pretending to manufacture Harvia or Feringer.',
      'About 1,500 keywords only help if those destinations stay separate. Contextual advertising stays unnamed as a platform because the source does not name one. Growth is described, not quantified.',
      'Where the source is silent — percentages, specifications, a country — the correct public line is Not disclosed. This discussion is editorial. It is not a conversation with Sauna Shop.',
    ),
  ),

  clientTestimonial: { quote: null, author: null, position: null, company: null },

  hero: {
    type: 'mediumImpact' as const,
    richText: rtHero(
      p(
        'Two-year SEO, Drupal e-commerce, and contextual advertising for Sauna Shop — materials, heaters, chimneys, and interior finishing for a complete sauna or bath, not only a stove catalog.',
      ),
    ),
    media: mainImageId,
  },

  primary_case_study_category: PRIMARY_CASE_STUDY_CATEGORY,
  case_study_categories: CASE_STUDY_CATEGORIES,

  meta: {
    title: 'Sauna Shop Case Study | Sauna Construction SEO and E-Commerce',
    description:
      'Explore how Neolines supported Sauna Shop with two-year SEO, a 1,500-keyword semantic core, Drupal e-commerce, and contextual advertising for sauna and bath construction.',
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
          displayOrder: 17,
          galleryImages: GALLERY_IMAGES.length,
          metrics: 2,
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
      or: [{ slug: { equals: SLUG } }],
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

  if (existing && existing.slug !== SLUG && existing.slug !== 'sauna-shop') {
    throw new Error(`Related Sauna Shop record exists with a different slug: ${existing.id} ${existing.slug}`)
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
