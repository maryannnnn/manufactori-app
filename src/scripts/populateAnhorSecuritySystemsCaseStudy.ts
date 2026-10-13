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
 * Creates or updates the Security Systems Anhor Case Study.
 * Structural reference: Laser Made / Merkan / PakTradeMash.
 * Re-runnable: structured fields and layout blocks are replaced, not appended.
 *
 * No invented metrics, rankings, leads, buildings, models, certifications
 * or AI-search results. Duration is left empty — it is not in the source.
 * No new categories, fields or modules. No site_categories.
 */
const SLUG = 'security-systems-anhor'
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
  537, // Fire & Emergency Equipment
  529, // Electrical Engineering
  516, // Electrical Equipment
  883, // Telecommunications Equipment
  1155, // Industrial Networking
  649, // Lighting Systems
  526, // Engineering & Technical Services
  530, // Engineering Services
  484, // Design, Manufacturing & Installation
  751, // Industrial Installation
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
  filename: 'anhor-security-control-room.jpg',
  alt: 'Commercial building security control room with CCTV monitors and an integrated alarm panel.',
  caption:
    'Security control room with monitoring screens and an alarm panel. Illustrative setting, not a documented Anhor project photograph.',
}

const GALLERY_IMAGES: ImageSpec[] = [
  {
    filename: 'anhor-fire-protection-panel.jpg',
    alt: 'Wall-mounted fire detection and fire alarm control panel in a commercial corridor.',
    caption:
      'Fire detection and fire-protection control panel. Illustrative equipment type, not a documented installation.',
  },
  {
    filename: 'anhor-access-control-door.jpg',
    alt: 'Office door with an access-control card reader, electric lock and a small dome camera.',
    caption:
      'Access-control reader and door security hardware. Illustrative equipment type.',
  },
  {
    filename: 'anhor-video-surveillance.jpg',
    alt: 'IP video surveillance cameras mounted under a commercial building canopy.',
    caption:
      'Video surveillance cameras on a commercial facade. Illustrative equipment type.',
  },
  {
    filename: 'anhor-electrical-telecom.jpg',
    alt: 'Building closet with structured network cabling, patch panels and an electrical cabinet.',
    caption:
      'Telecommunications cabling and electrical distribution. Illustrative infrastructure, not a documented Anhor site.',
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
 * 5 top-level branches, mixed shapes, depth capped at 3.
 * Editorial discussion — not customer comments.
 */
const DISCUSSION: DiscussionEntry[] = [
  {
    author: 'Lukas Schneider',
    role: 'Industrial marketing consultant',
    date: '2026-10-15',
    depth: 0,
    body: p(
      'Anhor lists fire protection, access control, CCTV, networks and electrical work. How do you put that on a website without one endless services page?',
    ),
  },
  expert(
    '2026-10-15',
    p(
      'You keep the integrated picture, and you still give each system a place to land. A buyer searching for access control is not the same buyer searching for a fire-detection panel or structured cabling.',
      'The homepage can say the company designs, manufactures, installs and maintains building security systems. The architecture has to hold the individual systems underneath that sentence. One generic services page cannot rank for all of them and cannot help a technical visitor either.',
    ),
    1,
  ),
  {
    author: 'Martin Novak',
    role: 'In-house manufacturing marketer',
    date: '2026-10-16',
    depth: 2,
    body: p(
      'Does that mean every listed system needs its own URL, even if some jobs only ever appear as part of a larger fit-out?',
    ),
  },
  expert(
    '2026-10-16',
    p(
      'It means every system that people actually search for needs a destination that explains it. That is not the same as claiming Anhor installed every system on every building. The source lists service areas. The site should present those areas. It should not invent a project for each one.',
    ),
    3,
  ),
  {
    author: 'Thomas Weber',
    role: 'Technical content lead',
    date: '2026-10-17',
    depth: 0,
    body: p(
      'If you split fire, CCTV and access control onto separate pages, how do you avoid thin duplicate copy that just swaps the system name?',
    ),
  },
  expert(
    '2026-10-17',
    p(
      'By writing to the job, not to a template. A fire-protection page should talk about detection, alarm and protection. An access-control page should talk about readers, doors and who is allowed in. A CCTV page should talk about cameras and monitoring.',
      'Shared sentences about "design, installation and maintenance" can live on the company or solutions page. Repeating them on every URL is how you get duplicate content. The semantic map is there to stop that: related pages, different intent.',
    ),
    1,
  ),
  {
    author: 'Henrik Dahl',
    role: 'Technical SEO specialist',
    date: '2026-10-18',
    depth: 0,
    body: p(
      'The source mentions a detailed semantic core and mapping. Without volumes, what relationships actually matter for a security-systems company?',
    ),
  },
  expert(
    '2026-10-18',
    p(
      'System to component to installation to maintenance. Fire protection is not the same query as a control panel. Video surveillance is not the same query as a monitoring room. Electrical lighting is not the same query as power supply.',
      'Keyword and competitor analysis told the team how those intents were worded. Mapping put them onto a Drupal structure. No keyword count or ranking table is in the source, so none is published.',
    ),
    1,
  ),
  {
    author: 'Elena Petrova',
    role: 'B2B demand generation lead',
    date: '2026-10-19',
    depth: 2,
    body: p(
      'Should installation and maintenance be separate commercial pages, or only sections on each system page?',
    ),
  },
  expert(
    '2026-10-19',
    p(
      'Either can work if the intent is real and the copy is different. A visitor looking for maintenance of an existing CCTV system is not looking for a design-and-build of a new fire system. What this record does not support is a claim about which URL mix Anhor finally shipped. The principle is the mapping, not a reconstructed sitemap.',
    ),
    3,
  ),
  {
    author: 'Anna Kovacs',
    role: 'Commercial-property marketing manager',
    date: '2026-10-20',
    depth: 0,
    body: p(
      'These buyers are offices, retail centers and other substantial buildings. Does that change the SEO, or only the tone of the copy?',
    ),
  },
  expert(
    '2026-10-20',
    p(
      'It changes both. A facilities or construction buyer searches for the system in a building context: access control for a commercial site, fire protection for a retail center, structured cabling for an office. Those applications belong in the architecture.',
      'Named buildings are not in the source. The site should speak to those facility types without inventing a reference list.',
    ),
    1,
  ),
  {
    author: 'Pavel Orlov',
    role: 'Building-systems engineer',
    date: '2026-10-20',
    depth: 2,
    body: p(
      'Anti-theft systems for retail feel like a different market from fire panels. Did that need its own branch?',
    ),
  },
  expert(
    '2026-10-21',
    p(
      'Electronic article surveillance is in the source as a service area, so it belongs in the taxonomy. Whether it was a top-level page or a retail application under security is not documented. I will not reconstruct that choice. I will say it should not be hidden inside a sentence about alarms if buyers search for it as its own job.',
    ),
    3,
  ),
  {
    author: 'Sophie Laurent',
    role: 'PPC specialist',
    date: '2026-10-22',
    depth: 0,
    body: p(
      'If the Drupal site and the semantic map were the main work, how does that turn into qualified B2B inquiries? There are no lead numbers here.',
    ),
  },
  expert(
    '2026-10-22',
    p(
      'The mechanism is discoverability, not a published conversion rate. A technical buyer who finds a page that describes the system they need is more likely to enquire than a buyer who lands on a generic contractor paragraph.',
      'No form mix, lead count or revenue figure is in the source. Not disclosed. Architecture can support inquiries. It cannot be reported as a measured funnel without those numbers.',
    ),
    1,
  ),
  {
    author: 'Sophie Laurent',
    role: 'PPC specialist',
    date: '2026-10-23',
    depth: 2,
    body: p(
      'So this case is not a paid-media story at all?',
    ),
  },
  expert(
    '2026-10-23',
    p(
      'Correct. The documented work is keyword research, competitor analysis, a semantic core, SEO-oriented Drupal architecture, UX/UI and site optimization. Paid campaigns are not listed. I will not add them.',
    ),
    3,
  ),
]

const faqBlock = () => ({
  blockType: 'csFAQ' as const,
  case_study_faq_title: 'Frequently Asked Questions About Security Systems Anhor',
  items: [
    {
      question: 'What types of security systems can be integrated into a commercial building?',
      answer: rt(
        p(
          'In this record, Security Systems Anhor works with a related set of building systems: security and alarm, fire detection and fire protection, access control, video surveillance, television, telephone, computer networks and telecommunications, electrical installation and power supply, electrical lighting, electronic article surveillance and anti-theft systems, and public address and sound.',
          'That is the company’s stated service range. It is not a claim that every system was installed together on every building. Design, manufacturing, installation, estimation, commissioning where applicable, and maintenance sit across those areas.',
        ),
      ),
    },
    {
      question:
        'How should security, fire protection, access control, and video surveillance be organized on a technical company website?',
      answer: rt(
        p(
          'As related systems under one integrated contractor, each with a destination that matches how people search. A generic services page cannot carry fire protection, access control and CCTV at once without burying all three.',
          'Shared copy about design and maintenance belongs on the company or solutions level. System pages should describe the actual job. That is the SEO problem this case is about: a wide taxonomy that still reads as one capability.',
        ),
      ),
    },
    {
      question: 'Why does keyword research matter for a company with many engineering services?',
      answer: rt(
        p(
          'Because buyers do not search only for the company name. They search for the system, the component, the installation or the maintenance job. Competitor and keyword analysis show how those intents are worded so the site can map them instead of forcing everything onto one URL.',
          'No keyword volume or ranking table is published for Anhor. The source confirms the research work, not the scores.',
        ),
      ),
    },
    {
      question: 'How can SEO architecture help users find specialized security and electrical services?',
      answer: rt(
        p(
          'By giving specialized intent a page, then linking it back to the integrated offering. A visitor looking for structured cabling or power supply should not have to infer it from a paragraph about alarms.',
          'On the Anhor project the documented implementation is a Drupal site with an SEO-oriented structure, UX/UI work and page mapping from the semantic core. Exact historic URLs are not reconstructed.',
        ),
      ),
    },
    {
      question:
        'What should a technical B2B company consider when structuring service pages for organic search?',
      answer: rt(
        p(
          'Start from the real offering, not from a slogan. Group related systems so the company still looks integrated. Give overlapping intents — design versus installation versus maintenance — enough separation that pages do not copy each other.',
          'Then be honest about evidence. If there are no measured rankings or leads, report the structure and the research. Invented percentages help no one who buys or specifies these systems.',
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
    `<h2>${escapeHtml('Discuss a similar security-systems SEO and website project')}</h2>` +
      p(
        'If you design, manufacture and install building security or electrical systems and need the website to match how buyers search, tell us about the offering.',
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
  case_study_gallery_title: 'Security and Building Systems',
  case_study_gallery_images: imageIds,
})

const buildData = (previewImageId: number, galleryIds: number[]) => ({
  title: 'Security Systems Anhor: SEO and Website Development for Integrated Building Security Systems',
  case_study_long_title:
    'Security Systems Anhor — Semantic SEO and Drupal Website Architecture for Integrated Security, Fire Protection, Access Control and Building Systems',
  slug: SLUG,
  generateSlug: false,
  _status: 'published' as const,
  featured: true,
  displayOrder: 7,

  layout: [
    {
      blockType: 'csPreview' as const,
      case_study_preview_title: 'Integrated Security Systems for Commercial Buildings',
      case_study_preview_text: rt(
        p(
          'Security Systems Anhor provides integrated design, manufacturing, installation, and maintenance of security and building infrastructure systems, including fire protection, access control, video surveillance, telecommunications, and electrical systems. The digital work was a Drupal website with keyword research, a semantic core and an SEO-oriented structure so those related services could be found without collapsing into one generic page.',
        ),
      ),
      case_study_preview_image: previewImageId,
    },

    titleBlock('Project Overview'),
    contentBlock(
      p(
        'Security Systems Anhor works with integrated engineering and security systems for commercial buildings, offices, large retail centers and other substantial facilities. The company designs, manufactures, installs and maintains those systems, and the source also names cost estimation and commissioning where a project needs them.',
        'The listed service areas are security and alarm systems; fire detection and fire protection; access control; video surveillance; television systems; telephone systems; computer networks and telecommunications; electrical installation and power supply; electrical lighting; electronic article surveillance and anti-theft systems; and public address and sound systems.',
        'Those are the company’s service areas. This record does not treat them as proof that every system was installed on every object, and it does not name buildings, contracts, equipment models or certifications.',
      ),
    ),

    titleBlock('The SEO Challenge'),
    contentBlock(
      p(
        'A company with this many related systems has a visibility problem that a slogan cannot fix. Search intent overlaps: security, fire protection, access control, CCTV, networking and electrical engineering are close enough to confuse a thin site, and different enough that one services page will bury most of them.',
        'A generic contractor page can introduce Anhor. It cannot be the page for a fire-detection system, an access-control door, a camera run and a structured-cabling closet at the same time. The digital job was to keep the integrated picture and still make individual services discoverable.',
      ),
    ),

    titleBlock('SEO Research and Semantic Architecture'),
    contentBlock(
      p(
        'The documented research work is keyword analysis, competitor analysis, a detailed semantic keyword core, and mapping of relevant intent onto the website structure. The aim was a coherent hierarchy of related systems rather than a flat list or a single block of copy.',
        'Useful relationships in that map are system to component, design to installation to maintenance, and building type — office, retail, commercial — where the source supports those audiences. Keyword volumes, competitor brands and ranking tables are not in the source. Not disclosed.',
      ),
    ),

    titleBlock('Website Development and UX/UI'),
    contentBlock(
      p(
        'The website was a Drupal project. The source describes SEO-oriented architecture and page mapping, organization of a broad technical service taxonomy, UX/UI improvements and website optimization, with the goal of better organic visibility and a better chance of attracting a relevant audience.',
        'Clear navigation and service landing pages matter here because a technical visitor is looking for a system, not a mood. Drupal version, theme, modules and exact historic URLs are not disclosed. This Case Study is a record of the historical project, not a description of the current Next.js site.',
      ),
    ),

    titleBlock('Integrated Engineering Solutions'),
    contentBlock(
      p(
        'The commercial offer is an integrated security and building-systems contractor: design, production, installation and maintenance across the listed systems. Electrical infrastructure, lighting, telecommunications and anti-theft systems sit in the same family because they belong to the same kind of commercial building, not because every job included every trade.',
        'Photographs in this Case Study illustrate those service areas. They are not authentic photographs of documented Anhor installations. No original screenshots of the old Drupal site were available when this record was created.',
      ),
    ),

    titleBlock('Project Scope and Outcomes'),
    contentBlock(
      p(
        'The documented work is research, semantic mapping, a Drupal website with an SEO-oriented structure, and UX/UI optimization for a company whose catalogue is a set of related building systems.',
        'Intended SEO benefits — stronger organic visibility and a clearer path for relevant visitors — are described in the source as aims of that structure. Verified traffic, rankings, leads, conversions and revenue are not in the source. Not disclosed. Duration is also not stated.',
      ),
    ),

    titleBlock('Lessons for Industrial and Technical B2B SEO'),
    contentBlock(
      p(
        'A wide engineering portfolio becomes searchable when the website copies the way the work is actually bought: by system, by component, by installation or by maintenance, then linked back to the integrated contractor.',
        'The same lesson applies to other industrial and technical businesses where products, components, installation and service form one solution. The map has to be honest. If a number is missing, the public line is the structure, not a fabricated percentage.',
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
        'Security Systems Anhor designs, manufactures, installs and maintains integrated security and building infrastructure systems. The source also names cost estimation and commissioning where applicable.',
        'This is an engineering and systems contractor for commercial buildings, not a claim that every listed capability was delivered together on a single site.',
      ),
    ),
    products: rt(
      p(
        'Security and alarm systems; fire detection and fire protection; access control; video surveillance; television systems; telephone systems; computer networks and telecommunications; electrical installation and power supply; electrical lighting; electronic article surveillance and anti-theft systems; public address and sound systems.',
        'No equipment models, part numbers or technical specifications are stated.',
      ),
    ),
    materials: rt(
      p(
        'Not disclosed. The source does not name panel enclosures, cable types or detector materials.',
      ),
    ),
    applications: rt(
      p(
        'Commercial buildings, offices, large retail centers and other substantial facilities. Named sites, tenders and government contracts are not in the source.',
      ),
    ),
  },

  businessChallenge: {
    initialState: rt(
      p(
        'Anhor already had a wide, technically related offering across security, fire, access, CCTV, communications and electrical systems. The digital problem was to make that range findable without flattening it into one contractor paragraph.',
      ),
    ),
    challenge: rt(
      p(
        'Overlapping search intent across those systems makes a generic services page insufficient. Visitors and search engines needed a hierarchy that kept the integrated capability visible and still let each system be found.',
      ),
    ),
    goals: rt(
      ul([
        'Research keywords and competitors',
        'Build a detailed semantic core and map it to the site',
        'Organize a broad technical service taxonomy',
        'Develop a Drupal website with SEO-oriented architecture and UX/UI improvements',
        'Improve the site’s ability to attract relevant audiences, without inventing ranking targets',
      ]),
    ),
  },

  nicheSegmentation: [
    {
      name: 'Security and Alarm Systems',
      description: rt(
        p('Security and alarm systems for commercial buildings, as a core service area in the source.'),
      ),
      marketingApproach: rt(
        p(
          'Give alarm and security intent its own destination, then link it to fire, access and CCTV so the company still reads as an integrated contractor.',
        ),
      ),
    },
    {
      name: 'Fire Detection and Fire Protection',
      description: rt(
        p('Fire detection and fire-protection systems listed as a distinct service area.'),
      ),
      marketingApproach: rt(
        p(
          'Keep fire-protection search separate from general security copy. A facilities buyer looking for detection and alarm is not looking for a camera list.',
        ),
      ),
    },
    {
      name: 'Access Control',
      description: rt(
        p('Access-control systems for commercial doors and building entry.'),
      ),
      marketingApproach: rt(
        p(
          'Map access-control queries to a page that can explain readers, doors and authorization, rather than folding them into a CCTV paragraph.',
        ),
      ),
    },
    {
      name: 'Video Surveillance',
      description: rt(
        p('Video surveillance and monitoring as a named service area.'),
      ),
      marketingApproach: rt(
        p(
          'Treat cameras and monitoring as their own intent, related to the control room and to other security systems, not as a synonym for alarms.',
        ),
      ),
    },
    {
      name: 'Networks, Telecommunications and Electrical Infrastructure',
      description: rt(
        p(
          'Computer networks, telecommunications, telephone and television systems, electrical installation, power supply and electrical lighting.',
        ),
      ),
      marketingApproach: rt(
        p(
          'These are part of the same commercial-building job. They still need their own landing points so a cabling or power-supply enquiry does not have to infer itself from a security slogan.',
        ),
      ),
    },
    {
      name: 'Retail Anti-Theft and Public Address',
      description: rt(
        p(
          'Electronic article surveillance and anti-theft systems, plus public address and sound, named in the source alongside the other building systems.',
        ),
      ),
      marketingApproach: rt(
        p(
          'Present them as service areas that belong to retail and public-building work. Do not invent store names or sound-system brands.',
        ),
      ),
    },
  ],

  digitalEcosystem: rt(
    p(
      'The confirmed digital ecosystem is the Drupal website, keyword and competitor research, a semantic core, SEO-oriented architecture and page mapping, and UX/UI optimization.',
      'Paid advertising, social programmes, CRM platforms and AI-search tools are not listed as delivered work.',
    ),
  ),
  websiteArchitecture: rt(
    p(
      'The site had to hold an integrated contractor story and a taxonomy of related systems: security, fire, access, CCTV, communications, electrical infrastructure, anti-theft and public address, plus design, installation and maintenance as ways those systems are bought.',
      'Exact historic URLs, Drupal version and modules are not disclosed.',
    ),
  ),
  semanticArchitecture: rt(
    p(
      'The semantic model connected systems, components, installation, maintenance and commercial-building applications. Mapping was the deliverable: intent attached to structure, not a spreadsheet left unused.',
      'Keyword volumes and competitor names are not stated.',
    ),
  ),

  marketingStrategy: {
    seoAndContentStrategy: rt(
      p(
        'The documented strategy is search-led industrial SEO: keyword research, competitor analysis, a detailed semantic core, mapping onto an SEO-oriented Drupal architecture, and UX/UI work to make a wide technical catalogue usable.',
        'No article count, publishing calendar or ranking target is stated.',
      ),
    ),
    leadGenMechanism: rt(
      p(
        'The site was meant to help relevant technical and facilities buyers find a system page and then make contact. No form mix, conversion rate or lead volume is published.',
      ),
    ),
    paidAdvertising: [],
    socialMedia: [],
  },

  aiSearchOptimization: {
    brandAuthorityAndTrust: rt(
      p(
        'This project is described as website development and semantic SEO for a building-security contractor. It is not rewritten as an AI-search engagement.',
        'No ChatGPT ranking, Perplexity citation, Gemini visibility or AI Overview result is claimed.',
      ),
    ),
    entityAndGeoStructure: rt(
      p(
        'Systems, components, installation and maintenance are treated as related entities in the information architecture. That topical model is useful for modern search in principle. It is not a measured GEO or AEO programme.',
      ),
    ),
  },

  implementationProcess: rt(
    p(
      'Confirmed shape of the work, without inventing dates: understand the integrated offering; research keywords and competitors; build the semantic core and map it; develop the Drupal site with SEO-oriented structure and UX/UI improvements; organize the service taxonomy so individual systems remain findable.',
    ),
  ),

  timeline: [
    {
      period: 'Phase 1',
      title: 'Understand the integrated offering',
      description: rt(
        p(
          'Map the stated service areas and the cycle of design, manufacturing, installation, estimation, commissioning where applicable, and maintenance.',
        ),
      ),
    },
    {
      period: 'Phase 2',
      title: 'Keyword and competitor research',
      description: rt(
        p(
          'Analyse how buyers search for related building systems. Competitor brands are not named.',
        ),
      ),
    },
    {
      period: 'Phase 3',
      title: 'Semantic core and page mapping',
      description: rt(
        p(
          'Build a detailed semantic core and attach intent to the website structure so overlapping systems do not share one generic URL.',
        ),
      ),
    },
    {
      period: 'Phase 4',
      title: 'Drupal website, UX/UI and SEO structure',
      description: rt(
        p(
          'Implement the taxonomy in a Drupal site with SEO-oriented architecture and UX/UI improvements. Version and modules are not disclosed.',
        ),
      ),
    },
  ],

  resultsSummary: rt(
    p(
      'The documented outcome is structural: a Drupal website with an SEO-oriented architecture, a semantic map of related building-security systems, and a clearer way for technical visitors to find individual services without losing the integrated contractor picture.',
      'Verified traffic, rankings, leads, conversions and revenue are not in the source. Not disclosed. Duration is not stated.',
    ),
  ),

  metrics: [],
  projectsShowcase: [],

  expertInsight: rt(
    p(
      'For a technical B2B company, SEO starts to work when the website follows the way the work is bought. Security, fire, access, CCTV, cabling and power are related, but they are not one query.',
      'A semantic core is useful only if it is mapped onto pages. Drupal, in this record, is the CMS that held that map. It is not a general verdict on platforms.',
      'Where the source is silent — rankings, leads, named buildings, old-site screenshots — the correct public line is Not disclosed.',
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
        'Semantic SEO and Drupal website architecture for Security Systems Anhor, so a wide set of related building-security and electrical systems could be found as individual services and still read as one integrated contractor.',
      ),
    ),
  },

  primary_case_study_category: PRIMARY_CASE_STUDY_CATEGORY,
  case_study_categories: CASE_STUDY_CATEGORIES,

  meta: {
    title: 'Security Systems Anhor Case Study | SEO for Engineering',
    description:
      'Explore an SEO and website development case for Security Systems Anhor, covering semantic research, site architecture, and integrated building security services.',
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
          displayOrder: 7,
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
      or: [{ slug: { equals: SLUG } }, { title: { like: 'Anhor' } }, { slug: { like: 'anhor' } }],
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

  if (existing && existing.slug !== SLUG) {
    throw new Error(`Related Anhor record exists with different slug: ${existing.id} ${existing.slug}`)
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
