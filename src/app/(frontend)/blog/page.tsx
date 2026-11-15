import type { Metadata } from 'next'

import Link from 'next/link'
import { redirect } from 'next/navigation'
import React from 'react'

import { ArchiveSearch } from '@/components/ArchiveSearch'
import { BlogCategoryActivity } from '@/components/BlogCategoryActivity'
import { CollectionArchive } from '@/components/CollectionArchive'
import { ContactStrip } from '@/components/ContactStrip'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import { PostsPageSizeSelect } from '@/components/PostsPageSizeSelect'
import { BLOG_ARCHIVE_PATH } from '@/utilities/getContentUrls'
import { getPostList } from '@/utilities/getPostList'
import { POSTS_PAGE_SIZE, parsePostsPageSize } from '@/utilities/postsPageSize'
import { queryActiveBlogCategories } from '@/utilities/queryActiveBlogCategories'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { JsonLd } from '@/components/JsonLd'
import { generateMeta } from '@/utilities/generateMeta'
import { blogArchiveBreadcrumbs, buildWebPageGraph } from '@/utilities/jsonLd'
import { noindexRobotsMetadata } from '@/utilities/siteRobots'

import PageClient from './page.client'

const FALLBACK_HEADING = 'Blog'

type Args = {
  searchParams: Promise<{
    page?: string
    search?: string
    limit?: string
  }>
}

const parsePage = (value: string | undefined): number => {
  const parsed = Number.parseInt(value ?? '', 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1
}

const buildArchiveUrl = (page: number, search?: string, limit?: number): string => {
  const params = new URLSearchParams()
  if (search) params.set('search', search)
  if (typeof limit === 'number' && limit !== POSTS_PAGE_SIZE) params.set('limit', String(limit))
  if (page > 1) params.set('page', String(page))

  const query = params.toString()
  return query ? `${BLOG_ARCHIVE_PATH}?${query}` : BLOG_ARCHIVE_PATH
}

export default async function PostsArchivePage({ searchParams: searchParamsPromise }: Args) {
  const { page: pageParam, search: searchParam, limit: limitParam } = await searchParamsPromise
  const search = searchParam?.trim() || undefined
  const page = parsePage(pageParam)
  const pageSize = parsePostsPageSize(limitParam)

  const [posts, activeCategories] = await Promise.all([
    getPostList({ page, search, limit: pageSize }),
    queryActiveBlogCategories(),
  ])

  if (posts.totalPages > 0 && page > posts.totalPages) {
    redirect(buildArchiveUrl(posts.totalPages, search, pageSize))
  }

  const limitForUrls = pageSize === POSTS_PAGE_SIZE ? undefined : pageSize

  return (
    <div className="pt-16 pb-24">
      <PageClient />

      <JsonLd
        data={buildWebPageGraph({
          path: BLOG_ARCHIVE_PATH,
          name: FALLBACK_HEADING,
          description: 'Articles on manufacturing marketing, websites, and industrial digital strategy.',
          breadcrumbs: blogArchiveBreadcrumbs(),
          type: 'CollectionPage',
        })}
      />
      <div className="container mb-10">
        <div className="mb-5">
          <Breadcrumbs items={[{ name: 'Home', href: '/' }, { name: FALLBACK_HEADING }]} />
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          {FALLBACK_HEADING}
        </h1>

        <ArchiveSearch
          archivePath={BLOG_ARCHIVE_PATH}
          className="mt-8"
          initialValue={search ?? ''}
          inputId="posts-search"
          label="Search posts"
          limit={limitForUrls}
          placeholder="Search posts"
        />
        <BlogCategoryActivity categories={activeCategories} />
      </div>

      <ContactStrip className="mb-10 border-y" variant="blog" />

      {posts.totalDocs > 0 ? (
        <React.Fragment>
          <div className="container mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <PageRange
              collectionLabels={{ plural: 'Posts', singular: 'Post' }}
              currentPage={posts.page}
              limit={posts.limit}
              totalDocs={posts.totalDocs}
            />
            <PostsPageSizeSelect
              archivePath={BLOG_ARCHIVE_PATH}
              pageSize={pageSize}
              search={search}
            />
          </div>

          <CollectionArchive posts={posts.docs} />

          {posts.totalPages > 1 && (
            <div className="container">
              <Pagination
                basePath={BLOG_ARCHIVE_PATH}
                limit={limitForUrls}
                page={posts.page}
                search={search}
                totalPages={posts.totalPages}
              />
            </div>
          )}
        </React.Fragment>
      ) : (
        <div className="container">
          {search ? (
            <div className="max-w-[60ch]">
              <p className="text-base text-foreground">
                No posts match <span className="font-semibold">&ldquo;{search}&rdquo;</span>.
              </p>
              <Link
                className="mt-4 inline-flex rounded-[2px] border border-border px-3 py-2 font-mono text-xs text-muted-foreground transition-colors hover:border-cta hover:text-link focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                href={BLOG_ARCHIVE_PATH}
              >
                Clear search
              </Link>
            </div>
          ) : (
            <p className="text-base text-muted-foreground">No posts found.</p>
          )}
        </div>
      )}
    </div>
  )
}

export async function generateMetadata({ searchParams: searchParamsPromise }: Args): Promise<Metadata> {
  const { page: pageParam, search: searchParam, limit: limitParam } = await searchParamsPromise
  const search = searchParam?.trim()
  const page = parsePage(pageParam)
  const pageSize = parsePostsPageSize(limitParam)

  const meta = await generateMeta({
    doc: {
      meta: {
        title: FALLBACK_HEADING,
        description: 'Articles on manufacturing marketing, websites, and industrial digital strategy.',
      },
    },
    url: buildArchiveUrl(page, undefined, pageSize),
  })

  return {
    ...meta,
    alternates: { ...meta.alternates, canonical: buildArchiveUrl(page, undefined, pageSize) },
    ...(search ? { robots: noindexRobotsMetadata } : {}),
  }
}
