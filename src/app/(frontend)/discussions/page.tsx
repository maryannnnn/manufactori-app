import type { Metadata } from 'next'

import { redirect } from 'next/navigation'
import React from 'react'

import { ArchiveSearch } from '@/components/ArchiveSearch'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { DiscussionsArchive } from '@/components/DiscussionsArchive'
import { FeedPageSizeSelect } from '@/components/FeedPageSizeSelect'
import { FeedPagination } from '@/components/FeedPagination'
import { FeedSourceFilters } from '@/components/FeedSourceFilters'
import { JsonLd } from '@/components/JsonLd'
import { PageRange } from '@/components/PageRange'
import { buildCaseStudyArchiveUrl } from '@/utilities/caseStudyArchiveUrl'
import {
  DISCUSSION_SOURCE_FILTERS,
  parseDiscussionSourceFilter,
  parseFeedPage,
  parseFeedPageSize,
} from '@/utilities/feedArchive'
import { generateMeta } from '@/utilities/generateMeta'
import { DISCUSSIONS_PATH } from '@/utilities/getContentUrls'
import { buildDiscussionsArchiveGraph } from '@/utilities/jsonLd'
import { queryListedDiscussions } from '@/utilities/queryAggregatedDiscussions'
import { noindexRobotsMetadata } from '@/utilities/siteRobots'

export const dynamic = 'force-dynamic'

const PAGE_TITLE = 'Discussions'
const PAGE_DESCRIPTION =
  'Expert discussion threads from manufacturing blog articles and case studies — questions from readers with replies in one place.'

type Args = {
  searchParams: Promise<{
    page?: string
    search?: string
    source?: string
    limit?: string
  }>
}

export default async function DiscussionsPage({ searchParams: searchParamsPromise }: Args) {
  const {
    page: pageParam,
    search: searchParam,
    source: sourceParam,
    limit: limitParam,
  } = await searchParamsPromise

  const search = searchParam?.trim() || undefined
  const source = parseDiscussionSourceFilter(sourceParam)
  const limit = parseFeedPageSize(limitParam)
  const page = parseFeedPage(pageParam)

  const listed = await queryListedDiscussions({ page, limit, search, source })

  if (listed.totalPages > 0 && page > listed.totalPages) {
    redirect(
      buildCaseStudyArchiveUrl(DISCUSSIONS_PATH, {
        page: listed.totalPages,
        search,
        source,
        limit,
      }),
    )
  }

  return (
    <div className="pb-24 pt-16">
      <JsonLd
        data={buildDiscussionsArchiveGraph({
          name: PAGE_TITLE,
          description: PAGE_DESCRIPTION,
        })}
      />

      <div className="container">
        <div className="mb-5">
          <Breadcrumbs items={[{ name: 'Home', href: '/' }, { name: PAGE_TITLE }]} />
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          {PAGE_TITLE}
        </h1>
        <p className="mt-4 max-w-[65ch] text-base leading-7 text-muted-foreground">
          {PAGE_DESCRIPTION}
        </p>

        <div className="mt-10 space-y-6">
          <ArchiveSearch
            archivePath={DISCUSSIONS_PATH}
            initialValue={search || ''}
            inputId="discussions-search"
            label="Search discussions"
            limit={limit}
            placeholder="Search questions, replies, authors, or source titles"
            source={source}
          />
          <FeedSourceFilters
            archivePath={DISCUSSIONS_PATH}
            limit={limit}
            options={DISCUSSION_SOURCE_FILTERS}
            search={search}
            source={source}
          />
          <div className="flex flex-wrap items-end justify-between gap-4">
            <PageRange
              className="text-sm text-muted-foreground"
              collectionLabels={{ plural: 'discussions', singular: 'discussion' }}
              currentPage={listed.page}
              limit={limit}
              totalDocs={listed.totalDocs}
            />
            <FeedPageSizeSelect
              archivePath={DISCUSSIONS_PATH}
              pageSize={limit}
              search={search}
              source={source}
            />
          </div>
        </div>

        <div className="mt-8">
          <DiscussionsArchive items={listed.items} />
        </div>

        <FeedPagination
          basePath={DISCUSSIONS_PATH}
          limit={limit}
          page={listed.page}
          search={search}
          source={source}
          totalPages={listed.totalPages}
        />
      </div>
    </div>
  )
}

export async function generateMetadata({
  searchParams: searchParamsPromise,
}: Args): Promise<Metadata> {
  const {
    page: pageParam,
    search: searchParam,
    source: sourceParam,
    limit: limitParam,
  } = await searchParamsPromise
  const search = searchParam?.trim()
  const source = parseDiscussionSourceFilter(sourceParam)
  const limit = parseFeedPageSize(limitParam)
  const page = parseFeedPage(pageParam)
  const canonical = buildCaseStudyArchiveUrl(DISCUSSIONS_PATH, {
    page,
    limit: limit === 20 ? undefined : limit,
  })

  const meta = await generateMeta({
    doc: {
      meta: {
        title: PAGE_TITLE,
        description: PAGE_DESCRIPTION,
      },
    },
    url: DISCUSSIONS_PATH,
  })

  return {
    ...meta,
    alternates: { ...meta.alternates, canonical },
    ...(search || source !== 'all' ? { robots: noindexRobotsMetadata } : {}),
  }
}
