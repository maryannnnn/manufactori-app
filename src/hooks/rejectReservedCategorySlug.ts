import type { CollectionBeforeChangeHook } from 'payload'
import { APIError } from 'payload'

import { isReservedCategorySlug } from '../utilities/getContentUrls'

export const rejectReservedCategorySlug: CollectionBeforeChangeHook = ({ data }) => {
  if (isReservedCategorySlug(data?.slug)) {
    throw new APIError(
      'This slug is reserved for blog category URLs: /blog/category/{slug}',
      400,
    )
  }

  return data
}
