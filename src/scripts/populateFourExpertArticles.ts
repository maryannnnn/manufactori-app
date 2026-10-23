import 'dotenv/config'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { generateJSON } from '@tiptap/html'
import config from '@payload-config'
import { getPayload } from 'payload'
import sharp from 'sharp'

import { getPostUrl } from '../utilities/getContentUrls'
import { getTiptapExtensions } from '../utilities/richText/extensions'

/**
 * Creates or updates four expert blog posts.
 * Does not edit the earlier articles, invent testimonials, or promise AI citations.
 */
const CONTENT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'content/blog')
const SOURCE_DIR = path.resolve(
  'C:/Users/arsen/.cursor/projects/c-Rabota-React-Manufactori/assets',
)

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

const parseArticle = (filename: string) => {
  const raw = readFileSync(path.join(CONTENT_DIR, filename), 'utf8').trim()
  const parts = raw.split(/\n@@ /)
  const intro = parts[0].trim()
  const sections = parts.slice(1).map((part) => {
    const breakAt = part.indexOf('\n')
    if (breakAt < 0) throw new Error(`Section missing body in ${filename}`)
    return { title: part.slice(0, breakAt).trim(), html: part.slice(breakAt + 1).trim() }
  })
  const words = raw
    .replace(/<[^>]+>/g, ' ')
    .replace(/@@/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length
  return { intro, sections, words }
}

type Article = {
  file: string
  imageFile: string
  alt: string
  title: string
  h1: string
  slug: string
  publishedAt: string
  primary: number
  categories: number[]
  previewTitle: string
  previewText: string
  metaTitle: string
  metaDescription: string
  ctaHeading: string
  ctaBody: string
  ctaLabel: string
}

const SERVICE = '/services/ai-search-optimization-manufacturers'

const ARTICLES: Article[] = [
  {
    file: '01-semantic-chunking.html',
    imageFile: 'blog-content-engineering-semantic-chunking.jpg',
    alt: 'Laptop showing a specification grid, with technical drawings and machined metal parts on an engineering desk.',
    title: 'How to Structure Manufacturing Content for AI Search',
    h1: 'How to Structure Manufacturing Content for AI Search: From Long-Form Copy to Semantic Chunks',
    slug: 'manufacturing-content-engineering-semantic-chunking',
    publishedAt: '2026-10-19T09:00:00.000Z',
    primary: 30,
    categories: [30, 104, 28],
    previewTitle: 'Structure Manufacturing Content for AI Search',
    previewText:
      'How to reorganize product pages into clear technical sections so buyers and search systems can read specifications, applications, and limits.',
    metaTitle: 'How to Structure Manufacturing Content for AI Search',
    metaDescription:
      'Organize manufacturing product pages into clear technical sections. Semantic chunking helps buyers and search systems read specifications, applications, and limits.',
    ctaHeading: 'Review one product family first',
    ctaBody:
      'Content engineering starts from the pages and specifications you can already verify. It does not promise that an AI system will cite them.',
    ctaLabel: 'Discuss content engineering',
  },
  {
    file: '02-entity-visibility.html',
    imageFile: 'blog-ai-outreach-entity-visibility.jpg',
    alt: 'Engineer reviewing a technical drawing in a factory office, with a laptop on the desk.',
    title: 'AI Search Visibility for Manufacturers',
    h1: 'AI Search Visibility for Manufacturers: Brand Mentions, Entity Signals, and Digital Authority',
    slug: 'manufacturing-ai-outreach-brand-mentions-entity-visibility',
    publishedAt: '2026-10-20T09:00:00.000Z',
    primary: 104,
    categories: [104, 29, 26],
    previewTitle: 'Brand Mentions and Entity Signals for Manufacturers',
    previewText:
      'How consistent company information, relevant coverage, and third-party references support recognition, without promising AI recommendations.',
    metaTitle: 'AI Search Visibility for Manufacturers',
    metaDescription:
      'How manufacturers build a consistent public identity with relevant mentions, links, and third-party references, without promising AI recommendations.',
    ctaHeading: 'Start with a description you can defend',
    ctaBody:
      'Outreach works when the site and the public record describe the same products, applications, and locations.',
    ctaLabel: 'Discuss entity and outreach priorities',
  },
  {
    file: '03-first-party-data.html',
    imageFile: 'blog-first-party-data-manufacturing.jpg',
    alt: 'Precision-machined steel component on a workbench beside a caliper, a micrometer, and an engineering drawing.',
    title: 'First-Party Data for Manufacturing SEO',
    h1: 'First-Party Data for Manufacturing SEO: How Original Technical Evidence Builds Authority',
    slug: 'manufacturing-first-party-data-information-gain',
    publishedAt: '2026-10-21T09:00:00.000Z',
    primary: 28,
    categories: [28, 30, 104],
    previewTitle: 'First-Party Data for Manufacturing SEO',
    previewText:
      'How measurements, drawings, and application evidence make manufacturing pages more useful, and why originality does not guarantee citations.',
    metaTitle: 'First-Party Data for Manufacturing SEO',
    metaDescription:
      'Use original measurements, drawings, and application evidence on manufacturing websites. Originality helps buyers and does not guarantee AI citations.',
    ctaHeading: 'Publish only what engineering can verify',
    ctaBody:
      'Original technical evidence is useful when the source, date, method, and limits stay attached to the claim.',
    ctaLabel: 'Review what your site can verify',
  },
  {
    file: '04-content-distribution.html',
    imageFile: 'blog-content-distribution-zero-click.jpg',
    alt: 'Industrial sales professional reviewing product documents and a tablet on a factory floor.',
    title: 'Manufacturing Content Distribution in the AI Search Era',
    h1: 'Manufacturing Content Distribution in the AI Search Era: From Zero-Click Visibility to Qualified Leads',
    slug: 'manufacturing-content-distribution-ai-search-zero-click',
    publishedAt: '2026-10-22T09:00:00.000Z',
    primary: 33,
    categories: [33, 26, 104],
    previewTitle: 'Content Distribution and Zero-Click Search',
    previewText:
      'How manufacturers distribute technical content for high-intent queries and qualified inquiries when some searches never become a visit.',
    metaTitle: 'Manufacturing Content Distribution and Zero-Click Search',
    metaDescription:
      'Distribute technical manufacturing content for high-intent queries and qualified inquiries. Traffic alone is an incomplete measure of performance.',
    ctaHeading: 'Measure inquiries, not only visits',
    ctaBody:
      'A content review can show which specifications and quote paths are missing. It cannot promise a recovered share of traffic.',
    ctaLabel: 'Map high-intent content gaps',
  },
]

const prepareImage = async (filename: string) => {
  const source = path.join(SOURCE_DIR, filename)
  const buffer = await sharp(source)
    .rotate()
    .resize({ width: 1800, withoutEnlargement: true })
    .jpeg({ quality: 86 })
    .toBuffer()
  return { name: filename, data: buffer, mimetype: 'image/jpeg' as const, size: buffer.byteLength }
}

const main = async () => {
  const payload = await getPayload({ config })

  const upload = async (filename: string, alt: string) => {
    const file = await prepareImage(filename)
    const caption = rt(
      paragraphs(
        'Editorial image for this article. Not a photograph of a client facility or a client project.',
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
        context: { disableRevalidate: true },
      })
      return Number(updated.id)
    }
    const created = await payload.create({
      collection: 'media',
      data: { alt, caption },
      file,
      overrideAccess: true,
      context: { disableRevalidate: true },
    })
    return Number(created.id)
  }

  const ids: number[] = []
  for (const article of ARTICLES) {
    const parsed = parseArticle(article.file)
    if (parsed.words < 1700) {
      throw new Error(`${article.slug} is only ${parsed.words} words`)
    }
    const imageId = await upload(article.imageFile, article.alt)
    const data = {
      title: article.title,
      postLongTitle: article.h1,
      slug: article.slug,
      generateSlug: false,
      _status: 'published' as const,
      publishedAt: article.publishedAt,
      authors: [1],
      primary_category: article.primary,
      categories: article.categories,
      relatedPosts: [],
      hero: {
        type: 'mediumImpact' as const,
        media: imageId,
        richText: rtHero(`<h1>${escapeHtml(article.h1)}</h1>${parsed.intro}`),
      },
      layout: [
        previewBlock(article.previewTitle, article.previewText, imageId),
        ...parsed.sections.flatMap((section) => [
          titleBlock(section.title),
          contentBlock(section.html),
        ]),
        ctaBlock(article.ctaHeading, article.ctaBody, SERVICE, article.ctaLabel),
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
          context: { disableRevalidate: true },
        })
      : await payload.create({
          collection: 'posts',
          data,
          draft: false,
          overrideAccess: true,
          context: { disableRevalidate: true },
        })
    ids.push(Number(saved.id))
    payload.logger.info(`${saved.id} ${parsed.words} words ${getPostUrl(saved)}`)
  }

  for (let index = 0; index < ids.length; index += 1) {
    const related = ids.filter((_, other) => other !== index)
    await payload.update({
      collection: 'posts',
      id: ids[index],
      data: { relatedPosts: related },
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
