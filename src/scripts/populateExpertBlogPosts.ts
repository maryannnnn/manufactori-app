import 'dotenv/config'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { generateJSON } from '@tiptap/html'
import config from '@payload-config'
import { getPayload } from 'payload'

import { getPostUrl } from '../utilities/getContentUrls'
import { getTiptapExtensions } from '../utilities/richText/extensions'

/**
 * Replaces three local test Posts with three published expert articles.
 * Uses existing Post fields/blocks, Categories, Media, and SEO. No new collections.
 */

const TEST_POSTS = [
  { id: 6, slug: 'image-editor-check', title: 'Image editor check' },
  { id: 4, slug: 'a', title: 'aaaaaaaaaaaaaaaaa' },
  { id: 3, slug: '-----', title: 'Описание логики работы программы сравнения цен' },
]

const PRIMARY = {
  geo: 104, // AI Search Optimization
  ads: 363, // Google Ads for Manufacturers
  linkedin: 26, // Manufacturing Marketing Strategy
}

const CATEGORIES = {
  geo: [104, 29, 28], // AI Search Optimization, AI Search / AEO / GEO, Manufacturing SEO
  ads: [363, 35, 33], // Google Ads for Manufacturers, Paid Search & Paid Media, Manufacturing Demand Generation
  linkedin: [26, 33, 30], // Manufacturing Marketing Strategy, Manufacturing Demand Generation, Technical Content Marketing
}

const IMAGE_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'assets')

const rt = (html: string) => generateJSON(html, getTiptapExtensions({ headingLevels: [2, 3, 4] }))
const rtHero = (html: string) =>
  generateJSON(html, getTiptapExtensions({ headingLevels: [1, 2, 3, 4] }))

const escapeHtml = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const p = (...texts: string[]) => texts.map((text) => `<p>${escapeHtml(text)}</p>`).join('')
const ul = (items: string[]) =>
  `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`

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
  postPreviewText: rt(p(text)),
  postPreviewImage: imageId,
})

const ctaBlock = (heading: string, body: string, url: string, label: string) => ({
  blockType: 'cta' as const,
  richText: rtHero(`<h2>${escapeHtml(heading)}</h2>` + p(body)),
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

const articleGeo = (imageId: number) => ({
  title: 'AI Search Optimization for B2B Companies: What GEO Actually Means',
  postLongTitle:
    'AI Search Optimization for B2B Companies: How GEO Changes the Way Buyers Find Expertise',
  slug: 'ai-search-optimization-b2b-geo',
  generateSlug: false,
  _status: 'published' as const,
  publishedAt: '2026-10-06T09:00:00.000Z',
  authors: [1],
  primary_category: PRIMARY.geo,
  categories: CATEGORIES.geo,
  relatedPosts: [],
  hero: {
    type: 'mediumImpact' as const,
    media: imageId,
    richText: rtHero(
      `<h1>${escapeHtml('AI Search Optimization for B2B Companies: How GEO Changes the Way Buyers Find Expertise')}</h1>` +
        p(
          'Buyers still search. What has changed is where the answer is assembled: a results page, an AI overview, a chat interface, or a cited summary. For a B2B company, visibility now depends on whether those systems can recognize what you do.',
        ),
    ),
  },
  layout: [
    previewBlock(
      'AI Search Optimization for B2B Companies',
      'How GEO and semantic SEO are changing the way B2B buyers discover companies, services and technical expertise.',
      imageId,
    ),
    titleBlock('What Is AI Search Optimization?'),
    contentBlock(
      p(
        'AI search optimization is the work of making a company understandable to systems that generate answers, not only to a ranked list of blue links. ChatGPT, Google AI features, Perplexity, Gemini and similar tools need a clear picture of the organization: what it sells, which problems it solves, which industries it serves, and how those pieces relate.',
        'The usual name for this layer is GEO, generative engine optimization. The name is less important than the job. You are still doing search work. You are expanding the unit of optimization from a page to an entity the model can describe without guessing.',
      ),
    ),
    titleBlock('Why Traditional SEO Is Not Enough'),
    contentBlock(
      p(
        'Classic SEO is still the foundation. If the site is slow, thin, or structured as a brochure, neither Google nor an answer engine has much to work with. What is no longer enough is treating ranking for a handful of head terms as the whole strategy.',
        'A manufacturer can rank for a generic phrase and still fail when a buyer asks an AI system for companies that machine a specific alloy, or that install a particular class of equipment. The answer is assembled from pages that make relationships explicit. A homepage that says "quality industrial solutions" does not.',
      ),
    ),
    titleBlock('How AI Systems Understand a B2B Company'),
    contentBlock(
      p(
        'These systems do not "know" your business unless the public record is coherent. They look for named services, products, applications, industries, locations, and the links between them. Entity clarity is the difference between "a manufacturing company" and "a supplier of packaging lines for food plants."',
        'Semantic structure helps: service pages that describe real work, application pages that name the job the buyer has, case studies that show how those pieces were used together, and technical articles that answer the questions an engineer actually asks. Isolated blog posts with no connection to the offering do not build that picture.',
      ),
    ),
    titleBlock('What GEO Changes for Manufacturers'),
    contentBlock(
      p(
        'Industrial buyers search with unusual specificity. They name processes, materials, tolerances, and plant conditions. GEO does not replace SEO for that demand. It raises the cost of vague content.',
        'A factory site that only repeats marketing adjectives will be hard to cite. A site that explains capabilities, applications, and limits gives an answer engine something it can reuse. Depth is not a style preference here. It is how the company becomes identifiable.',
      ),
    ),
    titleBlock('The Content Structure That Works Better'),
    contentBlock(
      p(
        'The pages that help most are the ones a technical buyer would bookmark: services, products, applications, case studies, and company information that states what you actually do. Those URLs should point at each other. A case study that never links to the relevant service is a missed entity.',
        'Expert content outperforms mass publishing because it can be checked against the rest of the site. If the article, the service page, and the case study tell the same story in different forms, the company is easier to summarise. Volume without that consistency is noise.',
      ),
    ),
    titleBlock('Technical SEO Still Matters'),
    contentBlock(
      p(
        'Crawlability, indexation, internal links, titles, headings, and a sane URL architecture still decide whether the material can be found at all. GEO does not rescue a site that buries its offering three clicks behind a slider.',
        'Treat technical SEO as the delivery layer. GEO is the requirement that the delivered material be specific enough to describe. Do both, or the nicer of the two still fails.',
      ),
    ),
    titleBlock('What B2B Companies Should Do Now'),
    contentBlock(
      ul([
        'Write down the entities that matter: company, services, products, applications, industries.',
        'Make sure each one has a public page that a specialist would recognize as accurate.',
        'Connect case studies and technical articles to those pages instead of leaving them as a news feed.',
        'Fix the technical basics so the structure can be crawled.',
        'Stop publishing generic posts that could sit on any agency blog.',
      ]) +
        p(
          'None of this guarantees a citation in a particular AI product. It does make the company easier to describe, which is the actual requirement.',
        ),
    ),
    titleBlock('Conclusion'),
    contentBlock(
      p(
        'GEO is not a replacement for SEO. It is search work aimed at systems that answer in sentences. For B2B and manufacturing companies, the practical move is the same as it has always been when the market is technical: say clearly what you do, prove it with connected pages, and keep the site technically sound.',
      ),
    ),
    ctaBlock(
      'See how we approach SEO and AI Search for manufacturers',
      'If your public site still describes the company in general terms, the first job is a clearer entity and content structure.',
      '/services/seo',
      'SEO and AI Search',
    ),
  ],
  meta: {
    title: 'AI Search Optimization for B2B Companies | GEO Strategy',
    description:
      'How AI search is changing B2B discovery and what companies can do to improve visibility across Google, ChatGPT, Perplexity and other AI-driven search experiences.',
    image: imageId,
  },
})

const articleAds = (imageId: number) => ({
  title: 'Google Ads for Manufacturers: From Clicks to Qualified Industrial Leads',
  postLongTitle:
    'Google Ads for Manufacturers: Building Campaigns Around Products, Applications and Buyer Intent',
  slug: 'google-ads-for-manufacturers',
  generateSlug: false,
  _status: 'published' as const,
  publishedAt: '2026-09-22T09:00:00.000Z',
  authors: [1],
  primary_category: PRIMARY.ads,
  categories: CATEGORIES.ads,
  relatedPosts: [],
  hero: {
    type: 'mediumImpact' as const,
    media: imageId,
    richText: rtHero(
      `<h1>${escapeHtml('Google Ads for Manufacturers: Building Campaigns Around Products, Applications and Buyer Intent')}</h1>` +
        p(
          'Paid search for a factory is not a traffic tap. A click is cheap only if it belongs to someone who can buy the work you actually do. Most waste starts when campaigns are built around the agency\'s keyword list instead of the plant\'s catalog.',
        ),
    ),
  },
  layout: [
    previewBlock(
      'Google Ads for Manufacturers',
      'How manufacturers can structure Google Ads around products, applications and buyer intent instead of simply buying more clicks.',
      imageId,
    ),
    titleBlock('Why Manufacturing Google Ads Is Different'),
    contentBlock(
      p(
        'Industrial search is uneven. A few queries are ready to talk to sales. Many are research: a process, a material, a comparison, a standard. If those intents share one campaign and one landing page, the account will look busy and still fail to produce usable enquiries.',
        'The sales cycle is also longer. A qualified lead may sit with engineering for weeks. Measuring the channel as if it were an ecommerce checkout hides that reality and usually produces the wrong optimizations.',
      ),
    ),
    titleBlock('Start With Search Intent'),
    contentBlock(
      p(
        'Split commercial intent from informational intent before you write ads. Commercial queries name a product, a capability, or a request for supply. Informational queries want an explanation. Both can be useful. They should not compete inside the same ad group.',
        'Once intent is separated, match the promise of the ad to a page that keeps that promise. Sending a specification search to the homepage is how manufacturing accounts burn budget.',
      ),
    ),
    titleBlock('Build Campaigns Around Products and Applications'),
    contentBlock(
      p(
        'The campaign structure should follow the business: product families, services, and applications, not a pile of keywords that happen to convert in other industries. An application campaign ("packaging line for meat processing") is a different conversation from a product campaign ("vertical form-fill-seal machine").',
        'When the account mirrors the catalog, search terms become easier to read. You can see which part of the offering is in demand, and which ads are attracting the wrong plant.',
      ),
    ),
    titleBlock('Landing Pages Matter More Than Most Companies Think'),
    contentBlock(
      p(
        'The landing page is part of the campaign. If the query is specific, the page must be specific: the product or application, the relevant constraints, and a way to enquire without hunting. A generic "industries we serve" block is not a landing page.',
        'This is also where paid search and the website either help each other or fight. A paid click onto a thin page trains Google that the query and the site do not belong together.',
      ),
    ),
    titleBlock('Search Terms and Negative Keywords'),
    contentBlock(
      p(
        'Search term reports are the maintenance schedule. They show DIY queries, job-seekers, spare-part hunters for brands you do not supply, and students. Negative keywords are how you keep the account pointed at buyers.',
        'This work does not end at launch. Industrial language is messy. New close variants appear. If nobody reviews terms, the campaign slowly fills with cheap irrelevance.',
      ),
    ),
    titleBlock('Measure Leads, Not Just Clicks'),
    contentBlock(
      p(
        'CTR and CPC describe the auction. They do not describe the business. Track enquiries, the quality of those enquiries, and whether they match the products you can actually quote. A high CTR on the wrong query is not a win.',
        'No benchmark from another industry belongs in this decision. Your mix of products, geographies, and sales process is the only baseline that matters, and it has to be observed in your own account.',
      ),
    ),
    titleBlock('How Google Ads and SEO Work Together'),
    contentBlock(
      p(
        'Paid search shows demand immediately. Organic search needs pages that can keep ranking after the click. The same product and application structure should feed both. Case studies and technical articles can support paid traffic when they sit behind the right query, not when they are used as a dumping ground for leftover budget.',
        'If SEO has already built a strong application page, that is often a better landing page than a new microsite invented for the campaign.',
      ),
    ),
    titleBlock('When Paid Search Makes Sense'),
    contentBlock(
      p(
        'Paid search is useful when you can name the commercial queries, land them on a matching page, and judge the enquiries honestly. It is a poor substitute for a website that cannot explain the offering. Fix the structure first if the site is still a single Services page.',
      ),
    ),
    titleBlock('Conclusion'),
    contentBlock(
      p(
        'Google Ads for manufacturers is a mapping problem: intent, to product or application, to page, to a lead the plant can handle. Clicks are the input. Qualified industrial demand is the output. Build the account around that, and keep the search terms honest.',
      ),
    ),
    ctaBlock(
      'Build a Google Ads strategy around your real products and buyer intent',
      'If campaigns are still organized as a keyword bucket, start from the catalog and the queries that actually mean "we need this made or supplied."',
      '/contact',
      'Discuss paid search',
    ),
  ],
  meta: {
    title: 'Google Ads for Manufacturers | B2B Lead Generation',
    description:
      'A practical approach to Google Ads for manufacturers: search intent, product structure, landing pages, negative keywords and measuring qualified B2B leads.',
    image: imageId,
  },
})

const articleLinkedin = (imageId: number) => ({
  title: 'LinkedIn for B2B Manufacturing: How to Build Visibility With Engineers and Buyers',
  postLongTitle:
    'LinkedIn for B2B Manufacturing: Building Technical Authority and Reaching the Right Decision-Makers',
  slug: 'linkedin-b2b-manufacturing',
  generateSlug: false,
  _status: 'published' as const,
  publishedAt: '2026-09-08T09:00:00.000Z',
  authors: [1],
  primary_category: PRIMARY.linkedin,
  categories: CATEGORIES.linkedin,
  relatedPosts: [],
  hero: {
    type: 'mediumImpact' as const,
    media: imageId,
    richText: rtHero(
      `<h1>${escapeHtml('LinkedIn for B2B Manufacturing: Building Technical Authority and Reaching the Right Decision-Makers')}</h1>` +
        p(
          'LinkedIn is useful in manufacturing because the buying group is scattered: engineers, procurement, quality, and plant management. The network fails when it is used as a noticeboard for company news and nothing else.',
        ),
    ),
  },
  layout: [
    previewBlock(
      'LinkedIn for B2B Manufacturing',
      'A practical LinkedIn strategy for manufacturers that want to build technical authority and reach engineers, buyers and decision-makers.',
      imageId,
    ),
    titleBlock('Why LinkedIn Works Differently in B2B Manufacturing'),
    contentBlock(
      p(
        'The sales cycle is long and committee-based. People research quietly. They notice who explains the work clearly long before they send an RFQ. Follower counts do not measure that. Neither does a burst of congratulatory posts after a trade fair.',
        'Engineers and technical buyers are also hard to move with generic advertising language. They respond to problems they recognize: a mounting constraint, an application, a failure mode, a way of documenting a capability. If the content could be copied onto any factory page, it will be ignored.',
      ),
    ),
    titleBlock('Stop Posting Only Company News'),
    contentBlock(
      p(
        'Announcements have a place. They should not be the whole calendar. News tells people you exist this week. It rarely helps them understand whether you can solve their job.',
        'Replace empty updates with pieces of the actual work: how an application was approached, what made a project difficult, which questions procurement usually asks, what the website already explains in more depth. That is still company content. It is just useful.',
      ),
    ),
    titleBlock('Build Content Around Technical Expertise'),
    contentBlock(
      p(
        'The useful unit of LinkedIn content for a manufacturer is a technical insight tied to a real capability. Not a secret, not a data dump, and not a slogan. A short explanation of an application, a constraint, or a decision is enough.',
        'Case studies, project stories, and engineering explanations travel well if they stay specific. "We delivered a complex project for a global client" does not. "The line had to pack frozen product without stopping the upstream process" does.',
      ),
    ),
    titleBlock('What Engineers and Buyers Need to See'),
    contentBlock(
      p(
        'Engineers look for evidence that you have seen their class of problem. Buyers look for a path: what you supply, how you work, how to start a conversation. Good posts serve both without pretending they are the same person.',
        'Show the offering in use. Name the application. Link to the page that holds the full explanation. Do not hide the company behind a motivational quote.',
      ),
    ),
    titleBlock('Company Page vs. Expert Profile'),
    contentBlock(
      p(
        'The company page is the official record. Expert profiles, used carefully, are how explanations spread. They should not contradict each other. A plant director or a marketing lead who can talk about real projects will usually outperform a page that only posts stock photography.',
        'This is not a requirement to turn every engineer into an influencer. It is a requirement that at least one credible person can speak in public in the same language as the website.',
      ),
    ),
    titleBlock('Turn Case Studies Into LinkedIn Content'),
    contentBlock(
      p(
        'One delivered project can produce several posts: the problem, the constraint, the solution shape, a detail that surprised the team, and a link to the full case. That is more honest than inventing a content calendar from scratch.',
        'Keep the posts tied to the live case study and the relevant service or product page. LinkedIn then becomes a distribution layer, not a second disconnected brochure.',
      ),
    ),
    titleBlock('Connect LinkedIn With Your Website and SEO'),
    contentBlock(
      p(
        'If the insight lives only on LinkedIn, you lose it the moment the feed moves on. Publish the durable version on the site, then point to it. SEO and LinkedIn then share the same expertise instead of competing for leftover time.',
        'The reverse is also true. A strong application page or case study is already a LinkedIn post waiting for a shorter cut.',
      ),
    ),
    titleBlock('A Practical Content Framework'),
    contentBlock(
      ul([
        'One application or problem per post.',
        'One concrete detail from real work, without inventing metrics.',
        'A link to the page that holds the full context.',
        'A mix of company-page posts and a small number of expert posts that say the same thing.',
        'A monthly pass that turns recent projects and articles into shorter updates, not a daily quota.',
      ]),
    ),
    titleBlock('Conclusion'),
    contentBlock(
      p(
        'LinkedIn helps manufacturing companies when it shows how they think about real technical work, and when that work is also recorded on the website. Authority accumulates from specific, connected explanations. It does not accumulate from follower targets.',
      ),
    ),
    ctaBlock(
      'Turn your manufacturing expertise into a B2B content system',
      'If projects and case studies never leave the PDF, start by putting them on the site and cutting them into posts engineers can actually use.',
      '/services/marketing-strategy',
      'Marketing strategy',
    ),
  ],
  meta: {
    title: 'LinkedIn for B2B Manufacturing | Industrial Marketing',
    description:
      'How manufacturing companies can use LinkedIn to build technical authority, reach engineers and buyers, and connect social content with their website and SEO strategy.',
    image: imageId,
  },
})

const loadImage = (filename: string) => {
  const filepath = path.join(IMAGE_DIR, filename)
  const data = readFileSync(filepath)
  return {
    name: filename,
    data,
    mimetype: 'image/jpeg',
    size: data.byteLength,
  }
}

const charCount = (blocks: { blockType: string; columns?: { richText?: unknown }[] }[]) => {
  const htmlish = JSON.stringify(blocks)
  return htmlish.length
}

const main = async () => {
  const dry = process.argv.includes('--dry')
  const payload = await getPayload({ config })

  const existingPosts = await payload.find({
    collection: 'posts',
    depth: 0,
    limit: 50,
    pagination: false,
    overrideAccess: true,
    select: { id: true, slug: true, title: true, _status: true },
  })
  payload.logger.info(
    `Current posts: ${existingPosts.docs.map((doc) => `${doc.id}:${doc.slug}:${doc._status}`).join(' | ')}`,
  )

  const requiredCategoryIds = [...new Set([...CATEGORIES.geo, ...CATEGORIES.ads, ...CATEGORIES.linkedin])]
  const categoryDocs = await payload.find({
    collection: 'categories',
    depth: 0,
    limit: requiredCategoryIds.length,
    pagination: false,
    overrideAccess: true,
    where: { id: { in: requiredCategoryIds } },
    select: { id: true, slug: true, title: true },
  })
  const foundCategoryIds = new Set(categoryDocs.docs.map((doc) => Number(doc.id)))
  const missingCategories = requiredCategoryIds.filter((id) => !foundCategoryIds.has(id))
  if (missingCategories.length > 0) {
    throw new Error(`Missing category IDs: ${missingCategories.join(', ')}`)
  }
  for (const doc of categoryDocs.docs) {
    payload.logger.info(`Category ${doc.id}: ${doc.slug} (${doc.title})`)
  }

  for (const test of TEST_POSTS) {
    const found = existingPosts.docs.find((doc) => String(doc.id) === String(test.id))
    if (!found) {
      payload.logger.warn(`Test post id=${test.id} already gone`)
      continue
    }
    if (found.slug !== test.slug || found.title !== test.title) {
      throw new Error(
        `Refusing to delete id=${test.id}: expected slug=${test.slug} title=${test.title}, found slug=${found.slug} title=${found.title}`,
      )
    }
  }

  if (dry) {
    payload.logger.info('Dry run: would delete test posts 3, 4, 6 and create three expert articles.')
    process.exit(0)
  }

  for (const test of TEST_POSTS) {
    const found = existingPosts.docs.find((doc) => String(doc.id) === String(test.id))
    if (!found) continue
    await payload.delete({
      collection: 'posts',
      id: test.id,
      overrideAccess: true,
      context: { disableRevalidate: true },
    })
    payload.logger.info(`Deleted test post ${test.id} (${test.slug})`)
  }

  const upload = async (filename: string, alt: string, caption: string) => {
    const existing = await payload.find({
      collection: 'media',
      where: { filename: { equals: filename } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    if (existing.docs[0]) {
      payload.logger.info(`Reusing media ${existing.docs[0].id} (${filename})`)
      return existing.docs[0]
    }
    const created = await payload.create({
      collection: 'media',
      data: {
        alt,
        caption: rt(p(caption)),
      },
      file: loadImage(filename),
      overrideAccess: true,
      context: { disableRevalidate: true },
    })
    payload.logger.info(`Created media ${created.id} ${created.filename}`)
    return created
  }

  const geoImage = await upload(
    'blog-ai-search-b2b.jpg',
    'Technical drawings and industrial components on a table in a factory office, used as editorial art for an article on AI search and GEO.',
    'Editorial photograph for AI Search Optimization for B2B Companies.',
  )
  const adsImage = await upload(
    'blog-google-ads-manufacturing.jpg',
    'Manufacturing control room with production documents and unmarked screens, used as editorial art for an article on Google Ads for manufacturers.',
    'Editorial photograph for Google Ads for Manufacturers.',
  )
  const liImage = await upload(
    'blog-linkedin-b2b-manufacturing.jpg',
    'Engineers reviewing a machined metal part in a workshop, used as editorial art for an article on LinkedIn for B2B manufacturing.',
    'Editorial photograph for LinkedIn for B2B Manufacturing.',
  )

  const payloads = [
    articleGeo(Number(geoImage.id)),
    articleAds(Number(adsImage.id)),
    articleLinkedin(Number(liImage.id)),
  ]

  const createdIds: (number | string)[] = []
  for (const data of payloads) {
    const existing = await payload.find({
      collection: 'posts',
      where: { slug: { equals: data.slug } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    const payloadData = data as never
    if (existing.docs[0]) {
      const updated = await payload.update({
        collection: 'posts',
        id: existing.docs[0].id,
        data: payloadData,
        draft: false,
        overrideAccess: true,
        context: { disableRevalidate: true },
      })
      createdIds.push(updated.id)
      payload.logger.info(`Updated post ${updated.id}: ${getPostUrl(updated)}`)
    } else {
      const created = await payload.create({
        collection: 'posts',
        data: payloadData,
        draft: false,
        overrideAccess: true,
        context: { disableRevalidate: true },
      })
      createdIds.push(created.id)
      payload.logger.info(`Created post ${created.id}: ${getPostUrl(created)} chars~${charCount(data.layout)}`)
    }
  }

  if (createdIds.length === 3) {
    await payload.update({
      collection: 'posts',
      id: createdIds[0],
      data: { relatedPosts: [createdIds[1], createdIds[2]] } as never,
      draft: false,
      overrideAccess: true,
      context: { disableRevalidate: true },
    })
    await payload.update({
      collection: 'posts',
      id: createdIds[1],
      data: { relatedPosts: [createdIds[0], createdIds[2]] } as never,
      draft: false,
      overrideAccess: true,
      context: { disableRevalidate: true },
    })
    await payload.update({
      collection: 'posts',
      id: createdIds[2],
      data: { relatedPosts: [createdIds[0], createdIds[1]] } as never,
      draft: false,
      overrideAccess: true,
      context: { disableRevalidate: true },
    })
  }

  process.exit(0)
}

void main().catch((error) => {
  console.error(error)
  process.exit(1)
})
