import type { AdminViewServerProps } from 'payload'

import { Gutter } from '@payloadcms/ui'
import { DefaultTemplate } from '@payloadcms/next/templates'
import { redirect } from 'next/navigation'
import React from 'react'

import { AddCategoryGroupForm } from './Form'
import { AddCategoryGroupStepNav } from './StepNav'

export default function AddCategoryGroupView(props: AdminViewServerProps) {
  const { initPageResult, params, searchParams } = props
  const { locale, permissions, req, visibleEntities } = initPageResult

  const {
    user,
    i18n,
    payload,
    payload: {
      config: {
        routes: { admin: adminRoute },
      },
    },
  } = req

  if (!user || !permissions?.canAccessAdmin) {
    redirect(`${adminRoute}/unauthorized`)
  }

  return (
    <DefaultTemplate
      i18n={i18n}
      locale={locale}
      params={params}
      payload={payload}
      permissions={permissions}
      req={req}
      searchParams={searchParams}
      user={user}
      visibleEntities={visibleEntities}
      viewType="custom"
    >
      <AddCategoryGroupStepNav />
      <Gutter>
        <h1 style={{ marginBottom: '1rem' }}>Add Category Group</h1>
        <AddCategoryGroupForm />
      </Gutter>
    </DefaultTemplate>
  )
}
