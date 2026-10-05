import type { NextConfig } from 'next'

export const redirects: NextConfig['redirects'] = async () => {
  const internetExplorerRedirect = {
    destination: '/ie-incompatible.html',
    has: [
      {
        type: 'header' as const,
        key: 'user-agent',
        value: '(.*Trident.*)', // all ie browsers
      },
    ],
    permanent: false,
    source: '/:path((?!ie-incompatible.html$).*)', // all pages except the incompatibility page
  }

  const legacyBlogCategoryRedirect = {
    source: '/blog/categories/:slug',
    destination: '/blog/category/:slug',
    permanent: true,
  }

  const legacyPostsArchiveRedirect = {
    source: '/posts',
    destination: '/blog',
    permanent: true,
  }

  const legacyPostsPaginationRedirect = {
    source: '/posts/page/:pageNumber',
    destination: '/blog?page=:pageNumber',
    permanent: true,
  }

  return [
    internetExplorerRedirect,
    legacyBlogCategoryRedirect,
    legacyPostsArchiveRedirect,
    legacyPostsPaginationRedirect,
  ]
}
