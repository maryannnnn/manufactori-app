import type { Metadata } from 'next'

import { RelatedPosts } from '@/blocks/RelatedPosts/Component'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { CollectionArchive } from '@/components/CollectionArchive'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { getPostListPreview } from '@/utilities/getPostListPreview'
import { hasRichTextContent } from '@/utilities/richText/hasContent'
import { generateMeta } from '@/utilities/generateMeta'
import { getCategorySlug } from '@/utilities/getContentUrls'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import React, { cache } from 'react'

import type { CardPostData } from '@/components/Card'

import PageClient from './page.client'

type Args = {
  params: Promise<{
    segments?: string[]
  }>
}

const parseSegments = (segments: string[] | undefined) => {
  if (!segments?.length) return null

  const decoded = segments.map((segment) => decodeURIComponent(segment)).filter(Boolean)
  if (decoded.length === 1) {
    const postSlug = decoded[0]
    if (!postSlug || postSlug === 'categories') return null
    return { type: 'post' as const, categorySlug: null, postSlug }
  }

  if (decoded.length === 2 && decoded[0] === 'categories') {
    const categorySlug = decoded[1]
    if (!categorySlug) return null
    return { type: 'category' as const, categorySlug }
  }

  if (decoded.length === 2) {
    const categorySlug = decoded[0]
    const postSlug = decoded[1]
    if (!categorySlug || !postSlug) return null
    return { type: 'post' as const, categorySlug, postSlug }
  }

  return null
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })

  const [categories, posts] = await Promise.all([
    payload.find({
      collection: 'categories',
      draft: false,
      limit: 1000,
      overrideAccess: false,
      pagination: false,
      select: { slug: true },
    }),
    payload.find({
      collection: 'posts',
      draft: false,
      limit: 1000,
      overrideAccess: false,
      pagination: false,
      depth: 1,
      select: {
        slug: true,
        primary_category: true,
      },
    }),
  ])

  const categoryParams = categories.docs.flatMap(({ slug }) =>
    slug ? [{ segments: ['categories', slug] }] : [],
  )

  const postParams = posts.docs.flatMap((post) => {
    if (!post.slug) return []
    const category = getCategorySlug(post.primary_category)
    if (!category || category === 'categories') {
      return [{ segments: [post.slug] }]
    }
    return [{ segments: [category, post.slug] }]
  })

  return [...categoryParams, ...postParams]
}

export default async function BlogCatchAllPage({ params: paramsPromise }: Args) {
  const parsed = parseSegments((await paramsPromise).segments)
  if (!parsed) notFound()

  if (parsed.type === 'category') {
    return renderCategoryPage(parsed.categorySlug)
  }

  return renderPostPage(parsed.categorySlug, parsed.postSlug)
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const parsed = parseSegments((await paramsPromise).segments)
  if (!parsed) return generateMeta({ doc: null })

  if (parsed.type === 'category') {
    const category = await queryCategoryBySlug({ slug: parsed.categorySlug })
    const title = category?.category_long_title || category?.title
    return {
      title: title ? `${title} | Payload Website Template` : 'Payload Website Template',
    }
  }

  const post = await queryPostBySlug({ slug: parsed.postSlug })
  const primarySlug = getCategorySlug(post?.primary_category)

  if (parsed.categorySlug) {
    if (post && primarySlug !== parsed.categorySlug) {
      return generateMeta({ doc: null })
    }
  } else if (post && primarySlug) {
    return generateMeta({ doc: null })
  }

  return generateMeta({ doc: post })
}

async function renderCategoryPage(slug: string) {
  const { isEnabled: draft } = await draftMode()
  const url = `/blog/categories/${slug}`
  const category = await queryCategoryBySlug({ slug })

  if (!category) return <PayloadRedirects url={url} />

  const payload = await getPayload({ config: configPromise })
  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 100,
    overrideAccess: false,
    where: {
      categories: {
        in: [category.id],
      },
    },
    select: {
      title: true,
      slug: true,
      categories: true,
      primary_category: true,
      meta: true,
      layout: true,
    },
  })

  const postCards: CardPostData[] = posts.docs.map((post) => {
    const preview = getPostListPreview(post)
    return {
      title: post.title,
      slug: post.slug,
      categories: post.categories,
      primary_category: post.primary_category,
      meta: post.meta,
      previewTitle: preview.previewTitle,
      previewText: preview.previewText,
      previewImage: preview.previewImage,
    }
  })

  const heading = category.category_long_title || category.title

  return (
    <article className="pt-16 pb-24">
      <PageClient theme="light" />
      <PayloadRedirects disableNotFound url={url} />
      {draft && <LivePreviewListener />}

      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>{heading}</h1>
        </div>

        {hasRichTextContent(category.category_description) && (
          <div className="mt-8">
            <RichText
              data={category.category_description as Record<string, unknown>}
              enableGutter={false}
            />
          </div>
        )}

        {category.category_image && typeof category.category_image === 'object' && (
          <div className="mt-8 max-w-[48rem]">
            <Media resource={category.category_image} size="100vw" />
          </div>
        )}
      </div>

      <div className="mb-16">
        {postCards.length > 0 ? (
          <CollectionArchive posts={postCards} />
        ) : (
          <div className="container">
            <p>В этой категории пока нет постов.</p>
          </div>
        )}
      </div>

      {category.layout && category.layout.length > 0 && (
        <RenderBlocks blocks={category.layout as Parameters<typeof RenderBlocks>[0]['blocks']} />
      )}
    </article>
  )
}

async function renderPostPage(categorySlug: string | null, postSlug: string) {
  const { isEnabled: draft } = await draftMode()
  const url = categorySlug ? `/blog/${categorySlug}/${postSlug}` : `/blog/${postSlug}`
  const post = await queryPostBySlug({ slug: postSlug })

  if (!post) return <PayloadRedirects url={url} />

  const primaryCategorySlug = getCategorySlug(post.primary_category)
  if (categorySlug) {
    if (primaryCategorySlug !== categorySlug) notFound()
  } else if (primaryCategorySlug) {
    notFound()
  }

  const { hero, layout } = post

  return (
    <article className="pt-16 pb-16">
      <PageClient theme="dark" />
      <PayloadRedirects disableNotFound url={url} />
      {draft && <LivePreviewListener />}

      <RenderHero {...hero} />
      {layout && layout.length > 0 && (
        <RenderBlocks blocks={layout as Parameters<typeof RenderBlocks>[0]['blocks']} />
      )}

      {post.relatedPosts && post.relatedPosts.length > 0 && (
        <div className="flex flex-col items-center gap-4 pt-8">
          <div className="container">
            <RelatedPosts
              className="mt-12 max-w-[52rem] lg:grid lg:grid-cols-subgrid col-start-1 col-span-3 grid-rows-[2fr]"
              docs={post.relatedPosts.filter((relatedPost) => typeof relatedPost === 'object')}
            />
          </div>
        </div>
      )}
    </article>
  )
}

const queryPostBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    depth: 1,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})

const queryCategoryBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'categories',
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
