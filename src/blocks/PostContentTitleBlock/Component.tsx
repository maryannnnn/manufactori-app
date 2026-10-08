import React from 'react'

type Props = {
  postContentTitle?: string | null
}

export const PostContentTitleBlock: React.FC<Props> = ({ postContentTitle }) => {
  if (!postContentTitle) return null

  return (
    <div className="container">
      <h2 className="text-2xl font-semibold tracking-tight">{postContentTitle}</h2>
    </div>
  )
}
