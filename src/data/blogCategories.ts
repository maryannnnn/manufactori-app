import type { JSONContent } from '@tiptap/core'

export type BlogCategorySeed = {
  title: string
  slug: string
  category_long_title: string
  description: string
}

const paragraph = (text: string): JSONContent => ({
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [{ type: 'text', text }],
    },
  ],
})

/**
 * Compact thematic categories for blog articles.
 * These are not a copy of site architecture (Services / Industries / Solutions).
 */
export const blogCategories: BlogCategorySeed[] = [
  {
    title: 'Manufacturing Marketing',
    slug: 'manufacturing-marketing',
    category_long_title: 'Manufacturing Marketing Strategy for Industrial Brands',
    description:
      'Articles on how manufacturers win visibility, trust, and pipeline across long B2B buying cycles — positioning, go-to-market, and industrial marketing strategy.',
  },
  {
    title: 'SEO',
    slug: 'seo',
    category_long_title: 'SEO for Manufacturing Websites and Product Catalogs',
    description:
      'Technical and content SEO for industrial sites: search visibility, category architecture, SEO audits, and ranking for high-intent manufacturing queries.',
  },
  {
    title: 'AI Search',
    slug: 'ai-search',
    category_long_title: 'AI Search Optimization and Industrial Visibility',
    description:
      'How manufacturers show up in AI answers and generative search: AI visibility, answer-engine optimization, and content built for both Google and AI crawlers.',
  },
  {
    title: 'Google Ads',
    slug: 'google-ads',
    category_long_title: 'Google Ads for Manufacturers and Industrial Demand',
    description:
      'Paid search for manufacturing: RFQ-driven campaigns, keyword strategy, landing pages, and measurement for industrial Google Ads.',
  },
  {
    title: 'Website Development',
    slug: 'website-development',
    category_long_title: 'Industrial Website Design, Development, and Redesign',
    description:
      'Websites that support manufacturing sales: industrial UX, product catalogs, multilingual sites, redesigns, and technical performance.',
  },
  {
    title: 'Content Marketing',
    slug: 'content-marketing',
    category_long_title: 'Content Marketing and Technical Copy for Manufacturers',
    description:
      'Thought leadership, technical copywriting, and content systems that turn engineering expertise into assets buyers actually use.',
  },
  {
    title: 'Demand Generation',
    slug: 'demand-generation',
    category_long_title: 'Demand Generation, RFQs, and Qualified Manufacturing Leads',
    description:
      'How industrial brands generate RFQs and qualified leads: campaigns, LinkedIn, funnel design, and export-ready demand programs.',
  },
  {
    title: 'Branding',
    slug: 'branding',
    category_long_title: 'Industrial Branding and Manufacturing Brand Authority',
    description:
      'Positioning and brand systems for manufacturers competing in crowded global markets — from messaging to visual and digital authority.',
  },
]

export const blogCategoryToPayloadData = (category: BlogCategorySeed) => ({
  title: category.title,
  slug: category.slug,
  category_long_title: category.category_long_title,
  category_description: paragraph(category.description),
  generateSlug: false,
})
