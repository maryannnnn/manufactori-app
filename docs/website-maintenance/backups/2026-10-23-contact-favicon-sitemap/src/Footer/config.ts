import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateFooter } from './hooks/revalidateFooter'

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: 'Footer',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'channels',
      type: 'group',
      label: 'Contact and social links',
      admin: {
        description:
          'Small footer icons. Paste a full URL, or a username / number / email. Leave a field empty to hide that icon. WhatsApp and phone fall back to the existing public contact number if left empty.',
      },
      fields: [
        {
          name: 'linkedin',
          type: 'text',
          label: 'LinkedIn',
          admin: {
            placeholder: 'https://www.linkedin.com/company/example',
          },
        },
        {
          name: 'facebook',
          type: 'text',
          label: 'Facebook',
          admin: {
            placeholder: 'https://www.facebook.com/example',
          },
        },
        {
          name: 'whatsapp',
          type: 'text',
          label: 'WhatsApp',
          admin: {
            placeholder: 'https://wa.me/972538974802',
          },
        },
        {
          name: 'telegram',
          type: 'text',
          label: 'Telegram',
          admin: {
            placeholder: 'https://t.me/username',
          },
        },
        {
          name: 'email',
          type: 'text',
          label: 'Email',
          admin: {
            placeholder: 'hello@example.com',
          },
        },
        {
          name: 'phone',
          type: 'text',
          label: 'Phone',
          admin: {
            placeholder: '+972538974802',
          },
        },
      ],
    },
    {
      name: 'navItems',
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 6,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Footer/RowLabel#RowLabel',
        },
      },
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
