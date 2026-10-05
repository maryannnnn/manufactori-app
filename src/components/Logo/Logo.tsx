import React from 'react'

import { cn } from '@/utilities/ui'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
}

export const Logo = ({ className }: Props) => {
  return (
    <span className={cn('flex min-w-0 flex-col items-start gap-1 text-current', className)}>
      <span className="text-[clamp(0.92rem,2.1vw,1.2rem)] font-semibold leading-none tracking-[0.16em] uppercase">
        Maryan Polyak
      </span>
      <span className="max-w-[17.5rem] font-mono text-[clamp(0.52rem,1.15vw,0.62rem)] leading-none tracking-[0.22em] uppercase opacity-70">
        Manufacturing Marketing Agency
      </span>
    </span>
  )
}
