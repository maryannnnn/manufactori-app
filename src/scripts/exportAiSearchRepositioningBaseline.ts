import 'dotenv/config'

import { mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'

import config from '@payload-config'
import { getPayload, type Payload } from 'payload'

const OUT = path.resolve('docs/ai-search-repositioning/backups/2026-10-22-baseline')

const textOf = (value: unknown): string => {
  if (value == null) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (Array.isArray(value)) return value.map(textOf).filter(Boolean).join('\n')
  if (typeof value === 'object') {
    const record = value as Record<string, unknown>
    const own = typeof record.text === 'string' ? record.text : ''
    const nested = record.root ?? record.children ?? record.content
    const block = nested ? textOf(nested) : ''
    const breakAfter = record.type === 'paragraph' || record.type === 'heading' ? '\n' : ''
    return `${own}${block}${breakAfter}`
  }
  return ''
}

const slim = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(slim)
  if (!value || typeof value !== 'object') return value
  const record = value as Record<string, unknown>
  if (typeof record.filename === 'string' && (typeof record.url === 'string' || typeof record.mimeType === 'string')) {
    return { id: record.id, filename: record.filename, alt: record.alt ?? null }
  }
  const next: Record<string, unknown> = {}
  for (const [key, item] of Object.entries(record)) {
    if (key === 'sizes' || key === 'thumbnailURL') continue
    next[key] = slim(item)
  }
  return next
}

const write = (name: string, data: unknown) => {
  writeFileSync(path.join(OUT, name), `${JSON.stringify(data, null, 2)}\n`, 'utf8')
}

const load = async (payload: Payload, collection: 'pages' | 'services' | 'case-studies' | 'posts') => {
  const result = await payload.find({
    collection,
    depth: 1,
    draft: true,
    limit: 200,
    overrideAccess: true,
    pagination: false,
  })
  return result.docs.map((doc) => slim(doc))
}

const run = async () => {
  mkdirSync(OUT, { recursive: true })
  const payload = await getPayload({ config })
  const pages = await load(payload, 'pages')
  const services = await load(payload, 'services')
  const cases = await load(payload, 'case-studies')
  const posts = await load(payload, 'posts')

  write('pages.json', pages)
  write('services.json', services)
  write('case-studies.json', cases)
  write(
    'posts.json',
    posts.map((post) => {
      const doc = post as Record<string, unknown>
      return {
        id: doc.id,
        title: doc.title,
        slug: doc.slug,
        _status: doc._status,
        publishedAt: doc.publishedAt,
        updatedAt: doc.updatedAt,
        meta: doc.meta,
        categories: doc.categories,
      }
    }),
  )

  const lines: string[] = []
  const add = (line: string) => lines.push(line)

  add('# SERVICES')
  for (const service of services as Array<Record<string, unknown>>) {
    const intro = service.introduction as { text?: string; supportingText?: unknown } | undefined
    add(`\n## [${service.id}] ${service.title} | ${service.slug} | ${service._status}`)
    add(`long: ${service.service_long_title ?? ''}`)
    add(`content title: ${service.service_content_title ?? ''}`)
    add(`preview: ${service.service_preview_title ?? ''}`)
    add(String(service.service_preview_description ?? ''))
    add(`intro: ${intro?.text ?? ''}`)
    add(textOf(intro?.supportingText).slice(0, 1200))
    const scopes = Array.isArray(service.serviceScope) ? service.serviceScope : []
    for (const scope of scopes as Array<Record<string, unknown>>) {
      add(`SCOPE ${scope.title}: ${String(scope.description ?? '').slice(0, 400)}`)
    }
    const outcomes = Array.isArray(service.expectedOutcomes) ? service.expectedOutcomes : []
    for (const outcome of outcomes as Array<Record<string, unknown>>) {
      add(`OUTCOME ${outcome.title}: ${String(outcome.description ?? '').slice(0, 240)}`)
    }
    const faq = service.faq as { items?: Array<Record<string, unknown>> } | undefined
    for (const item of faq?.items ?? []) {
      add(`FAQ ${item.question}`)
    }
    const meta = service.meta as { title?: string; description?: string } | undefined
    add(`META ${meta?.title ?? ''} || ${meta?.description ?? ''}`)
  }

  add('\n# CASES')
  for (const item of cases as Array<Record<string, unknown>>) {
    const meta = item.meta as { title?: string; description?: string } | undefined
    const primary = item.primary_case_study_category
    const primarySlug =
      primary && typeof primary === 'object' ? (primary as { slug?: string; title?: string }).slug : primary
    const primaryTitle =
      primary && typeof primary === 'object' ? (primary as { title?: string }).title : ''
    const categories = Array.isArray(item.case_study_categories)
      ? item.case_study_categories
          .map((category) =>
            category && typeof category === 'object'
              ? (category as { slug?: string }).slug
              : String(category),
          )
          .join(', ')
      : ''
    const metrics = Array.isArray(item.metrics)
      ? item.metrics
          .map((metric) => {
            const row = metric as { value?: string; label?: string }
            return `${row.value ?? ''} ${row.label ?? ''}`.trim()
          })
          .filter(Boolean)
          .join(' | ')
      : ''
    const ai = item.aiSearchOptimization as
      | { brandAuthorityAndTrust?: unknown; entityAndGeoStructure?: unknown }
      | undefined
    const challenge = item.businessChallenge as { challenge?: unknown; initialState?: unknown } | undefined
    add(`\n## [${item.id}] ${item.title} | ${item.slug} | ${item._status}`)
    add(`url-primary: ${primarySlug} (${primaryTitle})`)
    add(`categories: ${categories}`)
    add(`duration: ${item.duration ?? ''}`)
    add(`metrics: ${metrics}`)
    add(`META ${meta?.title ?? ''} || ${meta?.description ?? ''}`)
    add(`CHALLENGE ${textOf(challenge?.challenge).replace(/\s+/g, ' ').slice(0, 500)}`)
    add(`SEO ${textOf((item.marketingStrategy as { seoAndContentStrategy?: unknown } | undefined)?.seoAndContentStrategy).replace(/\s+/g, ' ').slice(0, 400)}`)
    add(`AI-AUTHORITY ${textOf(ai?.brandAuthorityAndTrust).replace(/\s+/g, ' ').slice(0, 350)}`)
    add(`AI-ENTITY ${textOf(ai?.entityAndGeoStructure).replace(/\s+/g, ' ').slice(0, 350)}`)
  }

  add('\n# PAGES')
  for (const page of pages as Array<Record<string, unknown>>) {
    const meta = page.meta as { title?: string; description?: string } | undefined
    add(`\n## [${page.id}] ${page.title} | ${page.slug} | ${page._status} | long=${page.pageLongTitle ?? ''}`)
    add(`META ${meta?.title ?? ''} || ${meta?.description ?? ''}`)
    add(textOf(page.hero).replace(/\s+/g, ' ').slice(0, 400))
    add(textOf(page.layout).replace(/\s+/g, ' ').slice(0, 1800))
  }

  writeFileSync(path.join(OUT, 'digest.txt'), lines.join('\n'), 'utf8')
  payload.logger.info(`Wrote baseline to ${OUT}`)
  process.exit(0)
}

void run().catch((error) => {
  console.error(error)
  process.exit(1)
})
