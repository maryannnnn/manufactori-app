import type { CaseStudy, Media, Page, Post, Service } from '@/payload-types'

import { resolveMediaSource } from './getMediaUrl'
import {
  BLOG_ARCHIVE_PATH,
  CASE_STUDIES_ARCHIVE_PATH,
  getCaseStudyCategoryUrl,
  getCaseStudyUrl,
  getCategoryUrl,
  getPostUrl,
  getServiceUrl,
  SERVICES_ARCHIVE_PATH,
} from './getContentUrls'
import { richTextToPlainText } from './richText/toPlainText'
import {
  ORGANIZATION_DESCRIPTION,
  ORGANIZATION_NAME,
  SITE_NAME,
  absoluteUrl,
  entityId,
} from './siteIdentity'

type JsonLdNode = Record<string, unknown>
type FaqItem = { question?: string | null; answer?: unknown }
type BreadcrumbItem = { name: string; path: string }

const ORGANIZATION_ID = entityId('organization')
const WEBSITE_ID = entityId('website')

const prune = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    const next = value.map(prune).filter((item) => item != null && item !== '')
    return next.length ? next : undefined
  }

  if (value && typeof value === 'object') {
    const next: JsonLdNode = {}
    for (const [key, item] of Object.entries(value)) {
      const pruned = prune(item)
      if (pruned !== undefined && pruned !== '') next[key] = pruned
    }
    return Object.keys(next).length ? next : undefined
  }

  return value ?? undefined
}

export const jsonLdGraph = (nodes: JsonLdNode[]): JsonLdNode => {
  const graph = nodes.map((node) => prune(node)).filter(Boolean) as JsonLdNode[]
  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  }
}

export const absoluteMediaUrl = (
  image?: Media | number | string | null,
): string | undefined => {
  if (!image || typeof image !== 'object' || !('url' in image || 'filename' in image)) {
    return undefined
  }

  const { src } = resolveMediaSource(image, ['og', 'large', 'medium'])
  const path = src.split('?')[0]
  if (!path) return undefined
  return /^https?:\/\//i.test(path) ? path : absoluteUrl(path)
}

const faqEntities = (items: FaqItem[] | null | undefined) => {
  return (items ?? []).flatMap((item) => {
    const question = item.question?.trim()
    const answer = richTextToPlainText(item.answer)
    if (!question || !answer) return []
    return [
      {
        '@type': 'Question',
        name: question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: answer,
        },
      },
    ]
  })
}

const reviewNode = (
  testimonial:
    | {
        quote?: unknown
        author?: string | null
        position?: string | null
        company?: string | null
      }
    | null
    | undefined,
  itemReviewedId: string,
) => {
  const body = richTextToPlainText(testimonial?.quote)
  const author = testimonial?.author?.trim()
  if (!body || !author || !testimonial) return null

  const position = testimonial.position
  const company = testimonial.company

  return {
    '@type': 'Review',
    reviewBody: body,
    author: {
      '@type': 'Person',
      name: author,
      ...(position || company
        ? {
            jobTitle: position || undefined,
            worksFor: company ? { '@type': 'Organization', name: company } : undefined,
          }
        : {}),
    },
    itemReviewed: { '@id': itemReviewedId },
  }
}

export const organizationNode = (): JsonLdNode => ({
  '@type': 'Organization',
  '@id': ORGANIZATION_ID,
  name: ORGANIZATION_NAME,
  alternateName: SITE_NAME,
  url: absoluteUrl('/'),
  description: ORGANIZATION_DESCRIPTION,
})

export const websiteNode = (): JsonLdNode => ({
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  name: SITE_NAME,
  url: absoluteUrl('/'),
  description: ORGANIZATION_DESCRIPTION,
  publisher: { '@id': ORGANIZATION_ID },
  inLanguage: 'en-US',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${absoluteUrl('/search')}?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
})

export const breadcrumbListNode = (items: BreadcrumbItem[]): JsonLdNode | null => {
  if (items.length === 0) return null

  return {
    '@type': 'BreadcrumbList',
    '@id': `${absoluteUrl(items[items.length - 1]?.path || '/')}#breadcrumb`,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

const webPageNode = (args: {
  path: string
  name: string
  description?: string | null
  type?: string
  extra?: JsonLdNode
}): JsonLdNode => ({
  '@type': args.type || 'WebPage',
  '@id': `${absoluteUrl(args.path)}#webpage`,
  url: absoluteUrl(args.path),
  name: args.name,
  description: args.description || undefined,
  isPartOf: { '@id': WEBSITE_ID },
  about: { '@id': ORGANIZATION_ID },
  inLanguage: 'en-US',
  ...args.extra,
})

export const buildWebPageGraph = (args: {
  path: string
  name: string
  description?: string | null
  breadcrumbs?: BreadcrumbItem[]
  type?: string
}): JsonLdNode => {
  const crumbs = args.breadcrumbs ? breadcrumbListNode(args.breadcrumbs) : null
  return jsonLdGraph(
    [
      webPageNode({
        path: args.path,
        name: args.name,
        description: args.description,
        type: args.type,
        extra: crumbs ? { breadcrumb: { '@id': crumbs['@id'] } } : undefined,
      }),
      crumbs,
    ].filter(Boolean) as JsonLdNode[],
  )
}

const caseStudyFaqItems = (doc: CaseStudy): FaqItem[] => {
  return (doc.layout ?? []).flatMap((block) => {
    if (block.blockType !== 'csFAQ') return []
    return block.items ?? []
  })
}

export const buildServiceGraph = (service: Service): JsonLdNode | null => {
  const path = getServiceUrl(service)
  if (!path) return null

  const name = service.service_long_title || service.title
  const description =
    service.meta?.description ||
    richTextToPlainText(service.introduction?.text) ||
    undefined
  const serviceId = `${absoluteUrl(path)}#service`
  const questions = faqEntities(service.faq?.items)
  const review = reviewNode(service.clientTestimonial, serviceId)
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: SERVICES_ARCHIVE_PATH },
    { name: name, path },
  ]
  const breadcrumb = breadcrumbListNode(crumbs)

  return jsonLdGraph(
    [
      webPageNode({
        path,
        name,
        description,
        extra: {
          mainEntity: { '@id': serviceId },
          breadcrumb: breadcrumb ? { '@id': breadcrumb['@id'] } : undefined,
        },
      }),
      {
        '@type': 'Service',
        '@id': serviceId,
        name,
        description,
        url: absoluteUrl(path),
        serviceType: service.title,
        provider: { '@id': ORGANIZATION_ID },
        image: absoluteMediaUrl(
          typeof service.meta?.image === 'object'
            ? service.meta.image
            : typeof service.service_preview_image === 'object'
              ? service.service_preview_image
              : null,
        ),
      },
      questions.length
        ? {
            '@type': 'FAQPage',
            '@id': `${absoluteUrl(path)}#faq`,
            isPartOf: { '@id': `${absoluteUrl(path)}#webpage` },
            mainEntity: questions,
          }
        : null,
      review,
      breadcrumb,
    ].filter(Boolean) as JsonLdNode[],
  )
}

export const buildCaseStudyGraph = (doc: CaseStudy): JsonLdNode | null => {
  const path = getCaseStudyUrl(doc)
  if (!path) return null

  const name = doc.case_study_long_title || doc.title
  const description = doc.meta?.description || undefined
  const articleId = `${absoluteUrl(path)}#article`
  const category =
    typeof doc.primary_case_study_category === 'object' ? doc.primary_case_study_category : null
  const categoryPath = category ? getCaseStudyCategoryUrl(category) : null
  const questions = faqEntities(caseStudyFaqItems(doc))
  const review = reviewNode(doc.clientTestimonial, articleId)
  const authors = (doc.populatedAuthors ?? [])
    .filter((author) => author?.name)
    .map((author) => ({
      '@type': 'Person',
      '@id': entityId(`person-${author.id}`),
      name: author.name,
    }))
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Case Studies', path: CASE_STUDIES_ARCHIVE_PATH },
    ...(category?.title && categoryPath
      ? [{ name: category.title, path: categoryPath }]
      : []),
    { name: name, path },
  ]
  const breadcrumb = breadcrumbListNode(crumbs)
  const image = absoluteMediaUrl(
    typeof doc.meta?.image === 'object' ? doc.meta.image : null,
  )

  return jsonLdGraph(
    [
      webPageNode({
        path,
        name,
        description,
        extra: {
          mainEntity: { '@id': articleId },
          breadcrumb: breadcrumb ? { '@id': breadcrumb['@id'] } : undefined,
        },
      }),
      {
        '@type': 'Article',
        '@id': articleId,
        headline: name,
        description,
        url: absoluteUrl(path),
        image,
        datePublished: doc.publishedAt || undefined,
        dateModified: doc.updatedAt || undefined,
        articleSection: 'Case Study',
        mainEntityOfPage: { '@id': `${absoluteUrl(path)}#webpage` },
        author: authors.length ? authors : { '@id': ORGANIZATION_ID },
        publisher: { '@id': ORGANIZATION_ID },
      },
      questions.length
        ? {
            '@type': 'FAQPage',
            '@id': `${absoluteUrl(path)}#faq`,
            isPartOf: { '@id': `${absoluteUrl(path)}#webpage` },
            mainEntity: questions,
          }
        : null,
      review,
      breadcrumb,
      ...authors,
    ].filter(Boolean) as JsonLdNode[],
  )
}

export const buildBlogPostingGraph = (post: Post): JsonLdNode | null => {
  const path = getPostUrl(post)
  if (!path) return null

  const name = post.postLongTitle || post.title
  const description = post.meta?.description || undefined
  const articleId = `${absoluteUrl(path)}#article`
  const category = typeof post.primary_category === 'object' ? post.primary_category : null
  const categoryPath = category ? getCategoryUrl(category) : null
  const authors = (post.populatedAuthors ?? [])
    .filter((author) => author?.name)
    .map((author) => ({
      '@type': 'Person',
      '@id': entityId(`person-${author.id}`),
      name: author.name,
    }))
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Blog', path: BLOG_ARCHIVE_PATH },
    ...(category?.title && categoryPath
      ? [{ name: category.title, path: categoryPath }]
      : []),
    { name: name, path },
  ]
  const breadcrumb = breadcrumbListNode(crumbs)
  const image = absoluteMediaUrl(
    typeof post.meta?.image === 'object'
      ? post.meta.image
      : post.hero?.media && typeof post.hero.media === 'object'
        ? post.hero.media
        : null,
  )

  return jsonLdGraph(
    [
      webPageNode({
        path,
        name,
        description,
        extra: {
          mainEntity: { '@id': articleId },
          breadcrumb: breadcrumb ? { '@id': breadcrumb['@id'] } : undefined,
        },
      }),
      {
        '@type': 'BlogPosting',
        '@id': articleId,
        headline: name,
        description,
        url: absoluteUrl(path),
        image,
        datePublished: post.publishedAt || undefined,
        dateModified: post.updatedAt || undefined,
        mainEntityOfPage: { '@id': `${absoluteUrl(path)}#webpage` },
        author: authors.length ? authors : { '@id': ORGANIZATION_ID },
        publisher: { '@id': ORGANIZATION_ID },
      },
      breadcrumb,
      ...authors,
    ].filter(Boolean) as JsonLdNode[],
  )
}

export const buildCmsPageGraph = (page: Pick<Page, 'slug' | 'title' | 'pageLongTitle' | 'meta'>): JsonLdNode | null => {
  if (!page.slug || page.slug === 'home') return null
  const path = `/${page.slug}`
  const name = page.pageLongTitle || page.title
  return buildWebPageGraph({
    path,
    name,
    description: page.meta?.description,
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: name, path },
    ],
  })
}

export const serviceArchiveBreadcrumbs = (): BreadcrumbItem[] => [
  { name: 'Home', path: '/' },
  { name: 'Services', path: SERVICES_ARCHIVE_PATH },
]

export const caseStudyArchiveBreadcrumbs = (): BreadcrumbItem[] => [
  { name: 'Home', path: '/' },
  { name: 'Case Studies', path: CASE_STUDIES_ARCHIVE_PATH },
]

export const blogArchiveBreadcrumbs = (): BreadcrumbItem[] => [
  { name: 'Home', path: '/' },
  { name: 'Blog', path: BLOG_ARCHIVE_PATH },
]

export const categoryArchiveBreadcrumbs = (name: string, path: string): BreadcrumbItem[] => [
  { name: 'Home', path: '/' },
  { name: 'Blog', path: BLOG_ARCHIVE_PATH },
  { name, path },
]

export const caseStudyCategoryBreadcrumbs = (name: string, path: string): BreadcrumbItem[] => [
  { name: 'Home', path: '/' },
  { name: 'Case Studies', path: CASE_STUDIES_ARCHIVE_PATH },
  { name, path },
]
