import 'dotenv/config'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { generateJSON } from '@tiptap/html'
import config from '@payload-config'
import { getPayload, type Payload } from 'payload'
import sharp from 'sharp'

import { getPostUrl } from '../utilities/getContentUrls'
import { getTiptapExtensions } from '../utilities/richText/extensions'

/**
 * Publishes five expert manufacturing-marketing articles.
 * Does not edit earlier posts, invent testimonials, or promise rankings or citations.
 */

const CONTENT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'content/blog')
const SOURCE_DIR = path.resolve(
  'C:/Users/arsen/.cursor/projects/c-Rabota-React-Manufactori/assets',
)
const context = { disableRevalidate: true, disableCategorySeo: true }

const rt = (html: string) => generateJSON(html, getTiptapExtensions({ headingLevels: [2, 3, 4] }))
const rtHero = (html: string) =>
  generateJSON(html, getTiptapExtensions({ headingLevels: [1, 2, 3, 4] }))

const escapeHtml = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const paragraphs = (text: string) => `<p>${escapeHtml(text)}</p>`

const contentBlock = (html: string) => ({
  blockType: 'postContentBlock' as const,
  columns: [{ size: 'full' as const, richText: rt(html), enableLink: false }],
})

const titleBlock = (title: string) => ({
  blockType: 'postContentTitleBlock' as const,
  postContentTitle: title,
})

const previewBlock = (title: string, text: string, imageId: number) => ({
  blockType: 'postPreviewBlock' as const,
  postPreviewTitle: title,
  postPreviewText: rt(paragraphs(text)),
  postPreviewImage: imageId,
})

const ctaBlock = (heading: string, body: string, url: string, label: string) => ({
  blockType: 'cta' as const,
  richText: rtHero(`<h2>${escapeHtml(heading)}</h2>${paragraphs(body)}`),
  links: [
    {
      link: {
        type: 'custom' as const,
        newTab: false,
        url,
        label,
        appearance: 'default' as const,
      },
    },
  ],
})

const faqBlock = (html: string) => ({
  blockType: 'postFAQBlock' as const,
  postFAQTitle: 'Questions from manufacturing teams',
  postFAQText: rt(html),
})

const commentBlock = (date: string, html: string) => ({
  blockType: 'postCommentsBlock' as const,
  postCommentTitle: 'Expert note',
  comments: [
    {
      author: 'Maryan Polyak',
      role: 'Manufacturing Digital Marketing & Web Development Expert',
      date,
      depth: 0,
      isExpert: true,
      body: rt(`<p>${html}</p>`),
    },
  ],
})

const visibleText = (html: string) =>
  html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim()

const parseArticle = (filename: string) => {
  const raw = readFileSync(path.join(CONTENT_DIR, filename), 'utf8').trim()
  if (raw.includes('\u2014')) throw new Error(`${filename} contains an em dash`)
  const parts = raw.split(/\n@@ /)
  const intro = parts[0].trim()
  const sections = parts.slice(1).map((part) => {
    const breakAt = part.indexOf('\n')
    if (breakAt < 0) throw new Error(`Section missing body in ${filename}`)
    return { title: part.slice(0, breakAt).trim(), html: part.slice(breakAt + 1).trim() }
  })
  const characters = visibleText([intro, ...sections.map((section) => section.html)].join(' ')).length
  return { intro, sections, characters, raw }
}

type Article = {
  file: string
  imageFile: string
  alt: string
  title: string
  h1: string
  slug: string
  publishedAt: string
  primarySlug: string
  categorySlugs: string[]
  siteCategorySlugs: string[]
  previewTitle: string
  previewText: string
  metaTitle: string
  metaDescription: string
  ctaHeading: string
  ctaBody: string
  ctaUrl: string
  ctaLabel: string
  faq: string
  comment: string
}

const ARTICLES: Article[] = [
  {
    file: '05-manufacturing-seo-strategy.html',
    imageFile: 'blog-manufacturing-seo.jpg',
    alt: 'Manufacturing engineer reviewing a technical drawing beside a CNC machining centre.',
    title: 'Manufacturing SEO Strategy for Complex Industrial Products',
    h1: 'Manufacturing SEO Strategy: How to Build Search Visibility for Complex Industrial Products',
    slug: 'manufacturing-seo-strategy-complex-industrial-products',
    publishedAt: '2026-05-14T09:00:00.000Z',
    primarySlug: 'manufacturing-seo',
    categorySlugs: ['manufacturing-seo', 'manufacturing-marketing-strategy'],
    siteCategorySlugs: ['manufacturing-seo', 'industrial-product-seo'],
    previewTitle: 'Search visibility for a complex industrial catalogue',
    previewText:
      'How manufacturers organise product, application, and capability pages, and how they measure qualified organic demand.',
    metaTitle: 'Manufacturing SEO for Complex Industrial Products',
    metaDescription:
      'How manufacturers build search visibility around products, applications, and technical limits, and how to measure qualified organic demand.',
    ctaHeading: 'Start from the families you already quote',
    ctaBody:
      'A catalogue review shows which product and application pages are missing or too thin to answer a buyer. It does not promise rankings.',
    ctaUrl: '/services/seo-ai-search-optimization',
    ctaLabel: 'Discuss manufacturing SEO',
    faq: `
<h3>Should every SKU have its own URL?</h3>
<p>No. Give a URL to a family, a range, or a variant that buyers search for and that you can keep accurate. Put minor dimensional variants in a specification table on the parent page, with the drawing available when it should not be public in full.</p>
<h3>How do we handle industry pages without repeating the catalogue?</h3>
<p>Publish an industry page only when that industry changes materials, documentation, or operating limits. If it does not, name the industry on the relevant application page and link to the products. A copied paragraph with the industry name swapped is a thin page.</p>
<h3>What should we do with filter combinations?</h3>
<p>Use filters to help a visitor narrow a list. Let a combination become an indexable URL only when it is a range you market and will maintain. Point the other combinations back to the category, or keep them out of the indexable URL space.</p>
<h3>Which organic metrics are worth showing to sales?</h3>
<p>Show enquiries that name a product, a drawing, or an application you sell, and separate them from newsletter sign-ups and branded navigational visits. Add quotes issued when the sales system can tie them to those enquiries. A ranking for a broad phrase is a weak sales metric.</p>
<h3>Where should a technical article sit in this structure?</h3>
<p>Use an article when the product page should not carry the full explanation. Link the article to the product or application it depends on, and link back only when the article helps the next buying decision. An unlinked article does not strengthen the catalogue.</p>
`,
    comment:
      'If you are about to brief an agency, ask them to list the URLs they would keep, merge, or leave out of the index, and the enquiry definition they would report. A keyword list without that URL rule usually recreates the thin catalogue you already have. I am interested in how other teams decide the boundary between a product range page and a variant page.',
  },
  {
    file: '06-ai-search-manufacturers.html',
    imageFile: 'blog-ai-search-manufacturers.jpg',
    alt: 'Engineer reviewing a specification binder beside industrial pumps seen through a factory window.',
    title: 'AI Search Optimization for Manufacturers',
    h1: 'AI Search Optimization for Manufacturers: Preparing Your Website for Google, ChatGPT, and Other AI Search Systems',
    slug: 'ai-search-optimization-for-manufacturers',
    publishedAt: '2026-06-18T09:00:00.000Z',
    primarySlug: 'ai-search-optimization',
    categorySlugs: ['ai-search-optimization', 'manufacturing-seo'],
    siteCategorySlugs: ['ai-search-optimization', 'technical-content-for-ai-search'],
    previewTitle: 'Preparing a manufacturing site for AI-assisted search',
    previewText:
      'How crawlable pages, precise product facts, and a consistent public record support Google, Bing, and AI assistants without promising citations.',
    metaTitle: 'AI Search Optimization for Manufacturers',
    metaDescription:
      'How manufacturers prepare crawlable, specific product information for Google, Bing, ChatGPT, Gemini, and Perplexity without promising citations.',
    ctaHeading: 'Make the catalogue describable first',
    ctaBody:
      'The first review is whether a buyer, or a system summarising the site, can tell what you manufacture. It is not a promise of mentions in any assistant.',
    ctaUrl: '/services/ai-search-optimization-manufacturers',
    ctaLabel: 'Discuss AI search preparation',
    faq: `
<h3>Does optimising for Google also optimise for ChatGPT?</h3>
<p>Only in part. A page that is indexed and specific is available to systems that retrieve live web pages, which includes some Google and Bing features and some modes of ChatGPT, Gemini, and Perplexity. Those products do not share one ranking system. A page that is absent from the index cannot be quoted from the live web, whatever the assistant is called.</p>
<h3>Should we add a special page written for AI systems?</h3>
<p>No. Improve the pages that already define the company, the products, and the applications. A separate page addressed to models tends to repeat slogans and drifts out of date. Clear headings and sourced specifications are editing choices for human readers.</p>
<h3>Can we measure AI visibility with one score?</h3>
<p>There is no stable public score worth managing. Track index coverage for the URLs you care about, and keep a dated sample of real buyer questions asked in the assistants your customers use. Treat the sample as a qualitative check of accuracy, not as a league table.</p>
<h3>Do external mentions matter more than the website?</h3>
<p>They answer a different question. The website states what you sell and on what evidence. Mentions in relevant publications can confirm that description. A mention does not repair a product page that omits the operating limit, and a perfect product page does not by itself create third-party coverage.</p>
<h3>What should we refuse to promise internally?</h3>
<p>Refuse guarantees of citations, recommendations, or inclusion in an AI overview. Report which pages now state the product clearly, which of those pages are indexed, and what a small sample of answers got right or wrong.</p>
`,
    comment:
      'The useful test I keep coming back to is a buyer question your application engineers already answer, asked in more than one product, with the date written down. If the answer invents a capability, the fix is almost always on your own pages or on an outdated third-party profile. I would like to hear which assistants your buyers actually name, because the set is not the same in every industry.',
  },
  {
    file: '07-manufacturing-website-architecture.html',
    imageFile: 'blog-manufacturing-website-architecture.jpg',
    alt: 'Organised industrial warehouse aisles holding separated bins of machined components and fittings.',
    title: 'How to Structure a Large Manufacturing Catalogue',
    h1: 'How to Structure a Manufacturing Website with Hundreds or Thousands of Products',
    slug: 'manufacturing-website-architecture-large-catalogues',
    publishedAt: '2026-07-16T09:00:00.000Z',
    primarySlug: 'industrial-website-architecture',
    categorySlugs: ['industrial-website-architecture', 'manufacturing-seo'],
    siteCategorySlugs: ['industrial-website-architecture', 'product-catalog-website'],
    previewTitle: 'Website structure for a large industrial catalogue',
    previewText:
      'How to separate category, product, and application pages, and how to keep filters from creating thin URLs.',
    metaTitle: 'Structure a Large Manufacturing Catalogue',
    metaDescription:
      'How to organise hundreds or thousands of industrial products into category, product, and application pages without thin or duplicated URLs.',
    ctaHeading: 'Write the URL rule before the template',
    ctaBody:
      'A structure review names which differences deserve a page and which stay in a table or a filter. It does not require a new page for every SKU.',
    ctaUrl: '/services/website-design-development-for-manufacturers',
    ctaLabel: 'Discuss catalogue structure',
    faq: `
<h3>How many levels should the product menu have?</h3>
<p>As many as a buyer needs to choose the next branch, and no more. Two or three levels are often enough: family, range, then the product or configurable range. Deeper trees usually mean the taxonomy is following an internal code rather than a buying decision.</p>
<h3>Can one product live in several categories?</h3>
<p>It can be linked from several applications and industries. It should have one canonical home in the primary tree, and the breadcrumb should show that home. A second URL with the same specification creates a duplicate.</p>
<h3>What if our ERP has thousands of item codes?</h3>
<p>Item codes can stay in the commerce or quoting system. The public site needs pages for the ranges buyers recognise. List codes in a table or a selector when they differ by a dimension you can maintain, and create a URL when the code is searched on its own or the specification change would mislead someone if it stayed in a row.</p>
<h3>When is an industry section justified?</h3>
<p>When the industry changes a requirement you can write down, such as a material, a certificate, or a cleaning method. If the industry name is only a sales label for the same product, mention it on the application or product page instead of opening a new section.</p>
<h3>Who should approve a new branch of the catalogue?</h3>
<p>Someone who owns the product data. Marketing can propose the buyer-facing name. Engineering or product management should confirm that the branch matches a real difference. A branch with no owner becomes an empty template.</p>
`,
    comment:
      'The decision I would document first is the sentence that tells a new product manager when a variant gets its own URL. Without that sentence, the next catalogue import will recreate every filter combination. If your team already has that rule, I am interested in whether it is based on how buyers search or on how the ERP is structured.',
  },
  {
    file: '08-technical-content-marketing.html',
    imageFile: 'blog-technical-content-manufacturing.jpg',
    alt: 'Two engineers comparing an industrial valve assembly with an unmarked paper drawing at a workbench.',
    title: 'Technical Content Marketing for Manufacturers',
    h1: 'Technical Content Marketing for Manufacturers: Turning Engineering Expertise into Qualified B2B Leads',
    slug: 'technical-content-marketing-manufacturers',
    publishedAt: '2026-08-20T09:00:00.000Z',
    primarySlug: 'technical-content-marketing',
    categorySlugs: ['technical-content-marketing', 'manufacturing-marketing-strategy'],
    siteCategorySlugs: ['manufacturing-content-marketing', 'engineering-content-marketing'],
    previewTitle: 'Technical content that helps a buyer qualify',
    previewText:
      'How specifications, comparisons, and implementation notes turn engineering knowledge into enquiries sales can use.',
    metaTitle: 'Technical Content Marketing for Manufacturers',
    metaDescription:
      'How manufacturers turn specifications, comparisons, and engineering review into pages that help buyers decide and sales qualify enquiries.',
    ctaHeading: 'Publish the facts engineering will sign',
    ctaBody:
      'A content review starts from datasheets and real sales questions. It does not ask you to invent a case study or a performance claim.',
    ctaUrl: '/services/technical-content-thought-leadership',
    ctaLabel: 'Discuss technical content',
    faq: `
<h3>Who should write the first draft?</h3>
<p>Either side can draft, if the approval line is clear. Marketing can organise the page and remove empty claims. Engineering or product management has to approve numbers, standards, and exclusions. Sales should say whether the page will attract work the plant wants. A softer adjective is not a substitute for that approval.</p>
<h3>What if the precise tolerance cannot be published?</h3>
<p>Say that the controlled drawing governs, and say how a buyer requests it. Do not replace the missing figure with an estimate. A public page that is slightly vague about access to the drawing is safer than a page that states a number nobody will stand behind.</p>
<h3>How many articles do we need before the content “works”?</h3>
<p>There is no quota. A maintained specification and a clear enquiry path on a product you want to sell will outperform a monthly article that never links to that product. Add an article when it answers a question the product page should not carry in full.</p>
<h3>Should sales PDFs copy the website?</h3>
<p>They should carry the same limits and the same product names. Pick the public product URL as the source for specifications, and update the leave-behind when that page changes. Two conflicting numbers make both documents harder to trust.</p>
<h3>How do we tell that a page is commercially relevant?</h3>
<p>Look for enquiries that name the product, quotes that used the page, and corrections engineering had to make after publication. An accurate page about a line you want more of is relevant. A polished explanation of a process you do not sell is not.</p>
`,
    comment:
      'The review question I would put on the brief is simple: which three claims on this page would you defend in front of the buyer’s engineer? If the writer cannot point to a datasheet, a standard, or a named reviewer, the claim comes off the page. How does your team record that source so the next edit does not put the claim back?',
  },
  {
    file: '09-manufacturing-lead-generation.html',
    imageFile: 'blog-manufacturing-lead-generation.jpg',
    alt: 'Sales engineer walking a factory aisle beside installed process equipment, carrying a closed notebook.',
    title: 'Digital Lead Generation for Manufacturing Companies',
    h1: 'Digital Lead Generation for Manufacturing Companies: Connecting SEO, Google Ads, Content, and Sales',
    slug: 'digital-lead-generation-manufacturing',
    publishedAt: '2026-09-17T09:00:00.000Z',
    primarySlug: 'manufacturing-demand-generation',
    categorySlugs: ['manufacturing-demand-generation', 'lead-generation--new-business'],
    siteCategorySlugs: ['b2b-lead-generation', 'lead-generation--new-business'],
    previewTitle: 'Connecting search, paid media, content, and sales',
    previewText:
      'How manufacturers separate high-intent product searches from early research and measure qualified enquiries rather than clicks.',
    metaTitle: 'Digital Lead Generation for Manufacturers',
    metaDescription:
      'How manufacturers connect SEO, Google Ads, technical pages, and sales follow-up, and how to measure qualified enquiries without promising a fixed return.',
    ctaHeading: 'Match the plan to sales capacity',
    ctaBody:
      'A lead review defines a qualified enquiry and checks whether the current pages and reply path can support it. It does not promise a quota of leads.',
    ctaUrl: '/services/lead-generation',
    ctaLabel: 'Discuss qualified enquiries',
    faq: `
<h3>Should we start with SEO or Google Ads?</h3>
<p>Start with the constraint. If a product page already explains the offer and sales can reply, a tight paid programme can test demand quickly. If the page cannot answer a technical question, paid traffic will only make that gap expensive. SEO is the durable path for the families you want to be found for after the campaign stops.</p>
<h3>What belongs in the enquiry form?</h3>
<p>The product or application the page is about, the project stage or quantity if you need it to qualify, and a way to reply. Leave off fields that sales will not read. A long form on an early-research article usually lowers the number of messages without raising their quality.</p>
<h3>How do we treat a download or a newsletter sign-up?</h3>
<p>As a research action, unless sales has agreed to follow it up and does so. Count it separately from quote requests. Calling every email address a lead makes the report look busy and teaches the team to ignore it.</p>
<h3>Can we calculate return on marketing spend from the CRM?</h3>
<p>You can report quotes and wins that the CRM ties to a named enquiry, and you can show which channel was the last click. Dividing revenue by ad spend and calling it a proven return ignores the length of the cycle and the other pages involved. Label what you cannot tie as unknown.</p>
<h3>What if sales cannot handle more enquiries?</h3>
<p>Do not buy more traffic. Fix reply ownership and the two or three pages that already create quotes. Add a channel only when someone is assigned to the technical reply and the form carries the product name.</p>
`,
    comment:
      'Before adding budget, I would sit with sales for an hour and mark the last twenty web enquiries as quote-ready, useful later, or poor fit. The pattern in those twenty usually tells you whether the problem is the keyword, the landing page, or the fact that nobody replies with the product name. What definition of “qualified” would your sales team actually accept on a Monday morning?',
  },
]

const requireId = (map: Map<string, { id: number | string }>, slug: string) => {
  const doc = map.get(slug)
  if (!doc) throw new Error(`Missing id for ${slug}`)
  return Number(doc.id)
}

const idsBySlug = async (
  payload: Payload,
  collection: 'categories' | 'site-categories' | 'posts' | 'services' | 'case-studies',
  slugs: string[],
) => {
  const found = await payload.find({
    collection,
    depth: 1,
    limit: Math.max(slugs.length, 1),
    overrideAccess: true,
    pagination: false,
    where: { slug: { in: slugs } },
  })
  const map = new Map(found.docs.map((doc) => [doc.slug, doc]))
  const missing = slugs.filter((slug) => !map.has(slug))
  if (missing.length) throw new Error(`Missing ${collection}: ${missing.join(', ')}`)
  return map
}

const prepareImage = async (filename: string) => {
  const source = path.join(SOURCE_DIR, filename)
  const buffer = await sharp(source)
    .rotate()
    .resize({ width: 1800, withoutEnlargement: true })
    .jpeg({ quality: 82 })
    .toBuffer()
  return { name: filename, data: buffer, mimetype: 'image/jpeg' as const, size: buffer.byteLength }
}

const main = async () => {
  const payload = await getPayload({ config })
  const parsed = ARTICLES.map((article) => ({ article, ...parseArticle(article.file) }))
  for (const item of parsed) {
    if (item.characters < 4000) {
      throw new Error(`${item.article.slug} body is ${item.characters} characters`)
    }
    payload.logger.info(`${item.article.slug} body characters ${item.characters}`)
  }

  const hrefs = new Set<string>()
  for (const item of parsed) {
    for (const match of item.raw.matchAll(/href="([^"]+)"/g)) hrefs.add(match[1])
  }
  const postHrefs = [...hrefs].filter((href) => href.startsWith('/blog/'))
  const serviceHrefs = [...hrefs].filter((href) => href.startsWith('/services/'))
  const caseHrefs = [...hrefs].filter((href) => href.startsWith('/case-studies/'))
  const ownSlugs = new Set(ARTICLES.map((article) => article.slug))
  const postSlugs = postHrefs
    .map((href) => href.split('/').filter(Boolean).at(-1) || '')
    .filter((slug) => !ownSlugs.has(slug))
  const serviceSlugs = serviceHrefs.map((href) => href.split('/').filter(Boolean).at(-1) || '')
  const caseSlugs = caseHrefs.map((href) => href.split('/').filter(Boolean).at(-1) || '')
  const postMap = await idsBySlug(payload, 'posts', postSlugs)
  const serviceMap = await idsBySlug(payload, 'services', serviceSlugs)
  const caseMap = await idsBySlug(payload, 'case-studies', caseSlugs)
  for (const href of postHrefs) {
    const slug = href.split('/').filter(Boolean).at(-1) || ''
    if (ownSlugs.has(slug)) {
      const expected = ARTICLES.find((article) => article.slug === slug)
      const category = expected ? `/blog/${expected.primarySlug}/${expected.slug}` : ''
      if (href !== category) throw new Error(`New post link ${href} does not match ${category}`)
      continue
    }
    const url = getPostUrl(postMap.get(slug))
    if (url !== href) throw new Error(`Post link ${href} resolves to ${url}`)
  }
  for (const href of serviceHrefs) {
    const slug = href.split('/').filter(Boolean).at(-1) || ''
    const url = `/services/${serviceMap.get(slug)?.slug}`
    if (url !== href) throw new Error(`Service link ${href} resolves to ${url}`)
  }
  for (const href of caseHrefs) {
    const slug = href.split('/').filter(Boolean).at(-1) || ''
    if (!caseMap.get(slug)) throw new Error(`Missing case ${href}`)
  }

  const categoryMap = await idsBySlug(
    payload,
    'categories',
    [...new Set(ARTICLES.flatMap((article) => article.categorySlugs))],
  )
  const siteMap = await idsBySlug(
    payload,
    'site-categories',
    [...new Set(ARTICLES.flatMap((article) => article.siteCategorySlugs))],
  )

  const architecture = categoryMap.get('industrial-website-architecture') as
    | {
        id: number
        category_description?: { root?: { children?: unknown[] } }
      }
    | undefined
  const descriptionEmpty =
    !architecture?.category_description ||
    !Array.isArray(architecture.category_description?.root?.children) ||
    architecture.category_description.root.children.length === 0
  if (descriptionEmpty && architecture) {
    await payload.update({
      collection: 'categories',
      id: architecture.id,
      data: {
        category_description: rt(
          paragraphs(
            'Articles on how manufacturers organise large product catalogues: category trees, product and application pages, filters, and the order in which those sections should be built. This section collects writing about website structure. It is not a gallery of client projects.',
          ),
        ),
      },
      overrideAccess: true,
      context,
    })
    payload.logger.info('Filled empty description for industrial-website-architecture')
  }

  const author = await payload.findByID({ collection: 'users', id: 1, depth: 0, overrideAccess: true })
  if (author.name === 'marian' || author.name === 'Marian') {
    await payload.update({
      collection: 'users',
      id: 1,
      data: { name: 'Maryan Polyak' },
      overrideAccess: true,
      context,
    })
    payload.logger.info('Updated author display name to Maryan Polyak')
  } else {
    payload.logger.info(`Author display name left as ${author.name}`)
  }

  const upload = async (filename: string, alt: string) => {
    const file = await prepareImage(filename)
    const caption = rt(
      paragraphs(
        'Editorial photograph for this article. It is not a picture of a client facility or a client project.',
      ),
    )
    const existing = await payload.find({
      collection: 'media',
      where: { filename: { equals: filename } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    if (existing.docs[0]) {
      const updated = await payload.update({
        collection: 'media',
        id: existing.docs[0].id,
        data: { alt, caption },
        file,
        overwriteExistingFiles: true,
        overrideAccess: true,
        context,
      })
      return Number(updated.id)
    }
    const created = await payload.create({
      collection: 'media',
      data: { alt, caption },
      file,
      overrideAccess: true,
      context,
    })
    return Number(created.id)
  }

  const ids: number[] = []
  for (const item of parsed) {
    const article = item.article
    const imageId = await upload(article.imageFile, article.alt)
    const data = {
      title: article.title,
      postLongTitle: article.h1,
      slug: article.slug,
      generateSlug: false,
      _status: 'published' as const,
      publishedAt: article.publishedAt,
      authors: [1],
      primary_category: requireId(categoryMap, article.primarySlug),
      categories: article.categorySlugs.map((slug) => requireId(categoryMap, slug)),
      site_categories: article.siteCategorySlugs.map((slug) => requireId(siteMap, slug)),
      relatedPosts: [],
      hero: {
        type: 'mediumImpact' as const,
        media: imageId,
        richText: rtHero(`<h1>${escapeHtml(article.h1)}</h1>${item.intro}`),
      },
      layout: [
        previewBlock(article.previewTitle, article.previewText, imageId),
        ...item.sections.flatMap((section) => [titleBlock(section.title), contentBlock(section.html)]),
        faqBlock(article.faq),
        commentBlock(article.publishedAt.slice(0, 10), article.comment),
        ctaBlock(article.ctaHeading, article.ctaBody, article.ctaUrl, article.ctaLabel),
      ],
      meta: {
        title: article.metaTitle,
        description: article.metaDescription,
        image: imageId,
      },
    }
    const existing = await payload.find({
      collection: 'posts',
      where: { slug: { equals: article.slug } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    const saved = existing.docs[0]
      ? await payload.update({
          collection: 'posts',
          id: existing.docs[0].id,
          data,
          draft: false,
          overrideAccess: true,
          context,
        })
      : await payload.create({
          collection: 'posts',
          data,
          draft: false,
          overrideAccess: true,
          context,
        })
    ids.push(Number(saved.id))
    payload.logger.info(
      `${saved.id} ${item.characters} chars ${saved.publishedAt} ${getPostUrl(saved)}`,
    )
  }

  for (let index = 0; index < ids.length; index += 1) {
    const related = ids.filter((_, other) => other !== index)
    await payload.update({
      collection: 'posts',
      id: ids[index],
      data: { relatedPosts: related },
      draft: false,
      overrideAccess: true,
      context,
    })
  }

  process.exit(0)
}

void main().catch((error) => {
  console.error(error)
  process.exit(1)
})
