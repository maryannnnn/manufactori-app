type CategoryLike = {
  slug?: string | null
} | null | undefined

type CategoryRef = number | string | CategoryLike

type PostUrlSource = {
  slug?: string | null
  primary_category?: CategoryRef
  primary_category_slug?: string | null
}

export const getCategorySlug = (category: CategoryRef): string | null => {
  if (category && typeof category === 'object' && category.slug) {
    return category.slug
  }

  return null
}

export const getCategoryUrl = (category: CategoryRef): string | null => {
  const slug = getCategorySlug(category)
  if (!slug) return null
  return `/blog/categories/${slug}`
}

export const getPostUrl = (post: PostUrlSource | null | undefined): string | null => {
  if (!post?.slug) return null

  const categorySlug = post.primary_category_slug || getCategorySlug(post.primary_category)
  if (!categorySlug) return `/blog/${post.slug}`

  return `/blog/${categorySlug}/${post.slug}`
}

export const getReferenceUrl = (
  relationTo: string | null | undefined,
  value: { slug?: string | null; primary_category?: CategoryRef; primary_category_slug?: string | null } | string | number | null | undefined,
): string | null => {
  if (!relationTo || value == null || typeof value !== 'object') return null

  if (relationTo === 'posts') return getPostUrl(value)
  if (relationTo === 'categories') return getCategoryUrl(value)

  if (value.slug) {
    return `/${value.slug}`
  }

  return null
}
