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
 * Creates the MONTAGSPECSTROY case, or updates an existing one.
 * The supplied URL is the MIKS page. This script never writes MIKS, IVIKOM,
 * or Ovik Montag.
 *
 * Verified paragraph: design, production, construction, and reconstruction of
 * metal structures for the construction business. Drupal, UX/UI, keyword and
 * competitor analysis, a semantic core and mapping, copy for design,
 * construction, and reconstruction, then promotion. No figures.
 *
 * Website capture: blue wordmark, lines for design, construction, and
 * reconstruction, and a menu that also includes metal structures. The body
 * text names construction-and-installation work and says the firm had worked
 * in construction for more than ten years. A charity heading says the company
 * supports a children's fund. The capture is not identified as the Drupal build.
 *
 * A Google review on the same source page describes a separate website for a
 * foundation supporting children with autism. No charity name, and no claim
 * that MONTAGSPECSTROY owns that foundation.
 */
const SLUG = 'montagspecstroy-construction-engineering'
const IMAGE_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'assets')

const EXPERT = 'Maryan Polyak'
const EXPERT_ROLE = 'Manufacturing Digital Marketing & Web Development Expert'

const CATEGORY_TITLES = [
  'Construction Engineering',
  'Construction',
  'Engineering',
  'Metal Structures',
  'Structural Steelwork',
  'Metal Fabrication',
  'Industrial Manufacturing',
  'Manufacturing',
  'Manufacturing SEO',
  'Industrial SEO',
  'Competitor SEO Analysis',
  'Manufacturing Keyword Research',
  'Industrial Website Architecture',
  'Technical Content Marketing',
  'Industrial Website Development',
  'Manufacturing Website Development',
]

const PRIMARY_PREFERENCE = [
  'Construction Engineering',
  'Construction',
  'Engineering',
  'Metal Structures',
  'Metal Fabrication',
  'Industrial Manufacturing',
  'Manufacturing',
]

const rt = (html: string) => generateJSON(html, getTiptapExtensions({ headingLevels: [2, 3, 4] }))
const rtHero = (html: string) =>
  generateJSON(html, getTiptapExtensions({ headingLevels: [1, 2, 3, 4] }))

const escapeHtml = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const p = (...texts: string[]) => texts.map((text) => `<p>${escapeHtml(text)}</p>`).join('')

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
  filename: 'montag-preview.jpg',
  alt: 'Fabricated steel beams and columns with bolted splice plates in a yard.',
  caption:
    'Illustrative fabricated steel for the archive card. Not a verified MONTAGSPECSTROY assembly or a photograph of a completed contract.',
}

const MAIN_IMAGE: ImageSpec = {
  filename: 'montag-hero.jpg',
  alt: 'A structural steel building frame standing open to the sky on a construction site.',
  caption:
    'Illustrative structural frame. Not a documented MONTAGSPECSTROY building, site, or crew.',
}

const GALLERY_IMAGES: ImageSpec[] = [
  {
    filename: 'montag-install.jpg',
    alt: 'A crane lifting a steel beam into a building frame.',
    caption:
      'Illustrative installation. The captured site names construction and installation work. This photograph is not that site and is not a verified contract.',
  },
  {
    filename: 'montag-reconstruction.jpg',
    alt: 'New steelwork tied into an older brick industrial building.',
    caption:
      'Illustrative reconstruction. Reconstruction is a named line. This is not a verified MONTAGSPECSTROY project.',
  },
  {
    filename: 'montag-source-photo.jpg',
    alt: 'A capture of a MONTAGSPECSTROY website with a blue wordmark and a construction menu.',
    caption:
      'Website capture included with the source case. It shows the blue wordmark, the service menu, and a charity note. It is not identified as the Drupal site delivered in the engagement, and it is not a photograph of a construction site.',
  },
  {
    filename: 'montag-charity-desk.jpg',
    alt: 'A laptop showing a blank website wireframe beside a notebook and a pencil.',
    caption:
      'Illustrative picture of website planning for the separate charity project. Not the foundation’s website, and not a photograph of the organization, its staff, or the children it supports.',
  },
]

const LOGO_IMAGE: ImageSpec = {
  filename: 'montagspecstroy-logo-en.png',
  alt: 'MONTAGSPECSTROY logo: a blue portal frame beside the name, with the line Design, Construction, Reconstruction.',
  caption:
    'English adaptation in the blue-and-white palette of the source wordmark. The portal frame stands in for the structural work. The Cyrillic name was replaced with MONTAGSPECSTROY. The three words repeat the lines under the original mark: design, construction, reconstruction.',
}

const mimeFromName = (filename: string) => (filename.endsWith('.png') ? 'image/png' : 'image/jpeg')

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
  const fields = { alt: image.alt, caption: rt(`<p>${escapeHtml(image.caption)}</p>`) }
  const file = {
    name: image.filename,
    data,
    mimetype: mimeFromName(image.filename),
    size: data.byteLength,
  }
  if (existing.docs[0]) {
    const media = await payload.update({
      collection: 'media',
      id: existing.docs[0].id,
      data: fields,
      file,
      overrideAccess: true,
      context: { disableRevalidate: true },
    })
    payload.logger.info(`updated media ${media.id} ${image.filename}`)
    return media.id
  }
  const media = await payload.create({
    collection: 'media',
    data: fields,
    file,
    overrideAccess: true,
    context: { disableRevalidate: true },
  })
  payload.logger.info(`created media ${media.id} ${image.filename}`)
  return media.id
}

const DISCUSSION: DiscussionEntry[] = [
  {
    author: 'Helen Cho',
    role: 'Industrial Marketing Director',
    depth: 0,
    date: '2026-10-06',
    body: 'This section sits under the MIKS case. Is MONTAGSPECSTROY another metal-products plant?',
  },
  expert(
    '2026-10-06',
    'No. The paragraph describes a company for the construction business, working across design, production, construction, and reconstruction of metal structures. It is not the MIKS catalog and it is not the IVIKOM rack catalog. Those records stay separate.',
    1,
  ),
  {
    author: 'Helen Cho',
    role: 'Industrial Marketing Director',
    depth: 2,
    date: '2026-10-07',
    body: 'The captured site also says installation. Is that a fifth invented service?',
  },
  expert(
    '2026-10-07',
    'It is in the capture, not invented. The body text names construction-and-installation work and technologies in construction, installation, and reconstruction. The case paragraph itself says design, production, construction, and reconstruction. I keep installation at the level of that wording. No method statement and no crew size are added.',
    3,
  ),
  {
    author: 'Andrej Kovacs',
    role: 'Information Architect',
    depth: 0,
    date: '2026-10-08',
    body: 'The capture menu lists About, Design, Metal structures, Reconstruction, Photo album, Services, Prices, Feedback, and Contacts. Is that the Drupal tree?',
  },
  expert(
    '2026-10-08',
    'Drupal is named. The menu is visible on the capture. The case text does not say that capture is the site that was delivered. I use the menu as evidence of how the firm presented design, metal structures, and reconstruction. I do not rebuild historic URLs from it.',
    1,
  ),
  {
    author: 'Andrej Kovacs',
    role: 'Information Architect',
    depth: 2,
    date: '2026-10-09',
    body: 'Prices and a photo album are on that menu. Do we treat them as delivered sections?',
  },
  expert(
    '2026-10-09',
    'Only as labels on the capture. No price list is published in the case, and the album is not reproduced here as a set of verified projects.',
    3,
  ),
  {
    author: 'Sofia Berg',
    role: 'Semantic SEO Lead',
    depth: 0,
    date: '2026-10-10',
    body: 'Which queries does the source actually name?',
  },
  expert(
    '2026-10-10',
    'It names the subjects, not the phrases. Keyword and competitor analysis produced a semantic core and a mapping for people searching in construction and metal structures. The copy was aimed at queries related to design, construction, and reconstruction. No phrase list, no volumes, and no competitor names.',
    1,
  ),
  {
    author: 'Sofia Berg',
    role: 'Semantic SEO Lead',
    depth: 2,
    date: '2026-10-11',
    body: 'The MIKS section names custom construction beams. Does that example belong here?',
  },
  expert(
    '2026-10-11',
    'No. That example is in the MIKS section. This case does not borrow it.',
    3,
  ),
  {
    author: 'James Okonkwo',
    role: 'Industrial Content Strategist',
    depth: 0,
    date: '2026-10-12',
    body: 'The capture says more than ten years in construction and mentions European technologies and quality standards. Do we publish that as a certificate and a current age?',
  },
  expert(
    '2026-10-12',
    'As sentences on the capture, yes. As a named certificate, a standard number, or a current headcount, no. The standard is not named, and the page does not date the “more than ten years” sentence.',
    1,
  ),
  {
    author: 'Marcus Hale',
    role: 'Technical SEO Consultant',
    depth: 0,
    date: '2026-10-13',
    body: 'Should speed, mobile, or structured data come across from the MIKS technical list?',
  },
  expert(
    '2026-10-13',
    'No. Those items are not in the MONTAGSPECSTROY paragraph. The confirmed technical fact is Drupal, plus UX/UI described as intuitive. No schema type and no speed score are named.',
    1,
  ),
  {
    author: 'Marcus Hale',
    role: 'Technical SEO Consultant',
    depth: 2,
    date: '2026-10-14',
    body: 'Website promotion is in the closing sentence. Is that a paid campaign?',
  },
  expert(
    '2026-10-14',
    'The source calls it a content marketing strategy and website promotion that supported search visibility and targeted traffic. It names no ad platform, no budget, and no paid result. I do not turn that sentence into a media plan.',
    3,
  ),
  {
    author: 'Priya Shah',
    role: 'Analytics Lead',
    depth: 0,
    date: '2026-10-15',
    body: 'Visibility, targeted traffic, recognition, and positioning all “improved.” Where is the table?',
  },
  expert(
    '2026-10-15',
    'There is no table. No percentage, no keyword count, no ranking, no leads, and no revenue. The MIKS figures on the same page are not this company’s figures. The results stay qualitative, and they are labeled as the source’s claim rather than a measurement.',
    1,
  ),
  {
    author: 'Laura Bennett',
    role: 'Manufacturing Web Producer',
    depth: 0,
    date: '2026-10-17',
    body: 'The charity website. Is that a MONTAGSPECSTROY service line, or a second Neolines job?',
  },
  expert(
    '2026-10-17',
    'A second job, kept apart from the construction offer. A review on the source page describes work on a website for a foundation supporting children with autism: functional and aesthetic standards, and pages meant to be understandable for families and caregivers. The construction paragraph does not mention it. The captured construction site has its own line that the company supports a children’s fund. That line is not proof of ownership, and the fund is not named.',
    1,
  ),
  {
    author: 'Laura Bennett',
    role: 'Manufacturing Web Producer',
    depth: 2,
    date: '2026-10-18',
    body: 'Can we name the foundation or say how many children it reached?',
  },
  expert(
    '2026-10-18',
    'No. The review does not print the foundation’s name. It gives no count of children, no donations, and no fundraising result. The reviewer’s recommendation is not reused here as a client quotation.',
    3,
  ),
]

const faqBlock = () => ({
  blockType: 'csFAQ' as const,
  case_study_faq_title: 'Frequently Asked Questions About MONTAGSPECSTROY',
  items: [
    {
      question: 'What does the source say MONTAGSPECSTROY does?',
      answer: rt(
        p(
          'The case paragraph describes design, production, construction, and reconstruction of metal structures for the construction business. The website capture also names construction-and-installation work. It is not presented as a consumer catalog of metal goods.',
        ),
      ),
    },
    {
      question: 'How was the website meant to carry that range?',
      answer: rt(
        p(
          'Neolines built a Drupal site and designed the interface for intuitive use. Keyword and competitor analysis produced a semantic core and a mapping for construction and metal-structure searches. Copy was written for queries related to design, construction, and reconstruction. The capture’s menu shows Design, Metal structures, and Reconstruction as separate labels. That menu is not asserted to be the delivered sitemap.',
        ),
      ),
    },
    {
      question: 'Which search phrases were published?',
      answer: rt(
        p(
          'None as a list. The source names the subjects: design, construction, reconstruction, and metal structures. It does not print queries, volumes, or competitor names. Examples from the MIKS section of the same page are not reused.',
        ),
      ),
    },
    {
      question: 'What results can be stated without a number?',
      answer: rt(
        p(
          'The source says the content strategy and website promotion improved search visibility, attracted targeted traffic, and strengthened recognition and positioning. It gives no percentage, keyword count, ranking, lead total, or revenue. Those sentences are the source’s claim, not a measured report.',
        ),
      ),
    },
    {
      question: 'What was the separate charity website?',
      answer: rt(
        p(
          'A review on the source page describes Neolines’ work on a website for a foundation supporting children with autism. The confirmed scope is a site held to functional and aesthetic standards and made informative for families and caregivers. The foundation is not named. It is not described as owned by MONTAGSPECSTROY, and it is not one of the construction services.',
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
    date: entry.date,
    depth: entry.depth ?? 0,
    isExpert: Boolean(entry.isExpert),
    body: rt(p(entry.body)),
  })),
})

const ctaBlock = () => ({
  blockType: 'cta' as const,
  richText: rtHero(
    `<h2>${escapeHtml('Discuss a site for a construction engineering firm')}</h2>` +
      p(
        'If the firm designs, fabricates, installs, and reconstructs, the website has to keep those stages apart before search can be read.',
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
  case_study_gallery_title: 'Structures, Installation, and a Separate Website',
  case_study_gallery_images: imageIds,
})

const buildData = (
  previewImageId: number,
  mainImageId: number,
  galleryIds: number[],
  logoId: number,
  primaryCategoryId: number,
  categoryIds: number[],
  siteCategoryIds: number[],
  displayOrder: number,
) => ({
  title: 'MONTAGSPECSTROY: Website Development and SEO for a Construction and Engineering Company',
  case_study_long_title: 'A Drupal Site for a Construction and Engineering Company',
  slug: SLUG,
  generateSlug: false,
  _status: 'published' as const,
  featured: true,
  displayOrder,
  company_logo: logoId,

  layout: [
    {
      blockType: 'csPreview' as const,
      case_study_preview_title: 'Design, Construction, and Reconstruction',
      case_study_preview_text: rt(
        p(
          'MONTAGSPECSTROY works across the design, production, construction, and reconstruction of metal structures. Neolines built a Drupal site and wrote it for those stages. No traffic figure is given.',
        ),
      ),
      case_study_preview_image: previewImageId,
    },

    titleBlock('Client Overview'),
    contentBlock(
      p(
        'MONTAGSPECSTROY is presented as a construction and engineering company, not as a seller of finished metal goods. The published scope is the design, production, construction, and reconstruction of metal structures for the construction business.',
        'A website capture included with the source adds the firm’s own wording. It says the collective had worked in construction for more than ten years, names a full range of construction-and-installation work, and refers to technologies in construction, installation, and reconstruction. It also mentions European construction technologies and quality standards. The standard is not named, and the “more than ten years” sentence is not dated. Headcount, contract values, and a list of completed buildings are not given.',
        'The engagement length is not stated in the paragraph, so no duration is shown.',
      ),
    ),

    titleBlock('The Service Problem'),
    contentBlock(
      p(
        'A buyer looking for structural design, fabricated steel, installation, or reconstruction is not making one inquiry. A page that only says “metal structures” hides the stage they need.',
        'The work was to put that range on a Drupal site, map the language of construction and metal structures onto the relevant pages, and write for design, construction, and reconstruction.',
      ),
    ),

    titleBlock('Service Architecture'),
    contentBlock(
      p(
        'Named in the case paragraph: design, production, construction, and reconstruction of metal structures.',
        'Named on the website capture, in addition: construction-and-installation work, and a menu that separates Design, Metal structures, and Reconstruction. The same menu also shows a photo album, services, and prices. Those labels are not expanded into a rate card or a project portfolio here.',
        'No drawing set, steel grade, crane plan, or named building is published. The capture is not treated as proof that every menu label was a separately contracted service during the engagement.',
      ),
    ),

    titleBlock('Website and UX'),
    contentBlock(
      p(
        'Neolines developed the website on Drupal and designed the UX/UI for intuitive use. A theme, a module list, and a screen inventory are not included.',
        'Under the source wordmark the capture prints three lines: design, construction, reconstruction. The visible menu is About, Design, Metal structures, Reconstruction, Photo album, Services, Prices, Feedback, and Contacts. Because the case does not identify that capture as the delivered Drupal site, the menu is evidence of the range the company presented. It is not reconstructed here as the engagement sitemap.',
      ),
    ),

    titleBlock('Semantic Research'),
    contentBlock(
      p(
        'Keyword and competitor analysis was used to build a semantic core and a mapping for an audience in construction and metal structures. The copy was aimed at queries related to design, construction, and reconstruction.',
        'The phrases, the volumes, and the competitor names are not published. Queries named in the MIKS section of the same source page are not part of this case.',
      ),
    ),

    titleBlock('What Was Not in the Technical List'),
    contentBlock(
      p(
        'The paragraph does not mention page-load work, a mobile audit, or structured data. No schema type is claimed. Promotion is described as a content strategy and website promotion, without an advertising platform or a budget.',
      ),
    ),

    titleBlock('A Separate Charity Website'),
    contentBlock(
      p(
        'Alongside the construction site, the collaboration included a separate website for a charitable foundation supporting children with autism. A review on the source page, written from the point of view of a child-development specialist, describes that work: the site was held to functional and aesthetic standards and made informative for families and caregivers.',
        'The foundation is not named. No count of children, donations, or fundraising result is given. The review is not reprinted here as a client quotation.',
        'The construction company’s own capture has a charity heading and a line that the company supports a children’s fund. That is a statement on the construction site. It is not treated as ownership of the foundation, and it is not one of the engineering services.',
      ),
    ),

    titleBlock('What the Source Says Happened'),
    contentBlock(
      p(
        'The source says the content strategy and website promotion improved visibility in search, attracted targeted traffic, and strengthened recognition and market positioning.',
        'It does not say by how much, over what dates, or from what baseline. No keyword count, lead total, or revenue figure is given. The MIKS percentages on the same page are a different case.',
      ),
    ),

    titleBlock('Conclusion'),
    contentBlock(
      p(
        'The documented construction work is a Drupal site and an organic-search content program for a firm whose stages run from design and production through construction, installation, and reconstruction.',
        'The charity website is a second project in the same collaboration, kept outside that commercial offer. Company size, a named certificate, a completed building, and a measured traffic result are not claimed.',
      ),
    ),

    contentBlock(
      p(
        'The photographs of a steel frame, fabricated members, a crane lift, and a reconstruction scene are illustrative. They are not verified MONTAGSPECSTROY contracts. One gallery image is the website capture from the source page. The wireframe photograph illustrates the separate charity website and is not that site.',
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
        'Design, production, construction, and reconstruction of metal structures, with construction-and-installation work named on the captured site. The capture says the firm had worked in construction for more than ten years and refers to quality standards without naming one. Equipment lists and headcount are not given.',
      ),
    ),
    products: rt(
      p(
        'This is a project and construction practice, not a consumer product line. The relevant outputs are engineered metal structures, their fabrication, their installation, and reconstruction of existing structures. No catalog of retail goods is published.',
      ),
    ),
    materials: rt(
      p('The structures are identified as metal. Grades, coatings, and a named quality standard are not given.'),
    ),
    applications: rt(
      p(
        'The construction business: new structural work and reconstruction of existing buildings. Named completed buildings and contract values are not published.',
      ),
    ),
  },

  businessChallenge: {
    initialState: rt(
      p(
        'MONTAGSPECSTROY already worked across design, production, construction, and reconstruction of metal structures. The captured site also describes installation. Those are different stages of one construction practice.',
      ),
    ),
    challenge: rt(
      p(
        'A single metal-products page would collapse that practice into a supplier. Search needed a path for design, for metal structures, for construction and installation, and for reconstruction.',
      ),
    ),
    goals: rt(
      p(
        'Build the Drupal site, design it for intuitive use, form a semantic core and mapping from keyword and competitor research, and write for design, construction, and reconstruction. A budget and a team size for the engagement are not stated.',
      ),
    ),
  },

  nicheSegmentation: [
    {
      name: 'Design and engineering',
      description: rt(
        p(
          'Design is named in the case paragraph and is its own item on the captured menu, under the wordmark line “design.” Drawing scope and engineering software are not listed.',
        ),
      ),
      marketingApproach: rt(
        p('The mapping was meant to give design its own relevance. The queries themselves are not published.'),
      ),
    },
    {
      name: 'Metal structure fabrication',
      description: rt(
        p(
          'Production of metal structures is in the case paragraph. The capture lists metal structures as a menu item, separate from design and from reconstruction.',
        ),
      ),
      marketingApproach: rt(
        p('Fabrication stays a production stage, not a retail catalog and not the whole company.'),
      ),
    },
    {
      name: 'Construction and installation',
      description: rt(
        p(
          'Construction is in the case paragraph. The capture names construction-and-installation work and technologies in installation. No erection method is specified.',
        ),
      ),
      marketingApproach: rt(
        p('A construction or installation search is not filed as a request for a fabricated beam alone.'),
      ),
    },
    {
      name: 'Reconstruction',
      description: rt(
        p(
          'Reconstruction is named in the paragraph, under the wordmark, and as its own menu item. The capture does not itemize a completed building.',
        ),
      ),
      marketingApproach: rt(
        p('Reconstruction is written as its own stage so it is not absorbed into new-build construction.'),
      ),
    },
  ],

  digitalEcosystem: rt(
    p(
      'Two distinct digital jobs. The commercial one is the Drupal website for the construction company: UX/UI, keyword and competitor research, a semantic core and mapping, and SEO-oriented copy. The other is a separate website for a foundation supporting children with autism, described in a review on the source page.',
      'The foundation is not a construction client and is not described as owned by the company. No advertising account is named for either site.',
    ),
  ),
  websiteArchitecture: rt(
    p(
      'Drupal is the named platform for the construction site. The information architecture is described as a semantic mapping, not as a published sitemap.',
      'The capture shows Design, Metal structures, and Reconstruction as separate labels, plus About, a photo album, services, prices, feedback, and contacts. That menu is not asserted to be the delivered Drupal tree.',
    ),
  ),
  semanticArchitecture: rt(
    p(
      'Keyword and competitor analysis produced a semantic core and a mapping for construction and metal-structure searches. Copy subjects named in the paragraph: design, construction, and reconstruction.',
      'No example query is printed. The core’s size is not published.',
    ),
  ),

  marketingStrategy: {
    seoAndContentStrategy: rt(
      p(
        'An integrated copy program for a construction practice, not a visual refresh alone and not a product-catalog campaign. Pages were to carry the terminology of the stage: design, construction, reconstruction, and metal structures.',
        'The source calls the result a content marketing strategy and website promotion. It does not describe a publishing calendar or an ad platform.',
      ),
    ),
    leadGenMechanism: rt(
      p('The capture has a Feedback item. The case text does not describe a form, a CRM, or a lead count.'),
    ),
    paidAdvertising: [],
    socialMedia: [],
  },

  aiSearchOptimization: {
    brandAuthorityAndTrust: rt(
      p(
        'This record is a Drupal build, an organic content program, and a separate charity website. It is not an AI-search program.',
        'No answer-engine result is claimed. The capture mentions quality standards and does not name a certificate.',
      ),
    ),
    entityAndGeoStructure: rt(
      p(
        'Design, fabrication, installation, and reconstruction are different stages, which is why the mapping matters. The charity website is a different entity and is not placed inside the construction navigation. No city ranking or measured local-search result is published.',
      ),
    ),
  },

  implementationProcess: rt(
    p(
      'Confirmed shape of the construction work: design and build the site on Drupal, with UX/UI aimed at intuitive use; run keyword and competitor analysis; form a semantic core and mapping; write for design, construction, and reconstruction; support the site through content and promotion.',
      'Separately, contribute to a website for a foundation supporting children with autism. Dates for either job are not listed.',
    ),
  ),

  timeline: [
    {
      period: 'Phase 1',
      title: 'Drupal site and interface',
      description: rt(
        p('Website development on Drupal and UX/UI design for intuitive use. Screens and modules are not listed.'),
      ),
    },
    {
      period: 'Phase 2',
      title: 'Research and service mapping',
      description: rt(
        p(
          'Keyword and competitor analysis, then a semantic core and a mapping for construction and metal structures. Phrases are not published.',
        ),
      ),
    },
    {
      period: 'Phase 3',
      title: 'Stage-specific copy and promotion',
      description: rt(
        p(
          'Copy for design, construction, and reconstruction, then the content strategy and website promotion the source describes. No traffic figure is attached.',
        ),
      ),
    },
    {
      period: 'Separate project',
      title: 'Charity website',
      description: rt(
        p(
          'A website for a foundation supporting children with autism, kept outside the construction information architecture. The foundation’s name and any impact figures are not published.',
        ),
      ),
    },
  ],

  resultsSummary: rt(
    p(
      'The documented outcome is a Drupal site organized around the stages of a construction and engineering practice, with copy for design, construction, and reconstruction, plus a separate charity website that is not part of that commercial offer.',
      'The source says visibility, targeted traffic, recognition, and positioning improved. It publishes no percentage, no keyword count, no ranking, no leads, and no revenue. Those sentences are not restated here as a measurement. The figures on the MIKS section of the same page are not used.',
    ),
  ),

  metrics: [],
  projectsShowcase: [],

  expertInsight: rt(
    p(
      'The useful complexity is a firm that designs, fabricates, installs, and reconstructs, so the website has to name the stage. Treating it as a metal-goods catalog would miss the practice. The charity website is interesting because it is a different kind of site in the same collaboration, and it stays interesting only if it is not folded into the construction services.',
    ),
  ),

  clientTestimonial: { quote: null, author: null, position: null, company: null },

  hero: {
    type: 'mediumImpact' as const,
    richText: rtHero(
      p(
        'Website development and SEO for MONTAGSPECSTROY, a construction and engineering company working across the design, production, installation, construction, and reconstruction of metal structures.',
      ),
    ),
    media: mainImageId,
  },

  primary_case_study_category: primaryCategoryId,
  case_study_categories: categoryIds,
  site_categories: siteCategoryIds,

  meta: {
    title: 'MONTAGSPECSTROY Case Study: Website and SEO for Construction Engineering',
    description:
      'See how Drupal development, service-focused content, semantic research, and SEO supported MONTAGSPECSTROY, a company working across metal-structure design, construction, and reconstruction.',
    image: previewImageId,
  },
})

const normalizeTitle = (value: unknown) => String(value ?? '').replace(/&amp;/g, '&').trim()

const resolveCategories = async (payload: Awaited<ReturnType<typeof getPayload>>) => {
  const ids: number[] = []
  const foundTitles = new Map<string, number>()
  for (const title of CATEGORY_TITLES) {
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
    const id = Number(doc.id)
    if (!ids.includes(id)) ids.push(id)
    foundTitles.set(normalizeTitle(doc.title), id)
  }
  const primaryTitle = PRIMARY_PREFERENCE.find((title) => foundTitles.has(title))
  const primary = primaryTitle ? foundTitles.get(primaryTitle) : undefined
  if (!primary) throw new Error('No primary category was found')
  return { primary, ids, primaryTitle }
}

const mapSiteCategories = async (
  payload: Awaited<ReturnType<typeof getPayload>>,
  caseCategoryIds: number[],
) => {
  const siteIds: number[] = []
  for (const id of caseCategoryIds) {
    const doc = await payload.findByID({
      collection: 'case-study-categories',
      id,
      depth: 0,
      overrideAccess: true,
    })
    if (!doc?.slug) continue
    const site = await payload.find({
      collection: 'site-categories',
      where: { slug: { equals: doc.slug } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    if (!site.docs[0]) {
      payload.logger.warn(`no site category for slug ${doc.slug}`)
      continue
    }
    siteIds.push(Number(site.docs[0].id))
  }
  return siteIds
}

const main = async () => {
  const dry = process.argv.includes('--dry')
  const payload = await getPayload({ config })
  const tree = measureCommentTree(buildCommentTree(DISCUSSION))
  const categories = await resolveCategories(payload)
  const siteCategoryIds = await mapSiteCategories(payload, categories.ids)
  const newest = await payload.find({
    collection: 'case-studies',
    sort: '-displayOrder',
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  const nextOrder = Number(newest.docs[0]?.displayOrder ?? 23) + 1

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
          metrics: 0,
          projectsShowcase: 0,
          galleryImages: GALLERY_IMAGES.length,
          displayOrder: nextOrder,
          primaryCategory: categories.primaryTitle,
          categories: categories.ids,
          siteCategories: siteCategoryIds.length,
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
      or: [{ slug: { equals: SLUG } }, { slug: { like: 'montagspecstroy' } }, { title: { like: 'MONTAGSPECSTROY' } }],
    },
    limit: 5,
    depth: 0,
    overrideAccess: true,
  })
  if (
    duplicates.docs.some((doc) =>
      /miks|ivikom|ovik/i.test(`${doc.slug} ${doc.title}`),
    )
  ) {
    throw new Error('Lookup matched another case. Aborting.')
  }
  if (duplicates.docs.length > 1) {
    throw new Error(
      `More than one MONTAGSPECSTROY case found: ${duplicates.docs.map((doc) => `${doc.id} ${doc.slug}`).join(', ')}`,
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
    siteCategoryIds,
    existing?.displayOrder ?? nextOrder,
  )

  if (existing) {
    const updated = await payload.update({
      collection: 'case-studies',
      id: existing.id,
      data: {
        ...data,
        slug: existing.slug,
        displayOrder: existing.displayOrder ?? data.displayOrder,
        featured: existing.featured ?? data.featured,
      } as never,
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

  const miks = await payload.find({
    collection: 'case-studies',
    where: { slug: { equals: 'miks-industrial-manufacturing' } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  payload.logger.info(`MIKS left in place: ${miks.docs[0] ? miks.docs[0].slug : 'not found'}`)
  process.exit(0)
}

void main().catch((error) => {
  console.error(error)
  process.exit(1)
})
