import { formatDateTime } from 'src/utilities/formatDateTime'
import React from 'react'

import type { Post } from '@/payload-types'

import { Media } from '@/components/Media'
import { formatAuthors } from '@/utilities/formatAuthors'
import { getCategoryUrl } from '@/utilities/getContentUrls'
import Link from 'next/link'

export const PostHero: React.FC<{
  post: Post
}> = ({ post }) => {
  const { categories, hero, populatedAuthors, publishedAt, title, postLongTitle } = post

  const hasAuthors =
    populatedAuthors && populatedAuthors.length > 0 && formatAuthors(populatedAuthors) !== ''

  const heading = postLongTitle || title
  const heroMedia = hero?.media && typeof hero.media !== 'string' ? hero.media : null

  return (
    <div className="relative -mt-[10.4rem] flex items-end">
      <div className="container z-10 relative lg:grid lg:grid-cols-[1fr_48rem_1fr] text-white pb-8">
        <div className="col-start-1 col-span-1 md:col-start-2 md:col-span-2">
          <div className="uppercase text-sm mb-6">
            {categories?.map((category, index) => {
              if (typeof category === 'object' && category !== null) {
                const { title: categoryTitle, slug: categorySlug } = category

                const titleToUse = categoryTitle || 'Untitled category'

                const isLast = index === categories.length - 1
                const categoryUrl = getCategoryUrl({ slug: categorySlug })

                return (
                  <React.Fragment key={index}>
                    {categoryUrl ? (
                      <Link className="underline-offset-4 hover:underline" href={categoryUrl}>
                        {titleToUse}
                      </Link>
                    ) : (
                      titleToUse
                    )}
                    {!isLast && <React.Fragment>, &nbsp;</React.Fragment>}
                  </React.Fragment>
                )
              }
              return null
            })}
          </div>

          <div className="">
            <h1 className="mb-6 text-3xl md:text-5xl lg:text-6xl">{heading}</h1>
          </div>

          <div className="flex flex-col md:flex-row gap-4 md:gap-16">
            {hasAuthors && (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <p className="text-sm">Author</p>

                  <p>{formatAuthors(populatedAuthors)}</p>
                </div>
              </div>
            )}
            {publishedAt && (
              <div className="flex flex-col gap-1">
                <p className="text-sm">Date Published</p>

                <time dateTime={publishedAt}>{formatDateTime(publishedAt)}</time>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="min-h-[80vh] select-none">
        {heroMedia && typeof heroMedia === 'object' && (
          <Media fill priority imgClassName="-z-10 object-cover" resource={heroMedia} />
        )}
        <div className="absolute pointer-events-none left-0 bottom-0 w-full h-1/2 bg-linear-to-t from-black to-transparent" />
      </div>
    </div>
  )
}
