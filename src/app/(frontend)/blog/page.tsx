import type { Metadata } from 'next'

import Link from 'next/link'
import { redirect } from 'next/navigation'
import React from 'react'

import { ArchiveSearch } from '@/components/ArchiveSearch'
import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import { BLOG_ARCHIVE_PATH } from '@/utilities/getContentUrls'
import { POSTS_PAGE_SIZE, getPostList } from '@/utilities/getPostList'
import { generateMeta } from '@/utilities/generateMeta'

import PageClient from './page.client'

const FALLBACK_HEADING = 'Blog'

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
  return query ? `${BLOG_ARCHIVE_PATH}?${query}` : BLOG_ARCHIVE_PATH
}

export default async function PostsArchivePage({ searchParams: searchParamsPromise }: Args) {
  const { page: pageParam, search: searchParam } = await searchParamsPromise
  const search = searchParam?.trim() || undefined
  const page = parsePage(pageParam)

  const posts = await getPostList({ page, search })

  if (posts.totalPages > 0 && page > posts.totalPages) {
    redirect(buildArchiveUrl(posts.totalPages, search))
  }

  return (
    <div className="pt-16 pb-24">
      <PageClient />

      <div className="container mb-10">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          {FALLBACK_HEADING}
        </h1>

        <ArchiveSearch
          archivePath={BLOG_ARCHIVE_PATH}
          className="mt-8"
          initialValue={search ?? ''}
          inputId="posts-search"
          label="Search posts"
          placeholder="Search posts"
        />
      </div>

      {posts.totalDocs > 0 ? (
        <React.Fragment>
          <div className="container mb-6">
            <PageRange
              collectionLabels={{ plural: 'Posts', singular: 'Post' }}
              currentPage={posts.page}
              limit={POSTS_PAGE_SIZE}
              totalDocs={posts.totalDocs}
            />
          </div>

          <CollectionArchive posts={posts.docs} />

          {posts.totalPages > 1 && (
            <div className="container">
              <Pagination
                buildPageUrl={(pageNumber) => buildArchiveUrl(pageNumber, search)}
                page={posts.page}
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
                className="mt-4 inline-flex rounded-[2px] border border-border px-3 py-2 font-mono text-xs text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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

export async function generateMetadata(): Promise<Metadata> {
  const meta = await generateMeta({
    doc: {
      meta: {
        title: FALLBACK_HEADING,
        description: 'Articles on manufacturing marketing, websites, and industrial digital strategy.',
      },
    },
    url: BLOG_ARCHIVE_PATH,
  })

  return { ...meta, alternates: { ...meta.alternates, canonical: BLOG_ARCHIVE_PATH } }
}
