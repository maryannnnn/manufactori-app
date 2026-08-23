import type { Media, User } from '@/payload-types'
import { RequiredDataFromCollectionSlug } from 'payload'

export type PostArgs = {
  heroImage: Media
  blockImage: Media
  author: User
  primaryCategoryId: number
}

export const post1: (args: PostArgs) => RequiredDataFromCollectionSlug<'posts'> = ({
  heroImage,
  author,
  primaryCategoryId,
}) => {
  return {
    slug: 'digital-horizons',
    _status: 'published',
    authors: [author],
    hero: {
      type: 'highImpact',
      media: heroImage.id,
    },
    layout: [],
    meta: {
      description:
        'Dive into the marvels of modern innovation, where the only constant is change. A journey where pixels and data converge to craft the future.',
      image: heroImage.id,
      title: 'Digital Horizons: A Glimpse into Tomorrow',
    },
    relatedPosts: [], // this is populated by the seed script
    title: 'Digital Horizons: A Glimpse into Tomorrow',
    postLongTitle: 'Digital Horizons: A Glimpse into Tomorrow',
    primary_category: primaryCategoryId,
    categories: [primaryCategoryId],
  }
}
