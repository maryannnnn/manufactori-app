import type { CollectionBeforeChangeHook } from 'payload'

const toID = (value: unknown): number | string | null => {
  if (typeof value === 'number' || typeof value === 'string') return value
  if (value && typeof value === 'object' && 'id' in value) {
    return (value as { id: number | string }).id
  }
  return null
}

export const ensurePrimaryCaseStudyCategoryInCategories: CollectionBeforeChangeHook = ({
  data,
}) => {
  if (!data) return data

  const primaryId = toID(data.primary_case_study_category)
  if (primaryId == null) return data

  const existing = Array.isArray(data.case_study_categories) ? data.case_study_categories : []
  const alreadyIncluded = existing.some((item) => toID(item) === primaryId)

  if (!alreadyIncluded) {
    data.case_study_categories = [primaryId, ...existing]
  }

  return data
}
