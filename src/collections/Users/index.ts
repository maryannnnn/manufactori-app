import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'email'],
    useAsTitle: 'name',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'jobTitle',
      type: 'text',
      admin: {
        description:
          'Public professional title shown on article author blocks (for example: Manufacturing Marketing Specialist | SEO & AI Search).',
      },
    },
    {
      name: 'professionalFocus',
      type: 'text',
      admin: {
        description:
          'Second public description line under the job title (for example: Manufacturing & Industrial Digital Marketing).',
      },
    },
  ],
  timestamps: true,
}
