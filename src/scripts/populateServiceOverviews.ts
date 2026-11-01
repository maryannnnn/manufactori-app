import 'dotenv/config'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { generateJSON } from '@tiptap/html'
import config from '@payload-config'
import { getPayload } from 'payload'

import { getTiptapExtensions } from '../utilities/richText/extensions'

/**
 * Publishes six service overview pages and leaves existing service URLs unchanged.
 */

const DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'content/services')
const context = { disableCategorySeo: true }

const rt = (html: string) => generateJSON(html, getTiptapExtensions({ headingLevels: [2, 3, 4] }))

const escapeHtml = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const plain = (html: string) =>
  html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim()

const PAGES = [
  { file: 'strategy.html', slug: 'strategy', order: 41 },
  { file: 'website.html', slug: 'website', order: 42 },
  { file: 'search.html', slug: 'search', order: 43 },
  { file: 'paid.html', slug: 'paid-media', order: 44 },
  { file: 'content.html', slug: 'content', order: 45 },
  { file: 'sales.html', slug: 'sales', order: 46 },
] as const

type Card = { title: string; href: string | null; text: string }

const parse = (file: string) => {
  const raw = readFileSync(path.join(DIR, file), 'utf8').trim()
  if (/[\u2013\u2014]/.test(raw)) throw new Error(`${file} contains a dash character`)
  const parts = raw.split(/\n@@/)
  const take = (name: string) => {
    const part = parts.find((item) => item.startsWith(name))
    if (!part) throw new Error(`${file} missing ${name}`)
    return part.slice(name.length).trim()
  }
  const preview = parts[0].trim()
  const body = take('body')
  const together = take('together')
  const meta = take('meta').split('\n')
  const cards: Card[] = take('cards')
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      const [title, href, text] = line.split(' || ')
      if (!title || !href || !text) throw new Error(`Bad card in ${file}: ${line}`)
      return { title: title.trim(), href: href.trim() === '-' ? null : href.trim(), text: text.trim() }
    })
  const [metaTitle, metaDescription, h1, navTitle, imageFile, ctaLabel, ...ctaRest] = meta
  const ctaBody = ctaRest.join(' ').trim()
  const previewCount = plain(preview).length
  const bodyCount = plain(body).length
  if (previewCount < 300 || previewCount > 500) {
    throw new Error(`${file} preview ${previewCount}`)
  }
  if (bodyCount < 2000 || bodyCount > 3000) throw new Error(`${file} body ${bodyCount}`)
  if (!metaTitle || metaTitle.length < 50 || metaTitle.length > 60) {
    throw new Error(`${file} title ${metaTitle?.length}`)
  }
  if (!metaDescription || metaDescription.length < 140 || metaDescription.length > 160) {
    throw new Error(`${file} description ${metaDescription?.length}`)
  }
  for (const card of cards) {
    if (card.text.length < 150 || card.text.length > 250) {
      throw new Error(`${file} card ${card.text.length} ${card.title}`)
    }
  }
  return {
    preview,
    body,
    together,
    cards,
    metaTitle,
    metaDescription,
    h1,
    navTitle,
    imageFile,
    ctaLabel,
    ctaBody,
    previewCount,
    bodyCount,
  }
}

const main = async () => {
  const pages = PAGES.map((page) => ({ ...page, ...parse(page.file) }))
  const payload = await getPayload({ config })

  const hrefs = [...new Set(pages.flatMap((page) => page.cards.flatMap((card) => (card.href ? [card.href] : []))))]
  for (const href of hrefs) {
    const slug = href.split('/').filter(Boolean).at(-1)
    const found = await payload.find({
      collection: 'services',
      depth: 0,
      limit: 1,
      overrideAccess: true,
      where: { slug: { equals: slug } },
    })
    if (!found.docs[0]) throw new Error(`Missing service for ${href}`)
  }

  for (const page of pages) {
    const media = await payload.find({
      collection: 'media',
      depth: 0,
      limit: 1,
      overrideAccess: true,
      where: { filename: { equals: page.imageFile } },
    })
    const image = media.docs[0]
    if (!image) throw new Error(`Missing media ${page.imageFile}`)
    const imageId = Number(image.id)

    const data = {
      title: page.navTitle,
      service_long_title: page.h1,
      service_preview_title: page.navTitle,
      service_preview_description: page.metaDescription,
      service_preview_image: imageId,
      service_card_image: imageId,
      slug: page.slug,
      generateSlug: false,
      _status: 'published' as const,
      featured: false,
      displayOrder: page.order,
      authors: [1],
      introduction: {
        text: rt(page.preview),
        supportingText: rt(page.body),
      },
      serviceScope: page.cards.map((card) => ({
        title: card.title,
        description: rt(
          `<p>${escapeHtml(card.text)}</p>` +
            (card.href ? `<p><a href="${card.href}">View the service page</a></p>` : ''),
        ),
      })),
      layout: [
        {
          blockType: 'content' as const,
          columns: [{ size: 'full' as const, richText: rt(page.together), enableLink: false }],
        },
      ],
      entryOffer: {
        title: 'Talk through a manufacturing marketing project',
        description: rt(`<p>${escapeHtml(page.ctaBody)}</p>`),
        ctaLabel: page.ctaLabel,
        ctaUrl: '/contact',
      },
      meta: {
        title: page.metaTitle,
        description: page.metaDescription,
        image: imageId,
      },
    }

    const existing = await payload.find({
      collection: 'services',
      depth: 0,
      limit: 1,
      overrideAccess: true,
      where: { slug: { equals: page.slug } },
    })
    const saved = existing.docs[0]
      ? await payload.update({
          collection: 'services',
          id: existing.docs[0].id,
          data,
          draft: false,
          overrideAccess: true,
          context,
        })
      : await payload.create({
          collection: 'services',
          data,
          draft: false,
          overrideAccess: true,
          context,
        })
    payload.logger.info(
      `${saved.id} /services/${page.slug} preview ${page.previewCount} body ${page.bodyCount}`,
    )
  }

  process.exit(0)
}

void main().catch((error) => {
  console.error(error)
  process.exit(1)
})
