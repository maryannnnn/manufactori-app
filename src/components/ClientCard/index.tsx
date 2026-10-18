import Link from 'next/link'
import React from 'react'

import type { ClientCardData } from '@/utilities/getClientList'

import { Media } from '@/components/Media'

type Props = {
  client: ClientCardData
}

const monogram = (name: string): string => {
  const words = name.split(/\s+/).filter(Boolean)
  if (words.length >= 2) return `${words[0]?.[0] ?? ''}${words[1]?.[0] ?? ''}`.toUpperCase()
  return name.slice(0, 2).toUpperCase()
}

export const ClientCard: React.FC<Props> = ({ client }) => {
  const image = client.logo || client.fallbackImage

  return (
    <Link
      className="group flex h-full flex-col gap-3 rounded-[2px] border border-border bg-card p-4 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
      href={client.href}
    >
      <div className="flex h-14 items-center justify-center">
        {image ? (
          <Media
            className="flex h-full w-full items-center justify-center"
            imgClassName="h-auto max-h-14 w-auto max-w-full object-contain"
            resource={image}
            size="(max-width: 640px) 40vw, 180px"
          />
        ) : (
          <span
            aria-hidden
            className="font-mono text-sm tracking-[0.14em] text-muted-foreground"
          >
            {monogram(client.name)}
          </span>
        )}
      </div>

      <h2 className="line-clamp-2 min-h-10 text-sm leading-5 font-semibold tracking-tight break-words text-foreground">
        {client.name}
      </h2>

      <p className="line-clamp-2 min-h-10 text-sm leading-5 text-muted-foreground">
        {client.description}
      </p>
    </Link>
  )
}
