'use client'

import { Link, useConfig } from '@payloadcms/ui'
import React from 'react'

export const AddCategoryGroupNavLink: React.FC = () => {
  const {
    config: {
      routes: { admin: adminRoute },
    },
  } = useConfig()

  return (
    <div className="nav-group" style={{ marginTop: '0.5rem' }}>
      <div className="nav-group__label" style={{ opacity: 0.6, fontSize: '0.75rem' }}>
        Tools
      </div>
      <Link
        className="nav__link"
        href={`${adminRoute}/add-category-group`}
        prefetch={false}
        style={{ display: 'block', padding: '0.35rem 0' }}
      >
        Add Category Group
      </Link>
    </div>
  )
}

export default AddCategoryGroupNavLink
