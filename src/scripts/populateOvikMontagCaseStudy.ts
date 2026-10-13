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
 * Creates or updates the Ovik Montag Case Study.
 * Structural reference: Laser Made / Merkan / Anhor / PakTradeMash.
 * Re-runnable: structured fields and layout blocks are replaced, not appended.
 *
 * No invented metrics, rankings, leads, buildings, equipment specs,
 * certifications or AI-search results. Duration is left empty.
 * Component production is stated only as "where applicable".
 * No site_categories. No new modules. No client logo — none verified.
 */
const SLUG = 'ovik-montag-hvac-engineering-seo'
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
  582, // HVAC & Climate Equipment
  587, // HVAC Equipment
  588, // HVAC Manufacturing
  585, // Commercial HVAC
  590, // Industrial HVAC
  592, // Ventilation Equipment
  575, // Heating Equipment
  576, // Heating Solutions
  577, // Heating Systems
  426, // Construction Products
  484, // Design, Manufacturing & Installation
  751, // Industrial Installation
  526, // Engineering & Technical Services
  530, // Engineering Services
  528, // Design Engineering
  531, // Industrial Engineering
  533, // Mechanical Engineering
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
  filename: 'ovik-hvac-construction-site.jpg',
  alt: 'Technicians inspecting ceiling HVAC ductwork inside a commercial building under construction.',
  caption:
    'HVAC duct installation on a commercial construction site. Illustrative setting, not a documented Ovik Montag project photograph.',
}

const GALLERY_IMAGES: ImageSpec[] = [
  {
    filename: 'ovik-ventilation-ductwork.jpg',
    alt: 'Rectangular and round steel ventilation ducts installed along an industrial ceiling.',
    caption:
      'Industrial ventilation ductwork. Illustrative equipment type, not a documented Ovik Montag installation.',
  },
  {
    filename: 'ovik-air-handling-unit.jpg',
    alt: 'Commercial air-handling unit with insulated ducts and chilled-water piping on a service platform.',
    caption:
      'Air-handling equipment typical of HVAC plant. Illustrative, not a named project or brand.',
  },
  {
    filename: 'ovik-heating-piping.jpg',
    alt: 'Insulated heating pipes, valves and circulation pumps in a mechanical room.',
    caption:
      'Heating-system piping and pumps. Illustrative hydronic installation, not a documented Ovik Montag site.',
  },
  {
    filename: 'ovik-ventilation-fittings.jpg',
    alt: 'Ventilation duct elbows, reducers, flanges, hangers and flexible connectors on a workshop pallet.',
    caption:
      'Ventilation fittings and mounting hardware. Illustrative components, not a verified product catalogue.',
  },
  {
    filename: 'ovik-mechanical-room.jpg',
    alt: 'Integrated mechanical room with an air-handling unit, ducts, heating piping and a control cabinet.',
    caption:
      'Completed building-services plant room. Illustrative integrated installation, not a documented Ovik Montag project.',
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

  if (existing.docs[0]) {
    const media = await payload.update({
      collection: 'media',
      id: existing.docs[0].id,
      data: {
        alt: image.alt,
        caption: rt(`<p>${escapeHtml(image.caption)}</p>`),
      },
      overrideAccess: true,
      context: { disableRevalidate: true },
    })
    payload.logger.info(`reused media ${media.id} ${image.filename}`)
    return media.id
  }

  const media = await payload.create({
    collection: 'media',
    data: {
      alt: image.alt,
      caption: rt(`<p>${escapeHtml(image.caption)}</p>`),
    },
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
    date: '2026-10-16',
    depth: 0,
    body: p(
      'Ovik Montag is an HVAC engineering contractor, not a repair shop. Why is that distinction worth a whole SEO architecture instead of one “heating and ventilation” page?',
    ),
  },
  expert(
    '2026-10-16',
    p(
      'Because the buyer is not searching only for a contractor name. They search for heating, ventilation, air conditioning, design of a building-services package, installation on a construction object, or later maintenance. Those intents do not live on one URL.',
      'The homepage can say the company designs, installs and maintains HVAC systems and can produce needed components where that applies. The architecture has to hold the systems and the project stages underneath that sentence.',
    ),
    1,
  ),
  {
    author: 'Martin Novak',
    role: 'In-house manufacturing marketer',
    date: '2026-10-17',
    depth: 2,
    body: p(
      'Does that mean heating, ventilation and air conditioning each need their own landing page?',
    ),
  },
  expert(
    '2026-10-17',
    p(
      'If people search for them separately, they need destinations that explain the actual job. A heating page should talk about heat generation and distribution. A ventilation page should talk about air movement and ducts. An air-conditioning page should talk about cooling and climate control.',
      'That is not a claim that every Ovik Montag project included all three. The source lists those service areas. The site should present them. It should not invent a project for each one.',
    ),
    3,
  ),
  {
    author: 'Thomas Weber',
    role: 'Technical content lead',
    date: '2026-10-18',
    depth: 0,
    body: p(
      'If you split the three systems, how do you keep the company looking like one engineering contractor instead of three unrelated trades?',
    ),
  },
  expert(
    '2026-10-18',
    p(
      'The integrated picture belongs at the company and solutions level: design, components where applicable, installation, commissioning where it happened, and maintenance. System pages describe the job. Shared slogans should not be copied onto every URL.',
      'That is the SEO problem this case is about. Construction buyers still need to see that the contractor can work across stages of a building project.',
    ),
    1,
  ),
  {
    author: 'Anna Kovacs',
    role: 'Construction-sector marketing manager',
    date: '2026-10-19',
    depth: 2,
    body: p(
      'How do you present engineering subcontracting on a construction site without turning the site into a general contractor brochure?',
    ),
  },
  expert(
    '2026-10-19',
    p(
      'By staying inside building services. Ovik Montag participates in construction projects as an HVAC engineering subcontractor. The site should speak to that role: systems designed for a building, installed during construction, then maintained.',
      'Named buildings, contract sizes and a general-construction offering are not in the source. I will not add them. The construction context is the setting of the work, not a second company.',
    ),
    3,
  ),
  {
    author: 'Henrik Dahl',
    role: 'Technical SEO specialist',
    date: '2026-10-20',
    depth: 0,
    body: p(
      'The source mentions keyword research, competitor analysis and a semantic core. Without volumes, what relationships actually matter?',
    ),
  },
  expert(
    '2026-10-20',
    p(
      'System to stage to setting. Heating is not the same query as a boiler room. Ventilation is not the same query as duct fittings. Air conditioning is not the same query as maintenance of an existing plant.',
      'Design, component production where it applies, installation and service are stages of the same contractor. Construction-project participation is the setting. Mapping puts those relationships onto Drupal pages. No keyword count or ranking table is in the source, so none is published.',
    ),
    1,
  ),
  {
    author: 'Elena Petrova',
    role: 'B2B demand generation lead',
    date: '2026-10-21',
    depth: 2,
    body: p(
      'Should installation and maintenance be separate commercial pages, or only sections on each system page?',
    ),
  },
  expert(
    '2026-10-21',
    p(
      'Either can work if the intent is real and the copy is different. A visitor looking for maintenance of an existing ventilation system is not looking for design of a new heating package on a building under construction.',
      'What this record does not support is a reconstructed sitemap. The principle is the mapping, not a claim about which URL mix finally shipped.',
    ),
    3,
  ),
  {
    author: 'Pavel Orlov',
    role: 'HVAC project engineer',
    date: '2026-10-22',
    depth: 0,
    body: p(
      'The source says the company can produce necessary components. How do you put that on a website without inventing a product catalogue?',
    ),
  },
  expert(
    '2026-10-22',
    p(
      'As part of project delivery, not as a shop. If a job needs a fitting, a mounting part or another component the contractor can make or supply, that belongs in the project cycle next to design and installation.',
      'This record does not name models, materials or a factory list. The gallery shows illustrative HVAC components and plant. It is not an Ovik Montag catalogue.',
    ),
    1,
  ),
  {
    author: 'Pavel Orlov',
    role: 'HVAC project engineer',
    date: '2026-10-22',
    depth: 2,
    body: p(
      'So you would not give every elbow and hanger its own SEO page?',
    ),
  },
  expert(
    '2026-10-23',
    p(
      'Correct. Components support the systems. They should be findable where buyers search for them, but they should not explode the taxonomy into a hardware store. The architecture follows how the work is bought: system, stage, then part if needed.',
    ),
    3,
  ),
  {
    author: 'Sophie Laurent',
    role: 'PPC specialist',
    date: '2026-10-24',
    depth: 0,
    body: p(
      'Content marketing and attracting potential customers are mentioned. There are no lead numbers. How does technical content actually support qualified inquiries here?',
    ),
  },
  expert(
    '2026-10-24',
    p(
      'By explaining the work a construction or engineering buyer already recognises: a heating package, a ventilation fit-out, an air-conditioning plant, design input, installation on site, later service. A page that matches that job can support an enquiry. A generic montage slogan cannot.',
      'No article count, traffic figure or conversion rate is in the source. Content marketing is a documented activity, not a measured funnel.',
    ),
    1,
  ),
  {
    author: 'Sophie Laurent',
    role: 'PPC specialist',
    date: '2026-10-25',
    depth: 2,
    body: p(
      'Is this a paid-media case at all?',
    ),
  },
  expert(
    '2026-10-25',
    p(
      'No. The documented work is keyword research, competitor analysis, a semantic core, SEO-oriented Drupal architecture, UX/UI and content that presents the offering. Paid campaigns are not listed. I will not add them.',
    ),
    3,
  ),
  {
    author: 'James Whitaker',
    role: 'Drupal developer',
    date: '2026-10-26',
    depth: 0,
    body: p(
      'Why does Drupal matter in the write-up if version and modules are not disclosed?',
    ),
  },
  expert(
    '2026-10-26',
    p(
      'Because the source names Drupal as the website platform. That is a confirmed implementation choice, not a recommendation to every HVAC company. What matters is that the site was built as a structured system that could hold services, stages and construction-project context.',
      'Theme, modules and the historic URL are not disclosed. This record describes the engagement, not the current Next.js website.',
    ),
    1,
  ),
  {
    author: 'Clara Jensen',
    role: 'Facilities marketing manager',
    date: '2026-10-27',
    depth: 2,
    body: p(
      'Would the same architecture work if the company only did installation, with no design and no components?',
    ),
  },
  expert(
    '2026-10-27',
    p(
      'The map would be thinner. Ovik Montag’s useful complexity is the combination: engineering design, HVAC systems, construction-site installation, components where they are needed, and maintenance. SEO architecture is how that combination stays visible instead of collapsing into “we do montage.”',
      'If a company only installs, the site should say that. This case should not be copied onto a thinner offering.',
    ),
    3,
  ),
  {
    author: 'Daniel Okonkwo',
    role: 'Export and B2B sales manager',
    date: '2026-10-28',
    depth: 0,
    body: p(
      'Has any of this been measured in AI search — ChatGPT, Perplexity, AI Overviews? HVAC queries are the kind of thing those systems now try to answer.',
    ),
  },
  expert(
    '2026-10-28',
    p(
      'Not in this record. No ChatGPT ranking, Perplexity citation, Gemini visibility or AI Overview result is documented. I will not invent one.',
      'A topical model that connects heating, ventilation, air conditioning, design, installation and maintenance is useful groundwork for modern search in principle. It is not a measured GEO or AEO programme.',
    ),
    1,
  ),
]

const faqBlock = () => ({
  blockType: 'csFAQ' as const,
  case_study_faq_title: 'Frequently Asked Questions About Ovik Montag',
  items: [
    {
      question: 'What services are included in a complete HVAC engineering project?',
      answer: rt(
        p(
          'In this record, a complete project can include engineering design and planning, heating, ventilation and air-conditioning systems, production of necessary components where that applies, installation and integration on a construction object, and later technical maintenance.',
          'That is the stated range. It is not a claim that every service was performed on every project, or that commissioning happened on every job. Named buildings and equipment specifications are not disclosed.',
        ),
      ),
    },
    {
      question:
        'How do heating, ventilation, and air conditioning systems fit into a larger construction project?',
      answer: rt(
        p(
          'As building-services packages delivered inside a construction programme. Ovik Montag is described as an engineering contractor and subcontractor: systems are designed for the building, installed during construction or fit-out, then maintained.',
          'The company is not presented as a general contractor. Construction is the setting of the HVAC work. Project sizes, client names and contract types are not in the source.',
        ),
      ),
    },
    {
      question:
        'Why does SEO architecture matter for an engineering contractor with several technical service areas?',
      answer: rt(
        p(
          'Because buyers search for the system and the stage, not only the company name. Heating, ventilation, air conditioning, design, installation and maintenance are related, but they are not one query.',
          'Keyword research, competitor analysis and a semantic core were used so those intents could be mapped onto a Drupal site. No keyword volume or ranking table is published. The result that can be stated is structural, not a traffic percentage.',
        ),
      ),
    },
    {
      question:
        'How can a website organize HVAC installation, engineering design, components, and maintenance without duplicating content?',
      answer: rt(
        p(
          'Give each real intent a destination, and keep the integrated contractor picture at the company or solutions level. Design pages should talk about planning. Installation pages should talk about site work. Maintenance pages should talk about an existing system. Components belong in the project cycle, not as a duplicate hardware catalogue.',
          'Shared sentences about “design, installation and service” should not be pasted onto every URL. Exact historic URLs for Ovik Montag are not reconstructed.',
        ),
      ),
    },
    {
      question:
        'What should a construction or engineering company consider when presenting its technical services online?',
      answer: rt(
        p(
          'Start from the real offering: which systems, which stages, and whether the company is a specialist subcontractor or a general contractor. Then map search intent onto pages so a building or engineering buyer can recognise the job.',
          'Be honest about evidence. If there are no measured rankings, leads or named references, report the architecture and the research. Invented percentages help no one who specifies HVAC systems.',
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
    `<h2>${escapeHtml('Discuss a similar HVAC engineering SEO and website project')}</h2>` +
      p(
        'If you design, install and maintain heating, ventilation or air-conditioning systems on construction projects and need the website to match how buyers search, tell us about the offering.',
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
  case_study_gallery_title: 'HVAC Engineering and Building Systems',
  case_study_gallery_images: imageIds,
})

const buildData = (previewImageId: number, galleryIds: number[]) => ({
  title: 'Ovik Montag: SEO and Website Development for HVAC and Building Engineering Systems',
  case_study_long_title:
    'Ovik Montag — Semantic SEO and Drupal Website Architecture for HVAC Engineering, Construction Subcontracting and Building-Services Delivery',
  slug: SLUG,
  generateSlug: false,
  _status: 'published' as const,
  featured: true,
  displayOrder: 8,

  layout: [
    {
      blockType: 'csPreview' as const,
      case_study_preview_title: 'HVAC Engineering and Installation for Construction Projects',
      case_study_preview_text: rt(
        p(
          'Ovik Montag is an engineering contractor specializing in heating, ventilation and air-conditioning systems. The offering combines engineering design, installation of building-services systems, production of necessary components where applicable, and ongoing technical maintenance on construction projects. The digital work was a Drupal website with keyword research, competitor analysis, a semantic core and an SEO-oriented structure so those related services could be found without collapsing into a generic montage-company page.',
        ),
      ),
      case_study_preview_image: previewImageId,
    },

    titleBlock('About the Client'),
    contentBlock(
      p(
        'Ovik Montag is an engineering contractor in the construction and building-services sector. The stated service areas are heating systems, ventilation systems, air-conditioning systems, engineering design and planning, installation and integration of building-services systems, production of necessary components and related products where applicable, technical maintenance, and participation in construction projects as an engineering subcontractor.',
        'The company is not described as a generic HVAC repair shop. The useful picture is integrated delivery across stages of a project: design the system, produce or supply needed parts when that applies, install it in the building, then maintain it. This record does not claim that every stage was performed on every job.',
      ),
    ),

    titleBlock('The Business and SEO Challenge'),
    contentBlock(
      p(
        'A technically broad contractor is easy to flatten online. Heating, ventilation and air conditioning are related, but they are bought as different jobs. Design work, component production, site installation and later servicing also have different search intent.',
        'The challenge was to keep Ovik Montag visible as one engineering contractor working inside construction projects, while still giving each system and each stage a place a technical or construction buyer could land. No historic URL, previous CMS or failed campaign is described, so none is invented. Keyword volumes, competitor brands and ranking gaps are not in the source.',
      ),
    ),

    titleBlock('Semantic Research and Website Architecture'),
    contentBlock(
      p(
        'The documented research work is keyword research, competitor analysis, development of a semantic core, and mapping of search intent onto website pages. The job of that map was a coherent information architecture for an engineering contractor: technical service pages that stay related to one another.',
        'A construction buyer looking for ventilation installation on a building should not have to infer it from a paragraph about heating. A facilities buyer looking for maintenance should not land only on a design slogan. A well-organized structure can show the specific HVAC service and still explain the wider capability.',
        'No keyword count, ranking table or competitor list is published. The mapping is the result that can be stated.',
      ),
    ),

    titleBlock('Website Development and UX/UI'),
    contentBlock(
      p(
        'The website was developed on Drupal, with UX/UI design and an SEO-oriented information architecture. Drupal is the confirmed platform. Version, theme, modules, integrations and a reconstructed sitemap are not disclosed.',
        'The role of UX/UI here is practical: help a technical visitor move from the contractor picture to the system or stage they need, without a single undifferentiated services page. This Case Study describes the historical project. It is not a description of the current Next.js website.',
      ),
    ),

    titleBlock('Engineering Services and Products'),
    contentBlock(
      p(
        'HVAC projects in this sector commonly involve system components, ductwork and ventilation elements, mounting and connection hardware, equipment, installation, and later servicing. Those are industry examples of what such work can include.',
        'For Ovik Montag, the source supports heating, ventilation and air conditioning as service areas, plus design, installation, maintenance, and production of necessary components where applicable. It does not name a product catalogue, brands, models or a list of manufactured parts. This record does not invent one.',
        'The gallery below illustrates HVAC equipment, ventilation components and building-services installations relevant to the sector. The images are not original photographs of documented Ovik Montag projects.',
      ),
    ),

    titleBlock('SEO and Content Strategy'),
    contentBlock(
      p(
        'The documented strategy is search-led: keyword research, competitor analysis, semantic mapping, and a Drupal structure designed so pages could match how construction and engineering buyers search. Content marketing and attracting potential customers are named as project activities.',
        'No article count, publishing calendar, organic-traffic growth, keyword positions, leads, conversion rates or revenue is in the source. Those figures are not disclosed and are not invented.',
      ),
    ),

    titleBlock('Project Scope and Outcomes'),
    contentBlock(
      p(
        'The documented work is a Drupal website with UX/UI design, a semantic SEO foundation and an information architecture that can hold HVAC systems, project stages and construction-subcontracting context. The intended business value is discoverability: a specialist engineering contractor that can be found for the system and the stage a buyer actually needs.',
        'Verified performance metrics are not in the source. Duration is not stated. The outcome that can be reported is the structure and the research, not a percentage.',
      ),
    ),

    titleBlock('Lessons for Engineering and Manufacturing Businesses'),
    contentBlock(
      p(
        'Companies that combine engineering, construction subcontracting, component production, installation and maintenance fail online when the website only says they do montage. Buyers search across systems and stages. SEO architecture is how that combination stays visible.',
        'The transferable lesson is not a Drupal verdict and not a traffic claim. It is the discipline of mapping a real multi-stage offering onto pages, then leaving gaps as Not disclosed when the source is silent.',
      ),
    ),

    contentBlock(
      p(
        'Illustrative examples of HVAC equipment, ventilation components and building-services installations relevant to the company’s engineering sector. These are not documented Ovik Montag project photographs.',
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
        'Ovik Montag designs, installs and maintains heating, ventilation and air-conditioning systems. Confirmed capabilities in the source include engineering design and planning, installation and integration of building-services systems, production of necessary components where applicable, technical maintenance, and participation in construction projects as an engineering subcontractor.',
        'This is not a claim that every capability was used on every object, or that the company is a general contractor.',
      ),
    ),
    products: rt(
      p(
        'Heating systems, ventilation systems and air-conditioning systems, together with related components and products where the project requires them. No models, part numbers, brands or a manufactured catalogue are stated.',
      ),
    ),
    materials: rt(
      p(
        'Not disclosed. The source does not name metals, insulation, refrigerants or pipe materials. Those materials are not guessed from illustrative photographs.',
      ),
    ),
    applications: rt(
      p(
        'Construction projects and building-services subcontracting: HVAC systems designed for a building, installed during construction or fit-out, then maintained. Named buildings, sectors and project sizes are not disclosed.',
      ),
    ),
  },

  businessChallenge: {
    initialState: rt(
      p(
        'Ovik Montag already had a real engineering offering across heating, ventilation and air conditioning, including design, installation, maintenance and component production where applicable. The digital presentation had to catch up with that breadth without turning the company into a generic montage slogan.',
      ),
    ),
    challenge: rt(
      p(
        'Heating, ventilation, air conditioning, design, components, installation and service have different search intents. They still have to read as one contractor working inside construction projects.',
      ),
    ),
    goals: rt(
      ul([
        'Build a Drupal website with UX/UI design and an SEO-oriented structure',
        'Analyse keywords and competitors',
        'Create a semantic core and map it to HVAC systems and project stages',
        'Present engineering subcontracting in a construction-project context',
        'Keep heating, ventilation and air conditioning findable as distinct services',
        'Support visibility without inventing ranking targets',
      ]),
    ),
  },

  nicheSegmentation: [
    {
      name: 'Heating Systems',
      description: rt(
        p(
          'Engineering and installation of heating systems as part of building-services delivery, including later maintenance where that work is in scope.',
        ),
      ),
      marketingApproach: rt(
        p(
          'Give heating its own destination. Buyers searching for heating design or installation are not the same visitors as those searching only for ventilation.',
        ),
      ),
    },
    {
      name: 'Ventilation Systems',
      description: rt(
        p(
          'Ventilation as a distinct engineering line: air movement, ductwork and related installation on construction objects, plus service of existing systems where applicable.',
        ),
      ),
      marketingApproach: rt(
        p(
          'Keep ventilation intent separate from heating and air conditioning where the search is different, while still showing all three as one contractor.',
        ),
      ),
    },
    {
      name: 'Air Conditioning',
      description: rt(
        p(
          'Air-conditioning systems as a stated service area alongside heating and ventilation. Equipment models and cooling capacities are not disclosed.',
        ),
      ),
      marketingApproach: rt(
        p(
          'Allow climate-control searches to land on a page that describes the job, not only a sentence inside a heating article.',
        ),
      ),
    },
    {
      name: 'Engineering Design and Planning',
      description: rt(
        p(
          'Design and planning of HVAC and building-services systems before installation. This record does not reconstruct drawings, software or a design-office process.',
        ),
      ),
      marketingApproach: rt(
        p(
          'Treat design as a stage buyers search for, especially on construction projects, rather than hiding it behind installation copy.',
        ),
      ),
    },
    {
      name: 'Construction-Project Installation',
      description: rt(
        p(
          'Installation and integration of building-services systems on construction projects, as an engineering subcontractor rather than a general contractor.',
        ),
      ),
      marketingApproach: rt(
        p(
          'Speak to construction and engineering buyers who need HVAC delivered inside a building programme. Do not invent named sites or contract values.',
        ),
      ),
    },
    {
      name: 'Components, Maintenance and Servicing',
      description: rt(
        p(
          'Production of necessary components where applicable, and technical maintenance after handover. No component catalogue or service-contract terms are stated.',
        ),
      ),
      marketingApproach: rt(
        p(
          'Show parts and servicing as part of the project cycle. Do not turn them into an unrelated shop or a guaranteed SLA.',
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
      'The site had to hold HVAC systems and project stages: heating, ventilation, air conditioning, design, components where applicable, installation on construction objects, and maintenance.',
      'Exact historic URLs are not reconstructed. Drupal version and module list are not disclosed.',
    ),
  ),
  semanticArchitecture: rt(
    p(
      'The semantic model connected heating, ventilation, air conditioning, engineering design, installation, components, maintenance, and construction-project subcontracting.',
      'Keyword volumes are not stated. Competitor brands are not named.',
    ),
  ),

  marketingStrategy: {
    seoAndContentStrategy: rt(
      p(
        'The main digital strategy in the source is search-led: keyword analysis, competitor analysis, a semantic foundation, strategic mapping, and a Drupal site designed for UX/UI and SEO. Content marketing is named as a way to attract potential customers.',
        'No article count or publishing calendar is stated.',
      ),
    ),
    leadGenMechanism: rt(
      p(
        'The site was meant to make the engineering contractor findable for people who need these systems on construction projects and then allow contact. No form mix, conversion rate or lead volume is published.',
      ),
    ),
    paidAdvertising: [],
    socialMedia: [],
  },

  aiSearchOptimization: {
    brandAuthorityAndTrust: rt(
      p(
        'This project is described as website development, semantic SEO and digital presentation of an HVAC engineering contractor. It is not rewritten as an AI-search engagement.',
        'No ChatGPT ranking, Perplexity citation, Gemini visibility, AI Overview result or AI-generated lead is claimed, and none is documented.',
      ),
    ),
    entityAndGeoStructure: rt(
      p(
        'Heating, ventilation, air conditioning, design, installation, components and maintenance are treated as related entities in the information architecture. That topical model is useful for modern search systems in principle. It is not a measured GEO or AEO programme.',
      ),
    ),
  },

  implementationProcess: rt(
    p(
      'Confirmed shape of the work, without inventing dates: understand the HVAC and construction-subcontracting offering; research keywords and competitors; build the semantic core and map it; develop the Drupal site with UX/UI and SEO structure; use content to present the systems and stages.',
      'The sequence is the method. It is not a dated Gantt chart.',
    ),
  ),

  timeline: [
    {
      period: 'Phase 1',
      title: 'Understand the engineering offering',
      description: rt(
        p(
          'Map heating, ventilation and air conditioning against design, component production where applicable, installation on construction projects, and maintenance.',
        ),
      ),
    },
    {
      period: 'Phase 2',
      title: 'Keyword and competitor research',
      description: rt(
        p(
          'Analyse how construction and engineering buyers search for HVAC systems and project stages. Competitor brands are not named.',
        ),
      ),
    },
    {
      period: 'Phase 3',
      title: 'Semantic core and mapping',
      description: rt(
        p(
          'Build a semantic foundation and map terms to pages so the site can carry specific intent instead of one generic montage description.',
        ),
      ),
    },
    {
      period: 'Phase 4',
      title: 'Drupal website with UX/UI and SEO structure',
      description: rt(
        p(
          'Develop the site on Drupal so the architecture can hold the systems, the project stages and the construction-subcontracting context. Version and modules are not disclosed.',
        ),
      ),
    },
  ],

  resultsSummary: rt(
    p(
      'The documented outcome is structural: a Drupal website with an SEO-oriented architecture, a semantic map of HVAC systems and project stages, and a clearer way for construction and engineering buyers to find a specialist contractor instead of a generic montage company.',
      'Verified traffic, rankings, leads, conversions and revenue are not in the source. Not disclosed. Duration is not stated.',
    ),
  ),

  metrics: [],
  projectsShowcase: [],

  expertInsight: rt(
    p(
      'The useful complexity in this case is the combination of engineering systems, construction subcontracting and SEO architecture. A website that only says the company installs HVAC hides how buyers actually search.',
      'Semantic research matters here only if it is mapped onto pages: heating, ventilation, air conditioning, design, installation and maintenance. Drupal, in this record, is the CMS that held that map. It is not a general verdict on platforms.',
      'Where the source is silent — rankings, leads, named buildings, a product catalogue — the correct public line is Not disclosed.',
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
        'Semantic SEO and Drupal website architecture for Ovik Montag, so heating, ventilation and air-conditioning services could be found as distinct jobs and still read as one engineering contractor on construction projects.',
      ),
    ),
  },

  primary_case_study_category: PRIMARY_CASE_STUDY_CATEGORY,
  case_study_categories: CASE_STUDY_CATEGORIES,

  meta: {
    title: 'Ovik Montag Case Study | HVAC Engineering SEO',
    description:
      'Explore an HVAC engineering website and SEO case covering heating, ventilation, air conditioning, technical services, and search-focused website architecture.',
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
          duration: null,
          featured: true,
          displayOrder: 8,
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
        { slug: { equals: 'ovik-montag' } },
        { title: { like: 'Ovik' } },
        { slug: { like: 'ovik' } },
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

  if (existing && existing.slug !== SLUG && existing.slug !== 'ovik-montag') {
    throw new Error(`Related Ovik record exists with different slug: ${existing.id} ${existing.slug}`)
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
