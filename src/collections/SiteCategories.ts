import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

/**
 * Base site taxonomy tree (Website Template Categories shape).
 * Not a frontend page and not Blog Categories (`categories`).
 */
export const SiteCategories: CollectionConfig = {
  slug: 'site-categories',
  labels: {
    singular: 'Site Category',
    plural: 'Site Categories',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    group: 'Site',
    description:
      'Internal site structure tree (parent/child). Used for taxonomy and relationships — not public pages.',
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'parent', 'updatedAt'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    slugField({
      position: undefined,
      required: true,
      useAsSlug: 'title',
    }),
  ],
}
