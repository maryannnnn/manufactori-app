import type { CollectionBeforeChangeHook } from 'payload'
import { APIError } from 'payload'

import { isReservedCaseStudyCategorySlug } from '../utilities/getContentUrls'

export const rejectReservedCaseStudyCategorySlug: CollectionBeforeChangeHook = ({ data }) => {
  if (isReservedCaseStudyCategorySlug(data?.slug)) {
    throw new APIError(
      'This slug is reserved and cannot be used as a Case Study Category URL segment.',
      400,
    )
  }

  return data
}
