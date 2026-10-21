export const buildCaseStudyArchiveUrl = (
  basePath: string,
  {
    page = 1,
    search,
    category,
  }: {
    page?: number
    search?: string
    category?: string
  },
): string => {
  const params = new URLSearchParams()
  if (search) params.set('search', search)
  if (category) params.set('category', category)
  if (page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `${basePath}?${query}` : basePath
}
