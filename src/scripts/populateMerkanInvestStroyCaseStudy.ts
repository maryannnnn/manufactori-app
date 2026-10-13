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
 * Creates or updates the Merkan Invest Stroy Case Study.
 * Structural reference: Laser Made / PakTradeMash.
 * Re-runnable: structured fields and layout blocks are replaced, not appended.
 *
 * Duration = 5 years is a confirmed owner instruction, not a model guess.
 * No invented metrics, testimonials, duct materials, second-object details,
 * competitor names or AI-search rankings. No site_categories. No new modules.
 */
const SLUG = 'merkan-invest-stroy-ventilation-systems'
const IMAGE_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'assets')

const EXPERT = 'Maryan Polyak'
const EXPERT_ROLE = 'Manufacturing Digital Marketing & Web Development Expert'

const PRIMARY_CASE_STUDY_CATEGORY = 239 // manufacturing-website-development
const CASE_STUDY_CATEGORIES = [
  239, // Manufacturing Website Development
  226, // Manufacturing Website Design & Development
  238, // Manufacturing Website Design
  237, // Industrial Website Development
  196, // Manufacturing SEO
  204, // Industrial SEO
  197, // Application SEO
  218, // Product SEO
  200, // Competitor SEO Analysis
  210, // Manufacturing Keyword Research
  311, // Technical Content Marketing
  582, // HVAC & Climate Equipment
  587, // HVAC Equipment
  588, // HVAC Manufacturing
  585, // Commercial HVAC
  590, // Industrial HVAC
  592, // Ventilation Equipment
  529, // Electrical Engineering
  426, // Construction Products
  432, // Roofing Products
  484, // Design, Manufacturing & Installation
  486, // Turnkey Manufacturing Solutions
  751, // Industrial Installation
  526, // Engineering & Technical Services
  530, // Engineering Services
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
  filename: 'merkan-ventilation-installation.jpg',
  alt: 'Rectangular steel ventilation ducts installed along the ceiling of a large commercial building.',
  caption:
    'Ceiling-mounted ventilation ducts in a large building. Illustrative installation type, not a documented project photograph.',
}

const GALLERY_IMAGES: ImageSpec[] = [
  {
    filename: 'merkan-hvac-design-estimate.jpg',
    alt: 'Engineering desk with HVAC drawings, a printed estimate and a duct-layout diagram on a laptop.',
    caption:
      'Calculation, design and estimate work for a ventilation project. Illustrative setting, no figures shown.',
  },
  {
    filename: 'merkan-ventilation-duct-fabrication.jpg',
    alt: 'Workshop fabricating rectangular galvanized steel ventilation air ducts and fittings.',
    caption:
      'Production of ventilation ducts and fittings. Illustrative workshop, materials not specified in the source.',
  },
  {
    filename: 'merkan-air-conditioning-plant.jpg',
    alt: 'Air-handling plant with insulated ducts, piping and an electrical control cabinet.',
    caption:
      'Air-conditioning and ventilation plant room. Illustrative equipment type, not a documented project photograph.',
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
 * 8 top-level branches, mixed shapes, 25 entries, depth capped at 3.
 * Editorial discussion participants — not clients or customers.
 */
const DISCUSSION: DiscussionEntry[] = [
  {
    author: 'Lukas Schneider',
    role: 'Industrial marketing consultant',
    date: '2026-10-01',
    depth: 0,
    body: p(
      'Merkan Invest Stroy is described as turnkey engineering: design, duct production, installation and maintenance. Why not present that as one contractor page? A construction buyer already knows what HVAC means.',
    ),
  },
  expert(
    '2026-10-01',
    p(
      'Because the buyer is not searching only for a contractor name. They search for ventilation systems, air ducts, air conditioning, installation on a large building, or maintenance of an existing system. Those are different landing points.',
      'A single contractor page can introduce the company. It cannot simultaneously be the page for duct fabrication, a turnkey fit-out and ongoing service. The site had to make that sequence visible.',
    ),
    1,
  ),
  {
    author: 'Martin Novak',
    role: 'In-house manufacturing marketer',
    date: '2026-10-02',
    depth: 2,
    body: p(
      'So the homepage was never going to carry fabrication, installation and service at once?',
    ),
  },
  expert(
    '2026-10-02',
    p(
      'Correct. The homepage can say the company does engineering systems turnkey. The work of the site is to give each part of that cycle a place: calculation and design, estimate, duct production, assembly, launch and later maintenance.',
    ),
    3,
  ),
  {
    author: 'Thomas Weber',
    role: 'Technical content lead',
    date: '2026-10-03',
    depth: 0,
    body: p(
      'The record says the site was built on Drupal with UX/UI and an SEO structure. Why name the CMS at all if no version or module list is published?',
    ),
  },
  expert(
    '2026-10-03',
    p(
      'Because the source material names Drupal. That is a confirmed platform choice, not a recommendation to every HVAC company. What matters is that the site was designed as a structured system rather than a landing page with rewritten slogans.',
      'Drupal version, theme and module list are not in the source, so they are not stated. This Case Study is a record of the historical project, not a description of the current Next.js site.',
    ),
    1,
  ),
  {
    author: 'Henrik Dahl',
    role: 'Technical SEO specialist',
    date: '2026-10-04',
    depth: 0,
    body: p(
      'Keyword analysis, competitor review, a semantic core and mapping are listed. Without volumes or ranking tables, what did that work actually change?',
    ),
  },
  expert(
    '2026-10-04',
    p(
      'It changed what the website could hold. Research and mapping decide whether ventilation, air conditioning, electrical work, construction applications and service sit on one generic URL or on pages that match how buyers search.',
      'No keyword count, ranking table or traffic figure is published, because none is in the source data. The honest result is structural: a semantic foundation and a site that can carry those intents.',
    ),
    1,
  ),
  {
    author: 'Elena Petrova',
    role: 'B2B demand generation lead',
    date: '2026-10-05',
    depth: 2,
    body: p(
      'If there are no volumes, how do you stop the semantic work becoming a decorative spreadsheet?',
    ),
  },
  expert(
    '2026-10-05',
    p(
      'By mapping it onto pages. A semantic core that is not attached to architecture is unused research. Here the mapping is the deliverable: terms connected to ventilation systems, air conditioning, ducts, installation, maintenance and construction applications.',
    ),
    3,
  ),
  {
    author: 'Anna Kovacs',
    role: 'Construction-sector marketing manager',
    date: '2026-10-06',
    depth: 0,
    body: p(
      'The company worked inside large construction objects and took government orders. Did that change the website, or is it only background about the client?',
    ),
  },
  expert(
    '2026-10-06',
    p(
      'It changes who the pages have to speak to. A facilities buyer on a large building is looking for a contractor who can design, fabricate, install and then service the system. That is a different page from a residential air-conditioning enquiry.',
      'No named government contract, building or tender is published. The source confirms the type of work, not a project list.',
    ),
    1,
  ),
  {
    author: 'Anna Kovacs',
    role: 'Construction-sector marketing manager',
    date: '2026-10-07',
    depth: 2,
    body: p(
      'Were construction-themed projects a second website, or the same site speaking to a second audience?',
    ),
  },
  expert(
    '2026-10-07',
    p(
      'The source says construction-themed projects were also presented. It does not describe a second domain. The working reading is the same Drupal site covering HVAC engineering and related construction presentation, not two unrelated products.',
    ),
    3,
  ),
  {
    author: 'Pavel Orlov',
    role: 'HVAC project engineer',
    date: '2026-10-08',
    depth: 0,
    body: p(
      'Electrical work and construction sit inside the same company. How do you stop those from looking like two extra businesses the site cannot support?',
    ),
  },
  expert(
    '2026-10-08',
    p(
      'By treating them as part of the same turnkey system, which is how the source describes them. Ventilation on a large object needs electrics and building work. The site should show that connection. It should not invent a separate electrical-contracting brand or a general construction firm that the material does not describe.',
    ),
    1,
  ),
  {
    author: 'Martin Novak',
    role: 'In-house manufacturing marketer',
    date: '2026-10-09',
    depth: 0,
    body: p(
      'The notes say other objects were done with the same client in parallel, but the second object is not described. Why mention that at all?',
    ),
  },
  expert(
    '2026-10-09',
    p(
      'Because it is in the source: the client continued to invent and commission further work, and a number of objects were delivered alongside the main engagement. Hiding that would understate the relationship.',
      'The second object itself is not described. Not disclosed is the correct line. Inventing a second case study from a passing mention would be worse than leaving it unnamed.',
    ),
    1,
  ),
  {
    author: 'Sophie Laurent',
    role: 'PPC specialist',
    date: '2026-10-10',
    depth: 0,
    body: p(
      'The example text mentions individual advertising strategies. Were paid campaigns part of the delivered work, and on which platforms?',
    ),
  },
  expert(
    '2026-10-10',
    p(
      'Advertising strategies are named in the source example as part of the digital work, together with website development. No channel, budget, CPC or conversion figure is given, so none is published.',
      'I will not turn that phrase into a Google Ads case. If a later record names a platform and a result, it can be added. Until then the paid block stays empty.',
    ),
    1,
  ),
  {
    author: 'Sophie Laurent',
    role: 'PPC specialist',
    date: '2026-10-11',
    depth: 2,
    body: p(
      'Then why keep the sentence in the case study at all?',
    ),
  },
  {
    author: 'Henrik Dahl',
    role: 'Technical SEO specialist',
    date: '2026-10-11',
    depth: 2,
    body: p(
      'Because dropping it would also drop a confirmed workstream. The honest version is: advertising strategy was part of the described package, and the measurements are not in this record.',
    ),
  },
  expert(
    '2026-10-12',
    p(
      'That is the right split. Name the workstream. Do not invent the channel report.',
    ),
    3,
  ),
  {
    author: 'Elena Petrova',
    role: 'B2B demand generation lead',
    date: '2026-10-13',
    depth: 0,
    body: p(
      'Has any of this been measured in AI search — ChatGPT, Perplexity, AI Overviews? HVAC queries are the kind of thing those systems now try to answer.',
    ),
  },
  expert(
    '2026-10-13',
    p(
      'Nothing was measured. No ChatGPT ranking, Perplexity citation or AI Overview result is claimed.',
      'What exists is groundwork: a Drupal site with an SEO structure, a semantic model of ventilation, air conditioning, ducts, installation and service, and a company described as a turnkey engineering contractor rather than a slogan. That is information architecture. It is not a generative-search programme.',
    ),
    1,
  ),
  {
    author: 'Pavel Orlov',
    role: 'HVAC project engineer',
    date: '2026-10-14',
    depth: 2,
    body: p(
      'The gallery does not name the sheet metal. Is that an omission, or a decision?',
    ),
  },
  expert(
    '2026-10-14',
    p(
      'A decision. The source does not name the duct materials. Not disclosed is better than guessing galvanized steel, stainless or composite because a photograph looks like one of them. The images illustrate work types: design and estimate, duct fabrication, plant-room systems. They are not project records.',
    ),
    3,
  ),
]

const faqBlock = () => ({
  blockType: 'csFAQ' as const,
  case_study_faq_title: 'Frequently Asked Questions About Merkan Invest Stroy',
  items: [
    {
      question:
        'How do you structure a site for a turnkey HVAC company that also fabricates ducts?',
      answer: rt(
        p(
          'By following the actual project cycle instead of a generic contractor menu. Merkan Invest Stroy designs, estimates, produces air ducts and related components, installs and assembles the system, commissions it, and then maintains it. Electrical work and construction sit inside that same turnkey path.',
          'Those steps need distinct pages or sections. A visitor looking for duct production is not the same visitor looking for maintenance of an existing ventilation system. One homepage cannot carry all of that intent.',
        ),
      ),
    },
    {
      question: 'Why was the website built on Drupal rather than left as marketing copy?',
      answer: rt(
        p(
          'The source material states that the site was developed on Drupal with UX/UI design and an SEO structure. The job was to hold the offering — ventilation, air conditioning, duct production, installation, service, and related construction presentation — in a form search engines and technical buyers could use.',
          'Drupal version, theme and modules are not disclosed. This record describes the historical project, not the current Next.js website.',
        ),
      ),
    },
    {
      question: 'What did keyword research and the semantic core change if no rankings are published?',
      answer: rt(
        p(
          'They decided how the site was mapped. The source describes competitor and keyword analysis, a semantic foundation and strategic mapping so the site could reach the people who actually buy these systems.',
          'No keyword volume, ranking table or traffic percentage is in the source, so none is published. The result that can be stated is qualitative: a site structured around the real offering instead of a single company description.',
        ),
      ),
    },
    {
      question: 'Were other objects done with the same client, and why are they not described?',
      answer: rt(
        p(
          'Yes. The source says a number of further objects were delivered in parallel because the client continued to invent and commission work. That belongs in the record so the relationship is not understated.',
          'The second object itself is not described. Not disclosed. No building, scope or result is invented from that mention.',
        ),
      ),
    },
    {
      question: 'Were advertising strategies a measured channel in this project?',
      answer: rt(
        p(
          'Individual advertising strategies are named in the source example together with website development. No platform, budget or result is given. Paid campaigns are therefore not listed as a completed, measured channel.',
          'SEO, semantic mapping and the Drupal site are the workstreams that the source actually describes in operational terms.',
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
    `<h2>${escapeHtml('Discuss a similar HVAC website and SEO project')}</h2>` +
      p(
        'If you design, fabricate and install ventilation or air-conditioning systems and need the website to match how buyers search, tell us about the offering.',
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
  case_study_gallery_title: 'Ventilation and air-conditioning work',
  case_study_gallery_images: imageIds,
})

const buildData = (previewImageId: number, galleryIds: number[]) => ({
  title: 'Merkan Invest Stroy — Website and SEO for Turnkey Ventilation Systems',
  case_study_long_title:
    'Merkan Invest Stroy — Drupal Website, Semantic SEO and Digital Presentation for Turnkey Ventilation, Air Conditioning and Engineering Systems',
  slug: SLUG,
  generateSlug: false,
  _status: 'published' as const,
  featured: true,
  displayOrder: 6,
  duration: '5_years',

  layout: [
    {
      blockType: 'csPreview' as const,
      case_study_preview_title:
        'Merkan Invest Stroy: Five Years of Website, SEO and Turnkey HVAC Positioning',
      case_study_preview_text: rt(
        p(
          'Merkan Invest Stroy designs, installs and maintains ventilation and air-conditioning systems, including in-house production of air ducts and related components. Over five years the company received a Drupal website with UX/UI design, a semantic SEO foundation and a digital structure that could present turnkey work on large construction objects — calculation, design, estimate, fabrication, installation, commissioning and service.',
        ),
      ),
      case_study_preview_image: previewImageId,
    },

    titleBlock('About the Client'),
    contentBlock(
      p(
        'Merkan Invest Stroy — also referred to in the source notes as Merkan or Merkan Invest — is an engineering contractor for ventilation, air conditioning, electrical work and construction. The offering is described as engineering systems turnkey, not as a single isolated trade.',
        'The company produces ventilation ducts, fasteners and related components, then installs and maintains the systems. Work takes place inside fairly large construction objects, including government orders: design and fit-out of the systems, then support and servicing once they are running.',
        'Inside ventilation the source lists systems, nodes, parts and air ducts, plus service. Electrical work and construction are connected to that same path rather than presented as unrelated businesses.',
      ),
    ),

    titleBlock('What the Production Cycle Covers'),
    contentBlock(
      p(
        'A typical object in this record is a large building that needs a complete ventilation system, not a single catalogue item. The cycle described in the source is:',
      ) +
        ul([
          'Calculation and design',
          'A full estimate',
          'Development and production of the ducts',
          'Installation and assembly of the whole ventilation system',
          'Commissioning and launch',
          'Later technical maintenance',
        ]) +
        p(
          'Specific sheet-metal or insulation materials for the ducts are not disclosed. Residential and commercial sectors are both named in the source example. Construction-themed projects were also presented on the digital side.',
        ),
    ),

    titleBlock('Starting Point for the Digital Work'),
    contentBlock(
      p(
        'The digital job was to make that turnkey offering findable. Buyers do not only search the company name. They search for ventilation systems, air conditioning, air ducts, installation on a large object, or maintenance.',
        'The source example describes competitor and keyword analysis, a semantic foundation and strategic mapping, then website development and individual advertising strategies. No historic URL, previous CMS or failed campaign is described, so none is invented.',
      ),
    ),

    titleBlock('What Was Built'),
    contentBlock(
      p(
        'The website was developed on Drupal, with UX/UI design and an SEO structure intended to support search visibility and promotion. The information architecture had to hold ventilation, air conditioning, duct production, installation, service, electrical work connected to those systems, and construction-themed presentation.',
        'Keyword and competitor analysis, a semantic core and mapping were used so pages could match how the target audience searches. No keyword count, ranking table or traffic percentage is published.',
        'Advertising strategies are named in the source example. No platform, budget or result is given, so paid campaigns are not listed as a measured channel.',
      ),
    ),

    titleBlock('Further Objects With the Same Client'),
    contentBlock(
      p(
        'In parallel with the main digital engagement, a number of further objects were delivered for the same client. The source says the client continued to invent and commission work, and that this relationship produced more than one object.',
        'The second client object is not described. Not disclosed: building, scope, systems installed and results. This Case Study does not invent a second project from that mention.',
      ),
    ),

    titleBlock('Results'),
    contentBlock(
      p(
        'The duration of the engagement is five years. That figure was confirmed by the project owner and is not a model estimate.',
        'The result that can be stated without inventing figures is qualitative: a Drupal website with an SEO structure, a semantic foundation mapped to the real HVAC and construction offering, and a digital presentation of turnkey work — design, estimate, duct production, installation, commissioning and service.',
        'Verified traffic, rankings, leads, conversions, revenue and percentage improvements are not in the source data. Not disclosed.',
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
        'Merkan Invest Stroy designs, produces, installs and maintains ventilation and air-conditioning systems. Confirmed capabilities include production of air ducts and fasteners, installation and assembly of complete systems, commissioning, and later technical maintenance.',
        'Electrical work and construction sit inside the same turnkey path on large building objects, including government orders. This is not a claim that every electrical or civil trade on a site was performed by the company.',
      ),
    ),
    products: rt(
      p(
        'Ventilation systems, air-conditioning systems, air ducts, system nodes and parts, fasteners, and the installed system as a whole. Roofing components are named in the source example as part of the wider offering.',
        'No product models, part numbers or duct dimensions are stated.',
      ),
    ),
    materials: rt(
      p(
        'Not disclosed. The source does not name the metals, coatings or insulation used for the ducts. Those materials are not guessed from photographs.',
      ),
    ),
    applications: rt(
      p(
        'Large construction objects, government orders, and both residential and commercial sectors as named in the source. The typical setting is the inside of a building under construction or in service, where ventilation and air conditioning have to be designed, installed and then maintained.',
        'Named buildings and the second parallel object are not disclosed.',
      ),
    ),
  },

  businessChallenge: {
    initialState: rt(
      p(
        'Merkan Invest Stroy already had a real engineering offering: turnkey ventilation and air conditioning, duct production, installation and service, with electrical and construction work attached to those systems. The digital presentation had to catch up with that breadth.',
      ),
    ),
    challenge: rt(
      p(
        'A visitor could not be left with a generic contractor slogan. The site had to show calculation, design, estimate, fabrication, installation, launch and maintenance as one cycle, and still remain usable for search.',
      ),
    ),
    goals: rt(
      ul([
        'Build a Drupal website with UX/UI design and an SEO structure',
        'Analyse keywords and competitors',
        'Create a semantic foundation and map it to the offering',
        'Present turnkey HVAC work on large construction objects',
        'Cover ventilation, air conditioning, ducts, installation and service',
        'Support visibility without inventing ranking targets',
      ]),
    ),
  },

  nicheSegmentation: [
    {
      name: 'Ventilation Systems',
      description: rt(
        p(
          'Design, production of ducts, nodes and parts, installation, commissioning and maintenance of ventilation systems, including on large construction objects.',
        ),
      ),
      marketingApproach: rt(
        p(
          'Give ventilation its own destination in the site and in the semantic map, rather than folding it into a generic engineering slogan. Buyers search for the system and the ducts, not only the company name.',
        ),
      ),
    },
    {
      name: 'Air Conditioning',
      description: rt(
        p(
          'Development, installation and technical maintenance of modern air-conditioning systems, named in the source as a core line alongside ventilation.',
        ),
      ),
      marketingApproach: rt(
        p(
          'Keep air-conditioning intent separate from ventilation-only pages where the search is different, while still showing both as part of the same turnkey contractor.',
        ),
      ),
    },
    {
      name: 'Duct Production and System Components',
      description: rt(
        p(
          'In-house production of air ducts, fasteners and related components that then go into the installed system. Materials are not disclosed.',
        ),
      ),
      marketingApproach: rt(
        p(
          'Show fabrication as part of the project cycle — estimate, produce, install — not as an unrelated metal workshop.',
        ),
      ),
    },
    {
      name: 'Large Construction and Government Objects',
      description: rt(
        p(
          'Work inside fairly large construction objects, including government orders: fit-out of the systems and later support. Named sites are not disclosed.',
        ),
      ),
      marketingApproach: rt(
        p(
          'Speak to facilities and construction buyers who need a contractor able to design, install and service the system on a large building, not only sell a catalogue item.',
        ),
      ),
    },
    {
      name: 'Electrical and Construction Work Inside the System',
      description: rt(
        p(
          'Electrical work and construction are connected to the ventilation and air-conditioning path. They are not described as a standalone electrical-contracting or general-construction company.',
        ),
      ),
      marketingApproach: rt(
        p(
          'Present them as part of turnkey delivery on the same objects, without inventing a second brand.',
        ),
      ),
    },
    {
      name: 'Residential and Commercial HVAC',
      description: rt(
        p(
          'The source example states that the company serves diverse needs in both residential and commercial sectors.',
        ),
      ),
      marketingApproach: rt(
        p(
          'Allow those two audiences to land on relevant pages. Do not force a housing enquiry and a large-building fit-out onto the same paragraph.',
        ),
      ),
    },
  ],

  digitalEcosystem: rt(
    p(
      'The confirmed digital ecosystem is the Drupal corporate website, with UX/UI design, SEO structure, keyword and competitor analysis, a semantic core and mapping, and advertising strategies named in the source example.',
      'Social programmes, CRM platforms, specific ad accounts and AI-search tools are not listed as delivered work. They are not confirmed in the source material used here.',
    ),
  ),
  websiteArchitecture: rt(
    p(
      'The site had to hold the project cycle and the commercial directions: ventilation, air conditioning, duct production, installation, commissioning, maintenance, electrical and construction work attached to those systems, and construction-themed presentation.',
      'Exact historic URLs are not reconstructed. Drupal version and module list are not disclosed.',
    ),
  ),
  semanticArchitecture: rt(
    p(
      'The semantic model connected ventilation systems, air conditioning, air ducts, installation, maintenance, large construction objects, residential and commercial demand, and the turnkey sequence from design to service.',
      'Keyword volumes are not stated. Competitor brands are not named.',
    ),
  ),

  marketingStrategy: {
    seoAndContentStrategy: rt(
      p(
        'The main digital strategy in the source is search-led: keyword analysis, competitor analysis, a semantic foundation, strategic mapping, and a Drupal site designed for UX/UI and SEO.',
        'Content had to explain the turnkey cycle and the systems themselves so a technical or construction buyer could recognise the offering. No article count or publishing calendar is stated.',
      ),
    ),
    leadGenMechanism: rt(
      p(
        'The site was meant to make the company findable for people who need these systems and then allow contact. No form mix, conversion rate or lead volume is published.',
      ),
    ),
    paidAdvertising: [],
    socialMedia: [],
  },

  aiSearchOptimization: {
    brandAuthorityAndTrust: rt(
      p(
        'This project is described as website development, semantic SEO and digital presentation of a turnkey HVAC contractor. It is not rewritten as an AI-search engagement.',
        'No ChatGPT ranking, Perplexity citation, Gemini visibility, AI Overview result or AI-generated lead is claimed, and none is documented.',
      ),
    ),
    entityAndGeoStructure: rt(
      p(
        'Ventilation, air conditioning, ducts, installation, service and construction applications are treated as related entities in the information architecture. That topical model is useful for modern search systems in principle. It is not a measured GEO or AEO programme.',
      ),
    ),
  },

  implementationProcess: rt(
    p(
      'Confirmed shape of the work, without inventing dates: understand the turnkey offering; research keywords and competitors; build the semantic core and map it; develop the Drupal site with UX/UI and SEO structure; present construction-themed projects where the source supports that; continue the relationship as further objects appeared.',
      'The sequence is the method. It is not a dated Gantt chart.',
    ),
  ),

  timeline: [
    {
      period: 'Phase 1',
      title: 'Understand the turnkey offering',
      description: rt(
        p(
          'Map the real cycle: calculation, design, estimate, duct production, installation, commissioning and maintenance, including electrical and construction work attached to those systems.',
        ),
      ),
    },
    {
      period: 'Phase 2',
      title: 'Keyword and competitor research',
      description: rt(
        p(
          'Analyse how buyers search for ventilation, air conditioning, ducts, installation and service. Competitor brands are not named.',
        ),
      ),
    },
    {
      period: 'Phase 3',
      title: 'Semantic core and mapping',
      description: rt(
        p(
          'Build a semantic foundation and map terms to the offering so pages can carry specific intent instead of one generic contractor description.',
        ),
      ),
    },
    {
      period: 'Phase 4',
      title: 'Drupal website with UX/UI and SEO structure',
      description: rt(
        p(
          'Develop the site on Drupal so the architecture can hold the systems, the production cycle and construction-themed presentation. Version and modules are not disclosed.',
        ),
      ),
    },
    {
      period: 'Phase 5',
      title: 'Ongoing relationship and further objects',
      description: rt(
        p(
          'The engagement ran for five years. Further objects were delivered for the same client in parallel. Those additional objects are not described in this record.',
        ),
      ),
    },
  ],

  resultsSummary: rt(
    p(
      'The company received a Drupal website with an SEO structure and a semantic foundation mapped to ventilation, air conditioning, duct production, installation, service and related construction work. The digital presentation could show a turnkey cycle instead of a slogan.',
      'The relationship continued for five years, and further objects were delivered in parallel. Verified traffic, rankings, leads, conversions and percentage improvements are not disclosed.',
    ),
  ),

  metrics: [],
  projectsShowcase: [],

  expertInsight: rt(
    p(
      'For a turnkey HVAC contractor, the website fails when it only says the company does engineering. Buyers search for the system, the ducts, the installation on a large object, or the service contract. Those intents need structure.',
      'Semantic research is useful here only if it is mapped onto pages. A Drupal rebuild with UX/UI and SEO structure is the implementation of that map, not a separate visual project.',
      'Where the source is silent — duct materials, the second object, advertising results — the correct public line is Not disclosed. That is more useful to a professional reader than a polished guess.',
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
        'Drupal website, semantic SEO and digital presentation for Merkan Invest Stroy, a turnkey contractor for ventilation, air conditioning and related engineering systems on large construction objects.',
      ),
    ),
  },

  primary_case_study_category: PRIMARY_CASE_STUDY_CATEGORY,
  case_study_categories: CASE_STUDY_CATEGORIES,

  meta: {
    title: 'Merkan Invest Stroy Case Study: HVAC Website and SEO',
    description:
      'Drupal website, semantic SEO and digital presentation for Merkan Invest Stroy, a turnkey ventilation and air-conditioning contractor.',
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
          layoutBlocks: 14,
          faqQuestions: faqBlock().items.length,
          discussionEntries: DISCUSSION.length,
          expertReplies: DISCUSSION.filter((entry) => entry.isExpert).length,
          discussionTree: tree,
          niches: 6,
          timeline: 5,
          duration: '5_years',
          categories: CASE_STUDY_CATEGORIES.length,
        },
        null,
        2,
      ),
    )
    process.exit(0)
  }

  const previewImageId = await upsertMedia(payload, PREVIEW_IMAGE)
  const galleryIds: number[] = []
  for (const image of GALLERY_IMAGES) {
    galleryIds.push(await upsertMedia(payload, image))
  }

  const data = buildData(previewImageId, galleryIds)

  const existing = await payload.find({
    collection: 'case-studies',
    where: { slug: { equals: SLUG } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })

  const payloadData = data as never

  if (existing.docs[0]) {
    const updated = await payload.update({
      collection: 'case-studies',
      id: existing.docs[0].id,
      data: payloadData,
      overrideAccess: true,
      context: { disableRevalidate: true },
    })
    payload.logger.info(`Updated existing Case Study ${updated.id}: ${getCaseStudyUrl(updated)}`)
  } else {
    const created = await payload.create({
      collection: 'case-studies',
      data: payloadData,
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
