import type { GlobalAfterChangeHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import { CASE_STUDIES_ARCHIVE_PATH } from '@/utilities/getContentUrls'

export const revalidateCaseStudiesArchive: GlobalAfterChangeHook = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating case studies archive`)

    revalidateTag('global_case-studies-archive', 'max')
    revalidatePath(CASE_STUDIES_ARCHIVE_PATH)
  }

  return doc
}
