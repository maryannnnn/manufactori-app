import React from 'react'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { INDUSTRIES_ARCHIVE_PATH } from '@/utilities/getContentUrls'

import { HeaderClient } from './Component.client'
import { mainNavigation, type NavLink } from './navigation'

const primaryIndustryLinks = async (): Promise<NavLink[]> => {
  try {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection: 'industries',
      depth: 0,
      draft: false,
      limit: 100,
      overrideAccess: false,
      pagination: false,
      sort: 'displayOrder',
      where: {
        and: [{ _status: { equals: 'published' } }, { industryLevel: { equals: 'primary' } }],
      },
      select: { title: true, slug: true, displayOrder: true },
    })
    return result.docs.flatMap((doc) => {
      if (!doc.slug || !doc.title) return []
      return [{ label: doc.title, href: `${INDUSTRIES_ARCHIVE_PATH}/${doc.slug}` }]
    })
  } catch {
    return []
  }
}

export async function Header() {
  const links = await primaryIndustryLinks()
  const columns: NavLink[][] = []
  for (let index = 0; index < links.length; index += 3) columns.push(links.slice(index, index + 3))
  const navigation = mainNavigation.map((item) =>
    item.id === 'industries'
      ? { ...item, sections: columns.length > 0 ? columns.map((column) => ({ links: column })) : undefined }
      : item,
  )
  return <HeaderClient navigation={navigation} />
}
