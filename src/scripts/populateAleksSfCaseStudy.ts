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
 * Creates or updates the Aleks SF Case Study.
 * Structural reference: Laser Made / Merkan / Ovik / NPK BINAR.
 * Re-runnable: structured fields and layout blocks are replaced, not appended.
 *
 * Aleks SF is the manufacturing and jewelry-store installation business.
 * Neolines provided the website, SEO and paid-search work described here.
 * Duration is the published decade-long partnership, not a verified
 * uninterrupted campaign length. Metrics are source-reported for an
 * eight-year window. Contextual advertising is a documented activity;
 * budgets, platforms and paid results are not disclosed. No site_categories.
 * No invented client quotes, store counts or English logo.
 */
const SLUG = 'aleks-sf-jewelry-retail-equipment'
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
  274, // Paid Search / Paid Media
  278, // Google Ads for Manufacturers
  290, // Manufacturing Search Advertising
  865, // Jewelry Store Equipment
  863, // Custom Retail Equipment
  864, // Custom Store Displays
  867, // Retail Equipment Manufacturing
  861, // Retail Commercial Equipment Manufacturing
  868, // Retail Fixtures
  869, // Store Fixtures
  862, // Commercial Display Equipment
  555, // Custom Furniture Manufacturing
  552, // Furniture Manufacturing
  553, // Commercial Furniture
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

const mimeFromName = (filename: string) => {
  if (filename.endsWith('.png')) return 'image/png'
  if (filename.endsWith('.webp')) return 'image/webp'
  return 'image/jpeg'
}

const PREVIEW_IMAGE: ImageSpec = {
  filename: 'aleks-sf-main.jpg',
  alt: 'Bright jewelry salon with white glass-top counters, island vitrines and a tall display cabinet.',
  caption:
    'Jewelry-store interior with custom display counters and glass showcases. Authentic photograph from the source Aleks SF case study.',
}

const LOGO_IMAGE: ImageSpec = {
  filename: 'aleks-sf-logo-original.jpg',
  alt: 'Aleks SF (АЛЕКС) wordmark for custom retail equipment.',
  caption:
    'Original Aleks SF wordmark used on the source materials. Authentic logo; not an English recreation.',
}

const GALLERY_IMAGES: ImageSpec[] = [
  {
    filename: 'aleks-sf-03.jpeg',
    alt: 'Jewelry boutique with stone columns, glass counters and a central island vitrine.',
    caption:
      'Jewelry boutique with custom counters and an island showcase. Authentic photograph from the source Aleks SF gallery.',
  },
  {
    filename: 'aleks-sf-04.jpeg',
    alt: 'Modern jewelry salon with wall-mounted display cabinets, island vitrines and a long glass counter.',
    caption:
      'Custom wall cabinets, pedestals and a long jewelry counter. Authentic project photograph from the source case study.',
  },
  {
    filename: 'aleks-sf-05.jpeg',
    alt: 'Dark wood island showcases and a glass jewelry counter beside a window wall.',
    caption:
      'Freestanding glass showcases and a jewelry counter. Authentic photograph from the source Aleks SF gallery.',
  },
  {
    filename: 'aleks-sf-06.jpeg',
    alt: 'Mall jewelry kiosk with stone columns, glass counters and tall display cabinets.',
    caption:
      'Jewelry kiosk with custom counters and tall display cabinets. Authentic photograph from the source gallery.',
  },
  {
    filename: 'aleks-sf-07.jpeg',
    alt: 'U-shaped jewelry sales island with a dark counter edge and surrounding glass display cases.',
    caption:
      'Custom U-shaped jewelry counter and surrounding display furniture. Authentic photograph from the source gallery.',
  },
  {
    filename: 'aleks-sf-08.jpeg',
    alt: 'Jewelry salon behind a glass entrance, with corner counters and wall-mounted display furniture.',
    caption:
      'Jewelry salon interior with corner counters and wall displays. Authentic photograph from the source gallery.',
  },
  {
    filename: 'aleks-sf-11.jpeg',
    alt: 'Illuminated curved service counter with a glass riser and the Aleks wordmark on the back wall.',
    caption:
      'Illuminated service counter with Aleks branding visible. Authentic photograph from the source Aleks SF gallery.',
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
      mimetype: mimeFromName(image.filename),
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
 * Editorial discussion — not customer comments or Aleks SF testimonials.
 */
const DISCUSSION: DiscussionEntry[] = [
  {
    author: 'Elena Morozova',
    role: 'Retail-equipment designer',
    date: '2026-10-18',
    depth: 0,
    body: p(
      'Aleks SF designs and builds jewelry-store furniture. What should a B2B website actually show so a buyer believes the factory, not just the salon photographs?',
    ),
  },
  expert(
    '2026-10-18',
    p(
      'The photographs prove the finished room. The site still has to name the work behind the room: design, engineering, production and installation. A jewelry retailer is buying a fitted store, not a stock cabinet from a catalogue.',
      'The source site did that with sections for exclusive design, new designs, retail design, production, materials, lighting, security, store layout and turnkey stores. That is manufacturing knowledge on the page, not a lifestyle gallery with a contact form.',
    ),
    1,
  ),
  {
    author: 'Marcus Hale',
    role: 'In-house manufacturing marketer',
    date: '2026-10-19',
    depth: 2,
    body: p(
      'Should production and installation sit on the same page as the showcases, or do they need their own destinations?',
    ),
  },
  expert(
    '2026-10-19',
    p(
      'Both can exist if the copy is different. A showcase page describes the furniture. A production page describes how it is made. An installation page describes fitting the salon. A turnkey page holds the complete job.',
      'What this record does not support is a reconstructed historic sitemap. The published architecture lists those sections. It does not invent factory capacity or a material specification.',
    ),
    3,
  ),
  {
    author: 'Sophie Laurent',
    role: 'B2B demand generation lead',
    date: '2026-10-20',
    depth: 0,
    body: p(
      'How do jewelry-store buyers actually search for custom retail furniture and complete store-fitting?',
    ),
  },
  expert(
    '2026-10-20',
    p(
      'They do not all search for “retail equipment.” Some look for jewelry showcases, some for display cabinets, some for store fixtures, some for lighting or security of the furniture, and some for a turnkey salon.',
      'That is why the source work started with keyword and competitor analysis and a semantic core of about 1,000 terms. The site had to meet those jobs without collapsing them into one “we make furniture” homepage.',
    ),
    1,
  ),
  {
    author: 'Daniel Okonkwo',
    role: 'Store-fitting procurement manager',
    date: '2026-10-21',
    depth: 2,
    body: p(
      'If I am buying a complete salon, do I still need those product pages?',
    ),
  },
  expert(
    '2026-10-21',
    p(
      'Yes, because the first query is often a piece of furniture or a store problem, not the company name. A turnkey page can close the complete project. It cannot be the only URL for display shelving, exhibition equipment and jewelry counters.',
      'Aleks SF delivered the equipment and the installation. The digital work made that offering findable. It did not replace the factory.',
    ),
    3,
  ),
  {
    author: 'Henrik Dahl',
    role: 'Technical SEO specialist',
    date: '2026-10-22',
    depth: 0,
    body: p(
      'Why does a clear product and service structure matter once you already have a thousand-keyword research set?',
    ),
  },
  expert(
    '2026-10-22',
    p(
      'A keyword list is not a website. The source mapped the semantic core onto About, exclusive and new designs, retail design, production, business organization, turnkey stores, materials, security, lighting, layout, zoning, a gallery, contact, a blog, and specialist pages for exhibition equipment, store fixtures, retail furniture and display shelving.',
      'That structure is the SEO. Without it, a thousand keywords compete for one page. No ranking table for individual terms is published beyond the later eight-year totals.',
    ),
    1,
  ),
  {
    author: 'Anna Kovacs',
    role: 'Technical content lead',
    date: '2026-10-23',
    depth: 2,
    body: p(
      'The source mentions scientific terminology in the copy. What does that actually mean for a furniture manufacturer?',
    ),
  },
  expert(
    '2026-10-23',
    p(
      'It means the pages were written for a specialist buyer: display cabinets, glass showcases, pedestals, lighting, security of the equipment, layout and zoning. It does not mean academic papers, and it does not invent certifications or material grades the source does not name.',
    ),
    3,
  ),
  {
    author: 'Thomas Weber',
    role: 'PPC specialist',
    date: '2026-10-24',
    depth: 0,
    body: p(
      'The engagement also included contextual advertising. How should paid search sit next to a long organic programme?',
    ),
  },
  expert(
    '2026-10-24',
    p(
      'Organic search is the durable map of the offering. Paid search can put the same products and services in front of a buyer who is searching now: a jewelry counter, a turnkey salon, a display cabinet.',
      'The published source reports organic figures over eight years. It does not name the ad platform, budget, bidding model or paid conversion rate. I will not invent those. The paid work is a documented activity, not a second set of metrics.',
    ),
    1,
  ),
  {
    author: 'Thomas Weber',
    role: 'PPC specialist',
    date: '2026-10-25',
    depth: 2,
    body: p(
      'Would you send paid traffic to the homepage or to the product and turnkey pages?',
    ),
  },
  expert(
    '2026-10-25',
    p(
      'To the page that matches the query. A showcase query belongs on a showcase destination. A complete-store query belongs on turnkey. That is the same rule as the organic architecture.',
      'Historic landing-page tests are not in the source, so none are reconstructed.',
    ),
    3,
  ),
  {
    author: 'Clara Jensen',
    role: 'Industrial marketing consultant',
    date: '2026-10-26',
    depth: 0,
    body: p(
      'The source calls this a decade-long partnership and reports results over eight years. The project notes also say five years or longer. Which duration is the campaign length?',
    ),
  },
  expert(
    '2026-10-26',
    p(
      'None of those figures is automatically a single uninterrupted SEO campaign. The published source describes a decade-long partnership and an eight-year measurement window for the organic figures. The project background describes a business relationship of about five years or longer.',
      'I report the partnership as long-term and keep campaign continuity as not separately verified. Duration here is the relationship, not a claim that ads and SEO ran every month of those years.',
    ),
    1,
  ),
  {
    author: 'Pavel Orlov',
    role: 'Jewelry-retail project manager',
    date: '2026-10-27',
    depth: 2,
    body: p(
      'Does a long relationship change what you put on a manufacturing website?',
    ),
  },
  expert(
    '2026-10-27',
    p(
      'It should. New designs, new salon photographs and new service pages can be added as the factory keeps delivering stores. A one-off brochure site cannot absorb that. The source work included ongoing optimization, not only a launch.',
      'I still will not invent a year-by-year publishing calendar.',
    ),
    3,
  ),
  {
    author: 'James Whitaker',
    role: 'Drupal developer',
    date: '2026-10-28',
    depth: 0,
    body: p(
      'The site was built on Drupal with HTML, CSS and PHP. Why does that matter if the version is not disclosed?',
    ),
  },
  expert(
    '2026-10-28',
    p(
      'Because the source names the stack. Drupal could hold a wide retail-equipment information architecture and keep it editable over a long relationship. Responsive layout and load speed are named as part of that build.',
      'Theme, modules and the historic domain are not disclosed. This record describes the engagement, not the current Next.js website.',
    ),
    1,
  ),
  {
    author: 'Lukas Schneider',
    role: 'Industrial marketing consultant',
    date: '2026-10-29',
    depth: 0,
    body: p(
      'Has any of this been measured in AI search — ChatGPT, Perplexity or AI Overviews?',
    ),
  },
  expert(
    '2026-10-29',
    p(
      'Not in this record. No ChatGPT ranking, Perplexity citation or AI Overview result is documented. I will not invent one.',
      'A topical model that connects jewelry showcases, store fixtures, production, installation and turnkey salons is useful groundwork for modern search in principle. It is not a measured GEO or AEO programme.',
    ),
    1,
  ),
  {
    author: 'Martin Novak',
    role: 'In-house manufacturing marketer',
    date: '2026-10-30',
    depth: 2,
    body: p(
      'The source page calls Aleks SF a leader. Should this case repeat that?',
    ),
  },
  expert(
    '2026-10-30',
    p(
      'No. The verified story is stronger without the slogan: a manufacturer that designed, engineered, produced and installed jewelry-store equipment, with a long digital programme beside that work. Leadership language is not needed, and this discussion is editorial. It is not a testimonial from Aleks SF.',
    ),
    3,
  ),
]

const faqBlock = () => ({
  blockType: 'csFAQ' as const,
  case_study_faq_title: 'Frequently Asked Questions About Aleks SF',
  items: [
    {
      question: 'What does a turnkey jewelry-store project include?',
      answer: rt(
        p(
          'In this record, a turnkey project is the complete delivery of a jewelry-store interior: design and engineering of the retail furniture, custom manufacturing of display cabinets, glass showcases and pedestals, and on-site installation.',
          'Aleks SF performed that physical work. Neolines did not deliver the stores. Named salon counts, materials and warranties are not disclosed.',
        ),
      ),
    },
    {
      question: 'What is the role of engineering and custom manufacturing in retail furniture?',
      answer: rt(
        p(
          'Jewelry counters and showcases have to fit a specific salon: layout, lighting, security of the equipment, glass, storage and the sales island. Engineering turns that brief into furniture that can be produced and installed.',
          'The source describes custom retail equipment and a complete service cycle from conceptual design to installation. Factory capacities, materials and certifications are not published.',
        ),
      ),
    },
    {
      question: 'Why does professional installation matter for jewelry-store equipment?',
      answer: rt(
        p(
          'Display furniture is part of the room. A poorly fitted counter, an unlevel island or lighting that does not match the case changes both the look of the salon and how the jewelry is shown.',
          'Installation is therefore part of Aleks SF’s offering, not an afterthought to production. Site methods and commissioning checklists are not in the source.',
        ),
      ),
    },
    {
      question: 'How can SEO help a specialized retail-equipment manufacturer reach business customers?',
      answer: rt(
        p(
          'Jewelry retailers and store-fitting buyers search for showcases, store fixtures, display furniture, turnkey stores and related services. Keyword research, a semantic core of about 1,000 terms, and a Drupal information architecture gave those queries destinations.',
          'The eight-year organic figures on the source page are reported below. Individual keyword rankings are not republished as a table.',
        ),
      ),
    },
    {
      question:
        'How can organic search and contextual advertising work together for a manufacturing business?',
      answer: rt(
        p(
          'Organic search builds a durable map of the products and services. Contextual advertising, or paid search, can promote the same offering to buyers who are searching now.',
          'Both were part of the digital work around Aleks SF. The published metrics describe organic performance over eight years. Paid-search budgets, platforms and conversion rates are not disclosed and are not guessed here.',
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
    `<h2>${escapeHtml('Discuss a similar retail-equipment SEO and website project')}</h2>` +
      p(
        'If you design, manufacture and install custom store furniture and need the website, search visibility and paid search to match that offering, tell us about the production.',
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
  case_study_gallery_title: 'Jewelry Store Interiors and Custom Retail Equipment',
  case_study_gallery_images: imageIds,
})

const sourceMetric = (value: string, label: string, detail: string) => ({
  value,
  label,
  description: rt(
    p(
      `${detail} Reported on the published source case study for the eight-year measurement window. Not independently re-audited in this project.`,
    ),
  ),
})

const buildData = (previewImageId: number, galleryIds: number[], logoId: number) => ({
  title: 'Aleks SF: SEO and Digital Marketing for Custom Jewelry Store Equipment',
  case_study_long_title:
    'Aleks SF — Design, Engineering, Production and Installation of Jewelry-Store Retail Equipment, with Long-Term SEO and Contextual Advertising',
  slug: SLUG,
  generateSlug: false,
  _status: 'published' as const,
  featured: true,
  displayOrder: 10,
  duration: '10_years',
  company_logo: logoId,

  layout: [
    {
      blockType: 'csPreview' as const,
      case_study_preview_title: 'Custom Jewelry-Store Equipment, from Design to Installation',
      case_study_preview_text: rt(
        p(
          'Aleks SF designs, engineers, manufactures and installs custom retail furniture for jewelry stores — display cabinets, glass showcases, pedestals and complete salon interiors. Neolines supported that manufacturing business with a Drupal website, a semantic SEO foundation of about 1,000 keywords, ongoing search promotion and contextual advertising. The published source describes a decade-long partnership; organic results are reported over an eight-year window.',
        ),
      ),
      case_study_preview_image: previewImageId,
    },

    titleBlock('Project Overview'),
    contentBlock(
      p(
        'Aleks SF is a B2B manufacturer of custom retail equipment for jewelry boutiques. The physical offering is a complete service cycle: conceptual design, engineering, production of display cabinets and pedestals with glass doors and showcases, and on-site installation in jewelry stores.',
        'That is the core of the case. The digital work existed to present that offering to business customers and to keep it visible in search. Neolines did not manufacture the furniture and did not install the salons. Aleks SF did.',
      ),
    ),

    titleBlock('Business Challenge'),
    contentBlock(
      p(
        'A specialized store-fitting manufacturer is easy to hide behind generic furniture or jewelry-retail language. Potential customers may be searching for a showcase, a display cabinet, store fixtures, lighting, security of the equipment, a store layout, or a turnkey salon.',
        'Those queries are related. They are not the same page. The website had to make the manufacturing and installation capability clear without inventing a complaint the source does not record. No historic domain, previous CMS or ranking gap is described, so none is invented.',
      ),
    ),

    titleBlock('Scope of Work'),
    contentBlock(
      p(
        'Two kinds of work sat beside each other for years. Aleks SF designed, engineered, produced and installed jewelry-store equipment. Neolines built and promoted the digital side of that business.',
        'The documented digital scope is keyword and competitor analysis, a semantic core of approximately 1,000 SEO-relevant terms, content architecture on Drupal with HTML, CSS and PHP, SEO-oriented copy, ongoing search promotion, and contextual advertising / paid search. Budgets, ad accounts and a reconstructed historic URL are not disclosed.',
      ) +
        ul([
          'Design and engineering of retail furniture and jewelry-store equipment',
          'Custom manufacturing of display cabinets, glass showcases and pedestals',
          'Installation and assembly at jewelry stores',
          'Turnkey salon interiors, from design through production to installation',
          'Keyword research, semantic core and Drupal website architecture',
          'Ongoing SEO and contextual advertising to present the offering',
        ]),
    ),

    titleBlock('SEO Strategy'),
    contentBlock(
      p(
        'The search work started with keyword and competitor analysis. About 1,000 SEO-relevant keywords were identified and used as the semantic core for on-page content.',
        'That core was mapped onto an information architecture that included About Us, Exclusive VIP Design, New Designs, Retail Design, Retail Equipment Production, Retail Business Organization, Photo Gallery and Contact, plus Turnkey Stores, Manufacturing and Materials, Retail Equipment Security, Lighting for Retail Equipment, Store Design and Layout, and Space Zoning. Further pages covered a blog, exhibition equipment, store fixtures, retail furniture, display shelving and retail business.',
        'Content was written for the high-end retail-display niche. Responsive layout and load speed are named as part of the Drupal build. Individual keyword volumes and a named-competitor list are not published.',
      ),
    ),

    titleBlock('Contextual Advertising'),
    contentBlock(
      p(
        'Contextual advertising — paid search — sat beside the organic programme. Its role was to promote relevant products and services to buyers already looking for jewelry-store equipment, display furniture or a complete salon project.',
        'The published source does not name the ad platform, campaign structure, budget or paid results. Those figures are not disclosed. The organic percentages below are not attributed to advertising.',
      ),
    ),

    titleBlock('Long-Term Collaboration'),
    contentBlock(
      p(
        'The published source describes a decade-long partnership and reports organic-search figures over eight years. The project background also describes a business relationship of approximately five years or longer.',
        'This case treats those statements as the duration of the working relationship, not as proof that one SEO campaign or one ad account ran without interruption for every month of that period. New salon photographs, new designs and ongoing optimization are the practical reason a long relationship matters for a manufacturer.',
      ),
    ),

    titleBlock('Reported Search Results'),
    contentBlock(
      p(
        'The source case study publishes the following organic-search figures for an eight-year window after the SEO strategy and ongoing optimization. They are reproduced here as source-reported results, not as a new audit and not as paid-search performance.',
      ) +
        ul([
          'Organic traffic growth: +40%',
          'Organic sessions: +15%',
          'Overall sessions: +18%',
          'More than 1,200 additional keywords ranked on Google',
          'Top-5 keyword performance: +35%',
          'Impressions: +9%',
          'Clicks: +8%',
          'New users: +45%',
          'Returning users: +25%',
        ]) +
        p(
          'Leads, revenue, advertising spend and conversion rates are not in the source. This record does not call Aleks SF an industry leader.',
        ),
    ),

    titleBlock('Key Takeaways'),
    contentBlock(
      p(
        'The useful story is not a generic website-promotion case. It is a manufacturer that actually designed, built and installed jewelry-store interiors, with a digital programme that made that capability visible to business customers for years.',
        'Custom production needs a site structure that matches how buyers search — showcases, fixtures, lighting, security, layout and turnkey stores — and it needs enough time for organic search and paid search to work together. Where the source is silent, the correct public line is Not disclosed.',
      ),
    ),

    contentBlock(
      p(
        'Authentic photographs from the source Aleks SF case study. They illustrate jewelry-store interiors and custom retail equipment — the design, manufacturing and installation scope of the business. They are not photographs of work delivered by Neolines.',
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
        'Aleks SF designs and engineers custom retail furniture, manufactures display cabinets, pedestals and glass showcases, and installs the equipment in jewelry stores. The source describes a complete service cycle from conceptual design to on-site installation.',
        'Factory size, production volumes and material specifications are not disclosed.',
      ),
    ),
    products: rt(
      p(
        'Custom jewelry-store equipment: display cabinets and pedestals with glass doors and showcases, counters, island vitrines, wall-mounted display furniture, store fixtures, retail furniture, display shelving and exhibition equipment.',
        'No model names or part numbers are stated.',
      ),
    ),
    materials: rt(
      p(
        'Glass showcases and display cabinets are named. Lighting and security of retail equipment are treated as related design topics on the source site. Exact woods, metals, glass types and fittings are not disclosed and are not guessed from the photographs.',
      ),
    ),
    applications: rt(
      p(
        'Jewelry boutiques, salon interiors and related retail environments that need custom display furniture and, where required, a turnkey store fit-out. Named client stores and project sizes are not listed as a verified roster.',
      ),
    ),
  },

  businessChallenge: {
    initialState: rt(
      p(
        'Aleks SF already delivered jewelry-store interiors and custom retail equipment. The digital presentation had to catch up with that manufacturing and installation capability and remain useful over a long relationship.',
      ),
    ),
    challenge: rt(
      p(
        'Specialist buyers search for different jobs — a showcase, a store fixture, lighting, security of the equipment, a layout, or a complete salon. Those intents needed destinations without flattening the company into a generic furniture page.',
      ),
    ),
    goals: rt(
      ul([
        'Present design, engineering, production and installation as one coordinated offering',
        'Build a Drupal website with an SEO-oriented information architecture',
        'Develop a semantic core of about 1,000 keywords',
        'Support related services such as turnkey stores, lighting, security and layout',
        'Promote the offering through ongoing SEO and contextual advertising',
        'Report only source-backed results',
      ]),
    ),
  },

  nicheSegmentation: [
    {
      name: 'Jewelry Showcases and Display Cabinets',
      description: rt(
        p(
          'Glass display cabinets, counters and pedestals for jewelry. This is the visible product a salon buyer recognises first.',
        ),
      ),
      marketingApproach: rt(
        p(
          'Give showcases a destination. A buyer searching for a jewelry counter is not the same visitor as one searching only for a turnkey store.',
        ),
      ),
    },
    {
      name: 'Custom Store Fixtures and Retail Furniture',
      description: rt(
        p(
          'Store fixtures, retail furniture, display shelving and exhibition equipment named on the source site.',
        ),
      ),
      marketingApproach: rt(
        p(
          'Keep these as related product groups, not as copies of the jewelry-showcase page.',
        ),
      ),
    },
    {
      name: 'Turnkey Jewelry Stores',
      description: rt(
        p(
          'Complete salon projects that combine design, production and installation. Aleks SF delivered the physical work.',
        ),
      ),
      marketingApproach: rt(
        p(
          'Speak to retailers who need the room, not only a single cabinet. Do not invent a store count.',
        ),
      ),
    },
    {
      name: 'Store Design, Lighting and Security',
      description: rt(
        p(
          'Retail design, store layout, space zoning, lighting for retail equipment and security of the furniture, as listed in the source architecture.',
        ),
      ),
      marketingApproach: rt(
        p(
          'Treat them as specialist pages around the furniture, not as unverified security-contracting or lighting-manufacturing businesses.',
        ),
      ),
    },
  ],

  digitalEcosystem: rt(
    p(
      'The confirmed digital ecosystem is the Drupal corporate website, built with HTML, CSS and PHP, plus keyword and competitor analysis, a semantic core, SEO content, ongoing search promotion and contextual advertising.',
      'Social programmes, CRM platforms, named ad accounts and AI-search tools are not listed as delivered work.',
    ),
  ),
  websiteArchitecture: rt(
    p(
      'The published architecture covered company, design, production, turnkey stores, materials, security, lighting, layout, zoning, gallery, contact, a blog, and specialist product pages for exhibition equipment, store fixtures, retail furniture and display shelving.',
      'Exact historic URLs, Drupal version and module list are not reconstructed.',
    ),
  ),
  semanticArchitecture: rt(
    p(
      'Approximately 1,000 SEO-relevant keywords informed the semantic core. The model connected jewelry-store equipment with design, production, installation, turnkey stores and related fixture types.',
      'Keyword volumes for individual terms are not stated. Competitor brands are not named.',
    ),
  ),

  marketingStrategy: {
    seoAndContentStrategy: rt(
      p(
        'The main digital strategy in the source is search-led: keyword and competitor analysis, a semantic core of about 1,000 terms, a Drupal information architecture, and SEO-oriented copy for the retail-display niche, followed by ongoing optimization.',
        'Contextual advertising complemented that organic programme. No article count or publishing calendar is stated.',
      ),
    ),
    leadGenMechanism: rt(
      p(
        'The site was meant to make specific products and turnkey services findable, then allow contact. No form mix, conversion rate or lead volume is published.',
      ),
    ),
    paidAdvertising: [
      {
        channel: 'other' as const,
        strategy: rt(
          p(
            'Contextual advertising / paid search used to promote jewelry-store equipment, display furniture and complete salon projects alongside the organic programme.',
            'The source and project background confirm the channel. The platform is not named.',
          ),
        ),
        campaignStructure: rt(
          p(
            'Not disclosed. Historic campaign structure, audiences and landing-page tests are not in the source.',
          ),
        ),
        results: rt(
          p(
            'Paid-search results, budgets and conversion rates are not broken out. The eight-year figures published on the source page describe organic search and are not attributed to advertising.',
          ),
        ),
      },
    ],
    socialMedia: [],
  },

  aiSearchOptimization: {
    brandAuthorityAndTrust: rt(
      p(
        'This project is described as long-term SEO, website work and contextual advertising for a retail-equipment manufacturer. It is not rewritten as an AI-search engagement.',
        'No ChatGPT ranking, Perplexity citation, Gemini visibility, AI Overview result or AI-generated lead is claimed, and none is documented.',
      ),
    ),
    entityAndGeoStructure: rt(
      p(
        'Jewelry showcases, store fixtures, production, installation and turnkey salons are treated as related entities in the information architecture. That topical model is useful for modern search systems in principle. It is not a measured GEO or AEO programme.',
      ),
    ),
  },

  implementationProcess: rt(
    p(
      'Confirmed shape of the work, without inventing dates: understand the manufacturing and jewelry-store offering; research keywords and competitors; build the semantic core and map it to pages; develop the Drupal site and SEO content; continue organic promotion and contextual advertising over the long relationship.',
      'The sequence is the method. It is not a dated Gantt chart.',
    ),
  ),

  timeline: [
    {
      period: 'Phase 1',
      title: 'Understand the manufacturing offering',
      description: rt(
        p(
          'Map design, engineering, production, installation and turnkey jewelry-store work so the site can describe a factory, not only a finished salon.',
        ),
      ),
    },
    {
      period: 'Phase 2',
      title: 'Keyword and competitor research',
      description: rt(
        p(
          'Build a semantic core of about 1,000 SEO-relevant keywords covering showcases, fixtures, production, installation and related store-fitting services. Competitor brands are not named.',
        ),
      ),
    },
    {
      period: 'Phase 3',
      title: 'Website architecture and Drupal build',
      description: rt(
        p(
          'Develop the Drupal site with HTML, CSS and PHP so design, production, turnkey stores, lighting, security, layout and product groups have destinations. Version and modules are not disclosed.',
        ),
      ),
    },
    {
      period: 'Phase 4',
      title: 'Ongoing SEO and contextual advertising',
      description: rt(
        p(
          'Continue search promotion and paid search over the long partnership. The eight-year organic figures are the published measurement window. Uninterrupted monthly activity is not separately verified.',
        ),
      ),
    },
  ],

  resultsSummary: rt(
    p(
      'The documented outcome is a long digital programme beside a real manufacturing business: a Drupal site structured around jewelry-store equipment, a semantic core of about 1,000 keywords, ongoing SEO, and contextual advertising. The published source reports organic-search movement over eight years and describes a decade-long partnership.',
      'Those organic figures are reproduced as source-reported results. Leads, revenue, ad spend and paid conversions are not disclosed. Neolines did not deliver the jewelry stores.',
    ),
  ),

  metrics: [
    sourceMetric('+40%', 'Organic traffic', 'Organic traffic growth.'),
    sourceMetric('+15%', 'Organic sessions', 'Organic sessions.'),
    sourceMetric('+18%', 'Overall sessions', 'Overall sessions.'),
    sourceMetric('1,200+', 'Additional keywords ranked', 'Additional keywords ranked on Google.'),
    sourceMetric('+35%', 'Top-5 keyword performance', 'Top-5 keywords performance.'),
    sourceMetric('~1,000', 'SEO keyword foundation', 'Keywords identified for the semantic core, before the later ranking totals.'),
    {
      value: '10 years',
      label: 'Published partnership length',
      description: rt(
        p(
          'The source describes a decade-long partnership. The project background describes five years or longer. This is relationship duration, not a verified uninterrupted campaign length.',
        ),
      ),
    },
  ],

  projectsShowcase: [
    {
      projectName: 'Jewelry showcases and display cabinets',
      description: rt(
        p(
          'Custom glass display cabinets, counters and pedestals for jewelry salons. The gallery shows finished interiors from the source case study. Individual store names are not treated as a verified client roster.',
        ),
      ),
    },
    {
      projectName: 'Turnkey jewelry-store interiors',
      description: rt(
        p(
          'Complete salon projects that combine design, manufacturing and installation. Aleks SF delivered the physical work. Neolines did not install the stores.',
        ),
      ),
    },
    {
      projectName: 'Store fixtures and exhibition equipment',
      description: rt(
        p(
          'Related retail furniture, display shelving, store fixtures and exhibition equipment named in the source information architecture.',
        ),
      ),
    },
  ],

  expertInsight: rt(
    p(
      'The value of this case is the combination: a factory that designs, builds and installs jewelry-store equipment, and a digital programme that presents that capability for years.',
      'SEO matters here because buyers search for pieces of the job. Paid search matters because some of those buyers are ready now. Neither replaces the manufacturing story.',
      'Where the source is silent — ad budgets, leads, material grades, a store count — the correct public line is Not disclosed. This discussion is editorial. It is not a conversation with Aleks SF.',
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
        'Long-term SEO, website work and contextual advertising for Aleks SF — a manufacturer that designs, engineers, produces and installs custom retail equipment for jewelry stores.',
      ),
    ),
  },

  primary_case_study_category: PRIMARY_CASE_STUDY_CATEGORY,
  case_study_categories: CASE_STUDY_CATEGORIES,

  meta: {
    title: 'Aleks SF Case Study | Jewelry Store Equipment SEO',
    description:
      'Explore how Neolines supported Aleks SF, a custom retail-equipment manufacturer, through long-term SEO, website promotion, and contextual advertising for jewelry-store projects.',
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
          metrics: 7,
          paidAds: 1,
          duration: '10_years',
          featured: true,
          displayOrder: 10,
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
        { slug: { like: 'aleks' } },
        { slug: { like: 'alex-sf' } },
        { slug: { like: 'alexsf' } },
        { title: { like: 'Aleks' } },
        { title: { like: 'AlexSF' } },
        { title: { like: 'Alex SF' } },
      ],
    },
    limit: 5,
    depth: 0,
    overrideAccess: true,
    select: { id: true, slug: true, title: true },
  })

  const previewImageId = await upsertMedia(payload, PREVIEW_IMAGE)
  const logoId = await upsertMedia(payload, LOGO_IMAGE)
  const galleryIds: number[] = []
  for (const image of GALLERY_IMAGES) {
    galleryIds.push(await upsertMedia(payload, image))
  }

  const data = buildData(previewImageId, galleryIds, logoId)
  const existing = duplicates.docs.find((doc) => doc.slug === SLUG) ?? duplicates.docs[0]

  if (
    existing &&
    existing.slug !== SLUG &&
    existing.slug !== 'aleks-sf' &&
    existing.slug !== 'alex-sf'
  ) {
    throw new Error(`Related Aleks/Alex record exists with different slug: ${existing.id} ${existing.slug}`)
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
