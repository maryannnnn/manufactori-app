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
 * Creates or updates the PromTehMontg Case Study.
 * Facade engineering and installation across several cladding types,
 * with mounting-system engineering, material preparation and processing.
 * SEO, semantic core, website structure, service and material pages.
 * No invented metrics, duration, PPC, URLs, or product specifications.
 * Gallery is illustrative. No site_categories. No client logo.
 */
const SLUG = 'promtehmontg-facade-engineering-installation'
const IMAGE_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'assets')

const EXPERT = 'Maryan Polyak'
const EXPERT_ROLE = 'Manufacturing Digital Marketing & Web Development Expert'

const PRIMARY_CASE_STUDY_CATEGORY = 196
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
  323, // Industrial Content Marketing
  326, // Manufacturing Content Marketing
  428, // Facade Installation
  429, // Facade Systems
  419, // Aluminum Composite Panels
  421, // Building Materials
  417, // Building Products & Materials
  426, // Construction Products
  425, // Construction Materials Manufacturing
  420, // Architectural Products
  712, // Architectural Metal Fabrication
  484, // Design, Manufacturing & Installation
  751, // Industrial Installation
  526, // Engineering & Technical Services
  530, // Engineering Services
  528, // Design Engineering
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
  filename: 'promtehmontg-main-facade.jpg',
  alt: 'Modern metal-and-glass facade with horizontal panel bands, photographed looking up in daylight.',
  caption:
    'Licensed photograph of a metal-panel building facade (David Garrick, Unsplash License). Illustrative, not a documented PromTehMontg project photograph.',
}

const GALLERY_IMAGES: ImageSpec[] = [
  {
    filename: 'promtehmontg-aluminum-cassettes.jpg',
    alt: 'Corner of a commercial building clad in silver-grey aluminum composite panels and aluminum facade cassettes.',
    caption:
      'Illustrative aluminum composite panels and aluminum facade cassettes. Not a verified PromTehMontg contract.',
  },
  {
    filename: 'promtehmontg-stone-substructure.jpg',
    alt: 'Natural stone ventilated cladding with aluminum brackets, rails and insulation visible at an unfinished edge.',
    caption:
      'Illustrative natural stone cladding with a visible supporting substructure. Not a PromTehMontg shop drawing or site record.',
  },
  {
    filename: 'promtehmontg-steel-cassettes.jpg',
    alt: 'Galvanized steel facade cassettes on an industrial building, with mounting rails and brackets exposed at an unfinished bay.',
    caption:
      'Illustrative galvanized steel facade cassettes with a mounting system. Not a documented PromTehMontg installation.',
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
 * 7 top-level branches, mixed shapes, ~24 entries, depth capped at 3.
 * Editorial discussion — not customer comments or PromTehMontg testimonials.
 */
const DISCUSSION: DiscussionEntry[] = [
  {
    author: 'Henrik Dahl',
    role: 'Technical SEO specialist',
    date: '2026-10-13',
    depth: 0,
    body: p(
      'Why does a facade company that works with several cladding types need a broader semantic core than a one-material installer?',
    ),
  },
  expert(
    '2026-10-13',
    p(
      'Because buyers do not search only for “ventilated facades.” They search for aluminum composite panels, aluminum cassettes, ceramic-magnesite boards, natural stone, galvanized steel cassettes, brick-effect panels, a mounting subsystem, engineering, or installation.',
      'Those are related jobs. They are not one contractor homepage. The documented PromTehMontg work started with keyword and competitor research, then a semantic core mapped onto services, materials and technical expertise. A keyword count is not published, so none is copied from AluMatrix.',
    ),
    1,
  ),
  {
    author: 'Elena Petrova',
    role: 'In-house construction marketer',
    date: '2026-10-14',
    depth: 2,
    body: p(
      'Does every material then need its own landing page?',
    ),
  },
  expert(
    '2026-10-14',
    p(
      'Not unless the source says so. The published architecture is sections for services, materials and technical expertise, with unique search-oriented content for relevant categories. That is clustering and navigation. It is not a reconstructed sitemap of six product URLs.',
      'Claiming a page that was never documented is as misleading as stuffing every cladding type onto one slogan.',
    ),
    3,
  ),
  {
    author: 'Thomas Weber',
    role: 'Facade project engineer',
    date: '2026-10-15',
    depth: 0,
    body: p(
      'Why should mounting subsystems and engineering have their own place if the visitor only sees the finished wall?',
    ),
  },
  expert(
    '2026-10-15',
    p(
      'Because the panel only performs if the subframe and the engineering match the cladding. Stone, aluminum cassettes, ceramic-magnesite boards and galvanized steel do not hang on the same assumption. PromTehMontg’s documented offering includes design, preparation and processing, mounting-system engineering, fastening components and installation.',
      'If the site only shows pretty elevations, the bracket query and the engineering query have nowhere to land. The gallery here is illustrative. It is not a PromTehMontg project file.',
    ),
    1,
  ),
  {
    author: 'Anna Kovacs',
    role: 'Specification writer',
    date: '2026-10-16',
    depth: 2,
    body: p(
      'Brick-effect panels look like masonry. Should the website call them brick?',
    ),
  },
  expert(
    '2026-10-16',
    p(
      'No. Brick-effect facade panels are a cladding product that imitates brick coursing. They are not assumed here to be fired masonry. Ceramic-magnesite boards are likewise kept under that name and are not silently rewritten as fibre cement or stone.',
      'Industrial SEO fails when copy improves the material into something the company does not supply. Load tables and fire ratings are not invented to make the distinction sound more technical.',
    ),
    3,
  ),
  {
    author: 'James Whitaker',
    role: 'Industrial web designer',
    date: '2026-10-17',
    depth: 0,
    body: p(
      'The source names a tailored design. Why treat website structure as SEO work rather than a visual redesign?',
    ),
  },
  expert(
    '2026-10-17',
    p(
      'Because navigation is the public form of the semantic map. Construction companies, developers, contractors and architects need to find a material, a mounting system, an engineering package or an installation crew without guessing the menu.',
      'The documented design is professional branding aligned with that structure. Theme, CMS and historic URLs are not disclosed. This is not described as a redesign-only project.',
    ),
    1,
  ),
  {
    author: 'Clara Jensen',
    role: 'UX researcher',
    date: '2026-10-18',
    depth: 2,
    body: p(
      'The source talks about growth in search rankings. Why is there no results table?',
    ),
  },
  expert(
    '2026-10-18',
    p(
      'Because no ranking list, traffic percentage, lead count or conversion rate was published for PromTehMontg. Qualitative language about digital impact is not converted into a metrics block.',
      'The work that can be stated is the method: research, a semantic core, content mapping, architecture around services and materials, and optimisation of those pages.',
    ),
    3,
  ),
  {
    author: 'Sophie Laurent',
    role: 'Content strategist',
    date: '2026-10-19',
    depth: 0,
    body: p(
      'How do you write unique content for materials without turning the site into a catalogue of generic facade benefits?',
    ),
  },
  expert(
    '2026-10-19',
    p(
      'Write to the job, not to insulation slogans. An ACP page explains composite cassettes as a cladding type. A stone page explains natural stone on a ventilated subframe. A mounting page explains that the supporting structure has to match the skin. An installation page explains site work.',
      'Energy-efficiency claims, U-values and certifications are not added because they are not in the source. A publishing calendar is not disclosed.',
    ),
    1,
  ),
  {
    author: 'Pavel Orlov',
    role: 'Construction-sector marketing manager',
    date: '2026-10-20',
    depth: 0,
    body: p(
      'PromTehMontg processes materials and engineers mounting systems. Is this the same story as AluMatrix or GPTM GROUP?',
    ),
  },
  expert(
    '2026-10-20',
    p(
      'No. AluMatrix is documented as an ACP manufacturer with a two-year SEO and PPC dataset. GPTM GROUP is a three-year manufacturer-contractor case with Drupal rebuilds and contextual advertising. PromTehMontg is engineering, preparation and processing, mounting-system design, fastening supply and installation across several cladding types, with SEO and website architecture.',
      'Sharing a source page is not sharing a factory, a CMS or a results table. PPC is not listed for this engagement.',
    ),
    1,
  ),
  {
    author: 'Daniel Okonkwo',
    role: 'B2B demand generation lead',
    date: '2026-10-21',
    depth: 0,
    body: p(
      'Should this case publish a duration?',
    ),
  },
  expert(
    '2026-10-21',
    p(
      'No. The published PromTehMontg paragraph does not state a cooperation length. I will not borrow one year from VentFasad or two years from AluMatrix.',
    ),
    1,
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
      'Not in this record. No ChatGPT, Perplexity or AI Overview result is documented.',
      'A topical model that connects cladding types, substructures, engineering and installation is useful groundwork. It is not a measured GEO programme. This discussion is editorial. It is not a conversation with PromTehMontg.',
    ),
    1,
  ),
  {
    author: 'Martin Novak',
    role: 'In-house manufacturing marketer',
    date: '2026-10-23',
    depth: 2,
    body: p(
      'Could ceramic-magnesite boards be shown in the gallery as fibre-cement for simplicity?',
    ),
  },
  expert(
    '2026-10-23',
    p(
      'No. The supplied material names stay as supplied. The gallery uses three distinct illustrative subjects — aluminum cassettes, stone with a visible subframe, and galvanized steel cassettes — and does not pretend to photograph every category. Ceramic-magnesite boards remain in the copy. They are not relabelled to match a picture.',
    ),
    3,
  ),
]

const faqBlock = () => ({
  blockType: 'csFAQ' as const,
  case_study_faq_title: 'Frequently Asked Questions About PromTehMontg',
  items: [
    {
      question: 'What does an integrated ventilated facade solution include?',
      answer: rt(
        p(
          'In this record, an integrated solution can include facade engineering and design, preparation and processing of cladding materials, mounting-system engineering, supply of fastening components, and installation of the ventilated envelope.',
          'That is the operating model. It is not a claim that every job included every stage, or that PromTehMontg manufactures every cladding brand in-house. Named buildings and specifications are not disclosed.',
        ),
      ),
    },
    {
      question: 'Why do different facade cladding materials need different mounting subsystems?',
      answer: rt(
        p(
          'Cladding weight, format, joint type and movement differ. Aluminum composite panels and aluminum cassettes, ceramic-magnesite boards, natural stone, galvanized steel cassettes and brick-effect panels do not share one default subframe. The supporting structure has to match the skin: load path, ventilation gap, and how the panel is fixed.',
          'That is general facade-engineering practice. PromTehMontg’s documented work includes mounting systems designed for these different cladding materials. Load tables, spans and coatings are not published.',
        ),
      ),
    },
    {
      question: 'What is the difference between aluminum composite panels, facade cassettes, and brick-effect panels?',
      answer: rt(
        p(
          'Aluminum composite panels are sheet products with aluminum faces used as rainscreen cladding. Aluminum and galvanized steel facade cassettes are folded metal units. Brick-effect facade panels imitate brick coursing; they are not treated here as fired masonry. Ceramic-magnesite facade boards are a separate board product and are not renamed as stone or fibre cement.',
          'These are category descriptions for search and navigation. They are not PromTehMontg product datasheets.',
        ),
      ),
    },
    {
      question: 'How can SEO help a facade engineering and installation company reach professional buyers?',
      answer: rt(
        p(
          'Construction companies, developers, contractors and architects search by material, cassette system, mounting subsystem, engineering and installation. Keyword research, competitor analysis and a semantic core clustered around those intents give the website destinations instead of one “facades” slogan.',
          'No ranking table, traffic percentage or lead count is published for PromTehMontg.',
        ),
      ),
    },
    {
      question: 'Why should website structure follow services, materials, and mounting systems together?',
      answer: rt(
        p(
          'A broad technical offering is easy to flatten into a brochure. Unique, search-oriented content for relevant service and material categories, with navigation that can hold engineering and installation beside those materials, is what makes the semantic map usable.',
          'Historic URLs and a claim that every material had its own page are not reconstructed. The CMS is not named.',
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
    `<h2>${escapeHtml('Discuss a similar facade-systems SEO and website project')}</h2>` +
      p(
        'If you engineer, process and install ventilated facades across several cladding types and need the website and search architecture to match that offering, tell us about the work.',
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
  case_study_gallery_title: 'Facade Materials, Subsystems, and Building Envelopes',
  case_study_gallery_images: imageIds,
})

const buildData = (previewImageId: number, galleryIds: number[]) => ({
  title: 'PromTehMontg: SEO and Website Architecture for Facade Engineering',
  case_study_long_title:
    'PromTehMontg — Semantic SEO, Material Categories and Website Structure for Facade Engineering, Processing and Installation',
  slug: SLUG,
  generateSlug: false,
  _status: 'published' as const,
  featured: true,
  displayOrder: 14,

  layout: [
    {
      blockType: 'csPreview' as const,
      case_study_preview_title: 'Facade Engineering, Material Processing, and Ventilated-Facade Installation',
      case_study_preview_text: rt(
        p(
          'PromTehMontg designs, prepares and installs ventilated facade systems as an integrated offering: engineering, processing of cladding materials, mounting-system design, fastening components, and installation. Neolines supported that business with keyword and competitor research, a semantic core clustered around services and materials, website structure, and search-oriented content for relevant service and material pages — not a generic facade-benefits brochure, and not a results table that the source does not publish.',
        ),
      ),
      case_study_preview_image: previewImageId,
    },

    titleBlock('Project Overview'),
    contentBlock(
      p(
        'PromTehMontg is a facade engineering and installation company, not only a site crew hanging one cladding type. The published source describes a ventilated-facade installation business with a complete SEO programme, content mapping, and a website organised around services, materials and technical expertise, with custom design aligned to professional branding.',
        'The operating model that had to be represented is wider than that paragraph: design, preparation and processing of materials, mounting-system engineering, supply of fastening components, and installation across several ventilated-facade cladding types. This case is about that digital work. It is not a primer on rainscreen physics, and Neolines did not install the facades.',
      ),
    ),

    titleBlock('Facade Materials and Mounting Systems'),
    contentBlock(
      p(
        'The documented product and service navigation included these cladding types and systems:'
      ) +
        ul([
          'Aluminum composite panels',
          'Ceramic-magnesite facade boards',
          'Aluminum facade cassettes',
          'Natural stone cladding',
          'Galvanized steel facade cassettes',
          'Brick-effect facade panels',
          'Facade substructures and mounting systems designed for these different cladding materials',
          'Engineering, preparation, processing, and installation of facade systems',
        ]) +
        p(
          'Different skins need different supporting structures. Weight, format, joint and movement change the subframe. That is why mounting-system engineering belongs beside the material list, not as a footnote under a finished photograph.',
          'Material names are kept as supplied. Brick-effect panels are not treated as fired brick. Ceramic-magnesite boards are not rewritten as fibre cement. Specifications, fire ratings, certifications and energy-efficiency claims are not added.',
        ),
    ),

    titleBlock('Marketing Challenge'),
    contentBlock(
      p(
        'A professional buyer may need an ACP cassette, a stone rainscreen, a ceramic-magnesite board, a galvanized steel cassette, a brick-effect panel, a mounting profile, an engineering package or a turnkey crew. Those intents are connected. They are not the same page.',
        'The website had to organise that range so construction companies, developers, contractors and architects could find a relevant solution without flattening the offering into generic facade advantages. No historic domain, previous CMS or complaint log is recorded.',
      ),
    ),

    titleBlock('SEO Strategy'),
    contentBlock(
      p(
        'The documented work is a complete SEO strategy: in-depth keyword research, competitor analysis, a semantic core, structured content mapping, and optimisation of service and material pages. Search intent was clustered around individual facade materials, cassette systems, panel types, mounting subsystems, engineering and installation — so the copy could follow the actual navigation of the business.',
        'That is a description of method. It is not a claim that every material had a verified standalone URL. A keyword count is not published for PromTehMontg and is not borrowed from AluMatrix. Rankings are mentioned qualitatively on the source page and are not converted into a table.',
      ),
    ),

    titleBlock('Website Architecture and Content'),
    contentBlock(
      p(
        'The published site structure guided visitors through services, materials and technical expertise. Unique, search-oriented content was prepared for relevant service and material categories. Custom design supported professional branding rather than treating the project as a visual redesign alone.',
        'A logical industrial website holds engineering, processing, mounting and installation next to the cladding types it actually works with. Historic URLs, CMS name and a reconstructed sitemap are not disclosed.',
      ),
    ),

    titleBlock('Key Takeaways'),
    contentBlock(
      p(
        'Industrial B2B marketing for a facade engineer-installer works when the website matches the operating model: several cladding materials, the subsystems that carry them, and the engineering and installation that make them a building envelope.',
        'Semantic research, content planning and navigation only pay off if they follow that range. Where the source is silent — traffic, rankings, duration, named sites, datasheets — the correct public line is Not disclosed.',
      ),
    ),

    contentBlock(
      p(
        'An illustrative overview of cladding types and supporting structures associated with integrated facade delivery. These are not original photographs of documented PromTehMontg products, workshops or contracts. Ceramic-magnesite boards and brick-effect panels are described in the case copy; they are not forced into every picture.',
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
        'PromTehMontg designs facade systems, prepares and processes cladding materials, engineers mounting systems, supplies fastening components, and installs ventilated facades.',
        'This is not a claim that every cladding sheet was produced in-house. Factory size and line capacities are not disclosed.',
      ),
    ),
    products: rt(
      p(
        'Ventilated facade systems using aluminum composite panels, ceramic-magnesite facade boards, aluminum facade cassettes, natural stone cladding, galvanized steel facade cassettes and brick-effect facade panels, together with matching substructures and mounting systems.',
        'Brick-effect panels are a cladding product that imitates brick. They are not assumed to be masonry. No models or part numbers are stated.',
      ),
    ),
    materials: rt(
      p(
        'The cladding types listed above, plus the metal substructures that support them. Exact stone types, ACP cores, steel gauges and coatings are not disclosed and are not guessed from illustrative photographs.',
      ),
    ),
    applications: rt(
      p(
        'Ventilated facades on buildings where those cladding types and mounting systems are specified. Named sites and a portfolio quantity are not published.',
      ),
    ),
  },

  businessChallenge: {
    initialState: rt(
      p(
        'PromTehMontg already engineered, processed and installed ventilated facades across several cladding types. The digital presence had to present that range as findable services and materials, not as a list of generic facade benefits.',
      ),
    ),
    challenge: rt(
      p(
        'Material, cassette, board, stone, mounting, engineering and installation intents needed destinations without collapsing into one cladding homepage or unverified product URLs.',
      ),
    ),
    goals: rt(
      ul([
        'Research keywords and competitors for facade materials, systems and installation',
        'Build a semantic core clustered around services, cladding types and mounting solutions',
        'Structure the website around services, materials and technical expertise',
        'Write unique, search-oriented content for relevant categories',
        'Keep material names accurate, including ceramic-magnesite boards and brick-effect panels',
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
      name: 'Cladding Materials and Cassette Systems',
      description: rt(
        p(
          'Aluminum composite panels, ceramic-magnesite facade boards, aluminum and galvanized steel cassettes, natural stone, and brick-effect panels as supplied category names.',
        ),
      ),
      marketingApproach: rt(
        p('Cluster search intent by material. Do not merge brick-effect with masonry or magnesite boards with stone.'),
      ),
    },
    {
      name: 'Mounting Subsystems and Fastening Components',
      description: rt(
        p('Substructures and mounting systems designed for those different cladding materials. Catalogues are not published.'),
      ),
      marketingApproach: rt(
        p('Show that the subframe is part of the offering. A cassette query is not a bracket query.'),
      ),
    },
    {
      name: 'Preparation, Processing and Installation',
      description: rt(
        p('Preparation and processing of materials, plus installation of the ventilated envelope. Named contracts are not listed.'),
      ),
      marketingApproach: rt(
        p('Keep processing and installation visible so the company is not reduced to a materials brochure.'),
      ),
    },
  ],

  digitalEcosystem: rt(
    p(
      'The confirmed digital ecosystem is the corporate website — structured around services, materials and technical expertise — with SEO architecture, unique category content, and custom design aligned to professional branding.',
      'CMS, historic domain, ad platforms and social programmes are not disclosed.',
    ),
  ),
  websiteArchitecture: rt(
    p(
      'The published architecture guided visitors through services, materials and technical expertise so engineering, cladding types, mounting systems and installation could sit as related destinations.',
      'Exact historic URLs are not reconstructed. Every material is not claimed to have had its own verified landing page.',
    ),
  ),
  semanticArchitecture: rt(
    p(
      'A semantic core, built from keyword and competitor research, clustered commercial and technical queries around facade materials, cassette systems, panel types, mounting subsystems, engineering and installation.',
      'Keyword volumes and a term count are not published for PromTehMontg.',
    ),
  ),

  marketingStrategy: {
    seoAndContentStrategy: rt(
      p(
        'The documented strategy is search-led: competitor analysis, a semantic core, content mapping, unique search-oriented copy for relevant service and material categories, and on-page optimisation of those pages.',
        'No article count is stated. Generic facade-benefit copy was not the brief.',
      ),
    ),
    leadGenMechanism: rt(
      p(
        'The site was meant to make specific materials, subsystems and installation services findable, then allow contact. No form mix or lead volume is published.',
      ),
    ),
    paidAdvertising: [],
    socialMedia: [],
  },

  aiSearchOptimization: {
    brandAuthorityAndTrust: rt(
      p(
        'This project is described as SEO, website structure and content for a facade engineer-installer. It is not rewritten as an AI-search engagement.',
        'No ChatGPT, Perplexity or AI Overview result is claimed.',
      ),
    ),
    entityAndGeoStructure: rt(
      p(
        'Cladding types, mounting systems, engineering and installation are treated as related entities. That topical model is useful for modern search in principle. It is not a measured GEO programme.',
      ),
    ),
  },

  implementationProcess: rt(
    p(
      'Confirmed shape of the work, without inventing dates: understand the cladding range and mounting logic; research keywords and competitors; build the semantic core and cluster it; structure the site around services, materials and technical expertise; write unique category content; align design with that architecture.',
      'The sequence is the method. A duration is not published.',
    ),
  ),

  timeline: [
    {
      period: 'Phase 1',
      title: 'Map materials, subsystems and services',
      description: rt(
        p(
          'Document cladding types, mounting systems, engineering, processing and installation as the operating model the website had to express.',
        ),
      ),
    },
    {
      period: 'Phase 2',
      title: 'Keyword, competitor and semantic research',
      description: rt(
        p(
          'Cluster search intent around materials, cassettes, boards, stone, mounting, engineering and installation. Competitor brands are not named.',
        ),
      ),
    },
    {
      period: 'Phase 3',
      title: 'Website architecture and category content',
      description: rt(
        p(
          'Organise services, materials and technical expertise, and write unique search-oriented pages for relevant categories. Historic URLs are not reconstructed.',
        ),
      ),
    },
    {
      period: 'Phase 4',
      title: 'On-page optimisation and professional design',
      description: rt(
        p(
          'Optimise service and material pages and align custom design with branding. CMS, theme and a ranking table are not disclosed.',
        ),
      ),
    },
  ],

  resultsSummary: rt(
    p(
      'The documented outcome is structural: an SEO and website-architecture programme for a facade company that engineers, processes and installs several cladding types with matching mounting systems.',
      'No traffic percentage, ranking table, lead count or conversion rate is published for PromTehMontg. Not disclosed. Success is stated as the scope and coherence of that work, not as invented statistics.',
    ),
  ),

  metrics: [],

  projectsShowcase: [
    {
      projectName: 'Engineering and mounting-system design',
      description: rt(
        p('Facade-system engineering and substructures matched to different cladding types. Drawings are not reproduced.'),
      ),
    },
    {
      projectName: 'Material preparation and processing',
      description: rt(
        p('Preparation and processing of cladding materials before installation. Workshop photographs are not in this record.'),
      ),
    },
    {
      projectName: 'Ventilated facade installation',
      description: rt(
        p('Installation of the envelope using the cladding types listed in this case. Named sites are not listed. The gallery is illustrative.'),
      ),
    },
  ],

  expertInsight: rt(
    p(
      'The useful complexity is not “ventilated facades” as a slogan. It is an engineer-installer whose buyers search for a cassette, a board, a stone skin, a steel cassette, a brick-effect panel, a subframe and a crew.',
      'SEO and website structure only work if they follow that range and keep the material names honest. Ceramic-magnesite boards stay ceramic-magnesite. Brick-effect panels stay panels.',
      'Where the source is silent — rankings, duration, datasheets, named buildings — the correct public line is Not disclosed. This discussion is editorial. It is not a conversation with PromTehMontg.',
    ),
  ),

  clientTestimonial: { quote: null, author: null, position: null, company: null },

  hero: {
    type: 'lowImpact' as const,
    richText: rtHero(
      p(
        'SEO, semantic architecture and website structure for PromTehMontg — a facade company that engineers, processes and installs ventilated systems across several cladding materials and matching mounting subsystems.',
      ),
    ),
  },

  primary_case_study_category: PRIMARY_CASE_STUDY_CATEGORY,
  case_study_categories: CASE_STUDY_CATEGORIES,

  meta: {
    title: 'PromTehMontg Case Study | Facade Engineering SEO and Website Structure',
    description:
      'Explore how Neolines supported PromTehMontg with SEO, semantic architecture, and website structure for facade engineering, cladding materials, mounting systems, and installation.',
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
          niches: 4,
          timeline: 4,
          metrics: 0,
          paidAds: 0,
          duration: null,
          featured: true,
          displayOrder: 14,
          categories: CASE_STUDY_CATEGORIES.length,
          galleryImages: GALLERY_IMAGES.length,
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
        { slug: { like: 'promteh' } },
        { slug: { like: 'prom-teh' } },
        { title: { like: 'PromTeh' } },
        { title: { like: 'Promteh' } },
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

  if (existing && existing.slug !== SLUG && existing.slug !== 'promtehmontg') {
    throw new Error(`Related PromTehMontg record exists with different slug: ${existing.id} ${existing.slug}`)
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
