import 'dotenv/config'

import { generateJSON } from '@tiptap/html'
import config from '@payload-config'
import { getPayload } from 'payload'

import { getTiptapExtensions } from '../utilities/richText/extensions'

const rt = (html: string) => generateJSON(html, getTiptapExtensions({ headingLevels: [2, 3, 4] }))

const ABOUT_HTML = `
<h2>Digital systems that bring commercial inquiries</h2>
<p>Maryan Polyak helps manufacturing and industrial companies build digital systems that bring in prospects with real commercial inquiries.</p>
<p>Many manufacturers have strong technical expertise, while the website and marketing do not reflect the full range and what the plant can actually do. A company may make different products, work in several directions, and serve different markets. Buyers then struggle to find the solution they need.</p>
<h2>The work</h2>
<p>Maryan works with manufacturers of metal structures, facade systems, industrial equipment, engineering systems, heating equipment, and other specialized products.</p>
<p>The work includes analysis of production and commercial lines, website structure, catalogs and online stores, technical content, and promotion.</p>
<p>Promotion covers SEO, Google Ads, social advertising, content development, link acquisition, and work on external platforms.</p>
<p>These parts are meant to work together, so each product or commercial line can reach its own audience.</p>
<h2>How an engagement is organized</h2>
<p>The first step is to understand what the company actually makes and sells, which markets it serves, and what the business needs to accomplish.</p>
<p>The website structure, the content of the pages, and the approach to promotion are decided from that.</p>
<p>Many projects continue for years, because the product range changes and new markets and lines of business appear.</p>
<p>Read the <a href="/case-studies">case studies</a>, then we can discuss how to improve your current website and marketing.</p>
`.trim()

const PREVIEWS: Record<string, string> = {
  'marketing-strategy-roadmap':
    'A practical plan with priorities, a budget, stages of work, and clear ownership.\n\nUseful for manufacturers with several lines of business, different buyer groups, and unclear marketing priorities.\n\nPractical result: a sequence the company can act on. It is not a promise of a set number of inquiries or sales.',
  'website-design-development-for-manufacturers':
    'Corporate websites, product catalogs, and online stores built for engineers, procurement teams, and other B2B buyers. The site should help people find products, read technical information, and send a request for quotation.\n\nUseful when the current site does not represent the real range or give buyers a clear way to inquire.\n\nPractical result: a site organized around the products, markets, and commercial paths the company actually has.',
  'seo-ai-search-optimization':
    'Technical optimization, keyword research, site structure, and content so buyers can find the company by its products, technical capabilities, and applications. The work covers conventional search engines and AI tools, including ChatGPT and Perplexity.\n\nUseful when the range is hard to discover in search.\n\nPractical result: clearer visibility for real products and applications. It is not a ranking or traffic guarantee.',
  'technical-content-thought-leadership':
    'Product pages, technical articles, application descriptions, case material, and expert pieces based on what the company actually knows.\n\nUseful when buyers need to understand specifications and how a product is used in practice.\n\nPractical result: content that explains the product, its characteristics, and its applications, without invented claims.',
  'lead-generation':
    'Paid search, LinkedIn, and other fitting channels, aimed at commercially meaningful inquiries rather than visitor counts alone.\n\nUseful when the company needs more relevant conversations with buyers who have a real requirement.\n\nPractical result: campaigns pointed at inquiries the sales process can handle. It does not guarantee a volume of leads.',
  'sales-enablement-crm':
    'A way to collect inquiries, pass them to the right people, track where they came from, and work with prospects.\n\nUseful when marketing activity and the sales process are not connected.\n\nPractical result: a clearer handoff from marketing to sales. It does not guarantee a close rate.',
}

const payload = await getPayload({ config })

const about = await payload.find({
  collection: 'pages',
  depth: 0,
  draft: false,
  limit: 1,
  overrideAccess: true,
  where: { slug: { equals: 'about' } },
})
const page = about.docs[0]
if (!page) throw new Error('About page not found')

const layout = (page.layout ?? []).map((block) => {
  if (block.blockType !== 'content') return block
  const columns = block.columns ?? []
  const [first, ...rest] = columns
  const column = first ?? { size: 'full' as const }
  return {
    ...block,
    columns: [{ ...column, richText: rt(ABOUT_HTML) }, ...rest],
  }
})

const updatedPage = await payload.update({
  collection: 'pages',
  id: page.id,
  data: {
    layout,
    _status: 'published',
  },
  draft: false,
  overrideAccess: true,
  context: { disableRevalidate: true },
})

payload.logger.info(
  `about slug=${updatedPage.slug} title=${updatedPage.meta?.title} status=${updatedPage._status}`,
)

for (const [slug, description] of Object.entries(PREVIEWS)) {
  const found = await payload.find({
    collection: 'services',
    depth: 0,
    draft: false,
    limit: 1,
    overrideAccess: true,
    where: { slug: { equals: slug } },
    select: { slug: true, meta: true, title: true },
  })
  const doc = found.docs[0]
  if (!doc) throw new Error(`service not found: ${slug}`)
  const updated = await payload.update({
    collection: 'services',
    id: doc.id,
    data: {
      service_preview_description: description,
      _status: 'published',
    },
    draft: false,
    overrideAccess: true,
    context: { disableRevalidate: true },
  })
  payload.logger.info(
    `service ${slug} metaSame=${updated.meta?.title === doc.meta?.title} status=${updated._status}`,
  )
}

process.exit(0)
