import React from 'react'

type Props = {
  data: Record<string, unknown> | null
}

export const JsonLd: React.FC<Props> = ({ data }) => {
  if (!data) return null

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
