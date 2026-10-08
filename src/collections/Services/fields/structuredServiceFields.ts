import type { Field } from 'payload'

import { defaultTiptap } from '@/fields/defaultTiptap'

export const SERVICE_DURATION_OPTIONS = [
  { label: 'One-time Project', value: 'one_time_project' },
  { label: '1 Month', value: '1_month' },
  { label: '3 Months', value: '3_months' },
  { label: '6 Months', value: '6_months' },
  { label: '1 Year', value: '1_year' },
  { label: 'Ongoing', value: 'ongoing' },
] as const

export const SERVICE_FORMAT_OPTIONS = [
  { label: 'Initial project / setup', value: 'initial_project' },
  { label: 'Ongoing monthly work', value: 'ongoing_monthly' },
  { label: 'Campaign / project', value: 'campaign' },
] as const

export const serviceSidebarFields: Field[] = [
  {
    name: 'featured',
    type: 'checkbox',
    label: 'Featured',
    defaultValue: false,
    admin: {
      position: 'sidebar',
      description: 'Display this Service in featured listings.',
    },
  },
  {
    name: 'displayOrder',
    type: 'number',
    label: 'Display Order',
    admin: {
      position: 'sidebar',
      description: 'Lower numbers appear first in the Services archive.',
      step: 1,
    },
  },
]

export const servicePreviewFields: Field[] = [
  {
    name: 'service_preview_title',
    type: 'text',
    label: 'Service Preview Title',
    admin: {
      description: 'Short title for cards, archives and related-service lists. Not the page H1.',
    },
  },
  {
    name: 'service_preview_description',
    type: 'textarea',
    label: 'Service Preview Description',
    admin: {
      description: 'Compact explanation of the service and its business purpose.',
    },
  },
  {
    name: 'service_preview_image',
    type: 'upload',
    label: 'Service Preview Image',
    relationTo: 'media',
    admin: {
      description: 'Service page image. Not used on Related Services or archive cards.',
    },
  },
  {
    name: 'service_card_image',
    type: 'upload',
    label: 'Service Card Image',
    relationTo: 'media',
    admin: {
      description:
        'Image for archive cards and Related Services. Separate from the Service page image.',
    },
  },
]

export const serviceIntroductionFields: Field[] = [
  {
    name: 'service_content_title',
    type: 'text',
    label: 'Service Content Title',
    admin: {
      description:
        'In-page heading under the H1. Separate from the internal title, long title and preview title.',
    },
  },
  {
    name: 'introduction',
    type: 'group',
    label: 'Service Introduction',
    admin: {
      description: 'Who the service is for, the problem it addresses, and the intended outcome.',
    },
    fields: [
      {
        name: 'text',
        type: 'richText',
        label: 'Short Introduction',
        editor: defaultTiptap,
      },
      {
        name: 'supportingText',
        type: 'richText',
        label: 'Supporting Text',
        editor: defaultTiptap,
        admin: {
          description: 'Optional second paragraph. Leave empty when the short introduction is enough.',
        },
      },
    ],
  },
]

export const serviceSituationsFields: Field[] = [
  {
    name: 'clientSituations',
    type: 'array',
    label: 'Client Situations',
    dbName: 'svcSit',
    admin: {
      description: 'Situations in which this service becomes relevant. Optional.',
      initCollapsed: true,
    },
    fields: [
      {
        name: 'title',
        type: 'text',
        label: 'Situation',
        required: true,
      },
      {
        name: 'description',
        type: 'richText',
        label: 'Description',
        editor: defaultTiptap,
      },
      {
        name: 'consequence',
        type: 'richText',
        label: 'Consequence / Problem',
        editor: defaultTiptap,
      },
      {
        name: 'recommendedApproach',
        type: 'richText',
        label: 'Recommended Approach',
        editor: defaultTiptap,
      },
    ],
  },
]

export const serviceScopeFields: Field[] = [
  {
    name: 'serviceScope',
    type: 'array',
    label: 'What the Service Includes',
    dbName: 'svcScope',
    admin: {
      description: 'Scope items for this Service. Optional.',
      initCollapsed: true,
    },
    fields: [
      {
        name: 'title',
        type: 'text',
        label: 'Title',
        required: true,
      },
      {
        name: 'description',
        type: 'richText',
        label: 'Description',
        editor: defaultTiptap,
      },
      {
        name: 'deliverables',
        type: 'richText',
        label: 'Deliverables',
        editor: defaultTiptap,
      },
      {
        name: 'approach',
        type: 'richText',
        label: 'Process / Approach',
        editor: defaultTiptap,
      },
    ],
  },
]

export const serviceProcessFields: Field[] = [
  {
    name: 'processSteps',
    type: 'array',
    label: 'How the Service Works',
    dbName: 'svcProc',
    admin: {
      description: 'Process steps. Typically 4–8, with no required count.',
      initCollapsed: true,
    },
    fields: [
      {
        name: 'stepNumber',
        type: 'number',
        label: 'Step Number',
        min: 1,
        admin: {
          description: 'Optional. The frontend uses the list order when this is empty.',
          step: 1,
        },
      },
      {
        name: 'title',
        type: 'text',
        label: 'Title',
        required: true,
      },
      {
        name: 'description',
        type: 'richText',
        label: 'Description',
        editor: defaultTiptap,
      },
      {
        name: 'duration',
        type: 'text',
        label: 'Duration',
      },
      {
        name: 'deliverable',
        type: 'richText',
        label: 'Deliverable',
        editor: defaultTiptap,
      },
      {
        name: 'clientInvolvement',
        type: 'richText',
        label: 'Client Involvement',
        editor: defaultTiptap,
      },
    ],
  },
]

export const serviceEntryOfferFields: Field[] = [
  {
    name: 'entryOffer',
    type: 'group',
    label: 'Initial Start / Entry Offer',
    admin: {
      description: 'How a new client can start. All fields are optional and editable per Service.',
    },
    fields: [
      {
        name: 'title',
        type: 'text',
        label: 'Title',
      },
      {
        name: 'description',
        type: 'richText',
        label: 'Description',
        editor: defaultTiptap,
      },
      {
        name: 'includes',
        type: 'richText',
        label: 'What Is Included',
        editor: defaultTiptap,
      },
      {
        name: 'duration',
        type: 'text',
        label: 'Duration',
        admin: {
          description: 'Free-form, e.g. "2–4 weeks". Not a global price list.',
        },
      },
      {
        name: 'deliverables',
        type: 'richText',
        label: 'Deliverables',
        editor: defaultTiptap,
      },
      {
        name: 'price',
        type: 'text',
        label: 'Price',
        admin: {
          description: 'Optional. Leave empty when price is not published.',
        },
      },
      {
        name: 'ctaLabel',
        type: 'text',
        label: 'CTA Label',
      },
      {
        name: 'ctaUrl',
        type: 'text',
        label: 'CTA URL',
      },
      {
        name: 'nextStep',
        type: 'richText',
        label: 'Next Step',
        editor: defaultTiptap,
      },
    ],
  },
]

export const serviceWorkingFormatFields: Field[] = [
  {
    name: 'workingFormat',
    type: 'group',
    label: 'Working Format / Duration',
    fields: [
      {
        name: 'formats',
        type: 'array',
        label: 'Formats',
        dbName: 'svcFmt',
        admin: {
          initCollapsed: true,
          description: 'Add only the formats that apply to this Service.',
        },
        fields: [
          {
            name: 'format',
            type: 'select',
            label: 'Format',
            options: [...SERVICE_FORMAT_OPTIONS],
          },
          {
            name: 'duration',
            type: 'select',
            label: 'Duration',
            options: [...SERVICE_DURATION_OPTIONS],
          },
          {
            name: 'description',
            type: 'richText',
            label: 'Description',
            editor: defaultTiptap,
          },
        ],
      },
      {
        name: 'minimumEngagement',
        type: 'select',
        label: 'Minimum Engagement',
        options: [...SERVICE_DURATION_OPTIONS],
      },
      {
        name: 'frequency',
        type: 'text',
        label: 'Frequency',
        admin: {
          description: 'Optional, e.g. "Weekly working sessions".',
        },
      },
    ],
  },
]

export const serviceOutcomesFields: Field[] = [
  {
    name: 'expectedOutcomes',
    type: 'array',
    label: 'Expected Outcomes',
    dbName: 'svcOut',
    admin: {
      description: 'Descriptive outcomes. Do not invent numeric guarantees.',
      initCollapsed: true,
    },
    fields: [
      {
        name: 'title',
        type: 'text',
        label: 'Outcome',
        required: true,
      },
      {
        name: 'description',
        type: 'richText',
        label: 'Description',
        editor: defaultTiptap,
      },
    ],
  },
]

export const serviceFaqFields: Field[] = [
  {
    name: 'faq',
    type: 'group',
    label: 'Questions & Answers',
    admin: {
      description:
        'Same question/answer pattern as Case Study FAQ. Stored on the Service, not as a separate FAQ collection.',
    },
    fields: [
      {
        name: 'title',
        type: 'text',
        label: 'FAQ Title',
        admin: {
          description: 'Section heading. Falls back to a generic heading when empty.',
        },
      },
      {
        name: 'intro',
        type: 'richText',
        label: 'Intro Text',
        editor: defaultTiptap,
      },
      {
        name: 'items',
        type: 'array',
        label: 'Questions',
        dbName: 'svcFaq',
        labels: { singular: 'Question', plural: 'Questions' },
        admin: {
          initCollapsed: true,
          description: 'Typically 5–15 questions. No required count.',
        },
        fields: [
          {
            name: 'question',
            type: 'text',
            required: true,
          },
          {
            name: 'answer',
            type: 'richText',
            required: true,
            editor: defaultTiptap,
          },
        ],
      },
    ],
  },
]

export const serviceTestimonialFields: Field[] = [
  {
    name: 'clientTestimonial',
    type: 'group',
    label: 'Client Testimonial',
    admin: {
      description:
        'Same proof-quote shape as Case Study. Separate from FAQ and from the optional Comments layout block.',
    },
    fields: [
      {
        name: 'quote',
        type: 'richText',
        label: 'Quote',
        editor: defaultTiptap,
      },
      {
        name: 'author',
        type: 'text',
        label: 'Author',
      },
      {
        name: 'position',
        type: 'text',
        label: 'Position',
      },
      {
        name: 'company',
        type: 'text',
        label: 'Company',
      },
    ],
  },
]
