import type { CollectionBeforeChangeHook } from 'payload'

const toID = (value: unknown): number | string | null => {
  if (typeof value === 'number' || typeof value === 'string') return value
  if (value && typeof value === 'object' && 'id' in value) {
    return (value as { id: number | string }).id
  }
  return null
}

export const ensurePrimaryCategoryInCategories: CollectionBeforeChangeHook = ({ data }) => {
  if (!data) return data

  const primaryId = toID(data.primary_category)
  if (primaryId == null) return data

  const existing = Array.isArray(data.categories) ? data.categories : []
  const alreadyIncluded = existing.some((item) => toID(item) === primaryId)

  if (!alreadyIncluded) {
    data.categories = [primaryId, ...existing]
  }

  return data
}
