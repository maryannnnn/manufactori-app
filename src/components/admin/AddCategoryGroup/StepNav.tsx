'use client'

import { SetStepNav } from '@payloadcms/ui'
import React from 'react'

export const AddCategoryGroupStepNav: React.FC = () => {
  return (
    <SetStepNav
      nav={[
        {
          label: 'Add Category Group',
        },
      ]}
    />
  )
}
