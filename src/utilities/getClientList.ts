import configPromise from '@payload-config'
import { getPayload } from 'payload'

import type { Media } from '@/payload-types'

import { getCaseStudyUrl } from './getContentUrls'
import { CASE_STUDY_ARCHIVE_SORT } from './getCaseStudyList'
import { getCaseStudyListPreview } from './getCaseStudyListPreview'

const PAGE_SIZE = 100

/** First colon, or a spaced dash. Hyphens inside a name are left alone. */
const TITLE_SEPARATOR = /\s*:\s*|\s+[—–-]\s+/

export type ClientCardData = {
  name: string
  description: string | null
  href: string
  logo: Media | null
  fallbackImage: Media | null
}

type ClientCandidate = ClientCardData & {
  companyKey: string
}

const asMedia = (value: unknown): Media | null => {
  if (!value || typeof value !== 'object') return null
  if (!('url' in value) || typeof value.url !== 'string' || !value.url) return null
  return value as Media
}

export const companyNameFromCaseTitle = (title: string): string => {
  const trimmed = title.trim()
  const match = TITLE_SEPARATOR.exec(trimmed)
  if (!match || match.index <= 0) return trimmed
  return trimmed.slice(0, match.index).trim()
}

const companyKey = (name: string): string => name.toLowerCase().replace(/\s+/g, ' ').trim()

const stripLeadingCompanyName = (name: string, text: string): string => {
  const pattern = new RegExp(
    `^${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*(?::|[—–-])\\s*`,
    'i',
  )
  return text.replace(pattern, '').trim()
}

const businessDescription = (
  name: string,
  previewTitle: string | null,
  previewText: string | null,
): string | null => {
  const title = previewTitle?.trim()
  if (title) {
    const stripped = stripLeadingCompanyName(name, title)
    if (stripped && stripped.toLowerCase() !== name.toLowerCase()) return stripped
  }

  const text = previewText?.trim()
  return text || null
}

/**
 * One card per company, in Case Studies archive order.
 * The representative case study is the first published record for that company
 * in `CASE_STUDY_ARCHIVE_SORT`, and that record supplies the link and position.
 */
export const uniqueClientsInArchiveOrder = (candidates: ClientCandidate[]): ClientCardData[] => {
  const seen = new Set<string>()
  const clients: ClientCardData[] = []

  for (const candidate of candidates) {
    if (!candidate.companyKey || seen.has(candidate.companyKey)) continue
    seen.add(candidate.companyKey)
    clients.push({
      name: candidate.name,
      description: candidate.description,
      href: candidate.href,
      logo: candidate.logo,
      fallbackImage: candidate.fallbackImage,
    })
  }

  return clients
}

export const getClientList = async (): Promise<ClientCardData[]> => {
  const payload = await getPayload({ config: configPromise })
  const candidates: ClientCandidate[] = []
  let page = 1
  let totalPages = 1

  while (page <= totalPages) {
    const result = await payload.find({
      collection: 'case-studies',
      depth: 1,
      draft: false,
      limit: PAGE_SIZE,
      overrideAccess: false,
      page,
      sort: [...CASE_STUDY_ARCHIVE_SORT],
      select: {
        title: true,
        slug: true,
        primary_case_study_category: true,
        company_logo: true,
        meta: true,
        layout: true,
      },
      where: {
        _status: {
          equals: 'published',
        },
      },
    })

    for (const doc of result.docs) {
      const name = companyNameFromCaseTitle(doc.title || '')
      const href = getCaseStudyUrl(doc)
      if (!name || !href) continue

      const preview = getCaseStudyListPreview(doc)
      const logo = asMedia(doc.company_logo)
      const fallbackImage = asMedia(preview.previewImage) || asMedia(doc.meta?.image)

      candidates.push({
        companyKey: companyKey(name),
        name,
        description: businessDescription(name, preview.previewTitle, preview.previewText),
        href,
        logo,
        fallbackImage: logo ? null : fallbackImage,
      })
    }

    totalPages = result.totalPages || 1
    page += 1
  }

  return uniqueClientsInArchiveOrder(candidates)
}
