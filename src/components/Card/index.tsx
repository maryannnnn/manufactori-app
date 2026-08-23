'use client'
import { cn } from '@/utilities/ui'
import useClickableCard from '@/utilities/useClickableCard'
import Link from 'next/link'
import React, { Fragment } from 'react'

import type { Media as MediaType, Post } from '@/payload-types'

import { Media } from '@/components/Media'
import { getCategoryUrl, getPostUrl } from '@/utilities/getContentUrls'

export type CardPostData = Pick<Post, 'slug' | 'categories' | 'meta' | 'title'> & {
  primary_category?: Post['primary_category'] | null
  primary_category_slug?: string | null
  previewTitle?: string | null
  previewText?: string | null
  previewImage?: MediaType | number | null
}

export const Card: React.FC<{
  alignItems?: 'center'
  className?: string
  doc?: CardPostData
  relationTo?: 'posts'
  showCategories?: boolean
  title?: string
}> = (props) => {
  const { card, link } = useClickableCard({})
  const { className, doc, relationTo, showCategories, title: titleFromProps } = props

  const {
    slug,
    categories,
    meta,
    title,
    previewTitle,
    previewText,
    previewImage,
    primary_category,
    primary_category_slug,
  } = doc || {}
  const { description, image: metaImage } = meta || {}
  const imageToUse = previewImage || metaImage
  const textToUse = previewText || description

  const hasCategories = categories && Array.isArray(categories) && categories.length > 0
  const titleToUse = titleFromProps || title
  const sanitizedDescription = textToUse?.replace(/\s/g, ' ')
  const href =
    relationTo === 'posts'
      ? getPostUrl({ slug, primary_category, primary_category_slug })
      : relationTo
        ? `/${relationTo}/${slug}`
        : null

  return (
    <article
      className={cn(
        'border border-border rounded-lg overflow-hidden bg-card',
        href && 'hover:cursor-pointer',
        className,
      )}
      ref={card.ref}
    >
      <div className="relative w-full ">
        {!imageToUse && <div className="">No image</div>}
        {imageToUse && typeof imageToUse !== 'string' && typeof imageToUse !== 'number' && (
          <Media resource={imageToUse} size="33vw" />
        )}
      </div>
      <div className="p-4">
        {showCategories && hasCategories && (
          <div className="uppercase text-sm mb-4">
            {categories?.map((category, index) => {
              if (typeof category === 'object') {
                const { title: titleFromCategory, slug: categorySlug } = category

                const categoryTitle = titleFromCategory || 'Untitled category'

                const isLast = index === categories.length - 1
                const categoryHref = categorySlug ? getCategoryUrl({ slug: categorySlug }) : null

                return (
                  <Fragment key={index}>
                    {categoryHref ? (
                      <Link className="relative z-10" href={categoryHref}>
                        {categoryTitle}
                      </Link>
                    ) : (
                      categoryTitle
                    )}
                    {!isLast && <Fragment>, &nbsp;</Fragment>}
                  </Fragment>
                )
              }

              return null
            })}
          </div>
        )}
        {titleToUse && (
          <div className="prose">
            <h3>
              {href ? (
                <Link className="not-prose" href={href} ref={link.ref}>
                  {titleToUse}
                </Link>
              ) : (
                <span className="not-prose">{titleToUse}</span>
              )}
            </h3>
          </div>
        )}
        {previewTitle && previewTitle !== titleToUse && (
          <div className="mt-2 text-sm font-medium">{previewTitle}</div>
        )}
        {sanitizedDescription && (
          <div className="mt-2">
            <p>{sanitizedDescription}</p>
          </div>
        )}
      </div>
    </article>
  )
}
