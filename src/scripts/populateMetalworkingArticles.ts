import 'dotenv/config'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { generateJSON } from '@tiptap/html'
import config from '@payload-config'
import { getPayload, type Payload } from 'payload'
import sharp from 'sharp'

import { METALWORKING_ARTICLES, type MetalArticle } from './content/metalworkingArticles'
import { getPostUrl } from '../utilities/getContentUrls'
import { getTiptapExtensions } from '../utilities/richText/extensions'

/**
 * Publishes five expert metalworking articles that strengthen
 * /industrial/metalworking-metal-manufacturing.
 * Creates the blog category if missing. Re-runnable by slug.
 */

const MEDIA_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../public/media')
const context = { disableRevalidate: true, disableCategorySeo: true }

const EXPERT = 'Maryan Polyak'
const EXPERT_ROLE = 'Manufacturing Expert'

const PRIMARY_BLOG_CATEGORY = {
  title: 'Metalworking & Metal Manufacturing',
  slug: 'metalworking-metal-manufacturing',
  category_long_title: 'Metalworking and Metal Manufacturing Insights for Industrial Buyers',
  description:
    'Expert articles on metal fabrication, metal structures, CNC machining, industrial welding and supplier selection for manufacturing buyers and engineers.',
}

const INDUSTRIAL_HREFS = [
  '/industrial/metalworking-metal-manufacturing',
  '/industrial/metalworking-metal-manufacturing/metal-fabrication',
  '/industrial/metalworking-metal-manufacturing/laser-manufacturing',
  '/industrial/metalworking-metal-manufacturing/sheet-metal-metal-forming',
  '/industrial/metalworking-metal-manufacturing/welding-heavy-fabrication',
  '/industrial/metalworking-metal-manufacturing/cnc-precision-machining',
  '/industrial/metalworking-metal-manufacturing/surface-finishing-coatings',
] as const

const rt = (html: string) => generateJSON(html, getTiptapExtensions({ headingLevels: [2, 3, 4] }))
const rtHero = (html: string) =>
  generateJSON(html, getTiptapExtensions({ headingLevels: [1, 2, 3, 4] }))

const escapeHtml = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const paragraphs = (...texts: string[]) => texts.map((text) => `<p>${escapeHtml(text)}</p>`).join('')

const visibleText = (html: string) =>
  html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

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

const faqBlock = (items: MetalArticle['faq']) => {
  const html = items
    .map(
      (item) =>
        `<h3>${escapeHtml(item.question)}</h3><p>${escapeHtml(item.answer)}</p>`,
    )
    .join('')
  return {
    blockType: 'postFAQBlock' as const,
    postFAQTitle: 'Frequently asked questions',
    postFAQText: rt(html),
  }
}

const commentsBlock = (article: MetalArticle) => {
  const comments: Array<{
    author: string
    role: string
    date: string
    depth: number
    isExpert: boolean
    body: ReturnType<typeof rt>
  }> = []

  for (const exchange of article.discussion) {
    comments.push({
      author: exchange.buyerAuthor,
      role: exchange.buyerRole,
      date: exchange.buyerDate,
      depth: 0,
      isExpert: false,
      body: rt(paragraphs(...exchange.buyerBody)),
    })
    comments.push({
      author: EXPERT,
      role: EXPERT_ROLE,
      date: exchange.expertDate,
      depth: 1,
      isExpert: true,
      body: rt(paragraphs(...exchange.expertBody)),
    })
  }

  return {
    blockType: 'postCommentsBlock' as const,
    postCommentTitle: 'Expert discussion',
    comments,
  }
}

const ctaBlock = () => ({
  blockType: 'cta' as const,
  richText: rtHero(
    `<h2>${escapeHtml('Need metalworking or metal manufacturing support?')}</h2>` +
      paragraphs(
        'Review the Metalworking & Metal Manufacturing industry page for process capabilities, or talk through a drawing, batch size and delivery requirement.',
      ),
  ),
  links: [
    {
      link: {
        type: 'custom' as const,
        newTab: false,
        url: '/industrial/metalworking-metal-manufacturing',
        label: 'Metalworking & Metal Manufacturing',
        appearance: 'default' as const,
      },
    },
  ],
})

const bodyCharacterCount = (article: MetalArticle) =>
  visibleText(article.sections.map((section) => section.html).join(' ')).length

const requireId = (map: Map<string, { id: number | string }>, slug: string) => {
  const doc = map.get(slug)
  if (!doc) throw new Error(`Missing id for ${slug}`)
  return Number(doc.id)
}

const idsBySlug = async (
  payload: Payload,
  collection: 'categories' | 'site-categories' | 'industries',
  slugs: string[],
) => {
  const unique = [...new Set(slugs)]
  const found = await payload.find({
    collection,
    depth: 0,
    limit: Math.max(unique.length, 1),
    overrideAccess: true,
    pagination: false,
    where: { slug: { in: unique } },
  })
  const map = new Map(found.docs.map((doc) => [String(doc.slug), doc]))
  const missing = unique.filter((slug) => !map.has(slug))
  if (missing.length) throw new Error(`Missing ${collection}: ${missing.join(', ')}`)
  return map
}

const ensurePrimaryBlogCategory = async (payload: Payload) => {
  const existing = await payload.find({
    collection: 'categories',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: { slug: { equals: PRIMARY_BLOG_CATEGORY.slug } },
  })
  if (existing.docs[0]) {
    payload.logger.info(
      `Blog category exists: ${existing.docs[0].id} ${PRIMARY_BLOG_CATEGORY.slug}`,
    )
    return Number(existing.docs[0].id)
  }

  const created = await payload.create({
    collection: 'categories',
    data: {
      title: PRIMARY_BLOG_CATEGORY.title,
      slug: PRIMARY_BLOG_CATEGORY.slug,
      generateSlug: false,
      category_long_title: PRIMARY_BLOG_CATEGORY.category_long_title,
      category_description: rt(paragraphs(PRIMARY_BLOG_CATEGORY.description)),
      meta: {
        title: 'Metalworking & Metal Manufacturing Articles',
        description: PRIMARY_BLOG_CATEGORY.description,
      },
    },
    overrideAccess: true,
    context,
  })
  payload.logger.info(`Created blog category ${created.id} ${PRIMARY_BLOG_CATEGORY.slug}`)
  return Number(created.id)
}

const prepareImage = async (filename: string) => {
  const source = path.join(MEDIA_DIR, filename)
  const buffer = await sharp(source)
    .rotate()
    .resize({ width: 1800, withoutEnlargement: true })
    .jpeg({ quality: 82 })
    .toBuffer()
  return {
    name: filename,
    data: buffer,
    mimetype: 'image/jpeg' as const,
    size: buffer.byteLength,
  }
}

const main = async () => {
  const payload = await getPayload({ config })

  for (const article of METALWORKING_ARTICLES) {
    if (article.title.includes('\u2014') || article.h1.includes('\u2014')) {
      throw new Error(`${article.slug} title contains an em dash`)
    }
    for (const section of article.sections) {
      if (section.html.includes('\u2014') || section.heading.includes('\u2014')) {
        throw new Error(`${article.slug} section contains an em dash`)
      }
    }
    const chars = bodyCharacterCount(article)
    if (chars < 4000) throw new Error(`${article.slug} body is ${chars} characters`)
    if (!article.sections.some((section) => section.html.includes('/industrial/metalworking-metal-manufacturing'))) {
      throw new Error(`${article.slug} missing contextual Industrial link`)
    }
    if (article.faq.length < 4) throw new Error(`${article.slug} FAQ too short`)
    if (article.discussion.length < 2) throw new Error(`${article.slug} discussion too short`)
    payload.logger.info(`${article.slug} body characters ${chars}`)
  }

  const hrefs = new Set<string>()
  for (const article of METALWORKING_ARTICLES) {
    for (const section of article.sections) {
      for (const match of section.html.matchAll(/href="([^"]+)"/g)) hrefs.add(match[1])
    }
  }
  for (const href of hrefs) {
    if (!href.startsWith('/industrial/')) {
      throw new Error(`Unexpected non-industrial internal link: ${href}`)
    }
    if (!(INDUSTRIAL_HREFS as readonly string[]).includes(href)) {
      throw new Error(`Unverified industrial href: ${href}`)
    }
  }

  const industrySlugs = [
    'metalworking-metal-manufacturing',
    'metal-fabrication',
    'laser-manufacturing',
    'sheet-metal-metal-forming',
    'welding-heavy-fabrication',
    'cnc-precision-machining',
    'surface-finishing-coatings',
  ]
  await idsBySlug(payload, 'industries', industrySlugs)

  await ensurePrimaryBlogCategory(payload)

  const blogSlugs = [
    ...new Set(METALWORKING_ARTICLES.flatMap((article) => article.blogCategorySlugs)),
  ]
  const siteSlugs = [
    ...new Set(METALWORKING_ARTICLES.flatMap((article) => article.siteCategorySlugs)),
  ]
  const categoryMap = await idsBySlug(payload, 'categories', blogSlugs)
  const siteMap = await idsBySlug(payload, 'site-categories', siteSlugs)

  const author = await payload.findByID({
    collection: 'users',
    id: 1,
    depth: 0,
    overrideAccess: true,
  })
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
  const report: Array<Record<string, unknown>> = []

  for (const article of METALWORKING_ARTICLES) {
    const imageId = await upload(article.image, article.alt)
    const chars = bodyCharacterCount(article)
    const publishedAt = `${article.publishedAt}T09:00:00.000Z`
    const primarySlug = article.blogCategorySlugs[0]
    const data = {
      title: article.title,
      postLongTitle: article.h1,
      slug: article.slug,
      generateSlug: false,
      _status: 'published' as const,
      publishedAt,
      authors: [1],
      primary_category: requireId(categoryMap, primarySlug),
      categories: article.blogCategorySlugs.map((slug) => requireId(categoryMap, slug)),
      site_categories: article.siteCategorySlugs.map((slug) => requireId(siteMap, slug)),
      relatedPosts: [],
      hero: {
        type: 'mediumImpact' as const,
        media: imageId,
        richText: rtHero(
          `<h1>${escapeHtml(article.h1)}</h1>${paragraphs(article.previewText)}`,
        ),
      },
      layout: [
        previewBlock(article.previewTitle, article.previewText, imageId),
        ...article.sections.flatMap((section) => [
          titleBlock(section.heading),
          contentBlock(section.html),
        ]),
        faqBlock(article.faq),
        commentsBlock(article),
        ctaBlock(),
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
    const url = getPostUrl(saved)
    payload.logger.info(`${saved.id} ${chars} chars ${publishedAt} ${url}`)
    report.push({
      id: saved.id,
      slug: article.slug,
      url,
      chars,
      publishedAt,
      faq: article.faq.length,
      discussionExchanges: article.discussion.length,
      blogCategories: article.blogCategorySlugs,
      siteCategories: article.siteCategorySlugs,
      imageId,
    })
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

  console.log(JSON.stringify({ ok: true, posts: report }, null, 2))
  process.exit(0)
}

void main().catch((error) => {
  console.error(error)
  process.exit(1)
})
