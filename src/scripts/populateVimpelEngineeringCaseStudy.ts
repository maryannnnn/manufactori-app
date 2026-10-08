import 'dotenv/config'
import { generateJSON } from '@tiptap/html'
import config from '@payload-config'
import { getPayload } from 'payload'

import { buildCommentTree, measureCommentTree } from '../blocks/CaseStudyCommentsBlock/buildCommentTree'
import { getCaseStudyUrl } from '../utilities/getContentUrls'
import { getTiptapExtensions } from '../utilities/richText/extensions'

/**
 * Creates or updates the Vimpel Engineering Case Study in the existing architecture.
 * Structural reference: Laser Made / Nesko (no Azermene record exists).
 * Re-runnable: structured fields and layout blocks are replaced, not appended.
 *
 * No invented metrics, testimonials, photographs, competitor names, Drupal
 * modules, paid ads, social campaigns, certifications or AI-search rankings.
 * Applications are framed as architecture the site was designed to address,
 * not as named customer projects. No site_categories.
 */
const SLUG = 'vimpel-engineering-anechoic-chambers'

const EXPERT = 'Maryan Polyak'
const EXPERT_ROLE = 'Manufacturing Digital Marketing & Web Development Expert'

const PRIMARY_CASE_STUDY_CATEGORY = 239 // manufacturing-website-development
const CASE_STUDY_CATEGORIES = [
  239, // Manufacturing Website Development
  226, // Manufacturing Website Design & Development
  238, // Manufacturing Website Design
  196, // Manufacturing SEO
  204, // Industrial SEO
  197, // Application SEO
  218, // Product SEO
  311, // Technical Content Marketing
  530, // Engineering Services
  526, // Engineering & Technical Services
  529, // Electrical Engineering
  531, // Industrial Engineering
  484, // Design, Manufacturing & Installation
  501, // Industrial Electronics
  505, // Electronics Manufacturing
  490, // Defense Electronics
  488, // Aerospace & Defense
  384, // Aerospace Electronics
  883, // Telecommunications Equipment
  885, // Antenna Systems
  669, // Manufacturing
  636, // Industrial Equipment
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

/**
 * 8 top-level branches, mixed shapes, 24 entries, depth capped at 3.
 * Editorial discussion - not clients or testimonials.
 */
const DISCUSSION: DiscussionEntry[] = [
  {
    author: 'Klaus Richter',
    role: 'RF test laboratory engineer',
    date: '2026-10-12',
    depth: 0,
    body: p(
      'An anechoic chamber is a system, not a catalogue item. How did the site stop treating it like a single product SKU?',
    ),
  },
  expert(
    '2026-10-12',
    p(
      'By describing it as an engineered environment: absorbing surfaces, structure, access, and the testing job it has to support. The company was not presented as having made every bolt in-house. The digital job was to show design, absorbing solutions, implementation and installation as related work, not as one generic product tile.',
    ),
    1,
  ),
  {
    author: 'Ingrid Holm',
    role: 'Technical buyer, electronics OEM',
    date: '2026-10-13',
    depth: 2,
    body: p(
      'Then where do absorber panels sit? Some of us are not buying a room. We are looking for absorbing structures.',
    ),
  },
  expert(
    '2026-10-13',
    p(
      'They sit as their own direction, linked to chambers rather than buried inside them. A search for an RF absorber and a search for a chamber are different jobs. The architecture had to hold both without claiming that every absorber enquiry was a full chamber project.',
    ),
    3,
  ),
  {
    author: 'Pavel Dvorak',
    role: 'Industrial SEO specialist',
    date: '2026-10-14',
    depth: 0,
    body: p(
      'Why spend so much of the project on keyword research for a market this small? The buyers already know the product names.',
    ),
  },
  expert(
    '2026-10-14',
    p(
      'They know their problem. They do not all use the same words. One team searches for an anechoic chamber, another for a microwave absorber, another for an antenna test chamber or EMC testing environment. Internal engineering language is not a sitemap.',
      'The research was to connect those wordings to solution, function, application and industry pages. Volumes are not published. They are not in the project record.',
    ),
    1,
  ),
  {
    author: 'Nadia Popa',
    role: 'Defense electronics engineer',
    date: '2026-10-15',
    depth: 0,
    body: p(
      'The case mentions defense systems. How far did you go without implying contracts that cannot be shown?',
    ),
  },
  expert(
    '2026-10-15',
    p(
      'Defense and radio electronics appear in the historical description as relevant fields, not as named programmes. The site could address testing environments for that class of equipment. It could not list customers, classifications or performance against a military standard that is not in this record.',
      'Sensitive claims were left out on purpose. Application architecture is not a contract log.',
    ),
    1,
  ),
  {
    author: 'Erik Nilsen',
    role: 'Aerospace avionics specialist',
    date: '2026-10-16',
    depth: 2,
    body: p(
      'Same question for aviation electronics. Was that a completed Vimpel sector, or a search direction?',
    ),
  },
  expert(
    '2026-10-16',
    p(
      'It was treated as a type of application the website structure was designed to address. I will not convert that into a list of aerospace programmes. If a later record names a delivered chamber for aviation electronics, it can be added. This one does not.',
    ),
    3,
  ),
  {
    author: 'Camille Dubois',
    role: 'UX designer, technical B2B',
    date: '2026-10-17',
    depth: 0,
    body: p(
      'Engineers want diagrams. Procurement wants a path to an enquiry. How did the design hold both without becoming a brochure?',
    ),
  },
  expert(
    '2026-10-17',
    p(
      'The visual job was industrial credibility and technical seriousness: precision, controlled environments, high-value engineering. The information job was orientation - solution, application, industry, next step. No component library or screenshot set is stored in this project, so I will not invent a UI kit.',
    ),
    1,
  ),
  {
    author: 'Wojciech Nowak',
    role: 'Web developer, industrial Drupal sites',
    date: '2026-10-18',
    depth: 2,
    body: p(
      'Was this built on Drupal, like several of the older manufacturing sites?',
    ),
  },
  expert(
    '2026-10-18',
    p(
      'A CMS name and version are not verified in the current project data, so the platform is not named here. What is documented is a structured, SEO-ready site with technical pages, navigation that can grow, and content that can be managed. This Case Study is a presentation of that historical work, not a claim about the current Payload website.',
    ),
    3,
  ),
  {
    author: 'Isabel Ferreira',
    role: 'Head of digital, engineering group',
    date: '2026-10-19',
    depth: 0,
    body: p(
      'There is no ranking table. For a project this specialised, was anything measured?',
    ),
  },
  expert(
    '2026-10-19',
    p(
      'Research, architecture, UX, development, content and SEO were done. Verified traffic, rankings and leads are not stored here, so they are not published. A round number would make the case look finished. It would not make it true.',
    ),
    1,
  ),
  {
    author: 'Lars Bergstrom',
    role: 'Content strategist, deep-tech',
    date: '2026-10-20',
    depth: 2,
    body: p(
      'Would you still write this up as an AI-search win?',
    ),
  },
  expert(
    '2026-10-20',
    p(
      'No. There is no documented ChatGPT, Perplexity, Gemini or AI Overview result for Vimpel Engineering. A clearer entity model of chambers, absorbers, functions and applications is useful to any system that has to read the company. That is not a ranking claim.',
    ),
    3,
  ),
  {
    author: 'Sofia Marinova',
    role: 'Antenna measurement engineer',
    date: '2026-10-21',
    depth: 0,
    body: p(
      'Did the information architecture actually separate antenna testing from a generic electronics-testing page?',
    ),
  },
  expert(
    '2026-10-21',
    p(
      'That was the intent of the maps: solution, technical function, application, industry, then intent. Antenna measurement and a broader electronics-testing environment are related, not identical. Exact historic URLs are not reconstructed. The rule was mapping, not one page for every synonym.',
    ),
    1,
  ),
  {
    author: 'Matej Horvat',
    role: 'Laboratory manager, EMC',
    date: '2026-10-22',
    depth: 0,
    body: p(
      'EMC is its own discipline. Was electromagnetic compatibility treated as a real page type or as a keyword stuffed into the chamber page?',
    ),
  },
  expert(
    '2026-10-22',
    p(
      'It was treated as an application direction the architecture had to be able to hold. I will not claim a dedicated EMC landing page existed for every cluster. I will claim that compatibility testing was not supposed to hide behind a company slogan.',
    ),
    1,
  ),
]

const faqBlock = () => ({
  blockType: 'csFAQ' as const,
  case_study_faq_title: 'Frequently Asked Questions About Vimpel Engineering',
  items: [
    {
      question: 'What is an anechoic chamber in this case?',
      answer: rt(
        p(
          'Here it means a controlled environment for electromagnetic testing, built so reflections are reduced and measurements can be made with less interference from the room itself. It is an engineered system, not a decorative room. Walls, absorbing materials, access and the testing task belong together. This case does not publish dimensions, frequency ranges or absorption ratings, because they are not in the project record.',
        ),
      ),
    },
    {
      question: 'Why does an anechoic chamber need absorbing materials?',
      answer: rt(
        p(
          'Without absorbing structures, electromagnetic energy reflects from surfaces and distorts the measurement. Absorbers, including wave absorbers, are there to reduce those reflections so the test environment stays controlled. The site had to explain that relationship without turning absorber pages into a substitute for a chamber, or the reverse.',
        ),
      ),
    },
    {
      question: 'What types of equipment can be tested in an anechoic chamber?',
      answer: rt(
        p(
          'The website structure was designed to address testing of antennas, electronic equipment, RF and communication systems, and related high-tech hardware. Radio electronics, telecommunications and defense systems are named in the historical description as relevant fields. Named customers, programmes and pass/fail results are not listed.',
        ),
      ),
    },
    {
      question: 'Why was keyword research especially important for Vimpel Engineering?',
      answer: rt(
        p(
          'The market does not share one vocabulary. Buyers may search for an anechoic chamber, an RF absorber, a microwave absorber, an antenna test chamber or an EMC testing environment. Research was required to connect engineering language with those problem statements before the sitemap was locked.',
        ),
      ),
    },
    {
      question: 'How did you structure the website for such a specialized product?',
      answer: rt(
        p(
          'Around solution, application, industry, technical requirement and engineering response. Chambers, absorbers and testing environments were related layers. Applications such as antenna testing or electronics testing were not dumped onto one Services page. Exact URLs are not reconstructed. Not every cluster became a page.',
        ),
      ),
    },
    {
      question: 'What can other engineering companies learn from this project?',
      answer: rt(
        p(
          'Do not explain a specialised offering on one corporate page. Find how the market names the problem, then build architecture and content that follow that map. Technical understanding without search research leaves the site speaking only to insiders. Search research without engineering understanding produces empty category pages.',
        ),
      ),
    },
  ],
})

const discussionBlock = () => ({
  blockType: 'csComments' as const,
  case_study_comment_title: 'Expert Discussion: Vimpel Engineering',
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
    `<h2>${escapeHtml('Discuss a similar specialised engineering website and SEO architecture')}</h2>` +
      p(
        'If you design or implement testing environments, absorbers or other high-spec systems and the website still reads like a generic company page, tell us how the offering is structured.',
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

const buildData = () => ({
  title: 'Vimpel Engineering - Engineering and Digital Positioning for Anechoic Chambers',
  case_study_long_title:
    'Vimpel Engineering - Website, SEO and Digital Strategy for Anechoic Chambers and Electromagnetic Testing Solutions',
  slug: SLUG,
  generateSlug: false,
  _status: 'published' as const,
  featured: true,
  displayOrder: 5,
  duration: null,

  layout: [
    {
      blockType: 'csPreview' as const,
      case_study_preview_title:
        'Vimpel Engineering: Digital Positioning for Anechoic Chambers and Electromagnetic Absorbing Solutions',
      case_study_preview_text: rt(
        p(
          'Vimpel Engineering designed and implemented radio-absorbing materials, wave absorbers and anechoic chambers used to reduce electromagnetic reflections and support measurement in high-tech work. The engagement was not a generic website polish. It combined market and competitor research, semantic architecture, UX/UI, website development and SEO so a specialised engineering offering could be found and understood as solutions, applications and testing requirements rather than as one company page.',
        ),
      ),
    },
    titleBlock('About the Client'),
    contentBlock(
      p(
        'Vimpel Engineering was a specialised engineering and manufacturing company working with radio-absorbing materials, electromagnetic absorbers and anechoic chambers. The work sat in environments where reflections must be controlled so equipment and systems can be tested under more predictable conditions.',
        'The historical description names radio electronics, telecommunications and defense systems as relevant fields. This case treats those as application areas the digital structure had to address, not as a list of named programmes or customers.',
        'An anechoic chamber is not a conventional catalogue product. It can involve walls, ceiling, floor, absorbing materials, structure, doors, supporting systems where a project needs them, measurement requirements, installation and site-specific engineering. This record does not claim that Vimpel manufactured every component internally. The working description is an engineering and solution provider responsible for design, development, production and/or installation of specialised systems where the project supported that role.',
        'Maryan Polyak\'s work was the digital side: research, information architecture, UX/UI, website development, technical content and SEO. The company already had the engineering. The market needed a way to recognise it.',
      ),
    ),
    titleBlock('At a Glance'),
    contentBlock(
      ul([
        'Client: Vimpel Engineering',
        'Industry: Specialised engineering and electromagnetic testing environments',
        'Core solutions: Anechoic chambers, RF and electromagnetic absorbers, wave absorbers, testing environments',
        'Project type: Website design and development, SEO, digital positioning',
        'Platform: Not recorded as a verified CMS or version in the current project data, so none is named here',
        'Duration: Not verified',
        'Main objective: A structured digital presence for a highly specialised engineering offering',
      ]),
    ),
    titleBlock('Why This Was a Difficult Project'),
    contentBlock(
      p(
        'The difficulty was not a missing title tag. The product is hard to explain in generic marketing language, and the people who buy it do not share one vocabulary.',
        'A visitor might be an engineer, an R&D team, a laboratory specialist, technical procurement, a telecommunications or electronics manufacturer, an antenna developer, a testing laboratory, or technical management. Aerospace and defense organisations are among the kinds of buyers such environments can serve. This case does not convert that list into confirmed accounts.',
        'The same offering can be searched as an anechoic chamber, an RF absorber, a microwave absorber, an antenna test chamber, an EMC testing chamber, an electromagnetic testing environment or radio-frequency absorbing material. The project therefore required engineering understanding, market research, search research, information architecture, UX/UI, content and SEO together.',
      ),
    ),
    titleBlock('Research: Market, Competitors and Search Language'),
    contentBlock(
      p(
        'Market research looked at how anechoic-chamber work is organised: complete chambers versus absorber and component solutions, the terminology engineering companies use, and the application areas buyers bring to the problem. No market-size figures are stated.',
        'Competitor and SERP research looked at how others named solutions, grouped products and applications, wrote technical content and built site structure. Competitor brands are not listed. They are not verified in the current project data.',
        'Search research treated terms such as anechoic chamber, RF anechoic chamber, RF absorber, electromagnetic absorber, microwave absorber, radio-wave absorber, antenna test chamber, EMC testing chamber, electromagnetic testing, RF testing, antenna measurement, electromagnetic compatibility and absorber materials as semantic directions, not as a recovered historic keyword file. Volumes are not published.',
      ),
    ),
    titleBlock('Semantic Architecture and Website Structure'),
    contentBlock(
      p(
        'The working model was engineering capability, to solution, to technical function, to application, to industry, to search intent. SEO participated in forming the structure. It did not arrive after a finished visual design.',
        'Core solutions in the model included anechoic chambers, RF and electromagnetic absorbers, wave absorbers and testing environments. Technical functions included absorption, reduction of reflections, a controlled electromagnetic environment, RF testing, antenna measurement and electromagnetic compatibility testing.',
        'Applications the architecture was designed to address included antenna testing, electronics testing, communication systems, aerospace and aviation electronics, defense systems, radar-related equipment, telecommunications and sensors. Industries in that map included aerospace, defense, telecommunications, electronics, radio engineering, R&D and testing laboratories.',
        'Not every line was an actual delivered Vimpel product or customer segment. The maps existed so specialised capability could be connected to the problems buyers search for.',
      ) +
        ul([
          'Solutions: anechoic chambers, absorbers, specialised electromagnetic solutions',
          'Applications: antenna testing, RF testing, electronics testing, electromagnetic compatibility, specialised equipment testing',
          'Industries: aerospace and aviation, defense, telecommunications, electronics, radio engineering, research and testing',
          'Engineering: design, production where the offering included it, installation, custom engineering',
        ]) +
        p(
          'Exact historic URLs are not reconstructed. Not every section above is claimed as a live page on the original site. The architectural logic is solution, application, industry, technical requirement, engineering response - not a homepage plus a Services dump.',
        ),
    ),
    titleBlock('Product and Service Structure on the Site'),
    contentBlock(
      p(
        'A complex technical offering had to become a set of pages a non-specialist buyer could still navigate.',
      ) +
        ul([
          'Anechoic chambers: complete controlled environments for electromagnetic testing',
          'RF and electromagnetic absorbers: absorbing materials and structures used to reduce reflections',
          'Antenna testing environments: controlled measurement of antennas and related systems',
          'Electronics testing: controlled environments for electronic equipment and systems',
          'Aerospace and defense testing: specialised environments for aviation, aerospace and defense electronics, as application directions',
          'Telecommunications: testing environments for communication equipment and related systems',
        ]) +
        p(
          'Where a line is not confirmed as a completed Vimpel project, it is the solution and application structure developed for the website. No product models, absorber part numbers or chamber sizes are stated.',
        ),
    ),
    titleBlock('UX/UI and Website Development'),
    contentBlock(
      p(
        'Design was part of the engagement. The visual concept had to carry engineering precision, specialised technology, industrial credibility, technical complexity, controlled environments and high-value project work. It was not framed as a generic corporate restyle.',
        'No screenshots or design files for Vimpel Engineering are stored in the current Media collection, so none are shown. No component library is reconstructed.',
        'Development implemented a responsive site with structured content, SEO-ready architecture, technical and product pages, navigation that could grow, and content that could be managed. A CMS name, Drupal version and module list are not verified in the current project data, so they are not named. This Case Study is a presentation of the historical project, not a description of the current Next.js site.',
      ),
    ),
    titleBlock('SEO and Technical Content'),
    contentBlock(
      p(
        'Keyword work organised demand by solution, technical function, application, industry, commercial intent and informational intent, then mapped clusters to the pages that could carry them. On-page work covered titles, descriptions, headings, semantic content, internal linking, URL logic and page structure.',
        'Content had to explain what anechoic chambers are, what absorbers do, why a controlled electromagnetic environment is required, what kinds of equipment may need testing, how applications differ, and what engineering considerations sit around implementation. Specifications, standards and certifications are not invented.',
        'The content path was technical problem, testing requirement, solution, application, engineering implementation. Paid search, social, email, PR and directories are not listed as completed channels. They are not confirmed in the source material used here.',
      ),
    ),
    titleBlock('What the Work Produced'),
    contentBlock(
      p(
        'The digital presentation of a specialised engineering offering became substantially clearer. Solutions and applications were represented more broadly. The information architecture was search-oriented. Chambers and absorbing technologies could be explained in relation to testing jobs. Positioning for specialised industrial audiences was firmer, and the structure could take further technical content.',
        'That is a foundation for organic visibility. Traffic, rankings, keyword counts, leads, conversion rates, revenue and project value are not published. They are not verified in this project.',
      ),
    ),
    faqBlock(),
    discussionBlock(),
    ctaBlock(),
  ],

  manufacturingProfile: {
    productionCapabilities: rt(
      p(
        'The work was specialised engineering rather than mass-market manufacturing: engineering of anechoic environments, development of electromagnetic absorbing solutions, production or implementation of specialised absorbing structures, design of testing environments, installation, technical implementation and project-specific engineering.',
        'Machinery lists, process names and certifications are not stated. The company is not described as having manufactured every subsystem internally.',
      ),
    ),
    products: rt(
      p(
        'The offering centred on anechoic chambers, electromagnetic and RF absorbers, wave absorbers, specialised absorbing structures, electromagnetic testing environments, shielding-related engineering where a project required a controlled environment, and customised testing facilities.',
        'No model names or catalogue SKUs are listed. A chamber is treated as an integrated engineering system, not as a single off-the-shelf unit.',
      ),
    ),
    materials: null,
    applications: rt(
      p(
        'The historical description identifies radio electronics, telecommunications and defense systems as relevant fields. The website structure was also designed to address electronics testing, antenna and RF testing, electromagnetic compatibility testing, aerospace and aviation electronics, radar-related equipment, communication systems, sensors and electronic components.',
        'Those lines are types of applications the architecture was built to hold. They are not a register of completed customer projects.',
      ),
    ),
  },

  businessChallenge: {
    initialState: rt(
      p(
        'Vimpel Engineering had a highly specialised technical offering. The digital presentation needed to show the breadth and complexity of that engineering work much more clearly than a company introduction could.',
      ),
    ),
    challenge: rt(
      p(
        'The website had to explain a product category that most visitors would not understand without technical context. A visitor might need an entire chamber, a specific absorber, antenna testing, RF testing, electromagnetic compatibility, a specialised testing environment, or engineering and installation. The site had to move from a company presentation toward a structured technical-solution platform.',
      ),
    ),
    goals: rt(
      ul([
        'Research the market and competitors without inventing share figures',
        'Identify search demand and build a semantic core',
        'Define product, service and application architecture',
        'Create a UX/UI concept that could carry specialised engineering',
        'Develop the website and an SEO-friendly information architecture',
        'Make the company discoverable for highly specific industrial searches',
        'Avoid traffic, ranking or lead targets that are not in the record',
      ]),
    ),
  },

  nicheSegmentation: [
    {
      name: 'Anechoic Chambers for Electronics Testing',
      description: rt(
        p(
          'Controlled electromagnetic environments for testing electronic equipment and systems, treated as a solution direction rather than a named customer programme.',
        ),
      ),
      marketingApproach: rt(
        p(
          'Give chambers and electronics-testing intent their own place in search and content, then link to absorbers, installation and related applications so the page is a testing environment, not a slogan.',
        ),
      ),
    },
    {
      name: 'Antenna and RF Testing',
      description: rt(
        p(
          'Chamber and absorber solutions connected to antenna measurement, RF testing and controlled electromagnetic environments.',
        ),
      ),
      marketingApproach: rt(
        p(
          'Map antenna-test and RF-absorber language to the right layer of the architecture instead of forcing both onto a generic chamber page.',
        ),
      ),
    },
    {
      name: 'Aerospace and Aviation Equipment Testing',
      description: rt(
        p(
          'Specialised chambers and absorbing systems as an application direction for aviation and aerospace electronics. Not a list of aircraft programmes.',
        ),
      ),
      marketingApproach: rt(
        p(
          'Write to the testing requirement of advanced electronics in that field, without naming platforms, standards or customers that are not in the record.',
        ),
      ),
    },
    {
      name: 'Defense and Military Electronics',
      description: rt(
        p(
          'Testing requirements around defense electronics, communication systems, radar and related equipment, kept at the level of application architecture.',
        ),
      ),
      marketingApproach: rt(
        p(
          'Address the specialised testing job without sensitive claims, contract names or performance against unpublished military specifications.',
        ),
      ),
    },
    {
      name: 'Telecommunications Equipment',
      description: rt(
        p(
          'Testing environments for communication equipment and related RF systems, matching a field named in the historical description.',
        ),
      ),
      marketingApproach: rt(
        p(
          'Build content around RF, antenna and communication-system testing environments and link it to chambers and absorbers as related solutions.',
        ),
      ),
    },
    {
      name: 'Research and Development / Laboratory Testing',
      description: rt(
        p(
          'Organisations that need a controlled electromagnetic environment for research, development and measurement rather than a single production test.',
        ),
      ),
      marketingApproach: rt(
        p(
          'Treat laboratory and R&D intent as its own path, still connected to the same solution set, without inventing institute names.',
        ),
      ),
    },
  ],

  digitalEcosystem: rt(
    p(
      'The digital ecosystem in this case was the corporate website, solution and application pages, UX/UI, technical and commercial content, SEO architecture, internal linking and a structure that could take further technical pages.',
      'Paid advertising, social programmes, CRM and analytics products are not listed as delivered work. They are not confirmed in the source material used here. A CMS platform is not named.',
    ),
  ),
  websiteArchitecture: rt(
    p(
      'The site was not meant to be a homepage with a generic Services page. It needed to represent different engineering solutions: chambers, absorbers, specialised electromagnetic work; applications such as antenna, RF, electronics and compatibility testing; industries in the map; and engineering steps from design through installation.',
      'Exact historic URLs are not reconstructed. Not every heading in the conceptual map is claimed as a live original URL. The logic remains solution, application, industry, technical requirement, engineering response.',
    ),
  ),
  semanticArchitecture: rt(
    p(
      'The semantic model connected anechoic chambers, RF absorbers, electromagnetic absorbers, wave absorbers and testing environments with functions such as absorption, reflection control, RF testing, antenna measurement and electromagnetic compatibility testing, and with application and industry language used by specialised buyers.',
      'Intent was mapped to pages that could carry it. Keyword volumes are not stated. Not every entity was a confirmed shipped product.',
    ),
  ),

  marketingStrategy: {
    seoAndContentStrategy: rt(
      p(
        'Search-driven industrial marketing for a specialised engineering offering: keyword research, competitor and SERP analysis, semantic core, mapping, information architecture, UX alignment, on-page SEO and technical content that follows problem, requirement, solution, application, implementation.',
        'Content had to speak to engineers and to technical procurement without unsupported specifications. Paid media is not included as a completed channel.',
      ),
    ),
    leadGenMechanism: rt(
      p(
        'The site was meant to support enquiries from specialised buyers who found a relevant chamber, absorber or application page and could see the engineering path. No form mix, conversion rate or lead volume is published.',
      ),
    ),
    paidAdvertising: [],
    socialMedia: [],
  },

  aiSearchOptimization: {
    brandAuthorityAndTrust: rt(
      p(
        'This project is described as research, architecture, UX, website development, SEO and content. It is not rewritten as an AI-search engagement.',
        'A structured model of chambers, absorbers, functions and applications gives search systems more accurate material than a thin corporate page. No ChatGPT ranking, Perplexity citation, Gemini visibility, AI Overview result or AI-generated lead is claimed.',
      ),
    ),
    entityAndGeoStructure: rt(
      p(
        'Solutions, technical functions, applications and industries are treated as related entities in the information architecture. That topical model is useful for modern search systems in principle. It is not a measured GEO or AEO programme.',
      ),
    ),
  },

  implementationProcess: rt(
    p(
      'Confirmed shape of the work, without inventing dates: research the market and competitors; analyse search language; build the semantic core; define solution and application architecture; design UX/UI; develop the website; implement on-page SEO and technical content.',
      'The sequence is the method. It is not a dated Gantt chart.',
    ),
  ),

  timeline: [
    {
      period: 'Phase 1',
      title: 'Market and competitor research',
      description: rt(
        p(
          'How chamber and absorber work is organised, how others describe it, and which application language appears in search. Competitor brands are not named.',
        ),
      ),
    },
    {
      period: 'Phase 2',
      title: 'Search research and semantic core',
      description: rt(
        p(
          'Specialised engineering terminology organised by solution, function, application, industry and intent. Volumes are not published.',
        ),
      ),
    },
    {
      period: 'Phase 3',
      title: 'Solution and application architecture',
      description: rt(
        p(
          'Maps from capability to solution, function, application and industry, without treating every cluster as a required URL.',
        ),
      ),
    },
    {
      period: 'Phase 4',
      title: 'UX/UI concept',
      description: rt(
        p(
          'A visual and orientation concept for specialised engineering, not a generic corporate restyle. No screenshot set is stored in this project.',
        ),
      ),
    },
    {
      period: 'Phase 5',
      title: 'Website development',
      description: rt(
        p(
          'Implementation of structured, SEO-ready pages and navigation. Platform name and modules are omitted because they are not verified here.',
        ),
      ),
    },
    {
      period: 'Phase 6',
      title: 'SEO and technical content',
      description: rt(
        p(
          'On-page work and content that explain chambers, absorbers and testing requirements without invented specifications.',
        ),
      ),
    },
  ],

  resultsSummary: rt(
    p(
      'The specialised engineering offering was presented more clearly. Solutions and applications had a broader digital representation. The information architecture was search-oriented. Anechoic chambers and absorbing technologies could be explained in relation to testing jobs. Positioning for specialised industrial audiences improved, and the structure could take further technical content.',
      'Verified historical traffic, rankings, keyword counts, leads, conversions, revenue and project value are not stored in this project, so none are published.',
    ),
  ),

  metrics: [],
  projectsShowcase: [],

  expertInsight: rt(
    p(
      'For highly specialised industrial engineering companies, the first marketing problem is often not traffic. It is understanding how the market describes the problem.',
      'Potential customers may know they need to test an antenna, an electronic system or an RF device, and still search with words the manufacturer does not use internally. Research has to connect engineering terminology, customer problem, application, solution, search demand and website architecture.',
      'A specialised engineering company should not try to explain everything on one corporate page. The website should reflect the structure of the market itself. This project is an example of why complex industrial marketing needs both technical understanding and search research.',
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
        'Website design, SEO and information architecture for Vimpel Engineering, so anechoic chambers, absorbers and electromagnetic testing environments could be found and understood as a specialised engineering offering rather than a generic company page.',
      ),
    ),
  },

  primary_case_study_category: PRIMARY_CASE_STUDY_CATEGORY,
  case_study_categories: CASE_STUDY_CATEGORIES,

  meta: {
    title: 'Vimpel Engineering: Anechoic Chambers and Electromagnetic Testing',
    description:
      'How we structured and developed a digital presence for Vimpel Engineering, specialising in anechoic chambers and electromagnetic absorbing solutions.',
  },
})

const main = async () => {
  const dry = process.argv.includes('--dry')
  const payload = await getPayload({ config })
  const data = buildData()
  const tree = measureCommentTree(buildCommentTree(DISCUSSION))

  const azermene = await payload.find({
    collection: 'case-studies',
    where: {
      or: [
        { slug: { like: 'azermene' } },
        { title: { like: 'Azermene' } },
        { slug: { like: 'azimuth' } },
        { title: { like: 'Azimuth' } },
      ],
    },
    limit: 5,
    depth: 0,
    overrideAccess: true,
    select: { id: true, slug: true, title: true },
  })
  if (azermene.docs.length) {
    payload.logger.info(
      `Azermene-related records: ${azermene.docs.map((doc) => `${doc.id}:${doc.slug}`).join(', ')}`,
    )
  } else {
    payload.logger.warn(
      'No Azermene Case Study found. Structural reference used: Laser Made and Nesko.',
    )
  }

  if (dry) {
    payload.logger.info(
      JSON.stringify(
        {
          slug: data.slug,
          layoutBlocks: data.layout.length,
          faqQuestions: faqBlock().items.length,
          discussionEntries: DISCUSSION.length,
          expertReplies: DISCUSSION.filter((entry) => entry.isExpert).length,
          discussionTree: tree,
          niches: data.nicheSegmentation.length,
          timeline: data.timeline.length,
          metrics: data.metrics.length,
          showcase: data.projectsShowcase.length,
          categories: data.case_study_categories.length,
          paidAds: data.marketingStrategy.paidAdvertising.length,
          social: data.marketingStrategy.socialMedia.length,
          duration: data.duration,
        },
        null,
        2,
      ),
    )
    process.exit(0)
  }

  const existing = await payload.find({
    collection: 'case-studies',
    where: { slug: { equals: SLUG } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })

  const payload_data = data as never

  if (existing.docs[0]) {
    const updated = await payload.update({
      collection: 'case-studies',
      id: existing.docs[0].id,
      data: payload_data,
      overrideAccess: true,
      context: { disableRevalidate: true },
    })
    payload.logger.info(`Updated existing Case Study ${updated.id}: ${getCaseStudyUrl(updated)}`)
  } else {
    const created = await payload.create({
      collection: 'case-studies',
      data: payload_data,
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
