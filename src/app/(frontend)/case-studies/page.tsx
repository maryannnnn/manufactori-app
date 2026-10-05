import type { Metadata } from 'next'

import Link from 'next/link'
import { redirect } from 'next/navigation'
import React from 'react'

import { CaseStudyArchive } from '@/components/CaseStudyArchive'
import { CaseStudySearch } from '@/components/CaseStudySearch'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import { CASE_STUDIES_ARCHIVE_PATH } from '@/utilities/getContentUrls'
import { CASE_STUDIES_PAGE_SIZE, getCaseStudyList } from '@/utilities/getCaseStudyList'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { generateMeta } from '@/utilities/generateMeta'

import PageClient from './page.client'

/** Used when the archive global has not been filled in yet. */
const FALLBACK_HEADING = 'Case Studies'

type Args = {
  searchParams: Promise<{
    page?: string
    search?: string
  }>
}

const parsePage = (value: string | undefined): number => {
  const parsed = Number.parseInt(value ?? '', 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1
}

const buildArchiveUrl = (page: number, search?: string): string => {
  const params = new URLSearchParams()
  if (search) params.set('search', search)
  if (page > 1) params.set('page', String(page))

  const query = params.toString()
  return query ? `${CASE_STUDIES_ARCHIVE_PATH}?${query}` : CASE_STUDIES_ARCHIVE_PATH
}

export default async function CaseStudiesPage({ searchParams: searchParamsPromise }: Args) {
  const { page: pageParam, search: searchParam } = await searchParamsPromise
  const search = searchParam?.trim() || undefined
  const page = parsePage(pageParam)

  const [archive, caseStudies] = await Promise.all([
    getCachedGlobal('case-studies-archive', 1)(),
    getCaseStudyList({ page, search }),
  ])

  // A page past the end would otherwise render an empty grid alongside a
  // non-zero total, so send those requests to the last real page.
  if (caseStudies.totalPages > 0 && page > caseStudies.totalPages) {
    redirect(buildArchiveUrl(caseStudies.totalPages, search))
  }

  const heading = archive?.longTitle || archive?.title || FALLBACK_HEADING

  return (
    <div className="pt-16 pb-24">
      <PageClient />

      <div className="container mb-10">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          {heading}
        </h1>

        <CaseStudySearch className="mt-8" initialValue={search ?? ''} />
      </div>

      {caseStudies.totalDocs > 0 ? (
        <React.Fragment>
          <div className="container mb-6">
            <PageRange
              collectionLabels={{ plural: 'Case Studies', singular: 'Case Study' }}
              currentPage={caseStudies.page}
              limit={CASE_STUDIES_PAGE_SIZE}
              totalDocs={caseStudies.totalDocs}
            />
          </div>

          <CaseStudyArchive docs={caseStudies.docs} />

          {caseStudies.totalPages > 1 && (
            <div className="container">
              <Pagination
                buildPageUrl={(pageNumber) => buildArchiveUrl(pageNumber, search)}
                page={caseStudies.page}
                totalPages={caseStudies.totalPages}
              />
            </div>
          )}
        </React.Fragment>
      ) : (
        <div className="container">
          {search ? (
            <div className="max-w-[60ch]">
              <p className="text-base text-foreground">
                No case studies match{' '}
                <span className="font-semibold">&ldquo;{search}&rdquo;</span>.
              </p>
              <Link
                className="mt-4 inline-flex rounded-[2px] border border-border px-3 py-2 font-mono text-xs text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                href={CASE_STUDIES_ARCHIVE_PATH}
              >
                Clear search
              </Link>
            </div>
          ) : (
            <p className="text-base text-muted-foreground">No case studies found.</p>
          )}
        </div>
      )}
    </div>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const archive = await getCachedGlobal('case-studies-archive', 1)()

  const meta = await generateMeta({
    doc: {
      meta: {
        title: archive?.meta?.title || archive?.title || FALLBACK_HEADING,
        description: archive?.meta?.description,
        image: archive?.meta?.image,
      },
    },
    url: CASE_STUDIES_ARCHIVE_PATH,
  })

  return { ...meta, alternates: { ...meta.alternates, canonical: CASE_STUDIES_ARCHIVE_PATH } }
}
