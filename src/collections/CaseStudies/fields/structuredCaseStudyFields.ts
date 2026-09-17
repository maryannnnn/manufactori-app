import type { Field } from 'payload'

import { defaultTiptap } from '@/fields/defaultTiptap'

const DURATION_OPTIONS = [
  { label: '6 Months', value: '6_months' },
  ...Array.from({ length: 20 }, (_, index) => {
    const years = index + 1
    return {
      label: `${years} Year${years === 1 ? '' : 's'}`,
      value: `${years}_years`,
    }
  }),
]

const PAID_AD_CHANNELS = [
  { label: 'Google Ads', value: 'google_ads' },
  { label: 'Microsoft Ads', value: 'microsoft_ads' },
  { label: 'Yandex Direct', value: 'yandex_direct' },
  { label: 'Meta Ads', value: 'meta_ads' },
  { label: 'LinkedIn Ads', value: 'linkedin_ads' },
  { label: 'Other', value: 'other' },
]

const SOCIAL_CHANNELS = [
  { label: 'LinkedIn', value: 'linkedin' },
  { label: 'Facebook', value: 'facebook' },
  { label: 'Instagram', value: 'instagram' },
  { label: 'YouTube', value: 'youtube' },
  { label: 'TikTok', value: 'tiktok' },
  { label: 'Telegram', value: 'telegram' },
  { label: 'Other', value: 'other' },
]

/**
 * Structured Case Study fields for B2B manufacturing cases.
 * Categories / FAQ / relatedCases stay in existing collection fields & layout blocks.
 */
export const caseStudySidebarFields: Field[] = [
  {
    name: 'featured',
    type: 'checkbox',
    label: 'Featured',
    defaultValue: false,
    admin: {
      position: 'sidebar',
      description: 'Display this Case Study on the homepage.',
    },
  },
  {
    name: 'displayOrder',
    type: 'number',
    label: 'Display Order',
    admin: {
      position: 'sidebar',
      description:
        'Controls the priority and display order of this Case Study. Lower numbers appear first.',
      step: 1,
    },
  },
  {
    name: 'duration',
    type: 'select',
    label: 'Duration',
    options: DURATION_OPTIONS,
    admin: {
      position: 'sidebar',
      description: 'Engagement duration for this Case Study.',
    },
  },
]

export const caseStudyProfileTabFields: Field[] = [
  {
    name: 'manufacturingProfile',
    type: 'group',
    label: 'Manufacturing Profile',
    admin: {
      description:
        'Production core of the client. Content fields only — use Case Study Categories for Technology taxonomy.',
    },
    fields: [
      {
        name: 'productionCapabilities',
        type: 'richText',
        label: 'Production Capabilities',
        editor: defaultTiptap,
        admin: {
          description:
            'Production capacity, equipment, operations, volumes, and full/partial cycle.',
        },
      },
      {
        name: 'products',
        type: 'richText',
        label: 'Products',
        editor: defaultTiptap,
        admin: {
          description: 'Real products or product groups manufactured by the client.',
        },
      },
      {
        name: 'materials',
        type: 'richText',
        label: 'Materials',
        editor: defaultTiptap,
        admin: {
          description: 'Materials used in production (metal, steel, wood, acrylic, composites, etc.).',
        },
      },
      {
        name: 'applications',
        type: 'richText',
        label: 'Applications',
        editor: defaultTiptap,
        admin: {
          description:
            'Industries and use-cases for the products (construction, facades, retail, HoReCa, etc.).',
        },
      },
    ],
  },
  {
    name: 'businessChallenge',
    type: 'group',
    label: 'Business Challenge',
    fields: [
      {
        name: 'initialState',
        type: 'richText',
        label: 'Initial State',
        editor: defaultTiptap,
        admin: {
          description: 'What the business looked like before the engagement.',
        },
      },
      {
        name: 'challenge',
        type: 'richText',
        label: 'Challenge',
        editor: defaultTiptap,
        admin: {
          description: 'The core set of business problems.',
        },
      },
      {
        name: 'goals',
        type: 'richText',
        label: 'Goals',
        editor: defaultTiptap,
        admin: {
          description: 'Project goals and KPIs.',
        },
      },
    ],
  },
  {
    name: 'nicheSegmentation',
    type: 'array',
    label: 'Niche / Commercial Segmentation',
    dbName: 'nicheSeg',
    admin: {
      description:
        'How a complex plant is broken into distinct commercial directions. Do not duplicate products/applications here.',
      initCollapsed: true,
    },
    fields: [
      {
        name: 'name',
        type: 'text',
        label: 'Niche Name',
        required: true,
      },
      {
        name: 'description',
        type: 'richText',
        label: 'Description',
        editor: defaultTiptap,
        admin: {
          description: 'Essence of the direction and positioning.',
        },
      },
      {
        name: 'marketingApproach',
        type: 'richText',
        label: 'Marketing Approach',
        editor: defaultTiptap,
        admin: {
          description: 'Promotion strategy for this specific direction.',
        },
      },
    ],
  },
]

export const caseStudyDigitalTabFields: Field[] = [
  {
    name: 'digitalEcosystem',
    type: 'richText',
    label: 'Digital Ecosystem',
    editor: defaultTiptap,
    admin: {
      description:
        'Overall digital infrastructure (website, landings, CRM, analytics, ads, messengers).',
    },
  },
  {
    name: 'websiteArchitecture',
    type: 'richText',
    label: 'Website Architecture',
    editor: defaultTiptap,
    admin: {
      description: 'Site structure, URL architecture, landing pages, navigation, and content hierarchy.',
    },
  },
  {
    name: 'semanticArchitecture',
    type: 'richText',
    label: 'Semantic Architecture',
    editor: defaultTiptap,
    admin: {
      description: 'Semantic structure, entity links, internal hubs and clusters.',
    },
  },
  {
    name: 'marketingStrategy',
    type: 'group',
    label: 'Marketing Strategy',
    fields: [
      {
        name: 'seoAndContentStrategy',
        type: 'richText',
        label: 'SEO & Content Strategy',
        editor: defaultTiptap,
        admin: {
          description: 'Combined SEO, semantics, content, and internal linking strategy.',
        },
      },
      {
        name: 'leadGenMechanism',
        type: 'richText',
        label: 'Lead Gen Mechanism',
        editor: defaultTiptap,
        admin: {
          description:
            'Conversion layer: forms, WhatsApp, quote/calc forms, proposals, CRM attribution.',
        },
      },
      {
        name: 'paidAdvertising',
        type: 'array',
        label: 'Paid Advertising',
        dbName: 'paidAds',
        admin: { initCollapsed: true },
        fields: [
          {
            name: 'channel',
            type: 'select',
            label: 'Channel',
            required: true,
            options: PAID_AD_CHANNELS,
          },
          {
            name: 'strategy',
            type: 'richText',
            label: 'Strategy',
            editor: defaultTiptap,
          },
          {
            name: 'campaignStructure',
            type: 'richText',
            label: 'Campaign Structure',
            editor: defaultTiptap,
          },
          {
            name: 'results',
            type: 'richText',
            label: 'Results',
            editor: defaultTiptap,
          },
        ],
      },
      {
        name: 'socialMedia',
        type: 'array',
        label: 'Social Media',
        dbName: 'socMed',
        admin: { initCollapsed: true },
        fields: [
          {
            name: 'channel',
            type: 'select',
            label: 'Channel',
            required: true,
            options: SOCIAL_CHANNELS,
          },
          {
            name: 'strategy',
            type: 'richText',
            label: 'Strategy',
            editor: defaultTiptap,
          },
          {
            name: 'content',
            type: 'richText',
            label: 'Content',
            editor: defaultTiptap,
          },
          {
            name: 'results',
            type: 'richText',
            label: 'Results',
            editor: defaultTiptap,
          },
        ],
      },
    ],
  },
  {
    name: 'aiSearchOptimization',
    type: 'group',
    label: 'AI Search Optimization (GEO & AEO)',
    fields: [
      {
        name: 'brandAuthorityAndTrust',
        type: 'richText',
        label: 'Brand Authority & Trust',
        editor: defaultTiptap,
        admin: {
          description:
            'Brand authority, E-E-A-T signals, external mentions, reviews, expert materials and publications.',
        },
      },
      {
        name: 'entityAndGeoStructure',
        type: 'richText',
        label: 'Entity & GEO Structure',
        editor: defaultTiptap,
        admin: {
          description:
            'Company and products as interconnected entities for AI search (ChatGPT, Perplexity, Gemini, Google SGE).',
        },
      },
    ],
  },
]

export const caseStudyResultsTabFields: Field[] = [
  {
    name: 'implementationProcess',
    type: 'richText',
    label: 'Implementation Process',
    editor: defaultTiptap,
    admin: {
      description: 'Main stages of the engagement.',
    },
  },
  {
    name: 'timeline',
    type: 'array',
    label: 'Timeline',
    dbName: 'timeline',
    admin: { initCollapsed: true },
    fields: [
      {
        name: 'period',
        type: 'text',
        label: 'Period',
      },
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
    ],
  },
  {
    name: 'resultsSummary',
    type: 'richText',
    label: 'Results Summary',
    editor: defaultTiptap,
    admin: {
      description: 'Final client outcome in narrative form.',
    },
  },
  {
    name: 'metrics',
    type: 'array',
    label: 'Metrics',
    dbName: 'metrics',
    admin: { initCollapsed: true },
    fields: [
      {
        name: 'value',
        type: 'text',
        label: 'Value',
        required: true,
        admin: {
          description: 'Example: "+140%", "3.2x"',
        },
      },
      {
        name: 'label',
        type: 'text',
        label: 'Label',
        required: true,
        admin: {
          description: 'Example: "Growth of qualified leads"',
        },
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
    name: 'projectsShowcase',
    type: 'array',
    label: 'Projects Showcase',
    dbName: 'projShow',
    admin: {
      description: 'Concrete examples of manufactured products / plant projects.',
      initCollapsed: true,
    },
    fields: [
      {
        name: 'projectName',
        type: 'text',
        label: 'Project Name',
        required: true,
      },
      {
        name: 'description',
        type: 'richText',
        label: 'Description',
        editor: defaultTiptap,
      },
      {
        name: 'image',
        type: 'upload',
        label: 'Image',
        relationTo: 'media',
      },
      {
        name: 'url',
        type: 'text',
        label: 'URL',
        admin: {
          description: 'Optional external or internal project URL.',
        },
      },
    ],
  },
  {
    name: 'expertInsight',
    type: 'richText',
    label: 'Expert Insight',
    editor: defaultTiptap,
    admin: {
      description: 'Team takeaways, engineering/marketing hacks and challenges.',
    },
  },
  {
    name: 'clientTestimonial',
    type: 'group',
    label: 'Client Testimonial',
    admin: {
      description:
        'Structured proof quote. Free-form comments remain available via the existing Case Study Comments layout block.',
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
