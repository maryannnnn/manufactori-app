'use client'

import type { DefaultCellComponentProps } from 'payload'

import {
  formatHierarchicalLabel,
  getCategoryDepth,
  type CategoryTreeDoc,
} from '@/utilities/categoryHierarchy'

export const CategoryTitleCell: React.FC<DefaultCellComponentProps> = ({ cellData, rowData }) => {
  const title = String(cellData ?? rowData?.title ?? '')
  const depth = getCategoryDepth(rowData as CategoryTreeDoc)

  return <span>{formatHierarchicalLabel(title, depth)}</span>
}
