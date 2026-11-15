/** Default blog listing page size (three rows of six on wide layouts). */
export const POSTS_PAGE_SIZE = 18

export const POSTS_PAGE_SIZE_OPTIONS = [10, 18, 25, 50, 100] as const

export type PostsPageSize = (typeof POSTS_PAGE_SIZE_OPTIONS)[number]

export const parsePostsPageSize = (value: string | undefined): PostsPageSize => {
  const parsed = Number.parseInt(value ?? '', 10)
  if ((POSTS_PAGE_SIZE_OPTIONS as readonly number[]).includes(parsed)) {
    return parsed as PostsPageSize
  }
  return POSTS_PAGE_SIZE
}
