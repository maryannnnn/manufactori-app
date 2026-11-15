import React from 'react'

import { RelatedArticleCards } from '@/components/RelatedArticleCards'
import { getServiceCategorySlug } from '@/utilities/serviceCatalog'
import { queryIndustrialArticlesForService } from '@/utilities/queryIndustryArticles'

type Props = {
  serviceSlug?: string | null
  siteCategories?: unknown
}

/**
 * Three Industrial article preview cards for Services pages.
 * Selection is thematic by service category, with industrial fallback.
 */
export const ServiceIndustrialArticles: React.FC<Props> = async ({
  serviceSlug,
  siteCategories,
}) => {
  const serviceCategory = getServiceCategorySlug(serviceSlug) || (serviceSlug ?? null)
  const { articles, viewAllHref } = await queryIndustrialArticlesForService({
    serviceSlug,
    serviceCategory,
    siteCategories,
  })

  return (
    <RelatedArticleCards
      articles={articles}
      heading="Related Manufacturing Articles"
      headingId="service-industrial-articles"
      viewAllHref={viewAllHref}
    />
  )
}
