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
 * Creates the Siblux case study, or updates the existing record if one is found.
 * Two businesses: glued-laminated timber houses, and premium wooden windows.
 * Duration is not set. The source dates a redesign about two years after the first design.
 * Keyword visibility is a count of additional keywords, not a top-five total.
 * Top-five keyword performance +40% is left as the source labeled it.
 * PPC platform is unnamed. Gallery images are illustrative. No site_categories.
 */
const SLUG = 'siblux-timber-houses-wooden-windows'
const IMAGE_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'assets')

const EXPERT = 'Maryan Polyak'
const EXPERT_ROLE = 'Manufacturing Digital Marketing & Web Development Expert'

const SOURCE_NOTE =
  'Published on the source case study. Not independently re-audited. No baseline date or attribution model is stated.'

const EXPECTED_CATEGORY_IDS: Array<[number, string]> = [
  [196, 'Manufacturing SEO'],
  [197, 'Application SEO'],
  [218, 'Product SEO'],
  [200, 'Competitor SEO Analysis'],
  [210, 'Manufacturing Keyword Research'],
  [239, 'Manufacturing Website Development'],
  [226, 'Manufacturing Website Design & Development'],
  [237, 'Industrial Website Development'],
  [235, 'Industrial Website Architecture'],
  [238, 'Manufacturing Website Design'],
  [311, 'Technical Content Marketing'],
  [274, 'Paid Search & Paid Media'],
  [421, 'Building Materials'],
  [417, 'Building Products & Materials'],
  [426, 'Construction Products'],
  [425, 'Construction Materials Manufacturing'],
  [669, 'Manufacturing'],
  [484, 'Design, Manufacturing & Installation'],
]

const EXTRA_CATEGORY_TITLES = [
  'Timber Construction',
  'Wood Manufacturing & Timber Construction',
  'Glulam House Manufacturing',
  'Timber House Manufacturing',
  'Timber Manufacturing',
  'Prefabricated Wooden Houses',
  'Wood Manufacturing',
  'Doors & Windows',
  'Custom Wood Products',
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

const sourceMetric = (value: string, label: string, detail: string) => ({
  value,
  label,
  description: rt(p(`${detail} ${SOURCE_NOTE}`)),
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
  filename: 'siblux-preview-house.jpg',
  alt: 'Close view of a timber-house facade with divided wooden window frames and horizontal wood siding.',
  caption:
    'Illustrative timber-house facade and wooden windows. Not a verified photograph of a Siblux building.',
}

const MAIN_IMAGE: ImageSpec = {
  filename: 'siblux-timber-house.jpg',
  alt: 'A two-story glued-laminated timber house with a glazed gable, set among tall conifers.',
  caption:
    'Illustrative glued-laminated timber house. Not a documented Siblux project photograph.',
}

const GALLERY_IMAGES: ImageSpec[] = [
  {
    filename: 'siblux-glulam-production.jpg',
    alt: 'Long laminated timber beams stacked on supports inside a bright production hall.',
    caption:
      'Illustrative glued-laminated timber production. Not a photograph of the Siblux factory.',
  },
  {
    filename: 'siblux-wooden-window.jpg',
    alt: 'A close view of a two-sash wooden window with a thick timber frame and insulated glass.',
    caption:
      'Illustrative premium wooden window. Not a verified Siblux product photograph.',
  },
  {
    filename: 'siblux-window-installation.jpg',
    alt: 'Wooden window frames set into the facade of a multi-story brick and timber office building.',
    caption:
      'Illustrative wooden-window installation on a larger building. Not a documented Siblux contract, and not a claim that every installation was an office.',
  },
]

const LOGO_IMAGE: ImageSpec = {
  filename: 'siblux-logo-en.png',
  alt: 'Siblux logo: a brown arch monogram above the name SIBLUX.',
  caption:
    'English adaptation of the source mark. The brown arch and the geometric panes are kept. The Cyrillic name СИБЛЮКС was replaced with SIBLUX.',
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
    date: '2026-12-01',
    depth: 0,
    body: p(
      'Why treat glued-laminated timber houses and premium wooden windows as separate destinations when they belong to one company?',
    ),
  },
  expert(
    '2026-12-01',
    p(
      'They are connected commercially and different as products. A timber house is a full cycle: design, production, and construction. A wooden window is a manufactured unit, with insulated glazing, and installation that is not limited to houses.',
      'One shared label would send a house enquiry and a window enquiry to the same page. The published structure kept those paths apart.',
    ),
    1,
  ),
  {
    author: 'Elena Petrova',
    role: 'In-house manufacturing marketer',
    date: '2026-12-02',
    depth: 2,
    body: p(
      'Projects, completed buildings, exhibitions, and the blog are also in the source. Do they sit inside the product menu?',
    ),
  },
  expert(
    '2026-12-02',
    p(
      'No. Projects and properties are examples of completed work. Exhibitions, company advantages, galleries, the blog, and contact are company information. They need to be reachable without being filed as a product.',
    ),
    3,
  ),
  {
    author: 'Thomas Weber',
    role: 'Web information architect',
    date: '2026-12-02',
    depth: 2,
    body: p(
      'Was every window installation a house, or were they office buildings?',
    ),
  },
  expert(
    '2026-12-02',
    p(
      'Neither claim is safe. The source covers wooden windows and installation, including work on larger buildings. It does not say every installation was residential, and it does not say every one was an office.',
    ),
    3,
  ),
  {
    author: 'Sophie Laurent',
    role: 'Search analyst',
    date: '2026-12-03',
    depth: 0,
    body: p(
      'Can the write-up say Siblux gained 800 top-five keywords, and that top-five performance means 40 percent more keywords?',
    ),
  },
  expert(
    '2026-12-03',
    p(
      'No. The 800 figure is a count of additional keywords whose positions in Google improved. It is not a percentage, and it is not a count of top-five rankings.',
      'The separate +40 percent is labeled top-five keyword performance. The source does not say whether that change is position, clicks, impressions, or another measure. It is not a 40 percent increase in the number of keywords.',
    ),
    1,
  ),
  {
    author: 'James Whitaker',
    role: 'Performance analyst',
    date: '2026-12-04',
    depth: 2,
    body: p(
      'The source says more than 800. Should the card round that to a share of the market?',
    ),
  },
  expert(
    '2026-12-04',
    p(
      'No. It stays a count of keywords with improved Google positions. There is no ranking-share calculation, and there is no claim that those 800 keywords all sit in the top five.',
    ),
    3,
  ),
  {
    author: 'Anna Kovacs',
    role: 'Analytics lead',
    date: '2026-12-05',
    depth: 0,
    body: p(
      'Organic traffic is +50 percent and organic sessions are +25 percent. Is that the same result written twice?',
    ),
  },
  expert(
    '2026-12-05',
    p(
      'No. The source prints them as separate rows, next to total sessions at +30 percent. I will not collapse them into one number, and I will not read any of them as revenue.',
    ),
    1,
  ),
  {
    author: 'Clara Jensen',
    role: 'Web developer',
    date: '2026-12-06',
    depth: 0,
    body: p(
      'Drupal, HTML, CSS, and PHP are named. Is that this website, and was the work three years long?',
    ),
  },
  expert(
    '2026-12-06',
    p(
      'Drupal with HTML, CSS, and PHP is the historic implementation. This Next.js and Payload page is the case record, not that site.',
      'The source says the first design was followed by a redesign about two years later, and it describes that build as functional and responsive. A three-year collaboration length is not on the record I am using, so I am not publishing one.',
    ),
    1,
  ),
  {
    author: 'Lukas Schneider',
    role: 'UX reviewer',
    date: '2026-12-07',
    depth: 2,
    body: p(
      'If the source calls the old site responsive, do we treat that as a new audit?',
    ),
  },
  expert(
    '2026-12-07',
    p(
      'No. Responsiveness there is the source’s description of the historic Drupal build. It is not a test of this page.',
    ),
    3,
  ),
  {
    author: 'Priya Shah',
    role: 'Paid media specialist',
    date: '2026-12-08',
    depth: 0,
    body: p(
      'PPC conversions are up 90 percent and average CPC is down 10 percent. Which network, and what was the return?',
    ),
  },
  expert(
    '2026-12-08',
    p(
      'The network is not named, so the channel stays unspecified. The published PPC changes are clicks +40 percent, conversions +90 percent, average CPC down 10 percent, cost per conversion down 25 percent, click-through rate +120 percent, and conversion rate +80 percent.',
      'Budgets, lead counts, revenue, and return on ad spend are not in the source.',
    ),
    1,
  ),
  {
    author: 'David Okonkwo',
    role: 'B2B demand generation',
    date: '2026-12-09',
    depth: 2,
    body: p(
      'Can the click and conversion changes stand in for sales?',
    ),
  },
  expert(
    '2026-12-09',
    p(
      'No. They describe the reported advertising measures: more clicks, a higher click-through rate, a higher conversion rate, and a lower cost per click and per conversion. They do not prove revenue.',
    ),
    3,
  ),
  {
    author: 'Ingrid Berg',
    role: 'Art director',
    date: '2026-12-10',
    depth: 0,
    body: p(
      'The house, the beam hall, and the larger facade look specific. Are they Siblux jobs?',
    ),
  },
  expert(
    '2026-12-10',
    p(
      'No. The logo is the authentic mark. The house, the production hall, the window, and the larger-building installation are illustrative, and the captions say so. They are not verified Siblux projects.',
    ),
    1,
  ),
  {
    author: 'Marco Rossi',
    role: 'Content strategist',
    date: '2026-12-11',
    depth: 0,
    body: p(
      'Exhibitions are in the company description, and some source answers name standards and a service life. What stays in the case?',
    ),
  },
  expert(
    '2026-12-11',
    p(
      'Exhibitions, and showrooms in major cities, stay, without a city or a country. Standards, a numbered service life, and a build duration from those answers do not. Awards are mentioned in the overview without the documents being named, so no certificate is invented.',
    ),
    1,
  ),
  {
    author: 'Noah Adler',
    role: 'Search editor',
    date: '2026-12-12',
    depth: 0,
    body: p(
      'Has any of this been measured in AI search?',
    ),
  },
  expert(
    '2026-12-12',
    p(
      'Not in this record. Separate pages for timber houses and wooden windows, with copy mapped to those intents, are useful groundwork. They are not a ChatGPT, Perplexity, or AI Overview result.',
      'This discussion is editorial. It is not a conversation with Siblux.',
    ),
    1,
  ),
]

const faqBlock = () => ({
  blockType: 'csFAQ' as const,
  case_study_faq_title: 'Frequently Asked Questions About Siblux',
  items: [
    {
      question: 'What does Siblux manufacture?',
      answer: rt(
        p(
          'Two connected lines. The first is design, production, and construction of glued-laminated timber houses, including the full project cycle. The second is design and manufacture of premium wooden windows and insulated glazing units, including installation.',
          'Window installation is not described as residential only. The source includes work on larger buildings. It does not say every installation was an office, or that the two lines were the same business.',
        ),
      ),
    },
    {
      question: 'How were timber houses and wooden windows represented in the website structure?',
      answer: rt(
        p(
          'Product information was separated from examples and from company information. House-related areas covered timber houses, glued-laminated timber houses, and glued-laminated timber. Window-related areas covered wooden window design, double-glazed units, manufacturing, and installation.',
          'Projects, properties and completed buildings, exhibitions, a blog, contact, company advantages, and galleries sat outside those product paths so a visitor was not asked to treat a project gallery as a product page.',
        ),
      ),
    },
    {
      question: 'What role did SEO content play?',
      answer: rt(
        p(
          'Copy was written for individual sections from the semantic research and from that structure, so search intent, the page, and the relevant terms pointed at the same destination.',
          'That included benefits of glued-laminated timber, wooden window design and manufacturing, and supporting copy for both business lines. The work does not add ranking positions beyond the figures in Results.',
        ),
      ),
    },
    {
      question: 'How did SEO and PPC complement each other?',
      answer: rt(
        p(
          'Organic pages carried the two product lines, the projects, and the company information. Paid search was aimed at the same timber-house and wooden-window demand, with the reported changes in clicks, conversion, cost per click, and click-through rate kept separate from the organic rows.',
          'The advertising platform, budgets, lead counts, and revenue are not named.',
        ),
      ),
    },
    {
      question: 'How should the 800-keyword figure and the top-five result be read?',
      answer: rt(
        p(
          'The source reports an increase of more than 800 keywords with improved positions in Google. That is a count of keywords. It is not a percentage, and it is not 800 top-five rankings.',
          'Top-five keyword performance is a separate +40 percent. The source does not define whether that change is position, clicks, or another measure, so it is not described as 40 percent more keywords.',
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
    `<h2>${escapeHtml('Discuss a similar two-line manufacturing site')}</h2>` +
      p(
        'If the company builds complete timber projects and also manufactures a distinct product such as windows, the site has to keep those paths separate before SEO or paid search can be read clearly.',
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
  case_study_gallery_title: 'Timber Houses, Glulam Production, and Wooden Windows',
  case_study_gallery_images: imageIds,
})

const buildData = (
  previewImageId: number,
  mainImageId: number,
  galleryIds: number[],
  logoId: number,
  primaryCategoryId: number,
  categoryIds: number[],
) => ({
  title: 'Siblux: SEO and PPC for Timber Houses and Premium Wooden Windows',
  case_study_long_title: 'Growing Organic Visibility for a Timber House and Window Manufacturer',
  slug: SLUG,
  generateSlug: false,
  _status: 'published' as const,
  featured: true,
  displayOrder: 19,
  duration: null,
  company_logo: logoId,

  layout: [
    {
      blockType: 'csPreview' as const,
      case_study_preview_title: 'Timber Houses and Premium Wooden Windows',
      case_study_preview_text: rt(
        p(
          'Siblux designs, produces, and builds glued-laminated timber houses, and it also designs and manufactures premium wooden windows and insulated glazing, including installation on larger buildings. The published work gave those two lines a clearer website structure, section-level SEO content, a later redesign, and paid search beside organic visibility.',
        ),
      ),
      case_study_preview_image: previewImageId,
    },

    titleBlock('Client Overview'),
    contentBlock(
      p(
        'Siblux is a manufacturer and construction company with two connected lines of work. One is the design, production, and construction of glued-laminated timber houses, taken through the project cycle. The other is the design and manufacture of premium wooden windows and insulated glazing units, including installation.',
        'Those lines are not the same offer. A house project and a window system answer different questions, and window installation is not described as residential only. The company also took part in exhibitions and operated showrooms in major cities. Awards and certifications are mentioned in the source overview without the documents being named, so none are listed here. A collaboration length is not stated on this record, so none is published. The source does say the first website design was followed by a redesign about two years later.',
      ),
    ),

    titleBlock('Project Challenge'),
    contentBlock(
      p(
        'The practical problem was presentation. Complete timber-house projects and premium wooden window systems are technically different, and the site had to make that difference obvious.',
        'Visitors also needed a logical way through products, projects, properties, exhibitions, and the rest of the company information. This case does not add competitor findings, unnamed business problems, or client quotations that are not in the source.',
      ),
    ),

    titleBlock('Website Structure and Information Architecture'),
    contentBlock(
      p(
        'The structure grouped the company’s own products and services first, then kept examples and company information beside them rather than inside them.',
        'On the house side, the published areas covered timber houses, glued-laminated timber houses, and glued-laminated timber as a material. On the window side, they covered wooden window design, double-glazed window units, window manufacturing, installation, materials, and hardware. A person looking for a house did not have to pass through a window page to get there, and the reverse was also true.',
        'Projects, properties and completed buildings, exhibitions, a blog, contact, company advantages, and galleries were supporting destinations. That split is what made the navigation more logical: a product page explains what is made, a project or property page shows completed work, and the remaining pages explain the company. Exact historic URLs are not reconstructed.',
      ),
    ),

    titleBlock('SEO Content Development'),
    contentBlock(
      p(
        'SEO copy was written for the individual sections, using the semantic keyword research and the information architecture as the map. The aim was alignment: the intent of the query, the job of the page, and the terms on that page had to agree.',
        'House content explained the benefits of glued-laminated timber and the house project itself. Window content explained wooden window design and manufacturing, including insulated glazing. Supporting pages carried both business directions without folding them into one generic article. No ranking position is added here beyond the figures in Results.',
      ),
    ),

    titleBlock('Website Design and Redesign'),
    contentBlock(
      p(
        'The site first received a design shaped around the business and that content structure. About two years later, a redesign was carried out to improve usability and the visual presentation.',
        'The historic site used Drupal, HTML, CSS, and PHP. That is the implementation stack of the project being described. It is not a claim about the company’s current stack, and it is not this Next.js and Payload site. The source describes that Drupal build as functional and responsive. This case study does not add a separate responsive audit.',
      ),
    ),

    titleBlock('SEO and PPC Strategy'),
    contentBlock(
      p(
        'Organic search and paid search were used together for both lines: timber houses, and premium wooden windows. SEO carried the structure and the section content. Paid search was aimed at the same demand, so a query could meet either an organic page or an ad without the two programmes describing different companies.',
        'The useful reading is search visibility, relevant traffic, advertising efficiency, and conversion performance. The platform is not named. Campaign budgets, lead counts, revenue, and return on ad spend are not in the source, so they are not estimated.',
      ),
    ),

    titleBlock('Results'),
    contentBlock(
      p(
        'The figures below are the published source results. They are not a new analytics audit. Organic traffic and organic sessions are separate rows. The keyword figure is a count of additional keywords with improved Google positions, not a percentage and not a count of top-five rankings. Top-five keyword performance is a separate +40 percent, and the source does not say whether that change is position, clicks, or another measure.',
      ) +
        ul([
          'Organic traffic: +50%',
          'Organic sessions: +25%',
          'Total sessions: +30%',
          'Keyword visibility: more than 800 additional keywords with improved Google search positions',
          'Top-five keyword performance: +40%',
          'Impressions: +15%',
          'Clicks: +12%',
          'New users: +60%',
          'Returning visits: +30%',
          'PPC clicks: +40%',
          'PPC conversions: +90%',
          'PPC average cost per click: -10%',
          'PPC cost per conversion: -25%',
          'PPC click-through rate: +120%',
          'PPC conversion rate: +80%',
        ]) +
        p(
          'None of these percentages is converted into an absolute total. Traffic growth is not treated as revenue growth. Measurement dates, the attribution method, advertising budgets, lead counts, and revenue are not stated.',
        ),
    ),

    titleBlock('Conclusion'),
    contentBlock(
      p(
        'Structured website content, SEO, a redesign about two years after the first design, and PPC together strengthened Siblux’s search visibility and brought a broader audience to two different offers: glued-laminated timber houses, and premium wooden windows.',
        'That is as far as the source goes. Market leadership, a guaranteed result, and revenue growth are not claimed.',
      ),
    ),

    contentBlock(
      p(
        'Illustrative views of a timber house, glued-laminated timber production, a wooden window, and window installation on a larger building. These are not verified photographs of Siblux projects. The logo above the overview is the authentic mark.',
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
        'Siblux is documented as a manufacturer and builder: design, production, and construction of glued-laminated timber houses, and design and manufacture of premium wooden windows and insulated glazing units, including installation.',
      ),
    ),
    products: rt(
      p(
        'Glued-laminated timber houses, glued-laminated timber, premium wooden windows, and double-glazed window units. The two lines are related and not interchangeable.',
      ),
    ),
    materials: rt(
      p(
        'Glued-laminated timber for the houses, and wood with insulated glazing for the windows. Grades, adhesives, and glass specifications are not disclosed.',
      ),
    ),
    applications: rt(
      p(
        'Complete timber-house projects, and wooden windows including installation on larger buildings. Not every window installation is described as a house, and not every one is described as an office.',
      ),
    ),
  },

  businessChallenge: {
    initialState: rt(
      p(
        'Siblux already worked in timber-house design, production, and construction, and in premium wooden windows. The site had to present both.',
      ),
    ),
    challenge: rt(
      p(
        'The two lines are technically different. House projects, window systems, completed buildings, exhibitions, and company information needed a structure a visitor could follow.',
      ),
    ),
    goals: rt(
      ul([
        'Keep timber houses and wooden windows as separate, linked destinations',
        'Place projects, properties, exhibitions, and company pages outside the product paths',
        'Write section content from the semantic research and that structure',
        'Use PPC beside SEO without inventing a platform, a budget, or revenue',
      ]),
    ),
  },

  nicheSegmentation: [
    {
      name: 'Glued-laminated timber houses',
      description: rt(
        p(
          'Design, production, and construction of timber houses, including the material itself: timber houses, glued-laminated timber houses, and glued-laminated timber.',
        ),
      ),
      marketingApproach: rt(
        p('A house query lands on the house path, not on a window product page.'),
      ),
    },
    {
      name: 'Premium wooden windows',
      description: rt(
        p(
          'Wooden window design, double-glazed units, manufacturing, materials, hardware, and installation, including larger buildings.',
        ),
      ),
      marketingApproach: rt(
        p('Window intent stays on the window path. Installation is not rewritten as residential only.'),
      ),
    },
    {
      name: 'Projects and completed buildings',
      description: rt(
        p('Projects, properties, and completed buildings as examples, separate from the product explanation.'),
      ),
      marketingApproach: rt(
        p('A gallery or a finished building supports the product page. It does not replace it.'),
      ),
    },
    {
      name: 'Exhibitions and company information',
      description: rt(
        p('Exhibitions, company advantages, galleries, a blog, and contact.'),
      ),
      marketingApproach: rt(
        p('Company information stays findable without being filed as a product category.'),
      ),
    },
  ],

  digitalEcosystem: rt(
    p(
      'The confirmed digital work is a historic Drupal site, SEO content mapped to its structure, a redesign about two years after the first design, and PPC beside organic search.',
      'The advertising platform, CRM, and current technology stack are not named. Drupal, HTML, CSS, and PHP describe the historic site only.',
    ),
  ),
  websiteArchitecture: rt(
    p(
      'Published areas: timber houses, glued-laminated timber houses, glued-laminated timber, wooden window design, double-glazed units, window manufacturing and installation, projects, properties and completed buildings, exhibitions, a blog, contact, company advantages, and galleries.',
      'Product pages, project examples, and company pages were separated. Exact historic URLs are not reconstructed.',
    ),
  ),
  semanticArchitecture: rt(
    p(
      'Semantic research was mapped onto those sections so intent, page structure, and keywords agreed. Examples named in the source include glued-laminated timber house construction, elite wooden windows, and double-glazed window manufacturing.',
      'The visibility result is an increase of more than 800 keywords with improved Google positions. That is a count. It is not 800 top-five rankings. Top-five keyword performance of +40 percent is a separate, undefined measure.',
    ),
  ),

  marketingStrategy: {
    seoAndContentStrategy: rt(
      p(
        'Unique copy for individual sections, aligned to the information architecture: benefits of glued-laminated timber, wooden window design and manufacturing, and content for both business directions.',
        'No ranking table is added beyond the source figures.',
      ),
    ),
    leadGenMechanism: rt(
      p(
        'Organic pages and paid search were meant to match a timber-house query or a wooden-window query, then give a route to contact. Lead volume is not published.',
      ),
    ),
    paidAdvertising: [
      {
        channel: 'other' as const,
        strategy: rt(
          p(
            'Paid search complemented SEO for the timber-house business and the wooden-window business.',
            'The platform is not named on the Siblux source.',
          ),
        ),
        campaignStructure: rt(
          p(
            'Campaigns followed the two product lines. Historic ads, campaign counts, and budgets are not reconstructed.',
          ),
        ),
        results: rt(
          p(
            'Source-reported PPC changes, kept separate from the organic rows: clicks +40%, conversions +90%, average CPC -10%, cost per conversion -25%, click-through rate +120%, conversion rate +80%.',
            'These are not a second measurement, and they are not revenue. The platform and the budget are not stated.',
          ),
        ),
      },
    ],
    socialMedia: [],
  },

  aiSearchOptimization: {
    brandAuthorityAndTrust: rt(
      p(
        'This project is website structure, SEO content, a redesign, and PPC for a timber-house and wooden-window manufacturer. It is not rewritten as an AI-search engagement.',
        'No ChatGPT, Perplexity, or AI Overview result is claimed.',
      ),
    ),
    entityAndGeoStructure: rt(
      p(
        'Timber houses and wooden windows are related parts of one company and different entities on the site. That is information architecture, not a measured GEO programme, and no country is assigned.',
      ),
    ),
  },

  implementationProcess: rt(
    p(
      'Confirmed shape of the work: separate the timber-house offer from the wooden-window offer; organize products, projects, properties, exhibitions, and company information; write SEO content for those sections; design the site around that structure; redesign it about two years later; run PPC beside SEO.',
      'The sequence is the method. A collaboration length is not published. The redesign interval of about two years is.',
    ),
  ),

  timeline: [
    {
      period: 'Phase 1',
      title: 'Separate the two businesses',
      description: rt(
        p(
          'Glued-laminated timber houses, including design, production, and construction, beside premium wooden windows and installation.',
        ),
      ),
    },
    {
      period: 'Phase 2',
      title: 'Information architecture and SEO content',
      description: rt(
        p(
          'Section structure and unique copy for houses, timber, windows, projects, properties, exhibitions, and company information.',
        ),
      ),
    },
    {
      period: 'Phase 3',
      title: 'Design, then a later redesign',
      description: rt(
        p(
          'An initial design on the historic Drupal, HTML, CSS, and PHP stack, and a redesign about two years later for usability and presentation.',
        ),
      ),
    },
    {
      period: 'Phase 4',
      title: 'PPC beside ongoing SEO',
      description: rt(
        p(
          'Paid search for both product lines. The platform is unnamed. Results stay the source-reported PPC rows.',
        ),
      ),
    },
  ],

  resultsSummary: rt(
    p(
      'The documented outcome is a clearer structure for a company that builds glued-laminated timber houses and manufactures premium wooden windows, plus SEO content, a redesign about two years after the first design, and PPC beside organic search.',
      'The figures on this page are source-reported. The additional-keyword result is a count of improved Google positions, not a top-five total. Top-five keyword performance of +40% is not read as more keywords. Traffic is not read as revenue. A collaboration length is not stated.',
    ),
  ),

  metrics: [
    sourceMetric(
      '+50%',
      'Organic traffic',
      'Organic-traffic growth. Listed separately from organic sessions.',
    ),
    sourceMetric(
      '+25%',
      'Organic sessions',
      'Organic-session growth. Not the same source row as organic traffic.',
    ),
    sourceMetric('+30%', 'Total sessions', 'Growth in total sessions.'),
    sourceMetric(
      '800+',
      'Additional keywords in Google rankings',
      'An increase of more than 800 keywords with improved positions in Google. This is a count of keywords, not a percentage, and not 800 top-five rankings.',
    ),
    sourceMetric(
      '+40%',
      'Top-five keyword performance',
      'The source labels this top-five keyword performance. It does not say whether the change is position, clicks, impressions, or another measure. It is not a 40 percent increase in the number of keywords.',
    ),
    sourceMetric('+15%', 'Impressions', 'Search-impression growth.'),
    sourceMetric('+12%', 'SEO clicks', 'Organic click growth, kept separate from PPC clicks.'),
    sourceMetric('+60%', 'New users', 'Growth in new users.'),
    sourceMetric('+30%', 'Returning visits', 'Growth in returning visits. Not the same row as total sessions.'),
    sourceMetric('+40%', 'PPC clicks', 'Paid-search click growth. Not the organic click row.'),
    sourceMetric('+90%', 'PPC conversions', 'Paid-search conversion growth.'),
    sourceMetric('-10%', 'PPC average CPC', 'Reduction in average cost per click.'),
    sourceMetric('-25%', 'PPC cost per conversion', 'Reduction in cost per conversion.'),
    sourceMetric('+120%', 'PPC click-through rate', 'Paid-search CTR growth.'),
    sourceMetric('+80%', 'PPC conversion rate', 'Paid-search conversion-rate growth.'),
  ],

  projectsShowcase: [
    {
      projectName: 'Glued-laminated timber houses',
      description: rt(
        p(
          'Design, production, and construction, with pages for timber houses, glued-laminated timber houses, and the material. Gallery images are illustrative.',
        ),
      ),
    },
    {
      projectName: 'Premium wooden windows',
      description: rt(
        p(
          'Wooden window design, double-glazed units, manufacturing, and installation, including larger buildings. Not limited to houses, and not claimed as offices in every case.',
        ),
      ),
    },
    {
      projectName: 'Projects, properties, and exhibitions',
      description: rt(
        p(
          'Completed buildings, exhibitions, and company information kept outside the product paths. Named sites are not reconstructed.',
        ),
      ),
    },
  ],

  expertInsight: rt(
    p(
      'The useful complexity is a company that builds a timber house through design, production, and construction, and also manufactures a wooden window that may be installed on a larger building. Those are related offers and different pages.',
      'The keyword result stays a count of more than 800 additional keywords with improved Google positions. It is not a top-five total. The +40 percent on top-five keyword performance stays unqualified, because the source does not define the measure. PPC stays unnamed as a platform. Traffic is not revenue.',
      'Where the source is silent — a collaboration length, budgets, lead counts, certificate names, a country — the correct public line is Not disclosed. This discussion is editorial. It is not a conversation with Siblux.',
    ),
  ),

  clientTestimonial: { quote: null, author: null, position: null, company: null },

  hero: {
    type: 'mediumImpact' as const,
    richText: rtHero(
      p(
        'SEO, website structure, a later redesign, and PPC for Siblux — glued-laminated timber houses and premium wooden windows, treated as two lines of business rather than one catalogue.',
      ),
    ),
    media: mainImageId,
  },

  primary_case_study_category: primaryCategoryId,
  case_study_categories: categoryIds,

  meta: {
    title: 'Siblux Case Study: SEO, PPC and Timber House Marketing | Maryan Polyak',
    description:
      'A case study of SEO, PPC, website content strategy, and redesign for Siblux, a manufacturer and builder of glued-laminated timber houses and premium wooden windows.',
    image: previewImageId,
  },
})

const normalizeTitle = (value: unknown) => String(value ?? '').replace(/&amp;/g, '&').trim()

const resolveCategories = async (payload: Awaited<ReturnType<typeof getPayload>>) => {
  const ids: number[] = []
  const seen = new Set<number>()
  const add = (id: number) => {
    if (seen.has(id)) return
    seen.add(id)
    ids.push(id)
  }

  for (const [id, title] of EXPECTED_CATEGORY_IDS) {
    try {
      const doc = await payload.findByID({
        collection: 'case-study-categories',
        id,
        depth: 0,
        overrideAccess: true,
      })
      const actual = normalizeTitle(doc?.title)
      if (actual === title) add(Number(id))
      else payload.logger.warn(`category ${id} is "${actual}", expected "${title}" — skipped`)
    } catch {
      payload.logger.warn(`category ${id} missing — skipped`)
    }
  }

  let primary: number | null = null
  for (const title of EXTRA_CATEGORY_TITLES) {
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
    if (title === 'Timber Construction') primary = Number(doc.id)
  }

  if (!primary) throw new Error('Timber Construction category was not found')
  return { primary, ids }
}

const main = async () => {
  const dry = process.argv.includes('--dry')
  const payload = await getPayload({ config })
  const tree = measureCommentTree(buildCommentTree(DISCUSSION))
  const categories = await resolveCategories(payload)

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
          displayOrder: 19,
          galleryImages: GALLERY_IMAGES.length + 1,
          metrics: 15,
          paidAds: 1,
          primaryCategory: categories.primary,
          categories: categories.ids,
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
        { slug: { like: 'siblux' } },
        { title: { like: 'Siblux' } },
      ],
    },
    limit: 5,
    depth: 0,
    overrideAccess: true,
  })

  if (duplicates.docs.length > 1) {
    throw new Error(
      `More than one Siblux case study found: ${duplicates.docs.map((doc) => `${doc.id} ${doc.slug}`).join(', ')}`,
    )
  }

  const previewImageId = await upsertMedia(payload, PREVIEW_IMAGE)
  const mainImageId = await upsertMedia(payload, MAIN_IMAGE)
  const galleryIds: number[] = [previewImageId]
  for (const image of GALLERY_IMAGES) galleryIds.push(await upsertMedia(payload, image))
  const logoId = await upsertMedia(payload, LOGO_IMAGE)

  const data = buildData(
    previewImageId,
    mainImageId,
    galleryIds,
    logoId,
    categories.primary,
    categories.ids,
  )
  const existing = duplicates.docs[0]

  if (existing) {
    const preserved = {
      ...data,
      slug: existing.slug,
      displayOrder: existing.displayOrder ?? data.displayOrder,
      featured: existing.featured ?? data.featured,
      duration: existing.duration ?? null,
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

  process.exit(0)
}

void main().catch((error) => {
  console.error(error)
  process.exit(1)
})
