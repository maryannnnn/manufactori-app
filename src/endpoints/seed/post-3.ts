import { RequiredDataFromCollectionSlug } from 'payload'
import type { PostArgs } from './post-1'

export const post3: (args: PostArgs) => RequiredDataFromCollectionSlug<'posts'> = ({
  heroImage,
  author,
  primaryCategoryId,
}) => {
  return {
    slug: 'dollar-and-sense-the-financial-forecast',
    _status: 'published',
    authors: [author],
    hero: {
      type: 'highImpact',
      media: heroImage.id,
    },
    layout: [],
    meta: {
      description: `Money isn't just currency; it's a language. Dive deep into its nuances, where strategy meets intuition in the vast sea of finance.`,
      image: heroImage.id,
      title: 'Dollar and Sense: The Financial Forecast',
    },
    relatedPosts: [], // this is populated by the seed script
    title: 'Dollar and Sense: The Financial Forecast',
    postLongTitle: 'Dollar and Sense: The Financial Forecast',
    primary_category: primaryCategoryId,
    categories: [primaryCategoryId],
  }
}
