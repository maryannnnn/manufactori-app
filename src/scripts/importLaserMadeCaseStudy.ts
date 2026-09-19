import 'dotenv/config'
import { generateJSON } from '@tiptap/html'
import config from '@payload-config'
import { getPayload } from 'payload'

import { getTiptapExtensions } from '../utilities/richText/extensions'

/** Default media item used as the case study preview / OG image. */
const NEOLINES_MEDIA_ID = 1

/** Resolved against the live taxonomy trees, see laser-made-categories-resolved.md */
const PRIMARY_CASE_STUDY_CATEGORY = 239
const CASE_STUDY_CATEGORIES = [226, 196, 274, 311, 363, 665, 555, 906, 863, 1192, 1110, 963, 969, 994]
const SITE_CATEGORIES = [245, 232, 202, 280, 317, 369, 671, 561, 912, 869, 1198, 1116, 969, 975, 1000]

const rt = (html: string) => generateJSON(html, getTiptapExtensions({ headingLevels: [2, 3, 4] }))
const rtHero = (html: string) =>
  generateJSON(html, getTiptapExtensions({ headingLevels: [1, 2, 3, 4] }))

const contentBlock = (html: string) => ({
  blockType: 'csContent' as const,
  columns: [{ size: 'full' as const, richText: rt(html), enableLink: false }],
})

const titleBlock = (title: string) => ({
  blockType: 'csContentTitle' as const,
  case_study_content_title: title,
})

const buildData = () => ({
  title: 'Laser Made: From a Broken Landing Page to Two Working Manufacturing Websites',
  case_study_long_title:
    'Laser Made: How a Full-Cycle Laser Cutting and Furniture Manufacturer Replaced Two Unstructured Landing Pages With Two Purpose-Built Websites and Five Years of Continuous Digital Growth',
  slug: 'laser-made-two-manufacturing-websites',
  generateSlug: false,
  _status: 'draft' as const,

  featured: true,
  displayOrder: 1,
  duration: '5_years',

  layout: [
    {
      blockType: 'csPreview' as const,
      case_study_preview_title: 'Laser Made: Five Years, Two Websites, One System That Still Works',
      case_study_preview_text: rt(
        '<p>Laser Made is a full-cycle production company working with wood, acrylic, MDF and metal. In 2019 the business had two slow, unstructured WordPress landing pages and no clear way for visitors to understand what it actually made. Over five years the site was rebuilt on Drupal, split into a B2B corporate platform and a B2C decor store, and supported by SEO, PPC, content and social media working together.</p>',
      ),
      case_study_preview_image: NEOLINES_MEDIA_ID,
    },

    titleBlock('About the Client'),
    contentBlock(
      '<p>Laser Made is a full-cycle manufacturing company. Its own production facilities handle laser cutting, milling, painting and assembly, run by an in-house team of specialists. Materials worked on include wood, acrylic, MDF and metal. Output ranges from custom furniture and decorative items to advertising structures and souvenirs.</p><p>Before the project, the company had the equipment and the production capacity, but almost no visibility online.</p>',
    ),

    titleBlock('Starting Point (2019)'),
    contentBlock(
      '<p>The company ran on two WordPress landing pages. Both were slow and had no real structure. Design, production, equipment and services were all crammed onto the same page, so a visitor had no clear way to tell what the company actually did.</p><p>There was no portfolio and no case studies, only a plain list of services. SEO was effectively absent. Paid search spend was going nowhere. Social media accounts existed but were run without a plan and produced no measurable result.</p>',
    ),

    titleBlock('What Was Built'),
    contentBlock(
      '<p>The WordPress landing pages were retired and the site was rebuilt on Drupal. The new structure was organized around the actual production process rather than a generic services list:</p><ul><li>Material processing, 15 categories (plywood, wood, MDF, composite, acrylic, PVC, plastic, and others)</li><li>Outdoor advertising, 7 sections, from illuminated letters to roof-mounted installations</li><li>Interior advertising: exhibition equipment, wayfinding signage, retail space fit-out</li><li>POS materials and retail equipment</li><li>Screens, stained-glass elements, custom furniture, partitions</li><li>A portfolio section with 200+ documented projects, a press and blog center, and a dedicated client-resources section</li></ul><p>A second, separate storefront, DecorTrend.ru, was launched for retail decor sales. It runs as its own platform with its own audience and promotion approach: the corporate site (lasermade.ru) serves B2B, the store serves B2C.</p><p>The semantic core behind the new structure covers 2,000+ keywords, broken down by individual material, process and application (for example, distinguishing "MDF milling" from generic "laser cutting" queries).</p>',
    ),

    titleBlock('Year 1: Foundation'),
    contentBlock(
      '<ul><li>New site built on Drupal from the ground up</li><li>15 material-processing categories defined: plywood, wood, MDF, acrylic, plastic, PVC, composite, polycarbonate, PET, paper, cardboard, felt, fabric, leather, rubber</li><li>7 outdoor-advertising sections defined: letters, boxes and lightboxes, signs, plaques, stands, large structures, entrance groups</li><li>Interior advertising, POS materials and retail-equipment sections built out</li><li>Semantic core collected and clustered (2,000+ queries)</li><li>Baseline PPC campaigns launched for early traffic</li><li>Analytics and conversion tracking configured</li></ul>',
    ),

    titleBlock('Years 2 to 3: Scaling'),
    contentBlock(
      '<ul><li>Optimized content written for each service and material category</li><li>Portfolio populated with 200+ real projects</li><li>Blog launched with expert articles, typically built from a 30-minute interview with the client turned into a roughly 2,000-word article</li><li>DecorTrend.ru online store developed and launched</li><li>Link building through industry publications, mixing free guest posts on industry blogs with paid placements in directories and design and construction media</li><li>10+ social media channels actively managed, including VKontakte, YouTube, Odnoklassniki, Telegram, Pinterest, Twitter/X and Instagram, covering content planning, shooting and design</li><li>Jivo live chat integrated for instant client contact</li></ul>',
    ),

    titleBlock('Years 4 to 5: Optimization and Scaling'),
    contentBlock(
      '<ul><li>Ongoing A/B testing of ad copy and landing pages</li><li>CPC reduction through more precise audience targeting</li><li>Hundreds of keywords reaching Google top positions</li><li>Video content produced covering production processes, case examples and reviews</li><li>Workflow automation introduced from initial request through to production</li></ul>',
    ),

    titleBlock('Site Structure: From One Page to a System'),
    contentBlock(
      '<p>lasermade.ru is organized into 27+ sections, grouped around six practical areas: material processing (15+ types, including 3D milling and CNC facade work), outdoor advertising (7 sections), interior advertising, POS and retail equipment, screens, furniture and decor, and a press-center plus client-resources area (blog, FAQ, free measurement and design requests, delivery information, layout requirements).</p><p>Representative portfolio pages referenced in the source material include a mirrored hallway wardrobe, an oak kitchen with countertop, a veneer bar counter for a cafe, a turnkey wine cellar, decorative radiator screens, ornamental cafe partitions, and wooden restaurant menus.</p><p>decortrend.ru is a separate online store for finished home-decor items, aimed at retail (B2C) buyers rather than the B2B production clients served by the corporate site.</p>',
    ),
  ],

  manufacturingProfile: {
    productionCapabilities: rt(
      '<p>Laser Made operates its own production facilities with an in-house team. Confirmed operations include laser cutting, milling (including 3D milling and CNC facade work), painting and assembly. The source data describes this as a full production cycle rather than a single isolated process.</p>',
    ),
    products: rt(
      '<p>Custom furniture (wardrobes, kitchens, bar counters, wine cellars), decorative screens and partitions, interior wall panels, outdoor advertising structures (illuminated letters, lightboxes, signs, plaques, stands, pylons and roof installations), POS and retail equipment (bar counters, glass display cases, retail shelving), and decor items such as radiator screens and stained-glass elements. Souvenir products are also mentioned in the general description.</p>',
    ),
    materials: rt(
      '<p>Wood, acrylic, MDF and metal are named directly in the source description. The expanded material-processing structure built into the site adds plywood, plastic, PVC, composite, polycarbonate, PET, paper, cardboard, felt, fabric, leather and rubber, 15 categories in total.</p>',
    ),
    applications: rt(
      '<p>Retail spaces, exhibitions and trade stands, offices, restaurants and food courts, hotels, and private homes (decor). Commercial B2B applications include advertising and signage for other businesses. Consumer applications are served through the DecorTrend retail store.</p>',
    ),
  },

  businessChallenge: {
    initialState: rt(
      '<p>As of 2019, the company digital presence was two WordPress landing pages, both slow and without a clear structure. Multiple business lines (design, production, equipment, services) were combined on one page.</p>',
    ),
    challenge: rt(
      '<p>A visitor could not tell what the company actually did. There was no portfolio or case-study material to build trust. Paid search spend was not producing results, and social media activity had no defined strategy or measurable outcome. SEO was effectively not being done.</p>',
    ),
    goals: rt(
      '<p>Give the business a digital structure that clearly separates the B2B production offering from a B2C retail line, build organic visibility for the specific materials and processes the company actually performs, and turn paid advertising and portfolio content into a working lead source. No fixed numeric KPIs are stated in the source data for the start of the project.</p>',
    ),
  },

  nicheSegmentation: [
    {
      name: 'B2B Manufacturing, Custom Fabrication (lasermade.ru)',
      description: rt(
        '<p>The corporate site covers the core production business: material processing, outdoor and interior advertising, POS and retail equipment, and custom furniture and decor manufactured to order. The audience is other businesses commissioning custom production work.</p>',
      ),
      marketingApproach: rt(
        '<p>Structure and content organized around the specific material, process and application (2,000+ keyword semantic core), supported by a 200+ project portfolio and PPC campaigns targeting commercial buyers.</p>',
      ),
    },
    {
      name: 'B2C Retail Decor (DecorTrend.ru)',
      description: rt(
        '<p>A separate online store selling finished home-decor products to individual consumers, run as its own platform apart from the production-focused corporate site.</p>',
      ),
      marketingApproach: rt(
        '<p>Positioned and promoted independently from the corporate site, as its own storefront with its own audience. The source data does not detail channel-by-channel tactics specific to this store beyond its separate launch and positioning.</p>',
      ),
    },
  ],

  digitalEcosystem: rt(
    '<p>Two Drupal-built websites (lasermade.ru, decortrend.ru), Jivo live chat for on-site messaging, Google My Business for local search presence and reviews, and Google Ads for paid search. Contact routes include WhatsApp and Telegram alongside on-site forms.</p>',
  ),
  websiteArchitecture: rt(
    '<p>lasermade.ru: 27+ sections built around 15 material-processing categories, 7 outdoor-advertising sections, interior advertising, POS and retail equipment, screens, furniture and decor, and a press-center and client-resources area.</p><p>decortrend.ru: a standalone e-commerce structure for finished decor products. The specific sub-page breakdown is not detailed in the source data.</p>',
  ),
  semanticArchitecture: rt(
    '<p>A 2,000+ keyword semantic core clustered by individual material, process and application, rather than a small set of generic head terms. The source page references a dedicated site information-architecture diagram, confirming a deliberately mapped structure rather than an organic page list.</p>',
  ),

  marketingStrategy: {
    seoAndContentStrategy: rt(
      '<p>Semantic research and keyword clustering (2,000+ queries), content written per service and material, a blog built from client interviews (roughly 30 minutes of interview per 2,000-word article, starting with 10 to 15 foundational articles then 2 to 4 per month), a 200+ project portfolio, technical performance work (desktop load time 1.5 to 2s, mobile 2.5 to 3s, Google PageSpeed score 85 to 90), link building combining free guest posts with paid placements in industry directories and media, and Google My Business setup for local SEO.</p>',
    ),
    leadGenMechanism: rt(
      '<p>Two form types are used: a short name-and-phone form on the homepage for fast lead capture, and an extended form (service type, material, timeline) on service pages for qualification. A price calculator (material and size to estimated price) is also available. Jivo live chat accounts for roughly 15 to 20% of leads, on the condition that chats are answered within 1 to 2 minutes. WhatsApp and Telegram are offered as direct contact channels.</p>',
    ),
    paidAdvertising: [
      {
        channel: 'google_ads',
        strategy: rt(
          '<p>Continuous PPC campaigns aimed at both the B2B production audience and B2C decor buyers, with precise audience targeting used to bring down cost per click.</p>',
        ),
        campaignStructure: rt(
          '<p>Ongoing A/B testing of headlines, images, descriptions and landing pages. One documented test compared a price-led headline against an emotional, price-free headline. The emotional version outperformed on both CTR and conversion by roughly 20%.</p>',
        ),
        results: rt(
          '<p>Per one comment on the source page, Google Ads accounts for roughly 50% of leads, versus about 30% from organic search, 15% from social media and 5% from direct traffic. This breakdown is presented as an approximate estimate in the source, not an audited figure.</p>',
        ),
      },
    ],
    socialMedia: [
      {
        channel: 'instagram',
        strategy: rt(
          '<p>One of 10+ channels run as part of the broader content plan rather than a standalone campaign.</p>',
        ),
        content: rt('<p>Content shows production processes and finished projects rather than direct advertising.</p>'),
      },
      {
        channel: 'youtube',
        strategy: rt(
          '<p>Used for video content covering production processes, project case examples and reviews, expanded in years 4 and 5.</p>',
        ),
        content: rt(
          '<p>Process and case-example video, filmed on phone cameras for production content (tripod, basic lighting, clip-on microphone). Professional shooting was reserved for brand-image videos only.</p>',
        ),
      },
      {
        channel: 'telegram',
        strategy: rt('<p>Direct-contact channel for consultations, alongside content distribution.</p>'),
      },
      {
        channel: 'other',
        strategy: rt(
          '<p>Covers the remaining channels named in the source data: VKontakte, Odnoklassniki, Pinterest and Twitter/X, run as part of the same 10+ channel content plan. Aggregate result confirmed in the source is 10+ active channels with regular publications, with no per-channel performance metrics given.</p>',
        ),
      },
    ],
  },

  aiSearchOptimization: {
    brandAuthorityAndTrust: rt(
      '<p>Trust signals confirmed in the source data: a 200+ project portfolio, an expert blog built on client interviews, a 13-question project FAQ, and Google My Business reviews (rating cited as 4.5 to 5 stars). No claims are made in the source data about results in ChatGPT, Perplexity, Gemini or other AI search engines, and none are implied here.</p>',
    ),
    entityAndGeoStructure: rt(
      '<p>The site existing structure ties material, process and application together, for example linking a specific material category to the processes performed on it and the finished-product categories that use it, and separates the business into B2B production and B2C retail. This is standard SEO and information-architecture work. The source data does not describe a dedicated GEO or AEO program, so none is claimed here.</p>',
    ),
  },

  implementationProcess: rt(
    '<p>Confirmed stages, drawn from both the main narrative and the FAQ: audit of the starting situation, competitor review (checking the Google top 10 for relevant queries), semantic research and clustering, migration from WordPress to Drupal, architecture and content build-out, PPC launch, analytics and conversion-tracking setup, and ongoing optimization (A/B testing, CPC reduction, content and channel expansion, workflow automation).</p>',
  ),

  timeline: [
    {
      period: 'Year 1',
      title: 'Foundation',
      description: rt(
        '<p>Drupal rebuild, 15-category material structure, 7-section outdoor-advertising structure, 2,000+ keyword semantic core, baseline PPC, analytics setup.</p>',
      ),
    },
    {
      period: 'Years 2 to 3',
      title: 'Scaling',
      description: rt(
        '<p>Content production, 200+ project portfolio, blog launch, DecorTrend.ru launch, link building, 10+ social channels, Jivo chat integration.</p>',
      ),
    },
    {
      period: 'Years 4 to 5',
      title: 'Optimization and Scaling',
      description: rt(
        '<p>A/B testing, CPC reduction, keywords reaching Google top positions, video content, request-to-production automation.</p>',
      ),
    },
  ],

  resultsSummary: rt(
    '<p>Starting from two unstructured WordPress landing pages with no clear positioning, the project produced two purpose-built websites: a B2B corporate platform with 27+ organized sections and a separate B2C decor store. This was backed by a 2,000+ keyword semantic core, a 200+ project portfolio, and 10+ actively managed social channels.</p><p>The company became findable for hundreds of relevant search queries, and paid campaigns moved from an undirected budget drain to a continuously tested, targeted channel. The five-year continuous engagement is itself presented in the source data as the primary evidence that the system kept producing value rather than a one-time fix.</p>',
  ),

  metrics: [
    {
      value: '5 Years',
      label: 'Continuous Client Partnership',
      description: rt(
        '<p>Ongoing monthly engagement without a fixed end date, cited in the source as evidence of a system that kept working rather than a short campaign.</p>',
      ),
    },
    {
      value: '2',
      label: 'Websites Built',
      description: rt('<p>Separate corporate site (B2B production) and online store (B2C decor retail).</p>'),
    },
    {
      value: '27+',
      label: 'Structured Site Sections (lasermade.ru)',
      description: rt(
        '<p>Replaced the original single, unstructured landing page with a navigable, material and process based structure.</p>',
      ),
    },
    { value: '200+', label: 'Portfolio Projects Documented' },
    { value: '2,000+', label: 'Keywords in Semantic Core' },
    { value: '10+', label: 'Active Social Media Channels' },
  ],

  projectsShowcase: [
    {
      projectName: 'Mirrored Hallway Wardrobe',
      description: rt(
        '<p>Custom-built wardrobe with mirror inserts, cited as a representative furniture example from the portfolio.</p>',
      ),
    },
    {
      projectName: 'Oak Kitchen With Countertop',
      description: rt(
        '<p>Custom kitchen build in oak with a matching countertop, cited as a representative furniture example.</p>',
      ),
    },
    {
      projectName: 'Veneer Bar Counter for a Cafe',
      description: rt('<p>Custom bar counter finished in veneer, built for a cafe client.</p>'),
    },
    {
      projectName: 'Turnkey Wine Cellar',
      description: rt('<p>Full custom wine cellar build, delivered turnkey.</p>'),
    },
  ],

  expertInsight: rt(
    '<p>The core production challenge here was breadth, not depth. One workshop makes furniture, outdoor advertising, interior fit-out, POS equipment and decor, using 15 different materials. A single generic "laser cutting services" page cannot carry that. The site had to be organized the way the workshop actually works, material by material and process by process, or visitors and search engines would default back to a shallow, generic read of the business.</p><p>Splitting production (B2B) from decor retail (B2C) into two separate platforms matters for the same reason a factory floor is separated from a showroom: the buyers, the content, and the sales cycle are different, and merging them back into one site would have re-created the original clarity problem in a new form.</p><p>The five-year duration is itself the more instructive data point for other manufacturing businesses. A catalog this wide is not fixed by a single redesign, it is maintained through years of matching content and campaigns to what the workshop is actually capable of producing.</p>',
  ),

  hero: {
    type: 'lowImpact' as const,
    richText: rtHero(
      '<p>Five years of structured digital work turned two broken WordPress landing pages into two working websites: one for B2B production clients, one for retail decor buyers.</p>',
    ),
  },

  primary_case_study_category: PRIMARY_CASE_STUDY_CATEGORY,
  case_study_categories: CASE_STUDY_CATEGORIES,
  site_categories: SITE_CATEGORIES,

  meta: {
    title: 'Laser Made Case Study: From Landing Page to 2 Sites',
    description:
      'Laser Made: full-cycle manufacturer moved from a broken landing page to two structured websites, 200+ projects, and 5 years of steady digital growth.',
    image: NEOLINES_MEDIA_ID,
  },
})

const main = async () => {
  const dry = process.argv.includes('--dry')
  const payload = await getPayload({ config })
  const data = buildData()

  if (dry) {
    console.log('--- DRY RUN ---')
    console.log('layout blocks:', data.layout.length)
    console.log('metrics:', data.metrics.length)
    console.log('niches:', data.nicheSegmentation.length)
    console.log('timeline stages:', data.timeline.length)
    console.log('showcase projects:', data.projectsShowcase.length)
    console.log('case_study_categories:', data.case_study_categories.length)
    console.log('site_categories:', data.site_categories.length)
    console.log(
      '\nsample richText (preview text):\n',
      JSON.stringify(data.layout[0], null, 2).slice(0, 1200),
    )
    process.exit(0)
  }

  const existing = await payload.find({
    collection: 'case-studies',
    where: { slug: { equals: data.slug } },
    limit: 1,
    depth: 0,
  })

  if (existing.totalDocs > 0) {
    console.log(`Case study with slug "${data.slug}" already exists (id ${existing.docs[0].id}).`)
    console.log('Nothing created. Delete it first if you want a clean re-import.')
    process.exit(0)
  }

  const doc = await payload.create({
    collection: 'case-studies',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: data as any,
    draft: true,
    context: { disableRevalidate: true },
  })

  console.log(
    JSON.stringify(
      {
        created: true,
        id: doc.id,
        slug: doc.slug,
        status: doc._status,
        adminUrl: `/admin/collections/case-studies/${doc.id}`,
      },
      null,
      2,
    ),
  )
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
