export const hierarchicalCategoryRelationshipFieldPath =
  '@/components/admin/CategoryHierarchy/HierarchicalCategoryRelationshipField#HierarchicalCategoryRelationshipField'

export const hierarchicalCategoryTitleCellPath =
  '@/components/admin/CategoryHierarchy/CategoryTitleCell#CategoryTitleCell'

export const hierarchicalCategoryListNavPaths = {
  post: '@/components/admin/CategoryHierarchy/HierarchicalCategoryListNav#CategoryHierarchyListNav',
  site: '@/components/admin/CategoryHierarchy/HierarchicalCategoryListNav#SiteCategoryHierarchyListNav',
  caseStudy:
    '@/components/admin/CategoryHierarchy/HierarchicalCategoryListNav#CaseStudyCategoryHierarchyListNav',
} as const

export const hierarchicalCategoryRelationshipAdmin = {
  allowCreate: false,
  components: {
    Field: hierarchicalCategoryRelationshipFieldPath,
  },
}
