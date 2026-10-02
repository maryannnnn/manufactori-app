import { notFound, redirect } from 'next/navigation'

import { BLOG_ARCHIVE_PATH } from '@/utilities/getContentUrls'

type Args = {
  params: Promise<{
    pageNumber: string
  }>
  searchParams: Promise<{
    search?: string
  }>
}

export default async function PostsPaginatedArchiveRedirect({
  params: paramsPromise,
  searchParams: searchParamsPromise,
}: Args) {
  const { pageNumber } = await paramsPromise
  const { search } = await searchParamsPromise
  const page = Number.parseInt(pageNumber, 10)
  if (!Number.isInteger(page) || page < 1) notFound()

  const params = new URLSearchParams()
  if (search?.trim()) params.set('search', search.trim())
  if (page > 1) params.set('page', String(page))
  const query = params.toString()
  redirect(query ? `${BLOG_ARCHIVE_PATH}?${query}` : BLOG_ARCHIVE_PATH)
}
