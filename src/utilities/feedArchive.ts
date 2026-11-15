/** Shared archive controls for Questions & Answers and Discussions pages. */

export const FEED_PAGE_SIZE_OPTIONS = [10, 20, 50] as const
export type FeedPageSize = (typeof FEED_PAGE_SIZE_OPTIONS)[number]
export const DEFAULT_FEED_PAGE_SIZE: FeedPageSize = 20

export const parseFeedPage = (value: string | undefined): number => {
  const parsed = Number.parseInt(value ?? '', 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1
}

export const parseFeedPageSize = (value: string | undefined): FeedPageSize => {
  const parsed = Number.parseInt(value ?? '', 10)
  return (FEED_PAGE_SIZE_OPTIONS as readonly number[]).includes(parsed)
    ? (parsed as FeedPageSize)
    : DEFAULT_FEED_PAGE_SIZE
}

export const FAQ_SOURCE_FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'services', label: 'Services' },
  { value: 'case-studies', label: 'Case Studies' },
  { value: 'industries', label: 'Industrial' },
  { value: 'posts', label: 'Blog' },
] as const

export type FaqSourceFilter = (typeof FAQ_SOURCE_FILTERS)[number]['value']

export const DISCUSSION_SOURCE_FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'posts', label: 'Blog' },
  { value: 'case-studies', label: 'Case Studies' },
] as const

export type DiscussionSourceFilter = (typeof DISCUSSION_SOURCE_FILTERS)[number]['value']

export const parseFaqSourceFilter = (value: string | undefined): FaqSourceFilter => {
  const next = value?.trim()
  return FAQ_SOURCE_FILTERS.some((item) => item.value === next)
    ? (next as FaqSourceFilter)
    : 'all'
}

export const parseDiscussionSourceFilter = (
  value: string | undefined,
): DiscussionSourceFilter => {
  const next = value?.trim()
  return DISCUSSION_SOURCE_FILTERS.some((item) => item.value === next)
    ? (next as DiscussionSourceFilter)
    : 'all'
}
