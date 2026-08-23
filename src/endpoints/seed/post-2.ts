import { RequiredDataFromCollectionSlug } from 'payload'
import type { PostArgs } from './post-1'

export const post2: (args: PostArgs) => RequiredDataFromCollectionSlug<'posts'> = ({
  heroImage,
  author,
  primaryCategoryId,
}) => {
  return {
    slug: 'global-gaze',
    _status: 'published',
    authors: [author],
    hero: {
      type: 'highImpact',
      media: heroImage.id,
    },
    layout: [],
    meta: {
      description:
        'Explore the untold and overlooked. A magnified view into the corners of the world, where every story deserves its spotlight.',
      image: heroImage.id,
      title: 'Global Gaze: Beyond the Headlines',
    },
    relatedPosts: [], // this is populated by the seed script
    title: 'Global Gaze: Beyond the Headlines',
    postLongTitle: 'Global Gaze: Beyond the Headlines',
    primary_category: primaryCategoryId,
    categories: [primaryCategoryId],
  }
}
