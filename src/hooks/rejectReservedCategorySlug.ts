import type { CollectionBeforeChangeHook } from 'payload'
import { APIError } from 'payload'

export const rejectReservedCategorySlug: CollectionBeforeChangeHook = ({ data }) => {
  if (data?.slug === 'categories') {
    throw new APIError(
      'Slug «categories» зарезервирован для URL списка категорий: /blog/categories/{slug}',
      400,
    )
  }

  return data
}
