import type { CollectionBeforeChangeHook } from 'payload'
import { APIError } from 'payload'

import { isReservedCaseStudyCategorySlug } from '../utilities/getContentUrls'

export const rejectReservedCaseStudyCategorySlug: CollectionBeforeChangeHook = ({ data }) => {
  if (isReservedCaseStudyCategorySlug(data?.slug)) {
    throw new APIError(
      'This slug is reserved for case study category URLs: /case-study/category/{slug}',
      400,
    )
  }

  return data
}
