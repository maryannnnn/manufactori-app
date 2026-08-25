import { PreviewSearchParams } from '@/app/(frontend)/next/preview/route'
import { PayloadRequest, CollectionSlug } from 'payload'

type Props = {
  collection: CollectionSlug
  slug: string
  categorySlug?: string | null
  req: PayloadRequest
}

export const generatePreviewPath = ({ collection, slug, categorySlug }: Props) => {
  if (slug === undefined || slug === null) {
    return null
  }

  const encodedSlug = encodeURIComponent(slug)

  let path = `/${encodedSlug}`

  if (collection === 'posts') {
    path = categorySlug
      ? `/blog/${encodeURIComponent(categorySlug)}/${encodedSlug}`
      : `/blog/${encodedSlug}`
  }

  if (collection === 'categories') {
    path = `/blog/category/${encodedSlug}`
  }

  if (collection === 'case-study-categories') {
    path = `/case-study/category/${encodedSlug}`
  }

  if (collection === 'case-studies') {
    path = categorySlug
      ? `/case-study/${encodeURIComponent(categorySlug)}/${encodedSlug}`
      : `/case-study/${encodedSlug}`
  }

  const encodedParams = new URLSearchParams({
    path,
    previewSecret: process.env.PREVIEW_SECRET || '',
  } satisfies PreviewSearchParams)

  return `/next/preview?${encodedParams.toString()}`
}
