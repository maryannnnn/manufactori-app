export const buildCaseStudyArchiveUrl = (
  basePath: string,
  {
    page = 1,
    search,
    category,
    source,
    limit,
  }: {
    page?: number
    search?: string
    category?: string
    /** Source filter for centralized FAQ / discussion archives. */
    source?: string
    /** Blog archive page size. Omitted when using the default. */
    limit?: number
  },
): string => {
  const params = new URLSearchParams()
  if (search) params.set('search', search)
  if (category) params.set('category', category)
  if (source && source !== 'all') params.set('source', source)
  if (typeof limit === 'number' && Number.isFinite(limit) && limit > 0) {
    params.set('limit', String(limit))
  }
  if (page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `${basePath}?${query}` : basePath
}
