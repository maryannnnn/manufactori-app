export type CategoryType = 'site' | 'post' | 'case-study'

export const CATEGORY_TYPE_TO_COLLECTION = {
  site: 'site-categories',
  post: 'categories',
  'case-study': 'case-study-categories',
} as const satisfies Record<CategoryType, string>

export type CategoryCollectionSlug =
  (typeof CATEGORY_TYPE_TO_COLLECTION)[CategoryType]

export const CATEGORY_TYPE_OPTIONS: { value: CategoryType; label: string }[] = [
  { value: 'site', label: 'Site Category' },
  { value: 'post', label: 'Post Category' },
  { value: 'case-study', label: 'Case Study Category' },
]
