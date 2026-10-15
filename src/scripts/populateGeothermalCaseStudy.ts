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
 * Creates or updates the Geothermal Case Study.
 * Heating-equipment e-commerce plus installation and complete heating systems.
 * Source spelling is Geotermal. Public title is Geothermal.
 * Semantic core is more than 2,000 keywords. No traffic or PPC percentages.
 * The ad platform is not named. Logo is the source circle plus an English wordmark.
 * Gallery images are illustrative. No site_categories. Duration is not published.
 */
const SLUG = 'geothermal-heating-system-solutions'
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
  582, // HVAC & Climate Equipment
  587, // HVAC Equipment
  585, // Commercial HVAC
  526, // Engineering & Technical Services
  530, // Engineering Services
  528, // Design Engineering
  421, // Building Materials
  417, // Building Products & Materials
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
  filename: 'geothermal-preview-radiator.jpg',
  alt: 'White panel radiator under a sash window in a living room, with visible pipe connections.',
  caption:
    'Illustrative residential radiator installation. Not a documented Geothermal project photograph.',
}

const MAIN_IMAGE: ImageSpec = {
  filename: 'geothermal-boiler-room.jpg',
  alt: 'Wall-mounted boiler with circulation pumps, a manifold, gauges, and insulated pipework.',
  caption:
    'Illustrative heating-plant installation. Not a verified photograph of a Geothermal boiler room.',
}

const GALLERY_IMAGES: ImageSpec[] = [
  {
    filename: 'geothermal-gallery-boiler.jpg',
    alt: 'Floor-standing heating cabinet beside insulated risers, red-handled valves, gauges, and a circulation pump.',
    caption:
      'Illustrative boiler-room pipework. Not a Geothermal installation drawing.',
  },
  {
    filename: 'geothermal-gallery-house.jpg',
    alt: 'Two column radiators with pipe drops and a wall thermostat in a house interior.',
    caption:
      'Illustrative house heating circuit. Not a named Geothermal customer home.',
  },
  {
    filename: 'geothermal-gallery-manifold.jpg',
    alt: 'Heating manifold with circulation pumps, flow meters, and color-coded distribution loops.',
    caption:
      'Illustrative distribution manifold. Not a Geothermal specification.',
  },
  {
    filename: 'geothermal-gallery-plant.jpg',
    alt: 'Commercial heating plant with two boilers, circulation pumps, a buffer vessel, and overhead pipe racks.',
    caption:
      'Illustrative larger heating plant. Not a documented hotel or commercial contract.',
  },
]

const LOGO_IMAGE: ImageSpec = {
  filename: 'geothermal-logo-en.png',
  alt: 'Geothermal logo: original circular yellow, green, and red geometric symbol beside the word Geothermal.',
  caption:
    'Horizontal adaptation of the authentic circular Geothermal mark. The symbol is the source artwork. The English word was set beside it. The source file is a small raster, not a vector redraw.',
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
    date: '2026-11-02',
    depth: 0,
    body: p(
      'Why is a boiler category not enough for a company that also installs complete heating systems?',
    ),
  },
  expert(
    '2026-11-02',
    p(
      'Because the published catalog is boilers, heat pumps, pumps, radiators, water heaters, and complete heating systems, for residential and commercial buildings. A person buying a radiator and a person planning a whole system are different queries.',
      'The semantic core of more than 2,000 keywords had to cover product variations, brands, and installation. That figure is the size of the core, not a ranking total.',
    ),
    1,
  ),
  {
    author: 'Elena Petrova',
    role: 'In-house e-commerce marketer',
    date: '2026-11-03',
    depth: 2,
    body: p(
      'The source mentions brand pages. Do we treat those brands as Geothermal products?',
    ),
  },
  expert(
    '2026-11-03',
    p(
      'No. Brand and product pages existed so a manufacturer name could land on a comparison and a description. The source does not name the manufacturers, so none are invented, and none are claimed as Geothermal factories.',
    ),
    3,
  ),
  {
    author: 'Thomas Weber',
    role: 'Heating engineer',
    date: '2026-11-04',
    depth: 0,
    body: p(
      'Can we publish a nine-step design method, capacities, and a seasonal maintenance package?',
    ),
  },
  expert(
    '2026-11-04',
    p(
      'The source names complete heating systems and professional installation. It does not publish a numbered method, boiler capacities, pipe sizes, or a maintenance contract.',
      'A complete system still has to be explained as equipment plus layout, distribution, and installation. That is content structure. It is not a specification and not a service-level promise.',
    ),
    1,
  ),
  {
    author: 'Anna Kovacs',
    role: 'Specification writer',
    date: '2026-11-05',
    depth: 2,
    body: p(
      'The gallery shows boiler rooms and a larger plant. Are those their sites?',
    ),
  },
  expert(
    '2026-11-05',
    p(
      'No. Those photographs are illustrative. Hotels and apartment buildings are not listed as documented customers. The source says residential and commercial markets, and it stops there.',
    ),
    3,
  ),
  {
    author: 'Sophie Laurent',
    role: 'PPC specialist',
    date: '2026-11-06',
    depth: 0,
    body: p(
      'PPC is named. Which network, and what were the results?',
    ),
  },
  expert(
    '2026-11-06',
    p(
      'The source says organic SEO and PPC together improved visibility, traffic, and conversions. It does not name the network, the budget, or the percentages. I will not borrow figures from another heating case.',
    ),
    1,
  ),
  {
    author: 'James Whitaker',
    role: 'Web developer',
    date: '2026-11-07',
    depth: 0,
    body: p(
      'Drupal is named. Is this Next.js site the original shop?',
    ),
  },
  expert(
    '2026-11-07',
    p(
      'No. Drupal with custom HTML, CSS, and PHP is the published note about the historic Geotermal store. This page is a record of that project. The source spells the name Geotermal. The English wordmark on this case is Geothermal.',
    ),
    1,
  ),
  {
    author: 'Clara Jensen',
    role: 'Content strategist',
    date: '2026-11-08',
    depth: 2,
    body: p(
      'How should product comparison sit next to an installation page?',
    ),
  },
  expert(
    '2026-11-08',
    p(
      'Comparison helps someone choosing a boiler or a radiator. The installation and complete-system pages are for someone who needs the parts to work as one system. They should link. They should not be the same URL.',
    ),
    3,
  ),
  {
    author: 'Lukas Schneider',
    role: 'Technical SEO specialist',
    date: '2026-11-09',
    depth: 0,
    body: p(
      'Has any of this been measured in AI search?',
    ),
  },
  expert(
    '2026-11-09',
    p(
      'Not in this record. Category mapping and product-comparison copy are useful groundwork. They are not a ChatGPT, Perplexity, or AI Overview result. This discussion is editorial. It is not a conversation with Geothermal.',
    ),
    1,
  ),
]

const faqBlock = () => ({
  blockType: 'csFAQ' as const,
  case_study_faq_title: 'Frequently Asked Questions About Geothermal',
  items: [
    {
      question: 'What is included in a complete heating-system project in this case?',
      answer: rt(
        p(
          'The published scope is heating equipment and installation: boilers, heat pumps, circulation pumps, radiators, water heaters, and complete heating systems for residential and commercial buildings. A complete system is the equipment plus the installation that makes those parts work together.',
          'A numbered engineering method, capacities, pipe dimensions, and a maintenance contract are not published.',
        ),
      ),
    },
    {
      question: 'What equipment did the catalog actually name?',
      answer: rt(
        p(
          'Boilers, heat pumps, pumps, radiators, water heaters, and complete heating systems. Brand pages and product comparisons were part of the site. The manufacturer names themselves are not listed in the source paragraph, so they are not added here.',
        ),
      ),
    },
    {
      question: 'Why does boiler-room and pipework planning matter if the site also sells single products?',
      answer: rt(
        p(
          'A boiler, a pump, and a radiator only heat a building if the layout, distribution, and controls match. The site had to serve someone buying one product and someone planning that whole system.',
          'The gallery images are illustrative. They are not Geothermal shop drawings, and they are not a safety specification.',
        ),
      ),
    },
    {
      question: 'How were more than 2,000 keywords organized?',
      answer: rt(
        p(
          'Keyword and competitor research produced a semantic core of more than 2,000 keywords covering product variations, brand differentiation, and installation services. Those terms were mapped onto categories such as boilers, heat pumps, radiators, water heaters, and complete heating systems.',
          'The figure is the size of the core. It is not a count of new rankings, and no traffic percentage is published.',
        ),
      ),
    },
    {
      question: 'How did SEO and PPC support both equipment sales and installation?',
      answer: rt(
        p(
          'Organic pages and paid campaigns were aimed at product queries and at installation and complete-system queries, with landing pages aligned to that intent. The source describes improvement in visibility, traffic, and conversions and does not print the numbers.',
          'The advertising platform and budgets are not named.',
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
    `<h2>${escapeHtml('Discuss a similar heating catalog and installation project')}</h2>` +
      p(
        'If you sell heating equipment and also design or install complete systems, tell us about the catalog and the services that have to stay visible beside it.',
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
  case_study_gallery_title: 'Boiler Rooms, Radiators, and Distribution',
  case_study_gallery_images: imageIds,
})

const buildData = (
  previewImageId: number,
  mainImageId: number,
  galleryIds: number[],
  logoId: number,
) => ({
  title: 'Geothermal: SEO and E-Commerce for Complete Heating-System Solutions',
  case_study_long_title:
    'Geothermal — SEO, Drupal E-Commerce, and PPC for Heating Equipment and Complete Heating Systems',
  slug: SLUG,
  generateSlug: false,
  _status: 'published' as const,
  featured: true,
  displayOrder: 18,
  duration: null,
  company_logo: logoId,

  layout: [
    {
      blockType: 'csPreview' as const,
      case_study_preview_title: 'Heating Equipment and Complete Heating Systems',
      case_study_preview_text: rt(
        p(
          'Geothermal is a heating-equipment business whose published offer also covers installation and complete heating systems for residential and commercial buildings — not only a shelf of boilers and radiators. Neolines supported that catalog with a semantic core of more than 2,000 keywords, a Drupal e-commerce site, product and brand content, and PPC beside organic search.',
        ),
      ),
      case_study_preview_image: previewImageId,
    },

    titleBlock('Project Overview'),
    contentBlock(
      p(
        'The published source describes Geotermal as an e-commerce platform for heating equipment and installation systems, from boilers and pumps to radiators and water heaters, for residential and commercial buildings. This case uses the English name Geothermal. The source spelling is Geotermal.',
        'The distinction that had to survive on the website is the complete system. Categories named in the source are boilers, heat pumps, radiators, water heaters, and complete heating systems, plus professional installation. Third-party brands stay third-party. Manufacturer names are not listed in the source paragraph, so they are not invented.',
      ),
    ),

    titleBlock('Equipment and the Heating Plant'),
    contentBlock(
      p(
        'A boiler, a heat pump, a circulation pump, a radiator, and a water heater are separate purchases. They only heat a building if pipework, distribution, controls, and the plant layout match the equipment. The site had to show that relationship without turning every component into one generic “heating” page.',
        'Capacities, pipe dimensions, certifications, and safety guarantees are not published and are not added here. Gas-fired and other fuel-fired equipment still needs the design and installation that the equipment type requires. This page does not substitute for that requirement.',
      ),
    ),

    titleBlock('Complete Systems and Installation'),
    contentBlock(
      p(
        'The documented service is professional installation of complete heating systems, alongside the catalog. A useful public explanation of that work covers the building and its heat demand, the choice of equipment, the plant layout, distribution through the building, installation, and making the system ready to run.',
        'That sequence is how the subject has to be explained. It is not a published Geothermal method statement. Ongoing maintenance, seasonal preparation, response times, and a service contract are not in the source, so they are not claimed. Documented building contexts are residential and commercial. Hotels and apartment buildings are not named as customers.',
      ),
    ),

    titleBlock('Website Architecture and Drupal'),
    contentBlock(
      p(
        'The original site was developed on Drupal with custom HTML, CSS, and PHP. That is the historic store. It is not a claim that the current Next.js and Payload site is that implementation.',
        'The published structure organized boilers, heat pumps, radiators, water heaters, and complete heating systems so navigation, brand pages, product comparisons, and installation information could sit beside one another. Exact historic URLs and interface details that are not in the source are not reconstructed.',
      ),
    ),

    titleBlock('SEO and the Semantic Core'),
    contentBlock(
      p(
        'Keyword and competitor research produced a semantic core of more than 2,000 keywords covering product variations, brand differentiation, and installation services. Mapping put those terms on category, brand, and service pages, with internal links between a product and the complete-system destination.',
        'The 2,000 figure is the size of the core. The source says the work improved search visibility, organic traffic, and conversions. It does not publish the percentages, so none are added.',
      ),
    ),

    titleBlock('PPC Beside Organic Search'),
    contentBlock(
      p(
        'PPC campaigns sat beside SEO for product sales and installation-related services. The useful split is intent: a specific piece of equipment versus a complete system for a building, with the landing page matching that query.',
        'The source does not name the advertising platform, the number of campaigns, or the budgets. Those details are not borrowed from another case.',
      ),
    ),

    titleBlock('Key Takeaways'),
    contentBlock(
      p(
        'A heating catalog only works when the boiler, the heat pump, the radiator, and the installation can be found separately and still read as one system.',
        'More than 2,000 keywords only help if that map stays intact. Where the source is silent — traffic percentages, the ad platform, capacities, a maintenance contract — the correct public line is Not disclosed.',
      ),
    ),

    contentBlock(
      p(
        'Illustrative views of a heating plant, radiators, distribution, and a larger boiler room. These are not original photographs of documented Geothermal installations.',
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
        'Geothermal is documented as a seller and installer of heating equipment and complete heating systems. It is not documented as the manufacturer of the third-party brands in the catalog.',
      ),
    ),
    products: rt(
      p(
        'Heating boilers, heat pumps, circulation pumps, radiators, water heaters, and the components of complete heating systems, as named in the source.',
      ),
    ),
    materials: rt(
      p(
        'Pipework, valves, and controls belong to a complete system. Exact materials, diameters, and alloys are not disclosed.',
      ),
    ),
    applications: rt(
      p(
        'Residential and commercial buildings. Named sites, hotels, and apartment projects are not listed.',
      ),
    ),
  },

  businessChallenge: {
    initialState: rt(
      p(
        'Geothermal already offered heating equipment and installation. A storefront that only ranked for one product type would hide the complete system.',
      ),
    ),
    challenge: rt(
      p(
        'Categories, brands, comparisons, and installation pages had to serve both a single purchase and the planning of a heating system.',
      ),
    ),
    goals: rt(
      ul([
        'Map a semantic core of more than 2,000 keywords onto products and installation',
        'Keep boilers, heat pumps, radiators, water heaters, and complete systems as separate destinations',
        'Explain installation without inventing a specification',
        'Run PPC beside SEO without inventing a platform or a results table',
      ]),
    ),
  },

  nicheSegmentation: [
    {
      name: 'Boilers, heat pumps, and water heaters',
      description: rt(
        p('Named equipment categories, with brand and comparison pages. Manufacturer names are not reconstructed.'),
      ),
      marketingApproach: rt(
        p('A boiler query lands on a boiler destination, not on a generic heating homepage.'),
      ),
    },
    {
      name: 'Radiators, pumps, and distribution',
      description: rt(
        p('Emitters and circulation equipment that only make sense with the rest of the circuit.'),
      ),
      marketingApproach: rt(
        p('Keep the component findable and link it to the system page.'),
      ),
    },
    {
      name: 'Complete heating systems and installation',
      description: rt(
        p('Professional installation for residential and commercial buildings. Capacities and contracts are not published.'),
      ),
      marketingApproach: rt(
        p('A system query is not the same URL as a single radiator.'),
      ),
    },
    {
      name: 'Product comparison',
      description: rt(
        p('The source names product comparison as part of how buyers chose equipment.'),
      ),
      marketingApproach: rt(
        p('Comparison supports a purchase. It does not replace the installation page.'),
      ),
    },
  ],

  digitalEcosystem: rt(
    p(
      'The confirmed digital ecosystem is a Drupal e-commerce site with category, brand, comparison, and installation pages, plus PPC beside organic search.',
      'The ad platform, CRM, and social programmes are not named.',
    ),
  ),
  websiteArchitecture: rt(
    p(
      'Published architecture: boilers, heat pumps, radiators, water heaters, and complete heating systems, with brand pages, product comparisons, and installation information.',
      'Exact historic URLs are not reconstructed. Drupal is the confirmed CMS of the original shop.',
    ),
  ),
  semanticArchitecture: rt(
    p(
      'A semantic core of more than 2,000 keywords covering product variations, brand differentiation, and installation services, mapped onto those destinations.',
      'The figure is the size of the core. It is not an increase in ranked keywords.',
    ),
  ),

  marketingStrategy: {
    seoAndContentStrategy: rt(
      p(
        'Keyword and competitor research, a semantic core, category and brand pages, SEO-oriented product descriptions, comparisons, and installation content.',
        'No article count and no ranking table are stated.',
      ),
    ),
    leadGenMechanism: rt(
      p(
        'Organic pages and paid landing pages were meant to match a product query or a complete-system query, then allow contact or purchase. Lead volume is not published.',
      ),
    ),
    paidAdvertising: [
      {
        channel: 'other' as const,
        strategy: rt(
          p(
            'PPC alongside SEO for heating equipment and installation-related services.',
            'The platform is not named on the Geothermal source.',
          ),
        ),
        campaignStructure: rt(
          p(
            'Campaigns followed product categories and installation intent. Historic ads and campaign counts are not reconstructed.',
          ),
        ),
        results: rt(
          p(
            'The source describes improvement in visibility, traffic, and conversions and does not publish the figures. None are added here.',
          ),
        ),
      },
    ],
    socialMedia: [],
  },

  aiSearchOptimization: {
    brandAuthorityAndTrust: rt(
      p(
        'This project is described as Drupal e-commerce, SEO, content, and PPC for a heating catalog and installation offer. It is not rewritten as an AI-search engagement.',
        'No ChatGPT, Perplexity, or AI Overview result is claimed.',
      ),
    ),
    entityAndGeoStructure: rt(
      p(
        'Boilers, heat pumps, radiators, water heaters, and complete systems are related parts of one offer. That is not a measured GEO programme, and no country is assigned.',
      ),
    ),
  },

  implementationProcess: rt(
    p(
      'Confirmed shape of the work: understand the catalog and the installation offer; research keywords and competitors; build a semantic core of more than 2,000 keywords; map Drupal categories, brands, and installation pages; write comparison and product content; run PPC beside SEO.',
      'The sequence is the method. Exact dates and a project duration are not published.',
    ),
  ),

  timeline: [
    {
      period: 'Phase 1',
      title: 'Map equipment and complete systems',
      description: rt(
        p('Boilers, heat pumps, radiators, water heaters, pumps, and installation for residential and commercial buildings.'),
      ),
    },
    {
      period: 'Phase 2',
      title: 'Keyword and semantic research',
      description: rt(
        p('Competitor research and a core of more than 2,000 keywords across products, brands, and installation.'),
      ),
    },
    {
      period: 'Phase 3',
      title: 'Drupal architecture and content',
      description: rt(
        p('Category navigation, brand pages, comparisons, and installation content on Drupal with HTML, CSS, and PHP.'),
      ),
    },
    {
      period: 'Phase 4',
      title: 'PPC beside ongoing SEO',
      description: rt(
        p('Paid search aligned to product and installation intent. Platform and performance figures are not published.'),
      ),
    },
  ],

  resultsSummary: rt(
    p(
      'The documented outcome is an SEO, Drupal, content, and PPC programme for a heating catalog that also offers installation and complete systems: category and brand architecture, product comparisons, and a semantic core of more than 2,000 keywords.',
      'The source describes growth in visibility, traffic, and conversions and does not publish the percentages. A collaboration length is not stated.',
    ),
  ),

  metrics: [
    {
      value: '2,000+',
      label: 'Keywords in the semantic core',
      description: rt(
        p(
          'The published size of the keyword foundation for product variations, brands, and installation services. This is a count of keywords in the core, not an increase in rankings and not a traffic figure.',
        ),
      ),
    },
  ],

  projectsShowcase: [
    {
      projectName: 'Heating equipment categories',
      description: rt(
        p('Boilers, heat pumps, pumps, radiators, and water heaters, with comparison and brand pages. Manufacturer names are not reconstructed.'),
      ),
    },
    {
      projectName: 'Complete heating systems and installation',
      description: rt(
        p('Installation for residential and commercial buildings. Capacities, drawings, and maintenance contracts are not published. Gallery images are illustrative.'),
      ),
    },
    {
      projectName: 'Semantic core',
      description: rt(
        p('More than 2,000 keywords mapped onto product, brand, and installation destinations.'),
      ),
    },
  ],

  expertInsight: rt(
    p(
      'The useful complexity is a catalog that also has to explain a complete heating system: the boiler or heat pump, the pumps and radiators, and the installation, without pretending to manufacture unnamed third-party brands.',
      'More than 2,000 keywords only help if those destinations stay separate. PPC stays unnamed as a platform because the source does not name one. Growth is described, not quantified.',
      'Where the source is silent — percentages, capacities, a maintenance contract, a country — the correct public line is Not disclosed. This discussion is editorial. It is not a conversation with Geothermal.',
    ),
  ),

  clientTestimonial: { quote: null, author: null, position: null, company: null },

  hero: {
    type: 'mediumImpact' as const,
    richText: rtHero(
      p(
        'SEO, Drupal e-commerce, and PPC for Geothermal — heating equipment, installation, and complete heating systems for residential and commercial buildings, not only a product shelf.',
      ),
    ),
    media: mainImageId,
  },

  primary_case_study_category: PRIMARY_CASE_STUDY_CATEGORY,
  case_study_categories: CASE_STUDY_CATEGORIES,

  meta: {
    title: 'Geothermal Case Study | Heating Systems SEO and E-Commerce',
    description:
      'Explore how Neolines supported Geothermal with SEO, a semantic core of more than 2,000 keywords, Drupal e-commerce, and PPC for heating equipment and complete heating systems.',
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
          duration: null,
          featured: true,
          displayOrder: 18,
          galleryImages: GALLERY_IMAGES.length,
          metrics: 1,
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
    where: { slug: { equals: SLUG } },
    limit: 2,
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
  const existing = duplicates.docs[0]

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
