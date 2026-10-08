import { Phone } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import { contactHref } from '../navigation'

type Props = {
  className?: string
}

export const PhoneLink: React.FC<Props> = ({ className }) => {
  return (
    <Link
      aria-label="Contact"
      className={
        className ??
        'inline-flex size-11 items-center justify-center text-main transition-colors hover:text-link focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring'
      }
      href={contactHref}
    >
      <Phone aria-hidden className="size-5" />
    </Link>
  )
}
