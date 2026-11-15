import type { Metadata } from 'next'

import { redirect } from 'next/navigation'
import React from 'react'

import { ArchiveSearch } from '@/components/ArchiveSearch'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { FeedPageSizeSelect } from '@/components/FeedPageSizeSelect'
import { FeedPagination } from '@/components/FeedPagination'
import { FeedSourceFilters } from '@/components/FeedSourceFilters'
import { JsonLd } from '@/components/JsonLd'
import { PageRange } from '@/components/PageRange'
import { QuestionsAnswersArchive } from '@/components/QuestionsAnswersArchive'
import { buildCaseStudyArchiveUrl } from '@/utilities/caseStudyArchiveUrl'
import {
  FAQ_SOURCE_FILTERS,
  parseFaqSourceFilter,
  parseFeedPage,
  parseFeedPageSize,
} from '@/utilities/feedArchive'
import { generateMeta } from '@/utilities/generateMeta'
import { QUESTIONS_ANSWERS_PATH } from '@/utilities/getContentUrls'
import { buildQuestionsAnswersGraph } from '@/utilities/jsonLd'
import { queryListedFaqs } from '@/utilities/queryAggregatedFaqs'
import { noindexRobotsMetadata } from '@/utilities/siteRobots'

export const dynamic = 'force-dynamic'

const PAGE_TITLE = 'Questions & Answers'
const PAGE_DESCRIPTION =
  'Answers published across manufacturing services, industrial pages, case studies, and blog articles — collected in one searchable resource.'

type Args = {
  searchParams: Promise<{
    page?: string
    search?: string
    source?: string
    limit?: string
  }>
}

export default async function QuestionsAnswersPage({ searchParams: searchParamsPromise }: Args) {
  const {
    page: pageParam,
    search: searchParam,
    source: sourceParam,
    limit: limitParam,
  } = await searchParamsPromise

  const search = searchParam?.trim() || undefined
  const source = parseFaqSourceFilter(sourceParam)
  const limit = parseFeedPageSize(limitParam)
  const page = parseFeedPage(pageParam)

  const listed = await queryListedFaqs({ page, limit, search, source })

  if (listed.totalPages > 0 && page > listed.totalPages) {
    redirect(
      buildCaseStudyArchiveUrl(QUESTIONS_ANSWERS_PATH, {
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
        data={buildQuestionsAnswersGraph({
          name: PAGE_TITLE,
          description: PAGE_DESCRIPTION,
          items: listed.items,
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
            archivePath={QUESTIONS_ANSWERS_PATH}
            initialValue={search || ''}
            inputId="qa-search"
            label="Search questions and answers"
            limit={limit}
            placeholder="Search questions, answers, or source titles"
            source={source}
          />
          <FeedSourceFilters
            archivePath={QUESTIONS_ANSWERS_PATH}
            limit={limit}
            options={FAQ_SOURCE_FILTERS}
            search={search}
            source={source}
          />
          <div className="flex flex-wrap items-end justify-between gap-4">
            <PageRange
              className="text-sm text-muted-foreground"
              collectionLabels={{ plural: 'questions', singular: 'question' }}
              currentPage={listed.page}
              limit={limit}
              totalDocs={listed.totalDocs}
            />
            <FeedPageSizeSelect
              archivePath={QUESTIONS_ANSWERS_PATH}
              pageSize={limit}
              search={search}
              source={source}
            />
          </div>
        </div>

        <div className="mt-8">
          <QuestionsAnswersArchive items={listed.items} />
        </div>

        <FeedPagination
          basePath={QUESTIONS_ANSWERS_PATH}
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
  const source = parseFaqSourceFilter(sourceParam)
  const limit = parseFeedPageSize(limitParam)
  const page = parseFeedPage(pageParam)
  const canonical = buildCaseStudyArchiveUrl(QUESTIONS_ANSWERS_PATH, {
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
    url: QUESTIONS_ANSWERS_PATH,
  })

  return {
    ...meta,
    alternates: { ...meta.alternates, canonical },
    ...(search || source !== 'all' ? { robots: noindexRobotsMetadata } : {}),
  }
}
