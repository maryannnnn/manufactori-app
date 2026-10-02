import { redirect } from 'next/navigation'

import { BLOG_ARCHIVE_PATH } from '@/utilities/getContentUrls'

type Args = {
  searchParams: Promise<{
    page?: string
    search?: string
  }>
}

export default async function PostsArchiveRedirect({ searchParams: searchParamsPromise }: Args) {
  const { page, search } = await searchParamsPromise
  const params = new URLSearchParams()
  if (search?.trim()) params.set('search', search.trim())
  if (page && page !== '1') params.set('page', page)
  const query = params.toString()
  redirect(query ? `${BLOG_ARCHIVE_PATH}?${query}` : BLOG_ARCHIVE_PATH)
}
