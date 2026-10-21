import type { Metadata } from 'next'

import Link from 'next/link'
import { redirect } from 'next/navigation'
import React from 'react'

import { CaseStudyArchive } from '@/components/CaseStudyArchive'
import { CaseStudyCategoryFilters } from '@/components/CaseStudyCategoryFilters'
import { CaseStudySearch } from '@/components/CaseStudySearch'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import { CASE_STUDIES_ARCHIVE_PATH } from '@/utilities/getContentUrls'
import { buildWebPageGraph, caseStudyArchiveBreadcrumbs } from '@/utilities/jsonLd'
import { buildCaseStudyArchiveUrl } from '@/utilities/caseStudyArchiveUrl'
import { CASE_STUDIES_PAGE_SIZE, getCaseStudyList } from '@/utilities/getCaseStudyList'
import { getIndustrialCaseStudyFilters } from '@/utilities/industrialCaseStudyFilters'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { JsonLd } from '@/components/JsonLd'
import { generateMeta } from '@/utilities/generateMeta'
import { noindexRobotsMetadata } from '@/utilities/siteRobots'

import PageClient from './page.client'

/** Used when the archive global has not been filled in yet. */
const FALLBACK_HEADING = 'Case Studies'

type Args = {
  searchParams: Promise<{
    category?: string
    page?: string
    search?: string
  }>
}

const parsePage = (value: string | undefined): number => {
  const parsed = Number.parseInt(value ?? '', 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1
}

export default async function CaseStudiesPage({ searchParams: searchParamsPromise }: Args) {
  const { category: categoryParam, page: pageParam, search: searchParam } = await searchParamsPromise
  const search = searchParam?.trim() || undefined
  const page = parsePage(pageParam)
  const filters = await getIndustrialCaseStudyFilters()
  const activeFilter = filters.find((filter) => filter.slug === categoryParam?.trim())
  const category = activeFilter?.slug

  const [archive, caseStudies] = await Promise.all([
    getCachedGlobal('case-studies-archive', 1)(),
    getCaseStudyList({ categoryId: activeFilter?.id, page, search }),
  ])

  // A page past the end would otherwise render an empty grid alongside a
  // non-zero total, so send those requests to the last real page.
  if (caseStudies.totalPages > 0 && page > caseStudies.totalPages) {
    redirect(
      buildCaseStudyArchiveUrl(CASE_STUDIES_ARCHIVE_PATH, {
        page: caseStudies.totalPages,
        search,
        category,
      }),
    )
  }

  const heading = archive?.longTitle || archive?.title || FALLBACK_HEADING

  return (
    <div className="pt-16 pb-24">
      <PageClient />

      <JsonLd
        data={buildWebPageGraph({
          path: CASE_STUDIES_ARCHIVE_PATH,
          name: heading,
          description: archive?.meta?.description,
          breadcrumbs: caseStudyArchiveBreadcrumbs(),
          type: 'CollectionPage',
        })}
      />
      <div className="container mb-10">
        <div className="mb-5">
          <Breadcrumbs items={[{ name: 'Home', href: '/' }, { name: heading }]} />
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          {heading}
        </h1>

        <CaseStudySearch category={category} className="mt-8" initialValue={search ?? ''} />
        <CaseStudyCategoryFilters activeSlug={category} filters={filters} search={search} />
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
                basePath={CASE_STUDIES_ARCHIVE_PATH}
                category={category}
                page={caseStudies.page}
                search={search}
                totalPages={caseStudies.totalPages}
              />
            </div>
          )}
        </React.Fragment>
      ) : (
        <div className="container">
          {search || activeFilter ? (
            <div className="max-w-[60ch]">
              <p className="text-base text-foreground">
                {activeFilter && search ? (
                  <>
                    No case studies in <span className="font-semibold">{activeFilter.title}</span>{' '}
                    match <span className="font-semibold">&ldquo;{search}&rdquo;</span>.
                  </>
                ) : activeFilter ? (
                  <>
                    No case studies in <span className="font-semibold">{activeFilter.title}</span>.
                  </>
                ) : (
                  <>
                    No case studies match{' '}
                    <span className="font-semibold">&ldquo;{search}&rdquo;</span>.
                  </>
                )}
              </p>
              <Link
                className="mt-4 inline-flex rounded-[2px] border border-border px-3 py-2 font-mono text-xs text-muted-foreground transition-colors hover:border-cta hover:text-link focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                href={CASE_STUDIES_ARCHIVE_PATH}
              >
                {activeFilter && search ? 'Clear filters' : search ? 'Clear search' : 'Show all case studies'}
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

export async function generateMetadata({ searchParams: searchParamsPromise }: Args): Promise<Metadata> {
  const archive = await getCachedGlobal('case-studies-archive', 1)()
  const { category: categoryParam, page: pageParam, search: searchParam } = await searchParamsPromise
  const search = searchParam?.trim()
  const category = categoryParam?.trim()
  const page = parsePage(pageParam)
  const canonical = buildCaseStudyArchiveUrl(CASE_STUDIES_ARCHIVE_PATH, { page })

  const meta = await generateMeta({
    doc: {
      meta: {
        title: archive?.meta?.title || archive?.title || FALLBACK_HEADING,
        description: archive?.meta?.description,
        image: archive?.meta?.image,
      },
    },
    url: canonical,
  })

  return {
    ...meta,
    alternates: { ...meta.alternates, canonical },
    ...(search || category ? { robots: noindexRobotsMetadata } : {}),
  }
}
