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
 * Creates the IVIKOM case study, or updates an existing IVIKOM record.
 * The supplied URL is the MIKS page. IVIKOM is a neighboring section on that
 * page, not the MIKS record. This script never queries or writes MIKS.
 *
 * Verified on that page:
 * - One paragraph: design and production of metal products, including metal
 *   racks, advertising stands, cabinets, containers, and powder coating.
 *   Drupal, UX/UI, keyword and competitor analysis, a semantic core and
 *   mapping, copy focused on metal products and powder coating, and a
 *   content strategy that the source says improved visibility, traffic, and
 *   search results. No figures.
 * - Logo file ivikom.jpg: the Cyrillic word is ИВИКОМ. The O is a circled mark.
 * - Website capture ivicom.jpg: a 21 August 2006 company note, a menu
 *   (About, Metal products, Shelving, Powder coating, Our work, Feedback,
 *   Contacts), tire racks in the gallery, and racks that can be taken apart
 *   and moved. That capture is not identified as the Drupal deliverable.
 *
 * The engagement brief says approximately two years. The paragraph has no
 * dates, so the duration field is left unset. No metrics are invented.
 */
const SLUG = 'ivikom-metal-products'
const IMAGE_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'assets')

const EXPERT = 'Maryan Polyak'
const EXPERT_ROLE = 'Manufacturing Digital Marketing & Web Development Expert'

const CATEGORY_TITLES = [
  'Manufacturing',
  'Manufacturing SEO',
  'Competitor SEO Analysis',
  'Manufacturing Keyword Research',
  'Industrial Website Architecture',
  'Technical Content Marketing',
  'Product SEO',
  'Industrial Website Development',
  'Manufacturing Website Development',
  'Application SEO',
  'Metal Fabrication',
  'Industrial Manufacturing',
  'Industrial SEO',
  'Retail Equipment',
  'Retail Display',
  'Storage Equipment',
  'Powder Coating',
]

const PRIMARY_PREFERENCE = [
  'Metal Fabrication',
  'Industrial Manufacturing',
  'Retail Equipment',
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
  filename: 'ivikom-preview.jpg',
  alt: 'A yellow powder-coated metal storage rack standing in an empty room.',
  caption:
    'Illustrative powder-coated rack for the archive card. Not a verified IVIKOM product or a photograph of the plant.',
}

const MAIN_IMAGE: ImageSpec = {
  filename: 'ivikom-hero.jpg',
  alt: 'Yellow metal shelving, pallet racking, and tire racks in a warehouse.',
  caption:
    'Illustrative storage racks. Not a documented IVIKOM installation, factory, or employee photograph.',
}

const GALLERY_IMAGES: ImageSpec[] = [
  {
    filename: 'ivikom-tires.jpg',
    alt: 'Car tires stored on a yellow metal rack in a workshop.',
    caption:
      'Illustrative tire-storage rack. The source capture pictures tires on a rack. This photograph is not that capture and is not a verified IVIKOM product.',
  },
  {
    filename: 'ivikom-stands.jpg',
    alt: 'Freestanding metal display stands with blank panels in an empty hall.',
    caption:
      'Illustrative advertising stands. The case text names advertising stands. This is not a verified IVIKOM installation.',
  },
  {
    filename: 'ivikom-cabinets.jpg',
    alt: 'A gray metal cabinet beside a large metal container on wheels.',
    caption:
      'Illustrative metal cabinet and container. Both are named in the case text. This is not a catalog photograph.',
  },
  {
    filename: 'ivikom-coating.jpg',
    alt: 'Metal parts on a conveyor, some powder-coated yellow and orange, beside a spray booth.',
    caption:
      'Illustrative powder-coating booth. Powder coating is a named service. This is not a photograph of the IVIKOM shop.',
  },
  {
    filename: 'ivikom-source-photo.jpg',
    alt: 'A capture of an IVIKOM website page with a shelving menu, tire racks, and a 2006 company note.',
    caption:
      'Website capture included with the source case. The visible company note is dated 21 August 2006. It shows the product range the site presented. It is not identified as the Drupal site delivered in the engagement, and it is not a photograph of the plant.',
  },
]

const LOGO_IMAGE: ImageSpec = {
  filename: 'ivikom-logo-en.png',
  alt: 'IVIKOM logo: white letters with an orange outline on a blue bar, and a circled mark in place of the O.',
  caption:
    'English adaptation of the source mark. The source word is ИВИКОМ, not a different name. The blue bar, orange outline, and circled O are kept. The Cyrillic letters were replaced with IVIKOM.',
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
    author: 'Helen Cho',
    role: 'Industrial Marketing Director',
    depth: 0,
    date: '2026-10-01',
    body: 'This section sits on the MIKS page. Is IVIKOM the same plant, or a separate metal-products manufacturer?',
  },
  expert(
    '2026-10-01',
    'Separate. The MIKS record stays as it is. The IVIKOM paragraph is a specialized project for the design and production of metal products: metal racks, advertising stands, cabinets, containers, and powder coating. It does not repeat the MIKS structural list, and it does not inherit the MIKS metrics.',
    1,
  ),
  {
    author: 'Helen Cho',
    role: 'Industrial Marketing Director',
    depth: 2,
    date: '2026-10-02',
    body: 'The website capture shows tire racks. Are those in the paragraph, or only in the capture?',
  },
  expert(
    '2026-10-02',
    'Only in the capture. The paragraph says metal racks. The capture’s gallery shows tires on a rack, and the news copy is about shelving. I am not promoting that picture into a specification, a load rating, or a claim that every rack was a tire rack.',
    3,
  ),
  {
    author: 'Andrej Kovacs',
    role: 'Information Architect',
    depth: 0,
    date: '2026-10-04',
    body: 'The capture has a menu: About, Metal products, Shelving, Powder coating, Our work, Feedback, Contacts. Is that the Drupal information architecture?',
  },
  expert(
    '2026-10-04',
    'Drupal is named for this engagement. The menu is visible on the capture. The case text does not say that capture is the site Neolines delivered. A 21 August 2006 note is on the same page, and the engagement length is not dated there. I treat the menu as evidence of how the company presented its range, not as a reconstructed sitemap.',
    1,
  ),
  {
    author: 'Andrej Kovacs',
    role: 'Information Architect',
    depth: 2,
    date: '2026-10-05',
    body: 'Then what structure can we actually attribute to the work?',
  },
  expert(
    '2026-10-05',
    'A semantic core and a mapping, built from keyword and competitor analysis, plus copy aimed at metal-product manufacturing and powder coating. Page titles, URLs, and a module list are not published.',
    3,
  ),
  {
    author: 'Sofia Berg',
    role: 'Semantic SEO Lead',
    depth: 0,
    date: '2026-10-06',
    body: 'Which queries does the source actually name for IVIKOM?',
  },
  expert(
    '2026-10-06',
    'None. It says an in-depth keyword and competitor analysis produced a semantic core and a mapping for the target audience. The only subject it names for the copy is the production of metal products and powder coating. No phrase list, no volumes, and no competitor names.',
    1,
  ),
  {
    author: 'Sofia Berg',
    role: 'Semantic SEO Lead',
    depth: 2,
    date: '2026-10-07',
    body: 'The MIKS section on the same page names custom construction beams and medical metal furniture. Do those transfer?',
  },
  expert(
    '2026-10-07',
    'No. Those examples belong to the MIKS section. Using them here would merge two cases.',
    3,
  ),
  {
    author: 'James Okonkwo',
    role: 'Industrial Content Strategist',
    depth: 0,
    date: '2026-10-08',
    body: 'Powder coating is both a service and a phrase in the copy. Is there a process description, a standard, or a color system?',
  },
  expert(
    '2026-10-08',
    'No. It is named as a service, and the copy was weighted toward that subject and toward metal-product manufacturing. The capture has a Powder coating menu item. No coating standard, thickness, color chart, or booth specification is given.',
    1,
  ),
  {
    author: 'Marcus Hale',
    role: 'Technical SEO Consultant',
    depth: 0,
    date: '2026-10-10',
    body: 'Should this case pick up the MIKS technical list: speed, mobile, and structured data?',
  },
  expert(
    '2026-10-10',
    'No. Those items are in the MIKS section. The IVIKOM paragraph names Drupal, UX/UI aimed at ease of use, the research, the core and mapping, and SEO-oriented copy. It does not name a schema type, a speed score, or a mobile audit.',
    1,
  ),
  {
    author: 'Marcus Hale',
    role: 'Technical SEO Consultant',
    depth: 2,
    date: '2026-10-11',
    body: 'UX/UI is still a design claim. What is actually specified?',
  },
  expert(
    '2026-10-11',
    'That the interface was designed for ease of use, on a Drupal site. Screens, a component library, and a usability test are not described.',
    3,
  ),
  {
    author: 'Priya Shah',
    role: 'Analytics Lead',
    depth: 0,
    date: '2026-10-12',
    body: 'The paragraph says visibility, traffic, and search results improved. Where is the table?',
  },
  expert(
    '2026-10-12',
    'There is no table. No percentage, no keyword count, no ranking position, no leads, and no revenue. The MIKS figures on the same page are not IVIKOM figures. The results block stays qualitative and says the source asserts an improvement without a measurement.',
    1,
  ),
  {
    author: 'Priya Shah',
    role: 'Analytics Lead',
    depth: 2,
    date: '2026-10-13',
    body: 'Can “improved search results” be read as first-page rankings?',
  },
  expert(
    '2026-10-13',
    'No. The sentence says promotion in search and better results for target queries. It does not say where those queries ranked.',
    3,
  ),
  {
    author: 'Laura Bennett',
    role: 'Manufacturing Web Producer',
    depth: 0,
    date: '2026-10-15',
    body: 'The brief says about two years. The capture says the company had been manufacturing for 11 years. Which clock is this case on?',
  },
  expert(
    '2026-10-15',
    'The engagement brief says approximately two years. The published paragraph has no start or end, so no exact-year badge is shown. The 11 years is a sentence on the captured site, next to the date 21 August 2006. It is not a current headcount and not the length of the Neolines work.',
    1,
  ),
  {
    author: 'Laura Bennett',
    role: 'Manufacturing Web Producer',
    depth: 2,
    date: '2026-10-16',
    body: 'The same note says the firm had its own production space and offices, and that products met safety norms. Do we publish that as capacity and a certificate?',
  },
  expert(
    '2026-10-16',
    'As a dated statement on that capture, yes. As a measured floor area, a headcount, or a named certificate, no. The note does not name the standard.',
    3,
  ),
]

const faqBlock = () => ({
  blockType: 'csFAQ' as const,
  case_study_faq_title: 'Frequently Asked Questions About IVIKOM',
  items: [
    {
      question: 'What metal products does the source attribute to IVIKOM?',
      answer: rt(
        p(
          'The case paragraph names the design and production of metal products, including metal racks, advertising stands, cabinets, containers, and powder coating services. It does not assign the MIKS structural catalog, medical furniture, or construction services to IVIKOM.',
        ),
      ),
    },
    {
      question: 'What does the website capture add to that list?',
      answer: rt(
        p(
          'The capture shows a shelving-oriented site: a menu for metal products, shelving, and powder coating, tire racks in the gallery, and copy that the racks can be taken apart and moved. A company note dated 21 August 2006 says the firm made metal products for warehouses, offices, and shops and had its own production space and offices. That note is not a current capacity statement.',
        ),
      ),
    },
    {
      question: 'What did the website engagement include?',
      answer: rt(
        p(
          'A Drupal website, UX/UI design aimed at ease of use, keyword and competitor analysis, a semantic core and mapping, and copy focused on metal-product manufacturing and powder coating. A sitemap, a module list, and a budget are not published. The capture is not identified as that Drupal build.',
        ),
      ),
    },
    {
      question: 'Which search phrases were published?',
      answer: rt(
        p(
          'None. The source says the core and the mapping reflected the audience, and that the copy emphasized metal products and powder coating. It does not list queries, volumes, or competitors. Phrases from the MIKS section on the same page are not reused here.',
        ),
      ),
    },
    {
      question: 'What results can be stated without inventing a number?',
      answer: rt(
        p(
          'The source says the content strategy increased the site’s visibility, supported promotion in search, increased traffic, and improved search results for target queries. It gives no percentage, keyword count, ranking, lead total, or revenue figure. Those sentences are the source’s claim, not a measured report.',
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
    `<h2>${escapeHtml('Discuss a product-line site for a metal shop')}</h2>` +
      p(
        'If the catalog runs from racks and display stands to cabinets, containers, and powder coating, the site has to name those lines before search can be read.',
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
  case_study_gallery_title: 'Racks, Stands, Cabinets, and Powder Coating',
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
  title: 'IVIKOM: Website Development and SEO for a Metal Products Manufacturer',
  case_study_long_title: 'A Drupal Site for a Metal Products Manufacturer',
  slug: SLUG,
  generateSlug: false,
  _status: 'published' as const,
  featured: true,
  displayOrder,
  company_logo: logoId,

  layout: [
    {
      blockType: 'csPreview' as const,
      case_study_preview_title: 'Metal Racks, Stands, and Powder Coating',
      case_study_preview_text: rt(
        p(
          'IVIKOM designs and produces metal products, including racks, advertising stands, cabinets, containers, and powder coating. The published work was a Drupal site, product-focused content, and SEO. No traffic figure is given.',
        ),
      ),
      case_study_preview_image: previewImageId,
    },

    titleBlock('Client Overview'),
    contentBlock(
      p(
        'IVIKOM is a specialized manufacturer of metal products for practical use: metal racks, advertising stands, cabinets, containers, and powder coating. The case presents design and production, not a trading catalog of goods made elsewhere.',
        'A website capture included with the source adds a dated picture of that range. A company note of 21 August 2006 says OOO Ivikom had been making metal products for 11 years, for warehouses, offices, and shops, and that it had its own production space and offices. That sentence is not updated into a current headcount, a floor area, or a founding year.',
        'The engagement brief describes an approximately two-year collaboration. The published paragraph does not give a start date or an end date, so that length is not shown as a closed term.',
      ),
    ),

    titleBlock('The Catalog Problem'),
    contentBlock(
      p(
        'The offer is several buyer questions at once. A rack, an advertising stand, a cabinet, a container, and a powder-coating job are not the same inquiry.',
        'The work was to put that range on a Drupal site with a semantic core and mapping, and to write the pages in the language of metal products and powder coating, so a visitor and a search engine could tell the lines apart.',
      ),
    ),

    titleBlock('Manufacturing Portfolio'),
    contentBlock(
      p(
        'Named in the case paragraph: metal racks, advertising stands, cabinets, containers, and powder coating services, inside a practice of designing and producing metal products.',
        'Shown on the website capture, and not itemized in that paragraph: shelving as its own section, tire racks in the gallery, and copy that the racks can be taken apart and moved. The capture’s company note places the products in warehouses, offices, and shops.',
        'No load capacity, dimension, steel grade, or coating standard is published. Advertising stands, cabinets, and containers stay at the level the paragraph gives them.',
      ),
    ),

    titleBlock('Website and UX'),
    contentBlock(
      p(
        'Neolines developed the website on Drupal and designed the UX/UI for ease of use. That is the platform claim. A theme, a module list, and a set of screens are not included.',
        'The capture’s visible menu is About, Metal products, Shelving, Powder coating, Our work, Feedback, and Contacts. Because the capture carries a 2006 date and the case does not identify it as the delivered Drupal site, that menu is evidence of the range the company presented online. It is not reconstructed here as the engagement sitemap.',
      ),
    ),

    titleBlock('Semantic Research'),
    contentBlock(
      p(
        'During development, keyword and competitor analysis was used to build a semantic core and a mapping aimed at the audience. The source does not publish the phrases, the volumes, or the competitors.',
        'The copy was weighted toward metal-product manufacturing and powder coating. Queries named in the MIKS section of the same source page are not part of this case.',
      ),
    ),

    titleBlock('What Was Not in the Technical List'),
    contentBlock(
      p(
        'The IVIKOM paragraph does not mention page-load work, a mobile audit, or structured data. Those items appear in the MIKS section and are not copied here. No schema type is claimed.',
      ),
    ),

    titleBlock('What the Source Says Happened'),
    contentBlock(
      p(
        'The source says the content strategy increased visibility, supported promotion in search engines, increased traffic, and improved search results for target queries.',
        'It does not say by how much, over what dates, from what baseline, or to what ranking. No keyword count, lead total, or revenue figure is given. The MIKS percentages on the same page are a different case. This record does not repeat them.',
      ),
    ),

    titleBlock('Conclusion'),
    contentBlock(
      p(
        'The documented work is a Drupal site and an organic-search content program for a metal-products manufacturer whose named lines are racks, advertising stands, cabinets, containers, and powder coating.',
        'The approximately two-year length comes from the engagement brief. The paragraph itself is undated. Company size, a named certificate, and a measured traffic result are not claimed.',
      ),
    ),

    contentBlock(
      p(
        'The photographs of racks, tire storage, display stands, a cabinet and container, and a powder-coating booth are illustrative. They are not verified IVIKOM products or photographs of the plant. The last gallery image is the website capture from the source page.',
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
        'Design and production of metal products, including powder coating as a named service. The 21 August 2006 note on the captured site says the firm had its own production space and offices and that output met safety norms. The norm is not named. Floor area, equipment, and headcount are not given.',
      ),
    ),
    products: rt(
      p(
        'Metal racks, advertising stands, cabinets, containers, and powder coating. The capture also shows shelving and tire racks, and says the racks can be disassembled and moved. Dimensions and load ratings are not published.',
      ),
    ),
    materials: rt(
      p(
        'The products are identified as metal. Powder coating is the named finish. Grades, thicknesses, and color standards are not given.',
      ),
    ),
    applications: rt(
      p(
        'The 2006 note places the products in warehouses, offices, and shops. Advertising stands imply retail display. Named end customers are not published.',
      ),
    ),
  },

  businessChallenge: {
    initialState: rt(
      p(
        'IVIKOM already designed and produced several kinds of metal goods: racks, advertising stands, cabinets, containers, and powder-coated work. The lines answer different buyers.',
      ),
    ),
    challenge: rt(
      p(
        'A single metal-products page would hide the line a buyer came for. Search needed pages that matched racks, display equipment, storage products, and powder coating as related but distinct offers.',
      ),
    ),
    goals: rt(
      p(
        'Build the Drupal site, design it for ease of use, form a semantic core and mapping from keyword and competitor research, and write for metal-product manufacturing and powder coating. A budget and a team size are not stated.',
      ),
    ),
  },

  nicheSegmentation: [
    {
      name: 'Metal racks and shelving',
      description: rt(
        p(
          'Metal racks are named in the case text. The capture treats shelving as its own section and pictures tire racks. The racks are described there as able to be taken apart and moved. No sizes are given.',
        ),
      ),
      marketingApproach: rt(
        p('The mapping was meant to give this line its own relevance. The actual queries are not published.'),
      ),
    },
    {
      name: 'Advertising stands',
      description: rt(
        p(
          'Advertising stands are named in the case paragraph. The visible capture is a shelving page, so the stands are not pictured there.',
        ),
      ),
      marketingApproach: rt(
        p('They stay a separate product from racks, because a display-stand buyer is not shopping for storage.'),
      ),
    },
    {
      name: 'Cabinets and containers',
      description: rt(
        p('Metal cabinets and metal containers are named together with the racks and stands. No model range is itemized.'),
      ),
      marketingApproach: rt(p('They are storage products, written apart from powder coating as a service.')),
    },
    {
      name: 'Powder coating',
      description: rt(
        p(
          'Powder coating is a named service, and it is a menu item on the capture. The copy for the engagement emphasized this subject along with metal-product manufacturing.',
        ),
      ),
      marketingApproach: rt(
        p('It is treated as a service page subject, not as a color specification. No standard is named.'),
      ),
    },
  ],

  digitalEcosystem: rt(
    p(
      'The confirmed digital work is one Drupal website: UX/UI, keyword and competitor research, a semantic core and mapping, and SEO-oriented copy. No second site, no paid campaign, and no analytics property is named.',
    ),
  ),
  websiteArchitecture: rt(
    p(
      'Drupal is the named platform. The information architecture is described as a semantic mapping, not as a published sitemap.',
      'The capture shows About, Metal products, Shelving, Powder coating, Our work, Feedback, and Contacts. That menu is not asserted to be the delivered Drupal tree.',
    ),
  ),
  semanticArchitecture: rt(
    p(
      'Keyword and competitor analysis produced a semantic core and a mapping for the audience. The copy focus was metal-product manufacturing and powder coating.',
      'No example query is printed for IVIKOM. The core’s size is not published.',
    ),
  ),

  marketingStrategy: {
    seoAndContentStrategy: rt(
      p(
        'An integrated copy program, not a visual refresh alone and not an advertising campaign. Pages were to carry the terminology of the product line, with extra weight on metal products and powder coating.',
        'The source calls the result a content marketing strategy that supported search promotion. It does not describe a publishing calendar.',
      ),
    ),
    leadGenMechanism: rt(
      p(
        'The capture has a Feedback item. The case text does not describe a form, a CRM, or a lead count.',
      ),
    ),
    paidAdvertising: [],
    socialMedia: [],
  },

  aiSearchOptimization: {
    brandAuthorityAndTrust: rt(
      p(
        'This record is a Drupal build and an organic content program. It is not an AI-search program.',
        'No answer-engine result is claimed. The 2006 note mentions safety norms and does not name a certificate.',
      ),
    ),
    entityAndGeoStructure: rt(
      p(
        'Racks, advertising stands, cabinets, containers, and powder coating are different offers, which is why the mapping matters. No city, region, or measured local-search result is published.',
      ),
    ),
  },

  implementationProcess: rt(
    p(
      'Confirmed shape of the work: design and build the site on Drupal, with UX/UI aimed at ease of use; run keyword and competitor analysis; form a semantic core and mapping; write for metal products and powder coating.',
      'The engagement brief places this in approximately two years. Dates inside that window are not listed.',
    ),
  ),

  timeline: [
    {
      period: 'Phase 1',
      title: 'Drupal site and interface',
      description: rt(
        p(
          'Website development on Drupal and UX/UI design for ease of use. Screens and modules are not listed.',
        ),
      ),
    },
    {
      period: 'Phase 2',
      title: 'Research and mapping',
      description: rt(
        p(
          'Keyword and competitor analysis, then a semantic core and a mapping. Phrases and competitor names are not published.',
        ),
      ),
    },
    {
      period: 'Phase 3',
      title: 'Product and powder-coating copy',
      description: rt(
        p(
          'Copy weighted toward metal-product manufacturing and powder coating, as the SEO work the source describes. No traffic figure is attached to this phase.',
        ),
      ),
    },
  ],

  resultsSummary: rt(
    p(
      'The documented outcome is a Drupal site whose content was organized around a semantic core, with copy for metal products and powder coating, over an approximately two-year collaboration that the paragraph itself does not date.',
      'The source says visibility, traffic, and search results for target queries improved. It publishes no percentage, no keyword count, no ranking, no leads, and no revenue. Those sentences are not restated here as a measurement. The figures on the MIKS section of the same page are not used.',
    ),
  ),

  metrics: [],
  projectsShowcase: [],

  expertInsight: rt(
    p(
      'The useful fact is a shop that designs and makes several metal lines, including a finishing service, and needed the website to say so. The source asserts that search visibility moved and does not show the instrument reading. Leaving the metrics empty is the accurate report.',
    ),
  ),

  clientTestimonial: { quote: null, author: null, position: null, company: null },

  hero: {
    type: 'mediumImpact' as const,
    richText: rtHero(
      p(
        'Website development and SEO for IVIKOM, a manufacturer of metal racks, advertising stands, cabinets, containers, and powder-coated metal products.',
      ),
    ),
    media: mainImageId,
  },

  primary_case_study_category: primaryCategoryId,
  case_study_categories: categoryIds,
  site_categories: siteCategoryIds,

  meta: {
    title: 'IVIKOM Case Study: Website and SEO for a Metal Products Manufacturer',
    description:
      'See how Drupal development, product-focused content, keyword research, and SEO supported IVIKOM, a manufacturer of racks, stands, cabinets, containers, and powder coating.',
    image: previewImageId,
  },
})

const normalizeTitle = (value: unknown) => String(value ?? '').replace(/&amp;/g, '&').trim()

const resolveCategories = async (payload: Awaited<ReturnType<typeof getPayload>>) => {
  const ids: number[] = []
  const foundTitles = new Map<string, number>()
  const add = (id: number) => {
    if (!ids.includes(id)) ids.push(id)
  }

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
    add(Number(doc.id))
    foundTitles.set(normalizeTitle(doc.title), Number(doc.id))
  }

  const primaryTitle = PRIMARY_PREFERENCE.find((title) => foundTitles.has(title))
  const primary = primaryTitle ? foundTitles.get(primaryTitle) : undefined
  if (!primary) throw new Error('No primary manufacturing category was found')
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
    const slug = doc?.slug
    if (!slug) continue
    const site = await payload.find({
      collection: 'site-categories',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    const match = site.docs[0]
    if (!match) {
      payload.logger.warn(`no site category for slug ${slug}`)
      continue
    }
    siteIds.push(Number(match.id))
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
  const nextOrder = Number(newest.docs[0]?.displayOrder ?? 22) + 1

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
      or: [
        { slug: { equals: SLUG } },
        { slug: { like: 'ivikom' } },
        { title: { like: 'IVIKOM' } },
      ],
    },
    limit: 5,
    depth: 0,
    overrideAccess: true,
  })

  if (duplicates.docs.some((doc) => String(doc.slug).includes('miks') || String(doc.title).includes('MIKS'))) {
    throw new Error('IVIKOM lookup matched the MIKS case. Aborting.')
  }

  if (duplicates.docs.length > 1) {
    throw new Error(
      `More than one IVIKOM case study found: ${duplicates.docs.map((doc) => `${doc.id} ${doc.slug}`).join(', ')}`,
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
    const preserved = {
      ...data,
      slug: existing.slug,
      displayOrder: existing.displayOrder ?? data.displayOrder,
      featured: existing.featured ?? data.featured,
    }
    const updated = await payload.update({
      collection: 'case-studies',
      id: existing.id,
      data: preserved as never,
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
  const miksDoc = miks.docs[0]
  payload.logger.info(
    `MIKS left in place: ${miksDoc ? `${miksDoc.id} ${miksDoc.slug} ${getCaseStudyUrl(miksDoc)}` : 'not found'}`,
  )

  process.exit(0)
}

void main().catch((error) => {
  console.error(error)
  process.exit(1)
})
