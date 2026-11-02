import type { CollectionBeforeValidateHook, CollectionConfig, Where } from 'payload'
import { APIError, slugField } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { defaultTiptap } from '@/fields/defaultTiptap'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { revalidateIndustry, revalidateIndustryDelete } from './hooks/revalidateIndustry'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

const rich = (name: string, label: string, description: string) => ({
  name,
  type: 'richText' as const,
  label,
  editor: defaultTiptap,
  admin: { description },
})

const idOf = (value: unknown): number | string | null => {
  if (typeof value === 'number' || typeof value === 'string') return value
  if (value && typeof value === 'object' && 'id' in value) {
    const id = (value as { id?: unknown }).id
    if (typeof id === 'number' || typeof id === 'string') return id
  }
  return null
}

const validateIndustryShape: CollectionBeforeValidateHook = async ({ data, originalDoc, req }) => {
  if (!data) return data

  if (data.industryLevel !== 'secondary') {
    data.parentIndustry = null
  }

  if (data.industryLevel === 'secondary' && data._status === 'published' && !idOf(data.parentIndustry)) {
    throw new APIError('A published secondary industry must reference a primary industry.', 400)
  }

  const parentId = idOf(data.parentIndustry)
  if (data.industryLevel === 'secondary' && parentId != null) {
    const parent = await req.payload.findByID({
      collection: 'industries',
      id: parentId,
      depth: 0,
      disableErrors: true,
      overrideAccess: true,
      draft: true,
    })
    if (!parent) throw new APIError('The parent industry does not exist.', 400)
    if (parent.industryLevel !== 'primary') {
      throw new APIError('The parent must be a primary industry. A third level is not allowed.', 400)
    }
    if (originalDoc?.id != null && String(parent.id) === String(originalDoc.id)) {
      throw new APIError('An industry cannot be its own parent.', 400)
    }
  }

  if (typeof data.slug === 'string' && data.slug) {
    const siblingWhere: Where[] = [{ slug: { equals: data.slug } }]
    if (parentId != null) siblingWhere.push({ parentIndustry: { equals: parentId } })
    else siblingWhere.push({ parentIndustry: { exists: false } })
    if (originalDoc?.id != null) siblingWhere.push({ id: { not_equals: originalDoc.id } })
    const siblings = await req.payload.find({
      collection: 'industries',
      depth: 0,
      limit: 1,
      overrideAccess: true,
      pagination: false,
      where: { and: siblingWhere },
    })
    if (siblings.docs.length > 0) {
      throw new APIError('Another industry with this slug already exists under the same parent.', 400)
    }
  }

  return data
}

export const Industries: CollectionConfig = {
  slug: 'industries',
  dbName: 'ind',
  labels: {
    singular: 'Industry',
    plural: 'Industries',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  defaultPopulate: {
    title: true,
    slug: true,
    industryLevel: true,
    parentIndustry: true,
    industryLongTitle: true,
    industryPreviewDescription: true,
    industryPreviewImage: true,
  },
  admin: {
    group: 'Industries',
    useAsTitle: 'title',
    defaultColumns: ['title', 'industryLevel', 'parentIndustry', 'slug', 'displayOrder'],
    description:
      'Primary industries and their secondary specializations. Use the approved Industrial names. Do not add a third level, and do not put secondary industries in the main navigation.',
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          categorySlug:
            data?.parentIndustry && typeof data.parentIndustry === 'object'
              ? data.parentIndustry.slug
              : null,
          collection: 'industries',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        categorySlug:
          data?.parentIndustry && typeof data.parentIndustry === 'object'
            ? (data.parentIndustry as { slug?: string }).slug
            : null,
        collection: 'industries',
        req,
      }),
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Internal document title. This is not the public H1.',
      },
    },
    {
      name: 'industryLongTitle',
      type: 'text',
      label: 'Long Title (H1)',
      admin: {
        description: 'Public page heading. Falls back to the internal title when empty.',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Basic Information',
          fields: [
            {
              name: 'industryLevel',
              type: 'select',
              label: 'Industry Level',
              required: true,
              defaultValue: 'primary',
              options: [
                { label: 'Primary Industry', value: 'primary' },
                { label: 'Secondary Industry', value: 'secondary' },
              ],
              admin: {
                description: 'Primary industries appear in the main navigation. Secondary industries belong to one primary industry.',
              },
            },
            {
              name: 'parentIndustry',
              type: 'relationship',
              label: 'Parent Industry',
              relationTo: 'industries',
              filterOptions: ({ id }) => {
                const where: Where[] = [{ industryLevel: { equals: 'primary' } }]
                if (id) where.push({ id: { not_equals: id } })
                return { and: where }
              },
              admin: {
                condition: (_, siblingData) => siblingData?.industryLevel === 'secondary',
                description: 'Required before a secondary industry is published. Only primary industries can be selected.',
              },
            },
            {
              name: 'displayOrder',
              type: 'number',
              label: 'Display Order',
              admin: {
                description: 'Lower numbers appear first among industries at the same level.',
                step: 1,
              },
            },
            {
              name: 'featured',
              type: 'checkbox',
              label: 'Featured',
              defaultValue: false,
              admin: {
                description: 'Highlight this industry where featured listings are used.',
              },
            },
          ],
        },
        {
          label: 'Preview',
          fields: [
            {
              name: 'industryPreviewDescription',
              type: 'textarea',
              label: 'Preview Description',
              admin: {
                description: 'Short text for industry cards and listings. Not the page H1 and not the meta description.',
              },
            },
            {
              name: 'industryPreviewImage',
              type: 'upload',
              label: 'Preview Image',
              relationTo: 'media',
              admin: {
                description: 'Image for the industry page and for cards. Alt text is edited on the media record.',
              },
            },
          ],
        },
        {
          label: 'Industry Overview',
          fields: [
            rich('industryOverview', 'Industry Overview', 'What this industry manufactures and how production is organized.'),
            rich('manufacturingProcesses', 'Manufacturing Processes', 'Production processes and manufacturing methods used in this industry.'),
            rich('productsAndApplications', 'Products and Applications', 'Main product groups, components, and applications.'),
            rich('materialsAndTechnologies', 'Materials and Technologies', 'Materials, equipment, technologies, and technical characteristics that matter here.'),
          ],
        },
        {
          label: 'Markets & Buyers',
          fields: [
            rich('targetMarkets', 'Target Markets', 'Industries, regions, and application sectors these manufacturers serve.'),
            rich('buyerTypes', 'Buyer Types', 'Typical customer organizations.'),
            rich('decisionMakers', 'Decision Makers', 'People who evaluate suppliers and approve a purchase.'),
            rich('buyerRequirements', 'Buyer Requirements', 'Technical, commercial, and operational requirements buyers bring to a supplier.'),
            rich('purchasingFactors', 'Purchasing Factors', 'What influences supplier selection in this industry.'),
          ],
        },
        {
          label: 'Industry Marketing Challenges',
          fields: [
            rich('marketingChallenges', 'Marketing Challenges', 'Marketing and customer-acquisition problems specific to this industry.'),
            rich('digitalMarketSpecifics', 'Digital Market Specifics', 'How online demand and digital competition work in this industry.'),
            rich('competitiveFactors', 'Competitive Factors', 'What separates one manufacturer or supplier from another.'),
            rich('leadGenerationChallenges', 'Lead Generation Challenges', 'What makes relevant B2B inquiries hard to attract, qualify, or convert.'),
          ],
        },
        {
          label: 'SEO & AI Search Strategy',
          fields: [
            rich('searchBehavior', 'Search Behavior', 'How buyers search for manufacturers, products, capabilities, and suppliers.'),
            rich('seoStrategy', 'SEO Strategy', 'Website structure, product and application pages, internal links, and search intent for this industry.'),
            rich('aiSearchStrategy', 'AI Search Strategy', 'How content and structure can be represented accurately in AI-powered search. Do not promise citations or rankings.'),
            rich('keywordAndTopicStructure', 'Keyword and Topic Structure', 'Keyword groups, product terminology, technical entities, and related search intents.'),
            rich('authorityAndVisibility', 'Authority and Visibility', 'Publications, expert mentions, references, and other visibility that can support this industry. Do not invent citations.'),
          ],
        },
        {
          label: 'Content Strategy',
          fields: [
            rich('contentStrategy', 'Content Strategy', 'What content manufacturers in this industry need, and why.'),
            rich('technicalContent', 'Technical Content', 'Specifications, capabilities, materials, standards, and engineering information buyers need.'),
            rich('productAndApplicationContent', 'Product and Application Content', 'Product descriptions, applications, and answers to buyer requirements.'),
            rich('expertiseContent', 'Expertise Content', 'Content that shows manufacturing knowledge without unsupported claims.'),
            rich('contentFormats', 'Content Formats', 'Useful formats for this industry, such as articles, product pages, guides, comparisons, case studies, video, documentation, and FAQs.'),
          ],
        },
        {
          label: 'B2B Buyer Journey & Sales Cycle',
          fields: [
            rich('buyerJourney', 'Buyer Journey', 'How a buyer in this industry moves from research to supplier evaluation.'),
            rich('salesCycleCharacteristics', 'Sales Cycle Characteristics', 'Technical evaluation, quotation, procurement, approval, testing, or other stages that actually occur here.'),
            rich('buyerQuestionsByStage', 'Buyer Questions by Stage', 'Questions and information needs at each stage of the decision.'),
            rich('trustAndConversionFactors', 'Trust and Conversion Factors', 'Evidence, specifications, references, certifications, and project examples that build trust. Do not invent proof.'),
            rich('leadNurturingApproach', 'Lead Nurturing Approach', 'How content and follow-up can support a longer decision without treating every signup as a quote.'),
          ],
        },
        {
          label: 'Digital Marketing Approach',
          fields: [
            rich('websiteAndCatalogStrategy', 'Website and Catalog Strategy', 'How the website, catalog, technical pages, and inquiry path should be organized.'),
            rich('paidAdvertisingStrategy', 'Paid Advertising Strategy', 'How Google Ads or other paid media should be used for this industry, if at all.'),
            rich('conversionOptimization', 'Conversion Optimization', 'Inquiry forms, contact paths, and other conversion points that match how this industry buys.'),
            rich('analyticsAndMeasurement', 'Analytics and Measurement', 'Digital measures such as inquiries and form submissions. Do not claim revenue or closed-sales attribution.'),
          ],
        },
        {
          label: 'Industry Expertise & Experience',
          fields: [
            rich('industryExpertise', 'Industry Expertise', 'Practical understanding of the products, processes, buyers, and commercial setting.'),
            rich('relevantExperience', 'Relevant Experience', 'Separate direct industry work from related manufacturing experience.'),
            rich('industryProofPoints', 'Industry Proof Points', 'Documented evidence only. Do not invent clients, projects, or results.'),
          ],
        },
        {
          label: 'Planned Subindustries',
          fields: [
            {
              name: 'plannedSubindustries',
              type: 'array',
              dbName: 'indPlans',
              labels: { singular: 'Planned subindustry', plural: 'Planned subindustries' },
              admin: {
                description:
                  'Preview cards only. These are not Secondary Industry records and do not create public pages.',
              },
              fields: [
                { name: 'title', type: 'text', label: 'Title' },
                {
                  name: 'slug',
                  type: 'text',
                  label: 'Planned slug',
                  admin: {
                    description: 'Stored for a future page. It does not publish a URL by itself.',
                  },
                },
                { name: 'previewDescription', type: 'textarea', label: 'Preview description' },
                {
                  name: 'previewImage',
                  type: 'upload',
                  label: 'Preview image',
                  relationTo: 'media',
                },
                { name: 'displayOrder', type: 'number', label: 'Display order' },
              ],
            },
          ],
        },
        {
          label: 'Related Services',
          fields: [
            {
              name: 'recommendedServices',
              type: 'relationship',
              label: 'Recommended Services',
              relationTo: 'services',
              hasMany: true,
              admin: {
                description: 'Existing service records. Do not copy service descriptions into this industry.',
              },
            },
          ],
        },
        {
          label: 'Related Case Studies',
          fields: [
            {
              name: 'relatedCaseStudies',
              type: 'array',
              dbName: 'indCases',
              labels: { singular: 'Case study', plural: 'Case studies' },
              admin: {
                description:
                  'Link an existing case study and say how it relates to this industry. The classification belongs to this link, not to the case study record.',
              },
              fields: [
                {
                  name: 'caseStudy',
                  type: 'relationship',
                  label: 'Case Study',
                  relationTo: 'case-studies',
                },
                {
                  name: 'relevance',
                  type: 'select',
                  label: 'Relevance',
                  options: [
                    { label: 'Direct Industry Experience', value: 'direct' },
                    { label: 'Related Manufacturing Experience', value: 'related_manufacturing' },
                    { label: 'Related Product or Technology Experience', value: 'related_product' },
                  ],
                },
                {
                  name: 'relevanceNote',
                  type: 'textarea',
                  label: 'Relevance Note',
                  admin: {
                    description: 'Why this case is relevant here. Do not rewrite the case study.',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Related Resources',
          fields: [
            {
              name: 'relatedPosts',
              type: 'relationship',
              label: 'Related Articles',
              relationTo: 'posts',
              hasMany: true,
              admin: {
                description: 'Existing articles. Leave empty when none are relevant.',
              },
            },
          ],
        },
        {
          label: 'FAQ',
          fields: [
            {
              name: 'faq',
              type: 'array',
              dbName: 'indFaq',
              labels: { singular: 'Question', plural: 'Questions' },
              admin: {
                description: 'Optional. The page can be published with no questions.',
              },
              fields: [
                { name: 'question', type: 'text', label: 'Question' },
                {
                  name: 'answer',
                  type: 'richText',
                  label: 'Answer',
                  editor: defaultTiptap,
                },
              ],
            },
          ],
        },
        {
          label: 'Call to Action',
          fields: [
            {
              name: 'ctaTitle',
              type: 'text',
              label: 'CTA Title',
            },
            {
              name: 'ctaDescription',
              type: 'textarea',
              label: 'CTA Description',
            },
            {
              name: 'ctaButtonLabel',
              type: 'text',
              label: 'CTA Button Label',
            },
            {
              name: 'ctaButtonUrl',
              type: 'text',
              label: 'CTA Button URL',
              admin: {
                description: 'Usually /contact. Do not hardcode a phone number or email address.',
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
            MetaTitleField({ hasGenerateFn: true }),
            MetaImageField({ relationTo: 'media' }),
            MetaDescriptionField({}),
            PreviewField({
              hasGenerateFn: true,
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        date: { pickerAppearance: 'dayAndTime' },
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === 'published' && !value) return new Date()
            return value
          },
        ],
      },
    },
    slugField({
      required: true,
      disableUnique: true,
      useAsSlug: 'title',
    }),
  ],
  hooks: {
    beforeValidate: [validateIndustryShape],
    afterChange: [revalidateIndustry],
    afterDelete: [revalidateIndustryDelete],
  },
  versions: {
    drafts: {
      autosave: { interval: 100 },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
