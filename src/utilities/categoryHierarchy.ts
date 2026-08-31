import type { Where } from 'payload'

export type CategoryTreeDoc = {
  id?: number | string
  title?: string | null
  slug?: string | null
  parent?: number | string | { id?: number | string } | null
  breadcrumbs?:
    | {
        doc?: unknown
        url?: string | null
        label?: string | null
        id?: string | null
      }[]
    | null
}

/** @deprecated Drill-down nav no longer uses global level pills. */
export type CategoryLevelFilter = 'all' | '1' | '2' | '3'

export type CategoryBranchItem = {
  id: string
  title: string
}

export type CategoryHierarchyFilterState = {
  branchPath: CategoryBranchItem[]
}

export type CategoryIndex = {
  byId: Map<string, CategoryTreeDoc>
  childrenByParent: Map<string, CategoryTreeDoc[]>
  roots: CategoryTreeDoc[]
}

/** Preferred order for root categories in admin drill-down. */
export const ROOT_SLUG_ORDER = ['services', 'industrial', 'solutions', 'technology'] as const

export const parentIdOf = (doc: CategoryTreeDoc): number | string | null => {
  if (doc.parent == null) return null
  if (typeof doc.parent === 'object') return doc.parent.id ?? null
  return doc.parent
}

/** Depth from nested-docs breadcrumbs (root = 0). */
export const getCategoryDepth = (doc: CategoryTreeDoc): number => {
  if (doc.breadcrumbs?.length) {
    return Math.max(0, doc.breadcrumbs.length - 1)
  }
  return 0
}

export const getCategoryDepthFromIndex = (doc: CategoryTreeDoc, index: CategoryIndex): number => {
  if (doc.breadcrumbs?.length) {
    return getCategoryDepth(doc)
  }

  if (doc.id == null) return 0

  let depth = 0
  let current: CategoryTreeDoc | undefined = doc
  const seen = new Set<string>()

  while (current) {
    const pid = parentIdOf(current)
    if (pid == null) break

    const key = String(pid)
    if (seen.has(key)) break
    seen.add(key)

    depth += 1
    current = index.byId.get(key)
  }

  return depth
}

/** 1-indexed level (root = 1). */
export const getCategoryLevel = (doc: CategoryTreeDoc, index?: CategoryIndex): number => {
  const depth = index ? getCategoryDepthFromIndex(doc, index) : getCategoryDepth(doc)
  return depth + 1
}

export const formatHierarchicalLabel = (title: string, depth: number): string => {
  if (depth <= 0) return title
  return `${'— '.repeat(depth)}${title}`
}

export const sortRootCategories = (roots: CategoryTreeDoc[]): CategoryTreeDoc[] => {
  return [...roots].sort((a, docB) => {
    const aSlug = String(a.slug ?? '')
    const bSlug = String(docB.slug ?? '')
    const aOrder = ROOT_SLUG_ORDER.indexOf(aSlug as (typeof ROOT_SLUG_ORDER)[number])
    const bOrder = ROOT_SLUG_ORDER.indexOf(bSlug as (typeof ROOT_SLUG_ORDER)[number])
    const aRank = aOrder === -1 ? 999 : aOrder
    const bRank = bOrder === -1 ? 999 : bOrder
    if (aRank !== bRank) return aRank - bRank
    return String(a.title ?? '').localeCompare(String(docB.title ?? ''))
  })
}

export const buildCategoryIndex = (docs: CategoryTreeDoc[]): CategoryIndex => {
  const byId = new Map<string, CategoryTreeDoc>()
  const childrenByParent = new Map<string, CategoryTreeDoc[]>()

  for (const doc of docs) {
    if (doc.id != null) {
      byId.set(String(doc.id), doc)
    }
  }

  for (const doc of docs) {
    const key = String(parentIdOf(doc) ?? 'root')
    const list = childrenByParent.get(key) || []
    list.push(doc)
    childrenByParent.set(key, list)
  }

  for (const [key, list] of childrenByParent.entries()) {
    if (key === 'root') continue
    list.sort((a, b) => String(a.title ?? '').localeCompare(String(b.title ?? '')))
  }

  const roots = sortRootCategories(childrenByParent.get('root') || [])

  return {
    byId,
    childrenByParent,
    roots,
  }
}

export const buildTreeOrder = (docs: CategoryTreeDoc[]): CategoryTreeDoc[] => {
  const index = buildCategoryIndex(docs)
  const ordered: CategoryTreeDoc[] = []

  const walk = (parentKey: string, depth: number) => {
    const children =
      parentKey === 'root'
        ? index.roots
        : index.childrenByParent.get(parentKey) || []

    for (const child of children) {
      ordered.push({
        ...child,
        breadcrumbs:
          child.breadcrumbs ??
          Array.from({ length: depth + 1 }, (_, breadcrumbIndex) => ({
            id: String(breadcrumbIndex),
          })),
      })
      if (child.id != null) {
        walk(String(child.id), depth + 1)
      }
    }
  }

  walk('root', 0)
  return ordered
}

const docId = (doc: CategoryTreeDoc): number | string | null => (doc.id == null ? null : doc.id)

const toBranchItem = (doc: CategoryTreeDoc): CategoryBranchItem | null => {
  if (doc.id == null) return null
  return { id: String(doc.id), title: String(doc.title ?? '') }
}

/** Items shown in drill-down column 0/1/2 (roots / L2 / L3). */
export const getDrillDownColumnItems = (
  index: CategoryIndex,
  branchPath: CategoryBranchItem[],
  columnIndex: 0 | 1 | 2,
): CategoryBranchItem[] => {
  if (columnIndex === 0) {
    return index.roots
      .filter((doc) => doc.id != null)
      .map((doc) => toBranchItem(doc)!)
  }

  if (columnIndex === 1) {
    if (branchPath.length < 1) return []
    const children = index.childrenByParent.get(branchPath[0].id) || []
    return children.filter((doc) => doc.id != null).map((doc) => toBranchItem(doc)!)
  }

  if (branchPath.length < 2) return []
  const children = index.childrenByParent.get(branchPath[1].id) || []
  return children.filter((doc) => doc.id != null).map((doc) => toBranchItem(doc)!)
}

/** Whether a drill-down column should be interactive (previous level selected). */
export const isDrillDownColumnEnabled = (
  branchPath: CategoryBranchItem[],
  columnIndex: 0 | 1 | 2,
): boolean => {
  if (columnIndex === 0) return true
  if (columnIndex === 1) return branchPath.length >= 1
  return branchPath.length >= 2
}

/**
 * IDs for list table / relationship picker at the current drill-down step.
 * Empty path → level-1 roots. Deeper path → direct children of the deepest selection.
 */
export const computeVisibleCategoryIds = (
  docs: CategoryTreeDoc[],
  filters: Pick<CategoryHierarchyFilterState, 'branchPath'>,
): Array<number | string> => {
  if (!docs.length) return []

  const index = buildCategoryIndex(docs)
  const allIds = docs.map(docId).filter((id): id is number | string => id != null)

  if (filters.branchPath.length === 0) {
    return index.roots.map(docId).filter((id): id is number | string => id != null)
  }

  const deepest = filters.branchPath[filters.branchPath.length - 1]
  const parent = index.byId.get(deepest.id)
  if (!parent) return allIds

  const directChildren = index.childrenByParent.get(deepest.id) || []

  if (directChildren.length > 0) {
    return directChildren.map(docId).filter((id): id is number | string => id != null)
  }

  return parent.id != null ? [parent.id] : []
}

/** @deprecated Use getDrillDownColumnItems. Kept for any legacy imports. */
export const getBrowseOptions = (
  index: CategoryIndex,
  branchPath: CategoryBranchItem[],
): CategoryBranchItem[] => {
  const depth = branchPath.length
  if (depth >= 3) return []
  return getDrillDownColumnItems(index, branchPath, depth as 0 | 1 | 2)
}

export const buildHierarchyWhere = (
  visibleIds: Array<number | string>,
  totalCount: number,
): { id: { in: Array<number | string> } } | null => {
  if (totalCount === 0 || visibleIds.length === totalCount) return null
  if (visibleIds.length === 0) return { id: { in: [-1] } }
  return { id: { in: visibleIds } }
}

export const mergeWhereClauses = (
  baseWhere: Where | undefined,
  hierarchyWhere: { id: { in: Array<number | string> } } | null,
): Where | undefined => {
  if (!hierarchyWhere) return baseWhere

  if (!baseWhere || Object.keys(baseWhere).length === 0) {
    return hierarchyWhere
  }

  return {
    and: [baseWhere, hierarchyWhere],
  }
}

export const stripHierarchyWhere = (where: Where | undefined): Where | undefined => {
  if (!where) return undefined

  if ('id' in where && where.id && typeof where.id === 'object' && 'in' in where.id) {
    return undefined
  }

  if ('and' in where && Array.isArray(where.and)) {
    const filtered = where.and.filter((clause) => {
      if (!clause || typeof clause !== 'object') return true
      const idClause = (clause as { id?: { in?: unknown } }).id
      return !(idClause && 'in' in idClause)
    })

    if (filtered.length === 0) return undefined
    if (filtered.length === 1) return filtered[0] as Where
    return { and: filtered }
  }

  return where
}

export const defaultCategoryHierarchyFilterState = (): CategoryHierarchyFilterState => ({
  branchPath: [],
})
