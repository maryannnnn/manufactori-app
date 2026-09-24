import type { GlobalConfig } from 'payload'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
} from '@payloadcms/plugin-seo/fields'

import { authenticated } from '@/access/authenticated'

import { revalidateCaseStudiesArchive } from './hooks/revalidateCaseStudiesArchive'

/**
 * Page-level content and SEO for the /case-study listing route.
 *
 * The listing itself is a collection archive rather than a CMS document, so this
 * global holds only the values a Page would otherwise carry. Search, pagination
 * and the canonical URL are derived from the route and are deliberately absent.
 */
export const CaseStudiesArchive: GlobalConfig = {
  slug: 'case-studies-archive',
  label: 'Case Studies Archive',
  access: {
    read: () => true,
    update: authenticated,
  },
  admin: {
    group: 'Case Studies',
    description: 'Title and SEO for the /case-study listing page.',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Title',
              admin: {
                description:
                  'Internal page title, used for navigation and admin. Not rendered as a heading.',
              },
            },
            {
              name: 'longTitle',
              type: 'text',
              label: 'Long Title (H1)',
              admin: {
                description: 'Rendered as the H1 on /case-study.',
              },
            },
          ],
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            // No generate functions: the SEO plugin derives those from a
            // document slug, which a global does not have.
            MetaTitleField({}),
            MetaImageField({ relationTo: 'media' }),
            MetaDescriptionField({}),
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateCaseStudiesArchive],
  },
}
