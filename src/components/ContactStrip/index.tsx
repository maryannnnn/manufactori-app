import React from 'react'

import { getTelegramUrl, getWhatsAppUrl } from '@/config/contact'
import { cn } from '@/utilities/ui'

import { contactStripCopy, type ContactStripVariant } from './copy'

type Props = {
  className?: string
  /** Wrap in the site container. Turn off when the parent already provides one. */
  contained?: boolean
  description?: string
  heading?: string
  variant?: ContactStripVariant
}

const buttonClassName =
  'inline-flex min-h-11 min-w-[9.5rem] flex-1 items-center justify-center gap-2 rounded-[2px] border border-border bg-background px-3.5 text-sm font-medium text-foreground transition-colors hover:border-foreground/40 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:flex-none'

const WhatsAppIcon: React.FC = () => (
  <svg aria-hidden className="size-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.47 14.38c-.27-.14-1.6-.79-1.85-.88-.25-.09-.43-.14-.61.14-.18.27-.7.88-.86 1.06-.16.18-.32.2-.59.07-.27-.14-1.14-.42-2.17-1.34-.8-.71-1.34-1.59-1.5-1.86-.16-.27-.02-.41.12-.55.12-.12.27-.32.41-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.61-1.47-.84-2.01-.22-.53-.44-.46-.61-.47h-.52c-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.29s.98 2.66 1.12 2.84c.14.18 1.93 2.95 4.68 4.14.65.28 1.16.45 1.56.58.66.21 1.25.18 1.72.11.53-.08 1.6-.65 1.83-1.28.23-.63.23-1.17.16-1.28-.07-.11-.25-.18-.52-.32ZM12.04 21.8h-.01a9.8 9.8 0 0 1-4.99-1.37l-.36-.21-3.71.97.99-3.62-.24-.37a9.8 9.8 0 0 1-1.5-5.22 9.83 9.83 0 0 1 9.84-9.82 9.78 9.78 0 0 1 6.96 2.88 9.76 9.76 0 0 1 2.88 6.95 9.83 9.83 0 0 1-9.86 9.81Zm8.41-18.2A11.73 11.73 0 0 0 12.03 0C5.45 0 .1 5.34.1 11.91c0 2.1.55 4.15 1.6 5.96L0 24l6.3-1.65a11.9 11.9 0 0 0 5.73 1.46h.01c6.58 0 11.93-5.35 11.93-11.92 0-3.18-1.24-6.17-3.5-8.42Z" />
  </svg>
)

const TelegramIcon: React.FC = () => (
  <svg aria-hidden className="size-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
    <path d="M21.95 2.43c-.27-.23-.66-.28-.98-.14L1.72 10.2c-.43.18-.7.6-.68 1.07.02.47.33.87.77 1.01l4.9 1.57 1.88 6.05c.13.43.5.73.95.78h.08c.4 0 .77-.22.96-.57l2.72-4.97 4.86 3.64c.18.13.4.2.61.2.18 0 .36-.04.52-.13.32-.17.53-.48.56-.84l1.9-14.2c.04-.34-.11-.68-.4-.88ZM8.2 13.16l8.96-5.52-6.7 6.9-.18 2.7-2.08-4.08Z" />
  </svg>
)

export const ContactStrip: React.FC<Props> = ({
  className,
  contained = true,
  description,
  heading,
  variant = 'default',
}) => {
  const copy = contactStripCopy[variant]
  const title = heading ?? copy.heading
  const support = description ?? copy.description
  const headingId = `contact-strip-${variant}`
  const whatsappHref = getWhatsAppUrl()
  const telegramHref = getTelegramUrl()

  const inner = (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <div className="min-w-0">
        <h2 className="text-base font-semibold tracking-tight text-foreground md:text-lg" id={headingId}>
          {title}
        </h2>
        <p className="mt-1 max-w-[52ch] text-sm leading-6 text-muted-foreground">{support}</p>
      </div>
      <div className="flex w-full flex-row flex-wrap gap-2 sm:w-auto sm:shrink-0">
        <a
          aria-label="Message on WhatsApp"
          className={buttonClassName}
          href={whatsappHref}
          rel="noopener noreferrer"
          target="_blank"
        >
          <WhatsAppIcon />
          WhatsApp
        </a>
        {telegramHref ? (
          <a
            aria-label="Message on Telegram"
            className={buttonClassName}
            href={telegramHref}
            rel="noopener noreferrer"
            target="_blank"
          >
            <TelegramIcon />
            Telegram
          </a>
        ) : (
          <span
            aria-disabled="true"
            aria-label="Telegram is not configured yet"
            className={cn(buttonClassName, 'cursor-not-allowed opacity-50')}
            title="Telegram username is not configured yet"
          >
            <TelegramIcon />
            Telegram
          </span>
        )}
      </div>
    </div>
  )

  if (!contained) {
    return (
      <aside
        aria-labelledby={headingId}
        className={cn('rounded-[2px] border border-border bg-card px-4 py-4 sm:px-5', className)}
      >
        {inner}
      </aside>
    )
  }

  return (
    <aside aria-labelledby={headingId} className={cn('border-b border-border bg-muted/40', className)}>
      <div className="container py-5 md:py-6">{inner}</div>
    </aside>
  )
}
