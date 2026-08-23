import { BeforeSync, DocToSync } from '@payloadcms/plugin-search/types'

export const beforeSyncWithSearch: BeforeSync = async ({ req, originalDoc, searchDoc }) => {
  const {
    doc: { relationTo: collection },
  } = searchDoc

  const { slug, id, categories, title, meta, primary_category } = originalDoc

  const modifiedDoc: DocToSync = {
    ...searchDoc,
    slug,
    primary_category_slug: null,
    meta: {
      ...meta,
      title: meta?.title || title,
      image: meta?.image?.id || meta?.image,
      description: meta?.description,
    },
    categories: [],
  }

  if (primary_category && typeof primary_category === 'object' && primary_category.slug) {
    modifiedDoc.primary_category_slug = primary_category.slug
  } else if (typeof primary_category === 'number' || typeof primary_category === 'string') {
    const primary = await req.payload.findByID({
      collection: 'categories',
      id: primary_category,
      disableErrors: true,
      depth: 0,
      select: { slug: true },
      req,
    })
    modifiedDoc.primary_category_slug = primary?.slug || null
  }

  if (categories && Array.isArray(categories) && categories.length > 0) {
    const populatedCategories: { id: string | number; title: string; slug?: string | null }[] = []
    for (const category of categories) {
      if (!category) {
        continue
      }

      if (typeof category === 'object') {
        populatedCategories.push(category)
        continue
      }

      const doc = await req.payload.findByID({
        collection: 'categories',
        id: category,
        disableErrors: true,
        depth: 0,
        select: { title: true, slug: true },
        req,
      })

      if (doc !== null) {
        populatedCategories.push(doc)
      } else {
        console.error(
          `Failed. Category not found when syncing collection '${collection}' with id: '${id}' to search.`,
        )
      }
    }

    modifiedDoc.categories = populatedCategories.map((each) => ({
      relationTo: 'categories',
      categoryID: String(each.id),
      title: each.title,
      slug: each.slug || null,
    }))
  }

  return modifiedDoc
}
